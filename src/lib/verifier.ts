import { ExtractedPageContent, ExtractedSegment, Finding, PageSection, VerificationStatus } from '../types/audit';
import { normalizeText } from './extractor';

export interface VerificationResult {
  verified: boolean;
  cleanQuote: string | null;
  confirmedLocation: PageSection | null;
  status: VerificationStatus;
  segmentIndex?: number;
  matchScore: number;
  rejectionReason?: string;
}

/**
 * Strips punctuation and extra whitespace for robust comparison.
 */
function cleanComparisonString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s$€£%.-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks whether alleged quote exists in any of the extracted segments.
 * Returns verified status, location, and matching segment details.
 */
export function verifyQuoteAgainstSegments(
  allegedQuote: string | null | undefined,
  segments: ExtractedSegment[]
): VerificationResult {
  if (!allegedQuote || typeof allegedQuote !== 'string' || allegedQuote.trim().length === 0) {
    return {
      verified: false,
      cleanQuote: null,
      confirmedLocation: null,
      status: 'not_found',
      matchScore: 0,
      rejectionReason: 'No supporting quotation provided; claim was not found in inspected content.',
    };
  }

  const quoteClean = normalizeText(allegedQuote);
  const quoteCmp = cleanComparisonString(quoteClean);

  if (quoteCmp.length === 0 || segments.length === 0) {
    return {
      verified: false,
      cleanQuote: null,
      confirmedLocation: null,
      status: 'not_found',
      matchScore: 0,
      rejectionReason: 'Empty segment text or quotation after normalization.',
    };
  }

  // 1. Direct Substring Check in any segment
  for (const seg of segments) {
    if (seg.text.includes(quoteClean)) {
      return {
        verified: true,
        cleanQuote: quoteClean,
        confirmedLocation: seg.section,
        status: 'verified',
        segmentIndex: seg.order,
        matchScore: 1.0,
      };
    }
  }

  // 2. Normalized Comparison Check
  for (const seg of segments) {
    const segCmp = cleanComparisonString(seg.text);
    if (segCmp.includes(quoteCmp)) {
      // Find the best slice from segment text
      return {
        verified: true,
        cleanQuote: seg.text,
        confirmedLocation: seg.section,
        status: 'verified',
        segmentIndex: seg.order,
        matchScore: 0.95,
      };
    }
  }

  // 3. Check across joined text (for quotes spanning adjacent lines or tags)
  const fullJoinedText = segments.map((s) => s.text).join(' ');
  const fullJoinedCmp = cleanComparisonString(fullJoinedText);
  if (fullJoinedCmp.includes(quoteCmp)) {
    // Find closest segment
    const matchedSeg = segments.find((s) => cleanComparisonString(s.text).includes(quoteCmp.substring(0, 20))) || segments[0];
    return {
      verified: true,
      cleanQuote: quoteClean,
      confirmedLocation: matchedSeg ? matchedSeg.section : 'body',
      status: 'verified',
      segmentIndex: matchedSeg?.order,
      matchScore: 0.9,
    };
  }

  // 4. Token Overlap Check for partial multi-word quotes (min 85% overlap of tokens >= 4 chars)
  const quoteTokens = quoteCmp.split(' ').filter((t) => t.length > 3);
  if (quoteTokens.length >= 3) {
    let bestMatchSeg: ExtractedSegment | null = null;
    let highestRatio = 0;

    for (const seg of segments) {
      const segTokens = new Set(cleanComparisonString(seg.text).split(' '));
      const matchedCount = quoteTokens.filter((token) => segTokens.has(token)).length;
      const ratio = matchedCount / quoteTokens.length;

      if (ratio > highestRatio) {
        highestRatio = ratio;
        bestMatchSeg = seg;
      }
    }

    if (highestRatio >= 0.85 && bestMatchSeg) {
      return {
        verified: true,
        cleanQuote: bestMatchSeg.text,
        confirmedLocation: bestMatchSeg.section,
        status: 'verified',
        segmentIndex: bestMatchSeg.order,
        matchScore: Number(highestRatio.toFixed(2)),
      };
    }
  }

  // 5. Quote Not Found: REJECT AS HALLUCINATION OR UNFOUND
  return {
    verified: false,
    cleanQuote: null,
    confirmedLocation: null,
    status: 'quote_rejected_hallucination',
    matchScore: 0,
    rejectionReason: `Fabricated or unverified quotation: "${allegedQuote.substring(0, 80)}..." does not exist in extracted landing page content.`,
  };
}

/**
 * Searches extracted segments for relevant evidence matching a given claim keywords.
 */
export function searchSegmentEvidenceForClaim(
  claim: string,
  segments: ExtractedSegment[]
): { quote: string; location: PageSection; segmentIndex: number } | null {
  const cleanClaim = cleanComparisonString(claim);
  const keywords = cleanClaim
    .split(' ')
    .filter((w) => w.length > 3 && !['with', 'from', 'your', 'this', 'that', 'have', 'more', 'they'].includes(w));

  if (keywords.length === 0) return null;

  let bestMatch: { quote: string; location: PageSection; segmentIndex: number; score: number } | null = null;

  for (const seg of segments) {
    const segTextClean = cleanComparisonString(seg.text);
    let matchedKeywords = 0;
    for (const kw of keywords) {
      if (segTextClean.includes(kw)) {
        matchedKeywords++;
      }
    }

    const score = matchedKeywords / keywords.length;
    if (score >= 0.6 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = {
        quote: seg.text,
        location: seg.section,
        segmentIndex: seg.order,
        score,
      };
    }
  }

  return bestMatch;
}

/**
 * Deterministically verifies and sanctions all findings in an audit report.
 * Replaces hallucinated quotes with null, records confirmed DOM sections,
 * and detects position mismatches (e.g. only in footer).
 */
export function verifyAllFindings(
  findings: Finding[],
  pageContent: ExtractedPageContent
): {
  verifiedFindings: Finding[];
  verifiedQuoteCount: number;
  rejectedQuoteCount: number;
  verificationRatePct: number;
} {
  let verifiedCount = 0;
  let rejectedCount = 0;

  const verifiedFindings = findings.map((finding) => {
    // If the finding has an alleged evidence quote, verify it strictly
    if (finding.evidencequote) {
      const ver = verifyQuoteAgainstSegments(finding.evidencequote, pageContent.segments);

      if (ver.verified && ver.cleanQuote && ver.confirmedLocation) {
        verifiedCount++;

        // Position Check: If finding was supposed to be a feature or promise,
        // but was only substantiated in the footer:
        let updatedType = finding.type;
        let updatedFix = finding.recommendedfix;

        if (ver.confirmedLocation === 'footer' && finding.type !== 'position_mismatch' && finding.severity !== 'low') {
          updatedType = 'position_mismatch';
          updatedFix = `Supporting information was located exclusively in the footer (${ver.cleanQuote.substring(0, 60)}...). Elevate this key value proposition to the hero or above-the-fold section to ensure visitor visibility.`;
        }

        return {
          ...finding,
          type: updatedType,
          evidencequote: ver.cleanQuote,
          evidencelocation: ver.confirmedLocation,
          verificationstatus: (finding.verificationstatus === 'contradicted' ? 'contradicted' : 'verified') as VerificationStatus,
          recommendedfix: updatedFix,
          verificationDetails: {
            matchConfidence: ver.matchScore,
            segmentIndex: ver.segmentIndex,
          },
        };
      } else {
        // Hallucinated quote or quote not in text: Reject it!
        rejectedCount++;
        return {
          ...finding,
          evidencequote: null,
          evidencelocation: null,
          verificationstatus: 'quote_rejected_hallucination' as VerificationStatus,
          verificationDetails: {
            rejectionReason: ver.rejectionReason,
            matchConfidence: 0,
          },
        };
      }
    } else {
      // No quote provided; ensure clean not_found or unverifiable status
      const status: VerificationStatus = pageContent.limitations.length > 0 && pageContent.segments.length < 3
        ? 'unverifiable'
        : 'not_found';

      return {
        ...finding,
        evidencequote: null,
        evidencelocation: null,
        verificationstatus: status,
        verificationDetails: {
          rejectionReason: 'No supporting quotation found in inspected landing page content.',
          matchConfidence: 0,
        },
      };
    }
  });

  const totalQuotesConsidered = verifiedCount + rejectedCount;
  const verificationRatePct = totalQuotesConsidered > 0
    ? Math.round((verifiedCount / totalQuotesConsidered) * 100)
    : 100;

  return {
    verifiedFindings,
    verifiedQuoteCount: verifiedCount,
    rejectedQuoteCount: rejectedCount,
    verificationRatePct,
  };
}
