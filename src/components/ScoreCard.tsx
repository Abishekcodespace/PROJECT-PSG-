import React from 'react';
import { AuditReport, MatchClassification } from '../types/audit';

interface ScoreCardProps {
  report: AuditReport;
}

function getClassificationBadge(classification: MatchClassification): {
  color: string;
  bg: string;
  border: string;
} {
  switch (classification) {
    case 'Excellent':
      return { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    case 'Good':
      return { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' };
    case 'Needs Improvement':
      return { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
    case 'Poor':
    default:
      return { color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };
  }
}

function getScoreColor(score: number): string {
  if (score >= 85) return 'text-emerald-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-rose-600';
}

function getScoreBgBar(score: number): string {
  if (score >= 85) return 'bg-emerald-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ report }) => {
  const badge = getClassificationBadge(report.classification);
  const scoreColor = getScoreColor(report.overallscore);

  const factorItems = [
    { label: 'Promise & Claim Alignment', weight: '30%', value: report.breakdown.promiseAlignment },
    { label: 'Offer & Pricing Consistency', weight: '25%', value: report.breakdown.offerConsistency },
    { label: 'Feature Substantiation', weight: '20%', value: report.breakdown.featureSubstantiation },
    { label: 'Call-To-Action Alignment', weight: '15%', value: report.breakdown.ctaAlignment },
    { label: 'Hierarchy & Visibility', weight: '10%', value: report.breakdown.positionVisibility },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Overall Score Display */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-lg text-center">
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Message-Match Score
          </span>
          <div className="my-3 flex items-baseline justify-center gap-1">
            <span className={`text-6xl font-extrabold tracking-tight font-mono tabular-nums ${scoreColor}`}>
              {report.overallscore}
            </span>
            <span className="text-slate-400 font-medium text-lg">/100</span>
          </div>

          <div className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold border ${badge.bg} ${badge.color} ${badge.border}`}>
            {report.classification}
          </div>

          <p className="mt-4 text-xs text-slate-600 leading-relaxed text-balance">
            {report.summary}
          </p>

          <div className="mt-5 w-full pt-4 border-t border-slate-200/80 text-left">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Grounding Verification:</span>
              <span className="font-semibold text-slate-700 font-mono tabular-nums">
                {report.metadata.verifiedRatePct}% Rate
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Inspected DOM Segments:</span>
              <span className="font-semibold text-slate-700 font-mono tabular-nums">
                {report.metadata.totalSegmentsInspected} segments
              </span>
            </div>
          </div>
        </div>

        {/* Right: Breakdown Radar / Factors */}
        <div className="lg:col-span-8 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Deterministic Scoring Rubric Breakdown
              </h3>
              <span className="text-xs text-slate-400">
                Engine: <span className="font-mono text-slate-600">{report.metadata.engine}</span>
              </span>
            </div>

            <div className="space-y-4">
              {factorItems.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">
                      {item.label}{' '}
                      <span className="text-slate-400 font-normal">({item.weight})</span>
                    </span>
                    <span className="font-bold text-slate-800 font-mono tabular-nums">
                      {item.value} / 100
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${getScoreBgBar(item.value)}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Verification Log Strip */}
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 block">Verified Quotations</span>
              <span className="text-lg font-bold text-emerald-600 font-mono tabular-nums">
                {report.metadata.verifiedQuoteCount}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 block">Rejected Hallucinations</span>
              <span className="text-lg font-bold text-slate-700 font-mono tabular-nums">
                {report.metadata.rejectedQuoteCount}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-xs text-slate-500 block">Total Mismatches</span>
              <span className="text-lg font-bold text-slate-800 font-mono tabular-nums">
                {report.findings.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
