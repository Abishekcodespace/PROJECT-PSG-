import React, { useState } from 'react';
import { SAMPLE_DATASET } from '../data/sampleDataset';
import { DatasetItem, Industry } from '../types/audit';

interface AuditFormProps {
  adHeadline: string;
  setAdHeadline: (val: string) => void;
  adDescription: string;
  setAdDescription: (val: string) => void;
  adCta: string;
  setAdCta: (val: string) => void;
  industry: Industry;
  setIndustry: (val: Industry) => void;
  landingPageUrl: string;
  setLandingPageUrl: (val: string) => void;
  snapshotHtml: string;
  setSnapshotHtml: (val: string) => void;
  useAi: boolean;
  setUseAi: (val: boolean) => void;
  onRunAudit: () => void;
  isAuditing: boolean;
}

export const AuditForm: React.FC<AuditFormProps> = ({
  adHeadline,
  setAdHeadline,
  adDescription,
  setAdDescription,
  adCta,
  setAdCta,
  industry,
  setIndustry,
  landingPageUrl,
  setLandingPageUrl,
  snapshotHtml,
  setSnapshotHtml,
  useAi,
  setUseAi,
  onRunAudit,
  isAuditing,
}) => {
  const [sourceMode, setSourceMode] = useState<'preset' | 'custom' | 'live'>('preset');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('FIN-01');
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [liveFetchError, setLiveFetchError] = useState<string | null>(null);
  const [liveFetchSuccess, setLiveFetchSuccess] = useState<string | null>(null);

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const item = SAMPLE_DATASET.find((d) => d.id === id);
    if (item) {
      setAdHeadline(item.adHeadline);
      setAdDescription(item.adDescription);
      setAdCta(item.adCta);
      setIndustry(item.industry);
      setLandingPageUrl(item.landingPageUrl);
      setSnapshotHtml(item.snapshotHtml);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setSnapshotHtml(content);
      }
    };
    reader.readAsText(file);
  };

  const handleLiveFetch = async () => {
    if (!landingPageUrl) {
      setLiveFetchError('Please enter a valid URL.');
      return;
    }
    setIsFetchingLive(true);
    setLiveFetchError(null);
    setLiveFetchSuccess(null);

    try {
      const response = await fetch('/api/fetch-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: landingPageUrl }),
      });
      const data = await response.json();

      if (data.status === 'success' && data.html) {
        setSnapshotHtml(data.html);
        setLiveFetchSuccess(
          `Extracted ${data.extractedSegmentsCount} segments successfully from "${data.title || landingPageUrl}".`
        );
      } else {
        setLiveFetchError(
          data.error || 'Live URL extraction failed or blocked by server security.'
        );
      }
    } catch (err: any) {
      setLiveFetchError(`Network error: ${err.message}`);
    } finally {
      setIsFetchingLive(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Ad Creative & Destination Landing Page Setup
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare promises, pricing, benefits, and calls-to-action against rendered page segments.
          </p>
        </div>

        {/* Engine Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setUseAi(false)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              !useAi ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Deterministic Engine
          </button>
          <button
            type="button"
            onClick={() => setUseAi(true)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              useAi ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gemini 3.8 Flash Hybrid
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Ad Copy Inputs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Advertising Creative Details
            </span>

            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value as Industry)}
              className="text-xs font-medium border border-slate-200 rounded-md px-2 py-1 bg-slate-50 text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Financial Services">Financial Services</option>
              <option value="SaaS">SaaS</option>
              <option value="E-Commerce">E-Commerce</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Ad Headline <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Get Approved on the Same Day | Loans up to $50,000"
              value={adHeadline}
              onChange={(e) => setAdHeadline(e.target.value)}
              className="w-full text-xs font-medium p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none bg-slate-50/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Ad Description / Body Copy
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Fast, secure personal loan approval within 24 hours. No hidden origination fees..."
              value={adDescription}
              onChange={(e) => setAdDescription(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none bg-slate-50/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Ad Call-To-Action (CTA) Label
            </label>
            <input
              type="text"
              placeholder="e.g. Apply in 2 Minutes, Start 14-Day Free Trial, Shop 40% Off"
              value={adCta}
              onChange={(e) => setAdCta(e.target.value)}
              className="w-full text-xs font-medium p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none bg-slate-50/50"
            />
          </div>
        </div>

        {/* Right Column: Landing Page Source Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Landing Page Destination & Snapshot
            </span>

            {/* Source tabs */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSourceMode('preset')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  sourceMode === 'preset'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Presets (60)
              </button>
              <button
                type="button"
                onClick={() => setSourceMode('custom')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  sourceMode === 'custom'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Custom HTML
              </button>
              <button
                type="button"
                onClick={() => setSourceMode('live')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                  sourceMode === 'live'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Live URL
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Destination URL
            </label>
            <input
              type="text"
              placeholder="https://example.com/landing-page"
              value={landingPageUrl}
              onChange={(e) => setLandingPageUrl(e.target.value)}
              className="w-full text-xs font-mono p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none bg-slate-50/50"
            />
          </div>

          {/* Mode 1: Benchmark Presets */}
          {sourceMode === 'preset' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Load from 60 Ground-Truth Cases:
              </label>
              <select
                value={selectedPresetId}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="w-full text-xs font-medium p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none bg-slate-50 cursor-pointer"
              >
                <optgroup label="Financial Services (20 Cases)">
                  {SAMPLE_DATASET.filter((d) => d.industry === 'Financial Services').map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.id} — {d.title} ({d.expectedIssue.substring(0, 40)}...)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="SaaS Software (20 Cases)">
                  {SAMPLE_DATASET.filter((d) => d.industry === 'SaaS').map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.id} — {d.title} ({d.expectedIssue.substring(0, 40)}...)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Consumer E-Commerce (20 Cases)">
                  {SAMPLE_DATASET.filter((d) => d.industry === 'E-Commerce').map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.id} — {d.title} ({d.expectedIssue.substring(0, 40)}...)
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}

          {/* Mode 2: Custom HTML Paste or Upload */}
          {sourceMode === 'custom' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Snapshot HTML Content:
                </label>
                <label className="text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded cursor-pointer transition-colors">
                  Upload .html file
                  <input
                    type="file"
                    accept=".html,.htm,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <textarea
                rows={4}
                placeholder="<html><body><section class='hero'>...</section></body></html>"
                value={snapshotHtml}
                onChange={(e) => setSnapshotHtml(e.target.value)}
                className="w-full text-xs font-mono p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none bg-slate-50/50"
              />
            </div>
          )}

          {/* Mode 3: Optional Live URL Fetcher */}
          {sourceMode === 'live' && (
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600">
                Fetch and extract live HTML directly from destination web server (Subject to bot protections / network availability):
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLiveFetch}
                  disabled={isFetchingLive}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isFetchingLive ? 'Fetching Live...' : 'Fetch Live Landing Page'}
                </button>
              </div>

              {liveFetchSuccess && (
                <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded">
                  {liveFetchSuccess}
                </div>
              )}

              {liveFetchError && (
                <div className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded">
                  {liveFetchError}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Snapshot Status:{' '}
          <strong className="text-slate-700">
            {snapshotHtml ? `${snapshotHtml.length} characters loaded` : 'No snapshot loaded'}
          </strong>
        </span>

        <button
          type="button"
          onClick={onRunAudit}
          disabled={isAuditing || !adHeadline || !snapshotHtml}
          className="px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          {isAuditing ? 'Auditing Message Match...' : 'Audit Message Match Now'}
        </button>
      </div>
    </div>
  );
};
