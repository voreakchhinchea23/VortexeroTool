import React, { useState } from 'react';
import { Binary, Copy, Upload, Image as ImageIcon, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

export const Base64Tool: React.FC = () => {
  const [tab, setTab] = useState<'text' | 'image'>('text');
  const [textInput, setTextInput] = useState('Hello Vortexero!');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  
  // Image to Base64 states
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');

  const { copyToClipboard } = useClipboard();

  const getProcessedText = () => {
    try {
      if (mode === 'encode') {
        return btoa(unescape(encodeURIComponent(textInput)));
      } else {
        return decodeURIComponent(escape(atob(textInput)));
      }
    } catch {
      return 'Invalid Base64 string';
    }
  };

  const processedText = getProcessedText();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');

    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Type Selector */}
      <div className="flex p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-xs mx-auto">
        <button
          onClick={() => setTab('text')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'text' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Text Encode/Decode
        </button>
        <button
          onClick={() => setTab('image')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'image' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Image to Base64
        </button>
      </div>

      {tab === 'text' ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('encode')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'encode' ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Encode to Base64
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'decode' ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Decode from Base64
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Input String
            </label>
            <textarea
              rows={4}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text to convert..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none resize-y"
            />
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {mode === 'encode' ? 'Base64 Result' : 'Plain Text Result'}
              </span>
              <button
                onClick={() => copyToClipboard(processedText, 'Copied result!')}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/25 active:scale-95 transition-all"
              >
                <Copy size={13} />
                <span>Copy</span>
              </button>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 break-all select-all leading-relaxed">
              {processedText}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          {/* File Upload Zone */}
          <label className="flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 bg-slate-50/50 dark:bg-slate-950/50 cursor-pointer transition-all">
            <Upload size={32} className="text-brand-500 mb-2" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Click to select or drag & drop an image
            </span>
            <span className="text-xs text-slate-400 mt-1">PNG, JPG, SVG, WebP, GIF (up to 10MB)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {imageDataUrl && (
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <img src={imageDataUrl} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs">{fileName}</p>
                    <p className="text-xs text-slate-400 font-mono">{fileSize}</p>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(imageDataUrl, 'Data URI copied to clipboard!')}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/25 active:scale-95 transition-all"
                >
                  <Copy size={14} />
                  <span>Copy Data URI</span>
                </button>
              </div>

              <textarea
                rows={5}
                readOnly
                value={imageDataUrl}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 select-all"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
