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
  ArrowRight,
  ArrowDown
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
      const activeTag = (document.activeElement as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) {
        return;
      }
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
        const matchNum = String(el.number) === q || toKhmerDigits(el.number) === q;
        const matchSymbol = el.symbol.toLowerCase() === q || el.symbol.toLowerCase().startsWith(q);
        const matchNameEn = el.nameEn.toLowerCase().includes(q);
        const matchNameKm = el.nameKm.toLowerCase().includes(q);
        const catMeta = getElementCategoryMeta(el.category);
        const matchCategory =
          el.category.toLowerCase().includes(q) ||
          catMeta.nameEn.toLowerCase().includes(q) ||
          catMeta.nameKm.toLowerCase().includes(q);
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

  // Atomic mass formatting helper
  const formatMass = (mass: number): string => {
    if (Number.isInteger(mass)) return String(mass);
    const rounded = Math.round(mass * 1000) / 1000;
    return String(rounded);
  };

  // Bohr atomic model SVG generator
  const renderBohrModel = (element: ChemicalElement, size: number = 260) => {
    const center = size / 2;
    const isCompact = size < 180;
    const nucleusRadius = isCompact ? Math.max(10, size * 0.08) : 18;
    const minOrbitRadius = isCompact ? Math.max(18, size * 0.16) : 32;
    const maxOrbitRadius = isCompact ? Math.max(42, size * 0.44) : 114;
    const numShells = element.shells.length;

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
            const radius =
              numShells === 1
                ? (minOrbitRadius + maxOrbitRadius) / 2
                : minOrbitRadius + (shellIdx / (numShells - 1)) * (maxOrbitRadius - minOrbitRadius);
            const electronRadius = isCompact ? (count > 20 ? 1.8 : 2.2) : count > 20 ? 2.7 : 3.5;

            return (
              <g key={`shell-${shellIdx}`}>
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={isCompact ? 0.75 : 1}
                  strokeDasharray={isCompact ? '2 2' : '3 3'}
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
                      r={electronRadius}
                      className="fill-cyan-400 dark:fill-cyan-300 drop-shadow-[0_0_3px_rgba(6,182,212,0.8)]"
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
            r={nucleusRadius}
            className="fill-cyan-500/20 stroke-cyan-500 stroke-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
          />
          <text
            x={center}
            y={center + (isCompact ? 3.5 : 4)}
            textAnchor="middle"
            className={`${isCompact ? 'text-[10px]' : 'text-xs'} font-black fill-slate-900 dark:fill-white font-mono`}
          >
            {element.symbol}
          </text>
        </svg>

        {/* Shell electron count legend */}
        {!isCompact && (
          <div className="mt-3 flex items-center gap-1.5 flex-wrap justify-center">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {langMode === 'km' ? 'ស្រទាប់អេឡិចត្រុង:' : 'Shells (K,L,M...):'}
            </span>
            {element.shells.map((electrons, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-bold border border-cyan-500/20"
              >
                {langMode === 'km' ? toKhmerDigits(electrons) : electrons}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Helper to render element cell in the 19-column periodic table
  const renderElementCell = (element: ChemicalElement) => {
    const isMatching = activeNumberSet.has(element.number);
    const catMeta = getElementCategoryMeta(element.category);
    const phase = getPhaseAtKelvin(element, temperatureK);
    const isHovered = hoveredElement?.number === element.number;
    const isRelated =
      hoveredElement != null &&
      hoveredElement.number !== element.number &&
      (hoveredElement.group === element.group ||
        hoveredElement.period === element.period);

    const phaseColor =
      phase === 'gas'
        ? 'bg-rose-500 shadow-rose-500/40'
        : phase === 'liquid'
        ? 'bg-sky-500 shadow-sky-500/40'
        : phase === 'solid'
        ? 'bg-emerald-500 shadow-emerald-500/40'
        : 'bg-slate-400';

    const displayMass = formatMass(element.atomicMass);

    return (
      <button
        key={element.number}
        onClick={() => setActiveElement(element)}
        onMouseEnter={() => setHoveredElement(element)}
        onMouseLeave={() => setHoveredElement(null)}
        style={{
          gridColumnStart: element.gridCol + 1,
          gridRowStart: element.gridRow + 1,
        }}
        className={`group relative flex flex-col justify-between w-full h-full pt-1.5 px-1.5 pb-1 rounded-lg transition-all duration-150 text-left border cursor-pointer select-none box-border overflow-hidden backdrop-blur-sm ${
          catMeta.bgClass
        } ${catMeta.borderClass} ${
          isMatching
            ? 'opacity-100'
            : 'opacity-20 hover:opacity-75 grayscale-[60%] hover:grayscale-0'
        } ${
          isHovered
            ? 'z-30 ring-2 ring-cyan-400 dark:ring-cyan-300 shadow-xl ' + catMeta.glowClass + ' scale-[1.04]'
            : ''
        } ${
          !isHovered && isRelated
            ? 'ring-1 ring-cyan-400/30 bg-cyan-500/5'
            : ''
        }`}
      >
        {/* Top category accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-lg transition-colors"
          style={{ backgroundColor: catMeta.colorHex }}
        />

        {/* Top bar: Atomic Number & State Indicator */}
        <div className="flex items-center justify-between w-full pt-0.5">
          <span className="text-[10.5px] font-mono font-bold text-slate-500 dark:text-slate-400 leading-none">
            {langMode === 'km' ? toKhmerDigits(element.number) : element.number}
          </span>
          <span
            title={`${langMode === 'km' ? 'សភាព' : 'State'}: ${phase} (${temperatureK} K)`}
            className={`w-2 h-2 rounded-full ${phaseColor} ring-1 ring-white/60 dark:ring-slate-900/60 shadow-sm`}
          />
        </div>

        {/* Center: Symbol & Name */}
        <div className="text-center my-auto w-full px-0.5">
          <div className="text-[21px] font-black tracking-tight text-slate-900 dark:text-white leading-none">
            {element.symbol}
          </div>
          <div className="mt-1 w-full overflow-hidden">
            {langMode === 'km' ? (
              <div className="text-[9.5px] font-medium text-slate-700 dark:text-slate-200 truncate leading-normal">
                {element.nameKm}
              </div>
            ) : langMode === 'en' ? (
              <div className="text-[9.5px] font-semibold text-slate-700 dark:text-slate-200 truncate leading-tight">
                {element.nameEn}
              </div>
            ) : (
              <div className="leading-tight">
                <div className="text-[8.5px] font-semibold text-slate-700 dark:text-slate-200 truncate leading-none">
                  {element.nameEn}
                </div>
                <div className="text-[8px] font-medium text-slate-500 dark:text-slate-400 truncate leading-normal mt-0.5">
                  {element.nameKm}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar: Atomic Mass */}
        <div className="text-[8.5px] font-mono font-medium text-slate-500 dark:text-slate-400 text-center truncate leading-none pb-0.5">
          {langMode === 'km' ? toKhmerDigits(displayMass) : displayMass}
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
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setZoom(prev => Math.max(0.5, Math.round((prev - 0.1) * 100) / 100))}
                title="Zoom Out"
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <ZoomOut size={14} />
              </button>
              <button
                onClick={() => setZoom(1.0)}
                title="Reset Zoom to 100%"
                className="px-2 py-0.5 text-xs font-mono font-bold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-md transition-all"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={() => setZoom(prev => Math.min(1.5, Math.round((prev + 0.1) * 100) / 100))}
                title="Zoom In"
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"
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
      {viewMode === 'table' && (() => {
        const BASE_WIDTH = 1440;
        const BASE_HEIGHT = 858;
        const scaledWidth = Math.round(BASE_WIDTH * zoom);
        const scaledHeight = Math.round(BASE_HEIGHT * zoom);
        const inspectionElement = hoveredElement || activeElement || CHEMICAL_ELEMENTS[0];
        const inspectCatMeta = getElementCategoryMeta(inspectionElement.category);
        const inspectPhase = getPhaseAtKelvin(inspectionElement, temperatureK);
        const inspectPhaseColor =
          inspectPhase === 'gas'
            ? '#f43f5e'
            : inspectPhase === 'liquid'
            ? '#0284c7'
            : inspectPhase === 'solid'
            ? '#10b981'
            : '#94a3b8';

        return (
          <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            {/* Table Toolbar: State Legend & Zoom Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs border-b border-slate-100 dark:border-slate-800 pb-3">
              {/* State of matter legend */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-slate-500 dark:text-slate-400">
                  {langMode === 'km' ? 'សភាពរូបធាតុ:' : 'States of Matter:'}
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                  <span>{langMode === 'km' ? 'រឹង (Solid)' : 'Solid'}</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-sky-500 shadow-sm shadow-sky-500/50" />
                  <span>{langMode === 'km' ? 'រាវ (Liquid)' : 'Liquid'}</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                  <span>{langMode === 'km' ? 'ឧស្ម័ន (Gas)' : 'Gas'}</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>{langMode === 'km' ? 'មិនទាន់ស្គាល់' : 'Unknown'}</span>
                </span>
              </div>

              {/* Table Zoom Controls */}
              <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {langMode === 'km' ? 'ពង្រីក:' : 'Zoom:'}
                </span>

                {/* Quick Presets */}
                <div className="flex items-center gap-1">
                  {[
                    { label: '50%', val: 0.5 },
                    { label: '70%', val: 0.7 },
                    { label: '85%', val: 0.85 },
                    { label: '100%', val: 1.0 },
                    { label: '125%', val: 1.25 },
                    { label: '150%', val: 1.5 },
                  ].map(p => (
                    <button
                      key={p.val}
                      onClick={() => setZoom(p.val)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                        Math.abs(zoom - p.val) < 0.02
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Stepper with reset */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setZoom(prev => Math.max(0.5, Math.round((prev - 0.1) * 100) / 100))}
                    title="Zoom Out"
                    className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"
                  >
                    <ZoomOut size={13} />
                  </button>
                  <button
                    onClick={() => setZoom(1.0)}
                    title="Reset Zoom to 100%"
                    className="px-1.5 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 min-w-[38px] text-center"
                  >
                    {Math.round(zoom * 100)}%
                  </button>
                  <button
                    onClick={() => setZoom(prev => Math.min(1.5, Math.round((prev + 0.1) * 100) / 100))}
                    title="Zoom In"
                    className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"
                  >
                    <ZoomIn size={13} />
                  </button>
                  <button
                    onClick={() => setZoom(1.0)}
                    title="Reset"
                    className="p-1 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all border-l border-slate-200 dark:border-slate-700 ml-0.5 pl-1"
                  >
                    <RotateCcw size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile tip banner */}
            <div className="lg:hidden px-3.5 py-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-800 dark:text-cyan-300 flex items-center justify-between gap-2">
              <span>
                {langMode === 'km'
                  ? 'គន្លឹះ៖ អូសទៅឆ្វេងស្តាំដើម្បីមើលគ្រប់ក្រុមទាំង ១៨ ឬជ្រើសរើសការពង្រីក ៥០% ឬ ៧០%។'
                  : 'Tip: Swipe horizontally to explore all 18 groups, or set zoom to 50% or 70% to view more.'}
              </span>
            </div>

            {/* Scrollable Container with exact scaled dimensions */}
            <div className="w-full overflow-x-auto pb-4 pt-1 px-0.5 custom-scrollbar">
              <div
                style={{
                  width: `${scaledWidth}px`,
                  height: `${scaledHeight}px`,
                  minWidth: `${scaledWidth}px`,
                  minHeight: `${scaledHeight}px`,
                  margin: '0 auto',
                  position: 'relative',
                  transition: 'width 0.15s ease-out, height 0.15s ease-out',
                }}
              >
                <div
                  style={{
                    width: `${BASE_WIDTH}px`,
                    height: `${BASE_HEIGHT}px`,
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                    transition: 'transform 0.15s ease-out',
                    WebkitFontSmoothing: 'antialiased',
                    backfaceVisibility: 'hidden',
                  }}
                  className="transform-gpu"
                >
                  {/* Strict CSS Grid: 19 columns x 11 rows */}
                  <div
                    className="select-none"
                    style={{
                      width: `${BASE_WIDTH}px`,
                      height: `${BASE_HEIGHT}px`,
                      display: 'grid',
                      gap: '4px',
                      gridTemplateColumns: '36px repeat(18, 74px)',
                      gridTemplateRows: '28px repeat(7, 86px) 16px repeat(2, 86px)',
                    }}
                  >
                    {/* Corner Header: Period \ Group (Row 1, Col 1) */}
                    <div
                      style={{ gridColumnStart: 1, gridRowStart: 1 }}
                      className="flex items-center justify-center rounded-lg bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono font-bold text-slate-400 select-none"
                      title="Period (Row) / Group (Column)"
                    >
                      P \ G
                    </div>

                    {/* Group Numbers 1-18 along Row 1 (Cols 2-19) */}
                    {Array.from({ length: 18 }).map((_, idx) => {
                      const groupNum = idx + 1;
                      const isHoveredGroup = hoveredElement?.group === groupNum;
                      return (
                        <div
                          key={`grp-${groupNum}`}
                          style={{ gridColumnStart: idx + 2, gridRowStart: 1 }}
                          className={`flex items-center justify-center rounded-lg border font-mono text-[11px] font-bold select-none transition-colors duration-150 ${
                            isHoveredGroup
                              ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/40 ring-1 ring-cyan-400/40'
                              : 'bg-slate-100/70 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400'
                          }`}
                          title={`Group ${groupNum}`}
                        >
                          {langMode === 'km' ? toKhmerDigits(groupNum) : groupNum}
                        </div>
                      );
                    })}

                    {/* Period Numbers 1-7 along Col 1 (Rows 2-8) */}
                    {Array.from({ length: 7 }).map((_, pIdx) => {
                      const periodNum = pIdx + 1;
                      const isHoveredPeriod = hoveredElement?.period === periodNum;
                      return (
                        <div
                          key={`period-${periodNum}`}
                          style={{ gridColumnStart: 1, gridRowStart: pIdx + 2 }}
                          className={`flex flex-col items-center justify-center rounded-lg border font-mono font-bold select-none transition-colors duration-150 ${
                            isHoveredPeriod
                              ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/40 ring-1 ring-cyan-400/40'
                              : 'bg-slate-100/70 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400'
                          }`}
                          title={`Period ${periodNum} (${langMode === 'km' ? `ខួបទី ${toKhmerDigits(periodNum)}` : `Period ${periodNum}`})`}
                        >
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 leading-none">P</span>
                          <span className="text-xs leading-none mt-1">
                            {langMode === 'km' ? toKhmerDigits(periodNum) : periodNum}
                          </span>
                        </div>
                      );
                    })}

                    {/* Center Live Element Inspector Cockpit (Rows 2-4, Cols 4-13) */}
                    <div
                      style={{
                        gridColumnStart: 4,
                        gridColumnEnd: 14,
                        gridRowStart: 2,
                        gridRowEnd: 5,
                      }}
                      className="flex flex-col rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800/90 shadow-md p-3.5 backdrop-blur-md relative overflow-hidden"
                    >
                      {/* Top category accent bar */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1 transition-colors duration-200"
                        style={{ backgroundColor: inspectCatMeta.colorHex }}
                      />

                      {/* Header bar of the inspector */}
                      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: inspectCatMeta.colorHex }} />
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                            {langMode === 'km' ? 'ផ្ទាំងពិនិត្យធាតុផ្ទាល់' : langMode === 'en' ? 'Live Element Inspector' : 'Live Element Inspector • ផ្ទាំងពិនិត្យធាតុ'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {langMode === 'km' ? 'ចង្អុលលើធាតុណាមួយដើម្បីពិនិត្យ' : 'Hover any element to inspect'}
                        </span>
                      </div>

                      {/* Content area: 3 columns */}
                      <div className="flex-1 flex items-stretch gap-4 min-h-0">
                        {/* Left: Compact Bohr Model */}
                        <div className="w-[170px] flex-shrink-0 flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                          {renderBohrModel(inspectionElement, 130)}
                          <div className="mt-1 text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 text-center">
                            {langMode === 'km'
                              ? `${toKhmerDigits(inspectionElement.shells.length)} ស្រទាប់ (${inspectionElement.shells.map(s => toKhmerDigits(s)).join(', ')})`
                              : `${inspectionElement.shells.length} Shells (${inspectionElement.shells.join(', ')})`}
                          </div>
                        </div>

                        {/* Middle: Element Identity, Names, and Properties */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className="text-xs font-mono font-bold px-2 py-0.5 rounded-md"
                                style={{
                                  backgroundColor: `${inspectCatMeta.colorHex}20`,
                                  color: inspectCatMeta.colorHex,
                                }}
                              >
                                #{langMode === 'km' ? toKhmerDigits(inspectionElement.number) : inspectionElement.number}
                              </span>
                              <span
                                className="text-xs font-semibold px-2 py-0.5 rounded-md"
                                style={{
                                  backgroundColor: `${inspectCatMeta.colorHex}15`,
                                  color: inspectCatMeta.colorHex,
                                }}
                              >
                                {langMode === 'km'
                                  ? inspectCatMeta.nameKm
                                  : langMode === 'en'
                                  ? inspectCatMeta.nameEn
                                  : `${inspectCatMeta.nameEn} (${inspectCatMeta.nameKm})`}
                              </span>
                              <span className="text-[11px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                {inspectionElement.block}-block
                              </span>
                            </div>

                            <div className="flex items-baseline gap-3 mt-1.5">
                              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                {inspectionElement.symbol}
                              </span>
                              <div className="leading-tight">
                                <div className="text-base font-bold text-slate-900 dark:text-white">
                                  {inspectionElement.nameEn}
                                </div>
                                <div className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
                                  {inspectionElement.nameKm}
                                </div>
                              </div>
                            </div>

                            <div className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                              {langMode === 'km' ? inspectionElement.summaryKm : inspectionElement.summaryEn}
                            </div>
                          </div>

                          {/* Quick metric row */}
                          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] font-mono">
                            <div>
                              <span className="block text-[9px] font-sans text-slate-400 font-bold uppercase">{langMode === 'km' ? 'ម៉ាស់អាតូម' : 'Weight'}</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {langMode === 'km' ? toKhmerDigits(inspectionElement.atomicMass) : inspectionElement.atomicMass}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[9px] font-sans text-slate-400 font-bold uppercase">{langMode === 'km' ? 'សភាពបច្ចុប្បន្ន' : 'Phase'}</span>
                              <span className="font-bold capitalize" style={{ color: inspectPhaseColor }}>{inspectPhase}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] font-sans text-slate-400 font-bold uppercase">{langMode === 'km' ? 'ខួប / ក្រុម' : 'Period / Grp'}</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {langMode === 'km' ? `ខ${toKhmerDigits(inspectionElement.period)} / ក${toKhmerDigits(inspectionElement.group)}` : `P${inspectionElement.period} / G${inspectionElement.group}`}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[9px] font-sans text-slate-400 font-bold uppercase">{langMode === 'km' ? 'រកឃើញ' : 'Discovered'}</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                                {langMode === 'km' ? toKhmerDigits(inspectionElement.yearDiscovered) : inspectionElement.yearDiscovered}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Electron configuration & click action */}
                        <div className="w-[170px] flex-shrink-0 flex flex-col justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {langMode === 'km' ? 'ទម្រង់អេឡិចត្រុង' : 'Configuration'}
                            </div>
                            <div className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 break-words leading-snug">
                              {inspectionElement.electronConfiguration}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 space-y-0.5 font-mono">
                              <div>MP: {inspectionElement.meltingPoint ? (langMode === 'km' ? `${toKhmerDigits(inspectionElement.meltingPoint)} K` : `${inspectionElement.meltingPoint} K`) : 'N/A'}</div>
                              <div>BP: {inspectionElement.boilingPoint ? (langMode === 'km' ? `${toKhmerDigits(inspectionElement.boilingPoint)} K` : `${inspectionElement.boilingPoint} K`) : 'N/A'}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => setActiveElement(inspectionElement)}
                            className="w-full mt-2 py-1 px-2 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                          >
                            <span>{langMode === 'km' ? 'ព័ត៌មានលម្អិត' : 'Full Details'}</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Render all 118 Elements */}
                    {CHEMICAL_ELEMENTS.map(element => renderElementCell(element))}

                    {/* Lanthanide Placeholder in Group 3 Period 6 (col 4, row 7) */}
                    <div
                      style={{ gridColumnStart: 4, gridRowStart: 7 }}
                      onClick={() => setSelectedCategory(selectedCategory === 'lanthanide' ? 'all' : 'lanthanide')}
                      className="flex flex-col items-center justify-between w-full h-full pt-1.5 px-1.5 pb-1 rounded-lg border border-dashed border-fuchsia-500/50 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 text-center cursor-pointer hover:bg-fuchsia-500/20 transition-all select-none group"
                      title="Lanthanoids (57-71)"
                    >
                      <span className="text-[10px] font-bold font-mono text-fuchsia-500">{langMode === 'km' ? '៥៧-៧១' : '57-71'}</span>
                      <div className="my-auto">
                        <div className="text-sm font-black tracking-tight">La-Lu</div>
                        <div className="text-[8.5px] font-medium truncate max-w-full leading-tight">
                          {langMode === 'km' ? 'ឡង់តាណូអ៊ីត' : 'Lanthanoids'}
                        </div>
                      </div>
                      <span className="text-[8px] uppercase tracking-wider font-mono opacity-70">f-block</span>
                    </div>

                    {/* Actinide Placeholder in Group 3 Period 7 (col 4, row 8) */}
                    <div
                      style={{ gridColumnStart: 4, gridRowStart: 8 }}
                      onClick={() => setSelectedCategory(selectedCategory === 'actinide' ? 'all' : 'actinide')}
                      className="flex flex-col items-center justify-between w-full h-full pt-1.5 px-1.5 pb-1 rounded-lg border border-dashed border-pink-500/50 bg-pink-500/10 text-pink-600 dark:text-pink-400 text-center cursor-pointer hover:bg-pink-500/20 transition-all select-none group"
                      title="Actinoids (89-103)"
                    >
                      <span className="text-[10px] font-bold font-mono text-pink-500">{langMode === 'km' ? '៨៩-១០៣' : '89-103'}</span>
                      <div className="my-auto">
                        <div className="text-sm font-black tracking-tight">Ac-Lr</div>
                        <div className="text-[8.5px] font-medium truncate max-w-full leading-tight">
                          {langMode === 'km' ? 'អាក់ទីណូអ៊ីត' : 'Actinoids'}
                        </div>
                      </div>
                      <span className="text-[8px] uppercase tracking-wider font-mono opacity-70">f-block</span>
                    </div>

                    {/* Row 9 is an aesthetic gap row with divider line */}
                    <div
                      style={{ gridColumnStart: 1, gridColumnEnd: 20, gridRowStart: 9 }}
                      className="flex items-center justify-center select-none"
                    >
                      <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-800" />
                    </div>

                    {/* Bottom row labels for Lanthanide and Actinide series (Cols 1-4, Rows 10 and 11) */}
                    <div
                      style={{ gridColumnStart: 1, gridColumnEnd: 5, gridRowStart: 10 }}
                      onClick={() => setSelectedCategory(selectedCategory === 'lanthanide' ? 'all' : 'lanthanide')}
                      className="flex items-center justify-between px-3 py-2 w-full h-full rounded-lg border border-fuchsia-500/40 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300 cursor-pointer transition-all select-none group relative overflow-hidden"
                      title="Click to filter Lanthanides"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-fuchsia-500" />
                      <div className="pl-1">
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <span>{langMode === 'km' ? 'ឡង់តាណូអ៊ីត' : 'Lanthanide Series'}</span>
                          <span className="text-[10px] font-mono font-normal opacity-70">
                            ({langMode === 'km' ? '៥៧-៧១' : '57-71'})
                          </span>
                        </div>
                        <div className="text-[10px] text-fuchsia-600/80 dark:text-fuchsia-400/80 mt-0.5">
                          {langMode === 'km' ? 'ធាតុលោហៈកម្រ (4f subshell)' : 'Rare earth metals (4f orbitals)'}
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-xs text-fuchsia-600 dark:text-fuchsia-400">
                        La - Lu
                      </div>
                    </div>

                    <div
                      style={{ gridColumnStart: 1, gridColumnEnd: 5, gridRowStart: 11 }}
                      onClick={() => setSelectedCategory(selectedCategory === 'actinide' ? 'all' : 'actinide')}
                      className="flex items-center justify-between px-3 py-2 w-full h-full rounded-lg border border-pink-500/40 bg-pink-500/10 hover:bg-pink-500/20 text-pink-700 dark:text-pink-300 cursor-pointer transition-all select-none group relative overflow-hidden"
                      title="Click to filter Actinides"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500" />
                      <div className="pl-1">
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <span>{langMode === 'km' ? 'អាក់ទីណូអ៊ីត' : 'Actinide Series'}</span>
                          <span className="text-[10px] font-mono font-normal opacity-70">
                            ({langMode === 'km' ? '៨៩-១០៣' : '89-103'})
                          </span>
                        </div>
                        <div className="text-[10px] text-pink-600/80 dark:text-pink-400/80 mt-0.5">
                          {langMode === 'km' ? 'ធាតុវិទ្យុសកម្មធ្ងន់ (5f subshell)' : 'Radioactive heavy metals (5f orbitals)'}
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-xs text-pink-600 dark:text-pink-400">
                        Ac - Lr
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Card Grid View (Alternative Responsive View) */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredElements.map(el => {
            const catMeta = getElementCategoryMeta(el.category);
            const phase = getPhaseAtKelvin(el, temperatureK);
            const displayMass = formatMass(el.atomicMass);

            return (
              <button
                key={el.number}
                onClick={() => setActiveElement(el)}
                className={`relative p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer overflow-hidden backdrop-blur-sm ${
                  catMeta.bgClass
                } ${catMeta.borderClass}`}
              >
                {/* Top category accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ backgroundColor: catMeta.colorHex }}
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    #{langMode === 'km' ? toKhmerDigits(el.number) : el.number}
                  </span>
                  <div className="flex items-center gap-1.5">
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
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-md bg-white/50 dark:bg-black/20 text-slate-600 dark:text-slate-300">
                      {el.block}-block
                    </span>
                  </div>
                </div>

                <div className="my-2.5 text-center">
                  <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {el.symbol}
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 truncate">
                    {langMode === 'km' ? el.nameKm : el.nameEn}
                  </div>
                  {langMode === 'both' && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {el.nameKm}
                    </div>
                  )}
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>{langMode === 'km' ? 'ម៉ាស់:' : 'Mass:'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {langMode === 'km' ? toKhmerDigits(displayMass) : displayMass}
                    </span>
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
                  <td className="py-3 px-4 font-bold">
                    {langMode === 'km' ? toKhmerDigits(elementA.number) : elementA.number}
                  </td>
                  <td className="py-3 px-4 font-bold">
                    {langMode === 'km' ? toKhmerDigits(elementB.number) : elementB.number}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                    {langMode === 'km' ? 'ម៉ាស់អាតូមស្តង់ដារ' : 'Atomic Weight (u)'}
                  </td>
                  <td className="py-3 px-4 font-bold">
                    {langMode === 'km' ? toKhmerDigits(elementA.atomicMass) : elementA.atomicMass}
                  </td>
                  <td className="py-3 px-4 font-bold">
                    {langMode === 'km' ? toKhmerDigits(elementB.atomicMass) : elementB.atomicMass}
                  </td>
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
                    {langMode === 'km'
                      ? `ខួប ${toKhmerDigits(elementA.period)} / ក្រុម ${toKhmerDigits(elementA.group)} / ប្លុក ${elementA.block}`
                      : `P${elementA.period} / G${elementA.group} / ${elementA.block}-block`}
                  </td>
                  <td className="py-3 px-4">
                    {langMode === 'km'
                      ? `ខួប ${toKhmerDigits(elementB.period)} / ក្រុម ${toKhmerDigits(elementB.group)} / ប្លុក ${elementB.block}`
                      : `P${elementB.period} / G${elementB.group} / ${elementB.block}-block`}
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
                  <td className="py-3 px-4">
                    {langMode === 'km'
                      ? elementA.shells.map(s => toKhmerDigits(s)).join(', ')
                      : elementA.shells.join(', ')}
                  </td>
                  <td className="py-3 px-4">
                    {langMode === 'km'
                      ? elementB.shells.map(s => toKhmerDigits(s)).join(', ')
                      : elementB.shells.join(', ')}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                    {langMode === 'km' ? 'ចំណុចរលាយ' : 'Melting Point'}
                  </td>
                  <td className="py-3 px-4">
                    {elementA.meltingPoint != null
                      ? langMode === 'km'
                        ? `${toKhmerDigits(elementA.meltingPoint)} K (${toKhmerDigits(Math.round((elementA.meltingPoint - 273.15) * 10) / 10)} °C)`
                        : `${elementA.meltingPoint} K (${Math.round((elementA.meltingPoint - 273.15) * 10) / 10} °C)`
                      : langMode === 'km' ? 'មិនមាន' : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {elementB.meltingPoint != null
                      ? langMode === 'km'
                        ? `${toKhmerDigits(elementB.meltingPoint)} K (${toKhmerDigits(Math.round((elementB.meltingPoint - 273.15) * 10) / 10)} °C)`
                        : `${elementB.meltingPoint} K (${Math.round((elementB.meltingPoint - 273.15) * 10) / 10} °C)`
                      : langMode === 'km' ? 'មិនមាន' : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                    {langMode === 'km' ? 'ចំណុចរំពុះ' : 'Boiling Point'}
                  </td>
                  <td className="py-3 px-4">
                    {elementA.boilingPoint != null
                      ? langMode === 'km'
                        ? `${toKhmerDigits(elementA.boilingPoint)} K (${toKhmerDigits(Math.round((elementA.boilingPoint - 273.15) * 10) / 10)} °C)`
                        : `${elementA.boilingPoint} K (${Math.round((elementA.boilingPoint - 273.15) * 10) / 10} °C)`
                      : langMode === 'km' ? 'មិនមាន' : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {elementB.boilingPoint != null
                      ? langMode === 'km'
                        ? `${toKhmerDigits(elementB.boilingPoint)} K (${toKhmerDigits(Math.round((elementB.boilingPoint - 273.15) * 10) / 10)} °C)`
                        : `${elementB.boilingPoint} K (${Math.round((elementB.boilingPoint - 273.15) * 10) / 10} °C)`
                      : langMode === 'km' ? 'មិនមាន' : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                    {langMode === 'km' ? 'ដង់ស៊ីតេ' : 'Density'}
                  </td>
                  <td className="py-3 px-4">
                    {elementA.density != null
                      ? langMode === 'km'
                        ? `${toKhmerDigits(elementA.density)} g/cm³`
                        : `${elementA.density} g/cm³`
                      : langMode === 'km' ? 'មិនមាន' : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {elementB.density != null
                      ? langMode === 'km'
                        ? `${toKhmerDigits(elementB.density)} g/cm³`
                        : `${elementB.density} g/cm³`
                      : langMode === 'km' ? 'មិនមាន' : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                    {langMode === 'km' ? 'អេឡិចត្រូអវិជ្ជមាន' : 'Electronegativity'}
                  </td>
                  <td className="py-3 px-4">
                    {elementA.electronegativity != null
                      ? langMode === 'km'
                        ? toKhmerDigits(elementA.electronegativity)
                        : elementA.electronegativity
                      : langMode === 'km' ? 'មិនមាន' : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {elementB.electronegativity != null
                      ? langMode === 'km'
                        ? toKhmerDigits(elementB.electronegativity)
                        : elementB.electronegativity
                      : langMode === 'km' ? 'មិនមាន' : 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500 font-sans font-medium">
                    {langMode === 'km' ? 'រកឃើញដោយ' : 'Discovered By'}
                  </td>
                  <td className="py-3 px-4 font-sans">{elementA.discoveredBy} ({langMode === 'km' ? toKhmerDigits(elementA.yearDiscovered) : elementA.yearDiscovered})</td>
                  <td className="py-3 px-4 font-sans">{elementB.discoveredBy} ({langMode === 'km' ? toKhmerDigits(elementB.yearDiscovered) : elementB.yearDiscovered})</td>
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
              <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <ArrowRight size={12} className="text-cyan-500" />
                  <span>{langMode === 'km' ? 'តាមខួប៖ ថយចុះ' : 'Across Period: Decreases'}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <ArrowDown size={12} className="text-cyan-500" />
                  <span>{langMode === 'km' ? 'តាមក្រុម៖ កើនឡើង' : 'Down Group: Increases'}</span>
                </span>
              </div>
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
              <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <ArrowRight size={12} className="text-orange-500" />
                  <span>{langMode === 'km' ? 'តាមខួប៖ កើនឡើង' : 'Across Period: Increases'}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <ArrowDown size={12} className="text-orange-500" />
                  <span>{langMode === 'km' ? 'តាមក្រុម៖ ថយចុះ' : 'Down Group: Decreases'}</span>
                </span>
              </div>
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
              <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <ArrowRight size={12} className="text-blue-500" />
                  <span>{langMode === 'km' ? 'តាមខួប៖ កើនឡើង' : 'Across Period: Increases'}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <ArrowDown size={12} className="text-blue-500" />
                  <span>{langMode === 'km' ? 'តាមក្រុម៖ ថយចុះ' : 'Down Group: Decreases'}</span>
                </span>
              </div>
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
              <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <ArrowRight size={12} className="text-emerald-500" />
                  <span>{langMode === 'km' ? 'តាមខួប៖ ថយចុះ' : 'Across Period: Decreases'}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <ArrowDown size={12} className="text-emerald-500" />
                  <span>{langMode === 'km' ? 'តាមក្រុម៖ កើនឡើង' : 'Down Group: Increases'}</span>
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-mono">
                {langMode === 'km' ? 'លោហៈខ្លាំងបំផុត៖ ហ្វ្រង់ស្យូម (Fr) / សេស៊ីយូម (Cs)' : 'Most Metallic: Francium (Fr) / Caesium (Cs)'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rich Element Detail Modal */}
      {activeElement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
          onClick={() => setActiveElement(null)}
        >
          <div
            className="relative w-full max-w-3xl my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
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
                  className={`relative overflow-hidden w-16 h-16 rounded-2xl flex flex-col items-center justify-center border font-mono font-black ${
                    getElementCategoryMeta(activeElement.category).bgClass
                  } ${getElementCategoryMeta(activeElement.category).borderClass}`}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ backgroundColor: getElementCategoryMeta(activeElement.category).colorHex }}
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">
                    {langMode === 'km' ? toKhmerDigits(activeElement.number) : activeElement.number}
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
                      {langMode === 'km'
                        ? `ខួបទី ${toKhmerDigits(activeElement.period)}, ក្រុមទី ${toKhmerDigits(activeElement.group)}`
                        : `Period ${activeElement.period}, Group ${activeElement.group}`}
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
                      {langMode === 'km' ? toKhmerDigits(activeElement.atomicMass) : activeElement.atomicMass} u
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="block text-[10px] font-sans text-slate-400 font-bold uppercase">
                      {langMode === 'km' ? 'សភាពនៅ ២០ °C' : 'Standard State'}
                    </span>
                    <span className="text-sm font-bold capitalize text-cyan-600 dark:text-cyan-400">
                      {langMode === 'km'
                        ? (activeElement.standardState === 'gas'
                            ? 'ឧស្ម័ន'
                            : activeElement.standardState === 'liquid'
                            ? 'រាវ'
                            : activeElement.standardState === 'solid'
                            ? 'រឹង'
                            : 'មិនទាន់កំណត់')
                        : activeElement.standardState}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="block text-[10px] font-sans text-slate-400 font-bold uppercase">
                      {langMode === 'km' ? 'ចំណុចរលាយ' : 'Melting Point'}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeElement.meltingPoint != null
                        ? langMode === 'km'
                          ? `${toKhmerDigits(activeElement.meltingPoint)} K (${toKhmerDigits(Math.round((activeElement.meltingPoint - 273.15) * 10) / 10)} °C)`
                          : `${activeElement.meltingPoint} K (${Math.round((activeElement.meltingPoint - 273.15) * 10) / 10} °C)`
                        : langMode === 'km' ? 'មិនទាន់ដឹង' : 'Unknown'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="block text-[10px] font-sans text-slate-400 font-bold uppercase">
                      {langMode === 'km' ? 'ចំណុចរំពុះ' : 'Boiling Point'}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeElement.boilingPoint != null
                        ? langMode === 'km'
                          ? `${toKhmerDigits(activeElement.boilingPoint)} K (${toKhmerDigits(Math.round((activeElement.boilingPoint - 273.15) * 10) / 10)} °C)`
                          : `${activeElement.boilingPoint} K (${Math.round((activeElement.boilingPoint - 273.15) * 10) / 10} °C)`
                        : langMode === 'km' ? 'មិនទាន់ដឹង' : 'Unknown'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="block text-[10px] font-sans text-slate-400 font-bold uppercase">
                      {langMode === 'km' ? 'ដង់ស៊ីតេ' : 'Density'}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeElement.density != null
                        ? langMode === 'km'
                          ? `${toKhmerDigits(activeElement.density)} g/cm³`
                          : `${activeElement.density} g/cm³`
                        : langMode === 'km' ? 'មិនមាន' : 'N/A'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="block text-[10px] font-sans text-slate-400 font-bold uppercase">
                      {langMode === 'km' ? 'អេឡិចត្រូអវិជ្ជមាន' : 'Electronegativity'}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeElement.electronegativity != null
                        ? langMode === 'km'
                          ? toKhmerDigits(activeElement.electronegativity)
                          : activeElement.electronegativity
                        : langMode === 'km' ? 'មិនមាន' : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Discovery details */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <span className="font-bold text-slate-500 dark:text-slate-400">
                    {langMode === 'km' ? 'ប្រវត្តិស្វែងរកឃើញ:' : 'Discovery:'}
                  </span>{' '}
                  <span className="text-slate-800 dark:text-slate-200">
                    {activeElement.discoveredBy} ({langMode === 'km' ? toKhmerDigits(activeElement.yearDiscovered) : activeElement.yearDiscovered})
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
