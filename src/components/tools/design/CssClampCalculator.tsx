import React, { useState } from 'react';
import { Maximize2, Copy, Sparkles, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

export const CssClampCalculator: React.FC = () => {
  const [minWidth, setMinWidth] = useState<number>(375);
  const [maxWidth, setMaxWidth] = useState<number>(1440);
  const [minValue, setMinValue] = useState<number>(16);
  const [maxValue, setMaxValue] = useState<number>(36);
  const [testViewport, setTestViewport] = useState<number>(800);

  const { copyToClipboard } = useClipboard();

  // Clamp mathematical calculation formula:
  // slope = (maxSize - minSize) / (maxWidth - minWidth)
  // yIntersection = -minWidth * slope + minSize
  // preferred = `${(yIntersection / 16).toFixed(4)}rem + ${(slope * 100).toFixed(4)}vw`
  const calculateClamp = () => {
    const slope = (maxValue - minValue) / (maxWidth - minWidth);
    const yIntersection = -minWidth * slope + minValue;

    const minRem = (minValue / 16).toFixed(4).replace(/\.?0+$/, '') + 'rem';
    const maxRem = (maxValue / 16).toFixed(4).replace(/\.?0+$/, '') + 'rem';
    const yRem = (yIntersection / 16).toFixed(4).replace(/\.?0+$/, '') + 'rem';
    const slopeVw = (slope * 100).toFixed(4).replace(/\.?0+$/, '') + 'vw';

    const preferred = `${yRem} + ${slopeVw}`;
    const clampFormula = `clamp(${minRem}, ${preferred}, ${maxRem})`;

    // Calculate current simulated size at testViewport
    let simulatedPx = minValue + slope * (testViewport - minWidth);
    simulatedPx = Math.max(minValue, Math.min(maxValue, simulatedPx));

    return {
      clampFormula,
      simulatedPx: Math.round(simulatedPx * 10) / 10,
    };
  };

  const { clampFormula, simulatedPx } = calculateClamp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Parameters Panel */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Minimum Viewport Width (px)
            </label>
            <input
              type="number"
              value={minWidth}
              onChange={(e) => setMinWidth(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Maximum Viewport Width (px)
            </label>
            <input
              type="number"
              value={maxWidth}
              onChange={(e) => setMaxWidth(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Minimum Size (px) (e.g. Mobile font)
            </label>
            <input
              type="number"
              value={minValue}
              onChange={(e) => setMinValue(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Maximum Size (px) (e.g. Desktop font)
            </label>
            <input
              type="number"
              value={maxValue}
              onChange={(e) => setMaxValue(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-mono"
            />
          </div>
        </div>
      </div>

      {/* Output Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Generated CSS clamp() Rule
          </span>
          <button
            onClick={() => copyToClipboard(`font-size: ${clampFormula};`, 'CSS clamp() copied!')}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Copy size={13} />
            <span>Copy CSS</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-sm sm:text-base font-bold text-brand-600 dark:text-brand-400 select-all">
          font-size: {clampFormula};
        </div>
      </div>

      {/* Interactive Scaling Simulator */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Interactive Viewport Scaling Slider
          </label>
          <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
            Viewport: {testViewport}px • Computed Size: <strong className="text-brand-500">{simulatedPx}px</strong>
          </span>
        </div>

        <input
          type="range"
          min={minWidth}
          max={maxWidth}
          value={testViewport}
          onChange={(e) => setTestViewport(Number(e.target.value))}
          className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
        />

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/70 overflow-hidden">
          <p
            className="font-bold text-slate-900 dark:text-white transition-all duration-75 leading-tight"
            style={{ fontSize: `${simulatedPx}px` }}
          >
            Fluid Responsive Typography
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Scales smoothly from {minValue}px on mobile ({minWidth}px) to {maxValue}px on desktop ({maxWidth}px).
          </p>
        </div>
      </div>
    </div>
  );
};
