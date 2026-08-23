import React, { useState } from 'react';
import { Scale, Copy, ArrowRightLeft, Database, Ruler, Thermometer, Clock, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

type UnitCategory = 'storage' | 'length' | 'weight' | 'temp' | 'time';

const UNITS_DATA: Record<UnitCategory, { name: string; icon: any; units: { id: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[] }> = {
  storage: {
    name: 'Digital Storage',
    icon: Database,
    units: [
      { id: 'b', label: 'Bytes (B)', toBase: v => v, fromBase: v => v },
      { id: 'kb', label: 'Kilobytes (KB)', toBase: v => v * 1024, fromBase: v => v / 1024 },
      { id: 'mb', label: 'Megabytes (MB)', toBase: v => v * 1024 ** 2, fromBase: v => v / (1024 ** 2) },
      { id: 'gb', label: 'Gigabytes (GB)', toBase: v => v * 1024 ** 3, fromBase: v => v / (1024 ** 3) },
      { id: 'tb', label: 'Terabytes (TB)', toBase: v => v * 1024 ** 4, fromBase: v => v / (1024 ** 4) },
      { id: 'pb', label: 'Petabytes (PB)', toBase: v => v * 1024 ** 5, fromBase: v => v / (1024 ** 5) },
    ]
  },
  length: {
    name: 'Length & Distance',
    icon: Ruler,
    units: [
      { id: 'mm', label: 'Millimeters (mm)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'cm', label: 'Centimeters (cm)', toBase: v => v / 100, fromBase: v => v * 100 },
      { id: 'm', label: 'Meters (m)', toBase: v => v, fromBase: v => v },
      { id: 'km', label: 'Kilometers (km)', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'in', label: 'Inches (in)', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
      { id: 'ft', label: 'Feet (ft)', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { id: 'yd', label: 'Yards (yd)', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { id: 'mi', label: 'Miles (mi)', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    ]
  },
  weight: {
    name: 'Weight & Mass',
    icon: Scale,
    units: [
      { id: 'mg', label: 'Milligrams (mg)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'g', label: 'Grams (g)', toBase: v => v, fromBase: v => v },
      { id: 'kg', label: 'Kilograms (kg)', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'oz', label: 'Ounces (oz)', toBase: v => v * 28.3495, fromBase: v => v / 28.3495 },
      { id: 'lb', label: 'Pounds (lb)', toBase: v => v * 453.592, fromBase: v => v / 453.592 },
    ]
  },
  temp: {
    name: 'Temperature',
    icon: Thermometer,
    units: [
      { id: 'c', label: 'Celsius (°C)', toBase: v => v, fromBase: v => v },
      { id: 'f', label: 'Fahrenheit (°F)', toBase: v => (v - 32) * (5 / 9), fromBase: v => (v * 9) / 5 + 32 },
      { id: 'k', label: 'Kelvin (K)', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    ]
  },
  time: {
    name: 'Time Duration',
    icon: Clock,
    units: [
      { id: 'ms', label: 'Milliseconds (ms)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 's', label: 'Seconds (s)', toBase: v => v, fromBase: v => v },
      { id: 'min', label: 'Minutes (min)', toBase: v => v * 60, fromBase: v => v / 60 },
      { id: 'hr', label: 'Hours (hr)', toBase: v => v * 3600, fromBase: v => v / 3600 },
      { id: 'day', label: 'Days (d)', toBase: v => v * 86400, fromBase: v => v / 86400 },
    ]
  }
};

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('storage');
  const [inputValue, setInputValue] = useState<number>(1024);
  const [fromUnitId, setFromUnitId] = useState<string>('mb');
  const [toUnitId, setToUnitId] = useState<string>('gb');

  const { copyToClipboard } = useClipboard();

  const currentCategoryData = UNITS_DATA[category];

  const calculateResult = () => {
    const fromUnit = currentCategoryData.units.find(u => u.id === fromUnitId) || currentCategoryData.units[0];
    const toUnit = currentCategoryData.units.find(u => u.id === toUnitId) || currentCategoryData.units[1];

    const baseVal = fromUnit.toBase(inputValue);
    const converted = toUnit.fromBase(baseVal);

    return Number(converted.toPrecision(7));
  };

  const result = calculateResult();

  const handleSwap = () => {
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  };

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const units = UNITS_DATA[cat].units;
    setFromUnitId(units[0].id);
    setToUnitId(units[1]?.id || units[0].id);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {(Object.keys(UNITS_DATA) as UnitCategory[]).map(cat => {
          const item = UNITS_DATA[cat];
          const Icon = item.icon;
          const isActive = category === cat;

          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-brand-500'} />
              <span>{item.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Converter Calculation Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* From Column (2/5) */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">From</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-base font-bold"
            />
            <select
              value={fromUnitId}
              onChange={(e) => setFromUnitId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold cursor-pointer"
            >
              {currentCategoryData.units.map(u => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </div>

          {/* Swap Button (1/5) */}
          <div className="flex justify-center md:pt-6">
            <button
              onClick={handleSwap}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-brand-600 text-slate-600 dark:text-slate-300 transition-colors shadow-xs"
              title="Swap units"
            >
              <ArrowRightLeft size={18} />
            </button>
          </div>

          {/* To Column (2/5) */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">To (Result)</label>
            <div className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 font-mono text-base font-bold text-brand-600 dark:text-brand-400 truncate select-all">
              {result}
            </div>
            <select
              value={toUnitId}
              onChange={(e) => setToUnitId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold cursor-pointer"
            >
              {currentCategoryData.units.map(u => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => copyToClipboard(result.toString(), 'Converted result copied!')}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Copy size={13} />
            <span>Copy Converted Value</span>
          </button>
        </div>
      </div>
    </div>
  );
};
