import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Maximize,
  Minimize,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Flag,
  Edit2,
  Check,
} from 'lucide-react';

export type ClockTheme =
  | 'night_city'
  | 'cyberpunk'
  | 'synthwave'
  | 'tokyo_night'
  | 'tokyo_rain'
  | 'nord_aurora'
  | 'matrix'
  | 'amber_crt'
  | 'dracula'
  | 'catppuccin'
  | 'luxury_gold'
  | 'cosmic_nebula'
  | 'solar_flare'
  | 'rose_quartz'
  | 'swiss_bauhaus'
  | 'oled'
  | 'emerald'
  | 'slate';

type Mode = 'digital' | 'analog' | 'flip' | 'pomodoro' | 'stopwatch';
type FontStyle = 'mono' | 'sans' | 'serif' | 'digital';

interface LapItem {
  id: number;
  time: number;
  lapDuration: number;
}

const TIMEZONES = [
  { id: 'local', label: 'Local Device Time' },
  { id: 'UTC', label: 'UTC / GMT' },
  { id: 'Asia/Phnom_Penh', label: 'Phnom Penh / BKK (ICT +7)' },
  { id: 'Asia/Tokyo', label: 'Tokyo (JST +9)' },
  { id: 'Europe/London', label: 'London (GMT/BST)' },
  { id: 'America/New_York', label: 'New York (EST/EDT)' },
  { id: 'America/Los_Angeles', label: 'San Francisco (PST/PDT)' },
  { id: 'Europe/Paris', label: 'Paris / Berlin (CET)' },
  { id: 'Australia/Sydney', label: 'Sydney (AEST)' },
];

export const DigitalClock: React.FC = () => {
  const [mode, setMode] = useState<Mode>('digital');
  const [theme, setTheme] = useState<ClockTheme>(() => {
    return (localStorage.getItem('vortexero_clock_theme') as ClockTheme) || 'night_city';
  });
  const [fontStyle, setFontStyle] = useState<FontStyle>('mono');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('local');
  const [is24Hour, setIs24Hour] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [customTag, setCustomTag] = useState<string>('Deep Work Focus');
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Time state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Pomodoro state
  const [pomoDuration, setPomoDuration] = useState(25 * 60);
  const [pomoTimeLeft, setPomoTimeLeft] = useState(25 * 60);
  const [pomoIsRunning, setPomoIsRunning] = useState(false);
  const [pomoMode, setPomoMode] = useState<'work' | 'break'>('work');

  // Stopwatch state
  const [swTime, setSwTime] = useState(0);
  const [swIsRunning, setSwIsRunning] = useState(false);
  const [swLaps, setSwLaps] = useState<LapItem[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Save theme choice
  useEffect(() => {
    localStorage.setItem('vortexero_clock_theme', theme);
  }, [theme]);

  // Audio Context for Chimes & Ticks
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playChimeSound = (freq = 880, duration = 0.8) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted or supported
    }
  };

  const playTickSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);

      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Ignore
    }
  };

  // Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (soundEnabled && mode === 'analog') {
        playTickSound();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [soundEnabled, mode]);

  // Pomodoro Ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pomoIsRunning && pomoTimeLeft > 0) {
      interval = setInterval(() => {
        setPomoTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (pomoTimeLeft === 0 && pomoIsRunning) {
      playChimeSound(660, 1.2);
      setPomoIsRunning(false);
      if (pomoMode === 'work') {
        setPomoMode('break');
        setPomoTimeLeft(5 * 60);
      } else {
        setPomoMode('work');
        setPomoTimeLeft(pomoDuration);
      }
    }
    return () => clearInterval(interval);
  }, [pomoIsRunning, pomoTimeLeft, pomoMode, pomoDuration, soundEnabled]);

  // Stopwatch Ticker (10ms)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (swIsRunning) {
      interval = setInterval(() => {
        setSwTime(prev => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [swIsRunning]);

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

  // Timezone-adjusted time
  const getAdjustedDate = () => {
    if (selectedTimezone === 'local') return currentTime;
    try {
      const dateStr = currentTime.toLocaleString('en-US', { timeZone: selectedTimezone });
      return new Date(dateStr);
    } catch {
      return currentTime;
    }
  };

  const displayTime = getAdjustedDate();

  // Format Clock Digits
  let hours = displayTime.getHours();
  let ampm = '';
  if (!is24Hour) {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }
  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = displayTime.getMinutes().toString().padStart(2, '0');
  const secondsStr = displayTime.getSeconds().toString().padStart(2, '0');

  // Format Date
  const dateStr = displayTime.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Pomodoro Digits
  const pomoMinutes = Math.floor(pomoTimeLeft / 60).toString().padStart(2, '0');
  const pomoSeconds = (pomoTimeLeft % 60).toString().padStart(2, '0');

  // Stopwatch Digits
  const swMinutes = Math.floor(swTime / 60000).toString().padStart(2, '0');
  const swSeconds = Math.floor((swTime % 60000) / 1000).toString().padStart(2, '0');
  const swMs = Math.floor((swTime % 1000) / 10).toString().padStart(2, '0');

  // Exact Analog Angles
  const secValue = displayTime.getSeconds();
  const minValue = displayTime.getMinutes();
  const hrValue = displayTime.getHours() % 12;

  const secAngle = secValue * 6;
  const minAngle = minValue * 6 + secValue * 0.1;
  const hrAngle = hrValue * 30 + minValue * 0.5;

  // Font styling class helper
  const getFontFamilyClass = () => {
    switch (fontStyle) {
      case 'sans':
        return 'font-sans font-black tracking-tight';
      case 'serif':
        return 'font-serif font-bold tracking-normal';
      case 'digital':
        return 'font-mono tracking-widest uppercase';
      case 'mono':
      default:
        return 'font-mono font-bold tracking-tight';
    }
  };

  // Comprehensive Aesthetic Theme Styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'night_city':
        return {
          bg: 'bg-[#08080d]',
          clockText: 'text-[#fcee0a] drop-shadow-[0_0_35px_rgba(252,238,10,0.85)]',
          glow: 'bg-[radial-gradient(ellipse_at_center,rgba(252,238,10,0.12),transparent_70%)]',
          accent: 'text-[#00f0ff]',
          border: 'border-[#fcee0a]/30',
          badgeBg: 'bg-[#fcee0a]/15 text-[#fcee0a] border-[#fcee0a]/40',
          handSec: '#00f0ff',
          handMin: '#fcee0a',
          handHr: '#ff003c',
          dialBg: '#0e0e17',
          dialBorder: '#fcee0a',
          flipCard: 'bg-[#151522] text-[#fcee0a] border-[#fcee0a]/30 shadow-[#fcee0a]/20',
        };
      case 'cyberpunk':
        return {
          bg: 'bg-[#050814]',
          clockText: 'text-cyan-400 drop-shadow-[0_0_35px_rgba(34,211,238,0.8)]',
          glow: 'bg-gradient-to-tr from-cyan-500/20 via-fuchsia-500/15 to-transparent',
          accent: 'text-fuchsia-400',
          border: 'border-cyan-500/30',
          badgeBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40',
          handSec: '#22d3ee',
          handMin: '#e879f9',
          handHr: '#38bdf8',
          dialBg: '#090e24',
          dialBorder: '#22d3ee',
          flipCard: 'bg-[#0c1430] text-cyan-300 border-cyan-500/30 shadow-cyan-500/20',
        };
      case 'synthwave':
        return {
          bg: 'bg-[#110726]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400 drop-shadow-[0_0_30px_rgba(232,121,249,0.7)]',
          glow: 'bg-gradient-to-b from-fuchsia-500/15 via-purple-500/10 to-cyan-500/15',
          accent: 'text-cyan-300',
          border: 'border-fuchsia-500/30',
          badgeBg: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/40',
          handSec: '#22d3ee',
          handMin: '#f472b6',
          handHr: '#c084fc',
          dialBg: '#1a0c3a',
          dialBorder: '#f472b6',
          flipCard: 'bg-[#1c0e3d] text-fuchsia-300 border-fuchsia-500/30 shadow-fuchsia-500/20',
        };
      case 'tokyo_night':
        return {
          bg: 'bg-[#1a1b26]',
          clockText: 'text-[#7aa2f7] drop-shadow-[0_0_30px_rgba(122,162,247,0.75)]',
          glow: 'bg-gradient-to-tr from-[#7aa2f7]/15 via-[#bb9af7]/10 to-transparent',
          accent: 'text-[#f7768e]',
          border: 'border-[#7aa2f7]/30',
          badgeBg: 'bg-[#7aa2f7]/15 text-[#7aa2f7] border-[#7aa2f7]/40',
          handSec: '#f7768e',
          handMin: '#7aa2f7',
          handHr: '#bb9af7',
          dialBg: '#24283b',
          dialBorder: '#7aa2f7',
          flipCard: 'bg-[#24283b] text-[#7aa2f7] border-[#7aa2f7]/30 shadow-[#7aa2f7]/20',
        };
      case 'tokyo_rain':
        return {
          bg: 'bg-[#0b0b1a]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 drop-shadow-[0_0_30px_rgba(192,132,252,0.7)]',
          glow: 'bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15',
          accent: 'text-pink-400',
          border: 'border-purple-500/30',
          badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
          handSec: '#f472b6',
          handMin: '#c084fc',
          handHr: '#818cf8',
          dialBg: '#15152e',
          dialBorder: '#c084fc',
          flipCard: 'bg-[#181838] text-purple-300 border-purple-500/30 shadow-purple-500/20',
        };
      case 'nord_aurora':
        return {
          bg: 'bg-[#2e3440]',
          clockText: 'text-[#88c0d0] drop-shadow-[0_0_25px_rgba(136,192,208,0.7)]',
          glow: 'bg-gradient-to-tr from-[#88c0d0]/15 via-[#a3be8c]/15 to-transparent',
          accent: 'text-[#a3be8c]',
          border: 'border-[#88c0d0]/30',
          badgeBg: 'bg-[#88c0d0]/15 text-[#88c0d0] border-[#88c0d0]/40',
          handSec: '#bf616a',
          handMin: '#88c0d0',
          handHr: '#81a1c1',
          dialBg: '#3b4252',
          dialBorder: '#88c0d0',
          flipCard: 'bg-[#3b4252] text-[#88c0d0] border-[#88c0d0]/30 shadow-[#88c0d0]/20',
        };
      case 'matrix':
        return {
          bg: 'bg-[#020d06]',
          clockText: 'text-emerald-400 drop-shadow-[0_0_35px_rgba(52,211,153,0.85)]',
          glow: 'bg-emerald-500/10',
          accent: 'text-emerald-300',
          border: 'border-emerald-500/30',
          badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
          handSec: '#34d399',
          handMin: '#10b981',
          handHr: '#059669',
          dialBg: '#051c0d',
          dialBorder: '#10b981',
          flipCard: 'bg-[#062411] text-emerald-400 border-emerald-500/30 shadow-emerald-500/20',
        };
      case 'amber_crt':
        return {
          bg: 'bg-[#0c0800]',
          clockText: 'text-[#ffb000] drop-shadow-[0_0_30px_rgba(255,176,0,0.85)]',
          glow: 'bg-[radial-gradient(ellipse_at_center,rgba(255,176,0,0.15),transparent_70%)]',
          accent: 'text-[#ffd066]',
          border: 'border-[#ffb000]/30',
          badgeBg: 'bg-[#ffb000]/15 text-[#ffb000] border-[#ffb000]/40',
          handSec: '#ffb000',
          handMin: '#e69d00',
          handHr: '#cc8b00',
          dialBg: '#1a1200',
          dialBorder: '#ffb000',
          flipCard: 'bg-[#1f1500] text-[#ffb000] border-[#ffb000]/30 shadow-[#ffb000]/20',
        };
      case 'dracula':
        return {
          bg: 'bg-[#282a36]',
          clockText: 'text-[#ff79c6] drop-shadow-[0_0_30px_rgba(255,121,198,0.75)]',
          glow: 'bg-gradient-to-tr from-[#ff79c6]/15 via-[#bd93f9]/15 to-[#50fa7b]/10',
          accent: 'text-[#50fa7b]',
          border: 'border-[#bd93f9]/30',
          badgeBg: 'bg-[#ff79c6]/15 text-[#ff79c6] border-[#ff79c6]/40',
          handSec: '#50fa7b',
          handMin: '#ff79c6',
          handHr: '#bd93f9',
          dialBg: '#383a59',
          dialBorder: '#ff79c6',
          flipCard: 'bg-[#383a59] text-[#ff79c6] border-[#bd93f9]/30 shadow-[#ff79c6]/20',
        };
      case 'catppuccin':
        return {
          bg: 'bg-[#1e1e2e]',
          clockText: 'text-[#cba6f7] drop-shadow-[0_0_25px_rgba(203,166,247,0.7)]',
          glow: 'bg-gradient-to-tr from-[#cba6f7]/15 via-[#f5c2e7]/15 to-[#89dceb]/10',
          accent: 'text-[#f5c2e7]',
          border: 'border-[#cba6f7]/30',
          badgeBg: 'bg-[#cba6f7]/15 text-[#cba6f7] border-[#cba6f7]/40',
          handSec: '#f5c2e7',
          handMin: '#cba6f7',
          handHr: '#89b4fa',
          dialBg: '#313244',
          dialBorder: '#cba6f7',
          flipCard: 'bg-[#313244] text-[#cba6f7] border-[#cba6f7]/30 shadow-[#cba6f7]/20',
        };
      case 'luxury_gold':
        return {
          bg: 'bg-[#0a0a0d]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 drop-shadow-[0_0_35px_rgba(251,191,36,0.75)]',
          glow: 'bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.12),transparent_70%)]',
          accent: 'text-amber-300',
          border: 'border-amber-500/30',
          badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
          handSec: '#fbbf24',
          handMin: '#fef08a',
          handHr: '#f59e0b',
          dialBg: '#14141c',
          dialBorder: '#fbbf24',
          flipCard: 'bg-[#171722] text-amber-300 border-amber-500/30 shadow-amber-500/20',
        };
      case 'cosmic_nebula':
        return {
          bg: 'bg-[#060613]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-500 drop-shadow-[0_0_35px_rgba(244,114,182,0.75)]',
          glow: 'bg-gradient-to-r from-cyan-500/15 via-indigo-500/20 to-pink-500/15',
          accent: 'text-pink-400',
          border: 'border-indigo-500/30',
          badgeBg: 'bg-indigo-500/15 text-pink-300 border-indigo-500/40',
          handSec: '#ec4899',
          handMin: '#818cf8',
          handHr: '#38bdf8',
          dialBg: '#0d0d26',
          dialBorder: '#818cf8',
          flipCard: 'bg-[#111133] text-pink-300 border-indigo-500/30 shadow-pink-500/20',
        };
      case 'solar_flare':
        return {
          bg: 'bg-[#120a04]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 drop-shadow-[0_0_30px_rgba(251,191,36,0.75)]',
          glow: 'bg-gradient-to-tr from-amber-500/15 via-orange-500/15 to-transparent',
          accent: 'text-amber-400',
          border: 'border-amber-500/30',
          badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
          handSec: '#fbbf24',
          handMin: '#f59e0b',
          handHr: '#d97706',
          dialBg: '#221307',
          dialBorder: '#f59e0b',
          flipCard: 'bg-[#261509] text-amber-400 border-amber-500/30 shadow-amber-500/20',
        };
      case 'rose_quartz':
        return {
          bg: 'bg-[#170e14]',
          clockText: 'text-pink-300 drop-shadow-[0_0_25px_rgba(244,114,182,0.6)]',
          glow: 'bg-gradient-to-tr from-pink-500/15 via-rose-500/15 to-transparent',
          accent: 'text-pink-200',
          border: 'border-pink-500/30',
          badgeBg: 'bg-pink-500/15 text-pink-300 border-pink-500/40',
          handSec: '#f472b6',
          handMin: '#fbcfe8',
          handHr: '#f9a8d4',
          dialBg: '#291723',
          dialBorder: '#f472b6',
          flipCard: 'bg-[#291723] text-pink-300 border-pink-500/30 shadow-pink-500/20',
        };
      case 'swiss_bauhaus':
        return {
          bg: 'bg-slate-900',
          clockText: 'text-white',
          glow: 'bg-slate-800/30',
          accent: 'text-rose-500',
          border: 'border-slate-800',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          handSec: '#f43f5e',
          handMin: '#ffffff',
          handHr: '#94a3b8',
          dialBg: '#1e293b',
          dialBorder: '#f43f5e',
          flipCard: 'bg-slate-800 text-white border-slate-700 shadow-slate-950/40',
        };
      case 'oled':
        return {
          bg: 'bg-black',
          clockText: 'text-white',
          glow: '',
          accent: 'text-neutral-400',
          border: 'border-neutral-900',
          badgeBg: 'bg-neutral-900 text-white border-neutral-800',
          handSec: '#ffffff',
          handMin: '#a3a3a3',
          handHr: '#e5e5e5',
          dialBg: '#0a0a0a',
          dialBorder: '#404040',
          flipCard: 'bg-[#121212] text-white border-neutral-800 shadow-black',
        };
      case 'emerald':
        return {
          bg: 'bg-[#04120c]',
          clockText: 'text-teal-300 drop-shadow-[0_0_25px_rgba(45,212,191,0.7)]',
          glow: 'bg-teal-500/10',
          accent: 'text-teal-400',
          border: 'border-teal-500/30',
          badgeBg: 'bg-teal-500/15 text-teal-300 border-teal-500/40',
          handSec: '#2dd4bf',
          handMin: '#14b8a6',
          handHr: '#0f766e',
          dialBg: '#082418',
          dialBorder: '#14b8a6',
          flipCard: 'bg-[#082418] text-teal-300 border-teal-500/30 shadow-teal-500/20',
        };
      case 'slate':
      default:
        return {
          bg: 'bg-[#0f172a]',
          clockText: 'text-slate-100',
          glow: 'bg-slate-800/40',
          accent: 'text-blue-400',
          border: 'border-slate-800',
          badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
          handSec: '#3b82f6',
          handMin: '#94a3b8',
          handHr: '#cbd5e1',
          dialBg: '#1e293b',
          dialBorder: '#3b82f6',
          flipCard: 'bg-[#1e293b] text-slate-100 border-slate-700 shadow-slate-950/40',
        };
    }
  };

  const themeConfig = getThemeStyles();

  const themes: { id: ClockTheme; label: string; color: string }[] = [
    { id: 'night_city', label: 'Night City 2077', color: 'bg-[#fcee0a]' },
    { id: 'cyberpunk', label: 'Cyber Neon', color: 'bg-cyan-400' },
    { id: 'synthwave', label: 'Synthwave 80s', color: 'bg-fuchsia-500' },
    { id: 'tokyo_night', label: 'Tokyo Night', color: 'bg-[#7aa2f7]' },
    { id: 'tokyo_rain', label: 'Tokyo Rain', color: 'bg-purple-400' },
    { id: 'nord_aurora', label: 'Nordic Aurora', color: 'bg-[#88c0d0]' },
    { id: 'matrix', label: 'Matrix Terminal', color: 'bg-emerald-400' },
    { id: 'amber_crt', label: 'Vintage Amber CRT', color: 'bg-[#ffb000]' },
    { id: 'dracula', label: 'Dracula Gothic', color: 'bg-[#ff79c6]' },
    { id: 'catppuccin', label: 'Catppuccin Mocha', color: 'bg-[#cba6f7]' },
    { id: 'luxury_gold', label: 'Royal Obsidian Gold', color: 'bg-amber-400' },
    { id: 'cosmic_nebula', label: 'Cosmic Nebula', color: 'bg-pink-500' },
    { id: 'solar_flare', label: 'Solar Flare', color: 'bg-orange-500' },
    { id: 'rose_quartz', label: 'Rose Quartz', color: 'bg-pink-300' },
    { id: 'swiss_bauhaus', label: 'Swiss Bauhaus', color: 'bg-rose-500' },
    { id: 'oled', label: 'OLED Pure Black', color: 'bg-neutral-950 border border-neutral-600' },
    { id: 'emerald', label: 'Emerald Forest', color: 'bg-teal-400' },
    { id: 'slate', label: 'Deep Slate', color: 'bg-slate-600' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Mode Selector */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setMode('digital')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              mode === 'digital' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Digital
          </button>
          <button
            onClick={() => setMode('flip')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              mode === 'flip' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Flip Clock
          </button>
          <button
            onClick={() => setMode('analog')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              mode === 'analog' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Analog
          </button>
          <button
            onClick={() => setMode('pomodoro')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              mode === 'pomodoro' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Pomodoro Focus
          </button>
          <button
            onClick={() => setMode('stopwatch')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              mode === 'stopwatch' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Stopwatch
          </button>
        </div>

        {/* Action Controls & Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Chime / Tick Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) {
                playChimeSound(880, 0.4);
              }
            }}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
            title={soundEnabled ? 'Mute Sounds & Chimes' : 'Enable Audio Chimes & Ticks'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Timezone Selector */}
          <div className="relative">
            <select
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              {TIMEZONES.map(tz => (
                <option key={tz.id} value={tz.id}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          {/* Typography Font Switcher */}
          <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold">
            <button
              onClick={() => setFontStyle('mono')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                fontStyle === 'mono' ? 'bg-white dark:bg-slate-700 shadow-xs text-brand-600 dark:text-brand-300' : 'text-slate-500'
              }`}
              title="Monospace Font"
            >
              Mono
            </button>
            <button
              onClick={() => setFontStyle('sans')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                fontStyle === 'sans' ? 'bg-white dark:bg-slate-700 shadow-xs text-brand-600 dark:text-brand-300' : 'text-slate-500'
              }`}
              title="Modern Sans Font"
            >
              Sans
            </button>
            <button
              onClick={() => setFontStyle('digital')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                fontStyle === 'digital' ? 'bg-white dark:bg-slate-700 shadow-xs text-brand-600 dark:text-brand-300' : 'text-slate-500'
              }`}
              title="Digital Segment Font"
            >
              LCD
            </button>
            <button
              onClick={() => setFontStyle('serif')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                fontStyle === 'serif' ? 'bg-white dark:bg-slate-700 shadow-xs text-brand-600 dark:text-brand-300' : 'text-slate-500'
              }`}
              title="Luxury Serif Font"
            >
              Serif
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
            <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Mode Specific Options Bar */}
      {mode === 'digital' || mode === 'flip' || mode === 'analog' ? (
        <div className="flex flex-wrap items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <button
              onClick={() => setIs24Hour(!is24Hour)}
              className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                is24Hour
                  ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-600 dark:text-brand-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              24-Hour
            </button>

            <button
              onClick={() => setShowSeconds(!showSeconds)}
              className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                showSeconds
                  ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-600 dark:text-brand-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              Seconds
            </button>

            <button
              onClick={() => setShowDate(!showDate)}
              className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                showDate
                  ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-600 dark:text-brand-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              Date
            </button>
          </div>

          {/* Editable Work Tag Badge without laptop emoji */}
          <div className="flex items-center gap-1.5">
            {isEditingTag ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTag(false)}
                  autoFocus
                  className="px-3 py-1 text-xs rounded-xl bg-white dark:bg-slate-900 border border-brand-500 text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  onClick={() => setIsEditingTag(false)}
                  className="p-1 rounded-lg bg-brand-600 text-white hover:bg-brand-700 cursor-pointer"
                >
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingTag(true)}
                className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:border-brand-500/50 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Click to edit focus status label"
              >
                <span>{customTag}</span>
                <Edit2 size={11} className="text-slate-400" />
              </button>
            )}
          </div>
        </div>
      ) : mode === 'pomodoro' ? (
        <div className="flex items-center gap-2 px-2">
          <button
            onClick={() => {
              setPomoDuration(25 * 60);
              setPomoTimeLeft(25 * 60);
              setPomoMode('work');
              setPomoIsRunning(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              pomoDuration === 25 * 60 && pomoMode === 'work'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            25m Standard Focus
          </button>
          <button
            onClick={() => {
              setPomoDuration(50 * 60);
              setPomoTimeLeft(50 * 60);
              setPomoMode('work');
              setPomoIsRunning(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              pomoDuration === 50 * 60 && pomoMode === 'work'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            50m Deep Work
          </button>
          <button
            onClick={() => {
              setPomoMode('break');
              setPomoTimeLeft(5 * 60);
              setPomoIsRunning(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              pomoMode === 'break'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            5m Short Break
          </button>
          <button
            onClick={() => {
              setPomoMode('break');
              setPomoTimeLeft(15 * 60);
              setPomoIsRunning(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              pomoTimeLeft === 15 * 60 && pomoMode === 'break'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            15m Long Break
          </button>
        </div>
      ) : null}

      {/* Aesthetic Theme Swatches */}
      <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-400" />
            Style Themes ({themes.length} Aesthetics)
          </span>
          <span className="text-[11px] font-mono text-slate-500">Selected: {themes.find(t => t.id === theme)?.label}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer truncate ${
                theme === t.id
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-[1.03] ring-2 ring-brand-400/40'
                  : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <span className={`w-3 h-3 rounded-full shrink-0 shadow-xs ${t.color}`} />
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Clock Canvas Display */}
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-3xl ${themeConfig.bg} ${themeConfig.border} border p-8 sm:p-14 min-h-[460px] flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-500 select-none ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen border-none' : ''
        }`}
      >
        {/* Glow backdrop layer */}
        <div className={`absolute inset-0 ${themeConfig.glow} pointer-events-none`} />

        {/* Top Floating Info in Fullscreen & Normal */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-auto">
          <span className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${themeConfig.badgeBg}`}>
            {customTag}
          </span>

          {isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer"
              title="Exit Fullscreen"
            >
              <Minimize size={18} />
            </button>
          )}
        </div>

        {/* Mode 1: Digital Display Mode */}
        {mode === 'digital' && (
          <div className="relative z-10 space-y-4 my-auto">
            <div className="flex items-baseline justify-center gap-1 sm:gap-3">
              <span
                className={`text-6xl sm:text-8xl md:text-9xl tracking-tight leading-none ${getFontFamilyClass()} ${themeConfig.clockText}`}
              >
                {hoursStr}
                <span className="animate-pulse opacity-90 mx-0.5 sm:mx-1">:</span>
                {minutesStr}
                {showSeconds && (
                  <>
                    <span className="animate-pulse opacity-90 mx-0.5 sm:mx-1">:</span>
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

        {/* Mode 2: Flip Card Clock Mode */}
        {mode === 'flip' && (
          <div className="relative z-10 space-y-6 my-auto">
            <div className="flex items-center justify-center gap-3 sm:gap-6">
              {/* Hours Card */}
              <div className="flex flex-col items-center">
                <div
                  className={`relative w-24 sm:w-36 md:w-44 h-32 sm:h-44 md:h-52 rounded-3xl border flex items-center justify-center ${themeConfig.flipCard} shadow-2xl overflow-hidden`}
                >
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/40 shadow-xs z-20" />
                  <span className={`text-5xl sm:text-7xl md:text-8xl font-black ${getFontFamilyClass()}`}>
                    {hoursStr}
                  </span>
                </div>
                <span className="text-xs uppercase font-extrabold text-slate-500 mt-2">Hours</span>
              </div>

              <div className={`text-4xl sm:text-6xl font-black animate-pulse ${themeConfig.accent}`}>:</div>

              {/* Minutes Card */}
              <div className="flex flex-col items-center">
                <div
                  className={`relative w-24 sm:w-36 md:w-44 h-32 sm:h-44 md:h-52 rounded-3xl border flex items-center justify-center ${themeConfig.flipCard} shadow-2xl overflow-hidden`}
                >
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/40 shadow-xs z-20" />
                  <span className={`text-5xl sm:text-7xl md:text-8xl font-black ${getFontFamilyClass()}`}>
                    {minutesStr}
                  </span>
                </div>
                <span className="text-xs uppercase font-extrabold text-slate-500 mt-2">Minutes</span>
              </div>

              {showSeconds && (
                <>
                  <div className={`text-4xl sm:text-6xl font-black animate-pulse ${themeConfig.accent}`}>:</div>
                  {/* Seconds Card */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`relative w-20 sm:w-28 md:w-36 h-28 sm:h-36 md:h-44 rounded-3xl border flex items-center justify-center ${themeConfig.flipCard} shadow-2xl overflow-hidden opacity-90`}
                    >
                      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/40 shadow-xs z-20" />
                      <span className={`text-4xl sm:text-6xl md:text-7xl font-black ${getFontFamilyClass()}`}>
                        {secondsStr}
                      </span>
                    </div>
                    <span className="text-xs uppercase font-extrabold text-slate-500 mt-2">Seconds</span>
                  </div>
                </>
              )}

              {!is24Hour && (
                <div className="flex flex-col justify-center self-center pl-2">
                  <span className={`text-xl sm:text-3xl font-extrabold uppercase ${themeConfig.accent}`}>
                    {ampm}
                  </span>
                </div>
              )}
            </div>

            {showDate && (
              <p className="text-sm sm:text-lg font-medium tracking-wide text-slate-400">
                {dateStr}
              </p>
            )}
          </div>
        )}

        {/* Mode 3: Razor-Sharp SVG Analog Chronometer */}
        {mode === 'analog' && (
          <div className="relative z-10 flex flex-col items-center space-y-5 my-auto">
            <div className="relative w-72 h-72 sm:w-84 sm:h-84 flex items-center justify-center">
              <svg
                viewBox="0 0 300 300"
                className="w-full h-full drop-shadow-2xl select-none"
              >
                {/* Watch Outer Ring & Dial Face */}
                <circle
                  cx="150"
                  cy="150"
                  r="142"
                  fill={themeConfig.dialBg}
                  stroke={themeConfig.dialBorder}
                  strokeWidth="3.5"
                  strokeOpacity="0.4"
                />
                <circle
                  cx="150"
                  cy="150"
                  r="134"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1.5"
                />

                {/* 60 Minute / Second Tick Marks */}
                {[...Array(60)].map((_, i) => {
                  const isHourTick = i % 5 === 0;
                  const isMajorTick = i % 15 === 0;
                  return (
                    <line
                      key={i}
                      x1="150"
                      y1={isMajorTick ? '18' : isHourTick ? '22' : '26'}
                      x2="150"
                      y2={isMajorTick ? '36' : isHourTick ? '32' : '29'}
                      stroke={isMajorTick ? '#ffffff' : isHourTick ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)'}
                      strokeWidth={isMajorTick ? '3.5' : isHourTick ? '2' : '1'}
                      strokeLinecap="round"
                      transform={`rotate(${i * 6} 150 150)`}
                    />
                  );
                })}

                {/* 12 Hour Numbers */}
                {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, idx) => {
                  const angleRad = ((idx * 30 - 90) * Math.PI) / 180;
                  const radius = 104;
                  const x = 150 + radius * Math.cos(angleRad);
                  const y = 150 + radius * Math.sin(angleRad) + 5;
                  return (
                    <text
                      key={num}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="rgba(255,255,255,0.85)"
                      fontSize="14"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {num}
                    </text>
                  );
                })}

                {/* Hour Hand */}
                <line
                  x1="150"
                  y1="150"
                  x2="150"
                  y2="76"
                  stroke={themeConfig.handHr}
                  strokeWidth="6"
                  strokeLinecap="round"
                  transform={`rotate(${hrAngle} 150 150)`}
                  style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))' }}
                />

                {/* Minute Hand */}
                <line
                  x1="150"
                  y1="150"
                  x2="150"
                  y2="46"
                  stroke={themeConfig.handMin}
                  strokeWidth="4"
                  strokeLinecap="round"
                  transform={`rotate(${minAngle} 150 150)`}
                  style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}
                />

                {/* Second Hand with Counterweight */}
                {showSeconds && (
                  <g transform={`rotate(${secAngle} 150 150)`}>
                    {/* Tail counterweight */}
                    <line
                      x1="150"
                      y1="150"
                      x2="150"
                      y2="175"
                      stroke={themeConfig.handSec}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Main needle */}
                    <line
                      x1="150"
                      y1="150"
                      x2="150"
                      y2="34"
                      stroke={themeConfig.handSec}
                      strokeWidth="2"
                      strokeLinecap="round"
                      style={{ filter: `drop-shadow(0 0 6px ${themeConfig.handSec})` }}
                    />
                  </g>
                )}

                {/* Center Pivot Pin */}
                <circle cx="150" cy="150" r="7" fill={themeConfig.handSec} stroke="#000" strokeWidth="2" />
                <circle cx="150" cy="150" r="2.5" fill="#ffffff" />
              </svg>
            </div>

            {/* Sub Digital Readout */}
            <div className={`flex items-center gap-2 text-xl font-bold ${getFontFamilyClass()} text-slate-200`}>
              <span>{hoursStr}:{minutesStr}{showSeconds ? `:${secondsStr}` : ''}</span>
              {!is24Hour && <span className={`text-xs uppercase ${themeConfig.accent}`}>{ampm}</span>}
            </div>

            {showDate && <p className="text-xs text-slate-400">{dateStr}</p>}
          </div>
        )}

        {/* Mode 4: Pomodoro Focus Timer Mode */}
        {mode === 'pomodoro' && (
          <div className="relative z-10 space-y-6 my-auto">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-md ${themeConfig.badgeBg}`}>
              {pomoMode === 'work' ? 'Focus Session' : 'Short Break'}
            </span>

            <div className={`text-7xl sm:text-9xl tracking-tight leading-none ${getFontFamilyClass()} ${themeConfig.clockText}`}>
              {pomoMinutes}:{pomoSeconds}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setPomoIsRunning(!pomoIsRunning)}
                className="px-7 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-sm flex items-center gap-2 backdrop-blur-xl active:scale-95 transition-all cursor-pointer shadow-lg"
              >
                {pomoIsRunning ? <Pause size={18} /> : <Play size={18} />}
                <span>{pomoIsRunning ? 'Pause Session' : 'Start Focus'}</span>
              </button>

              <button
                onClick={() => {
                  setPomoIsRunning(false);
                  setPomoTimeLeft(pomoMode === 'work' ? pomoDuration : 5 * 60);
                }}
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Mode 5: Stopwatch & Lap Counter Mode */}
        {mode === 'stopwatch' && (
          <div className="relative z-10 space-y-6 my-auto w-full max-w-md">
            <div className={`text-6xl sm:text-8xl tracking-tight leading-none ${getFontFamilyClass()} ${themeConfig.clockText}`}>
              {swMinutes}:{swSeconds}
              <span className="text-3xl sm:text-5xl opacity-80">.{swMs}</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setSwIsRunning(!swIsRunning)}
                className="px-6 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-sm flex items-center gap-2 backdrop-blur-xl active:scale-95 transition-all cursor-pointer shadow-lg"
              >
                {swIsRunning ? <Pause size={16} /> : <Play size={16} />}
                <span>{swIsRunning ? 'Stop' : 'Start'}</span>
              </button>

              <button
                onClick={() => {
                  if (swIsRunning) {
                    const lastLapTime = swLaps.length > 0 ? swLaps[0].time : 0;
                    setSwLaps([
                      {
                        id: swLaps.length + 1,
                        time: swTime,
                        lapDuration: swTime - lastLapTime,
                      },
                      ...swLaps,
                    ]);
                  } else {
                    setSwTime(0);
                    setSwLaps([]);
                  }
                }}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {swIsRunning ? (
                  <>
                    <Flag size={14} />
                    <span>Lap</span>
                  </>
                ) : (
                  <>
                    <RotateCcw size={14} />
                    <span>Reset</span>
                  </>
                )}
              </button>
            </div>

            {/* Lap list */}
            {swLaps.length > 0 && (
              <div className="max-h-36 overflow-y-auto space-y-1 p-2 rounded-2xl bg-black/30 border border-white/10 text-xs">
                {swLaps.map(lap => (
                  <div key={lap.id} className="flex items-center justify-between px-3 py-1.5 text-slate-300">
                    <span className="font-bold">Lap {lap.id}</span>
                    <span className="font-mono">
                      +{(lap.lapDuration / 1000).toFixed(2)}s ({Math.floor(lap.time / 1000)}s)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Presentation Hint */}
        <p className="absolute bottom-4 text-[11px] text-slate-500 opacity-60 font-mono">
          Press Fullscreen for second-monitor display • Audio chimes supported
        </p>
      </div>
    </div>
  );
};
