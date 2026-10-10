import React from 'react';

export type ActiveTab = 'single' | 'dataset' | 'batch' | 'tests' | 'simulator';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onTriggerAudit: () => void;
  isAuditing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onTriggerAudit,
  isAuditing,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('single');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-slate-800 transition-colors"
        >
          MessageMatch Auditor
        </a>

        {/* Zone 2: 4-5 Concise Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('single')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'single'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            Audit Console
          </button>
          <button
            onClick={() => onSelectTab('dataset')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'dataset'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            60-Pair Dataset
          </button>
          <button
            onClick={() => onSelectTab('batch')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'batch'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            Batch Pipeline
          </button>
          <button
            onClick={() => onSelectTab('tests')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'tests'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            Verification Tests
          </button>
          <button
            onClick={() => onSelectTab('simulator')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'simulator'
                ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            Fix Simulator
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onTriggerAudit}
            disabled={isAuditing}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            {isAuditing ? 'Analyzing Content...' : 'Run Audit'}
          </button>
        </div>
      </div>
    </header>
  );
};
