import React, { useState, useEffect } from 'react';
import { Palette, Lock, Unlock, Copy, RefreshCw, Download, Sparkles, Sliders } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

interface ColorColumn {
  id: number;
  hex: string;
  locked: boolean;
}

export const ColorPaletteGenerator: React.FC = () => {
  const [colors, setColors] = useState<ColorColumn[]>([
    { id: 1, hex: '#3B82F6', locked: false },
    { id: 2, hex: '#8B5CF6', locked: false },
    { id: 3, hex: '#EC4899', locked: false },
    { id: 4, hex: '#F59E0B', locked: false },
    { id: 5, hex: '#10B981', locked: false },
  ]);

  const [harmony, setHarmony] = useState<'random' | 'analogous' | 'monochromatic' | 'warm' | 'cool'>('random');
  const { copyToClipboard } = useClipboard();

  // Helper: Random Hex
  const getRandomHex = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Helper: HSL to Hex
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  // Generate Harmonious Palette
  const generatePalette = () => {
    const baseHue = Math.floor(Math.random() * 360);

    setColors((prev) =>
      prev.map((col, idx) => {
        if (col.locked) return col;

        let newHex = getRandomHex();

        if (harmony === 'analogous') {
          const h = (baseHue + idx * 30) % 360;
          newHex = hslToHex(h, 75, 55 + (idx % 2) * 10);
        } else if (harmony === 'monochromatic') {
          newHex = hslToHex(baseHue, 70, 25 + idx * 15);
        } else if (harmony === 'warm') {
          const h = (Math.random() * 60 + 330) % 360; // Pinks, reds, oranges, yellows
          newHex = hslToHex(h, 80, 50 + idx * 5);
        } else if (harmony === 'cool') {
          const h = Math.floor(Math.random() * 120 + 160); // Greens, cyans, blues, purples
          newHex = hslToHex(h, 75, 50 + idx * 5);
        }

        return { ...col, hex: newHex };
      })
    );
  };

  // Listen for Spacebar key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        generatePalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [harmony]);

  const toggleLock = (id: number) => {
    setColors((prev) => prev.map((c) => (c.id === id ? { ...c, locked: !c.locked } : c)));
  };

  const exportCss = () => {
    const cssVars = `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`;
    copyToClipboard(cssVars, 'CSS variables copied to clipboard!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Harmony:</label>
          <select
            value={harmony}
            onChange={(e) => setHarmony(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="random">Random Vibrant</option>
            <option value="analogous">Analogous</option>
            <option value="monochromatic">Monochromatic</option>
            <option value="warm">Warm Palette</option>
            <option value="cool">Cool Palette</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCss}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Export CSS
          </button>
          <button
            onClick={generatePalette}
            className="px-5 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-fuchsia-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Generate (Spacebar)</span>
          </button>
        </div>
      </div>

      {/* Palette Stage Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-5 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 min-h-[460px]">
        {colors.map((col) => (
          <div
            key={col.id}
            className="relative flex flex-col justify-between p-6 transition-all duration-300 group select-none min-h-[140px] sm:min-h-[460px]"
            style={{ backgroundColor: col.hex }}
          >
            {/* Lock Button Top */}
            <div className="flex justify-end relative z-10">
              <button
                onClick={() => toggleLock(col.id)}
                className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                  col.locked
                    ? 'bg-black/40 text-white shadow-md'
                    : 'bg-black/15 text-white/70 hover:bg-black/30 hover:text-white opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
                }`}
                title={col.locked ? 'Unlock color' : 'Lock color'}
              >
                {col.locked ? <Lock size={15} /> : <Unlock size={15} />}
              </button>
            </div>

            {/* Hex Code & Copy Click */}
            <div className="text-center relative z-10">
              <button
                onClick={() => copyToClipboard(col.hex, `Copied ${col.hex} to clipboard!`)}
                className="px-3.5 py-1.5 rounded-2xl bg-black/40 hover:bg-black/60 text-white font-mono font-bold text-sm sm:text-base backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-lg inline-flex items-center gap-1.5"
                title="Click to copy HEX"
              >
                <span>{col.hex}</span>
                <Copy size={13} className="opacity-60" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
