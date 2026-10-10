import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { SAMPLE_DATASET } from './src/data/sampleDataset.ts';
import { extractLandingPageContent } from './src/lib/extractor.ts';
import { analyzeDeterministic } from './src/lib/analyzer.ts';
import { verifyAllFindings } from './src/lib/verifier.ts';
import { calculateMessageMatchScore } from './src/lib/scorer.ts';
import { runAllTests } from './src/lib/testRunner.ts';
import { AuditReport, CtaMatch, Finding } from './src/types/audit.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Get sample dataset
app.get('/api/dataset', (req, res) => {
  res.json({
    count: SAMPLE_DATASET.length,
    dataset: SAMPLE_DATASET,
  });
});

// 2. Run automated test suite
app.get('/api/run-tests', async (req, res) => {
  try {
    const suiteResult = await runAllTests();
    res.json(suiteResult);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// 3. Optional live URL fetching
app.post('/api/fetch-live', async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Valid URL is required.' });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `HTTP ${response.status} ${response.statusText}`,
        status: 'failed',
      });
    }

    const html = await response.text();
    const extracted = extractLandingPageContent(html, url);

    res.json({
      status: 'success',
      url,
      html,
      extractedSegmentsCount: extracted.segments.length,
      title: extracted.title,
      limitations: extracted.limitations,
    });
  } catch (err: any) {
    const isTimeout = err.name === 'AbortError';
    res.json({
      status: 'failed',
      url,
      error: isTimeout ? 'Request timed out after 9 seconds.' : String(err.message || err),
      limitations: ['Live fetching failed or blocked by server security/bot policy.'],
    });
  }
});

// 4. Single Message Match Audit
app.post('/api/audit', async (req, res) => {
  const {
    adHeadline,
    adDescription,
    adCta,
    industry,
    landingPageUrl,
    snapshotHtml,
    useAi = false,
  } = req.body;

  if (!adHeadline || !snapshotHtml) {
    return res.status(400).json({ error: 'adHeadline and snapshotHtml are required.' });
  }

  const adId = req.body.adId || `AD-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  // If useAi requested and aiClient is initialized, run Gemini structured extraction
  if (useAi && aiClient) {
    try {
      const pageContent = extractLandingPageContent(snapshotHtml, landingPageUrl || 'https://example.com');

      if (pageContent.segments.length === 0) {
        const fallback = analyzeDeterministic({
          adId,
          adHeadline,
          adDescription: adDescription || '',
          adCta,
          industry,
          landingPageUrl: landingPageUrl || 'https://example.com',
          snapshotHtml,
        });
        return res.json(fallback);
      }

      // Compact segments for prompt context
      const segmentSample = pageContent.segments
        .slice(0, 45)
        .map((s) => `[${s.section.toUpperCase()}] "${s.text}"`)
        .join('\n');

      const prompt = `AUDIT OBJECTIVE: Compare the following advertising claims against the extracted landing page segments.

AD INFORMATION:
- Headline: "${adHeadline}"
- Description: "${adDescription || 'None'}"
- Call-To-Action (CTA): "${adCta || 'None'}"
- Industry: "${industry || 'General'}"

LANDING PAGE EXTRACTED CONTENT:
${segmentSample}

REQUIREMENTS:
1. Identify any missing promises, unsupported claims, offer/pricing mismatches, contradictory messaging, CTA mismatches, or position mismatches.
2. EVIDENCE GROUNDING IS MANDATORY: For every finding where a page statement exists, provide the EXACT verbatim quote in "evidencequote". If no supporting statement exists on the page, set "evidencequote" to null.
3. NEVER fabricate page content or quotes.
4. Classify CTA match status between ad and page.`;

      const aiResponse = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a rigorous Ad-to-Landing-Page Message Match Auditor. Your priority is evidence grounding. Never invent quotations.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              findings: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: {
                      type: Type.STRING,
                      description: 'missing_promise, missing_feature_benefit, unsupported_claim, contradictory_messaging, offer_mismatch, cta_mismatch, position_mismatch, or missing_context',
                    },
                    severity: {
                      type: Type.STRING,
                      description: 'high, medium, or low',
                    },
                    adclaim: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    evidencequote: {
                      type: Type.STRING,
                      description: 'Exact verbatim quote from inspected page text, or null if absent.',
                    },
                    evidencelocation: {
                      type: Type.STRING,
                      description: 'hero, pricing, features, faq, footer, or body',
                    },
                    recommendedfix: { type: Type.STRING },
                    target: {
                      type: Type.STRING,
                      description: 'ad, landing_page, or both',
                    },
                  },
                  required: ['type', 'severity', 'adclaim', 'explanation', 'recommendedfix'],
                },
              },
              ctamatch: {
                type: Type.OBJECT,
                properties: {
                  status: {
                    type: Type.STRING,
                    description: 'matched, mismatch, or unknown',
                  },
                  adcta: { type: Type.STRING },
                  landingpagecta: { type: Type.STRING },
                  evidencequote: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['status', 'explanation'],
              },
            },
            required: ['findings', 'ctamatch'],
          },
        },
      });

      const responseText = aiResponse.text?.trim() || '{}';
      let parsedJson: any;
      try {
        parsedJson = JSON.parse(responseText);
      } catch (parseErr) {
        // Safe JSON fallback if parsing fails
        const deterministicResult = analyzeDeterministic({
          adId,
          adHeadline,
          adDescription: adDescription || '',
          adCta,
          industry,
          landingPageUrl: landingPageUrl || 'https://example.com',
          snapshotHtml,
        });
        return res.json(deterministicResult);
      }

      // Format model findings
      const rawFindings: Finding[] = (parsedJson.findings || []).map((f: any, idx: number) => ({
        id: `fnd-ai-${idx + 1}`,
        type: f.type || 'unsupported_claim',
        severity: f.severity || 'medium',
        adclaim: f.adclaim || adHeadline,
        explanation: f.explanation || '',
        evidencequote: f.evidencequote || null,
        evidencelocation: f.evidencelocation || null,
        verificationstatus: f.evidencequote ? 'verified' : 'not_found',
        recommendedfix: f.recommendedfix || 'Reconcile ad and landing page claims.',
        target: f.target || 'both',
      }));

      // DETERMINISTIC EVIDENCE VERIFICATION:
      // Verify every quote returned by the model against the raw DOM segments!
      const verification = verifyAllFindings(rawFindings, pageContent);

      const ctaMatch: CtaMatch = {
        status: parsedJson.ctamatch?.status || 'unknown',
        adcta: adCta || parsedJson.ctamatch?.adcta || null,
        landingpagecta: parsedJson.ctamatch?.landingpagecta || (pageContent.ctas[0]?.text || null),
        evidencequote: parsedJson.ctamatch?.evidencequote || null,
        evidencelocation: (pageContent.ctas[0]?.section as any) || null,
        explanation: parsedJson.ctamatch?.explanation || '',
      };

      const scoreResult = calculateMessageMatchScore(
        verification.verifiedFindings,
        ctaMatch,
        pageContent.segments.length
      );

      const report: AuditReport = {
        adid: adId,
        adHeadline,
        adDescription: adDescription || '',
        adCta,
        industry,
        landingpageurl: landingPageUrl || 'https://example.com',
        overallscore: scoreResult.overallScore,
        classification: scoreResult.classification,
        summary: scoreResult.summaryExplanation,
        breakdown: scoreResult.breakdown,
        findings: verification.verifiedFindings,
        ctamatch: ctaMatch,
        limitations: pageContent.limitations,
        metadata: {
          auditedAt: new Date().toISOString(),
          engine: 'gemini-3.8-flash',
          totalSegmentsInspected: pageContent.segments.length,
          verifiedQuoteCount: verification.verifiedQuoteCount,
          rejectedQuoteCount: verification.rejectedQuoteCount,
          verifiedRatePct: verification.verificationRatePct,
          isOfflineSnapshot: true,
        },
      };

      return res.json(report);
    } catch (aiErr) {
      console.warn('Gemini AI audit error, falling back to deterministic engine:', aiErr);
      const fallbackReport = analyzeDeterministic({
        adId,
        adHeadline,
        adDescription: adDescription || '',
        adCta,
        industry,
        landingPageUrl: landingPageUrl || 'https://example.com',
        snapshotHtml,
      });
      return res.json(fallbackReport);
    }
  }

  // Deterministic Offline Engine (Default & Resilient)
  const report = analyzeDeterministic({
    adId,
    adHeadline,
    adDescription: adDescription || '',
    adCta,
    industry,
    landingPageUrl: landingPageUrl || 'https://example.com',
    snapshotHtml,
  });

  res.json(report);
});

// 5. Batch Audit
app.post('/api/batch-audit', async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'items array is required.' });
  }

  const reports: AuditReport[] = [];

  for (const item of items) {
    try {
      const report = analyzeDeterministic({
        adId: item.id || `AD-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        adHeadline: item.adHeadline || '',
        adDescription: item.adDescription || '',
        adCta: item.adCta,
        industry: item.industry,
        landingPageUrl: item.landingPageUrl || 'https://example.com',
        snapshotHtml: item.snapshotHtml || '',
      });
      reports.push(report);
    } catch (err) {
      console.error('Batch item error:', err);
    }
  }

  res.json({
    totalProcessed: reports.length,
    reports,
  });
});

// -------------------------------------------------------------
// Vite Server Integration
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Auditor full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
