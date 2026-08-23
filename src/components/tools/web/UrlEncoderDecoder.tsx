import React, { useState, useEffect } from 'react';
import { Split, Copy, ArrowDownUp, Plus, Trash2, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

interface QueryParam {
  key: string;
  value: string;
}

export const UrlEncoderDecoder: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('https://vortexero.dev/search?q=react+developer&sort=desc&category=tools');
  const [mode, setMode] = useState<'encode' | 'decode' | 'params'>('encode');
  const [encodedResult, setEncodedResult] = useState('');
  const [decodedResult, setDecodedResult] = useState('');
  const [queryParams, setQueryParams] = useState<QueryParam[]>([]);
  const [baseUrlPath, setBaseUrlPath] = useState('');

  const { copyToClipboard } = useClipboard();

  useEffect(() => {
    try {
      setEncodedResult(encodeURIComponent(inputUrl));
    } catch {
      setEncodedResult('Encoding error');
    }

    try {
      setDecodedResult(decodeURIComponent(inputUrl));
    } catch {
      setDecodedResult('Decoding error');
    }

    // Parse params
    try {
      const qIndex = inputUrl.indexOf('?');
      if (qIndex !== -1) {
        setBaseUrlPath(inputUrl.substring(0, qIndex));
        const searchStr = inputUrl.substring(qIndex + 1);
        const searchParams = new URLSearchParams(searchStr);
        const list: QueryParam[] = [];
        searchParams.forEach((val, key) => {
          list.push({ key, value: val });
        });
        setQueryParams(list);
      } else {
        setBaseUrlPath(inputUrl);
        setQueryParams([]);
      }
    } catch {
      // ignore
    }
  }, [inputUrl]);

  const handleUpdateParam = (index: number, key: string, value: string) => {
    const updated = [...queryParams];
    updated[index] = { key, value };
    setQueryParams(updated);
    reconstructUrl(baseUrlPath, updated);
  };

  const handleDeleteParam = (index: number) => {
    const updated = queryParams.filter((_, i) => i !== index);
    setQueryParams(updated);
    reconstructUrl(baseUrlPath, updated);
  };

  const handleAddParam = () => {
    const updated = [...queryParams, { key: '', value: '' }];
    setQueryParams(updated);
  };

  const reconstructUrl = (base: string, params: QueryParam[]) => {
    const validParams = params.filter(p => p.key.trim());
    if (validParams.length === 0) {
      setInputUrl(base);
      return;
    }
    const searchParams = new URLSearchParams();
    validParams.forEach(p => searchParams.append(p.key.trim(), p.value));
    setInputUrl(`${base}?${searchParams.toString()}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Mode Switcher */}
      <div className="flex p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md mx-auto">
        <button
          onClick={() => setMode('encode')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            mode === 'encode' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          URL Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            mode === 'decode' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          URL Decode
        </button>
        <button
          onClick={() => setMode('params')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            mode === 'params' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Query Params Editor
        </button>
      </div>

      {/* Input / Editor Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 dark:text-white">
            {mode === 'params' ? 'Base URL & Parameters' : 'Input URL or String'}
          </label>
        </div>

        <textarea
          rows={3}
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Paste URL or component string..."
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none resize-y"
        />

        {mode === 'params' && (
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Parsed Key-Value Parameters ({queryParams.length})
              </span>
              <button
                onClick={handleAddParam}
                className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus size={14} />
                <span>Add Param</span>
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {queryParams.map((param, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={param.key}
                    onChange={(e) => handleUpdateParam(idx, e.target.value, param.value)}
                    placeholder="Key (e.g. utm_source)"
                    className="w-1/3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                  />
                  <input
                    type="text"
                    value={param.value}
                    onChange={(e) => handleUpdateParam(idx, param.key, e.target.value)}
                    placeholder="Value (e.g. google)"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono"
                  />
                  <button
                    onClick={() => handleDeleteParam(idx)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete parameter"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Output Display Card */}
      {mode !== 'params' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {mode === 'encode' ? 'Encoded URL Output' : 'Decoded URL Output'}
            </span>
            <button
              onClick={() =>
                copyToClipboard(
                  mode === 'encode' ? encodedResult : decodedResult,
                  'Copied result!'
                )
              }
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Copy size={14} />
              <span>Copy Result</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 break-all select-all leading-relaxed">
            {mode === 'encode' ? encodedResult : decodedResult}
          </div>
        </div>
      )}
    </div>
  );
};
