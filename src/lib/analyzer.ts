import { AuditReport, CtaMatch, ExtractedPageContent, Finding, FindingType, Industry, RecommendationTarget, Severity, VerificationStatus } from '../types/audit';
import { extractLandingPageContent, normalizeText } from './extractor';
import { calculateMessageMatchScore } from './scorer';
import { searchSegmentEvidenceForClaim, verifyAllFindings } from './verifier';

export interface AuditInput {
  adId?: string;
  adHeadline: string;
  adDescription: string;
  adCta?: string;
  industry?: Industry;
  landingPageUrl: string;
  snapshotHtml: string;
}

/**
 * Extracts numbers, prices, percentages, timelines from text for deterministic comparison.
 */
function extractQuantitativeClaims(text: string): {
  prices: string[];
  percentages: string[];
  timelines: string[];
} {
  const prices = (text.match(/\$\d+(?:,\d{3})*(?:\.\d{2})?/g) || []).map((p) => p.toLowerCase());
  const percentages = (text.match(/\b\d+(?:\.\d+)?%\b/g) || []).map((p) => p.toLowerCase());
  const timelines = (text.match(/\b(?:\d+\s*(?:day|days|hour|hours|minute|minutes|month|months|week|weeks))\b/gi) || []).map((t) => t.toLowerCase());

  return { prices, percentages, timelines };
}

/**
 * Deterministic semantic analysis engine.
 * Audits claims, detects price/offer discrepancies, verifies CTA alignment,
 * and passes all evidence quotes through deterministic verification.
 */
export function analyzeDeterministic(input: AuditInput): AuditReport {
  const adId = input.adId || `AD-${Date.now().toString().slice(-4)}`;
  const pageContent = extractLandingPageContent(input.snapshotHtml, input.landingPageUrl);

  const findings: Finding[] = [];
  const limitations = [...pageContent.limitations];

  // If extraction failed or yielded no segments
  if (pageContent.segments.length === 0) {
    limitations.push('Unable to audit message match because zero content could be extracted from the landing page.');
    const emptyCtaMatch: CtaMatch = {
      status: 'unknown',
      adcta: input.adCta || null,
      landingpagecta: null,
      evidencequote: null,
      evidencelocation: null,
      explanation: 'No landing page elements were available for CTA inspection.',
    };

    const scoreResult = calculateMessageMatchScore([], emptyCtaMatch, 0);

    return {
      adid: adId,
      adHeadline: input.adHeadline,
      adDescription: input.adDescription,
      adCta: input.adCta,
      industry: input.industry,
      landingpageurl: input.landingPageUrl,
      overallscore: scoreResult.overallScore,
      classification: scoreResult.classification,
      summary: scoreResult.summaryExplanation,
      breakdown: scoreResult.breakdown,
      findings: [],
      ctamatch: emptyCtaMatch,
      limitations,
      metadata: {
        auditedAt: new Date().toISOString(),
        engine: 'deterministic-semantic',
        totalSegmentsInspected: 0,
        verifiedQuoteCount: 0,
        rejectedQuoteCount: 0,
        verifiedRatePct: 0,
        isOfflineSnapshot: true,
      },
    };
  }

  const adFullText = `${input.adHeadline} ${input.adDescription}`.trim();
  const pageFullLower = pageContent.rawText.toLowerCase();

  const adQuant = extractQuantitativeClaims(adFullText);
  const pageQuant = extractQuantitativeClaims(pageContent.rawText);

  // 1. Quantitative Discrepancy Checks (Prices, Percentages, Timelines)
  // Check advertised price points
  for (const adPrice of adQuant.prices) {
    const isDirectlyOnPage = pageQuant.prices.includes(adPrice);
    if (!isDirectlyOnPage) {
      // Look for competing prices in pricing or hero sections
      const pricingSegments = pageContent.segments.filter((s) => s.section === 'pricing' || s.section === 'hero' || s.text.includes('$'));
      const foundCompetingPrice = pricingSegments.find((s) => /\$\d+/.test(s.text) && !s.text.includes(adPrice));

      findings.push({
        id: `fnd-price-${findings.length + 1}`,
        type: 'offer_mismatch',
        severity: 'high',
        adclaim: `Advertised price point: ${adPrice}`,
        explanation: foundCompetingPrice
          ? `The advertisement promotes a price of ${adPrice}, but the landing page displays conflicting pricing (${foundCompetingPrice.text.substring(0, 60)}...).`
          : `The advertisement emphasizes ${adPrice}, but this specific price point was not substantiated in the inspected page content.`,
        evidencequote: foundCompetingPrice ? foundCompetingPrice.text : null,
        evidencelocation: foundCompetingPrice ? foundCompetingPrice.section : null,
        verificationstatus: foundCompetingPrice ? 'contradicted' : 'not_found',
        recommendedfix: foundCompetingPrice
          ? `Update the ad to reflect the actual pricing shown on the landing page, or create a targeted landing page honoring the ${adPrice} offer.`
          : `Ensure the advertised ${adPrice} price is clearly highlighted in the hero or pricing table.`,
        target: 'both',
      });
    }
  }

  // Check advertised percentages (rates, discounts, APY, cashback)
  for (const adPct of adQuant.percentages) {
    const isDirectlyOnPage = pageQuant.percentages.includes(adPct);
    if (!isDirectlyOnPage) {
      const competingSeg = pageContent.segments.find((s) => s.text.includes('%') && !s.text.includes(adPct));
      findings.push({
        id: `fnd-pct-${findings.length + 1}`,
        type: 'offer_mismatch',
        severity: 'high',
        adclaim: `Promoted rate/discount: ${adPct}`,
        explanation: competingSeg
          ? `Ad highlights ${adPct}, but the landing page specifies a different percentage: "${competingSeg.text.substring(0, 75)}...".`
          : `The advertised rate of ${adPct} was not substantiated anywhere on the destination page.`,
        evidencequote: competingSeg ? competingSeg.text : null,
        evidencelocation: competingSeg ? competingSeg.section : null,
        verificationstatus: competingSeg ? 'contradicted' : 'not_found',
        recommendedfix: `Reconcile the advertised percentage (${adPct}) with the active offer on the page.`,
        target: 'ad',
      });
    }
  }

  // Check timelines (e.g., "same day", "24 hours", "14 days", "60 seconds")
  const adHasSameDay = /same[\s-]day|24[\s-]hours|instant/i.test(adFullText);
  if (adHasSameDay) {
    const pageApprovalTimeline = pageContent.segments.find((s) => /approval|review|underwriting|decision|turnaround|days/i.test(s.text));
    const pageHasSameDay = /same[\s-]day|instant|24[\s-]hours/i.test(pageFullLower);

    if (!pageHasSameDay) {
      const contradictsTimeline = pageApprovalTimeline && /\d+\s*(?:to\s*\d+)?\s*business\s*days/i.test(pageApprovalTimeline.text);
      findings.push({
        id: `fnd-timeline-${findings.length + 1}`,
        type: contradictsTimeline ? 'contradictory_messaging' : 'missing_promise',
        severity: 'high',
        adclaim: 'Fast / Same-day approval or turnaround',
        explanation: contradictsTimeline
          ? `The ad promises same-day or instant turnaround, but the landing page explicitly specifies a longer timeframe: "${pageApprovalTimeline.text.substring(0, 80)}...".`
          : 'The ad promises same-day turnaround, but the inspected landing-page content does not substantiate this timeline.',
        evidencequote: pageApprovalTimeline ? pageApprovalTimeline.text : null,
        evidencelocation: pageApprovalTimeline ? pageApprovalTimeline.section : null,
        verificationstatus: contradictsTimeline ? 'contradicted' : 'not_found',
        recommendedfix: 'Add a substantiated approval-timeline statement near the hero section or revise the ad to reflect the actual processing timeframe.',
        target: 'both',
      });
    }
  }

  // 2. Specific Feature / Promise Keywords Checks
  const thematicChecks = [
    {
      keyword: 'free trial',
      pattern: /free\s*trial|14-day\s*free|30-day\s*free/i,
      claim: 'Free trial without upfront commitment',
      fix: 'Display the free trial duration prominently next to the primary CTA.',
    },
    {
      keyword: 'money back guarantee',
      pattern: /money[\s-]back\s*guarantee|risk[\s-]free|satisfaction\s*guarantee/i,
      claim: 'Money-back guarantee / risk-free trial',
      fix: 'Clarify the guarantee conditions and return terms on the product page.',
    },
    {
      keyword: 'unlimited',
      pattern: /\bunlimited\b/i,
      claim: 'Unlimited usage or access without caps',
      fix: 'Remove "unlimited" from the ad headline if the free or entry tier is subject to volume caps.',
    },
    {
      keyword: 'waterproof',
      pattern: /\bwaterproof\b/i,
      claim: '100% Waterproof construction',
      fix: 'Clarify water resistance rating or remove waterproof claim from dry-condition products.',
    },
    {
      keyword: 'jira',
      pattern: /\bjira\b/i,
      claim: 'Native Atlassian Jira integration',
      fix: 'Do not advertise Jira support if the integration is currently in private beta or roadmap.',
    },
    {
      keyword: '99.999%',
      pattern: /99\.999%/i,
      claim: 'Five-nines (99.999%) uptime SLA',
      fix: 'Harmonize the SLA guarantee in ad copy with the published SLA agreement.',
    },
    {
      keyword: 'ai screening',
      pattern: /ai\s*(?:resume\s*)?screening|screen\s*500\s*resumes/i,
      claim: 'AI automated candidate resume screening',
      fix: 'Direct ad traffic to the specific AI product page rather than general recruitment software.',
    },
    {
      keyword: 'bonus',
      pattern: /\$500\s*(?:cash\s*)?bonus|\$10,000\s*(?:in\s*)?silver/i,
      claim: 'High promotional cash/silver bonus',
      fix: 'Bring bonus qualification terms out of the footer into prominent hero or feature copy.',
    },
  ];

  for (const check of thematicChecks) {
    if (check.pattern.test(adFullText)) {
      const pageSupports = check.pattern.test(pageFullLower);
      if (!pageSupports) {
        // Look for partial or contradictory evidence
        const evidence = searchSegmentEvidenceForClaim(check.claim, pageContent.segments);
        findings.push({
          id: `fnd-feat-${findings.length + 1}`,
          type: 'missing_feature_benefit',
          severity: 'medium',
          adclaim: check.claim,
          explanation: `The advertisement emphasizes ${check.claim}, but this feature or benefit is absent or unsubstantiated in the inspected page content.`,
          evidencequote: evidence ? evidence.quote : null,
          evidencelocation: evidence ? evidence.location : null,
          verificationstatus: evidence ? 'verified' : 'not_found',
          recommendedfix: check.fix,
          target: 'landing_page',
        });
      }
    }
  }

  // 3. Footer-Only Placement Detection (Position Mismatch)
  // If an ad claims a major feature or incentive, and it exists ONLY in the footer
  const adIncentives = ['bonus', 'guarantee', 'disclaimer', 'apr', 'fee', 'trial'];
  for (const inc of adIncentives) {
    if (new RegExp(`\\b${inc}\\b`, 'i').test(adFullText)) {
      const heroOrBodyHasIt = pageContent.segments.some(
        (s) => s.section !== 'footer' && new RegExp(`\\b${inc}\\b`, 'i').test(s.text)
      );
      const footerHasIt = pageContent.segments.some(
        (s) => s.section === 'footer' && new RegExp(`\\b${inc}\\b`, 'i').test(s.text)
      );

      if (!heroOrBodyHasIt && footerHasIt) {
        const footerSeg = pageContent.segments.find(
          (s) => s.section === 'footer' && new RegExp(`\\b${inc}\\b`, 'i').test(s.text)
        );
        // Avoid duplicate findings if already added
        const alreadyAdded = findings.some((f) => f.type === 'position_mismatch' && f.adclaim.toLowerCase().includes(inc));
        if (!alreadyAdded && footerSeg) {
          findings.push({
            id: `fnd-pos-${findings.length + 1}`,
            type: 'position_mismatch',
            severity: 'medium',
            adclaim: `Promoted ${inc} incentive or qualification`,
            explanation: `Supporting terms for the advertised ${inc} appear exclusively in a low-visibility footer section rather than an above-the-fold or hero section.`,
            evidencequote: footerSeg.text,
            evidencelocation: 'footer',
            verificationstatus: 'verified',
            recommendedfix: `Elevate the key ${inc} value proposition and qualifying terms to the hero or body area.`,
            target: 'landing_page',
          });
        }
      }
    }
  }

  // 4. Call-to-Action (CTA) Alignment Analysis
  let ctaMatch: CtaMatch;
  const adCtaClean = input.adCta ? normalizeText(input.adCta) : null;
  const primaryPageCta = pageContent.ctas[0] || null;

  if (!adCtaClean) {
    ctaMatch = {
      status: primaryPageCta ? 'matched' : 'unknown',
      adcta: null,
      landingpagecta: primaryPageCta ? primaryPageCta.text : null,
      evidencequote: primaryPageCta ? primaryPageCta.text : null,
      evidencelocation: primaryPageCta ? primaryPageCta.section : null,
      explanation: primaryPageCta
        ? `No specific ad CTA provided; landing page offers primary CTA: "${primaryPageCta.text}".`
        : 'No CTAs identified on ad or landing page.',
    };
  } else if (!primaryPageCta) {
    ctaMatch = {
      status: 'unknown',
      adcta: adCtaClean,
      landingpagecta: null,
      evidencequote: null,
      evidencelocation: null,
      explanation: `Ad requests "${adCtaClean}", but no primary CTA buttons or links were extracted from the landing page.`,
    };
  } else {
    // Compare intent of ad CTA vs landing page CTA
    const adCtaLow = adCtaClean.toLowerCase();
    const pageCtaLow = primaryPageCta.text.toLowerCase();

    const isDirectMatch = adCtaLow === pageCtaLow || pageCtaLow.includes(adCtaLow) || adCtaLow.includes(pageCtaLow);

    // Intent categorizations
    const isAdFreeTrial = /trial|free\s*start|try/i.test(adCtaLow);
    const isPageDemo = /demo|schedule|book|contact\s*sales/i.test(pageCtaLow);
    const isAdDirectPurchase = /buy|order|shop|get/i.test(adCtaLow);
    const isPageQuote = /quote|estimate|consultation/i.test(pageCtaLow);

    const hasIntentClash = (isAdFreeTrial && isPageDemo) || (isAdDirectPurchase && isPageQuote);

    if (isDirectMatch && !hasIntentClash) {
      ctaMatch = {
        status: 'matched',
        adcta: adCtaClean,
        landingpagecta: primaryPageCta.text,
        evidencequote: primaryPageCta.text,
        evidencelocation: primaryPageCta.section,
        explanation: `Strong CTA alignment: Ad CTA "${adCtaClean}" matches landing page action "${primaryPageCta.text}".`,
      };
    } else if (hasIntentClash) {
      ctaMatch = {
        status: 'mismatch',
        adcta: adCtaClean,
        landingpagecta: primaryPageCta.text,
        evidencequote: primaryPageCta.text,
        evidencelocation: primaryPageCta.section,
        explanation: `CTA intent mismatch: Ad sets an expectation for "${adCtaClean}" (immediate self-serve), whereas the landing page directs to "${primaryPageCta.text}" (high-friction sales contact).`,
      };
      findings.push({
        id: `fnd-cta-${findings.length + 1}`,
        type: 'cta_mismatch',
        severity: 'high',
        adclaim: `Call to action: "${adCtaClean}"`,
        explanation: `The ad conversion action ("${adCtaClean}") conflicts with the landing page primary conversion goal ("${primaryPageCta.text}").`,
        evidencequote: primaryPageCta.text,
        evidencelocation: primaryPageCta.section,
        verificationstatus: 'verified',
        recommendedfix: `Align conversion actions: if the landing page requires "${primaryPageCta.text}", adjust the ad CTA to set honest expectations.`,
        target: 'both',
      });
    } else {
      ctaMatch = {
        status: 'matched',
        adcta: adCtaClean,
        landingpagecta: primaryPageCta.text,
        evidencequote: primaryPageCta.text,
        evidencelocation: primaryPageCta.section,
        explanation: `Acceptable CTA consistency: Ad suggests "${adCtaClean}" and landing page provides "${primaryPageCta.text}".`,
      };
    }
  }

  // 5. Run Deterministic Evidence Grounding & Verification
  const verification = verifyAllFindings(findings, pageContent);

  // 6. Calculate Message Match Score
  const scoreResult = calculateMessageMatchScore(
    verification.verifiedFindings,
    ctaMatch,
    pageContent.segments.length
  );

  return {
    adid: adId,
    adHeadline: input.adHeadline,
    adDescription: input.adDescription,
    adCta: input.adCta,
    industry: input.industry,
    landingpageurl: input.landingPageUrl,
    overallscore: scoreResult.overallScore,
    classification: scoreResult.classification,
    summary: scoreResult.summaryExplanation,
    breakdown: scoreResult.breakdown,
    findings: verification.verifiedFindings,
    ctamatch: ctaMatch,
    limitations,
    metadata: {
      auditedAt: new Date().toISOString(),
      engine: 'deterministic-semantic',
      totalSegmentsInspected: pageContent.segments.length,
      verifiedQuoteCount: verification.verifiedQuoteCount,
      rejectedQuoteCount: verification.rejectedQuoteCount,
      verifiedRatePct: verification.verificationRatePct,
      isOfflineSnapshot: true,
    },
  };
}
