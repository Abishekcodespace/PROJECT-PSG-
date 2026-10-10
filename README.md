# Ad-to-Landing-Page Message Match Auditor (PS-03)

An AI-powered Ad-to-Landing-Page Message Match Auditor that extracts offline snapshot content, validates advertising promises, deterministically verifies evidence quotations, identifies claim mismatches, and computes an objective message-match score (0-100).

---

## 1. Problem Statement

An advertisement promises same-day approval or a $19/month rate, but the landing page fails to substantiate approval times or prices the service at $49/month. A visitor clicks the ad, pays the acquisition cost, encounters a broken promise, and bounces without converting.

This system detects discrepancies between ads and landing pages before they cause wasted ad spend and lost conversions, prioritizing high-impact issues such as misleading promises, pricing contradictions, unsupported financial claims, and conversion path friction.

---

## 2. Core Architectural Principles & Invariants

1. **Evidence Grounding (Non-Negotiable)**:
   - Every reported finding includes an exact, verbatim quotation from the extracted landing-page text.
   - Quotations are verified by a deterministic algorithm against raw DOM text before returning.
   - If a language model fabricates or hallucinates a quotation not present in the page text, the quotation is **deterministically rejected** and converted to `null` with a verification warning.
   - When a claim is absent from the page, the system marks `verificationstatus: "not_found"` with a `null` quotation rather than inventing evidence.

2. **Position & Information Hierarchy Awareness**:
   - The DOM extractor categorizes content into hierarchical sections: `hero`, `features`, `pricing`, `faq`, `footer`, and `body`.
   - Supporting evidence buried solely in a legal footer (e.g. an APR disclaimer or a $500 bonus restriction) is flagged as a `position_mismatch` ("Supporting evidence found only in footer rather than above-the-fold").

3. **Offline-First Capability**:
   - The core analysis pipeline executes completely offline using pre-rendered HTML snapshots.
   - Includes a deterministic semantic extraction and comparison engine that runs with zero network access or API keys.
   - Hybrid mode integrates Gemini `gemini-3.8-flash` with strict structured output (`responseSchema`) and deterministic verification passes.

4. **Documented Deterministic Scoring Rubric (0 to 100)**:
   - **Promise & Claim Alignment (30% weight)**: Penalized for missing core promises (-35 pts) and contradictory messaging (-40 pts).
   - **Offer & Pricing Consistency (25% weight)**: Penalized for price/rate discrepancies (-55 pts) and undisclosed conditions (-25 pts).
   - **Feature & Benefit Substantiation (20% weight)**: Penalized for advertised features missing from copy (-35 pts).
   - **Call-to-Action Alignment (15% weight)**: Evaluates friction differences (e.g. self-serve Free Trial vs high-friction Schedule Demo).
   - **Hierarchy & Visibility (10% weight)**: Penalized for footer-only evidence relegation (-40 pts).
   - **Classification Scale**:
     - `85 - 100`: Excellent
     - `70 - 84`: Good
     - `50 - 69`: Needs Improvement
     - `0 - 49`: Poor

---

## 3. Ground Truth Dataset (60 Real-World Benchmark Pairs)

The system includes 60 preloaded cases across 3 industries:
- **Financial Services (20 cases)**: Personal loans, mortgage refinance rates, business checking bonuses, crypto IRAs, credit cards, auto loans, debt settlement, gold IRAs.
- **SaaS Software (20 cases)**: CRMs, enterprise backups, Git velocity metrics, e-signature tools, ETL row tiers, SOC 2 Type II readiness, helpdesks, PostgreSQL monitoring.
- **Consumer E-Commerce (20 cases)**: Hybrid mattresses, waterproof running shoes, Japanese chef knives, coffee subscriptions, ANC headphones, standing desks, sonic toothbrushes.

---

## 4. Verification Test Suite (12 Evaluation Scenarios)

The test suite covers all 12 evaluation criteria specified in Section 8:
1. `TC-01`: Ad promise explicitly supported by hero section.
2. `TC-02`: Ad promise absent from entire inspected page.
3. `TC-03`: Promise supported only in the footer (Position Mismatch).
4. `TC-04`: Landing page contradicts advertised price or offer.
5. `TC-05`: CTA in ad differs from landing-page CTA (Intent Friction).
6. `TC-06`: Model generates a quotation that does not exist in the page (Deterministic Rejection of Hallucinations).
7. `TC-07`: Landing-page snapshot is empty or malformed (Safe Limitations Report).
8. `TC-08`: LLM returns invalid JSON (Schema Parsing Resilience).
9. `TC-09`: Page contains duplicate text or repeated sections (Safe Deduplication).
10. `TC-10`: Page extraction is incomplete (Partial Extraction Flagged).
11. `TC-11`: Claim cannot be verified from available evidence (`unverifiable` distinction).
12. `TC-12`: Batch processing continues when one example fails (Fault Isolation).

---

## 5. Environment Variables & Setup

Create a `.env` file with the following variables:

```env
# GEMINI_API_KEY: Optional for Gemini 3.8 Flash Hybrid structured mode.
# If omitted, the deterministic semantic offline engine runs with 100% functionality.
GEMINI_API_KEY="your_api_key_here"

# APP_URL: Base URL of the app
APP_URL="http://localhost:3000"
```

### Installation & Execution

```bash
# 1. Install dependencies
npm install

# 2. Run full-stack dev server (Vite + Express backend on port 3000)
npm run dev

# 3. Run TypeScript checks
npm run lint

# 4. Production build
npm run build
```

---

## 6. Output Schema

The output conforms to the structured JSON specification:

```json
{
  "adid": "FIN-01",
  "landingpageurl": "https://fastcashloans.com/personal-loans",
  "overallscore": 53,
  "classification": "Needs Improvement",
  "summary": "Score penalized by contradictory messaging (-30) and missing approval timeline promise.",
  "breakdown": {
    "promiseAlignment": 60,
    "offerConsistency": 100,
    "featureSubstantiation": 100,
    "ctaAlignment": 100,
    "positionVisibility": 100
  },
  "findings": [
    {
      "id": "fnd-timeline-1",
      "type": "contradictory_messaging",
      "severity": "high",
      "adclaim": "Fast / Same-day approval or turnaround",
      "explanation": "The ad promises same-day turnaround, but the landing page explicitly specifies a longer timeframe: 'Applications are thoroughly reviewed by our underwriting team within 3 to 5 business days...'.",
      "evidencequote": "Applications are thoroughly reviewed by our underwriting team within 3 to 5 business days after document submission.",
      "evidencelocation": "faq",
      "verificationstatus": "contradicted",
      "recommendedfix": "Add a substantiated approval-timeline statement near the hero section or revise the ad to reflect the actual processing timeframe.",
      "target": "both"
    }
  ],
  "ctamatch": {
    "status": "matched",
    "adcta": "Apply in 2 Minutes",
    "landingpagecta": "Check Your Rate",
    "evidencequote": "Check Your Rate",
    "evidencelocation": "hero",
    "explanation": "Acceptable CTA consistency between ad and landing page."
  },
  "limitations": []
}
```
