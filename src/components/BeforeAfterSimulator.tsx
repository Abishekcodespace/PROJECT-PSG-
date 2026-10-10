import React, { useState } from 'react';
import { SAMPLE_DATASET } from '../data/sampleDataset';
import { analyzeDeterministic } from '../lib/analyzer';
import { AuditReport, DatasetItem } from '../types/audit';

export const BeforeAfterSimulator: React.FC = () => {
  // Default to SAAS-01 (price discrepancy $19 vs $49)
  const initialCase = SAMPLE_DATASET.find((d) => d.id === 'SAAS-01') || SAMPLE_DATASET[0];

  const [selectedCaseId, setSelectedCaseId] = useState<string>(initialCase.id);
  const [adHeadline, setAdHeadline] = useState<string>(initialCase.adHeadline);
  const [adDescription, setAdDescription] = useState<string>(initialCase.adDescription);
  const [adCta, setAdCta] = useState<string>(initialCase.adCta);
  const [snapshotHtml, setSnapshotHtml] = useState<string>(initialCase.snapshotHtml);

  // Original audit
  const [originalReport, setOriginalReport] = useState<AuditReport>(() =>
    analyzeDeterministic({
      adHeadline: initialCase.adHeadline,
      adDescription: initialCase.adDescription,
      adCta: initialCase.adCta,
      landingPageUrl: initialCase.landingPageUrl,
      snapshotHtml: initialCase.snapshotHtml,
    })
  );

  // Simulated revised audit
  const [simulatedReport, setSimulatedReport] = useState<AuditReport | null>(null);

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    const item = SAMPLE_DATASET.find((d) => d.id === caseId) || SAMPLE_DATASET[0];
    setAdHeadline(item.adHeadline);
    setAdDescription(item.adDescription);
    setAdCta(item.adCta);
    setSnapshotHtml(item.snapshotHtml);

    const orig = analyzeDeterministic({
      adHeadline: item.adHeadline,
      adDescription: item.adDescription,
      adCta: item.adCta,
      landingPageUrl: item.landingPageUrl,
      snapshotHtml: item.snapshotHtml,
    });
    setOriginalReport(orig);
    setSimulatedReport(null);
  };

  const handleRunSimulation = () => {
    const sim = analyzeDeterministic({
      adHeadline,
      adDescription,
      adCta,
      landingPageUrl: originalReport.landingpageurl,
      snapshotHtml,
    });
    setSimulatedReport(sim);
  };

  // Quick automated fix buttons for the active case
  const applySuggestedAdFix = () => {
    if (selectedCaseId === 'SAAS-01') {
      // Reconcile price to $49
      setAdHeadline('Simple Sales CRM for Growing Teams | Starting at $49/User/Month');
      setAdDescription('Close deals faster with automated email sequences, pipeline tracking, and Gmail sync. 14-day free trial.');
    } else if (selectedCaseId === 'FIN-01') {
      // Reconcile approval timeline to 3 to 5 business days
      setAdHeadline('Flexible Personal Loans Up to $50,000 | Transparent Underwriting');
      setAdDescription('Fixed monthly payments with underwriting review in 3 to 5 business days. Apply online in 2 minutes.');
    } else if (selectedCaseId === 'ECOM-01') {
      // Reconcile discount to 13% and trial to 30 days
      setAdHeadline('RestCloud Hybrid Mattress | Save 13% This Week');
      setAdDescription('Sleep cooler with adaptive memory foam and pocketed coils. Risk-free 30-day sleep trial with easy returns.');
    } else {
      // Generic alignment
      setAdHeadline(originalReport.adHeadline.replace(/free|100%|guaranteed|\$\d+/gi, 'Substantiated'));
    }
  };

  const applySuggestedPageFix = () => {
    if (selectedCaseId === 'SAAS-01') {
      // Add $19 plan back to landing page
      setSnapshotHtml(
        snapshotHtml.replace(
          '<div class="tier">',
          '<div class="tier"><h3>Starter Plan</h3><p class="price">$19 per user / month</p></div><div class="tier">'
        )
      );
    } else if (selectedCaseId === 'FIN-01') {
      // Add same-day approval to hero
      setSnapshotHtml(
        snapshotHtml.replace(
          '<h1>Flexible Personal Loans Up To $50,000</h1>',
          '<h1>Flexible Personal Loans Up To $50,000 with Same-Day Approval</h1>'
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Before-and-After Message-Match Simulator
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Edit ad copy or landing page copy in real time to simulate recommended fixes and measure the score impact.
          </p>
        </div>

        {/* Case Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Select Archetype:</span>
          <select
            value={selectedCaseId}
            onChange={(e) => handleSelectCase(e.target.value)}
            className="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="SAAS-01">SAAS-01: Price Discrepancy ($19 vs $49)</option>
            <option value="FIN-01">FIN-01: Same-Day Approval Missing</option>
            <option value="ECOM-01">ECOM-01: 40% Off vs 13% Off</option>
            <option value="FIN-02">FIN-02: Summit Mortgage (3.5% vs 5.85%)</option>
            <option value="SAAS-02">SAAS-02: 99.999% SLA vs 99.9%</option>
          </select>
        </div>
      </div>

      {/* Comparison Score Boards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BEFORE CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Before (Original Problem State)
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded border ${
                originalReport.overallscore >= 70
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              Score: {originalReport.overallscore}/100 ({originalReport.classification})
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="font-semibold text-slate-500 block">Original Headline:</span>
              <p className="text-slate-800 font-medium">{originalReport.adHeadline}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-500 block">Critical Issues Detected:</span>
              <ul className="list-disc pl-4 text-slate-700 space-y-1 mt-1">
                {originalReport.findings.slice(0, 3).map((f) => (
                  <li key={f.id}>
                    <strong>{f.adclaim}:</strong> {f.explanation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* AFTER / SIMULATED CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              After (Simulated Corrected State)
            </span>
            {simulatedReport ? (
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded border ${
                  simulatedReport.overallscore >= 85
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : simulatedReport.overallscore >= 70
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                Score: {simulatedReport.overallscore}/100 ({simulatedReport.classification}) · Δ +
                {simulatedReport.overallscore - originalReport.overallscore}
              </span>
            ) : (
              <span className="text-xs text-slate-400 italic">Not tested yet</span>
            )}
          </div>

          {simulatedReport ? (
            <div className="space-y-2 text-xs">
              <p className="text-emerald-800 font-medium bg-emerald-50/60 p-2.5 rounded border border-emerald-100">
                {simulatedReport.summary}
              </p>
              <div>
                <span className="font-semibold text-slate-500 block">Remaining Issues:</span>
                <span className="font-mono text-slate-800">
                  {simulatedReport.findings.length} findings (down from {originalReport.findings.length})
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 py-6 text-center">
              Apply a fix below or edit copy and click "Test Simulated Fix".
            </div>
          )}
        </div>
      </div>

      {/* Interactive Sandbox Editor */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h3 className="text-sm font-bold text-slate-900">
            Interactive Fix Sandbox & Copy Editor
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={applySuggestedAdFix}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Apply Recommended Ad Fix
            </button>
            <button
              onClick={applySuggestedPageFix}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Apply Recommended Page Fix
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Ad Headline (Editable):
              </label>
              <input
                type="text"
                value={adHeadline}
                onChange={(e) => setAdHeadline(e.target.value)}
                className="w-full text-xs font-medium p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Ad Description (Editable):
              </label>
              <textarea
                rows={3}
                value={adDescription}
                onChange={(e) => setAdDescription(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Ad Call to Action (CTA):
              </label>
              <input
                type="text"
                value={adCta}
                onChange={(e) => setAdCta(e.target.value)}
                className="w-full text-xs font-medium p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Landing Page Snapshot HTML (Editable):
            </label>
            <textarea
              rows={8}
              value={snapshotHtml}
              onChange={(e) => setSnapshotHtml(e.target.value)}
              className="w-full text-xs font-mono p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none bg-slate-50"
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleRunSimulation}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm cursor-pointer"
          >
            Test Simulated Fix & Recalculate Score
          </button>
        </div>
      </div>
    </div>
  );
};
