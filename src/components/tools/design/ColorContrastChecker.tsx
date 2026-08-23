import React, { useState } from 'react';
import { Contrast, CheckCircle2, XCircle, ArrowLeftRight, Sparkles, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

export const ColorContrastChecker: React.FC = () => {
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');

  const { copyToClipboard } = useClipboard();

  // Helper to compute luminance & contrast
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    const bigint = parseInt(cleanHex.length === 3 ? cleanHex.split('').map(c => c + c).join('') : cleanHex, 16);
    if (isNaN(bigint)) return { r: 0, g: 0, b: 0 };
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getContrastRatio = (hex1: string, hex2: string) => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  };

  const ratio = getContrastRatio(fgColor, bgColor);
  const ratioRounded = ratio.toFixed(2);

  const tests = [
    { label: 'Normal Text (AA)', required: 4.5, passed: ratio >= 4.5 },
    { label: 'Normal Text (AAA)', required: 7.0, passed: ratio >= 7.0 },
    { label: 'Large Text (AA)', required: 3.0, passed: ratio >= 3.0 },
    { label: 'Large Text (AAA)', required: 4.5, passed: ratio >= 4.5 },
    { label: 'UI Components & Icons', required: 3.0, passed: ratio >= 3.0 },
  ];

  const handleInvert = () => {
    const temp = fgColor;
    setFgColor(bgColor);
    setBgColor(temp);
  };

  const samplePairs = [
    { name: 'Classic Slate', fg: '#0f172a', bg: '#ffffff' },
    { name: 'Dark Cyberpunk', fg: '#38bdf8', bg: '#0b0f19' },
    { name: 'Emerald Forest', fg: '#064e3b', bg: '#ecfdf5' },
    { name: 'Deep Violet', fg: '#f5f3ff', bg: '#4c1d95' },
    { name: 'Solar Warmth', fg: '#7c2d12', bg: '#ffedd5' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Sample Harmonious Pairs */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-bold text-slate-400 self-center mr-1">Presets:</span>
        {samplePairs.map((pair, idx) => (
          <button
            key={idx}
            onClick={() => {
              setFgColor(pair.fg);
              setBgColor(pair.bg);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-brand-500 transition-all cursor-pointer"
          >
            {pair.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Colors Selector (Left) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Color Pickers</h3>
            <button
              onClick={handleInvert}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeftRight size={13} />
              <span>Invert</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Text (Foreground) Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-12 h-12 rounded-2xl cursor-pointer bg-transparent border-0 shrink-0"
              />
              <input
                type="text"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Background Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-12 h-12 rounded-2xl cursor-pointer bg-transparent border-0 shrink-0"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm uppercase"
              />
            </div>
          </div>
        </div>

        {/* Live Score Display (Right) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Contrast Ratio</span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              ratio >= 7 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ratio >= 4.5 ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}>
              {ratio >= 7 ? 'Excellent' : ratio >= 4.5 ? 'Good' : 'Poor'}
            </span>
          </div>

          <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
            {ratioRounded} <span className="text-slate-400 text-2xl font-normal">: 1</span>
          </div>

          {/* Live Preview Sample */}
          <div
            className="p-5 rounded-2xl border border-slate-200/50 shadow-inner transition-colors duration-150"
            style={{ backgroundColor: bgColor, color: fgColor }}
          >
            <h4 className="text-lg font-bold">The quick brown fox jumps over the lazy dog.</h4>
            <p className="text-xs mt-1 opacity-90">
              Good typography contrast ensures high readability and accessibility for all users.
            </p>
          </div>
        </div>
      </div>

      {/* WCAG Compliance Badges Matrix */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          WCAG 2.1 Accessibility Matrix
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {tests.map((test, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                test.passed
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/25 text-rose-700 dark:text-rose-300'
              }`}
            >
              <div>
                <p className="text-xs font-bold">{test.label}</p>
                <p className="text-[11px] opacity-75 font-mono">Requires {test.required}:1</p>
              </div>
              <div>
                {test.passed ? <CheckCircle2 size={20} className="text-emerald-500" /> : <XCircle size={20} className="text-rose-500" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
