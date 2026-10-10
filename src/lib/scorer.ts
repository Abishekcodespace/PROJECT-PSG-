import { CtaMatch, Finding, MatchClassification, ScoringBreakdown } from '../types/audit';

export interface ScoreComputationResult {
  overallScore: number;
  classification: MatchClassification;
  breakdown: ScoringBreakdown;
  summaryExplanation: string;
}

/**
 * Deterministically computes message-match score (0-100) based on verified findings and CTA status.
 */
export function calculateMessageMatchScore(
  findings: Finding[],
  ctaMatch: CtaMatch,
  extractedSegmentsCount: number
): ScoreComputationResult {
  // If zero segments were extracted, score is 0 with explanation
  if (extractedSegmentsCount === 0) {
    return {
      overallScore: 0,
      classification: 'Poor',
      breakdown: {
        promiseAlignment: 0,
        offerConsistency: 0,
        featureSubstantiation: 0,
        ctaAlignment: 0,
        positionVisibility: 0,
      },
      summaryExplanation: 'Audit failed due to lack of inspectable page content. Zero text segments were extracted from the landing page snapshot.',
    };
  }

  // Factor base scores (out of 100)
  let promiseScore = 100;
  let offerScore = 100;
  let featureScore = 100;
  let ctaScore = 100;
  let positionScore = 100;

  // Process findings impact
  for (const finding of findings) {
    switch (finding.type) {
      case 'contradictory_messaging':
        promiseScore -= finding.severity === 'high' ? 40 : 25;
        break;
      case 'missing_promise':
        promiseScore -= finding.severity === 'high' ? 35 : 20;
        break;
      case 'unsupported_claim':
        promiseScore -= finding.severity === 'high' ? 30 : 15;
        break;
      case 'offer_mismatch':
        offerScore -= finding.severity === 'high' ? 55 : 35;
        if (finding.verificationstatus === 'contradicted') {
          promiseScore -= 30; // Direct bait-and-switch contradiction impacts promise alignment
        }
        break;
      case 'missing_context':
        offerScore -= finding.severity === 'high' ? 25 : 15;
        break;
      case 'missing_feature_benefit':
        featureScore -= finding.severity === 'high' ? 35 : 20;
        break;
      case 'position_mismatch':
        positionScore -= finding.severity === 'high' ? 40 : 25;
        break;
      case 'cta_mismatch':
        ctaScore -= finding.severity === 'high' ? 50 : 35;
        break;
    }
  }

  // Incorporate CTA match status explicitly
  if (ctaMatch.status === 'mismatch') {
    ctaScore = Math.min(ctaScore, 40);
  } else if (ctaMatch.status === 'unknown') {
    ctaScore = Math.min(ctaScore, 70);
  }

  // Clamp subscores between 0 and 100
  promiseScore = Math.max(0, Math.min(100, promiseScore));
  offerScore = Math.max(0, Math.min(100, offerScore));
  featureScore = Math.max(0, Math.min(100, featureScore));
  ctaScore = Math.max(0, Math.min(100, ctaScore));
  positionScore = Math.max(0, Math.min(100, positionScore));

  // Weighted aggregate formula:
  // Promise Alignment (30%), Offer Consistency (25%), Feature Substantiation (20%), CTA (15%), Visibility (10%)
  const weighted =
    promiseScore * 0.30 +
    offerScore * 0.25 +
    featureScore * 0.20 +
    ctaScore * 0.15 +
    positionScore * 0.10;

  const overallScore = Math.round(weighted);

  // Classification rubric
  let classification: MatchClassification;
  if (overallScore >= 85) {
    classification = 'Excellent';
  } else if (overallScore >= 70) {
    classification = 'Good';
  } else if (overallScore >= 50) {
    classification = 'Needs Improvement';
  } else {
    classification = 'Poor';
  }

  // Formulate concise, transparent explanation
  const highImpactIssues = findings.filter((f) => f.severity === 'high');
  const reasons: string[] = [];

  if (offerScore < 70) {
    reasons.push('pricing or promotional term discrepancies');
  }
  if (promiseScore < 70) {
    reasons.push('unsubstantiated or missing advertising promises');
  }
  if (featureScore < 70) {
    reasons.push('advertised core features absent from page copy');
  }
  if (ctaScore < 70) {
    reasons.push(`call-to-action misalignment (ad requested "${ctaMatch.adcta || 'action'}" vs page offering "${ctaMatch.landingpagecta || 'different flow'}")`);
  }
  if (positionScore < 70) {
    reasons.push('key supporting proof buried exclusively in footer');
  }

  let summaryExplanation = '';
  if (findings.length === 0 && overallScore >= 85) {
    summaryExplanation = 'Strong message alignment across headline claims, offer terms, hero promises, and primary call-to-action.';
  } else if (reasons.length > 0) {
    summaryExplanation = `Score penalized by ${reasons.join(', ')} (${highImpactIssues.length} high-severity finding${highImpactIssues.length === 1 ? '' : 's'}).`;
  } else {
    summaryExplanation = `Moderate message match with ${findings.length} minor variance${findings.length === 1 ? '' : 's'} across secondary copy.`;
  }

  return {
    overallScore,
    classification,
    breakdown: {
      promiseAlignment: promiseScore,
      offerConsistency: offerScore,
      featureSubstantiation: featureScore,
      ctaAlignment: ctaScore,
      positionVisibility: positionScore,
    },
    summaryExplanation,
  };
}
