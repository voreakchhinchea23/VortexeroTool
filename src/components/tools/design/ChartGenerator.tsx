import React, { useState } from 'react';
import { BarChart3, PieChart, LineChart, Plus, Trash2, Download, Copy, Sparkles, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

type ChartType = 'bar' | 'line' | 'donut' | 'horizontal';

interface DataPoint {
  id: string;
  label: string;
  value: number;
}

const COLOR_PALETTES = {
  cyber: ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'],
  emerald: ['#10b981', '#059669', '#047857', '#065f46', '#34d399', '#6ee7b7'],
  sunset: ['#f43f5e', '#fb7185', '#f97316', '#fb923c', '#eab308', '#a855f7'],
  rainbow: ['#ef4444', '#f97316', '#eab308', '#10b981', '#3b82f6', '#8b5cf6'],
};

export const ChartGenerator: React.FC = () => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [title, setTitle] = useState('Monthly Project Analytics');
  const [paletteKey, setPaletteKey] = useState<keyof typeof COLOR_PALETTES>('cyber');

  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { id: '1', label: 'Jan', value: 45 },
    { id: '2', label: 'Feb', value: 78 },
    { id: '3', label: 'Mar', value: 62 },
    { id: '4', label: 'Apr', value: 95 },
    { id: '5', label: 'May', value: 120 },
    { id: '6', label: 'Jun', value: 85 },
  ]);

  const { copyToClipboard } = useClipboard();
  const colors = COLOR_PALETTES[paletteKey];

  const totalValue = dataPoints.reduce((sum, p) => sum + (p.value || 0), 0);
  const maxValue = Math.max(...dataPoints.map(p => p.value || 0), 1);

  const handleAddRow = () => {
    if (dataPoints.length >= 10) return;
    setDataPoints([
      ...dataPoints,
      { id: Date.now().toString(), label: `Item ${dataPoints.length + 1}`, value: 50 },
    ]);
  };

  const handleUpdate = (id: string, field: 'label' | 'value', val: string | number) => {
    setDataPoints(dataPoints.map(p => (p.id === id ? { ...p, [field]: val } : p)));
  };

  const handleDelete = (id: string) => {
    if (dataPoints.length <= 2) return;
    setDataPoints(dataPoints.filter(p => p.id !== id));
  };

  const handleDownloadSvg = () => {
    const svg = document.getElementById('generated-chart-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vortexero-chart-${chartType}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Chart Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'bar', label: 'Vertical Bar', icon: BarChart3 },
          { id: 'donut', label: 'Donut & Pie', icon: PieChart },
          { id: 'line', label: 'Line & Area', icon: LineChart },
          { id: 'horizontal', label: 'Progress Bars', icon: BarChart3 },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = chartType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setChartType(tab.id as ChartType)}
              className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-brand-500'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Data Inputs (5/12) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Chart Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold"
            />
          </div>

          {/* Color Palettes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Color Palette</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(COLOR_PALETTES) as (keyof typeof COLOR_PALETTES)[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPaletteKey(p)}
                  className={`p-2 rounded-xl border text-xs font-bold capitalize flex items-center gap-2 cursor-pointer ${
                    paletteKey === p ? 'border-brand-500 bg-brand-500/10' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex gap-1">
                    {COLOR_PALETTES[p].slice(0, 3).map((c, i) => (
                      <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span>{p}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Data Rows */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Data Points ({dataPoints.length})
              </span>
              <button
                onClick={handleAddRow}
                disabled={dataPoints.length >= 8}
                className="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
              >
                <Plus size={13} />
                <span>Add Row</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {dataPoints.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: colors[idx % colors.length] }} />
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleUpdate(item.id, 'label', e.target.value)}
                    placeholder="Label"
                    className="w-1/2 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => handleUpdate(item.id, 'value', Number(e.target.value))}
                    placeholder="Value"
                    className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
                  />
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={dataPoints.length <= 2}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 disabled:opacity-30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Graphic Canvas & Export (7/12) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Rendered Chart</span>
            <button
              onClick={handleDownloadSvg}
              className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Download size={13} />
              <span>Download SVG</span>
            </button>
          </div>

          {/* SVG Canvas */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/70 flex flex-col items-center justify-center min-h-[320px]">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-6 text-center">{title}</h4>

            {/* Vertical Bar Chart */}
            {chartType === 'bar' && (
              <svg id="generated-chart-svg" width="100%" height="240" viewBox="0 0 400 240" className="overflow-visible">
                <line x1="30" y1="200" x2="380" y2="200" stroke="#64748b" strokeWidth="1" strokeOpacity="0.4" />
                {dataPoints.map((p, i) => {
                  const barWidth = 320 / dataPoints.length - 12;
                  const x = 40 + i * (320 / dataPoints.length);
                  const barHeight = (p.value / maxValue) * 160;
                  const y = 200 - barHeight;
                  const color = colors[i % colors.length];

                  return (
                    <g key={p.id}>
                      <rect x={x} y={y} width={barWidth} height={barHeight} fill={color} rx="6" />
                      <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                        {p.value}
                      </text>
                      <text x={x + barWidth / 2} y="218" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold">
                        {p.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Donut Chart */}
            {chartType === 'donut' && (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <svg id="generated-chart-svg" width="200" height="200" viewBox="0 0 200 200">
                  {(() => {
                    let cumulativeAngle = 0;
                    return dataPoints.map((p, i) => {
                      const percentage = (p.value || 0) / (totalValue || 1);
                      const angle = percentage * 360;
                      const x1 = 100 + 70 * Math.cos((Math.PI * (cumulativeAngle - 90)) / 180);
                      const y1 = 100 + 70 * Math.sin((Math.PI * (cumulativeAngle - 90)) / 180);
                      cumulativeAngle += angle;
                      const x2 = 100 + 70 * Math.cos((Math.PI * (cumulativeAngle - 90)) / 180);
                      const y2 = 100 + 70 * Math.sin((Math.PI * (cumulativeAngle - 90)) / 180);
                      const largeArc = angle > 180 ? 1 : 0;
                      const d = `M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`;

                      return <path key={p.id} d={d} fill={colors[i % colors.length]} stroke="#090d16" strokeWidth="2" />;
                    });
                  })()}
                  {/* Center cutout */}
                  <circle cx="100" cy="100" r="42" fill="#090d16" />
                  <text x="100" y="104" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                    {totalValue}
                  </text>
                </svg>

                {/* Legend */}
                <div className="space-y-1.5 text-xs">
                  {dataPoints.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{p.label}:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {p.value} ({Math.round(((p.value || 0) / (totalValue || 1)) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Line / Area Chart */}
            {chartType === 'line' && (
              <svg id="generated-chart-svg" width="100%" height="220" viewBox="0 0 400 220" className="overflow-visible">
                {(() => {
                  const points = dataPoints.map((p, i) => {
                    const x = 40 + i * (320 / (dataPoints.length - 1 || 1));
                    const y = 180 - (p.value / maxValue) * 140;
                    return { x, y, val: p.value, label: p.label };
                  });

                  const pathD = points.map((pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `L ${pt.x} ${pt.y}`)).join(' ');
                  const areaD = `${pathD} L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z`;

                  return (
                    <g>
                      <path d={areaD} fill={colors[0]} fillOpacity="0.15" />
                      <path d={pathD} fill="none" stroke={colors[0]} strokeWidth="3" strokeLinecap="round" />
                      {points.map((pt, idx) => (
                        <g key={idx}>
                          <circle cx={pt.x} cy={pt.y} r="5" fill={colors[0]} stroke="#090d16" strokeWidth="2" />
                          <text x={pt.x} y={pt.y - 10} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                            {pt.val}
                          </text>
                          <text x={pt.x} y="200" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold">
                            {pt.label}
                          </text>
                        </g>
                      ))}
                    </g>
                  );
                })()}
              </svg>
            )}

            {/* Horizontal Progress Bars */}
            {chartType === 'horizontal' && (
              <div className="w-full space-y-3">
                {dataPoints.map((p, i) => {
                  const percent = Math.round((p.value / maxValue) * 100);
                  const color = colors[i % colors.length];

                  return (
                    <div key={p.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">{p.label}</span>
                        <span className="font-mono text-slate-900 dark:text-white font-bold">{p.value} ({percent}%)</span>
                      </div>
                      <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${percent}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
