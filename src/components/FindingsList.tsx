import React, { useState } from 'react';
import { Finding, FindingType, Severity } from '../types/audit';

interface FindingsListProps {
  findings: Finding[];
}

function formatFindingType(type: FindingType): string {
  switch (type) {
    case 'missing_promise':
      return 'Missing Promise';
    case 'missing_feature_benefit':
      return 'Missing Feature / Benefit';
    case 'unsupported_claim':
      return 'Unsupported Claim';
    case 'contradictory_messaging':
      return 'Contradictory Messaging';
    case 'offer_mismatch':
      return 'Offer & Price Mismatch';
    case 'cta_mismatch':
      return 'Call-to-Action Mismatch';
    case 'position_mismatch':
      return 'Position / Visibility Mismatch';
    case 'missing_context':
      return 'Missing Contextual Terms';
    default:
      return type;
  }
}

function getSeverityBadge(severity: Severity) {
  switch (severity) {
    case 'high':
      return { label: 'High Priority', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' };
    case 'medium':
      return { label: 'Medium Priority', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'low':
    default:
      return { label: 'Low Priority', badgeClass: 'bg-slate-50 text-slate-700 border-slate-200' };
  }
}

function getLocationBadge(location: string | null) {
  if (!location) return null;
  switch (location) {
    case 'hero':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'pricing':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'features':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'footer':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'faq':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

export const FindingsList: React.FC<FindingsListProps> = ({ findings }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filtered = findings.filter((f) => {
    if (selectedSeverity !== 'all' && f.severity !== selectedSeverity) return false;
    if (selectedType !== 'all' && f.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Detected Message Mismatches & Evidence
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {findings.length} total issue{findings.length === 1 ? '' : 's'} identified · Grounded against inspected DOM hierarchy
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">All Severities</option>
            <option value="high">High Priority Only</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">All Finding Types</option>
            <option value="offer_mismatch">Offer / Price Mismatch</option>
            <option value="missing_promise">Missing Promise</option>
            <option value="contradictory_messaging">Contradictory Messaging</option>
            <option value="cta_mismatch">CTA Mismatch</option>
            <option value="position_mismatch">Position Mismatch</option>
            <option value="missing_feature_benefit">Missing Feature / Benefit</option>
          </select>
        </div>
      </div>

      {/* Findings List */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-500">
          <p className="text-sm font-medium">No findings match the selected filter criteria.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {filtered.map((finding) => {
            const sev = getSeverityBadge(finding.severity);
            const locClass = getLocationBadge(finding.evidencelocation);

            return (
              <div
                key={finding.id}
                className="border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-colors bg-white"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {formatFindingType(finding.type)}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${sev.badgeClass}`}
                    >
                      {sev.label}
                    </span>
                  </div>

                  {finding.target && (
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Fix Target:{' '}
                      <strong className="text-slate-800 capitalize">{finding.target}</strong>
                    </span>
                  )}
                </div>

                {/* Specific Ad Claim */}
                <div className="mb-2">
                  <span className="text-xs font-semibold text-slate-500 block mb-0.5">
                    Advertising Claim / Promise:
                  </span>
                  <div className="text-sm font-medium text-slate-800 bg-slate-50 px-3 py-1.5 rounded border border-slate-100">
                    "{finding.adclaim}"
                  </div>
                </div>

                {/* Discrepancy Explanation */}
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {finding.explanation}
                </p>

                {/* Verified Page Evidence Section */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-3.5 mb-3">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-slate-700 tracking-wider uppercase">
                      Landing Page Evidence
                    </span>

                    <div className="flex items-center gap-2">
                      {finding.evidencelocation && (
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded border capitalize ${locClass}`}
                        >
                          Section: {finding.evidencelocation}
                        </span>
                      )}

                      {finding.verificationDetails?.segmentIndex && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          [DOM Segment #{finding.verificationDetails.segmentIndex}]
                        </span>
                      )}
                    </div>
                  </div>

                  {finding.evidencequote ? (
                    <blockquote className="text-xs text-slate-800 italic border-l-2 border-slate-400 pl-3 py-0.5 my-1">
                      "{finding.evidencequote}"
                    </blockquote>
                  ) : finding.verificationstatus === 'quote_rejected_hallucination' ? (
                    <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded">
                      <strong>Quotation Rejected:</strong> The alleged evidence quotation did not
                      exist in the inspected page content and was rejected by deterministic
                      verification.
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic">
                      No verified supporting statement was found in the inspected content. (Claim
                      could not be substantiated).
                    </div>
                  )}
                </div>

                {/* Concrete Proposed Fix */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-700 block mb-1">
                    Recommended Concrete Fix:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans bg-emerald-50/40 border border-emerald-100 p-2.5 rounded">
                    {finding.recommendedfix}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
