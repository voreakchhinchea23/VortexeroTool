import React, { useState, useMemo } from 'react';
import { GitCompare, Copy, RefreshCw, Plus, Minus, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

const SAMPLE_ORIGINAL = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

const SAMPLE_MODIFIED = `function calculateTotal(items, discount = 0) {
  // Use modern reduce array helper
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const finalTotal = subtotal * (1 - discount);
  return Math.round(finalTotal * 100) / 100;
}`;

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  originalLineNum?: number;
  modifiedLineNum?: number;
}

export const DiffChecker: React.FC = () => {
  const [originalText, setOriginalText] = useState(SAMPLE_ORIGINAL);
  const [modifiedText, setModifiedText] = useState(SAMPLE_MODIFIED);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');

  const { copyToClipboard } = useClipboard();

  // Simple line-by-line diff algorithm
  const diffResult = useMemo(() => {
    const origLines = originalText.split('\n');
    const modLines = modifiedText.split('\n');

    const lines: DiffLine[] = [];
    let addedCount = 0;
    let removedCount = 0;

    const maxLen = Math.max(origLines.length, modLines.length);
    for (let i = 0; i < maxLen; i++) {
      const o = origLines[i];
      const m = modLines[i];

      if (o === undefined) {
        lines.push({ type: 'added', text: m, modifiedLineNum: i + 1 });
        addedCount++;
      } else if (m === undefined) {
        lines.push({ type: 'removed', text: o, originalLineNum: i + 1 });
        removedCount++;
      } else if (o === m) {
        lines.push({ type: 'unchanged', text: o, originalLineNum: i + 1, modifiedLineNum: i + 1 });
      } else {
        lines.push({ type: 'removed', text: o, originalLineNum: i + 1 });
        lines.push({ type: 'added', text: m, modifiedLineNum: i + 1 });
        addedCount++;
        removedCount++;
      }
    }

    return { lines, addedCount, removedCount };
  }, [originalText, modifiedText]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'split' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Side-by-Side View
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'unified' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Unified Diff
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              +{diffResult.addedCount} lines
            </span>
            <span className="text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">
              -{diffResult.removedCount} lines
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setOriginalText(SAMPLE_ORIGINAL);
            setModifiedText(SAMPLE_MODIFIED);
          }}
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
        >
          Load Code Sample
        </button>
      </div>

      {/* Input Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Original Text / Code
          </label>
          <textarea
            rows={8}
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
          />
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Modified Text / Code
          </label>
          <textarea
            rows={8}
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
          />
        </div>
      </div>

      {/* Diff Result Rendering */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <GitCompare size={16} className="text-brand-500" />
            <span>Diff Output</span>
          </span>
          <button
            onClick={() =>
              copyToClipboard(
                diffResult.lines.map(l => `${l.type === 'added' ? '+' : l.type === 'removed' ? '-' : ' '} ${l.text}`).join('\n'),
                'Copied diff output!'
              )
            }
            className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Copy size={13} />
            <span>Copy Diff</span>
          </button>
        </div>

        <div className="rounded-2xl bg-slate-950 p-4 font-mono text-xs overflow-x-auto divide-y divide-slate-800/40">
          {diffResult.lines.map((line, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 py-1 px-2 rounded ${
                line.type === 'added'
                  ? 'bg-emerald-950/50 text-emerald-300 font-medium'
                  : line.type === 'removed'
                  ? 'bg-rose-950/50 text-rose-300 font-medium'
                  : 'text-slate-400'
              }`}
            >
              <span className="w-5 text-center font-bold shrink-0">
                {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
              </span>
              <span className="whitespace-pre flex-1">{line.text || ' '}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
