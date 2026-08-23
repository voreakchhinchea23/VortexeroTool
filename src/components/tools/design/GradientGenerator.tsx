import React, { useState } from 'react';
import { Sparkles, Copy, Plus, Trash2, RefreshCw, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

const PRESETS: { name: string; type: 'linear' | 'radial'; angle: number; stops: ColorStop[] }[] = [
  {
    name: 'Cyber Aurora',
    type: 'linear',
    angle: 135,
    stops: [
      { id: '1', color: '#3b82f6', position: 0 },
      { id: '2', color: '#8b5cf6', position: 50 },
      { id: '3', color: '#ec4899', position: 100 },
    ]
  },
  {
    name: 'Sunset Horizon',
    type: 'linear',
    angle: 90,
    stops: [
      { id: '1', color: '#f97316', position: 0 },
      { id: '2', color: '#ec4899', position: 50 },
      { id: '3', color: '#6366f1', position: 100 },
    ]
  },
  {
    name: 'Emerald Lagoon',
    type: 'linear',
    angle: 45,
    stops: [
      { id: '1', color: '#10b981', position: 0 },
      { id: '2', color: '#06b6d4', position: 50 },
      { id: '3', color: '#3b82f6', position: 100 },
    ]
  },
  {
    name: 'Deep Midnight',
    type: 'radial',
    angle: 0,
    stops: [
      { id: '1', color: '#1e1b4b', position: 0 },
      { id: '2', color: '#0f172a', position: 100 },
    ]
  },
  {
    name: 'Cosmic Flare',
    type: 'linear',
    angle: 160,
    stops: [
      { id: '1', color: '#8b5cf6', position: 0 },
      { id: '2', color: '#d946ef', position: 50 },
      { id: '3', color: '#f43f5e', position: 100 },
    ]
  },
];

export const GradientGenerator: React.FC = () => {
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState<number>(135);
  const [stops, setStops] = useState<ColorStop[]>([
    { id: '1', color: '#2563eb', position: 0 },
    { id: '2', color: '#7c3aed', position: 50 },
    { id: '3', color: '#db2777', position: 100 },
  ]);

  const { copyToClipboard } = useClipboard();

  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const stopsCssString = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');

  const cssRule =
    gradientType === 'linear'
      ? `linear-gradient(${angle}deg, ${stopsCssString})`
      : `radial-gradient(circle, ${stopsCssString})`;

  const fullCss = `background: ${cssRule};`;

  const handleAddStop = () => {
    if (stops.length >= 6) return;
    const newStop: ColorStop = {
      id: Math.random().toString(),
      color: '#06b6d4',
      position: Math.min(100, (stops[stops.length - 1]?.position || 0) + 20),
    };
    setStops([...stops, newStop]);
  };

  const handleUpdateStop = (id: string, updates: Partial<ColorStop>) => {
    setStops(stops.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleDeleteStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops(stops.filter(s => s.id !== id));
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setGradientType(preset.type);
    setAngle(preset.angle);
    setStops(preset.stops);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Preset List */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-bold text-slate-400 self-center mr-1">Presets:</span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => applyPreset(p)}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-brand-500 transition-all cursor-pointer"
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column (7/12) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Angle and Type */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gradient Type</span>
              <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                <button
                  onClick={() => setGradientType('linear')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    gradientType === 'linear' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Linear
                </button>
                <button
                  onClick={() => setGradientType('radial')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    gradientType === 'radial' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Radial
                </button>
              </div>
            </div>

            {gradientType === 'linear' && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Angle Direction</label>
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{angle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Color Stops Manager */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Color Stops ({stops.length}/6)</span>
              <button
                disabled={stops.length >= 6}
                onClick={handleAddStop}
                className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={14} />
                <span>Add Stop</span>
              </button>
            </div>

            <div className="space-y-3">
              {stops.map((stop) => (
                <div key={stop.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => handleUpdateStop(stop.id, { color: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 shrink-0"
                  />
                  <input
                    type="text"
                    value={stop.color}
                    onChange={(e) => handleUpdateStop(stop.id, { color: e.target.value })}
                    className="w-24 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs"
                  />
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stop.position}
                      onChange={(e) => handleUpdateStop(stop.id, { position: Number(e.target.value) })}
                      className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="font-mono text-xs w-10 text-right text-slate-500">{stop.position}%</span>
                  </div>
                  <button
                    disabled={stops.length <= 2}
                    onClick={() => handleDeleteStop(stop.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg disabled:opacity-30 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Canvas Preview (5/12) */}
        <div className="lg:col-span-5 space-y-4 sticky top-20">
          <div
            className="w-full h-64 rounded-3xl shadow-xl border border-white/20 dark:border-slate-800 transition-all duration-300 flex items-center justify-center p-6 text-white text-center font-bold text-xl drop-shadow-md"
            style={{ background: cssRule }}
          >
            Gradient Canvas Preview
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CSS Snippet</span>
              <button
                onClick={() => copyToClipboard(fullCss, 'CSS rule copied!')}
                className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Copy size={13} />
                <span>Copy CSS</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto select-all">
              {fullCss}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
