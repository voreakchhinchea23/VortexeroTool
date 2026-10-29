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
  Calendar as CalendarIcon,
  Radio,
  Type,
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
  | 'slate'
  | 'kyoto_twilight'
  | 'abyss_ocean'
  | 'paper_studio'
  | 'warm_espresso'
  | 'toxic_lime'
  | 'frost_aurora'
  | 'midnight_velocity'
  | 'dreamy_lilac'
  | 'sahara_dune'
  | 'electric_violet'
  | 'matcha_minimal'
  | 'solarized_dark'
  | 'gruvbox_warm'
  | 'miami_sunset'
  | 'monokai_pro'
  | 'alpine_glacier'
  | 'crimson_eclipse'
  | 'california_dusk';

type Mode = 'digital' | 'stacked' | 'radial' | 'words' | 'calendar' | 'flip' | 'analog' | 'pomodoro' | 'stopwatch';
type FontStyle = 'mono' | 'sans' | 'serif' | 'digital' | 'condensed' | 'minimal';
type ThemeCategory = 'all' | 'cyber' | 'space' | 'warm' | 'minimal';

interface LapItem {
  id: number;
  time: number;
  lapDuration: number;
}

interface ThemeStyles {
  bg: string;
  clockText: string;
  glow: string;
  accent: string;
  border: string;
  badgeBg: string;
  handSec: string;
  handMin: string;
  handHr: string;
  dialBg: string;
  dialBorder: string;
  flipCard: string;
  progressBar: string;
  subText?: string;
  dialTickMajor?: string;
  dialTickMinor?: string;
  dialNumColor?: string;
  isLight?: boolean;
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
  const [mode, setMode] = useState<Mode>(() => {
    return (localStorage.getItem('vortexero_clock_mode') as Mode) || 'digital';
  });
  const [theme, setTheme] = useState<ClockTheme>(() => {
    return (localStorage.getItem('vortexero_clock_theme') as ClockTheme) || 'night_city';
  });
  const [fontStyle, setFontStyle] = useState<FontStyle>(() => {
    return (localStorage.getItem('vortexero_clock_font') as FontStyle) || 'mono';
  });
  const [themeCategory, setThemeCategory] = useState<ThemeCategory>('all');
  const [selectedTimezone, setSelectedTimezone] = useState<string>(() => {
    return localStorage.getItem('vortexero_clock_tz') || 'local';
  });
  const [is24Hour, setIs24Hour] = useState<boolean>(() => {
    return localStorage.getItem('vortexero_clock_24h') === 'true';
  });
  const [showSeconds, setShowSeconds] = useState<boolean>(() => {
    return localStorage.getItem('vortexero_clock_seconds') !== 'false';
  });
  const [showDate, setShowDate] = useState<boolean>(() => {
    return localStorage.getItem('vortexero_clock_date') !== 'false';
  });
  const [showProgressBar, setShowProgressBar] = useState<boolean>(() => {
    return localStorage.getItem('vortexero_clock_progressbar') !== 'false';
  });
  const [ambientGlow, setAmbientGlow] = useState<boolean>(() => {
    return localStorage.getItem('vortexero_clock_glow') !== 'false';
  });
  const [customTag, setCustomTag] = useState<string>(() => {
    return localStorage.getItem('vortexero_clock_tag') || 'Deep Work Focus';
  });
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('vortexero_clock_sound') === 'true';
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Time state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Pomodoro state
  const [pomoDuration, setPomoDuration] = useState(25 * 60);
  const [pomoTargetDuration, setPomoTargetDuration] = useState(25 * 60);
  const [pomoTimeLeft, setPomoTimeLeft] = useState(25 * 60);
  const [pomoIsRunning, setPomoIsRunning] = useState(false);
  const [pomoMode, setPomoMode] = useState<'work' | 'break'>('work');

  // Stopwatch state
  const [swTime, setSwTime] = useState(0);
  const [swIsRunning, setSwIsRunning] = useState(false);
  const [swLaps, setSwLaps] = useState<LapItem[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Save all preferences to localStorage
  useEffect(() => {
    localStorage.setItem('vortexero_clock_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('vortexero_clock_mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('vortexero_clock_font', fontStyle);
  }, [fontStyle]);

  useEffect(() => {
    localStorage.setItem('vortexero_clock_progressbar', String(showProgressBar));
  }, [showProgressBar]);

  useEffect(() => {
    localStorage.setItem('vortexero_clock_glow', String(ambientGlow));
  }, [ambientGlow]);

  useEffect(() => {
    localStorage.setItem('vortexero_clock_tz', selectedTimezone);
  }, [selectedTimezone]);

  useEffect(() => {
    localStorage.setItem('vortexero_clock_24h', String(is24Hour));
  }, [is24Hour]);

  useEffect(() => {
    localStorage.setItem('vortexero_clock_seconds', String(showSeconds));
  }, [showSeconds]);

  useEffect(() => {
    localStorage.setItem('vortexero_clock_date', String(showDate));
  }, [showDate]);

  useEffect(() => {
    localStorage.setItem('vortexero_clock_tag', customTag);
  }, [customTag]);

  useEffect(() => {
    localStorage.setItem('vortexero_clock_sound', String(soundEnabled));
  }, [soundEnabled]);

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
      case 'condensed':
        return 'font-sans font-black tracking-tighter uppercase inline-block';
      case 'minimal':
        return 'font-sans font-light tracking-[0.16em] uppercase';
      case 'serif':
        return 'font-serif font-bold tracking-normal';
      case 'digital':
        return 'font-orbitron font-bold tracking-widest uppercase';
      case 'mono':
      default:
        return 'font-mono font-bold tracking-tight';
    }
  };

  // Comprehensive Aesthetic Theme Styles (28 Curated Styles)
  const getThemeStyles = (): ThemeStyles => {
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
          progressBar: 'bg-[#fcee0a]',
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
          progressBar: 'bg-gradient-to-r from-cyan-400 to-fuchsia-500',
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
          progressBar: 'bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400',
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
          progressBar: 'bg-gradient-to-r from-[#7aa2f7] to-[#bb9af7]',
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
          progressBar: 'bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-400',
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
          progressBar: 'bg-gradient-to-r from-[#88c0d0] to-[#a3be8c]',
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
          progressBar: 'bg-emerald-400',
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
          progressBar: 'bg-[#ffb000]',
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
          progressBar: 'bg-gradient-to-r from-[#ff79c6] to-[#50fa7b]',
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
          progressBar: 'bg-gradient-to-r from-[#cba6f7] to-[#f5c2e7]',
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
          progressBar: 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500',
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
          progressBar: 'bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-500',
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
          progressBar: 'bg-gradient-to-r from-amber-400 to-orange-500',
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
          progressBar: 'bg-gradient-to-r from-pink-400 to-rose-300',
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
          progressBar: 'bg-rose-500',
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
          progressBar: 'bg-white',
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
          progressBar: 'bg-teal-400',
        };
      case 'slate':
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
          progressBar: 'bg-blue-500',
        };
      case 'kyoto_twilight':
        return {
          bg: 'bg-[#140a10]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-500 to-red-600 drop-shadow-[0_0_35px_rgba(244,63,94,0.8)]',
          glow: 'bg-gradient-to-tr from-rose-500/15 via-amber-500/10 to-red-600/15',
          accent: 'text-[#ff4757]',
          border: 'border-rose-500/30',
          badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
          handSec: '#ff4757',
          handMin: '#fb7185',
          handHr: '#f43f5e',
          dialBg: '#1f0d18',
          dialBorder: '#ff4757',
          flipCard: 'bg-[#220e1a] text-rose-300 border-rose-500/30 shadow-rose-500/20',
          progressBar: 'bg-gradient-to-r from-amber-400 via-rose-500 to-red-500',
        };
      case 'abyss_ocean':
        return {
          bg: 'bg-[#020b14]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-cyan-400 to-blue-500 drop-shadow-[0_0_35px_rgba(6,182,212,0.85)]',
          glow: 'bg-gradient-to-tr from-cyan-500/15 via-teal-500/10 to-blue-600/15',
          accent: 'text-[#00f2fe]',
          border: 'border-cyan-500/30',
          badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
          handSec: '#00f2fe',
          handMin: '#38bdf8',
          handHr: '#0284c7',
          dialBg: '#051829',
          dialBorder: '#00f2fe',
          flipCard: 'bg-[#061d33] text-cyan-300 border-cyan-500/30 shadow-cyan-500/20',
          progressBar: 'bg-gradient-to-r from-teal-300 via-cyan-400 to-blue-500',
        };
      case 'paper_studio':
        return {
          bg: 'bg-[#f8f9fa]',
          clockText: 'text-slate-900 drop-shadow-[0_2px_12px_rgba(0,0,0,0.06)]',
          glow: 'bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.04),transparent_70%)]',
          accent: 'text-rose-600',
          border: 'border-slate-300/80',
          badgeBg: 'bg-slate-200/90 text-slate-800 border-slate-300',
          handSec: '#ef4444',
          handMin: '#1e293b',
          handHr: '#0f172a',
          dialBg: '#ffffff',
          dialBorder: '#cbd5e1',
          flipCard: 'bg-white text-slate-900 border-slate-300 shadow-xl shadow-slate-300/50',
          subText: 'text-slate-600',
          dialTickMajor: '#0f172a',
          dialTickMinor: 'rgba(15,23,42,0.3)',
          dialNumColor: '#0f172a',
          progressBar: 'bg-rose-500',
          isLight: true,
        };
      case 'warm_espresso':
        return {
          bg: 'bg-[#160f0a]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_0_25px_rgba(217,119,6,0.65)]',
          glow: 'bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.12),transparent_70%)]',
          accent: 'text-[#fde68a]',
          border: 'border-amber-600/30',
          badgeBg: 'bg-amber-600/15 text-amber-200 border-amber-600/40',
          handSec: '#d97706',
          handMin: '#fde68a',
          handHr: '#b45309',
          dialBg: '#231710',
          dialBorder: '#d97706',
          flipCard: 'bg-[#271a12] text-amber-200 border-amber-600/30 shadow-amber-900/30',
          progressBar: 'bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600',
        };
      case 'toxic_lime':
        return {
          bg: 'bg-[#050a03]',
          clockText: 'text-[#ccff00] drop-shadow-[0_0_35px_rgba(204,255,0,0.85)]',
          glow: 'bg-[radial-gradient(ellipse_at_center,rgba(204,255,0,0.14),transparent_70%)]',
          accent: 'text-[#a3e635]',
          border: 'border-[#ccff00]/30',
          badgeBg: 'bg-[#ccff00]/15 text-[#ccff00] border-[#ccff00]/40',
          handSec: '#ccff00',
          handMin: '#bef264',
          handHr: '#84cc16',
          dialBg: '#0b1606',
          dialBorder: '#ccff00',
          flipCard: 'bg-[#0d1a08] text-[#ccff00] border-[#ccff00]/30 shadow-[#ccff00]/20',
          progressBar: 'bg-[#ccff00]',
        };
      case 'frost_aurora':
        return {
          bg: 'bg-[#06111e]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-teal-200 drop-shadow-[0_0_30px_rgba(186,230,253,0.85)]',
          glow: 'bg-gradient-to-tr from-sky-500/15 via-teal-500/10 to-transparent',
          accent: 'text-[#7dd3fc]',
          border: 'border-sky-400/30',
          badgeBg: 'bg-sky-500/15 text-sky-200 border-sky-400/40',
          handSec: '#38bdf8',
          handMin: '#bae6fd',
          handHr: '#7dd3fc',
          dialBg: '#0b2038',
          dialBorder: '#38bdf8',
          flipCard: 'bg-[#0e2744] text-sky-200 border-sky-400/30 shadow-sky-500/20',
          progressBar: 'bg-gradient-to-r from-sky-300 via-teal-200 to-blue-400',
        };
      case 'midnight_velocity':
        return {
          bg: 'bg-[#0b0c10]',
          clockText: 'text-[#ff2b44] drop-shadow-[0_0_35px_rgba(255,43,68,0.9)]',
          glow: 'bg-[radial-gradient(ellipse_at_center,rgba(255,43,68,0.14),transparent_70%)]',
          accent: 'text-[#facc15]',
          border: 'border-red-500/30',
          badgeBg: 'bg-red-500/15 text-red-300 border-red-500/40',
          handSec: '#facc15',
          handMin: '#ff2b44',
          handHr: '#b91c1c',
          dialBg: '#161820',
          dialBorder: '#ff2b44',
          flipCard: 'bg-[#181924] text-[#ff2b44] border-red-500/30 shadow-red-500/20',
          progressBar: 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-400',
        };
      case 'dreamy_lilac':
        return {
          bg: 'bg-[#120e22]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-300 drop-shadow-[0_0_30px_rgba(216,180,254,0.7)]',
          glow: 'bg-gradient-to-tr from-purple-500/15 via-pink-500/10 to-indigo-500/15',
          accent: 'text-[#f472b6]',
          border: 'border-purple-400/30',
          badgeBg: 'bg-purple-500/15 text-purple-200 border-purple-400/40',
          handSec: '#c084fc',
          handMin: '#f472b6',
          handHr: '#a855f7',
          dialBg: '#1f183b',
          dialBorder: '#c084fc',
          flipCard: 'bg-[#231b42] text-purple-200 border-purple-400/30 shadow-purple-500/20',
          progressBar: 'bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-400',
        };
      case 'sahara_dune':
        return {
          bg: 'bg-[#170e08]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-400 to-rose-400 drop-shadow-[0_0_25px_rgba(251,146,60,0.7)]',
          glow: 'bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.12),transparent_70%)]',
          accent: 'text-[#fb923c]',
          border: 'border-orange-500/30',
          badgeBg: 'bg-orange-500/15 text-orange-200 border-orange-500/40',
          handSec: '#f59e0b',
          handMin: '#fb923c',
          handHr: '#c2410c',
          dialBg: '#26160c',
          dialBorder: '#fb923c',
          flipCard: 'bg-[#2a180e] text-orange-200 border-orange-500/30 shadow-orange-950/40',
          progressBar: 'bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400',
        };
      case 'electric_violet':
        return {
          bg: 'bg-[#0c0317]',
          clockText: 'text-[#d946ef] drop-shadow-[0_0_35px_rgba(217,70,239,0.85)]',
          glow: 'bg-[radial-gradient(ellipse_at_center,rgba(217,70,239,0.14),transparent_70%)]',
          accent: 'text-[#f0abfc]',
          border: 'border-fuchsia-500/30',
          badgeBg: 'bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-500/40',
          handSec: '#c084fc',
          handMin: '#e879f9',
          handHr: '#a21caf',
          dialBg: '#1b0733',
          dialBorder: '#d946ef',
          flipCard: 'bg-[#20093d] text-fuchsia-200 border-fuchsia-500/30 shadow-fuchsia-500/20',
          progressBar: 'bg-gradient-to-r from-fuchsia-400 via-purple-500 to-pink-500',
        };
      case 'matcha_minimal':
        return {
          bg: 'bg-[#09130d]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-lime-200 via-emerald-300 to-green-400 drop-shadow-[0_0_28px_rgba(163,230,53,0.7)]',
          glow: 'bg-gradient-to-tr from-lime-500/12 via-emerald-600/10 to-transparent',
          accent: 'text-[#bef264]',
          border: 'border-lime-500/25',
          badgeBg: 'bg-lime-500/15 text-lime-300 border-lime-500/35',
          handSec: '#bef264',
          handMin: '#86efac',
          handHr: '#4ade80',
          dialBg: '#0f2216',
          dialBorder: '#86efac',
          flipCard: 'bg-[#11261a] text-lime-300 border-lime-500/30 shadow-lime-950/40',
          progressBar: 'bg-gradient-to-r from-lime-300 to-emerald-400',
        };
      case 'solarized_dark':
        return {
          bg: 'bg-[#002b36]',
          clockText: 'text-[#2aa198] drop-shadow-[0_0_30px_rgba(42,161,152,0.8)]',
          glow: 'bg-[radial-gradient(ellipse_at_center,rgba(42,161,152,0.14),transparent_70%)]',
          accent: 'text-[#b58900]',
          border: 'border-[#2aa198]/30',
          badgeBg: 'bg-[#2aa198]/15 text-[#2aa198] border-[#2aa198]/40',
          handSec: '#b58900',
          handMin: '#2aa198',
          handHr: '#268bd2',
          dialBg: '#073642',
          dialBorder: '#2aa198',
          flipCard: 'bg-[#073642] text-[#2aa198] border-[#2aa198]/30 shadow-[#002b36]',
          progressBar: 'bg-gradient-to-r from-[#2aa198] to-[#b58900]',
        };
      case 'gruvbox_warm':
        return {
          bg: 'bg-[#1d2021]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-[#ebdbb2] via-[#fabd2f] to-[#fe8019] drop-shadow-[0_0_25px_rgba(250,189,47,0.7)]',
          glow: 'bg-[radial-gradient(ellipse_at_center,rgba(250,189,47,0.12),transparent_70%)]',
          accent: 'text-[#fabd2f]',
          border: 'border-[#d65d0e]/30',
          badgeBg: 'bg-[#fabd2f]/15 text-[#fabd2f] border-[#fabd2f]/40',
          handSec: '#fe8019',
          handMin: '#ebdbb2',
          handHr: '#fabd2f',
          dialBg: '#282828',
          dialBorder: '#fabd2f',
          flipCard: 'bg-[#282828] text-[#ebdbb2] border-[#fabd2f]/30 shadow-black/50',
          progressBar: 'bg-gradient-to-r from-[#fabd2f] via-[#fe8019] to-[#cc241d]',
        };
      case 'miami_sunset':
        return {
          bg: 'bg-[#0a0518]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-[#00f5d4] via-[#7b2cbf] to-[#f72585] drop-shadow-[0_0_35px_rgba(247,37,133,0.8)]',
          glow: 'bg-gradient-to-tr from-[#00f5d4]/15 via-[#7209b7]/15 to-[#f72585]/15',
          accent: 'text-[#00f5d4]',
          border: 'border-[#f72585]/30',
          badgeBg: 'bg-[#f72585]/15 text-[#f72585] border-[#f72585]/40',
          handSec: '#00f5d4',
          handMin: '#f72585',
          handHr: '#7209b7',
          dialBg: '#150a2e',
          dialBorder: '#f72585',
          flipCard: 'bg-[#1a0e38] text-[#00f5d4] border-[#f72585]/30 shadow-[#f72585]/20',
          progressBar: 'bg-gradient-to-r from-[#00f5d4] via-[#7209b7] to-[#f72585]',
        };
      case 'monokai_pro':
        return {
          bg: 'bg-[#221f22]',
          clockText: 'text-[#ffd866] drop-shadow-[0_0_30px_rgba(255,216,102,0.85)]',
          glow: 'bg-gradient-to-tr from-[#ff6188]/15 via-[#ffd866]/15 to-[#a9dc76]/10',
          accent: 'text-[#ff6188]',
          border: 'border-[#ffd866]/30',
          badgeBg: 'bg-[#ffd866]/15 text-[#ffd866] border-[#ffd866]/40',
          handSec: '#ff6188',
          handMin: '#ffd866',
          handHr: '#78dce8',
          dialBg: '#2d2a2e',
          dialBorder: '#ffd866',
          flipCard: 'bg-[#2d2a2e] text-[#ffd866] border-[#ffd866]/30 shadow-black/40',
          progressBar: 'bg-gradient-to-r from-[#ff6188] via-[#ffd866] to-[#a9dc76]',
        };
      case 'alpine_glacier':
        return {
          bg: 'bg-[#f0f4f9]',
          clockText: 'text-[#0f172a] drop-shadow-[0_2px_14px_rgba(15,23,42,0.08)]',
          glow: 'bg-[radial-gradient(ellipse_at_center,rgba(2,132,199,0.08),transparent_70%)]',
          accent: 'text-[#0284c7]',
          border: 'border-slate-300',
          badgeBg: 'bg-sky-100/90 text-sky-900 border-sky-300',
          handSec: '#0284c7',
          handMin: '#1e293b',
          handHr: '#0f172a',
          dialBg: '#ffffff',
          dialBorder: '#38bdf8',
          flipCard: 'bg-white text-slate-900 border-slate-300 shadow-xl shadow-sky-900/10',
          subText: 'text-slate-600',
          dialTickMajor: '#0f172a',
          dialTickMinor: 'rgba(15,23,42,0.3)',
          dialNumColor: '#0f172a',
          progressBar: 'bg-gradient-to-r from-sky-400 to-blue-600',
          isLight: true,
        };
      case 'crimson_eclipse':
        return {
          bg: 'bg-[#080305]',
          clockText: 'text-[#ff1744] drop-shadow-[0_0_35px_rgba(255,23,68,0.9)]',
          glow: 'bg-[radial-gradient(ellipse_at_center,rgba(255,23,68,0.16),transparent_70%)]',
          accent: 'text-[#ff5252]',
          border: 'border-[#ff1744]/30',
          badgeBg: 'bg-[#ff1744]/15 text-[#ff5252] border-[#ff1744]/40',
          handSec: '#ff1744',
          handMin: '#ff5252',
          handHr: '#b71c1c',
          dialBg: '#140509',
          dialBorder: '#ff1744',
          flipCard: 'bg-[#1a080d] text-[#ff1744] border-[#ff1744]/30 shadow-[#ff1744]/20',
          progressBar: 'bg-[#ff1744]',
        };
      case 'california_dusk':
        return {
          bg: 'bg-[#10081c]',
          clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-purple-500 drop-shadow-[0_0_30px_rgba(244,63,94,0.75)]',
          glow: 'bg-gradient-to-tr from-amber-500/15 via-rose-500/15 to-purple-600/15',
          accent: 'text-[#fbbf24]',
          border: 'border-rose-500/30',
          badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
          handSec: '#fbbf24',
          handMin: '#fb7185',
          handHr: '#c084fc',
          dialBg: '#1d0f30',
          dialBorder: '#fb7185',
          flipCard: 'bg-[#22123a] text-rose-300 border-rose-500/30 shadow-purple-950/40',
          progressBar: 'bg-gradient-to-r from-amber-300 via-rose-400 to-purple-500',
        };
      default:
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
          progressBar: 'bg-[#fcee0a]',
        };
    }
  };

  const themeConfig = getThemeStyles();

  const themes: { id: ClockTheme; label: string; color: string; category: ThemeCategory }[] = [
    // Neon & Cyber
    { id: 'night_city', label: 'Night City 2077', color: 'bg-[#fcee0a]', category: 'cyber' },
    { id: 'cyberpunk', label: 'Cyber Neon', color: 'bg-cyan-400', category: 'cyber' },
    { id: 'synthwave', label: 'Synthwave 80s', color: 'bg-fuchsia-500', category: 'cyber' },
    { id: 'matrix', label: 'Matrix Terminal', color: 'bg-emerald-400', category: 'cyber' },
    { id: 'toxic_lime', label: 'Acid Cyber Lime', color: 'bg-[#ccff00]', category: 'cyber' },
    { id: 'electric_violet', label: 'Electric Ultraviolet', color: 'bg-[#d946ef]', category: 'cyber' },
    { id: 'midnight_velocity', label: 'Midnight Velocity', color: 'bg-[#ff2b44]', category: 'cyber' },
    { id: 'solarized_dark', label: 'Solarized Horizon', color: 'bg-[#2aa198]', category: 'cyber' },
    { id: 'miami_sunset', label: 'Miami Vice Synth', color: 'bg-[#f72585]', category: 'cyber' },
    { id: 'monokai_pro', label: 'Monokai Pro', color: 'bg-[#ffd866]', category: 'cyber' },
    { id: 'crimson_eclipse', label: 'Crimson Eclipse', color: 'bg-[#ff1744]', category: 'cyber' },

    // Space & Aurora
    { id: 'tokyo_night', label: 'Tokyo Night', color: 'bg-[#7aa2f7]', category: 'space' },
    { id: 'tokyo_rain', label: 'Tokyo Rain', color: 'bg-purple-400', category: 'space' },
    { id: 'nord_aurora', label: 'Nordic Aurora', color: 'bg-[#88c0d0]', category: 'space' },
    { id: 'cosmic_nebula', label: 'Cosmic Nebula', color: 'bg-pink-500', category: 'space' },
    { id: 'frost_aurora', label: 'Glacial Frost', color: 'bg-sky-300', category: 'space' },
    { id: 'abyss_ocean', label: 'Deep Abyss', color: 'bg-cyan-500', category: 'space' },

    // Warm & Sunset
    { id: 'amber_crt', label: 'Vintage Amber CRT', color: 'bg-[#ffb000]', category: 'warm' },
    { id: 'luxury_gold', label: 'Royal Obsidian Gold', color: 'bg-amber-400', category: 'warm' },
    { id: 'solar_flare', label: 'Solar Flare', color: 'bg-orange-500', category: 'warm' },
    { id: 'warm_espresso', label: 'Warm Espresso', color: 'bg-amber-700', category: 'warm' },
    { id: 'sahara_dune', label: 'Sahara Dune', color: 'bg-orange-400', category: 'warm' },
    { id: 'kyoto_twilight', label: 'Kyoto Twilight', color: 'bg-rose-500', category: 'warm' },
    { id: 'emerald', label: 'Emerald Forest', color: 'bg-teal-400', category: 'warm' },
    { id: 'gruvbox_warm', label: 'Gruvbox Retro', color: 'bg-[#fabd2f]', category: 'warm' },
    { id: 'california_dusk', label: 'California Dusk', color: 'bg-[#f43f5e]', category: 'warm' },

    // Minimal & Studio
    { id: 'paper_studio', label: 'Studio Paper (Light)', color: 'bg-slate-100 border border-slate-400', category: 'minimal' },
    { id: 'alpine_glacier', label: 'Nordic Glacier (Light)', color: 'bg-sky-100 border border-sky-400', category: 'minimal' },
    { id: 'oled', label: 'OLED Pure Black', color: 'bg-neutral-950 border border-neutral-600', category: 'minimal' },
    { id: 'swiss_bauhaus', label: 'Swiss Bauhaus', color: 'bg-rose-500', category: 'minimal' },
    { id: 'slate', label: 'Deep Slate', color: 'bg-slate-600', category: 'minimal' },
    { id: 'dracula', label: 'Dracula Gothic', color: 'bg-[#ff79c6]', category: 'minimal' },
    { id: 'catppuccin', label: 'Catppuccin Mocha', color: 'bg-[#cba6f7]', category: 'minimal' },
    { id: 'rose_quartz', label: 'Rose Quartz', color: 'bg-pink-300', category: 'minimal' },
    { id: 'dreamy_lilac', label: 'Dreamy Lilac', color: 'bg-purple-300', category: 'minimal' },
    { id: 'matcha_minimal', label: 'Matcha Zen', color: 'bg-lime-400', category: 'minimal' },
  ];

  const filteredThemes = themeCategory === 'all'
    ? themes
    : themes.filter(t => t.category === themeCategory);

  // Word Clock Helper
  const getWordTime = () => {
    const h24 = displayTime.getHours();
    const m = displayTime.getMinutes();
    const hourNames = [
      'TWELVE', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE',
      'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE'
    ];
    const currentH = h24 % 12;
    const nextH = (currentH + 1) % 12;

    let phrase = "EXACTLY";
    let targetHour = hourNames[currentH];

    if (m >= 1 && m <= 4) {
      phrase = "JUST PAST";
    } else if (m >= 5 && m <= 9) {
      phrase = "FIVE PAST";
    } else if (m >= 10 && m <= 14) {
      phrase = "TEN PAST";
    } else if (m >= 15 && m <= 19) {
      phrase = "A QUARTER PAST";
    } else if (m >= 20 && m <= 24) {
      phrase = "TWENTY PAST";
    } else if (m >= 25 && m <= 29) {
      phrase = "TWENTY-FIVE PAST";
    } else if (m >= 30 && m <= 34) {
      phrase = "HALF PAST";
    } else if (m >= 35 && m <= 39) {
      phrase = "TWENTY-FIVE TO";
      targetHour = hourNames[nextH];
    } else if (m >= 40 && m <= 44) {
      phrase = "TWENTY TO";
      targetHour = hourNames[nextH];
    } else if (m >= 45 && m <= 49) {
      phrase = "A QUARTER TO";
      targetHour = hourNames[nextH];
    } else if (m >= 50 && m <= 54) {
      phrase = "TEN TO";
      targetHour = hourNames[nextH];
    } else if (m >= 55 && m <= 59) {
      phrase = "FIVE TO";
      targetHour = hourNames[nextH];
    }

    const period = h24 < 12
      ? 'IN THE MORNING'
      : h24 < 17
        ? 'IN THE AFTERNOON'
        : h24 < 21
          ? 'IN THE EVENING'
          : 'AT NIGHT';

    return { phrase, targetHour, period, isOclock: m === 0 };
  };

  const wordClockData = getWordTime();

  // Calendar / Desk Station Helpers
  const calYear = displayTime.getFullYear();
  const calMonth = displayTime.getMonth();
  const calDate = displayTime.getDate();
  const calDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calFirstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
  const prevMonthTotalDays = new Date(calYear, calMonth, 0).getDate();

  const monthName = displayTime.toLocaleDateString(undefined, { month: 'long' });

  // Year Progress calculation
  const startOfYear = new Date(calYear, 0, 1);
  const dayOfYear = Math.floor((displayTime.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const isLeap = (calYear % 4 === 0 && calYear % 100 !== 0) || calYear % 400 === 0;
  const totalYearDays = isLeap ? 366 : 365;
  const yearProgressPercent = ((dayOfYear / totalYearDays) * 100).toFixed(1);

  // Week number calculation
  const weekTarget = new Date(displayTime.valueOf());
  const dayOffset = (displayTime.getDay() + 6) % 7;
  weekTarget.setDate(weekTarget.getDate() - dayOffset + 3);
  const firstThu = weekTarget.valueOf();
  weekTarget.setMonth(0, 1);
  if (weekTarget.getDay() !== 4) {
    weekTarget.setMonth(0, 1 + ((4 - weekTarget.getDay()) + 7) % 7);
  }
  const weekNumber = 1 + Math.ceil((firstThu - weekTarget.valueOf()) / 604800000);

  // Calendar cells
  const calCells: { day: number; isCurrent: boolean; isToday: boolean }[] = [];
  for (let i = calFirstDayOfWeek - 1; i >= 0; i--) {
    calCells.push({ day: prevMonthTotalDays - i, isCurrent: false, isToday: false });
  }
  for (let d = 1; d <= calDaysInMonth; d++) {
    calCells.push({ day: d, isCurrent: true, isToday: d === calDate });
  }
  while (calCells.length % 7 !== 0 || calCells.length < 35) {
    calCells.push({
      day: calCells.length - (calFirstDayOfWeek + calDaysInMonth) + 1,
      isCurrent: false,
      isToday: false,
    });
  }

  // Radial Chronometer Gauge Progress Calculations
  const maxHours = is24Hour ? 24 : 12;
  const hrProgress = ((displayTime.getHours() % maxHours) + minValue / 60) / maxHours;
  const minProgress = (minValue + secValue / 60) / 60;
  const secProgress = (secValue + 1) / 60;

  // Arc circumferences for radii: r1=130 (Hours), r2=104 (Minutes), r3=78 (Seconds)
  const r1Circumference = 2 * Math.PI * 130;
  const r2Circumference = 2 * Math.PI * 104;
  const r3Circumference = 2 * Math.PI * 78;

  const r1Offset = r1Circumference * (1 - Math.min(1, Math.max(0, hrProgress)));
  const r2Offset = r2Circumference * (1 - Math.min(1, Math.max(0, minProgress)));
  const r3Offset = r3Circumference * (1 - Math.min(1, Math.max(0, secProgress)));

  const r1TipAngle = ((hrProgress * 360 - 90) * Math.PI) / 180;
  const r1TipX = 160 + 130 * Math.cos(r1TipAngle);
  const r1TipY = 160 + 130 * Math.sin(r1TipAngle);

  const r2TipAngle = ((minProgress * 360 - 90) * Math.PI) / 180;
  const r2TipX = 160 + 104 * Math.cos(r2TipAngle);
  const r2TipY = 160 + 104 * Math.sin(r2TipAngle);

  const r3TipAngle = ((secProgress * 360 - 90) * Math.PI) / 180;
  const r3TipX = 160 + 78 * Math.cos(r3TipAngle);
  const r3TipY = 160 + 78 * Math.sin(r3TipAngle);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Mode Selector */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold overflow-x-auto no-scrollbar gap-0.5">
          <button
            onClick={() => setMode('digital')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              mode === 'digital' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Digital
          </button>
          <button
            onClick={() => setMode('stacked')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              mode === 'stacked' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
            title="Vertical StandBy Stacked layout inspired by smart displays"
          >
            StandBy Stacked
          </button>
          <button
            onClick={() => setMode('radial')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              mode === 'radial' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
            title="Chronograph Radial Gauge with concentric circular tracks"
          >
            Radial Gauge
          </button>
          <button
            onClick={() => setMode('words')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              mode === 'words' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
            title="Typographic Word Clock (QLOCKTWO style natural English readout)"
          >
            Word Clock
          </button>
          <button
            onClick={() => setMode('calendar')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              mode === 'calendar' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
            title="Executive Desk Station with calendar month grid & year progress"
          >
            Desk Station
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
              onClick={() => setFontStyle('condensed')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                fontStyle === 'condensed' ? 'bg-white dark:bg-slate-700 shadow-xs text-brand-600 dark:text-brand-300' : 'text-slate-500'
              }`}
              title="Architectural Bold Font"
            >
              Bold
            </button>
            <button
              onClick={() => setFontStyle('minimal')}
              className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                fontStyle === 'minimal' ? 'bg-white dark:bg-slate-700 shadow-xs text-brand-600 dark:text-brand-300' : 'text-slate-500'
              }`}
              title="Clean Minimalist Light Font"
            >
              Thin
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
      {['digital', 'stacked', 'radial', 'words', 'calendar', 'flip', 'analog'].includes(mode) ? (
        <div className="flex flex-wrap items-center justify-between gap-3 px-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
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

            <button
              onClick={() => setShowProgressBar(!showProgressBar)}
              className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                showProgressBar
                  ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-600 dark:text-brand-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
              title="Toggle animated 60-second progress line"
            >
              60s Bar
            </button>

            <button
              onClick={() => setAmbientGlow(!ambientGlow)}
              className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                ambientGlow
                  ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-600 dark:text-brand-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
              title="Toggle ambient breathing aura glow"
            >
              Aura Glow
            </button>
          </div>

          {/* Editable Work Tag Badge */}
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
              setPomoTargetDuration(25 * 60);
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
              setPomoTargetDuration(50 * 60);
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
              setPomoTargetDuration(5 * 60);
              setPomoTimeLeft(5 * 60);
              setPomoIsRunning(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              pomoMode === 'break' && pomoTargetDuration === 5 * 60
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            5m Short Break
          </button>
          <button
            onClick={() => {
              setPomoMode('break');
              setPomoTargetDuration(15 * 60);
              setPomoTimeLeft(15 * 60);
              setPomoIsRunning(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              pomoMode === 'break' && pomoTargetDuration === 15 * 60
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            15m Long Break
          </button>
        </div>
      ) : null}

      {/* Aesthetic Theme Swatches (36 Aesthetics with Category Filter) */}
      <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" />
              Style Themes ({themes.length} Aesthetics)
            </span>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold overflow-x-auto no-scrollbar">
            {[
              { id: 'all' as ThemeCategory, label: 'All' },
              { id: 'cyber' as ThemeCategory, label: 'Neon & Cyber' },
              { id: 'space' as ThemeCategory, label: 'Aurora & Space' },
              { id: 'warm' as ThemeCategory, label: 'Warm & Sunset' },
              { id: 'minimal' as ThemeCategory, label: 'Minimal & Studio' },
            ].map(cat => {
              const count = cat.id === 'all' ? themes.length : themes.filter(t => t.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setThemeCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap text-xs ${
                    themeCategory === cat.id
                      ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            Active: {themes.find(t => t.id === theme)?.label}
          </span>
        </div>

        {/* Swatches Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {filteredThemes.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer truncate ${
                theme === t.id
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-[1.02] ring-2 ring-brand-400/40'
                  : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
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
        {/* Glow backdrop layer with ambient breathing option */}
        <div
          className={`absolute inset-0 ${themeConfig.glow} ${ambientGlow ? 'animate-pulse-slow' : ''} pointer-events-none transition-all duration-700`}
        />

        {/* Live 60-Second Animated Progress Bar */}
        {showProgressBar && (
          <div className="absolute top-0 inset-x-0 h-1.5 bg-black/15 dark:bg-white/5 overflow-hidden z-20">
            <div
              className={`h-full transition-all duration-300 ${themeConfig.progressBar}`}
              style={{ width: `${((displayTime.getSeconds() + 1) / 60) * 100}%` }}
            />
          </div>
        )}

        {/* Top Floating Info in Fullscreen & Normal */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-auto z-20">
          <span className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${themeConfig.badgeBg}`}>
            {customTag}
          </span>

          {isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className={`p-2.5 rounded-2xl ${
                themeConfig.isLight
                  ? 'bg-black/10 hover:bg-black/20 text-slate-800'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              } backdrop-blur-md transition-colors cursor-pointer`}
              title="Exit Fullscreen"
            >
              <Minimize size={18} />
            </button>
          )}
        </div>

        {/* Mode 1: Digital Display Mode (Horizontal) */}
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
              <p className={`text-base sm:text-xl font-medium tracking-wide ${themeConfig.subText || 'text-slate-400'}`}>
                {dateStr}
              </p>
            )}
          </div>
        )}

        {/* Mode 2: Modern StandBy Stacked Mode (Vertical Large Digits) */}
        {mode === 'stacked' && (
          <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-2 py-4">
            <div className="flex flex-col items-center leading-[0.85] select-none">
              <span
                className={`text-7xl sm:text-9xl md:text-[10rem] lg:text-[11rem] tracking-tight font-black ${getFontFamilyClass()} ${themeConfig.clockText}`}
              >
                {hoursStr}
              </span>
              <span
                className={`text-7xl sm:text-9xl md:text-[10rem] lg:text-[11rem] tracking-tight font-black ${getFontFamilyClass()} ${themeConfig.clockText}`}
              >
                {minutesStr}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              {!is24Hour && (
                <span className={`px-2.5 py-0.5 rounded-lg text-xs sm:text-sm font-black uppercase tracking-wider border ${themeConfig.badgeBg}`}>
                  {ampm}
                </span>
              )}

              {showSeconds && (
                <span className={`text-base sm:text-xl font-mono font-bold tracking-wider ${themeConfig.accent}`}>
                  :{secondsStr}
                </span>
              )}

              {showDate && (
                <span className={`text-sm sm:text-base font-medium tracking-wide ${themeConfig.subText || 'text-slate-400'}`}>
                  • {dateStr}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Mode: Chronograph Radial Gauge */}
        {mode === 'radial' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 my-auto">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
              <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-2xl select-none">
                {/* Background Track Rings */}
                <circle
                  cx="160"
                  cy="160"
                  r="130"
                  fill="none"
                  stroke={themeConfig.isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}
                  strokeWidth="8"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="104"
                  fill="none"
                  stroke={themeConfig.isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}
                  strokeWidth="7"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="78"
                  fill="none"
                  stroke={themeConfig.isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}
                  strokeWidth="6"
                />

                {/* Progress Arcs */}
                {/* Hours Ring */}
                <circle
                  cx="160"
                  cy="160"
                  r="130"
                  fill="none"
                  stroke={themeConfig.handHr}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={r1Circumference}
                  strokeDashoffset={r1Offset}
                  transform="rotate(-90 160 160)"
                  className="transition-all duration-300"
                  style={{ filter: `drop-shadow(0 0 6px ${themeConfig.handHr})` }}
                />
                <circle cx={r1TipX} cy={r1TipY} r="4.5" fill="#ffffff" stroke={themeConfig.handHr} strokeWidth="2" />

                {/* Minutes Ring */}
                <circle
                  cx="160"
                  cy="160"
                  r="104"
                  fill="none"
                  stroke={themeConfig.handMin}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={r2Circumference}
                  strokeDashoffset={r2Offset}
                  transform="rotate(-90 160 160)"
                  className="transition-all duration-300"
                  style={{ filter: `drop-shadow(0 0 6px ${themeConfig.handMin})` }}
                />
                <circle cx={r2TipX} cy={r2TipY} r="4" fill="#ffffff" stroke={themeConfig.handMin} strokeWidth="2" />

                {/* Seconds Ring */}
                {showSeconds && (
                  <>
                    <circle
                      cx="160"
                      cy="160"
                      r="78"
                      fill="none"
                      stroke={themeConfig.handSec}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={r3Circumference}
                      strokeDashoffset={r3Offset}
                      transform="rotate(-90 160 160)"
                      className="transition-all duration-300"
                      style={{ filter: `drop-shadow(0 0 6px ${themeConfig.handSec})` }}
                    />
                    <circle cx={r3TipX} cy={r3TipY} r="3.5" fill="#ffffff" stroke={themeConfig.handSec} strokeWidth="1.5" />
                  </>
                )}
              </svg>

              {/* Center Digital Display Inside Radial Rings */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <div className={`text-2xl sm:text-3xl md:text-4xl font-black ${getFontFamilyClass()} ${themeConfig.clockText}`}>
                  {hoursStr}:{minutesStr}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {showSeconds && (
                    <span className={`text-xs sm:text-sm font-mono font-bold ${themeConfig.accent}`}>
                      :{secondsStr}
                    </span>
                  )}
                  {!is24Hour && (
                    <span className={`text-[10px] sm:text-xs font-bold uppercase ${themeConfig.accent}`}>
                      {ampm}
                    </span>
                  )}
                </div>
                <div className={`text-[10px] font-mono tracking-wider mt-1 opacity-70 ${themeConfig.subText || 'text-slate-400'}`}>
                  {Math.round(secProgress * 100)}%
                </div>
              </div>
            </div>

            {/* Radial Legend Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: themeConfig.handHr }} />
                <span className={themeConfig.subText || 'text-slate-400'}>Hour ({Math.round(hrProgress * 100)}%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: themeConfig.handMin }} />
                <span className={themeConfig.subText || 'text-slate-400'}>Min ({Math.round(minProgress * 100)}%)</span>
              </span>
              {showSeconds && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: themeConfig.handSec }} />
                  <span className={themeConfig.subText || 'text-slate-400'}>Sec ({Math.round(secProgress * 100)}%)</span>
                </span>
              )}
            </div>

            {showDate && (
              <p className={`text-xs sm:text-sm font-medium tracking-wide ${themeConfig.subText || 'text-slate-400'}`}>
                {dateStr}
              </p>
            )}
          </div>
        )}

        {/* Mode: Typographic Word Clock */}
        {mode === 'words' && (
          <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-4 max-w-2xl px-4 py-6 select-none">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${themeConfig.badgeBg}`}>
              It Is
            </span>

            {/* Conversational Phrase */}
            <h3 className={`text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight ${themeConfig.accent}`}>
              {wordClockData.phrase}
            </h3>

            {/* Hero Target Hour */}
            <h1
              className={`text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none ${getFontFamilyClass()} ${themeConfig.clockText}`}
            >
              {wordClockData.targetHour}
              {wordClockData.isOclock && <span className="opacity-80 text-4xl sm:text-6xl ml-3">O&apos;CLOCK</span>}
            </h1>

            {/* Natural Period */}
            <p className={`text-base sm:text-2xl font-bold uppercase tracking-widest ${themeConfig.subText || 'text-slate-400'}`}>
              {wordClockData.period}
            </p>

            {/* Bottom Digital Verification Pill */}
            <div className="flex items-center gap-2 pt-2">
              <span className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-mono font-bold border ${themeConfig.border} ${themeConfig.isLight ? 'bg-slate-200/80 text-slate-800' : 'bg-white/10 text-slate-200'}`}>
                {hoursStr}:{minutesStr}{showSeconds ? `:${secondsStr}` : ''} {!is24Hour && ampm}
              </span>
              {showDate && (
                <span className={`text-xs sm:text-sm ${themeConfig.subText || 'text-slate-400'}`}>
                  • {dateStr}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Mode: Executive Desk Station Calendar Dashboard */}
        {mode === 'calendar' && (
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center my-auto w-full max-w-4xl px-2 py-4 select-none">
            {/* Left / Main Section: Big Time & Day Focus */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none ${getFontFamilyClass()} ${themeConfig.clockText}`}>
                  {hoursStr}:{minutesStr}
                </span>
                {showSeconds && (
                  <span className={`text-2xl sm:text-4xl font-mono font-bold opacity-80 ${themeConfig.accent}`}>
                    :{secondsStr}
                  </span>
                )}
                {!is24Hour && (
                  <span className={`text-base sm:text-xl font-black uppercase ml-1 ${themeConfig.accent}`}>
                    {ampm}
                  </span>
                )}
              </div>

              {/* Date & Week */}
              <div className="space-y-1">
                <p className={`text-base sm:text-lg font-bold ${themeConfig.subText || 'text-slate-300'}`}>
                  {dateStr}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 justify-center lg:justify-start">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${themeConfig.border} ${themeConfig.isLight ? 'bg-slate-200/60 text-slate-800' : 'bg-white/10 text-slate-300'}`}>
                    Week {weekNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${themeConfig.border} ${themeConfig.isLight ? 'bg-slate-200/60 text-slate-800' : 'bg-white/10 text-slate-300'}`}>
                    Day {dayOfYear} of {totalYearDays}
                  </span>
                </div>
              </div>

              {/* Year Progress Bar */}
              <div className="w-full max-w-sm pt-2 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className={themeConfig.subText || 'text-slate-400'}>{calYear} Year Progress</span>
                  <span className={`font-mono font-bold ${themeConfig.accent}`}>{yearProgressPercent}%</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${themeConfig.isLight ? 'bg-slate-300/80' : 'bg-white/10'}`}>
                  <div
                    className={`h-full transition-all duration-500 ${themeConfig.progressBar}`}
                    style={{ width: `${yearProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right Section: Mini Calendar Matrix */}
            <div className={`lg:col-span-5 p-5 rounded-3xl border backdrop-blur-xl ${
              themeConfig.isLight
                ? 'bg-white/90 border-slate-300 shadow-lg text-slate-800'
                : 'bg-black/40 border-white/10 shadow-2xl text-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarIcon size={13} className={themeConfig.accent} />
                  {monthName} {calYear}
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${themeConfig.badgeBg}`}>
                  Today: {calDate}
                </span>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold opacity-60 mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                  <span key={idx}>{day}</span>
                ))}
              </div>

              {/* Calendar Date Cells */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
                {calCells.map((cell, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square flex items-center justify-center rounded-xl text-xs transition-colors ${
                      cell.isToday
                        ? `${themeConfig.badgeBg} font-black shadow-sm ring-1 ring-white/20`
                        : cell.isCurrent
                          ? themeConfig.isLight ? 'hover:bg-slate-200 text-slate-800' : 'hover:bg-white/10 text-slate-200'
                          : 'opacity-25'
                    }`}
                  >
                    {cell.day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mode 3: Flip Card Clock Mode */}
        {mode === 'flip' && (
          <div className="relative z-10 space-y-6 my-auto">
            <div className="flex items-center justify-center gap-3 sm:gap-6">
              {/* Hours Card */}
              <div className="flex flex-col items-center">
                <div
                  className={`relative w-24 sm:w-36 md:w-44 h-32 sm:h-44 md:h-52 rounded-3xl border flex items-center justify-center ${themeConfig.flipCard} shadow-2xl overflow-hidden`}
                >
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4 rounded-r-md bg-black/60 shadow-inner z-30" />
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-4 rounded-l-md bg-black/60 shadow-inner z-30" />
                  <div className="absolute inset-x-0 top-1/2 h-[2px] bg-black/50 shadow-sm z-20" />
                  <span className={`text-5xl sm:text-7xl md:text-8xl font-black ${getFontFamilyClass()} relative z-15`}>
                    {hoursStr}
                  </span>
                </div>
                <span className={`text-xs uppercase font-extrabold ${themeConfig.subText || 'text-slate-500'} mt-2`}>
                  Hours
                </span>
              </div>

              <div className={`text-4xl sm:text-6xl font-black animate-pulse ${themeConfig.accent}`}>:</div>

              {/* Minutes Card */}
              <div className="flex flex-col items-center">
                <div
                  className={`relative w-24 sm:w-36 md:w-44 h-32 sm:h-44 md:h-52 rounded-3xl border flex items-center justify-center ${themeConfig.flipCard} shadow-2xl overflow-hidden`}
                >
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4 rounded-r-md bg-black/60 shadow-inner z-30" />
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-4 rounded-l-md bg-black/60 shadow-inner z-30" />
                  <div className="absolute inset-x-0 top-1/2 h-[2px] bg-black/50 shadow-sm z-20" />
                  <span className={`text-5xl sm:text-7xl md:text-8xl font-black ${getFontFamilyClass()} relative z-15`}>
                    {minutesStr}
                  </span>
                </div>
                <span className={`text-xs uppercase font-extrabold ${themeConfig.subText || 'text-slate-500'} mt-2`}>
                  Minutes
                </span>
              </div>

              {showSeconds && (
                <>
                  <div className={`text-4xl sm:text-6xl font-black animate-pulse ${themeConfig.accent}`}>:</div>
                  {/* Seconds Card */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`relative w-20 sm:w-28 md:w-36 h-28 sm:h-36 md:h-44 rounded-3xl border flex items-center justify-center ${themeConfig.flipCard} shadow-2xl overflow-hidden opacity-90`}
                    >
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10" />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4 rounded-r-md bg-black/60 shadow-inner z-30" />
                      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-4 rounded-l-md bg-black/60 shadow-inner z-30" />
                      <div className="absolute inset-x-0 top-1/2 h-[2px] bg-black/50 shadow-sm z-20" />
                      <span className={`text-4xl sm:text-6xl md:text-7xl font-black ${getFontFamilyClass()} relative z-15`}>
                        {secondsStr}
                      </span>
                    </div>
                    <span className={`text-xs uppercase font-extrabold ${themeConfig.subText || 'text-slate-500'} mt-2`}>
                      Seconds
                    </span>
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
              <p className={`text-sm sm:text-lg font-medium tracking-wide ${themeConfig.subText || 'text-slate-400'}`}>
                {dateStr}
              </p>
            )}
          </div>
        )}

        {/* Mode 4: Razor-Sharp SVG Analog Chronometer */}
        {mode === 'analog' && (
          <div className="relative z-10 flex flex-col items-center space-y-5 my-auto">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
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
                  stroke={themeConfig.isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}
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
                      stroke={
                        isMajorTick
                          ? (themeConfig.dialTickMajor || '#ffffff')
                          : isHourTick
                            ? (themeConfig.dialTickMinor || 'rgba(255,255,255,0.7)')
                            : (themeConfig.dialTickMinor ? themeConfig.dialTickMinor : 'rgba(255,255,255,0.2)')
                      }
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
                      fill={themeConfig.dialNumColor || (themeConfig.isLight ? '#0f172a' : 'rgba(255,255,255,0.85)')}
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
                <circle cx="150" cy="150" r="7" fill={themeConfig.handSec} stroke={themeConfig.isLight ? '#fff' : '#000'} strokeWidth="2" />
                <circle cx="150" cy="150" r="2.5" fill={themeConfig.isLight ? '#0f172a' : '#ffffff'} />
              </svg>
            </div>

            {/* Sub Digital Readout */}
            <div className={`flex items-center gap-2 text-xl font-bold ${getFontFamilyClass()} ${themeConfig.isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              <span>{hoursStr}:{minutesStr}{showSeconds ? `:${secondsStr}` : ''}</span>
              {!is24Hour && <span className={`text-xs uppercase ${themeConfig.accent}`}>{ampm}</span>}
            </div>

            {showDate && <p className={`text-xs ${themeConfig.subText || 'text-slate-400'}`}>{dateStr}</p>}
          </div>
        )}

        {/* Mode 5: Pomodoro Focus Timer Mode */}
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
                className={`px-7 py-3.5 rounded-2xl ${
                  themeConfig.isLight
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                } font-extrabold text-sm flex items-center gap-2 backdrop-blur-xl active:scale-95 transition-all cursor-pointer shadow-lg`}
              >
                {pomoIsRunning ? <Pause size={18} /> : <Play size={18} />}
                <span>{pomoIsRunning ? 'Pause Session' : 'Start Focus'}</span>
              </button>

              <button
                onClick={() => {
                  setPomoIsRunning(false);
                  setPomoTimeLeft(pomoTargetDuration);
                }}
                className={`p-3.5 rounded-2xl ${
                  themeConfig.isLight
                    ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                } transition-colors cursor-pointer`}
                title="Reset timer"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Mode 6: Stopwatch & Lap Counter Mode */}
        {mode === 'stopwatch' && (
          <div className="relative z-10 space-y-6 my-auto w-full max-w-md">
            <div className={`text-6xl sm:text-8xl tracking-tight leading-none ${getFontFamilyClass()} ${themeConfig.clockText}`}>
              {swMinutes}:{swSeconds}
              <span className="text-3xl sm:text-5xl opacity-80">.{swMs}</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setSwIsRunning(!swIsRunning)}
                className={`px-6 py-3 rounded-2xl ${
                  themeConfig.isLight
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                } font-extrabold text-sm flex items-center gap-2 backdrop-blur-xl active:scale-95 transition-all cursor-pointer shadow-lg`}
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
                className={`px-5 py-3 rounded-2xl ${
                  themeConfig.isLight
                    ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                } text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5`}
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
              <div
                className={`max-h-36 overflow-y-auto space-y-1 p-2 rounded-2xl ${
                  themeConfig.isLight
                    ? 'bg-slate-100 border border-slate-300 text-slate-800'
                    : 'bg-black/30 border border-white/10 text-slate-300'
                } text-xs`}
              >
                {swLaps.map(lap => (
                  <div key={lap.id} className="flex items-center justify-between px-3 py-1.5">
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
        <p className={`absolute bottom-3 text-[11px] ${themeConfig.subText || 'text-slate-500'} opacity-60 font-mono select-none pointer-events-none`}>
          Press Fullscreen for second-monitor desk display • Audio chimes supported
        </p>
      </div>
    </div>
  );
};
