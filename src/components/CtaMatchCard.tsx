import React from 'react';
import { CtaMatch } from '../types/audit';

interface CtaMatchCardProps {
  ctaMatch: CtaMatch;
}

export const CtaMatchCard: React.FC<CtaMatchCardProps> = ({ ctaMatch }) => {
  const isMatched = ctaMatch.status === 'matched';
  const isMismatch = ctaMatch.status === 'mismatch';

  const statusBadge = isMatched
    ? { text: 'CTA Aligned', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
    : isMismatch
    ? { text: 'CTA Mismatch Detected', color: 'text-rose-700 bg-rose-50 border-rose-200' }
    : { text: 'CTA Status Unknown', color: 'text-slate-700 bg-slate-50 border-slate-200' };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Call-to-Action (CTA) Consistency Audit
        </h3>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${statusBadge.color}`}>
          {statusBadge.text}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ad CTA */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Advertised Action
          </span>
          <div className="text-sm font-bold text-slate-900 font-mono">
            {ctaMatch.adcta ? `"${ctaMatch.adcta}"` : 'None specified in ad copy'}
          </div>
        </div>

        {/* Landing Page CTA */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Landing Page Primary CTA
          </span>
          <div className="text-sm font-bold text-slate-900 font-mono">
            {ctaMatch.landingpagecta ? `"${ctaMatch.landingpagecta}"` : 'No prominent CTA extracted'}
          </div>
          {ctaMatch.evidencelocation && (
            <span className="text-[10px] text-slate-500 mt-1 block">
              Found in: <strong className="capitalize">{ctaMatch.evidencelocation}</strong> section
            </span>
          )}
        </div>
      </div>

      {/* Explanation */}
      <p className="mt-4 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
        {ctaMatch.explanation}
      </p>
    </div>
  );
};
