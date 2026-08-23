import React, { useState } from 'react';
import { Layers, Copy, Sparkles, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

export const GlassmorphismGenerator: React.FC = () => {
  const [blur, setBlur] = useState<number>(16);
  const [opacity, setOpacity] = useState<number>(0.65);
  const [borderOpacity, setBorderOpacity] = useState<number>(0.2);
  const [borderWidth, setBorderWidth] = useState<number>(1);
  const [borderRadius, setBorderRadius] = useState<number>(24);
  const [shadowBlur, setShadowBlur] = useState<number>(25);

  const { copyToClipboard } = useClipboard();

  const generatedCss = `background: rgba(255, 255, 255, ${opacity});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: ${borderRadius}px;
border: ${borderWidth}px solid rgba(255, 255, 255, ${borderOpacity});
box-shadow: 0 8px ${shadowBlur}px 0 rgba(0, 0, 0, 0.25);`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sliders Configuration Column (6/12) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Layers size={18} className="text-brand-500" />
            <span>Glassmorphism Parameters</span>
          </div>

          {/* Blur */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Backdrop Blur</label>
              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Opacity */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Card Background Opacity</label>
              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Border Opacity */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Border Outline Opacity</label>
              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{Math.round(borderOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={borderOpacity}
              onChange={(e) => setBorderOpacity(Number(e.target.value))}
              className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Border Radius */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Border Radius</label>
              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{borderRadius}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="48"
              value={borderRadius}
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Shadow Blur */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Elevation Shadow</label>
              <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{shadowBlur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={shadowBlur}
              onChange={(e) => setShadowBlur(Number(e.target.value))}
              className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Live Visual Card Preview (6/12) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative overflow-hidden rounded-3xl h-80 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-8 flex items-center justify-center shadow-lg">
            {/* Colorful floating geometric spheres */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-amber-400 rounded-full blur-xs opacity-90 animate-pulse" />
            <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-cyan-400 rounded-full blur-xs opacity-90 animate-pulse" />
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-rose-500 rounded-full opacity-80" />

            {/* The Live Glass Card */}
            <div
              className="relative z-10 w-full max-w-sm p-6 text-slate-900 transition-all duration-150"
              style={{
                background: `rgba(255, 255, 255, ${opacity})`,
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                borderRadius: `${borderRadius}px`,
                border: `${borderWidth}px solid rgba(255, 255, 255, ${borderOpacity})`,
                boxShadow: `0 8px ${shadowBlur}px 0 rgba(0, 0, 0, 0.25)`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Glass UI Element</h4>
                  <p className="text-[11px] text-slate-700 font-medium">Vortexero Design System</p>
                </div>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed">
                Experience ultra-smooth translucent frosted glass design with dynamic blur and lighting shadows.
              </p>
            </div>
          </div>

          {/* Generated CSS Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CSS Code</span>
              <button
                onClick={() => copyToClipboard(generatedCss, 'Glassmorphism CSS copied!')}
                className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Copy size={13} />
                <span>Copy CSS</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto select-all">
              {generatedCss}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
