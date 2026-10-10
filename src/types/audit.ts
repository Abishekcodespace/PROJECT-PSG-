export type Industry = 'Financial Services' | 'SaaS' | 'E-Commerce';

export type FindingType =
  | 'missing_promise'
  | 'missing_feature_benefit'
  | 'unsupported_claim'
  | 'contradictory_messaging'
  | 'offer_mismatch'
  | 'cta_mismatch'
  | 'position_mismatch'
  | 'missing_context';

export type Severity = 'high' | 'medium' | 'low';

export type PageSection = 'hero' | 'above-the-fold' | 'features' | 'pricing' | 'faq' | 'body' | 'footer' | 'unknown';

export type VerificationStatus =
  | 'verified'
  | 'not_found'
  | 'contradicted'
  | 'quote_rejected_hallucination'
  | 'unverifiable';

export type RecommendationTarget = 'ad' | 'landing_page' | 'both';

export interface ExtractedSegment {
  id: string;
  text: string;
  normalizedText: string;
  tag: string;
  section: PageSection;
  isHeading: boolean;
  isCta: boolean;
  order: number;
}

export interface ExtractedPageContent {
  url: string;
  title: string;
  metaDescription: string;
  segments: ExtractedSegment[];
  ctas: { text: string; section: PageSection; tag: string }[];
  sectionCounts: Record<PageSection, number>;
  rawText: string;
  extractedTextLength: number;
  isTruncated: boolean;
  hasErrors: boolean;
  limitations: string[];
}

export interface Finding {
  id: string;
  type: FindingType;
  severity: Severity;
  adclaim: string;
  explanation: string;
  evidencequote: string | null;
  evidencelocation: PageSection | null;
  verificationstatus: VerificationStatus;
  recommendedfix: string;
  target?: RecommendationTarget;
  verificationDetails?: {
    matchConfidence?: number;
    segmentIndex?: number;
    rejectionReason?: string;
  };
}

export interface CtaMatch {
  status: 'matched' | 'mismatch' | 'unknown';
  adcta: string | null;
  landingpagecta: string | null;
  evidencequote: string | null;
  evidencelocation: PageSection | null;
  explanation: string;
}

export interface ScoringBreakdown {
  promiseAlignment: number; // 0-100 (30% weight)
  offerConsistency: number; // 0-100 (25% weight)
  featureSubstantiation: number; // 0-100 (20% weight)
  ctaAlignment: number; // 0-100 (15% weight)
  positionVisibility: number; // 0-100 (10% weight)
}

export type MatchClassification = 'Excellent' | 'Good' | 'Needs Improvement' | 'Poor';

export interface AuditReport {
  adid: string;
  adHeadline: string;
  adDescription: string;
  adCta?: string;
  industry?: Industry;
  landingpageurl: string;
  overallscore: number;
  classification: MatchClassification;
  summary: string;
  breakdown: ScoringBreakdown;
  findings: Finding[];
  ctamatch: CtaMatch;
  limitations: string[];
  metadata: {
    auditedAt: string;
    engine: 'gemini-3.8-flash' | 'deterministic-semantic';
    totalSegmentsInspected: number;
    verifiedQuoteCount: number;
    rejectedQuoteCount: number;
    verifiedRatePct: number;
    isOfflineSnapshot: boolean;
  };
}

export interface DatasetItem {
  id: string;
  industry: Industry;
  title: string;
  adHeadline: string;
  adDescription: string;
  adCta: string;
  landingPageUrl: string;
  snapshotHtml: string;
  expectedIssue: string;
  description: string;
}

export interface TestCaseResult {
  id: string;
  name: string;
  scenario: string;
  passed: boolean;
  details: string;
  expected: string;
  actual: string;
}
