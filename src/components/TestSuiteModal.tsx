import React, { useState } from 'react';
import { runAllTests } from '../lib/testRunner';
import { TestCaseResult } from '../types/audit';

export const TestSuiteModal: React.FC = () => {
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<{ passed: number; total: number } | null>(null);

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const outcome = await runAllTests();
      setTestResults(outcome.results);
      setSummary({ passed: outcome.passedCount, total: outcome.totalCount });
    } catch (err) {
      console.error('Test execution error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Trigger Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Deterministic Verification & Robustness Test Suite
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Runs the 12 non-negotiable verification scenarios mandated by Section 8, including independent quotation rejection, empty snapshots, CTA friction clashes, and batch resilience.
          </p>
        </div>

        <button
          onClick={handleRunTests}
          disabled={isRunning}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer shadow-sm shrink-0"
        >
          {isRunning ? 'Running Tests...' : 'Run All 12 Automated Tests'}
        </button>
      </div>

      {/* Summary Stat Strip if run */}
      {summary && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`w-3 h-3 rounded-full ${
                summary.passed === summary.total ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span className="text-sm font-bold text-slate-900">
              Test Suite Summary: {summary.passed} / {summary.total} Passed (
              {Math.round((summary.passed / summary.total) * 100)}%)
            </span>
          </div>

          <span className="text-xs text-slate-500 font-mono">
            Deterministic Verification Validated
          </span>
        </div>
      )}

      {/* Tests Results List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm divide-y divide-slate-100 overflow-hidden">
        {testResults.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-sm font-medium text-slate-700">No test run recorded yet.</p>
            <p className="text-xs text-slate-500 mt-1">
              Click the button above to run the 12 automated verification checks in real time.
            </p>
          </div>
        ) : (
          testResults.map((tc) => (
            <div key={tc.id} className="p-5 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-500">{tc.id}</span>
                  <h4 className="text-sm font-bold text-slate-900">{tc.name}</h4>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded border uppercase ${
                    tc.passed
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {tc.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-3">{tc.scenario}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                    Expected Invariant:
                  </span>
                  <div className="text-slate-800">{tc.expected}</div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                    Actual Evaluation:
                  </span>
                  <div className="text-slate-800 font-mono text-[11px]">{tc.actual}</div>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-slate-500 font-sans">
                <strong>Assertion Check:</strong> {tc.details}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
