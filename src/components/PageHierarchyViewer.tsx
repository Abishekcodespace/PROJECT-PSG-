import React, { useState } from 'react';
import { ExtractedPageContent, PageSection } from '../types/audit';

interface PageHierarchyViewerProps {
  extractedContent: ExtractedPageContent;
}

export const PageHierarchyViewer: React.FC<PageHierarchyViewerProps> = ({
  extractedContent,
}) => {
  const [selectedSection, setSelectedSection] = useState<PageSection | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const sections: { key: PageSection | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'All Segments', count: extractedContent.segments.length },
    { key: 'hero', label: 'Hero / Header', count: extractedContent.sectionCounts.hero },
    { key: 'features', label: 'Features & Benefits', count: extractedContent.sectionCounts.features },
    { key: 'pricing', label: 'Pricing & Plans', count: extractedContent.sectionCounts.pricing },
    { key: 'faq', label: 'FAQ & Accordion', count: extractedContent.sectionCounts.faq },
    { key: 'footer', label: 'Footer & Terms', count: extractedContent.sectionCounts.footer },
    { key: 'body', label: 'Main Body', count: extractedContent.sectionCounts.body },
  ];

  const filteredSegments = extractedContent.segments.filter((seg) => {
    if (selectedSection !== 'all' && seg.section !== selectedSection) return false;
    if (searchTerm && !seg.text.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Landing Page DOM Hierarchy & Extracted Segments
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Page Title: {extractedContent.title || 'Untitled'} · {extractedContent.segments.length} verified DOM segments
          </p>
        </div>

        {/* Search within extracted text */}
        <input
          type="text"
          placeholder="Search extracted text..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 w-full sm:w-56"
        />
      </div>

      {/* Section Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 mt-4 pb-2 border-b border-slate-100">
        {sections.map((sec) => (
          <button
            key={sec.key}
            onClick={() => setSelectedSection(sec.key)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedSection === sec.key
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {sec.label}{' '}
            <span
              className={`text-[10px] ml-1 font-mono tabular-nums ${
                selectedSection === sec.key ? 'text-slate-200' : 'text-slate-400'
              }`}
            >
              ({sec.count})
            </span>
          </button>
        ))}
      </div>

      {/* Segments Display Table / Grid */}
      <div className="mt-4 max-h-96 overflow-y-auto space-y-2 pr-1">
        {filteredSegments.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No segments found matching the criteria.
          </div>
        ) : (
          filteredSegments.map((seg) => (
            <div
              key={seg.id}
              className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start gap-3"
            >
              <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                <span className="text-[10px] font-mono text-slate-400">#{seg.order}</span>
                <span
                  className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    seg.section === 'hero'
                      ? 'bg-emerald-100 text-emerald-800'
                      : seg.section === 'pricing'
                      ? 'bg-blue-100 text-blue-800'
                      : seg.section === 'footer'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {seg.section}
                </span>
                <span className="text-[9px] font-mono text-slate-400">&lt;{seg.tag}&gt;</span>
              </div>

              <div className="text-xs text-slate-800 leading-relaxed flex-1">
                {seg.text}
              </div>
            </div>
          ))
        )}
      </div>

      {extractedContent.limitations.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-700 bg-amber-50/70 p-2.5 rounded border border-amber-200">
          <strong className="block font-semibold mb-0.5">Extraction Limitations:</strong>
          <ul className="list-disc pl-4 space-y-0.5">
            {extractedContent.limitations.map((lim, i) => (
              <li key={i}>{lim}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
