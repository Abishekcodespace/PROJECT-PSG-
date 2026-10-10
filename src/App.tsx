import React, { useState, useEffect } from 'react';
import { SAMPLE_DATASET } from './data/sampleDataset';
import { Header, ActiveTab } from './components/Header';
import { AuditForm } from './components/AuditForm';
import { ScoreCard } from './components/ScoreCard';
import { FindingsList } from './components/FindingsList';
import { CtaMatchCard } from './components/CtaMatchCard';
import { PageHierarchyViewer } from './components/PageHierarchyViewer';
import { DatasetExplorer } from './components/DatasetExplorer';
import { BatchAuditRunner } from './components/BatchAuditRunner';
import { TestSuiteModal } from './components/TestSuiteModal';
import { BeforeAfterSimulator } from './components/BeforeAfterSimulator';
import { extractLandingPageContent } from './lib/extractor';
import { analyzeDeterministic } from './lib/analyzer';
import { AuditReport, DatasetItem, ExtractedPageContent, Industry } from './types/audit';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('single');

  // Form State initialized to FIN-01 (Same-day approval missing archetype)
  const defaultItem = SAMPLE_DATASET[0];
  const [adHeadline, setAdHeadline] = useState(defaultItem.adHeadline);
  const [adDescription, setAdDescription] = useState(defaultItem.adDescription);
  const [adCta, setAdCta] = useState(defaultItem.adCta);
  const [industry, setIndustry] = useState<Industry>(defaultItem.industry);
  const [landingPageUrl, setLandingPageUrl] = useState(defaultItem.landingPageUrl);
  const [snapshotHtml, setSnapshotHtml] = useState(defaultItem.snapshotHtml);
  const [useAi, setUseAi] = useState(false);

  // Audit state
  const [currentReport, setCurrentReport] = useState<AuditReport | null>(null);
  const [extractedContent, setExtractedContent] = useState<ExtractedPageContent | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // Batch state
  const [batchReports, setBatchReports] = useState<AuditReport[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  // Initial audit run on mount
  useEffect(() => {
    executeSingleAudit();
  }, []);

  const executeSingleAudit = async () => {
    setIsAuditing(true);
    try {
      // Extract DOM content for visual inspection
      const extracted = extractLandingPageContent(snapshotHtml, landingPageUrl);
      setExtractedContent(extracted);

      let report: AuditReport;

      // Try server endpoint
      try {
        const response = await fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            adHeadline,
            adDescription,
            adCta,
            industry,
            landingPageUrl,
            snapshotHtml,
            useAi,
          }),
        });

        if (response.ok) {
          report = await response.json();
        } else {
          // Fallback to client-side deterministic analyzer
          report = analyzeDeterministic({
            adHeadline,
            adDescription,
            adCta,
            industry,
            landingPageUrl,
            snapshotHtml,
          });
        }
      } catch {
        report = analyzeDeterministic({
          adHeadline,
          adDescription,
          adCta,
          industry,
          landingPageUrl,
          snapshotHtml,
        });
      }

      setCurrentReport(report);
    } catch (err) {
      console.error('Audit execution error:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSelectDatasetItem = (item: DatasetItem) => {
    setAdHeadline(item.adHeadline);
    setAdDescription(item.adDescription);
    setAdCta(item.adCta);
    setIndustry(item.industry);
    setLandingPageUrl(item.landingPageUrl);
    setSnapshotHtml(item.snapshotHtml);
    setActiveTab('single');

    // Run audit immediately with new item
    const extracted = extractLandingPageContent(item.snapshotHtml, item.landingPageUrl);
    setExtractedContent(extracted);
    const report = analyzeDeterministic({
      adId: item.id,
      adHeadline: item.adHeadline,
      adDescription: item.adDescription,
      adCta: item.adCta,
      industry: item.industry,
      landingPageUrl: item.landingPageUrl,
      snapshotHtml: item.snapshotHtml,
    });
    setCurrentReport(report);
  };

  const handleRunBatch = async (items: DatasetItem[]) => {
    setIsBatchProcessing(true);
    try {
      try {
        const response = await fetch('/api/batch-audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        });
        if (response.ok) {
          const data = await response.json();
          setBatchReports(data.reports);
          setActiveTab('batch');
          return;
        }
      } catch (e) {
        console.warn('Backend batch API failed, using client-side deterministic runner:', e);
      }

      // Client-side fallback batch runner
      const reports = items.map((item) =>
        analyzeDeterministic({
          adId: item.id,
          adHeadline: item.adHeadline,
          adDescription: item.adDescription,
          adCta: item.adCta,
          industry: item.industry,
          landingPageUrl: item.landingPageUrl,
          snapshotHtml: item.snapshotHtml,
        })
      );
      setBatchReports(reports);
      setActiveTab('batch');
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const downloadJsonReport = () => {
    if (!currentReport) return;
    const jsonStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(currentReport, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonStr;
    link.setAttribute('download', `message-match-audit-${currentReport.adid}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* 3-Zone Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onTriggerAudit={executeSingleAudit}
        isAuditing={isAuditing}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activeTab === 'single' && (
          <div className="space-y-8">
            {/* Ad & Landing Page Input Setup */}
            <AuditForm
              adHeadline={adHeadline}
              setAdHeadline={setAdHeadline}
              adDescription={adDescription}
              setAdDescription={setAdDescription}
              adCta={adCta}
              setAdCta={setAdCta}
              industry={industry}
              setIndustry={setIndustry}
              landingPageUrl={landingPageUrl}
              setLandingPageUrl={setLandingPageUrl}
              snapshotHtml={snapshotHtml}
              setSnapshotHtml={setSnapshotHtml}
              useAi={useAi}
              setUseAi={setUseAi}
              onRunAudit={executeSingleAudit}
              isAuditing={isAuditing}
            />

            {/* Audit Results View */}
            {currentReport && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      Message-Match Audit Report
                    </h2>
                    <span className="text-xs text-slate-500 font-mono">
                      ID: {currentReport.adid}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={downloadJsonReport}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      Export JSON Schema
                    </button>
                  </div>
                </div>

                {/* Score Card with Breakdown */}
                <ScoreCard report={currentReport} />

                {/* CTA Alignment Card */}
                <CtaMatchCard ctaMatch={currentReport.ctamatch} />

                {/* Findings List with Verified Quotes */}
                <FindingsList findings={currentReport.findings} />

                {/* DOM Hierarchy & Extracted Segments Inspector */}
                {extractedContent && (
                  <PageHierarchyViewer extractedContent={extractedContent} />
                )}
              </div>
            )}
          </div>
        )}

        {/* 60-Pair Dataset Explorer Tab */}
        {activeTab === 'dataset' && (
          <DatasetExplorer
            onSelectDatasetItem={handleSelectDatasetItem}
            onRunBatchWithAll={() => handleRunBatch(SAMPLE_DATASET)}
          />
        )}

        {/* Batch Pipeline Runner Tab */}
        {activeTab === 'batch' && (
          <BatchAuditRunner
            batchReports={batchReports}
            isProcessing={isBatchProcessing}
            onRunBatch={handleRunBatch}
            onViewSingleReport={(rep) => {
              setCurrentReport(rep);
              setAdHeadline(rep.adHeadline);
              setAdDescription(rep.adDescription);
              setAdCta(rep.adCta || '');
              setLandingPageUrl(rep.landingpageurl);
              setActiveTab('single');
            }}
          />
        )}

        {/* Automated Test Suite Tab (12 Non-Negotiable Criteria) */}
        {activeTab === 'tests' && <TestSuiteModal />}

        {/* Before-and-After Message Match Simulator Tab */}
        {activeTab === 'simulator' && <BeforeAfterSimulator />}
      </main>

      {/* Quiet Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>Ad-to-Landing-Page Message Match Auditor</span>
            <span className="mx-2">·</span>
            <span>Deterministic Grounding & Evidence Verification</span>
          </div>
          <div>
            <span>Offline-First Architecture</span>
            <span className="mx-2">·</span>
            <span>60 Benchmark Evaluation Pairs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
