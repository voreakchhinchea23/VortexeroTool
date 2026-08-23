import React, { useState, useEffect, useRef } from 'react';
import { Clock, Maximize, Minimize, Play, Pause, RotateCcw, Sparkles, Compass, Shield } from 'lucide-react';

type ClockTheme = 'cyberpunk' | 'tokyo_rain' | 'oled' | 'solar_flare' | 'rose_quartz' | 'matrix' | 'sunset' | 'retro' | 'emerald' | 'slate';
type Mode = 'digital' | 'analog' | 'pomodoro';

export const DigitalClock: React.FC = () => {
  const [mode, setMode] = useState<Mode>('digital');
  const [theme, setTheme] = useState<ClockTheme>('cyberpunk');
  const [is24Hour, setIs24Hour] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Time state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Pomodoro state
  const [pomoTimeLeft, setPomoTimeLeft] = useState(25 * 60);
  const [pomoIsRunning, setPomoIsRunning] = useState(false);
  const [pomoMode, setPomoMode] = useState<'work' | 'break'>('work');

  const containerRef = useRef<HTMLDivElement>(null);

  // Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Pomodoro Ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pomoIsRunning && pomoTimeLeft > 0) {
      interval = setInterval(() => {
        setPomoTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (pomoTimeLeft === 0) {
      setPomoIsRunning(false);
      if (pomoMode === 'work') {
        setPomoMode('break');
        setPomoTimeLeft(5 * 60);
      } else {
        setPomoMode('work');
        setPomoTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [pomoIsRunning, pomoTimeLeft, pomoMode]);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => console.error(err));
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Format Clock Digits
  let hours = currentTime.getHours();
  let ampm = '';
  if (!is24Hour) {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }
  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = currentTime.getMinutes().toString().padStart(2, '0');
  const secondsStr = currentTime.getSeconds().toString().padStart(2, '0');

  // Format Date
  const dateStr = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Pomodoro Digits
  const pomoMinutes = Math.floor(pomoTimeLeft / 60).toString().padStart(2, '0');
  const pomoSeconds = (pomoTimeLeft % 60).toString().padStart(2, '0');

  // Analog Hand Angles
  const sec = currentTime.getSeconds();
  const min = currentTime.getMinutes();
  const hr = currentTime.getHours() % 12;

  const secAngle = sec * 6; // 360 / 60
  const minAngle = min * 6 + sec * 0.1;
  const hrAngle = hr * 30 + min * 0.5;

  // Theme Styling
  const getThemeStyles = () => {
    switch (theme) {
      case 'oled':
        return {
          bg: 'bg-black',
          clockText: 'text-white font-mono',
          glow: '',
          accent: 'text-neutral-400',
          border: 'border-neutral-900',
          handSec: '#ffffff',
          handMin: '#a3a3a3',
          handHr: '#e5e5e5',
        };
      case 'cyberpunk':
        return {
          bg: 'bg-[#060814]',
          clockText: 'text-cyan-400 font-mono drop-shadow-[0_0_30px_rgba(34,211,238,0.7)]',
          glow: 'bg-gradient-to-tr from-cyan-500/15 via-fuchsia-500/15 to-transparent',
          accent: 'text-fuchsia-400',
          border: 'border-cyan-500/20',
          handSec: '#22d3ee',
          handMin: '#c084fc',
          handHr: '#38bdf8',
        };
      case 'tokyo_rain':
        return {
          bg: 'bg-[#0b0b1a]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 font-mono drop-shadow-[0_0_25px_rgba(192,132,252,0.6)]',
          glow: 'bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15',
          accent: 'text-pink-400',
          border: 'border-purple-500/30',
          handSec: '#f472b6',
          handMin: '#c084fc',
          handHr: '#818cf8',
        };
      case 'solar_flare':
        return {
          bg: 'bg-[#120b04]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 font-mono drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]',
          glow: 'bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-transparent',
          accent: 'text-amber-400',
          border: 'border-amber-500/30',
          handSec: '#fbbf24',
          handMin: '#f59e0b',
          handHr: '#d97706',
        };
      case 'rose_quartz':
        return {
          bg: 'bg-[#170e14]',
          clockText: 'text-pink-200 font-sans font-extrabold drop-shadow-[0_0_20px_rgba(244,114,182,0.4)]',
          glow: 'bg-gradient-to-tr from-pink-500/10 via-rose-500/10 to-transparent',
          accent: 'text-pink-300',
          border: 'border-pink-500/20',
          handSec: '#f472b6',
          handMin: '#fbcfe8',
          handHr: '#f9a8d4',
        };
      case 'matrix':
        return {
          bg: 'bg-[#020d06]',
          clockText: 'text-emerald-400 font-mono drop-shadow-[0_0_25px_rgba(52,211,153,0.7)]',
          glow: 'bg-emerald-500/5',
          accent: 'text-emerald-500',
          border: 'border-emerald-500/30',
          handSec: '#34d399',
          handMin: '#10b981',
          handHr: '#059669',
        };
      case 'sunset':
        return {
          bg: 'bg-[#0f0913]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 font-sans font-black',
          glow: 'bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10',
          accent: 'text-amber-400',
          border: 'border-rose-500/20',
          handSec: '#fb7185',
          handMin: '#fb923c',
          handHr: '#c084fc',
        };
      case 'retro':
        return {
          bg: 'bg-[#14120e]',
          clockText: 'text-amber-500 font-mono drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]',
          glow: 'bg-amber-500/5',
          accent: 'text-amber-400',
          border: 'border-amber-500/20',
          handSec: '#f59e0b',
          handMin: '#d97706',
          handHr: '#b45309',
        };
      case 'emerald':
        return {
          bg: 'bg-[#04120c]',
          clockText: 'text-teal-300 font-mono drop-shadow-[0_0_20px_rgba(45,212,191,0.6)]',
          glow: 'bg-teal-500/5',
          accent: 'text-teal-400',
          border: 'border-teal-500/20',
          handSec: '#2dd4bf',
          handMin: '#14b8a6',
          handHr: '#0f766e',
        };
      case 'slate':
      default:
        return {
          bg: 'bg-slate-900',
          clockText: 'text-slate-100 font-mono',
          glow: 'bg-slate-800/30',
          accent: 'text-brand-400',
          border: 'border-slate-800',
          handSec: '#3b82f6',
          handMin: '#94a3b8',
          handHr: '#cbd5e1',
        };
    }
  };

  const themeConfig = getThemeStyles();

  const themes: { id: ClockTheme; label: string; color: string }[] = [
    { id: 'cyberpunk', label: 'Cyber Neon', color: 'bg-cyan-500' },
    { id: 'tokyo_rain', label: 'Tokyo Rain', color: 'bg-purple-500' },
    { id: 'solar_flare', label: 'Solar Flare', color: 'bg-amber-400' },
    { id: 'rose_quartz', label: 'Rose Quartz', color: 'bg-pink-400' },
    { id: 'oled', label: 'OLED Pure Black', color: 'bg-neutral-950 border border-neutral-700' },
    { id: 'matrix', label: 'Matrix Terminal', color: 'bg-emerald-500' },
    { id: 'sunset', label: 'Sunset Horizon', color: 'bg-rose-500' },
    { id: 'retro', label: 'Retro Amber LED', color: 'bg-amber-500' },
    { id: 'emerald', label: 'Emerald Forest', color: 'bg-teal-500' },
    { id: 'slate', label: 'Deep Slate', color: 'bg-slate-700' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Mode Selector */}
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            onClick={() => setMode('digital')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              mode === 'digital' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Digital
          </button>
          <button
            onClick={() => setMode('analog')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              mode === 'analog' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Analog
          </button>
          <button
            onClick={() => setMode('pomodoro')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              mode === 'pomodoro' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Pomodoro Focus
          </button>
        </div>

        {/* Toggles */}
        {mode !== 'pomodoro' ? (
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <button
              onClick={() => setIs24Hour(!is24Hour)}
              className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                is24Hour
                  ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-600 dark:text-brand-300'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              24-Hour
            </button>

            <button
              onClick={() => setShowSeconds(!showSeconds)}
              className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                showSeconds
                  ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-600 dark:text-brand-300'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              Seconds
            </button>

            <button
              onClick={() => setShowDate(!showDate)}
              className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                showDate
                  ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-600 dark:text-brand-300'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              Date
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPomoMode('work');
                setPomoTimeLeft(25 * 60);
                setPomoIsRunning(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pomoMode === 'work' ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              25m Focus
            </button>
            <button
              onClick={() => {
                setPomoMode('break');
                setPomoTimeLeft(5 * 60);
                setPomoIsRunning(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pomoMode === 'break' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              5m Break
            </button>
          </div>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Display'}</span>
        </button>
      </div>

      {/* Aesthetic Theme Swatches */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 mr-1">Style Theme:</span>
        {themes.map(t => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              theme === t.id
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-[1.02]'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Main Clock Canvas */}
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-3xl ${themeConfig.bg} ${themeConfig.border} border p-8 sm:p-14 min-h-[440px] flex flex-col items-center justify-center text-center shadow-2xl transition-colors duration-500 select-none ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen border-none' : ''
        }`}
      >
        <div className={`absolute inset-0 ${themeConfig.glow} pointer-events-none`} />

        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-6 right-6 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer"
            title="Exit Fullscreen"
          >
            <Minimize size={20} />
          </button>
        )}

        {/* Digital Mode */}
        {mode === 'digital' && (
          <div className="relative z-10 space-y-4">
            <div className="flex items-baseline justify-center gap-2 sm:gap-4">
              <span className={`text-6xl sm:text-8xl md:text-9xl tracking-tight leading-none ${themeConfig.clockText}`}>
                {hoursStr}
                <span className="animate-pulse opacity-90 mx-1">:</span>
                {minutesStr}
                {showSeconds && (
                  <>
                    <span className="animate-pulse opacity-90 mx-1">:</span>
                    <span className="text-4xl sm:text-6xl md:text-7xl opacity-90">{secondsStr}</span>
                  </>
                )}
              </span>

              {!is24Hour && (
                <span className={`text-xl sm:text-3xl font-extrabold uppercase ml-2 ${themeConfig.accent}`}>
                  {ampm}
                </span>
              )}
            </div>

            {showDate && (
              <p className="text-base sm:text-xl font-medium tracking-wide text-slate-400">
                {dateStr}
              </p>
            )}
          </div>
        )}

        {/* Analog Mode */}
        {mode === 'analog' && (
          <div className="relative z-10 flex flex-col items-center space-y-5">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-slate-700/40 p-4 flex items-center justify-center shadow-inner">
              {/* Clock Face Markers */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-3 bg-slate-500/60 rounded-full"
                  style={{
                    transform: `rotate(${i * 30}deg) translateY(-120px)`,
                  }}
                />
              ))}

              {/* Hour Hand */}
              <div
                className="absolute w-1.5 h-16 rounded-full origin-bottom"
                style={{
                  backgroundColor: themeConfig.handHr,
                  transform: `translateY(-32px) rotate(${hrAngle}deg)`,
                }}
              />

              {/* Minute Hand */}
              <div
                className="absolute w-1 h-24 rounded-full origin-bottom"
                style={{
                  backgroundColor: themeConfig.handMin,
                  transform: `translateY(-48px) rotate(${minAngle}deg)`,
                }}
              />

              {/* Second Hand */}
              {showSeconds && (
                <div
                  className="absolute w-0.5 h-28 rounded-full origin-bottom transition-transform duration-150"
                  style={{
                    backgroundColor: themeConfig.handSec,
                    transform: `translateY(-56px) rotate(${secAngle}deg)`,
                  }}
                />
              )}

              {/* Center Pin */}
              <div
                className="w-3.5 h-3.5 rounded-full z-20 shadow-md"
                style={{ backgroundColor: themeConfig.handSec }}
              />
            </div>

            {/* Sub Digital Readout */}
            <div className="flex items-center gap-2 text-xl font-mono font-bold text-slate-300">
              <span>{hoursStr}:{minutesStr}{showSeconds ? `:${secondsStr}` : ''}</span>
              {!is24Hour && <span className={`text-xs uppercase ${themeConfig.accent}`}>{ampm}</span>}
            </div>

            {showDate && <p className="text-xs text-slate-400">{dateStr}</p>}
          </div>
        )}

        {/* Pomodoro Mode */}
        {mode === 'pomodoro' && (
          <div className="relative z-10 space-y-6">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 text-white backdrop-blur-md">
              {pomoMode === 'work' ? '🎯 Focus Session' : '☕ Rest & Rejuvenate'}
            </span>

            <div className={`text-7xl sm:text-9xl tracking-tight leading-none ${themeConfig.clockText}`}>
              {pomoMinutes}:{pomoSeconds}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setPomoIsRunning(!pomoIsRunning)}
                className="px-6 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm flex items-center gap-2 backdrop-blur-xl active:scale-95 transition-all cursor-pointer"
              >
                {pomoIsRunning ? <Pause size={18} /> : <Play size={18} />}
                <span>{pomoIsRunning ? 'Pause Timer' : 'Start Focus'}</span>
              </button>

              <button
                onClick={() => {
                  setPomoIsRunning(false);
                  setPomoTimeLeft(pomoMode === 'work' ? 25 * 60 : 5 * 60);
                }}
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        )}

        <p className="absolute bottom-4 text-[11px] text-slate-500 opacity-60 font-mono">
          Press F11 for seamless second-monitor presentation
        </p>
      </div>
    </div>
  );
};
