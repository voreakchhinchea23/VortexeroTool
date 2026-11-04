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
  ChevronDown,
  ChevronUp,
  Sun,
  Activity,
  Heart,
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
  | 'california_dusk'
  | 'heartbeat_pulse'
  | 'sunrise_dawn'
  | 'sunset_twilight'
  | 'aurora_borealis'
  | 'breathing_glow'
  | 'neon_cyber_pulse'
  | 'ocean_waves'
  | 'fire_ember'
  | 'supernova';

export type Mode = 'digital' | 'stacked' | 'radial' | 'words' | 'calendar' | 'flip' | 'analog' | 'pomodoro' | 'stopwatch';
export type FontStyle = 'mono' | 'sans' | 'serif' | 'digital' | 'condensed' | 'minimal';
export type ThemeCategory = 'all' | 'animated' | 'cyber' | 'space' | 'warm' | 'minimal';
export type AnimationFx =
  | 'auto'
  | 'heartbeat'
  | 'sunrise'
  | 'sunset'
  | 'aurora'
  | 'breathe'
  | 'ocean'
  | 'fire'
  | 'supernova'
  | 'none';

export interface LapItem {
  id: number;
  time: number;
  lapDuration: number;
}

export interface ThemeStyles {
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
  defaultAnimation?: AnimationFx;
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

export const CLOCK_ANIMATION_FX_OPTIONS: { id: AnimationFx; label: string }[] = [
  { id: 'auto', label: 'Animation: Auto (Theme)' },
  { id: 'heartbeat', label: 'Animation: Heartbeat Pulse' },
  { id: 'sunrise', label: 'Animation: Sunrise Dawn' },
  { id: 'sunset', label: 'Animation: Sunset Twilight' },
  { id: 'aurora', label: 'Animation: Aurora Waves' },
  { id: 'breathe', label: 'Animation: Calm Breathing' },
  { id: 'ocean', label: 'Animation: Ocean Waves' },
  { id: 'fire', label: 'Animation: Campfire Ember' },
  { id: 'supernova', label: 'Animation: Cosmic Supernova' },
  { id: 'none', label: 'Animation: Off (Static)' },
];

export const CLOCK_THEMES: { id: ClockTheme; label: string; color: string; category: ThemeCategory }[] = [
  // Dynamic & Animated
  { id: 'heartbeat_pulse', label: 'Heartbeat Pulse', color: 'bg-[#ff1a53]', category: 'animated' },
  { id: 'sunrise_dawn', label: 'Sunrise Dawn', color: 'bg-amber-400', category: 'animated' },
  { id: 'sunset_twilight', label: 'Sunset Twilight', color: 'bg-orange-500', category: 'animated' },
  { id: 'aurora_borealis', label: 'Aurora Borealis', color: 'bg-emerald-400', category: 'animated' },
  { id: 'breathing_glow', label: 'Calm Breathing', color: 'bg-sky-400', category: 'animated' },
  { id: 'neon_cyber_pulse', label: 'Neon Cyber Pulse', color: 'bg-[#00f0ff]', category: 'animated' },
  { id: 'ocean_waves', label: 'Ocean Waves', color: 'bg-cyan-400', category: 'animated' },
  { id: 'fire_ember', label: 'Campfire Ember', color: 'bg-orange-500', category: 'animated' },
  { id: 'supernova', label: 'Cosmic Supernova', color: 'bg-fuchsia-500', category: 'animated' },

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

export const getClockThemeStyles = (theme: ClockTheme): ThemeStyles => {
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
        glow: 'bg-transparent',
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
    case 'heartbeat_pulse':
      return {
        bg: 'bg-[#080104]',
        clockText: 'text-[#ff1a53] drop-shadow-[0_0_35px_rgba(255,26,83,0.85)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(255,26,83,0.22),transparent_70%)]',
        accent: 'text-[#ff4d79]',
        border: 'border-[#ff1a53]/40',
        badgeBg: 'bg-[#ff1a53]/20 text-[#ff1a53] border-[#ff1a53]/50',
        handSec: '#ff1a53',
        handMin: '#ff4d79',
        handHr: '#b30030',
        dialBg: '#120208',
        dialBorder: '#ff1a53',
        flipCard: 'bg-[#19030c] text-[#ff1a53] border-[#ff1a53]/40 shadow-[#ff1a53]/30',
        progressBar: 'bg-gradient-to-r from-[#b30030] via-[#ff1a53] to-[#ff4d79]',
        defaultAnimation: 'heartbeat',
      };
    case 'sunrise_dawn':
      return {
        bg: 'bg-gradient-to-t from-[#1a0a20] via-[#2f1124] to-[#0d091a]',
        clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-rose-300 drop-shadow-[0_0_35px_rgba(251,191,36,0.85)]',
        glow: 'bg-gradient-to-t from-amber-500/25 via-rose-500/20 to-indigo-900/10',
        accent: 'text-amber-300',
        border: 'border-amber-500/35',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        handSec: '#f59e0b',
        handMin: '#fbbf24',
        handHr: '#f43f5e',
        dialBg: '#1c0f24',
        dialBorder: '#fbbf24',
        flipCard: 'bg-[#25132d] text-amber-300 border-amber-500/30 shadow-amber-500/20',
        progressBar: 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500',
        defaultAnimation: 'sunrise',
      };
    case 'sunset_twilight':
      return {
        bg: 'bg-gradient-to-b from-[#0c071e] via-[#260c2b] to-[#120618]',
        clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 drop-shadow-[0_0_35px_rgba(249,115,22,0.8)]',
        glow: 'bg-gradient-to-b from-purple-500/20 via-orange-500/20 to-fuchsia-900/25',
        accent: 'text-orange-400',
        border: 'border-orange-500/35',
        badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        handSec: '#fb923c',
        handMin: '#f472b6',
        handHr: '#a855f7',
        dialBg: '#1b0c26',
        dialBorder: '#fb923c',
        flipCard: 'bg-[#220f30] text-orange-300 border-orange-500/30 shadow-orange-500/20',
        progressBar: 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500',
        defaultAnimation: 'sunset',
      };
    case 'aurora_borealis':
      return {
        bg: 'bg-[#030a12]',
        clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 drop-shadow-[0_0_35px_rgba(52,211,153,0.85)]',
        glow: 'bg-gradient-to-tr from-emerald-500/25 via-teal-400/20 to-indigo-600/25',
        accent: 'text-emerald-300',
        border: 'border-emerald-400/35',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
        handSec: '#34d399',
        handMin: '#2dd4bf',
        handHr: '#38bdf8',
        dialBg: '#071622',
        dialBorder: '#34d399',
        flipCard: 'bg-[#0a1e2e] text-emerald-300 border-emerald-400/30 shadow-emerald-500/20',
        progressBar: 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400',
        defaultAnimation: 'aurora',
      };
    case 'breathing_glow':
      return {
        bg: 'bg-[#040a14]',
        clockText: 'text-sky-300 drop-shadow-[0_0_35px_rgba(56,189,248,0.85)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.25),transparent_70%)]',
        accent: 'text-cyan-300',
        border: 'border-sky-500/35',
        badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
        handSec: '#38bdf8',
        handMin: '#7dd3fc',
        handHr: '#0284c7',
        dialBg: '#081726',
        dialBorder: '#38bdf8',
        flipCard: 'bg-[#0b1f33] text-sky-300 border-sky-400/30 shadow-sky-500/20',
        progressBar: 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500',
        defaultAnimation: 'breathe',
      };
    case 'neon_cyber_pulse':
      return {
        bg: 'bg-[#06030c]',
        clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#ff00a0] to-[#ffe600] drop-shadow-[0_0_35px_rgba(0,240,255,0.9)]',
        glow: 'bg-gradient-to-tr from-[#00f0ff]/20 via-[#ff00a0]/20 to-[#ffe600]/15',
        accent: 'text-[#00f0ff]',
        border: 'border-[#00f0ff]/40',
        badgeBg: 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/50',
        handSec: '#00f0ff',
        handMin: '#ff00a0',
        handHr: '#ffe600',
        dialBg: '#12091f',
        dialBorder: '#00f0ff',
        flipCard: 'bg-[#170c29] text-[#00f0ff] border-[#00f0ff]/40 shadow-[#00f0ff]/25',
        progressBar: 'bg-gradient-to-r from-[#00f0ff] via-[#ff00a0] to-[#ffe600]',
        defaultAnimation: 'aurora',
      };
    case 'ocean_waves':
      return {
        bg: 'bg-[#020d1a]',
        clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-300 to-blue-400 drop-shadow-[0_0_35px_rgba(45,212,191,0.85)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.25),transparent_70%)]',
        accent: 'text-teal-300',
        border: 'border-cyan-500/35',
        badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
        handSec: '#06b6d4',
        handMin: '#2dd4bf',
        handHr: '#3b82f6',
        dialBg: '#051b33',
        dialBorder: '#06b6d4',
        flipCard: 'bg-[#07213d] text-cyan-300 border-cyan-500/30 shadow-cyan-500/20',
        progressBar: 'bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500',
        defaultAnimation: 'ocean',
      };
    case 'fire_ember':
      return {
        bg: 'bg-[#120502]',
        clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 drop-shadow-[0_0_35px_rgba(249,115,22,0.85)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.22),transparent_70%)]',
        accent: 'text-amber-400',
        border: 'border-orange-500/40',
        badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
        handSec: '#ef4444',
        handMin: '#f97316',
        handHr: '#f59e0b',
        dialBg: '#1f0904',
        dialBorder: '#f97316',
        flipCard: 'bg-[#260c06] text-amber-300 border-orange-500/35 shadow-orange-500/25',
        progressBar: 'bg-gradient-to-r from-red-500 via-orange-500 to-amber-400',
        defaultAnimation: 'fire',
      };
    case 'supernova':
      return {
        bg: 'bg-[#090214]',
        clockText: 'text-transparent bg-clip-text bg-gradient-to-r from-[#e879f9] via-[#c084fc] to-[#38bdf8] drop-shadow-[0_0_35px_rgba(192,132,252,0.85)]',
        glow: 'bg-gradient-to-tr from-fuchsia-600/25 via-purple-600/20 to-sky-500/20',
        accent: 'text-[#e879f9]',
        border: 'border-purple-500/40',
        badgeBg: 'bg-purple-500/20 text-[#e879f9] border-purple-400/50',
        handSec: '#38bdf8',
        handMin: '#e879f9',
        handHr: '#c084fc',
        dialBg: '#16082b',
        dialBorder: '#c084fc',
        flipCard: 'bg-[#1e0a3b] text-fuchsia-300 border-purple-500/35 shadow-purple-950/40',
        progressBar: 'bg-gradient-to-r from-fuchsia-500 via-purple-400 to-sky-400',
        defaultAnimation: 'supernova',
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
  const [isThemesCollapsed, setIsThemesCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('vortexero_clock_themes_collapsed');
    return saved !== null ? saved === 'true' : true;
  });
  const [keepScreenOn, setKeepScreenOn] = useState<boolean>(() => {
    return localStorage.getItem('vortexero_clock_keep_screen_on') === 'true';
  });
  const [animationFx, setAnimationFx] = useState<AnimationFx>(() => {
    return (localStorage.getItem('vortexero_clock_anim_fx') as AnimationFx) || 'auto';
  });
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);
  const wakeLockSentinelRef = useRef<any>(null);
  const fallbackVideoRef = useRef<HTMLVideoElement | null>(null);
  const isWakeLockSupported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;

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

  useEffect(() => {
    localStorage.setItem('vortexero_clock_themes_collapsed', String(isThemesCollapsed));
  }, [isThemesCollapsed]);

  useEffect(() => {
    localStorage.setItem('vortexero_clock_anim_fx', animationFx);
  }, [animationFx]);

  // Screen Wake Lock API implementation with graceful fallback
  const requestWakeLock = async () => {
    if (isWakeLockSupported) {
      try {
        const sentinel = await (navigator as any).wakeLock.request('screen');
        wakeLockSentinelRef.current = sentinel;
        setWakeLockActive(true);
        sentinel.addEventListener('release', () => {
          setWakeLockActive(false);
          wakeLockSentinelRef.current = null;
        });
        return;
      } catch {
        setWakeLockActive(false);
      }
    }

    // Graceful fallback: silent 0.1s video loop
    try {
      if (!fallbackVideoRef.current && typeof document !== 'undefined') {
        const vid = document.createElement('video');
        vid.setAttribute('playsinline', '');
        vid.setAttribute('muted', '');
        vid.setAttribute('loop', '');
        vid.muted = true;
        vid.playsInline = true;
        vid.loop = true;
        vid.style.position = 'fixed';
        vid.style.top = '-9999px';
        vid.style.opacity = '0';
        vid.style.pointerEvents = 'none';
        vid.style.width = '1px';
        vid.style.height = '1px';
        vid.src = 'data:video/mp4;base64,AAAAHGZ0eXBpc29tAAAAAGlzb21tcDQyAAAACHZyZWVhAAACgm1kYXQAAAAAAA==';
        document.body.appendChild(vid);
        fallbackVideoRef.current = vid;
      }
      if (fallbackVideoRef.current) {
        await fallbackVideoRef.current.play();
        setWakeLockActive(true);
      }
    } catch {
      setWakeLockActive(false);
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockSentinelRef.current) {
      try {
        await wakeLockSentinelRef.current.release();
      } catch {
        // ignore
      }
      wakeLockSentinelRef.current = null;
    }
    if (fallbackVideoRef.current) {
      try {
        fallbackVideoRef.current.pause();
        fallbackVideoRef.current.remove();
      } catch {
        // ignore
      }
      fallbackVideoRef.current = null;
    }
    setWakeLockActive(false);
  };

  useEffect(() => {
    localStorage.setItem('vortexero_clock_keep_screen_on', String(keepScreenOn));
    if (keepScreenOn) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => {
      releaseWakeLock();
    };
  }, [keepScreenOn]);

  useEffect(() => {
    const handleStateChange = () => {
      if (document.visibilityState === 'visible' && keepScreenOn) {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleStateChange);
    document.addEventListener('fullscreenchange', handleStateChange);
    return () => {
      document.removeEventListener('visibilitychange', handleStateChange);
      document.removeEventListener('fullscreenchange', handleStateChange);
    };
  }, [keepScreenOn]);

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
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch {
      // CSS fullscreen fallback for environments without Fullscreen API (e.g. iOS Safari)
      setIsFullscreen(prev => !prev);
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

  const themeConfig = getClockThemeStyles(theme);



  const effectiveAnimation: AnimationFx =
    animationFx === 'auto'
      ? (themeConfig.defaultAnimation || 'auto')
      : animationFx;

  const getAnimationGlowClass = () => {
    if (effectiveAnimation === 'none') return '';
    if (effectiveAnimation === 'heartbeat') return 'animate-clock-heartbeat';
    if (effectiveAnimation === 'sunrise') return 'animate-clock-sunrise-glow';
    if (effectiveAnimation === 'sunset') return 'animate-clock-sunset-glow';
    if (effectiveAnimation === 'aurora') return 'animate-clock-aurora';
    if (effectiveAnimation === 'breathe') return 'animate-clock-breathe';
    if (effectiveAnimation === 'ocean') return 'animate-clock-ocean-tide';
    if (effectiveAnimation === 'fire') return 'animate-clock-fire-ember';
    if (effectiveAnimation === 'supernova') return 'animate-clock-supernova';
    // auto with no theme specific animation:
    return ambientGlow ? 'animate-pulse-slow' : '';
  };

  const getAnimationTextClass = () => {
    if (effectiveAnimation === 'none') return '';
    if (effectiveAnimation === 'heartbeat') return 'animate-clock-heartbeat-subtle';
    if (effectiveAnimation === 'breathe') return 'animate-clock-breathe-subtle';
    if (effectiveAnimation === 'ocean') return 'animate-clock-ocean-subtle';
    if (effectiveAnimation === 'fire') return 'animate-clock-fire-subtle';
    if (effectiveAnimation === 'supernova') return 'animate-clock-supernova-subtle';
    if (effectiveAnimation === 'sunrise' || effectiveAnimation === 'sunset' || effectiveAnimation === 'aurora') {
      return 'animate-clock-gradient-shift';
    }
    return '';
  };

  const themes = CLOCK_THEMES;



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

          {/* Keep Screen On Toggle */}
          <button
            onClick={() => setKeepScreenOn(!keepScreenOn)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              keepScreenOn
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-500 dark:text-amber-400 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title={
              keepScreenOn
                ? wakeLockActive
                  ? 'Keep Screen On: Active (Display will stay awake)'
                  : 'Keep Screen On: Active (Sleep prevention active)'
                : isWakeLockSupported
                  ? 'Keep Screen On: Inactive (Click to prevent display sleep)'
                  : 'Keep Screen On: Inactive (Click to activate fallback keep awake)'
            }
          >
            <Sun size={14} className={keepScreenOn ? 'animate-pulse text-amber-500' : ''} />
            <span className="hidden sm:inline">Keep Awake</span>
            {keepScreenOn && (
              <span className={`w-1.5 h-1.5 rounded-full ${wakeLockActive ? 'bg-amber-500' : 'bg-amber-400/80'}`} />
            )}
          </button>

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

            {/* Dynamic Animation FX Selector */}
            <div className="flex items-center gap-1.5">
              <select
                value={animationFx}
                onChange={(e) => setAnimationFx(e.target.value as AnimationFx)}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                title="Dynamic background & glow animation style"
              >
                {CLOCK_ANIMATION_FX_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
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

      {/* Aesthetic Theme Swatches (Collapsible Section) */}
      <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl transition-all duration-300">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <button
            onClick={() => setIsThemesCollapsed(!isThemesCollapsed)}
            className="flex items-center gap-2 group text-left cursor-pointer"
            title={isThemesCollapsed ? 'Click to expand themes gallery' : 'Click to collapse themes'}
          >
            <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20 transition-colors">
              <Sparkles size={14} />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                Style Themes ({themes.length} Aesthetics)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                {isThemesCollapsed ? 'Click to expand styles & animations' : 'Curated aesthetics & dynamic animations'}
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {/* Active Theme Summary Pill */}
            {(() => {
              const activeObj = themes.find(t => t.id === theme) || themes[0];
              return (
                <button
                  onClick={() => setIsThemesCollapsed(!isThemesCollapsed)}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  title={isThemesCollapsed ? 'Click to open theme gallery' : 'Click to collapse theme gallery'}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-xs ${activeObj.color}`} />
                  <span className="font-mono text-[11px] truncate max-w-[130px] sm:max-w-[190px]">
                    {activeObj.label}
                  </span>
                </button>
              );
            })()}

            {/* Collapse / Expand Toggle Button */}
            <button
              onClick={() => setIsThemesCollapsed(!isThemesCollapsed)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              title={isThemesCollapsed ? 'Expand themes gallery' : 'Collapse themes gallery'}
            >
              <span>{isThemesCollapsed ? 'Expand' : 'Collapse'}</span>
              {isThemesCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </div>

        {/* Expandable Content Body */}
        {!isThemesCollapsed && (
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-3">
            {/* Category Filter Tabs */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold overflow-x-auto no-scrollbar">
                {[
                  { id: 'all' as ThemeCategory, label: 'All' },
                  { id: 'animated' as ThemeCategory, label: 'Dynamic & Animated' },
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

              <span className="text-[11px] font-mono text-slate-500 hidden md:inline">
                Showing {filteredThemes.length} of {themes.length} styles
              </span>
            </div>

            {/* Swatches Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 max-h-[380px] overflow-y-auto pr-1">
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
        )}
      </div>

      {/* Main Clock Canvas Display */}
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-3xl ${themeConfig.bg} ${themeConfig.border} border p-6 sm:p-14 min-h-[460px] flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-500 select-none ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen h-[100dvh] w-screen w-full border-none p-4 sm:p-8 md:p-12 overflow-hidden' : ''
        }`}
      >
        {/* Glow backdrop layer with dynamic animations */}
        <div
          className={`absolute inset-0 ${themeConfig.glow} ${getAnimationGlowClass()} pointer-events-none transition-all duration-700`}
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
          <div className="flex items-center gap-2">
            <span className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${themeConfig.badgeBg}`}>
              {customTag}
            </span>
            {keepScreenOn && (
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 backdrop-blur-md" title="Display sleep prevented">
                <Sun size={11} className="animate-pulse text-amber-400" />
                <span>Always On</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isFullscreen && (
              <button
                onClick={() => setKeepScreenOn(!keepScreenOn)}
                className={`p-2.5 rounded-2xl backdrop-blur-md transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  keepScreenOn
                    ? 'bg-amber-500/25 border border-amber-500/50 text-amber-300'
                    : themeConfig.isLight
                      ? 'bg-black/10 hover:bg-black/20 text-slate-800'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={keepScreenOn ? 'Keep Screen On: Active (Click to disable)' : 'Keep Screen On: Inactive (Click to enable)'}
              >
                <Sun size={18} className={keepScreenOn ? 'animate-pulse text-amber-400' : ''} />
                <span className="hidden md:inline">{keepScreenOn ? 'Awake' : 'Sleep Allowed'}</span>
              </button>
            )}

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
        </div>

        {/* Mode 1: Digital Display Mode (Horizontal) */}
        {mode === 'digital' && (
          <div className={`relative z-10 my-auto ${isFullscreen ? 'space-y-6 sm:space-y-8' : 'space-y-4'}`}>
            <div className="flex items-baseline justify-center gap-1 sm:gap-3">
              <span
                className={`tracking-tight leading-none ${getFontFamilyClass()} ${themeConfig.clockText} ${getAnimationTextClass()} ${
                  isFullscreen
                    ? showSeconds
                      ? 'text-[clamp(4.2rem,min(15vw,26vh),19rem)]'
                      : 'text-[clamp(5.2rem,min(22vw,36vh),25rem)]'
                    : 'text-6xl sm:text-8xl md:text-9xl'
                }`}
              >
                {hoursStr}
                <span className="animate-pulse opacity-90 mx-0.5 sm:mx-1">:</span>
                {minutesStr}
                {showSeconds && (
                  <>
                    <span className="animate-pulse opacity-90 mx-0.5 sm:mx-1">:</span>
                    <span className={`opacity-90 ${
                      isFullscreen
                        ? 'text-[clamp(2.6rem,min(9.5vw,16vh),12rem)]'
                        : 'text-4xl sm:text-6xl md:text-7xl'
                    }`}>
                      {secondsStr}
                    </span>
                  </>
                )}
              </span>

              {!is24Hour && (
                <span className={`font-extrabold uppercase ${themeConfig.accent} ${
                  isFullscreen
                    ? 'text-[clamp(1.5rem,min(4.5vw,7vh),4.5rem)] ml-3 sm:ml-5'
                    : 'text-xl sm:text-3xl ml-2'
                }`}>
                  {ampm}
                </span>
              )}
            </div>

            {showDate && (
              <p className={`font-medium tracking-wide ${themeConfig.subText || 'text-slate-400'} ${
                isFullscreen ? 'text-[clamp(1.1rem,min(2.8vw,4vh),2.5rem)] pt-4' : 'text-base sm:text-xl'
              }`}>
                {dateStr}
              </p>
            )}
          </div>
        )}

        {/* Mode 2: Modern StandBy Stacked Mode (Vertical Large Digits) */}
        {mode === 'stacked' && (
          <div className={`relative z-10 flex flex-col items-center justify-center my-auto ${isFullscreen ? 'space-y-4 py-4 sm:py-6' : 'space-y-2 py-4'}`}>
            <div className="flex flex-col items-center select-none">
              <span
                className={`tracking-tight font-black ${getFontFamilyClass()} ${themeConfig.clockText} ${getAnimationTextClass()} ${
                  isFullscreen
                    ? 'text-[clamp(5rem,min(30vw,36vh),24rem)] leading-[0.78]'
                    : 'text-7xl sm:text-9xl md:text-[10rem] lg:text-[11rem] leading-[0.85]'
                }`}
              >
                {hoursStr}
              </span>
              <span
                className={`tracking-tight font-black ${getFontFamilyClass()} ${themeConfig.clockText} ${getAnimationTextClass()} ${
                  isFullscreen
                    ? 'text-[clamp(5rem,min(30vw,36vh),24rem)] leading-[0.78]'
                    : 'text-7xl sm:text-9xl md:text-[10rem] lg:text-[11rem] leading-[0.85]'
                }`}
              >
                {minutesStr}
              </span>
            </div>

            <div className={`flex flex-wrap items-center justify-center gap-3 ${isFullscreen ? 'pt-4 sm:pt-6' : 'pt-3'}`}>
              {!is24Hour && (
                <span className={`rounded-xl font-black uppercase tracking-wider border ${themeConfig.badgeBg} ${
                  isFullscreen ? 'px-4 py-1.5 text-base sm:text-xl' : 'px-2.5 py-0.5 text-xs sm:text-sm'
                }`}>
                  {ampm}
                </span>
              )}

              {showSeconds && (
                <span className={`font-mono font-bold tracking-wider ${themeConfig.accent} ${
                  isFullscreen ? 'text-2xl sm:text-4xl md:text-5xl' : 'text-base sm:text-xl'
                }`}>
                  :{secondsStr}
                </span>
              )}

              {showDate && (
                <span className={`font-medium tracking-wide ${themeConfig.subText || 'text-slate-400'} ${
                  isFullscreen ? 'text-lg sm:text-2xl' : 'text-sm sm:text-base'
                }`}>
                  • {dateStr}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Mode: Chronograph Radial Gauge */}
        {mode === 'radial' && (
          <div className="relative z-10 flex flex-col items-center space-y-4 my-auto">
            <div className={`relative flex items-center justify-center ${
              isFullscreen
                ? 'w-[clamp(18rem,min(72vh,82vw),46rem)] h-[clamp(18rem,min(72vh,82vw),46rem)]'
                : 'w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96'
            }`}>
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
                <div className={`font-black ${getFontFamilyClass()} ${themeConfig.clockText} ${getAnimationTextClass()} ${
                  isFullscreen
                    ? 'text-[clamp(2.5rem,min(11vw,14vh),7rem)]'
                    : 'text-2xl sm:text-3xl md:text-4xl'
                }`}>
                  {hoursStr}:{minutesStr}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {showSeconds && (
                    <span className={`font-mono font-bold ${themeConfig.accent} ${
                      isFullscreen ? 'text-[clamp(1.2rem,min(3.5vw,4.5vh),2.5rem)]' : 'text-xs sm:text-sm'
                    }`}>
                      :{secondsStr}
                    </span>
                  )}
                  {!is24Hour && (
                    <span className={`font-bold uppercase ${themeConfig.accent} ${
                      isFullscreen ? 'text-[clamp(1rem,min(2.5vw,3.5vh),2rem)]' : 'text-[10px] sm:text-xs'
                    }`}>
                      {ampm}
                    </span>
                  )}
                </div>
                <div className={`font-mono tracking-wider opacity-70 ${themeConfig.subText || 'text-slate-400'} ${
                  isFullscreen ? 'text-xs sm:text-base md:text-lg mt-1' : 'text-[10px] mt-1'
                }`}>
                  {Math.round(secProgress * 100)}%
                </div>
              </div>
            </div>

            {/* Radial Legend Badges */}
            <div className={`flex flex-wrap items-center justify-center font-semibold ${
              isFullscreen ? 'text-sm sm:text-base gap-6 pt-3' : 'text-xs gap-3'
            }`}>
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
              <p className={`font-medium tracking-wide ${themeConfig.subText || 'text-slate-400'} ${
                isFullscreen ? 'text-base sm:text-xl pt-2' : 'text-xs sm:text-sm'
              }`}>
                {dateStr}
              </p>
            )}
          </div>
        )}

        {/* Mode: Typographic Word Clock */}
        {mode === 'words' && (
          <div className={`relative z-10 flex flex-col items-center justify-center my-auto select-none ${
            isFullscreen ? 'max-w-5xl px-6 py-12 space-y-8' : 'max-w-2xl px-4 py-6 space-y-4'
          }`}>
            <span className={`font-bold uppercase tracking-widest border ${themeConfig.badgeBg} ${
              isFullscreen ? 'px-5 py-2 text-sm sm:text-base rounded-full' : 'px-3 py-1 text-xs rounded-full'
            }`}>
              It Is
            </span>

            {/* Conversational Phrase */}
            <h3 className={`font-black uppercase tracking-tight ${themeConfig.accent} ${
              isFullscreen ? 'text-[clamp(1.8rem,min(6vw,7.5vh),5rem)]' : 'text-2xl sm:text-4xl md:text-5xl'
            }`}>
              {wordClockData.phrase}
            </h3>

            {/* Hero Target Hour */}
            <h1
              className={`font-black tracking-tight leading-none ${getFontFamilyClass()} ${themeConfig.clockText} ${getAnimationTextClass()} ${
                isFullscreen
                  ? 'text-[clamp(4.2rem,min(14vw,19vh),13rem)]'
                  : 'text-6xl sm:text-8xl md:text-9xl'
              }`}
            >
              {wordClockData.targetHour}
              {wordClockData.isOclock && (
                <span className={`opacity-80 ml-3 ${isFullscreen ? 'text-[clamp(2.5rem,min(8vw,11vh),7.5rem)]' : 'text-4xl sm:text-6xl'}`}>
                  O&apos;CLOCK
                </span>
              )}
            </h1>

            {/* Natural Period */}
            <p className={`font-bold uppercase tracking-widest ${themeConfig.subText || 'text-slate-400'} ${
              isFullscreen ? 'text-[clamp(1.1rem,min(3.5vw,5vh),3.25rem)]' : 'text-base sm:text-2xl'
            }`}>
              {wordClockData.period}
            </p>

            {/* Bottom Digital Verification Pill */}
            <div className="flex items-center gap-2 pt-2">
              <span className={`rounded-xl font-mono font-bold border ${themeConfig.border} ${
                themeConfig.isLight ? 'bg-slate-200/80 text-slate-800' : 'bg-white/10 text-slate-200'
              } ${isFullscreen ? 'px-4 py-2 text-sm sm:text-lg' : 'px-3 py-1 text-xs sm:text-sm'}`}>
                {hoursStr}:{minutesStr}{showSeconds ? `:${secondsStr}` : ''} {!is24Hour && ampm}
              </span>
              {showDate && (
                <span className={`${themeConfig.subText || 'text-slate-400'} ${
                  isFullscreen ? 'text-sm sm:text-lg' : 'text-xs sm:text-sm'
                }`}>
                  • {dateStr}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Mode: Executive Desk Station Calendar Dashboard */}
        {mode === 'calendar' && (
          <div className={`relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center justify-center my-auto w-full select-none ${
            isFullscreen ? 'max-w-7xl px-6 py-10 gap-10 lg:gap-14' : 'max-w-4xl px-2 py-4 gap-8'
          }`}>
            {/* Left / Main Section: Big Time & Day Focus */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
              <div className="flex items-baseline gap-2">
                <span className={`font-black tracking-tight leading-none ${getFontFamilyClass()} ${themeConfig.clockText} ${getAnimationTextClass()} ${
                  isFullscreen
                    ? 'text-6xl sm:text-8xl md:text-[9rem] lg:text-[11rem]'
                    : 'text-5xl sm:text-7xl md:text-8xl'
                }`}>
                  {hoursStr}:{minutesStr}
                </span>
                {showSeconds && (
                  <span className={`font-mono font-bold opacity-80 ${themeConfig.accent} ${
                    isFullscreen ? 'text-3xl sm:text-5xl md:text-6xl' : 'text-2xl sm:text-4xl'
                  }`}>
                    :{secondsStr}
                  </span>
                )}
                {!is24Hour && (
                  <span className={`font-black uppercase ml-1 ${themeConfig.accent} ${
                    isFullscreen ? 'text-xl sm:text-3xl' : 'text-base sm:text-xl'
                  }`}>
                    {ampm}
                  </span>
                )}
              </div>

              {/* Date & Week */}
              <div className="space-y-1">
                <p className={`font-bold ${themeConfig.subText || 'text-slate-300'} ${
                  isFullscreen ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
                }`}>
                  {dateStr}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 justify-center lg:justify-start">
                  <span className={`rounded-lg font-semibold border ${themeConfig.border} ${
                    themeConfig.isLight ? 'bg-slate-200/60 text-slate-800' : 'bg-white/10 text-slate-300'
                  } ${isFullscreen ? 'px-3 py-1 text-sm sm:text-base' : 'px-2.5 py-0.5 text-xs'}`}>
                    Week {weekNumber}
                  </span>
                  <span className={`rounded-lg font-semibold border ${themeConfig.border} ${
                    themeConfig.isLight ? 'bg-slate-200/60 text-slate-800' : 'bg-white/10 text-slate-300'
                  } ${isFullscreen ? 'px-3 py-1 text-sm sm:text-base' : 'px-2.5 py-0.5 text-xs'}`}>
                    Day {dayOfYear} of {totalYearDays}
                  </span>
                </div>
              </div>

              {/* Year Progress Bar */}
              <div className={`w-full pt-2 space-y-1.5 ${isFullscreen ? 'max-w-md' : 'max-w-sm'}`}>
                <div className={`flex justify-between font-semibold ${isFullscreen ? 'text-sm' : 'text-xs'}`}>
                  <span className={themeConfig.subText || 'text-slate-400'}>{calYear} Year Progress</span>
                  <span className={`font-mono font-bold ${themeConfig.accent}`}>{yearProgressPercent}%</span>
                </div>
                <div className={`rounded-full overflow-hidden ${
                  isFullscreen ? 'h-3' : 'h-2'
                } ${themeConfig.isLight ? 'bg-slate-300/80' : 'bg-white/10'}`}>
                  <div
                    className={`h-full transition-all duration-500 ${themeConfig.progressBar}`}
                    style={{ width: `${yearProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right Section: Mini Calendar Matrix */}
            <div className={`lg:col-span-5 border backdrop-blur-xl ${
              isFullscreen ? 'p-7 sm:p-9 rounded-[2.5rem]' : 'p-5 rounded-3xl'
            } ${
              themeConfig.isLight
                ? 'bg-white/90 border-slate-300 shadow-lg text-slate-800'
                : 'bg-black/40 border-white/10 shadow-2xl text-slate-200'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <span className={`font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                  isFullscreen ? 'text-sm sm:text-base' : 'text-xs'
                }`}>
                  <CalendarIcon size={isFullscreen ? 16 : 13} className={themeConfig.accent} />
                  {monthName} {calYear}
                </span>
                <span className={`font-mono px-2 py-0.5 rounded-md ${themeConfig.badgeBg} ${
                  isFullscreen ? 'text-xs sm:text-sm' : 'text-[11px]'
                }`}>
                  Today: {calDate}
                </span>
              </div>

              {/* Day of Week Headers */}
              <div className={`grid grid-cols-7 gap-1 text-center font-bold opacity-60 mb-1 ${
                isFullscreen ? 'text-xs sm:text-sm' : 'text-[11px]'
              }`}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                  <span key={idx}>{day}</span>
                ))}
              </div>

              {/* Calendar Date Cells */}
              <div className={`grid grid-cols-7 gap-1 text-center font-semibold ${
                isFullscreen ? 'text-sm sm:text-base' : 'text-xs'
              }`}>
                {calCells.map((cell, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square flex items-center justify-center rounded-xl transition-colors ${
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
            <div className={`flex items-center justify-center ${isFullscreen ? 'gap-3 sm:gap-6' : 'gap-3 sm:gap-6'}`}>
              {/* Hours Card */}
              <div className="flex flex-col items-center">
                <div
                  className={`relative border flex items-center justify-center ${themeConfig.flipCard} shadow-2xl overflow-hidden ${
                    isFullscreen
                      ? 'w-[clamp(6rem,min(18vw,23vh),18rem)] h-[clamp(8rem,min(25vw,31vh),25rem)] rounded-[2.5rem]'
                      : 'w-24 sm:w-36 md:w-44 h-32 sm:h-44 md:h-52 rounded-3xl'
                  }`}
                >
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4 rounded-r-md bg-black/60 shadow-inner z-30" />
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-4 rounded-l-md bg-black/60 shadow-inner z-30" />
                  <div className="absolute inset-x-0 top-1/2 h-[2px] bg-black/50 shadow-sm z-20" />
                  <span className={`font-black ${getFontFamilyClass()} ${getAnimationTextClass()} relative z-15 ${
                    isFullscreen
                      ? 'text-[clamp(4.2rem,min(13vw,17vh),13rem)]'
                      : 'text-5xl sm:text-7xl md:text-8xl'
                  }`}>
                    {hoursStr}
                  </span>
                </div>
                <span className={`uppercase font-extrabold ${themeConfig.subText || 'text-slate-500'} ${
                  isFullscreen ? 'text-sm sm:text-base mt-3' : 'text-xs mt-2'
                }`}>
                  Hours
                </span>
              </div>

              <div className={`font-black animate-pulse ${themeConfig.accent} ${
                isFullscreen ? 'text-[clamp(3.5rem,min(9vw,12vh),8rem)]' : 'text-4xl sm:text-6xl'
              }`}>:</div>

              {/* Minutes Card */}
              <div className="flex flex-col items-center">
                <div
                  className={`relative border flex items-center justify-center ${themeConfig.flipCard} shadow-2xl overflow-hidden ${
                    isFullscreen
                      ? 'w-[clamp(6rem,min(18vw,23vh),18rem)] h-[clamp(8rem,min(25vw,31vh),25rem)] rounded-[2.5rem]'
                      : 'w-24 sm:w-36 md:w-44 h-32 sm:h-44 md:h-52 rounded-3xl'
                  }`}
                >
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4 rounded-r-md bg-black/60 shadow-inner z-30" />
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-4 rounded-l-md bg-black/60 shadow-inner z-30" />
                  <div className="absolute inset-x-0 top-1/2 h-[2px] bg-black/50 shadow-sm z-20" />
                  <span className={`font-black ${getFontFamilyClass()} ${getAnimationTextClass()} relative z-15 ${
                    isFullscreen
                      ? 'text-[clamp(4.2rem,min(13vw,17vh),13rem)]'
                      : 'text-5xl sm:text-7xl md:text-8xl'
                  }`}>
                    {minutesStr}
                  </span>
                </div>
                <span className={`uppercase font-extrabold ${themeConfig.subText || 'text-slate-500'} ${
                  isFullscreen ? 'text-sm sm:text-base mt-3' : 'text-xs mt-2'
                }`}>
                  Minutes
                </span>
              </div>

              {showSeconds && (
                <>
                  <div className={`font-black animate-pulse ${themeConfig.accent} ${
                    isFullscreen ? 'text-[clamp(3.5rem,min(9vw,12vh),8rem)]' : 'text-4xl sm:text-6xl'
                  }`}>:</div>
                  {/* Seconds Card */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`relative border flex items-center justify-center ${themeConfig.flipCard} shadow-2xl overflow-hidden opacity-90 ${
                        isFullscreen
                          ? 'w-[clamp(4.8rem,min(13vw,17vh),13rem)] h-[clamp(6.2rem,min(18vw,23vh),18rem)] rounded-[2rem]'
                          : 'w-20 sm:w-28 md:w-36 h-28 sm:h-36 md:h-44 rounded-3xl'
                      }`}
                    >
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10" />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4 rounded-r-md bg-black/60 shadow-inner z-30" />
                      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-4 rounded-l-md bg-black/60 shadow-inner z-30" />
                      <div className="absolute inset-x-0 top-1/2 h-[2px] bg-black/50 shadow-sm z-20" />
                      <span className={`font-black ${getFontFamilyClass()} ${getAnimationTextClass()} relative z-15 ${
                        isFullscreen
                          ? 'text-[clamp(3.2rem,min(9vw,12vh),9rem)]'
                          : 'text-4xl sm:text-6xl md:text-7xl'
                      }`}>
                        {secondsStr}
                      </span>
                    </div>
                    <span className={`uppercase font-extrabold ${themeConfig.subText || 'text-slate-500'} ${
                      isFullscreen ? 'text-sm sm:text-base mt-3' : 'text-xs mt-2'
                    }`}>
                      Seconds
                    </span>
                  </div>
                </>
              )}

              {!is24Hour && (
                <div className="flex flex-col justify-center self-center pl-2">
                  <span className={`font-extrabold uppercase ${themeConfig.accent} ${
                    isFullscreen ? 'text-3xl sm:text-5xl lg:text-6xl' : 'text-xl sm:text-3xl'
                  }`}>
                    {ampm}
                  </span>
                </div>
              )}
            </div>

            {showDate && (
              <p className={`font-medium tracking-wide ${themeConfig.subText || 'text-slate-400'} ${
                isFullscreen ? 'text-lg sm:text-2xl pt-2' : 'text-sm sm:text-lg'
              }`}>
                {dateStr}
              </p>
            )}
          </div>
        )}

        {/* Mode 4: Razor-Sharp SVG Analog Chronometer */}
        {mode === 'analog' && (
          <div className="relative z-10 flex flex-col items-center space-y-5 my-auto">
            <div className={`relative flex items-center justify-center ${
              isFullscreen
                ? 'w-[clamp(18rem,min(72vh,82vw),46rem)] h-[clamp(18rem,min(72vh,82vw),46rem)]'
                : 'w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96'
            }`}>
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
            <div className={`flex items-center gap-2 font-bold ${getFontFamilyClass()} ${
              themeConfig.isLight ? 'text-slate-800' : 'text-slate-200'
            } ${isFullscreen ? 'text-[clamp(1.4rem,min(3.8vw,4.8vh),3.2rem)] pt-3' : 'text-xl'}`}>
              <span>{hoursStr}:{minutesStr}{showSeconds ? `:${secondsStr}` : ''}</span>
              {!is24Hour && (
                <span className={`uppercase ${themeConfig.accent} ${isFullscreen ? 'text-lg sm:text-2xl' : 'text-xs'}`}>
                  {ampm}
                </span>
              )}
            </div>

            {showDate && (
              <p className={`${themeConfig.subText || 'text-slate-400'} ${isFullscreen ? 'text-[clamp(1rem,min(2.5vw,3vh),2rem)]' : 'text-xs'}`}>
                {dateStr}
              </p>
            )}
          </div>
        )}

        {/* Mode 5: Pomodoro Focus Timer Mode */}
        {mode === 'pomodoro' && (
          <div className="relative z-10 space-y-6 my-auto">
            <span className={`rounded-full font-bold uppercase tracking-widest border backdrop-blur-md ${themeConfig.badgeBg} ${
              isFullscreen ? 'px-6 py-2 text-sm sm:text-base' : 'px-4 py-1.5 text-xs'
            }`}>
              {pomoMode === 'work' ? 'Focus Session' : 'Short Break'}
            </span>

            <div className={`tracking-tight leading-none ${getFontFamilyClass()} ${themeConfig.clockText} ${getAnimationTextClass()} ${
              isFullscreen ? 'text-[clamp(5.5rem,min(22vw,32vh),22rem)]' : 'text-7xl sm:text-9xl'
            }`}>
              {pomoMinutes}:{pomoSeconds}
            </div>

            <div className={`flex items-center justify-center ${isFullscreen ? 'gap-5 pt-4' : 'gap-3 pt-2'}`}>
              <button
                onClick={() => setPomoIsRunning(!pomoIsRunning)}
                className={`rounded-2xl ${
                  themeConfig.isLight
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                } font-extrabold flex items-center gap-2 backdrop-blur-xl active:scale-95 transition-all cursor-pointer shadow-lg ${
                  isFullscreen ? 'px-10 py-5 text-lg' : 'px-7 py-3.5 text-sm'
                }`}
              >
                {pomoIsRunning ? <Pause size={isFullscreen ? 24 : 18} /> : <Play size={isFullscreen ? 24 : 18} />}
                <span>{pomoIsRunning ? 'Pause Session' : 'Start Focus'}</span>
              </button>

              <button
                onClick={() => {
                  setPomoIsRunning(false);
                  setPomoTimeLeft(pomoTargetDuration);
                }}
                className={`rounded-2xl ${
                  themeConfig.isLight
                    ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                } transition-colors cursor-pointer ${isFullscreen ? 'p-5' : 'p-3.5'}`}
                title="Reset timer"
              >
                <RotateCcw size={isFullscreen ? 24 : 18} />
              </button>
            </div>
          </div>
        )}

        {/* Mode 6: Stopwatch & Lap Counter Mode */}
        {mode === 'stopwatch' && (
          <div className={`relative z-10 space-y-6 my-auto w-full ${isFullscreen ? 'max-w-2xl' : 'max-w-md'}`}>
            <div className={`tracking-tight leading-none ${getFontFamilyClass()} ${themeConfig.clockText} ${getAnimationTextClass()} ${
              isFullscreen ? 'text-[clamp(5rem,min(18vw,26vh),18rem)]' : 'text-6xl sm:text-8xl'
            }`}>
              {swMinutes}:{swSeconds}
              <span className={`opacity-80 ${isFullscreen ? 'text-[clamp(3rem,min(11vw,16vh),10rem)]' : 'text-3xl sm:text-5xl'}`}>
                .{swMs}
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setSwIsRunning(!swIsRunning)}
                className={`rounded-2xl ${
                  themeConfig.isLight
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                } font-extrabold flex items-center gap-2 backdrop-blur-xl active:scale-95 transition-all cursor-pointer shadow-lg ${
                  isFullscreen ? 'px-8 py-4 text-base' : 'px-6 py-3 text-sm'
                }`}
              >
                {swIsRunning ? <Pause size={isFullscreen ? 20 : 16} /> : <Play size={isFullscreen ? 20 : 16} />}
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
                className={`rounded-2xl ${
                  themeConfig.isLight
                    ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                } font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isFullscreen ? 'px-7 py-4 text-base' : 'px-5 py-3 text-sm'
                }`}
              >
                {swIsRunning ? (
                  <>
                    <Flag size={isFullscreen ? 18 : 14} />
                    <span>Lap</span>
                  </>
                ) : (
                  <>
                    <RotateCcw size={isFullscreen ? 18 : 14} />
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
      </div>
    </div>
  );
};
