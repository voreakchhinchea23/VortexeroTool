import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Copy, Download, Sliders, Check } from 'lucide-react';
import { generateUUIDv4, generateNanoID } from '../../../utils/cryptoUtils';
import { useClipboard } from '../../../hooks/useClipboard';

export const UuidGenerator: React.FC = () => {
  const [type, setType] = useState<'v4' | 'nanoid'>('v4');
  const [quantity, setQuantity] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [removeHyphens, setRemoveHyphens] = useState<boolean>(false);
  const [addBraces, setAddBraces] = useState<boolean>(false);
  const [nanoidLength, setNanoidLength] = useState<number>(21);
  const [ids, setIds] = useState<string[]>([]);

  const { copyToClipboard } = useClipboard();

  const generateIds = useCallback(() => {
    const list: string[] = [];
    for (let i = 0; i < quantity; i++) {
      let id = '';
      if (type === 'v4') {
        id = generateUUIDv4();
        if (removeHyphens) id = id.replace(/-/g, '');
        if (uppercase) id = id.toUpperCase();
        else id = id.toLowerCase();
        if (addBraces) id = `{${id}}`;
      } else {
        id = generateNanoID(nanoidLength);
      }
      list.push(id);
    }
    setIds(list);
  }, [type, quantity, uppercase, removeHyphens, addBraces, nanoidLength]);

  useEffect(() => {
    generateIds();
  }, [generateIds]);

  const handleDownload = () => {
    const blob = new Blob([ids.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}-identifiers.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Parameters Panel */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Sliders size={18} className="text-brand-500" />
            <span>Identifier Configuration</span>
          </div>

          <div className="flex gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <button
              onClick={() => setType('v4')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                type === 'v4' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              UUID v4
            </button>
            <button
              onClick={() => setType('nanoid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                type === 'nanoid' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              NanoID
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Quantity</label>
              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{quantity}</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {type === 'nanoid' ? (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Length</label>
                <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{nanoidLength} chars</span>
              </div>
              <input
                type="range"
                min="6"
                max="64"
                value={nanoidLength}
                onChange={(e) => setNanoidLength(Number(e.target.value))}
                className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          ) : (
            <div className="sm:col-span-2 flex flex-wrap items-center gap-4 pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="w-4 h-4 accent-brand-600 rounded"
                />
                <span>UPPERCASE</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={removeHyphens}
                  onChange={(e) => setRemoveHyphens(e.target.checked)}
                  className="w-4 h-4 accent-brand-600 rounded"
                />
                <span>Remove Hyphens</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={addBraces}
                  onChange={(e) => setAddBraces(e.target.checked)}
                  className="w-4 h-4 accent-brand-600 rounded"
                />
                <span>Add Braces &#123;...&#125;</span>
              </label>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={generateIds}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-brand-500/20 active:scale-95 transition-all"
          >
            <RefreshCw size={14} />
            <span>Generate New</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(ids.join('\n'), 'Copied all generated IDs!')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Copy size={14} />
              <span>Copy All</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download size={14} />
              <span>Download (.txt)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Generated IDs Output Display */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Output ({ids.length} items)
        </h4>

        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {ids.map((id, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 font-mono text-sm group hover:border-brand-500/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-slate-400 w-6 shrink-0">{idx + 1}.</span>
                <span className="text-slate-800 dark:text-slate-200 truncate select-all">{id}</span>
              </div>
              <button
                onClick={() => copyToClipboard(id, 'Copied ID!')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0 ml-2"
                title="Copy single ID"
              >
                <Copy size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
