import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Atom,
  Search,
  Copy,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Thermometer,
  Layers,
  LayoutGrid,
  ListFilter,
  GitCompare,
  TrendingUp,
  Info,
  Scale,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import {
  CHEMICAL_ELEMENTS,
  ELEMENT_CATEGORIES,
  ChemicalElement,
  ElementCategory,
  ElementState,
  ElementBlock,
  getElementCategoryMeta,
  getPhaseAtKelvin,
  toKhmerDigits
} from '../../../data/periodicTableData';

type ViewMode = 'table' | 'cards' | 'compare' | 'trends';
type LanguageMode = 'km' | 'en' | 'both';

export const PeriodicTable: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory | 'all'>('all');
  const [selectedState, setSelectedState] = useState<ElementState | 'all'>('all');
  const [selectedBlock, setSelectedBlock] = useState<ElementBlock | 'all'>('all');
  const [temperatureK, setTemperatureK] = useState<number>(293.15); // Room temperature ~20 °C
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [langMode, setLangMode] = useState<LanguageMode>('both');
  const [activeElement, setActiveElement] = useState<ChemicalElement | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [compareA, setCompareA] = useState<number>(1); // Hydrogen
  const [compareB, setCompareB] = useState<number>(6); // Carbon
  const [hoveredElement, setHoveredElement] = useState<ChemicalElement | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const { addToast } = useToast();

  // Convert Kelvin to Celsius
  const tempCelsius = useMemo(() => {
    return Math.round((temperatureK - 273.15) * 10) / 10;
  }, [temperatureK]);

  // Copy helper
  const handleCopy = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    addToast(`Copied ${label}`, text, 'success');
    setTimeout(() => setCopiedText(null), 2000);
  }, [addToast]);

  // Navigate elements in modal with arrow keys
  useEffect(() => {
    if (!activeElement) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        const prevNum = activeElement.number > 1 ? activeElement.number - 1 : 118;
        const prevEl = CHEMICAL_ELEMENTS.find(el => el.number === prevNum);
        if (prevEl) setActiveElement(prevEl);
      } else if (e.key === 'ArrowRight') {
        const nextNum = activeElement.number < 118 ? activeElement.number + 1 : 1;
        const nextEl = CHEMICAL_ELEMENTS.find(el => el.number === nextNum);
        if (nextEl) setActiveElement(nextEl);
      } else if (e.key === 'Escape') {
        setActiveElement(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeElement]);

  // Filter elements based on search, category, state, block
  const filteredElements = useMemo(() => {
    const q = search.trim().toLowerCase();

    return CHEMICAL_ELEMENTS.filter(el => {
      // Search match
      if (q) {
        const matchNum = String(el.number) === q;
        const matchSymbol = el.symbol.toLowerCase() === q || el.symbol.toLowerCase().startsWith(q);
        const matchNameEn = el.nameEn.toLowerCase().includes(q);
        const matchNameKm = el.nameKm.toLowerCase().includes(q);
        const matchCategory = el.category.toLowerCase().includes(q);
        const matchDiscovered = el.discoveredBy.toLowerCase().includes(q);
        if (!matchNum && !matchSymbol && !matchNameEn && !matchNameKm && !matchCategory && !matchDiscovered) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && el.category !== selectedCategory) {
        return false;
      }

      // State at current temperature filter
      if (selectedState !== 'all') {
        const phase = getPhaseAtKelvin(el, temperatureK);
        if (phase !== selectedState) return false;
      }

      // Block filter
      if (selectedBlock !== 'all' && el.block !== selectedBlock) {
        return false;
      }

      return true;
    });
  }, [search, selectedCategory, selectedState, selectedBlock, temperatureK]);

  // Set of matching element numbers for instant table dimming
  const activeNumberSet = useMemo(() => {
    return new Set(filteredElements.map(el => el.number));
  }, [filteredElements]);

  // Phase statistics at current temperature
  const phaseStats = useMemo(() => {
    let solids = 0;
    let liquids = 0;
    let gases = 0;
    let unknowns = 0;

    CHEMICAL_ELEMENTS.forEach(el => {
      const phase = getPhaseAtKelvin(el, temperatureK);
      if (phase === 'solid') solids++;
      else if (phase === 'liquid') liquids++;
      else if (phase === 'gas') gases++;
      else unknowns++;
    });

    return { solids, liquids, gases, unknowns };
  }, [temperatureK]);

  // Elements for Comparison
  const elementA = useMemo(() => {
    return CHEMICAL_ELEMENTS.find(el => el.number === compareA) || CHEMICAL_ELEMENTS[0];
  }, [compareA]);

  const elementB = useMemo(() => {
    return CHEMICAL_ELEMENTS.find(el => el.number === compareB) || CHEMICAL_ELEMENTS[5];
  }, [compareB]);

  // Bohr atomic model SVG generator
  const renderBohrModel = (element: ChemicalElement) => {
    const size = 260;
    const center = size / 2;
    const maxRadius = size / 2 - 16;
    const numShells = element.shells.length;
    const radiusStep = maxRadius / (numShells + 1);

    return (
      <div className="flex flex-col items-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          {/* Concentric shell orbits */}
          {element.shells.map((count, shellIdx) => {
            const radius = radiusStep * (shellIdx + 1.2);
            return (
              <g key={`shell-${shellIdx}`}>
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  className="text-cyan-500/30 dark:text-cyan-400/30"
                />
                {/* Electrons distributed along the ring */}
                {Array.from({ length: count }).map((_, electronIdx) => {
                  const angle = (2 * Math.PI * electronIdx) / count;
                  const ex = center + radius * Math.cos(angle);
                  const ey = center + radius * Math.sin(angle);
                  return (
                    <circle
                      key={`e-${shellIdx}-${electronIdx}`}
                      cx={ex}
                      cy={ey}
                      r={3.5}
                      className="fill-cyan-400 dark:fill-cyan-300 drop-shadow-[0_0_4px_rgba(6,182,212,0.8)]"
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Nucleus */}
          <circle
            cx={center}
            cy={center}
            r={18}
            className="fill-cyan-500/20 stroke-cyan-500 stroke-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
          />
          <text
            x={center}
            y={center + 4}
            textAnchor="middle"
            className="text-xs font-black fill-slate-900 dark:fill-white font-mono"
          >
            {element.symbol}
          </text>
        </svg>

        {/* Shell electron count legend */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap justify-center">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {langMode === 'km' ? 'ស្រទាប់អេឡិចត្រុង:' : 'Shells (K,L,M...):'}
          </span>
          {element.shells.map((electrons, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-bold border border-cyan-500/20"
            >
              {electrons}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Helper to render element cell in the 18-column periodic table
  const renderElementCell = (element: ChemicalElement) => {
    const isMatching = activeNumberSet.has(element.number);
    const catMeta = getElementCategoryMeta(element.category);
    const phase = getPhaseAtKelvin(element, temperatureK);
    const isHovered = hoveredElement?.number === element.number;
    const isRelated =
      hoveredElement &&
      hoveredElement.number !== element.number &&
      (hoveredElement.group === element.group ||
        hoveredElement.period === element.period ||
        hoveredElement.category === element.category);

    return (
      <button
        key={element.number}
        onClick={() => setActiveElement(element)}
        onMouseEnter={() => setHoveredElement(element)}
        onMouseLeave={() => setHoveredElement(null)}
        style={{
          gridColumnStart: element.gridCol,
          gridRowStart: element.gridRow,
        }}
        className={`group relative flex flex-col justify-between p-1.5 sm:p-2 rounded-xl transition-all duration-200 text-left border cursor-pointer select-none min-w-[56px] min-h-[64px] sm:min-w-[68px] sm:min-h-[74px] md:min-w-[76px] md:min-h-[80px] ${
          catMeta.bgClass
        } ${catMeta.borderClass} ${
          isMatching
            ? 'opacity-100 scale-100 hover:scale-105 hover:z-20 hover:shadow-lg ' + catMeta.glowClass
            : 'opacity-20 scale-95 hover:opacity-80'
        } ${isHovered ? 'ring-2 ring-cyan-400 shadow-xl z-20 scale-105' : ''} ${
          isRelated ? 'ring-1 ring-cyan-400/40' : ''
        }`}
      >
        {/* Top bar: Atomic Number & State Indicator */}
        <div className="flex items-center justify-between w-full">
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
            {langMode === 'km' ? toKhmerDigits(element.number) : element.number}
          </span>
          <span
            title={`Phase at ${temperatureK} K: ${phase}`}
            className={`w-2 h-2 rounded-full ${
              phase === 'gas'
                ? 'bg-rose-500'
                : phase === 'liquid'
                ? 'bg-sky-500'
                : phase === 'solid'
                ? 'bg-emerald-500'
                : 'bg-slate-400'
            }`}
          />
        </div>

        {/* Center: Symbol */}
        <div className="my-0.5 text-center">
          <div className="text-sm sm:text-base md:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
            {element.symbol}
          </div>
          {/* Name in Khmer, English or stacked */}
          <div className="truncate text-[9px] sm:text-[10px] font-medium text-slate-600 dark:text-slate-300 mt-0.5 leading-tight">
            {langMode === 'km' ? (
              element.nameKm
            ) : langMode === 'en' ? (
              element.nameEn
            ) : (
              <span className="block truncate">{element.nameEn}</span>
            )}
          </div>
        </div>

        {/* Bottom bar: Atomic Mass */}
        <div className="text-[8px] sm:text-[9px] font-mono text-slate-500 dark:text-slate-400 text-center truncate">
          {langMode === 'km' ? toKhmerDigits(element.atomicMass) : element.atomicMass}
        </div>
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Atom size={26} />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {langMode === 'km'
                      ? 'តារាងខួបនៃធាតុគីមី'
                      : langMode === 'en'
                      ? 'Periodic Table of Chemical Elements'
                      : 'តារាងខួបនៃធាតុគីមី - Periodic Table'}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    118 Elements (IUPAC)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {langMode === 'km'
                    ? 'តារាងខួបអន្តរកម្មកម្រិតខ្ពស់ គាំទ្រភាសាខ្មែរ និងអង់គ្លេស ម៉ូដែលអាតូមបូហរ (Bohr) ការប្រៀបធៀប និងនិន្នាការគីមី។'
                    : 'Interactive bilingual periodic table featuring 118 elements, Bohr atomic shell models, real-time temperature phase changes, and element comparison.'}
                </p>
              </div>
            </div>
          </div>

          {/* Top Controls: View Selector & Language Toggle */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* View Mode Buttons */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('table')}
                title="Standard 18-Column Table View"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid size={14} />
                <span>{langMode === 'km' ? 'តារាង' : 'Table'}</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                title="Card Grid View"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ListFilter size={14} />
                <span>{langMode === 'km' ? 'កាត' : 'Cards'}</span>
              </button>
              <button
                onClick={() => setViewMode('compare')}
                title="Compare Two Elements"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'compare'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <GitCompare size={14} />
                <span>{langMode === 'km' ? 'ប្រៀបធៀប' : 'Compare'}</span>
              </button>
              <button
                onClick={() => setViewMode('trends')}
                title="Periodic Trends & Guides"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'trends'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TrendingUp size={14} />
                <span>{langMode === 'km' ? 'និន្នាការ' : 'Trends'}</span>
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setLangMode('km')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  langMode === 'km'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ខ្មែរ
              </button>
              <button
                onClick={() => setLangMode('en')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  langMode === 'en'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLangMode('both')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  langMode === 'both'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ទាំងពីរ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Temperature & State Simulation Control */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <Thermometer size={18} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {langMode === 'km' ? 'ពិសោធន៍សីតុណ្ហភាព & សភាពរូបធាតុ' : 'Temperature & Phase Simulator'}
                </span>
                <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                  {temperatureK} K ({tempCelsius} °C)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {langMode === 'km'
                  ? 'រំកិលសីតុណ្ហភាពដើម្បីមើលការប្រែប្រួលសភាព រឹង រាវ និងឧស្ម័ននៃធាតុគីមីទាំងអស់ក្នុងពេលជាក់ស្តែង'
                  : 'Slide temperature to witness real-time solid, liquid, and gas state transitions across all 118 elements.'}
              </p>
            </div>
          </div>

          {/* Quick Temperature Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { k: 0, label: '0 K (-273 °C)' },
              { k: 293.15, label: '293 K (20 °C)' },
              { k: 373.15, label: '373 K (100 °C)' },
              { k: 6000, label: '6000 K (Sun)' },
            ].map(preset => (
              <button
                key={preset.k}
                onClick={() => setTemperatureK(preset.k)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-semibold transition-all ${
                  temperatureK === preset.k
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Temperature Slider & Live Phase Counters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-8 flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">0 K</span>
            <input
              type="range"
              min="0"
              max="6000"
              step="5"
              value={temperatureK}
              onChange={(e) => setTemperatureK(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <span className="text-xs font-mono text-slate-400">6000 K</span>
          </div>

          {/* Phase Statistics Counters */}
          <div className="lg:col-span-4 flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
            <button
              onClick={() => setSelectedState(selectedState === 'solid' ? 'all' : 'solid')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-xl font-medium transition-all ${
                selectedState === 'solid'
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{langMode === 'km' ? 'រឹង' : 'Solid'}:</span>
              <span className="font-mono font-bold">{phaseStats.solids}</span>
            </button>
            <button
              onClick={() => setSelectedState(selectedState === 'liquid' ? 'all' : 'liquid')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-xl font-medium transition-all ${
                selectedState === 'liquid'
                  ? 'bg-sky-500 text-white font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>{langMode === 'km' ? 'រាវ' : 'Liquid'}:</span>
              <span className="font-mono font-bold">{phaseStats.liquids}</span>
            </button>
            <button
              onClick={() => setSelectedState(selectedState === 'gas' ? 'all' : 'gas')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-xl font-medium transition-all ${
                selectedState === 'gas'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{langMode === 'km' ? 'ឧស្ម័ន' : 'Gas'}:</span>
              <span className="font-mono font-bold">{phaseStats.gases}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                langMode === 'km'
                  ? 'ស្វែងរកធាតុ (ឧទាហរណ៍៖ Fe, ដែក, Gold, មាស, 79, alkali)...'
                  : 'Search element (e.g., Fe, Gold, 79, alkali, nonmetal)...'
              }
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Block Selector (s, p, d, f) */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1">
              {langMode === 'km' ? 'ប្លុក:' : 'Block:'}
            </span>
            {(['all', 's', 'p', 'd', 'f'] as const).map(b => (
              <button
                key={b}
                onClick={() => setSelectedBlock(b)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                  selectedBlock === b
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Table Zoom Controls */}
          {viewMode === 'table' && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setZoom(prev => Math.max(0.7, prev - 0.1))}
                title="Zoom Out"
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <ZoomOut size={14} />
              </button>
              <button
                onClick={() => setZoom(1.0)}
                title="Reset Zoom"
                className="px-1.5 text-[11px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={() => setZoom(prev => Math.min(1.3, prev + 0.1))}
                title="Zoom In"
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <ZoomIn size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {langMode === 'km' ? 'ទាំងអស់ (១១៨)' : 'All (118)'}
          </button>
          {ELEMENT_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? cat.badgeBg + ' font-bold ring-1 ring-cyan-500'
                  : 'bg-slate-100 dark:bg-slate-800/80 border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.colorHex }} />
              <span>{langMode === 'km' ? cat.nameKm : cat.nameEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'table' && (
        <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-x-auto">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              transition: 'transform 0.15s ease-out',
            }}
            className="min-w-[1020px]"
          >
            {/* 18-Column Grid Layout */}
            <div
              className="grid gap-1.5 sm:gap-2"
              style={{
                gridTemplateColumns: 'repeat(18, minmax(54px, 1fr))',
                gridTemplateRows: 'repeat(10, minmax(64px, auto))',
              }}
            >
              {/* Group Numbers Headers along top */}
              {Array.from({ length: 18 }).map((_, idx) => (
                <div
                  key={`grp-${idx + 1}`}
                  style={{ gridColumnStart: idx + 1, gridRowStart: 1 }}
                  className="text-center text-[10px] font-mono font-bold text-slate-400 pb-1"
                >
                  {idx + 1}
                </div>
              ))}

              {/* Render all 118 Elements */}
              {CHEMICAL_ELEMENTS.map(element => renderElementCell(element))}

              {/* Lanthanide Placeholder in Group 3 Period 6 */}
              <div
                style={{ gridColumnStart: 3, gridRowStart: 6 }}
                onClick={() => setSelectedCategory('lanthanide')}
                className="flex flex-col items-center justify-center p-1.5 rounded-xl border border-dashed border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 text-center cursor-pointer hover:bg-fuchsia-500/20 transition-all"
              >
                <span className="text-[10px] font-bold font-mono">57-71</span>
                <span className="text-[10px] font-bold">La-Lu</span>
                <span className="text-[8px]">{langMode === 'km' ? 'ឡង់តាណូអ៊ីត' : 'Lanthanoids'}</span>
              </div>

              {/* Actinide Placeholder in Group 3 Period 7 */}
              <div
                style={{ gridColumnStart: 3, gridRowStart: 7 }}
                onClick={() => setSelectedCategory('actinide')}
                className="flex flex-col items-center justify-center p-1.5 rounded-xl border border-dashed border-pink-500/50 bg-pink-500/10 text-pink-600 dark:text-pink-400 text-center cursor-pointer hover:bg-pink-500/20 transition-all"
              >
                <span className="text-[10px] font-bold font-mono">89-103</span>
                <span className="text-[10px] font-bold">Ac-Lr</span>
                <span className="text-[8px]">{langMode === 'km' ? 'អាក់ទីណូអ៊ីត' : 'Actinoids'}</span>
              </div>

              {/* Row 8 is an aesthetic gap row */}
              <div
                style={{ gridColumnStart: 1, gridColumnEnd: 19, gridRowStart: 8 }}
                className="h-4"
              />

              {/* Bottom row labels for Lanthanide and Actinide series */}
              <div
                style={{ gridColumnStart: 1, gridColumnEnd: 4, gridRowStart: 9 }}
                className="flex items-center justify-end pr-2 text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400"
              >
                {langMode === 'km' ? 'ឡង់តាណូអ៊ីត (La-Lu)' : 'Lanthanides (57-71)'}
              </div>
              <div
                style={{ gridColumnStart: 1, gridColumnEnd: 4, gridRowStart: 10 }}
                className="flex items-center justify-end pr-2 text-xs font-bold text-pink-600 dark:text-pink-400"
              >
                {langMode === 'km' ? 'អាក់ទីណូអ៊ីត (Ac-Lr)' : 'Actinides (89-103)'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card Grid View (Alternative Responsive View) */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredElements.map(el => {
            const catMeta = getElementCategoryMeta(el.category);
            const phase = getPhaseAtKelvin(el, temperatureK);

            return (
              <button
                key={el.number}
                onClick={() => setActiveElement(el)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer ${
                  catMeta.bgClass
                } ${catMeta.borderClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    #{langMode === 'km' ? toKhmerDigits(el.number) : el.number}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-md bg-white/40 dark:bg-black/20">
                    {el.block}-block
                  </span>
                </div>

                <div className="my-3 text-center">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {el.symbol}
                  </div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {langMode === 'km' ? el.nameKm : el.nameEn}
                  </div>
                  {langMode === 'both' && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {el.nameKm}
                    </div>
                  )}
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-200/40 dark:border-slate-700/40 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>{langMode === 'km' ? 'ម៉ាស់:' : 'Mass:'}</span>
                    <span className="font-bold">{el.atomicMass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{langMode === 'km' ? 'សភាព:' : 'Phase:'}</span>
                    <span className="capitalize font-bold text-cyan-600 dark:text-cyan-400">
                      {phase}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Compare Mode */}
      {viewMode === 'compare' && (
        <div className="space-y-6">
          {/* Element Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {langMode === 'km' ? 'ជ្រើសរើសធាតុទី ១' : 'Select Element A'}
              </label>
              <select
                value={compareA}
                onChange={(e) => setCompareA(parseInt(e.target.value, 10))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                {CHEMICAL_ELEMENTS.map(el => (
                  <option key={el.number} value={el.number}>
                    {el.number}. {el.symbol} - {el.nameEn} ({el.nameKm})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {langMode === 'km' ? 'ជ្រើសរើសធាតុទី ២' : 'Select Element B'}
              </label>
              <select
                value={compareB}
                onChange={(e) => setCompareB(parseInt(e.target.value, 10))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                {CHEMICAL_ELEMENTS.map(el => (
                  <option key={el.number} value={el.number}>
                    {el.number}. {el.symbol} - {el.nameEn} ({el.nameKm})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Side-by-Side Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-4 font-bold text-slate-500 dark:text-slate-400 w-1/3">
                    {langMode === 'km' ? 'លក្ខណៈគីមី' : 'Property'}
                  </th>
                  <th className="py-3 px-4 font-black text-cyan-600 dark:text-cyan-400 w-1/3 text-base">
                    {elementA.symbol} - {langMode === 'km' ? elementA.nameKm : elementA.nameEn}
                  </th>
                  <th className="py-3 px-4 font-black text-cyan-600 dark:text-cyan-400 w-1/3 text-base">
                    {elementB.symbol} - {langMode === 'km' ? elementB.nameKm : elementB.nameEn}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-xs">
                <tr>
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                    {langMode === 'km' ? 'លេខអាតូម' : 'Atomic Number'}
                  </td>
                  <td className="py-3 px-4 font-bold">{elementA.number}</td>
                  <td className="py-3 px-4 font-bold">{elementB.number}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                    {langMode === 'km' ? 'ម៉ាស់អាតូមស្តង់ដារ' : 'Atomic Weight (u)'}
                  </td>
                  <td className="py-3 px-4 font-bold">{elementA.atomicMass}</td>
                  <td className="py-3 px-4 font-bold">{elementB.atomicMass}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                    {langMode === 'km' ? 'ក្រុមធាតុ' : 'Category'}
                  </td>
                  <td className="py-3 px-4 font-sans font-semibold">
                    {langMode === 'km'
                      ? getElementCategoryMeta(elementA.category).nameKm
                      : getElementCategoryMeta(elementA.category).nameEn}
                  </td>
                  <td className="py-3 px-4 font-sans font-semibold">
                    {langMode === 'km'
                      ? getElementCategoryMeta(elementB.category).nameKm
                      : getElementCategoryMeta(elementB.category).nameEn}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                    {langMode === 'km' ? 'ខួប / ក្រុម / ប្លុក' : 'Period / Group / Block'}
                  </td>
                  <td className="py-3 px-4">
                    P{elementA.period} / G{elementA.group} / {elementA.block}-block
                  </td>
                  <td className="py-3 px-4">
                    P{elementB.period} / G{elementB.group} / {elementB.block}-block
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                    {langMode === 'km' ? 'ទម្រង់អេឡិចត្រុង' : 'Electron Configuration'}
                  </td>
                  <td className="py-3 px-4 font-bold">{elementA.electronConfiguration}</td>
                  <td className="py-3 px-4 font-bold">{elementB.electronConfiguration}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                    {langMode === 'km' ? 'ស្រទាប់អេឡិចត្រុង' : 'Shell Electrons'}
                  </td>
                  <td className="py-3 px-4">{elementA.shells.join(', ')}</td>
                  <td className="py-3 px-4">{elementB.shells.join(', ')}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                    {langMode === 'km' ? 'ចំណុចរលាយ' : 'Melting Point'}
                  </td>
                  <td className="py-3 px-4">
                    {elementA.meltingPoint ? `${elementA.meltingPoint} K (${Math.round((elementA.meltingPoint - 273.15) * 10) / 10} °C)` : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {elementB.meltingPoint ? `${elementB.meltingPoint} K (${Math.round((elementB.meltingPoint - 273.15) * 10) / 10} °C)` : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                    {langMode === 'km' ? 'ចំណុចរំពុះ' : 'Boiling Point'}
                  </td>
                  <td className="py-3 px-4">
                    {elementA.boilingPoint ? `${elementA.boilingPoint} K (${Math.round((elementA.boilingPoint - 273.15) * 10) / 10} °C)` : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {elementB.boilingPoint ? `${elementB.boilingPoint} K (${Math.round((elementB.boilingPoint - 273.15) * 10) / 10} °C)` : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                    {langMode === 'km' ? 'ដង់ស៊ីតេ' : 'Density'}
                  </td>
                  <td className="py-3 px-4">
                    {elementA.density != null ? `${elementA.density} g/cm³` : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {elementB.density != null ? `${elementB.density} g/cm³` : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                    {langMode === 'km' ? 'អេឡិចត្រូអវិជ្ជមាន' : 'Electronegativity'}
                  </td>
                  <td className="py-3 px-4">
                    {elementA.electronegativity != null ? elementA.electronegativity : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {elementB.electronegativity != null ? elementB.electronegativity : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                    {langMode === 'km' ? 'រកឃើញដោយ' : 'Discovered By'}
                  </td>
                  <td className="py-3 px-4 font-sans">{elementA.discoveredBy} ({elementA.yearDiscovered})</td>
                  <td className="py-3 px-4 font-sans">{elementB.discoveredBy} ({elementB.yearDiscovered})</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Periodic Trends Cheatsheet View */}
      {viewMode === 'trends' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <TrendingUp size={18} />
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {langMode === 'km' ? 'កាំអាតូម (Atomic Radius)' : 'Atomic Radius'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {langMode === 'km'
                  ? 'កើនឡើងពីលើចុះក្រោមក្នុងក្រុមនីមួយៗ (ដោយសារបន្ថែមស្រទាប់អេឡិចត្រុងថ្មី) និងថយចុះពីឆ្វេងទៅស្តាំក្នុងខួបនីមួយៗ (ដោយសារបន្ទុកនុយក្លេអ៊ែរកើនឡើង ទាញស្រទាប់អេឡិចត្រុងឱ្យរួមតូច)។'
                  : 'Increases from top to bottom within a group (as additional electron shells are added) and decreases from left to right across a period (due to increasing nuclear charge pulling electrons closer).'}
              </p>
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-mono">
                {langMode === 'km' ? 'ធំបំផុត៖ ហ្វ្រង់ស្យូម (Fr) / សេស៊ីយូម (Cs) | តូចបំផុត៖ អេល្យូម (He)' : 'Largest: Francium (Fr) / Caesium (Cs) | Smallest: Helium (He)'}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  <Sparkles size={18} />
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {langMode === 'km' ? 'អេឡិចត្រូអវិជ្ជមាន (Electronegativity)' : 'Electronegativity'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {langMode === 'km'
                  ? 'សមត្ថភាពអាតូមក្នុងការទាក់ទាញគូអេឡិចត្រុងរួមសម្ព័ន្ធ។ កើនឡើងពីឆ្វេងទៅស្តាំក្នុងខួប និងថយចុះពីលើចុះក្រោមក្នុងក្រុម។'
                  : 'Measures the tendency of an atom to attract bonding electrons. Increases from left to right across a period and decreases from top to bottom within a group.'}
              </p>
              <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-700 dark:text-orange-300 text-xs font-mono">
                {langMode === 'km' ? 'ខ្ពស់បំផុត៖ ភ្លុយអ័រ (F, 3.98) | ទាបបំផុត៖ ហ្វ្រង់ស្យូម (Fr, 0.79)' : 'Highest: Fluorine (F, 3.98) | Lowest: Francium (Fr, 0.79)'}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Layers size={18} />
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {langMode === 'km' ? 'ថាមពលអ៊ីយ៉ូដកម្ម (Ionization Energy)' : 'Ionization Energy'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {langMode === 'km'
                  ? 'ថាមពលអប្បបរមាដែលត្រូវការដើម្បីដកអេឡិចត្រុងមួយចេញពីអាតូមអព្យាក្រឹតក្នុងសភាពឧស្ម័ន។ កើនឡើងពីឆ្វេងទៅស្តាំ និងថយចុះពីលើចុះក្រោម។'
                  : 'The minimum energy required to remove an electron from a neutral atom in its gaseous state. Increases from left to right and decreases from top to bottom.'}
              </p>
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-mono">
                {langMode === 'km' ? 'ខ្ពស់បំផុត៖ អេល្យូម (He) | ទាបបំផុត៖ ហ្វ្រង់ស្យូម (Fr)' : 'Highest: Helium (He) | Lowest: Francium (Fr)'}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Scale size={18} />
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {langMode === 'km' ? 'លក្ខណៈលោហៈ (Metallic Character)' : 'Metallic Character'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {langMode === 'km'
                  ? 'កម្រិតនៃភាពងាយស្រួលដែលអាតូមបាត់បង់អេឡិចត្រុង។ កើនឡើងពីស្តាំទៅឆ្វេង និងពីលើចុះក្រោម។ លោហៈសកម្មបំផុតនៅជ្រុងខាងឆ្វេងក្រោមនៃតារាង។'
                  : 'The level of reactivity and ease with which an element loses valence electrons. Increases right-to-left and top-to-bottom toward Francium/Caesium.'}
              </p>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-mono">
                {langMode === 'km' ? 'លោហៈខ្លាំងបំផុត៖ ហ្វ្រង់ស្យូម (Fr) / សេស៊ីយូម (Cs)' : 'Most Metallic: Francium (Fr) / Caesium (Cs)'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rich Element Detail Modal */}
      {activeElement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Top Navigation & Close */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const prevNum = activeElement.number > 1 ? activeElement.number - 1 : 118;
                    const prevEl = CHEMICAL_ELEMENTS.find(el => el.number === prevNum);
                    if (prevEl) setActiveElement(prevEl);
                  }}
                  title="Previous Element (Left Arrow)"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  {langMode === 'km'
                    ? `ធាតុទី ${toKhmerDigits(activeElement.number)} នៃ ១១៨`
                    : `Element #${activeElement.number} of 118`}
                </span>
                <button
                  onClick={() => {
                    const nextNum = activeElement.number < 118 ? activeElement.number + 1 : 1;
                    const nextEl = CHEMICAL_ELEMENTS.find(el => el.number === nextNum);
                    if (nextEl) setActiveElement(nextEl);
                  }}
                  title="Next Element (Right Arrow)"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <button
                onClick={() => setActiveElement(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Element Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border font-mono font-black ${
                    getElementCategoryMeta(activeElement.category).bgClass
                  } ${getElementCategoryMeta(activeElement.category).borderClass}`}
                >
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">
                    {activeElement.number}
                  </span>
                  <span className="text-2xl text-slate-900 dark:text-white leading-none mt-0.5">
                    {activeElement.symbol}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {activeElement.nameEn}
                    </h3>
                    <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
                      ({activeElement.nameKm})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        getElementCategoryMeta(activeElement.category).badgeBg
                      }`}
                    >
                      {langMode === 'km'
                        ? getElementCategoryMeta(activeElement.category).nameKm
                        : getElementCategoryMeta(activeElement.category).nameEn}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {activeElement.block}-block
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      Period {activeElement.period}, Group {activeElement.group}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  onClick={() =>
                    handleCopy(
                      `${activeElement.symbol} - ${activeElement.nameEn} (${activeElement.nameKm}), Z=${activeElement.number}, Mass=${activeElement.atomicMass} u, Config: ${activeElement.electronConfiguration}`,
                      'Element Summary'
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all cursor-pointer"
                >
                  {copiedText === 'Element Summary' ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                  <span>{langMode === 'km' ? 'ចម្លងព័ត៌មាន' : 'Copy Info'}</span>
                </button>
              </div>
            </div>

            {/* Main Details Grid: Bohr Model on Left, Properties on Right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Bohr Shell Visualization */}
              <div className="md:col-span-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {langMode === 'km' ? 'គំរូអាតូមបូហរ (Bohr Model)' : 'Bohr Atomic Model'}
                </div>
                {renderBohrModel(activeElement)}
                <div className="mt-3 text-center text-xs font-mono text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">
                    {activeElement.electronConfiguration}
                  </span>
                </div>
              </div>

              {/* Physical & Chemical Properties Grid */}
              <div className="md:col-span-7 space-y-4">
                {/* Summary Descriptions */}
                <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-1.5">
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {activeElement.summaryKm}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    {activeElement.summaryEn}
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="block text-[10px] font-sans text-slate-400 font-bold uppercase">
                      {langMode === 'km' ? 'ម៉ាស់អាតូមស្តង់ដារ' : 'Atomic Weight'}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeElement.atomicMass} u
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="block text-[10px] font-sans text-slate-400 font-bold uppercase">
                      {langMode === 'km' ? 'សភាពនៅ ២០ °C' : 'Standard State'}
                    </span>
                    <span className="text-sm font-bold capitalize text-cyan-600 dark:text-cyan-400">
                      {activeElement.standardState}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="block text-[10px] font-sans text-slate-400 font-bold uppercase">
                      {langMode === 'km' ? 'ចំណុចរលាយ' : 'Melting Point'}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeElement.meltingPoint
                        ? `${activeElement.meltingPoint} K (${Math.round((activeElement.meltingPoint - 273.15) * 10) / 10} °C)`
                        : 'Unknown'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="block text-[10px] font-sans text-slate-400 font-bold uppercase">
                      {langMode === 'km' ? 'ចំណុចរំពុះ' : 'Boiling Point'}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeElement.boilingPoint
                        ? `${activeElement.boilingPoint} K (${Math.round((activeElement.boilingPoint - 273.15) * 10) / 10} °C)`
                        : 'Unknown'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="block text-[10px] font-sans text-slate-400 font-bold uppercase">
                      {langMode === 'km' ? 'ដង់ស៊ីតេ' : 'Density'}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeElement.density != null ? `${activeElement.density} g/cm³` : 'N/A'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="block text-[10px] font-sans text-slate-400 font-bold uppercase">
                      {langMode === 'km' ? 'អេឡិចត្រូអវិជ្ជមាន' : 'Electronegativity'}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeElement.electronegativity != null ? activeElement.electronegativity : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Discovery details */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <span className="font-bold text-slate-500 dark:text-slate-400">
                    {langMode === 'km' ? 'ប្រវត្តិស្វែងរកឃើញ:' : 'Discovery:'}
                  </span>{' '}
                  <span className="text-slate-800 dark:text-slate-200">
                    {activeElement.discoveredBy} ({activeElement.yearDiscovered})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
