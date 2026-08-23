import React, { useState } from 'react';
import { Type, Copy, Download, Trash2, Check, Sparkles } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState('Supercharge your developer productivity with Vortexero Tools suite.');
  const { copyToClipboard } = useClipboard();

  const toSentenceCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const toCamelCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+|[-_]+/g, '');
  };

  const toPascalCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+|[-_]+/g, '');
  };

  const toSnakeCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]/g, '');
  };

  const toKebabCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  const toConstantCase = (str: string) => {
    return str
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]/g, '');
  };

  const toAlternatingCase = (str: string) => {
    return str
      .split('')
      .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
      .join('');
  };

  const toInverseCase = (str: string) => {
    return str
      .split('')
      .map(c => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
      .join('');
  };

  const conversions = [
    { label: 'Sentence case', fn: toSentenceCase },
    { label: 'lower case', fn: (s: string) => s.toLowerCase() },
    { label: 'UPPER CASE', fn: (s: string) => s.toUpperCase() },
    { label: 'Title Case', fn: toTitleCase },
    { label: 'camelCase', fn: toCamelCase },
    { label: 'PascalCase', fn: toPascalCase },
    { label: 'snake_case', fn: toSnakeCase },
    { label: 'kebab-case', fn: toKebabCase },
    { label: 'CONSTANT_CASE', fn: toConstantCase },
    { label: 'aLtErNaTiNg cAsE', fn: toAlternatingCase },
    { label: 'InVeRsE CaSe', fn: toInverseCase },
  ];

  const handleApply = (fn: (s: string) => string) => {
    setText(fn(text));
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted-text.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Transformation Action Buttons */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Transform Case Style
        </h3>
        <div className="flex flex-wrap gap-2">
          {conversions.map((conv, idx) => (
            <button
              key={idx}
              onClick={() => handleApply(conv.fn)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 hover:text-white dark:hover:bg-brand-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              {conv.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Stats Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span><strong>{wordCount}</strong> words</span>
            <span>•</span>
            <span><strong>{charCount}</strong> characters</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(text, 'Copied converted text!')}
              className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/25 active:scale-95 transition-all"
            >
              <Copy size={13} />
              <span>Copy</span>
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title="Download text file"
            >
              <Download size={14} />
            </button>
            <button
              onClick={() => setText('')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 hover:text-rose-500 text-slate-400 transition-colors"
              title="Clear all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text to convert..."
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-sans text-sm sm:text-base focus:ring-2 focus:ring-brand-500 focus:outline-none resize-y leading-relaxed"
        />
      </div>
    </div>
  );
};
