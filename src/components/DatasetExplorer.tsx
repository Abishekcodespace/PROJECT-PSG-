import React, { useState } from 'react';
import { SAMPLE_DATASET } from '../data/sampleDataset';
import { DatasetItem, Industry } from '../types/audit';

interface DatasetExplorerProps {
  onSelectDatasetItem: (item: DatasetItem) => void;
  onRunBatchWithAll: () => void;
}

export const DatasetExplorer: React.FC<DatasetExplorerProps> = ({
  onSelectDatasetItem,
  onRunBatchWithAll,
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewHtmlItem, setPreviewHtmlItem] = useState<DatasetItem | null>(null);

  const filteredItems = SAMPLE_DATASET.filter((item) => {
    if (selectedIndustry !== 'all' && item.industry !== selectedIndustry) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.adHeadline.toLowerCase().includes(q) ||
        item.expectedIssue.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Batch Action */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            60-Pair Ground Truth Benchmark Dataset
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Preloaded real-world ad copy and fully rendered offline HTML snapshots across Financial Services, SaaS, and E-Commerce.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onRunBatchWithAll}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shadow-sm"
          >
            Run All 60 Pairs in Batch
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'Financial Services', 'SaaS', 'E-Commerce'].map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedIndustry === ind
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {ind === 'all' ? 'All (60 Pairs)' : ind}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by keyword, claim, or issue..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 w-full sm:w-72"
        />
      </div>

      {/* Items Table / Cards */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-20">ID</th>
                <th className="py-3 px-4 w-36">Industry</th>
                <th className="py-3 px-4 w-60">Case Title</th>
                <th className="py-3 px-4">Ad Headline & Description</th>
                <th className="py-3 px-4 w-72">Expected Archetype</th>
                <th className="py-3 px-4 w-32 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">
                    {item.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-sans">
                      {item.industry}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {item.title}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div className="font-medium text-slate-800 mb-0.5">{item.adHeadline}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{item.adDescription}</div>
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-600">
                    <span className="font-sans leading-tight block">{item.expectedIssue}</span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setPreviewHtmlItem(item)}
                        className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        HTML
                      </button>
                      <button
                        onClick={() => onSelectDatasetItem(item)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                      >
                        Audit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Snapshot HTML Preview Modal */}
      {previewHtmlItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {previewHtmlItem.id} — Offline Snapshot HTML
              </h3>
              <button
                onClick={() => setPreviewHtmlItem(null)}
                className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="mt-4 flex-1 overflow-y-auto">
              <pre className="text-[11px] font-mono text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200 overflow-x-auto whitespace-pre-wrap">
                {previewHtmlItem.snapshotHtml}
              </pre>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => {
                  onSelectDatasetItem(previewHtmlItem);
                  setPreviewHtmlItem(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
              >
                Load this Case into Auditor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
