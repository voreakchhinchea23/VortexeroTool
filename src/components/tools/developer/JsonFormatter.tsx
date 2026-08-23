import React, { useState } from 'react';
import { FileJson, Copy, Download, Trash2, CheckCircle2, XCircle, Sparkles, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

const SAMPLE_JSON = `{
  "app": "VortexeroTool",
  "version": "1.0.0",
  "features": [
    "Password Generator",
    "QR Code Studio",
    "URL Shortener",
    "JSON Formatter"
  ],
  "developer": {
    "name": "Voreak Chhinchea",
    "role": "Fullstack Engineer"
  },
  "settings": {
    "theme": "dark",
    "offline_ready": true
  }
}`;

export const JsonFormatter: React.FC = () => {
  const [jsonText, setJsonText] = useState<string>(SAMPLE_JSON);
  const [indent, setIndent] = useState<number | 'tab' | 'minify'>(2);
  const [error, setError] = useState<string | null>(null);

  const { copyToClipboard } = useClipboard();

  const handleFormat = (indentType: number | 'tab' | 'minify' = indent) => {
    try {
      if (!jsonText.trim()) {
        setError(null);
        return;
      }
      const parsed = JSON.parse(jsonText);
      setError(null);

      if (indentType === 'minify') {
        setJsonText(JSON.stringify(parsed));
      } else if (indentType === 'tab') {
        setJsonText(JSON.stringify(parsed, null, '\t'));
      } else {
        setJsonText(JSON.stringify(parsed, null, indentType));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-2">Indentation:</span>
          <button
            onClick={() => {
              setIndent(2);
              handleFormat(2);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              indent === 2 ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            2 Spaces
          </button>
          <button
            onClick={() => {
              setIndent(4);
              handleFormat(4);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              indent === 4 ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            4 Spaces
          </button>
          <button
            onClick={() => {
              setIndent('tab');
              handleFormat('tab');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              indent === 'tab' ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Tabs
          </button>
          <button
            onClick={() => {
              setIndent('minify');
              handleFormat('minify');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              indent === 'minify' ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Minify / Compact
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setJsonText(SAMPLE_JSON);
              setError(null);
            }}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer mr-2"
          >
            <Sparkles size={13} />
            <span>Load Sample</span>
          </button>
          <button
            onClick={() => copyToClipboard(jsonText, 'JSON copied to clipboard!')}
            className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Copy size={13} />
            <span>Copy</span>
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Download JSON"
          >
            <Download size={15} />
          </button>
          <button
            onClick={() => {
              setJsonText('');
              setError(null);
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 hover:text-rose-500 text-slate-400 transition-colors"
            title="Clear"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Error / Success Status Banner */}
      {error ? (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
          <XCircle size={16} />
          <span>JSON Syntax Error: {error}</span>
        </div>
      ) : (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Valid JSON Structure</span>
        </div>
      )}

      {/* Editor Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5 space-y-3">
        <textarea
          rows={16}
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            try {
              if (e.target.value.trim()) {
                JSON.parse(e.target.value);
                setError(null);
              }
            } catch (err: unknown) {
              setError(err instanceof Error ? err.message : String(err));
            }
          }}
          placeholder="Paste JSON string here..."
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none resize-y leading-relaxed"
        />
      </div>
    </div>
  );
};
