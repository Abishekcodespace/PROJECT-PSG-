import React, { useState } from 'react';
import { SAMPLE_DATASET } from '../data/sampleDataset';
import { AuditReport } from '../types/audit';

interface BatchAuditRunnerProps {
  onViewSingleReport: (report: AuditReport) => void;
  batchReports: AuditReport[];
  isProcessing: boolean;
  onRunBatch: (items: typeof SAMPLE_DATASET) => void;
}

export const BatchAuditRunner: React.FC<BatchAuditRunnerProps> = ({
  onViewSingleReport,
  batchReports,
  isProcessing,
  onRunBatch,
}) => {
  const [industryFilter, setIndustryFilter] = useState('all');
  const [classificationFilter, setClassificationFilter] = useState('all');

  // Compute aggregate statistics
  const total = batchReports.length;
  const avgScore = total > 0 ? Math.round(batchReports.reduce((acc, r) => acc + r.overallscore, 0) / total) : 0;
  const highSeverityCount = batchReports.reduce(
    (acc, r) => acc + r.findings.filter((f) => f.severity === 'high').length,
    0
  );
  const ctaMismatchCount = batchReports.filter((r) => r.ctamatch.status === 'mismatch').length;
  const excellentCount = batchReports.filter((r) => r.classification === 'Excellent').length;

  const filteredReports = batchReports.filter((r) => {
    if (industryFilter !== 'all' && r.industry !== industryFilter) return false;
    if (classificationFilter !== 'all' && r.classification !== classificationFilter) return false;
    return true;
  });

  const exportCsv = () => {
    if (batchReports.length === 0) return;
    const headers = [
      'Ad ID',
      'Industry',
      'Ad Headline',
      'Overall Score',
      'Classification',
      'Findings Count',
      'High Severity Count',
      'CTA Status',
      'Landing Page URL',
      'Summary Rationale',
    ];

    const rows = batchReports.map((r) => [
      `"${r.adid}"`,
      `"${r.industry || 'N/A'}"`,
      `"${r.adHeadline.replace(/"/g, '""')}"`,
      r.overallscore,
      `"${r.classification}"`,
      r.findings.length,
      r.findings.filter((f) => f.severity === 'high').length,
      `"${r.ctamatch.status}"`,
      `"${r.landingpageurl}"`,
      `"${r.summary.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `message-match-batch-audit-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJson = () => {
    if (batchReports.length === 0) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(batchReports, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.setAttribute('download', `message-match-batch-audit-${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Batch Message-Match Audit Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated evaluation across multi-ad portfolios with evidence grounding and deterministic scoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onRunBatch(SAMPLE_DATASET)}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer shadow-sm"
          >
            {isProcessing ? 'Processing 60 Cases...' : 'Execute 60-Case Batch'}
          </button>
          {batchReports.length > 0 && (
            <>
              <button
                onClick={exportCsv}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Export CSV
              </button>
              <button
                onClick={exportJson}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Export JSON
              </button>
            </>
          )}
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      {total > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
            <span className="text-xs text-slate-500 block mb-1">Total Analyzed</span>
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {total}
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
            <span className="text-xs text-slate-500 block mb-1">Average Match Score</span>
            <span
              className={`text-2xl font-extrabold font-mono tabular-nums ${
                avgScore >= 70 ? 'text-blue-600' : 'text-amber-600'
              }`}
            >
              {avgScore} / 100
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
            <span className="text-xs text-slate-500 block mb-1">High Severity Mismatches</span>
            <span className="text-2xl font-extrabold text-rose-600 font-mono tabular-nums">
              {highSeverityCount}
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
            <span className="text-xs text-slate-500 block mb-1">CTA Mismatch Rate</span>
            <span className="text-2xl font-extrabold text-amber-600 font-mono tabular-nums">
              {Math.round((ctaMismatchCount / total) * 100)}%
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center col-span-2 md:col-span-1">
            <span className="text-xs text-slate-500 block mb-1">Excellent Alignment</span>
            <span className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
              {excellentCount}
            </span>
          </div>
        </div>
      )}

      {/* Table Filters */}
      {total > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-medium mr-1">Industry:</span>
            {['all', 'Financial Services', 'SaaS', 'E-Commerce'].map((ind) => (
              <button
                key={ind}
                onClick={() => setIndustryFilter(ind)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  industryFilter === ind
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {ind === 'all' ? 'All' : ind}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Classification:</span>
            <select
              value={classificationFilter}
              onChange={(e) => setClassificationFilter(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-md px-2.5 py-1 bg-slate-50 text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Classifications</option>
              <option value="Excellent">Excellent (85-100)</option>
              <option value="Good">Good (70-84)</option>
              <option value="Needs Improvement">Needs Improvement (50-69)</option>
              <option value="Poor">Poor (0-49)</option>
            </select>
          </div>
        </div>
      )}

      {/* Results Table */}
      {batchReports.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-700">No batch analysis has been run yet.</p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Click "Execute 60-Case Batch" to process all pre-captured pairs through the deterministic message-match auditor.
          </p>
          <button
            onClick={() => onRunBatch(SAMPLE_DATASET)}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm cursor-pointer"
          >
            Run 60-Case Batch Now
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-20">ID</th>
                  <th className="py-3 px-4 w-36">Industry</th>
                  <th className="py-3 px-4">Ad Headline</th>
                  <th className="py-3 px-4 w-28 text-center">Score</th>
                  <th className="py-3 px-4 w-36">Classification</th>
                  <th className="py-3 px-4 w-28 text-center">Mismatches</th>
                  <th className="py-3 px-4 w-28 text-center">CTA Status</th>
                  <th className="py-3 px-4 w-28 text-right">Inspection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredReports.map((report) => (
                  <tr key={report.adid} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {report.adid}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">
                      {report.industry || 'General'}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      <span className="line-clamp-1">{report.adHeadline}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold tabular-nums">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs ${
                          report.overallscore >= 85
                            ? 'bg-emerald-50 text-emerald-700'
                            : report.overallscore >= 70
                            ? 'bg-blue-50 text-blue-700'
                            : report.overallscore >= 50
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {report.overallscore}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {report.classification}
                    </td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-700">
                      {report.findings.length}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${
                          report.ctamatch.status === 'matched'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : report.ctamatch.status === 'mismatch'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {report.ctamatch.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onViewSingleReport(report)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
