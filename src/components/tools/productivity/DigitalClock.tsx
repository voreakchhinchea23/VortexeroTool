import React, { useState, useEffect, useRef, useId, useMemo } from 'react';
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
  Watch,
  Shuffle,
  Compass,
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
export type AnalogStyle =
  | 'chronometer'
  | 'bauhaus'
  | 'diver'
  | 'roman'
  | 'pilot'
  | 'atelier'
  | 'telemetry'
  | 'california'
  | 'tourbillon'
  | 'celestial'
  | 'chronograph'
  | 'artdeco'
  | 'orbital'
  | 'kintsugi'
  | 'orrery'
  | 'galaxy'
  | 'astrolabe'
  | 'blackhole'
  | 'gears'
  | 'cyberwave';
export type RadialStyle =
  | 'chronograph'
  | 'solar_orbit'
  | 'galaxy_vortex'
  | 'supernova'
  | 'blackhole_lens'
  | 'cyber_hud'
  | 'segmented_led'
  | 'turbine'
  | 'waveform'
  | 'dna_helix'
  | 'synth_prism'
  | 'fractal_mandala';
export type AnalogMotion = 'sweep' | 'tick';

export type BackgroundFx =
  | 'aurora'
  | 'solar'
  | 'galaxy'
  | 'warp'
  | 'orbital'
  | 'starfield'
  | 'waves'
  | 'grid'
  | 'bokeh'
  | 'ripple'
  | 'none';

export interface AnalogStyleMeta {
  id: AnalogStyle;
  label: string;
  tagline: string;
  category: 'Classic' | 'Modern' | 'Sport' | 'Technical';
}

export interface RadialStyleMeta {
  id: RadialStyle;
  label: string;
  tagline: string;
  category: 'Classic' | 'Cosmic' | 'Technical' | 'Modern';
}

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

export const ANALOG_STYLES: AnalogStyleMeta[] = [
  {
    id: 'chronometer',
    label: 'Chronometer',
    tagline: 'Dauphine hands, railway minute track and 3 o clock date aperture',
    category: 'Classic',
  },
  {
    id: 'bauhaus',
    label: 'Bauhaus',
    tagline: 'Swiss modernist architectural batons and iconic lollipop second hand',
    category: 'Modern',
  },
  {
    id: 'diver',
    label: 'Diver Pro',
    tagline: 'Coin-edge 60m sport bezel, lume plots and broad-arrow hands',
    category: 'Sport',
  },
  {
    id: 'roman',
    label: 'Roman',
    tagline: 'Sunburst guilloche medallion, serif Roman numerals and Breguet hands',
    category: 'Classic',
  },
  {
    id: 'pilot',
    label: 'Pilot GMT',
    tagline: 'Flieger orientation triangle and live 6 o clock day-reserve sub-dial',
    category: 'Technical',
  },
  {
    id: 'atelier',
    label: 'Atelier',
    tagline: 'Minimalist gallery dial with sculpted 12 o clock concave orb',
    category: 'Modern',
  },
  {
    id: 'telemetry',
    label: 'Telemetry',
    tagline: 'Bearing azimuth reticle, skeleton hands and trailing radar sweep',
    category: 'Technical',
  },
  {
    id: 'california',
    label: 'California',
    tagline: 'Vintage explorer half-Roman upper and Arabic lower field dial',
    category: 'Sport',
  },
  {
    id: 'tourbillon',
    label: 'Tourbillon',
    tagline: 'Open-heart 6 o clock flying escapement cage and skeleton bridge',
    category: 'Technical',
  },
  {
    id: 'celestial',
    label: 'Moonphase',
    tagline: 'Astronomical starry nocturne with live synodic lunar aperture',
    category: 'Classic',
  },
  {
    id: 'chronograph',
    label: 'Tachymeter',
    tagline: 'Motorsport tachymeter bezel with live tri-compax racing sub-dials',
    category: 'Sport',
  },
  {
    id: 'artdeco',
    label: 'Art Deco',
    tagline: '1920s Metropolis stepped sector dial, sunburst rays and dagger hands',
    category: 'Modern',
  },
  {
    id: 'orbital',
    label: 'Orbital HUD',
    tagline: 'Concentric holographic rings with orbiting planetary time nodes',
    category: 'Technical',
  },
  {
    id: 'kintsugi',
    label: 'Zen Horizon',
    tagline: 'Wabi-sabi ceramic horizon ripple rings and katana blade hands',
    category: 'Modern',
  },
  {
    id: 'orrery',
    label: 'Solar System',
    tagline: 'Heliocentric live planetarium with real J2000 planetary orbits and comet',
    category: 'Technical',
  },
  {
    id: 'galaxy',
    label: 'Spiral Galaxy',
    tagline: 'Rotating barred spiral nebula with star-forming arms and cosmic dust',
    category: 'Modern',
  },
  {
    id: 'astrolabe',
    label: 'Astrolabe',
    tagline: 'Planispheric stereographic horizon plate with rotating golden zodiac rete',
    category: 'Classic',
  },
  {
    id: 'blackhole',
    label: 'Singularity',
    tagline: 'Relativistic event horizon with gravitationally lensed accretion plasma',
    category: 'Technical',
  },
  {
    id: 'gears',
    label: 'Automaton',
    tagline: 'Openworked 5-wheel meshing mechanical caliber and 4Hz balance wheel',
    category: 'Technical',
  },
  {
    id: 'cyberwave',
    label: 'Synthwave',
    tagline: 'Retrofuturistic sliced neon sunset with scrolling 3D laser horizon grid',
    category: 'Modern',
  },
];

export const RADIAL_STYLES: RadialStyleMeta[] = [
  {
    id: 'chronograph',
    label: 'Chronograph',
    tagline: 'Precision 3-track chronometer with calibrated Vernier bezel and specular glow',
    category: 'Classic',
  },
  {
    id: 'solar_orbit',
    label: 'Solar System',
    tagline: 'Live J2000 planetary ephemeris with ringed Saturn, Earth-Moon and comet wake',
    category: 'Cosmic',
  },
  {
    id: 'galaxy_vortex',
    label: 'Spiral Galaxy',
    tagline: 'Rotating 4-arm barred galactic nebula halo enclosing a dark starlit core',
    category: 'Cosmic',
  },
  {
    id: 'supernova',
    label: 'Pulsar Nebula',
    tagline: 'Rotating relativistic twin magnetar beams and ionized shockwave arcs',
    category: 'Cosmic',
  },
  {
    id: 'blackhole_lens',
    label: 'Singularity',
    tagline: 'Gravitational lensing Einstein photon ring framing the event horizon',
    category: 'Cosmic',
  },
  {
    id: 'cyber_hud',
    label: 'Cyber HUD',
    tagline: 'Aerospace optical reticle with rotating azimuth degree ring and radar sweep',
    category: 'Technical',
  },
  {
    id: 'segmented_led',
    label: 'VU Turbine',
    tagline: 'Illuminated optical block equalizer matrix with decaying phosphor trail',
    category: 'Modern',
  },
  {
    id: 'turbine',
    label: 'Mach Iris',
    tagline: 'Rotating 16-blade swept titanium turbofan stator and riveted aerospace bezel',
    category: 'Technical',
  },
  {
    id: 'waveform',
    label: 'Sonic Wave',
    tagline: 'Live oscillating polar Fourier harmonic waves and acoustic resonance nodes',
    category: 'Modern',
  },
  {
    id: 'dna_helix',
    label: 'Bio Helix',
    tagline: 'Counter-twisting coiled double-helix strands with illuminated genetic base rungs',
    category: 'Technical',
  },
  {
    id: 'synth_prism',
    label: 'Synthwave',
    tagline: '80s Outrun sliced horizon crest, chromatic spectrum tracks and laser perspective grid',
    category: 'Modern',
  },
  {
    id: 'fractal_mandala',
    label: 'Sacred Mandala',
    tagline: 'Counter-rotating celestial brass lotus filigree and geometric astrolabe crown',
    category: 'Classic',
  },
];

export const RADIAL_DARK_CHAMBER_STYLES: ReadonlySet<RadialStyle> = new Set([
  'solar_orbit',
  'galaxy_vortex',
  'supernova',
  'blackhole_lens',
  'synth_prism',
]);

export const CLOCK_BG_FX_OPTIONS: {
  id: BackgroundFx;
  label: string;
  shortLabel: string;
  tagline: string;
}[] = [
  { id: 'aurora', label: 'Bg: Aurora Ribbons', shortLabel: 'Aurora', tagline: 'Drifting cosmic silk aurora curtains' },
  { id: 'solar', label: 'Bg: Solar System', shortLabel: 'Solar', tagline: 'Orbiting planets, Saturn rings, live Earth moon and comet' },
  { id: 'galaxy', label: 'Bg: Spiral Galaxy', shortLabel: 'Galaxy', tagline: 'Perspective-tilted rotating multi-arm cosmic spiral nebula' },
  { id: 'warp', label: 'Bg: Hyperspace Warp', shortLabel: 'Warp', tagline: 'Radial starlight warp streaks accelerating into hyperspace' },
  { id: 'orbital', label: 'Bg: Orbital Halo', shortLabel: 'Orbital', tagline: 'Slowly rotating horological astrolabe rings' },
  { id: 'starfield', label: 'Bg: Starfield Drift', shortLabel: 'Starfield', tagline: 'Twinkling cosmic starlight and meteors' },
  { id: 'waves', label: 'Bg: Plasma Waves', shortLabel: 'Waves', tagline: 'Undulating multi-layer luminous plasma aurora sine ribbons' },
  { id: 'grid', label: 'Bg: Kinetic Grid', shortLabel: 'Grid', tagline: 'Scrolling technical lattice and scanner beam' },
  { id: 'bokeh', label: 'Bg: Ambient Bokeh', shortLabel: 'Bokeh', tagline: 'Floating luminous out-of-focus orbs' },
  { id: 'ripple', label: 'Bg: Sonar Ripple', shortLabel: 'Ripple', tagline: 'Expanding concentric pulse waves' },
  { id: 'none', label: 'Bg: Static (Off)', shortLabel: 'Off', tagline: 'Clean static theme canvas' },
];

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

export const RADIAL_GAUGE_CONFIG = {
  viewBoxSize: 320,
  center: 160,
  hoursRadius: 148,
  minutesRadius: 134,
  secondsRadius: 120,
  innerChamberRadius: 108,
  hoursStrokeWidth: 6,
  minutesStrokeWidth: 5.5,
  secondsStrokeWidth: 5,
  centerSafeInsetPercent: 20,
} as const;

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

export interface FlipClockCardProps {
  value: string;
  label: string;
  isFullscreen: boolean;
  isWideFont: boolean;
  variant?: 'primary' | 'secondary';
  themeConfig: ThemeStyles;
  fontClassName: string;
  animationTextClass: string;
}

export const FlipClockCard: React.FC<FlipClockCardProps> = ({
  value,
  label,
  isFullscreen,
  isWideFont,
  variant = 'primary',
  themeConfig,
  fontClassName,
  animationTextClass,
}) => {
  const [flipState, setFlipState] = useState({
    current: value,
    previous: value,
    flipKey: 0,
    isFlipping: false,
  });

  if (value !== flipState.current) {
    setFlipState({
      current: value,
      previous: flipState.current,
      flipKey: flipState.flipKey + 1,
      isFlipping: true,
    });
  }

  useEffect(() => {
    if (!flipState.isFlipping) return;
    const activeKey = flipState.flipKey;
    const fallbackTimer = setTimeout(() => {
      setFlipState((prev) =>
        prev.flipKey === activeKey && prev.isFlipping
          ? { ...prev, previous: prev.current, isFlipping: false }
          : prev
      );
    }, 620);
    return () => clearTimeout(fallbackTimer);
  }, [flipState.isFlipping, flipState.flipKey]);

  const handleFlipAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName !== 'flip-clock-bottom-settle') return;
    const activeKey = flipState.flipKey;
    setFlipState((prev) =>
      prev.flipKey === activeKey && prev.isFlipping
        ? { ...prev, previous: prev.current, isFlipping: false }
        : prev
    );
  };

  const isSecondary = variant === 'secondary';
  const sizeClass = isSecondary
    ? isFullscreen
      ? 'w-[clamp(3.5rem,min(12.5vw,16.5vh),12.5rem)] h-[clamp(4.8rem,min(17.5vw,22.5vh),17.5rem)]'
      : 'w-16 sm:w-28 md:w-36 h-24 sm:h-36 md:h-44'
    : isFullscreen
      ? 'w-[clamp(4.2rem,min(17vw,22vh),17rem)] h-[clamp(5.8rem,min(24vw,30vh),24rem)]'
      : 'w-20 sm:w-36 md:w-44 h-28 sm:h-44 md:h-52';

  const radiusClass = isSecondary
    ? isFullscreen
      ? 'rounded-2xl sm:rounded-[2rem]'
      : 'rounded-2xl sm:rounded-3xl'
    : isFullscreen
      ? 'rounded-3xl sm:rounded-[2.5rem]'
      : 'rounded-2xl sm:rounded-3xl';

  const textSizeClass = isSecondary
    ? isFullscreen
      ? isWideFont
        ? 'text-[clamp(1.45rem,min(5.8vw,7.8vh),5.8rem)]'
        : 'text-[clamp(1.85rem,min(7.4vw,9.8vh),7.4rem)]'
      : isWideFont
        ? 'text-2xl sm:text-4xl md:text-5xl'
        : 'text-3xl sm:text-6xl md:text-7xl'
    : isFullscreen
      ? isWideFont
        ? 'text-[clamp(1.9rem,min(8.2vw,10.5vh),8.2rem)]'
        : 'text-[clamp(2.4rem,min(10.2vw,13vh),10.2rem)]'
      : isWideFont
        ? 'text-3xl sm:text-5xl md:text-6xl'
        : 'text-4xl sm:text-7xl md:text-8xl';

  const digitClass = `leading-none tabular-nums ${fontClassName} ${textSizeClass}`;
  const isLight = !!themeConfig.isLight;
  const topSheenClass = isLight
    ? 'bg-gradient-to-b from-white/70 to-slate-900/[0.02]'
    : 'bg-gradient-to-b from-white/10 to-transparent';
  const bottomDepthClass = isLight
    ? 'bg-gradient-to-t from-slate-900/[0.07] via-transparent to-slate-900/[0.03]'
    : 'bg-gradient-to-t from-black/25 via-transparent to-black/15';
  const dynamicShadowGradientTop = isLight
    ? 'bg-gradient-to-b from-slate-900/20 to-slate-900/45'
    : 'bg-gradient-to-b from-black/35 to-black/75';
  const dynamicShadowGradientBottom = isLight
    ? 'bg-gradient-to-b from-slate-900/45 to-slate-900/15'
    : 'bg-gradient-to-b from-black/75 to-black/30';

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative select-none ${sizeClass} ${radiusClass} ${isSecondary ? 'opacity-90' : ''} ${animationTextClass}`}
        aria-label={`${label}: ${flipState.current}`}
      >
        <div className={`flip-clock-stage relative w-full h-full ${radiusClass}`}>
          {/* Unified base silhouette for outer card drop shadow */}
          <div
            className={`absolute inset-0 ${radiusClass} ${themeConfig.flipCard} shadow-2xl pointer-events-none z-0`}
          />

          {/* 1. Static Upper Half (NEW value revealed beneath the falling flap) */}
          <div
            className={`flip-card-half-top absolute inset-x-0 top-0 h-1/2 overflow-hidden border-t border-x ${themeConfig.flipCard} !shadow-none z-[1]`}
          >
            <div className="absolute inset-x-0 top-0 h-[200%] flex items-center justify-center">
              <span className={digitClass}>{flipState.current}</span>
            </div>
            <div className={`absolute inset-0 ${topSheenClass} pointer-events-none`} />
            <div
              className={`absolute inset-x-0 bottom-0 h-[1px] ${
                isLight ? 'bg-slate-900/10' : 'bg-black/35'
              } pointer-events-none`}
            />
            {flipState.isFlipping && (
              <div
                key={`top-reveal-${flipState.flipKey}`}
                className={`absolute inset-0 ${dynamicShadowGradientTop} animate-flip-top-reveal-shadow pointer-events-none`}
              />
            )}
          </div>

          {/* 2. Static Lower Half (OLD value until the descending flap lands) */}
          <div
            className={`flip-card-half-bottom absolute inset-x-0 bottom-0 h-1/2 overflow-hidden border-b border-x ${themeConfig.flipCard} !shadow-none z-[1]`}
          >
            <div className="absolute inset-x-0 bottom-0 h-[200%] flex items-center justify-center">
              <span className={digitClass}>
                {flipState.isFlipping ? flipState.previous : flipState.current}
              </span>
            </div>
            <div className={`absolute inset-0 ${bottomDepthClass} pointer-events-none`} />
            <div
              className={`absolute inset-x-0 top-0 h-[1px] ${
                isLight ? 'bg-white/80' : 'bg-white/10'
              } pointer-events-none`}
            />
            {flipState.isFlipping && (
              <div
                key={`bot-cast-${flipState.flipKey}`}
                className={`absolute inset-0 ${dynamicShadowGradientBottom} animate-flip-bottom-cast-shadow pointer-events-none`}
              />
            )}
          </div>

          {/* 3. Flipping Upper Flap (OLD value folding forward 0deg -> -90deg) */}
          {flipState.isFlipping && (
            <div
              key={`top-flap-${flipState.flipKey}`}
              className={`flip-card-half-top animate-flip-top-flap absolute inset-x-0 top-0 h-1/2 overflow-hidden border-t border-x ${themeConfig.flipCard} !shadow-none z-[3]`}
            >
              <div className="absolute inset-x-0 top-0 h-[200%] flex items-center justify-center">
                <span className={digitClass}>{flipState.previous}</span>
              </div>
              <div className={`absolute inset-0 ${topSheenClass} pointer-events-none`} />
              <div
                className={`absolute inset-x-0 bottom-0 h-[1px] ${
                  isLight ? 'bg-slate-900/15' : 'bg-black/45'
                } pointer-events-none`}
              />
              <div
                className={`absolute inset-0 ${dynamicShadowGradientTop} animate-flip-top-flap-shadow pointer-events-none`}
              />
            </div>
          )}

          {/* 4. Flipping Lower Flap (NEW value swinging down 90deg -> 0deg) */}
          {flipState.isFlipping && (
            <div
              key={`bot-flap-${flipState.flipKey}`}
              onAnimationEnd={handleFlipAnimationEnd}
              className={`flip-card-half-bottom animate-flip-bottom-flap absolute inset-x-0 bottom-0 h-1/2 overflow-hidden border-b border-x ${themeConfig.flipCard} !shadow-none z-[4]`}
            >
              <div className="absolute inset-x-0 bottom-0 h-[200%] flex items-center justify-center">
                <span className={digitClass}>{flipState.current}</span>
              </div>
              <div className={`absolute inset-0 ${bottomDepthClass} pointer-events-none`} />
              <div
                className={`absolute inset-x-0 top-0 h-[1px] ${
                  isLight ? 'bg-white/90' : 'bg-white/15'
                } pointer-events-none`}
              />
              <div
                className={`absolute inset-0 ${dynamicShadowGradientBottom} animate-flip-bottom-flap-light pointer-events-none`}
              />
            </div>
          )}

          {/* Mechanical Center Split Seam & Side Hinge Brackets */}
          <div
            className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] z-20 pointer-events-none ${
              isLight
                ? 'bg-slate-900/20 shadow-[0_1px_0_rgba(255,255,255,0.8)]'
                : 'bg-black/60 shadow-[0_1px_0_rgba(255,255,255,0.06)]'
            }`}
          />
          <div
            className={`absolute left-[1px] top-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-3.5 sm:h-4 rounded-r-md z-30 pointer-events-none ${
              isLight
                ? 'bg-slate-400/75 border-y border-r border-slate-500/35 shadow-inner'
                : 'bg-black/70 border-y border-r border-white/10 shadow-inner'
            }`}
          />
          <div
            className={`absolute right-[1px] top-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-3.5 sm:h-4 rounded-l-md z-30 pointer-events-none ${
              isLight
                ? 'bg-slate-400/75 border-y border-l border-slate-500/35 shadow-inner'
                : 'bg-black/70 border-y border-l border-white/10 shadow-inner'
            }`}
          />
        </div>
      </div>

      <span
        className={`uppercase font-extrabold ${themeConfig.subText || 'text-slate-500'} ${
          isFullscreen ? 'text-xs sm:text-base mt-2 sm:mt-3' : 'text-[10px] sm:text-xs mt-2'
        }`}
      >
        {label}
      </span>
    </div>
  );
};

interface AnalogTimeSnapshot {
  nowMs: number;
  hours24: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  dayNum: number;
  weekdayShort: string;
  monthShort: string;
}

const tzSnapshotFormatterCache = new Map<string, Intl.DateTimeFormat>();

const getTimezoneSnapshot = (nowMs: number, timezone: string): AnalogTimeSnapshot => {
  const ms = ((nowMs % 1000) + 1000) % 1000;
  if (timezone && timezone !== 'local') {
    try {
      let formatter = tzSnapshotFormatterCache.get(timezone);
      if (!formatter) {
        formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hourCycle: 'h23',
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        tzSnapshotFormatterCache.set(timezone, formatter);
      }
      const parts = formatter.formatToParts(nowMs);
      const map: Record<string, string> = {};
      for (const p of parts) {
        if (p.type !== 'literal') {
          map[p.type] = p.value;
        }
      }
      return {
        nowMs,
        hours24: Number(map.hour ?? 0) % 24,
        minutes: Number(map.minute ?? 0) % 60,
        seconds: Number(map.second ?? 0) % 60,
        milliseconds: ms,
        dayNum: Number(map.day ?? 1),
        weekdayShort: (map.weekday || 'DAY').slice(0, 3).toUpperCase(),
        monthShort: (map.month || 'JAN').slice(0, 3).toUpperCase(),
      };
    } catch {
      // Fall back to local date snapshot below
    }
  }

  const d = new Date(nowMs);
  return {
    nowMs,
    hours24: d.getHours(),
    minutes: d.getMinutes(),
    seconds: d.getSeconds(),
    milliseconds: ms,
    dayNum: d.getDate(),
    weekdayShort: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3).toUpperCase(),
    monthShort: d.toLocaleDateString('en-US', { month: 'short' }).slice(0, 3).toUpperCase(),
  };
};

const getAnalogSvgFont = (fontStyle: FontStyle, forceSerif = false) => {
  if (forceSerif || fontStyle === 'serif') {
    return {
      fontFamily: "Georgia, 'Times New Roman', serif",
      fontWeight: fontStyle === 'minimal' ? '500' : '700',
      scale: 1,
    };
  }
  switch (fontStyle) {
    case 'mono':
      return {
        fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
        fontWeight: '700',
        scale: 0.92,
      };
    case 'digital':
      return {
        fontFamily: "'Orbitron', 'JetBrains Mono', monospace",
        fontWeight: '700',
        scale: 0.82,
      };
    case 'condensed':
      return {
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: '800',
        scale: 1.04,
      };
    case 'minimal':
      return {
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: '300',
        scale: 0.98,
      };
    case 'sans':
    default:
      return {
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: '700',
        scale: 1,
      };
  }
};

// Known astronomical New Moon reference: 2024-01-11T11:57:00Z
const SYNODIC_MONTH_MS = 29.530588853 * 86400 * 1000;
const NEW_MOON_EPOCH_MS = Date.UTC(2024, 0, 11, 11, 57, 0);

const computeLunarPhaseFraction = (nowMs: number): number => {
  const diff = nowMs - NEW_MOON_EPOCH_MS;
  return (((diff % SYNODIC_MONTH_MS) + SYNODIC_MONTH_MS) % SYNODIC_MONTH_MS) / SYNODIC_MONTH_MS;
};

const BG_STARFIELD_POINTS: { x: number; y: number; r: number; delay: string; dur: string; tone: 'sec' | 'min' | 'hr' }[] = [
  { x: 6, y: 12, r: 1.4, delay: '0s', dur: '3.6s', tone: 'sec' },
  { x: 14, y: 26, r: 1.9, delay: '0.8s', dur: '4.4s', tone: 'min' },
  { x: 22, y: 8, r: 1.1, delay: '1.7s', dur: '3.2s', tone: 'hr' },
  { x: 31, y: 38, r: 1.5, delay: '2.4s', dur: '4.8s', tone: 'sec' },
  { x: 39, y: 16, r: 2.1, delay: '0.3s', dur: '5.2s', tone: 'min' },
  { x: 48, y: 9, r: 1.2, delay: '1.1s', dur: '3.8s', tone: 'sec' },
  { x: 57, y: 24, r: 1.7, delay: '2.9s', dur: '4.1s', tone: 'hr' },
  { x: 66, y: 11, r: 1.3, delay: '0.5s', dur: '3.5s', tone: 'min' },
  { x: 74, y: 33, r: 2.0, delay: '1.9s', dur: '4.6s', tone: 'sec' },
  { x: 83, y: 15, r: 1.4, delay: '2.7s', dur: '3.9s', tone: 'min' },
  { x: 92, y: 22, r: 1.8, delay: '0.9s', dur: '5.0s', tone: 'hr' },
  { x: 9, y: 54, r: 1.6, delay: '1.4s', dur: '4.2s', tone: 'min' },
  { x: 17, y: 72, r: 1.2, delay: '2.1s', dur: '3.7s', tone: 'sec' },
  { x: 26, y: 84, r: 1.9, delay: '0.2s', dur: '4.9s', tone: 'hr' },
  { x: 36, y: 66, r: 1.3, delay: '1.6s', dur: '3.4s', tone: 'min' },
  { x: 44, y: 90, r: 1.7, delay: '2.5s', dur: '4.5s', tone: 'sec' },
  { x: 55, y: 78, r: 1.1, delay: '0.7s', dur: '3.9s', tone: 'hr' },
  { x: 63, y: 61, r: 2.0, delay: '1.8s', dur: '5.1s', tone: 'sec' },
  { x: 72, y: 86, r: 1.5, delay: '2.2s', dur: '4.0s', tone: 'min' },
  { x: 81, y: 68, r: 1.3, delay: '0.4s', dur: '3.6s', tone: 'hr' },
  { x: 89, y: 52, r: 1.8, delay: '1.3s', dur: '4.7s', tone: 'sec' },
  { x: 94, y: 82, r: 1.5, delay: '2.8s', dur: '4.3s', tone: 'min' },
  { x: 11, y: 39, r: 1.1, delay: '3.1s', dur: '4.0s', tone: 'hr' },
  { x: 86, y: 37, r: 1.2, delay: '1.5s', dur: '3.5s', tone: 'sec' },
];

const BG_BOKEH_ORBS: { x: number; y: number; size: number; delay: string; dur: string; tone: 'sec' | 'min' | 'hr' }[] = [
  { x: 12, y: 20, size: 120, delay: '0s', dur: '12s', tone: 'sec' },
  { x: 84, y: 18, size: 150, delay: '-2.5s', dur: '14s', tone: 'hr' },
  { x: 22, y: 76, size: 140, delay: '-5s', dur: '11s', tone: 'min' },
  { x: 76, y: 74, size: 110, delay: '-1.5s', dur: '13s', tone: 'sec' },
  { x: 48, y: 14, size: 95, delay: '-7s', dur: '10s', tone: 'min' },
  { x: 10, y: 50, size: 80, delay: '-3.5s', dur: '15s', tone: 'hr' },
  { x: 90, y: 48, size: 88, delay: '-6s', dur: '12.5s', tone: 'min' },
  { x: 52, y: 86, size: 130, delay: '-4s', dur: '14.5s', tone: 'hr' },
];

// Deterministic PRNG for procedural cosmic starfields and spiral nebula arms (zero Math.random in render)
const makeSeededRng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

// Involute-inspired gear path builder centered at (cx, cy) with tooth 0 peak pointing at 0 deg (+X)
const buildGearPath = (cx: number, cy: number, teeth: number, outerR: number, rootR: number): string => {
  const step = (Math.PI * 2) / teeth;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const base = i * step;
    const a0 = base - step * 0.42;
    const a1 = base - step * 0.22;
    const a2 = base + step * 0.22;
    const a3 = base + step * 0.42;
    const p0x = cx + rootR * Math.cos(a0);
    const p0y = cy + rootR * Math.sin(a0);
    const p1x = cx + outerR * Math.cos(a1);
    const p1y = cy + outerR * Math.sin(a1);
    const p2x = cx + outerR * Math.cos(a2);
    const p2y = cy + outerR * Math.sin(a2);
    const p3x = cx + rootR * Math.cos(a3);
    const p3y = cy + rootR * Math.sin(a3);
    pts.push(
      `${i === 0 ? 'M' : 'L'} ${p0x.toFixed(2)} ${p0y.toFixed(2)} L ${p1x.toFixed(2)} ${p1y.toFixed(2)} L ${p2x.toFixed(2)} ${p2y.toFixed(2)} L ${p3x.toFixed(2)} ${p3y.toFixed(2)}`
    );
  }
  return `${pts.join(' ')} Z`;
};

const buildSpiralPath = (
  cx: number,
  cy: number,
  startDeg: number,
  sweepDeg: number,
  rStart: number,
  rEnd: number,
  steps = 36
): string => {
  const cmds: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = ((startDeg + sweepDeg * t) * Math.PI) / 180;
    const r = rStart + (rEnd - rStart) * Math.pow(t, 1.15);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    cmds.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return cmds.join(' ');
};

// J2000.0 mean heliocentric longitudes (degrees) for real-time Orrery planetary positions
const J2000_EPOCH_MS = Date.UTC(2000, 0, 1, 12, 0, 0);
const normDeg = (deg: number) => ((deg % 360) + 360) % 360;

const computeSolarSystemLongitudes = (nowMs: number) => {
  const d = (nowMs - J2000_EPOCH_MS) / 86400000;
  return {
    mercury: normDeg(252.25 + 4.09233445 * d),
    venus: normDeg(181.98 + 1.60213034 * d),
    earth: normDeg(100.46 + 0.98560912 * d),
    mars: normDeg(355.45 + 0.52403295 * d),
    jupiter: normDeg(34.4 + 0.08309121 * d),
    saturn: normDeg(49.94 + 0.03345965 * d),
  };
};

// Precomputed mathematically meshing 5-wheel Automaton gear train (module m = 2.6, zero overlap)
interface AutomatonGearSpec {
  id: string;
  cx: number;
  cy: number;
  teeth: number;
  rp: number;
  innerR: number;
  hubR: number;
  spokes: number;
  speedDegPerSec: number;
  phaseOffset: number;
  tone: 'gold' | 'steel' | 'bronze' | 'accent' | 'silver';
  path: string;
}

const AUTOMATON_GEARS: AutomatonGearSpec[] = (() => {
  const m = 2.6;
  const halfM = m * 0.5;
  const calcPhase = (parentPhase: number, parentTeeth: number, childTeeth: number, thetaDeg: number) => {
    const u1 = ((thetaDeg - parentPhase) * parentTeeth) / 360;
    return thetaDeg + 180 - (0.5 - u1) * (360 / childTeeth);
  };

  const aCx = 150;
  const aCy = 150;
  const aN = 24;
  const aRp = halfM * aN; // 31.2
  const aPhase = 0;

  const bN = 30;
  const bRp = halfM * bN; // 39.0
  const bTheta = -135;
  const bRad = (bTheta * Math.PI) / 180;
  const bCx = aCx + (aRp + bRp) * Math.cos(bRad);
  const bCy = aCy + (aRp + bRp) * Math.sin(bRad);
  const bPhase = calcPhase(aPhase, aN, bN, bTheta);

  const cN = 18;
  const cRp = halfM * cN; // 23.4
  const cTheta = -32;
  const cRad = (cTheta * Math.PI) / 180;
  const cCx = aCx + (aRp + cRp) * Math.cos(cRad);
  const cCy = aCy + (aRp + cRp) * Math.sin(cRad);
  const cPhase = calcPhase(aPhase, aN, cN, cTheta);

  const dN = 15;
  const dRp = halfM * dN; // 19.5
  const dTheta = 64;
  const dRad = (dTheta * Math.PI) / 180;
  const dCx = cCx + (cRp + dRp) * Math.cos(dRad);
  const dCy = cCy + (cRp + dRp) * Math.sin(dRad);
  const dPhase = calcPhase(cPhase, cN, dN, dTheta);

  const eN = 16;
  const eRp = halfM * eN; // 20.8
  const eTheta = 122;
  const eRad = (eTheta * Math.PI) / 180;
  const eCx = aCx + (aRp + eRp) * Math.cos(eRad);
  const eCy = aCy + (aRp + eRp) * Math.sin(eRad);
  const ePhase = calcPhase(aPhase, aN, eN, eTheta);

  const defs: Omit<AutomatonGearSpec, 'path'>[] = [
    { id: 'barrel', cx: bCx, cy: bCy, teeth: bN, rp: bRp, innerR: 29.5, hubR: 8.5, spokes: 6, speedDegPerSec: -4.8, phaseOffset: bPhase, tone: 'steel' },
    { id: 'third', cx: cCx, cy: cCy, teeth: cN, rp: cRp, innerR: 16.5, hubR: 6, spokes: 4, speedDegPerSec: -8.0, phaseOffset: cPhase, tone: 'bronze' },
    { id: 'escape', cx: dCx, cy: dCy, teeth: dN, rp: dRp, innerR: 13.5, hubR: 5, spokes: 5, speedDegPerSec: 9.6, phaseOffset: dPhase, tone: 'accent' },
    { id: 'winding', cx: eCx, cy: eCy, teeth: eN, rp: eRp, innerR: 14.5, hubR: 5.4, spokes: 4, speedDegPerSec: -9.0, phaseOffset: ePhase, tone: 'silver' },
    { id: 'center', cx: aCx, cy: aCy, teeth: aN, rp: aRp, innerR: 23, hubR: 7.4, spokes: 5, speedDegPerSec: 6.0, phaseOffset: aPhase, tone: 'gold' },
  ];

  return defs.map((g) => ({
    ...g,
    path: buildGearPath(g.cx, g.cy, g.teeth, g.rp + 1.85, g.rp - 2.15),
  }));
})();

const BALANCE_HAIRSPRING_PATH = buildSpiralPath(168, 204, 0, 1260, 3.2, 15.2, 64);

// Precomputed Spiral Galaxy dial arms & star clusters (300x300 viewBox)
const DIAL_GALAXY_ARMS = [
  { main: buildSpiralPath(150, 150, 10, 295, 9, 122, 40), sub: buildSpiralPath(150, 150, 22, 265, 14, 114, 34), tone: 'c1' as const },
  { main: buildSpiralPath(150, 150, 190, 295, 9, 122, 40), sub: buildSpiralPath(150, 150, 202, 265, 14, 114, 34), tone: 'c2' as const },
  { main: buildSpiralPath(150, 150, 100, 250, 14, 108, 34), sub: buildSpiralPath(150, 150, 112, 225, 18, 98, 28), tone: 'c3' as const },
  { main: buildSpiralPath(150, 150, 280, 250, 14, 108, 34), sub: buildSpiralPath(150, 150, 292, 225, 18, 98, 28), tone: 'c1' as const },
];

const DIAL_GALAXY_STARS: { x: number; y: number; r: number; op: number; hue: 'white' | 'gold' | 'c1' | 'c2' | 'pink' }[] = (() => {
  const rng = makeSeededRng(42071);
  const out: { x: number; y: number; r: number; op: number; hue: 'white' | 'gold' | 'c1' | 'c2' | 'pink' }[] = [];
  const armStarts = [10, 190, 100, 280];
  const hues: ('white' | 'gold' | 'c1' | 'c2' | 'pink')[] = ['white', 'white', 'c1', 'c2', 'gold', 'pink'];
  for (let i = 0; i < 84; i++) {
    const arm = armStarts[i % 4];
    const t = Math.pow(rng(), 0.78);
    const sweep = i % 4 < 2 ? 290 : 245;
    const spread = (rng() - 0.5) * (16 + t * 28);
    const angleRad = ((arm + sweep * t + spread) * Math.PI) / 180;
    const rad = 11 + t * 108 + (rng() - 0.5) * 9;
    const x = 150 + rad * Math.cos(angleRad);
    const y = 150 + rad * Math.sin(angleRad);
    out.push({
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      r: Number((0.55 + rng() * 1.35).toFixed(2)),
      op: Number((0.35 + rng() * 0.62).toFixed(2)),
      hue: hues[Math.floor(rng() * hues.length)],
    });
  }
  return out;
})();

const DIAL_DEEP_STARS: { x: number; y: number; r: number; op: number }[] = (() => {
  const rng = makeSeededRng(91827);
  const stars: { x: number; y: number; r: number; op: number }[] = [];
  for (let i = 0; i < 56; i++) {
    const a = rng() * Math.PI * 2;
    const rad = 18 + Math.sqrt(rng()) * 112;
    stars.push({
      x: Number((150 + rad * Math.cos(a)).toFixed(2)),
      y: Number((150 + rad * Math.sin(a)).toFixed(2)),
      r: Number((0.45 + rng() * 0.95).toFixed(2)),
      op: Number((0.25 + rng() * 0.65).toFixed(2)),
    });
  }
  return stars;
})();

// Radial Gauge Studio deterministic helpers & precomputed tables (320x320 viewBox, center 160,160)
const ensureBrightHex = (hex: string | undefined, fallback: string): string => {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return fallback;
  let clean = hex.slice(1);
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length !== 6) return fallback;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return fallback;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  if (lum >= 110) return hex;
  const maxC = Math.max(r, g, b);
  const minC = Math.min(r, g, b);
  if (maxC - minC < 32 || maxC === 0) return fallback;
  const scale = 242 / maxC;
  const nr = Math.min(255, Math.round(r * scale + 28));
  const ng = Math.min(255, Math.round(g * scale + 28));
  const nb = Math.min(255, Math.round(b * scale + 28));
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
};

const RADIAL_GALAXY_ARMS = [
  { main: buildSpiralPath(160, 160, 12, 240, 86, 152, 34), sub: buildSpiralPath(160, 160, 26, 215, 92, 146, 28), tone: 'c1' as const },
  { main: buildSpiralPath(160, 160, 192, 240, 86, 152, 34), sub: buildSpiralPath(160, 160, 206, 215, 92, 146, 28), tone: 'c2' as const },
  { main: buildSpiralPath(160, 160, 102, 200, 94, 144, 28), sub: buildSpiralPath(160, 160, 114, 180, 98, 138, 24), tone: 'c3' as const },
  { main: buildSpiralPath(160, 160, 282, 200, 94, 144, 28), sub: buildSpiralPath(160, 160, 294, 180, 98, 138, 24), tone: 'c1' as const },
];

const RADIAL_GALAXY_STARS: { x: number; y: number; r: number; op: number; hue: 'white' | 'gold' | 'c1' | 'c2' | 'pink' }[] = (() => {
  const rng = makeSeededRng(73109);
  const out: { x: number; y: number; r: number; op: number; hue: 'white' | 'gold' | 'c1' | 'c2' | 'pink' }[] = [];
  const starts = [12, 192, 102, 282];
  const hues: ('white' | 'gold' | 'c1' | 'c2' | 'pink')[] = ['white', 'white', 'c1', 'c2', 'gold', 'pink'];
  for (let i = 0; i < 88; i++) {
    const arm = starts[i % 4];
    const t = Math.pow(rng(), 0.72);
    const sweep = i % 4 < 2 ? 235 : 195;
    const spread = (rng() - 0.5) * (14 + t * 24);
    const angleRad = ((arm + sweep * t + spread) * Math.PI) / 180;
    const rad = 88 + t * 64 + (rng() - 0.5) * 8;
    out.push({
      x: Number((160 + rad * Math.cos(angleRad)).toFixed(2)),
      y: Number((160 + rad * Math.sin(angleRad)).toFixed(2)),
      r: Number((0.6 + rng() * 1.4).toFixed(2)),
      op: Number((0.38 + rng() * 0.6).toFixed(2)),
      hue: hues[Math.floor(rng() * hues.length)],
    });
  }
  return out;
})();

const RADIAL_COSMIC_STARS: { x: number; y: number; r: number; op: number }[] = (() => {
  const rng = makeSeededRng(58241);
  const out: { x: number; y: number; r: number; op: number }[] = [];
  for (let i = 0; i < 64; i++) {
    const a = rng() * Math.PI * 2;
    const rad = 22 + Math.sqrt(rng()) * 130;
    // Keep inner time-chamber dust delicate so digits always read crisply
    const opBase = rad < 94 ? 0.14 + rng() * 0.22 : 0.3 + rng() * 0.55;
    out.push({
      x: Number((160 + rad * Math.cos(a)).toFixed(2)),
      y: Number((160 + rad * Math.sin(a)).toFixed(2)),
      r: Number((0.5 + rng() * 1.05).toFixed(2)),
      op: Number(opBase.toFixed(2)),
    });
  }
  return out;
})();

const RADIAL_ASTEROID_BELT: { x: number; y: number; r: number; op: number }[] = (() => {
  const rng = makeSeededRng(19403);
  const out: { x: number; y: number; r: number; op: number }[] = [];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2 + (rng() - 0.5) * 0.08;
    const rad = 126.1 + (rng() - 0.5) * 2.2;
    out.push({
      x: Number((160 + rad * Math.cos(a)).toFixed(2)),
      y: Number((160 + rad * Math.sin(a)).toFixed(2)),
      r: Number((0.45 + rng() * 0.7).toFixed(2)),
      op: Number((0.28 + rng() * 0.48).toFixed(2)),
    });
  }
  return out;
})();

interface RadialSegmentSpec {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  frac: number;
}

const buildRadialSegmentSpecs = (count: number, rIn: number, rOut: number): RadialSegmentSpec[] => {
  const items: RadialSegmentSpec[] = [];
  for (let i = 0; i < count; i++) {
    const deg = (i / count) * 360 - 90;
    const rad = (deg * Math.PI) / 180;
    items.push({
      x1: Number((160 + rIn * Math.cos(rad)).toFixed(2)),
      y1: Number((160 + rIn * Math.sin(rad)).toFixed(2)),
      x2: Number((160 + rOut * Math.cos(rad)).toFixed(2)),
      y2: Number((160 + rOut * Math.sin(rad)).toFixed(2)),
      frac: (i + 1) / count,
    });
  }
  return items;
};

const RADIAL_LED_24 = buildRadialSegmentSpecs(24, 143.5, 152.5);
const RADIAL_LED_12 = buildRadialSegmentSpecs(12, 143.5, 152.5);
const RADIAL_LED_60_MIN = buildRadialSegmentSpecs(60, 130.5, 137.5);
const RADIAL_LED_60_SEC = buildRadialSegmentSpecs(60, 117.2, 122.8);

const RADIAL_TURBINE_BLADES: string[] = (() => {
  const blades: string[] = [];
  const count = 16;
  for (let i = 0; i < count; i++) {
    const base = (i * 2 * Math.PI) / count;
    const aIn1 = base;
    const aIn2 = base + 0.14;
    const aMid = base + 0.24;
    const aOut1 = base + 0.34;
    const aOut2 = base + 0.44;
    const rIn = 109.5;
    const rMid = 130;
    const rOut = 150.5;
    const p1x = (160 + rIn * Math.cos(aIn1)).toFixed(2);
    const p1y = (160 + rIn * Math.sin(aIn1)).toFixed(2);
    const c1x = (160 + rMid * Math.cos(aMid - 0.06)).toFixed(2);
    const c1y = (160 + rMid * Math.sin(aMid - 0.06)).toFixed(2);
    const p2x = (160 + rOut * Math.cos(aOut1)).toFixed(2);
    const p2y = (160 + rOut * Math.sin(aOut1)).toFixed(2);
    const p3x = (160 + rOut * Math.cos(aOut2)).toFixed(2);
    const p3y = (160 + rOut * Math.sin(aOut2)).toFixed(2);
    const c2x = (160 + rMid * Math.cos(aMid + 0.08)).toFixed(2);
    const c2y = (160 + rMid * Math.sin(aMid + 0.08)).toFixed(2);
    const p4x = (160 + rIn * Math.cos(aIn2)).toFixed(2);
    const p4y = (160 + rIn * Math.sin(aIn2)).toFixed(2);
    blades.push(`M ${p1x} ${p1y} Q ${c1x} ${c1y} ${p2x} ${p2y} L ${p3x} ${p3y} Q ${c2x} ${c2y} ${p4x} ${p4y} Z`);
  }
  return blades;
})();

const RADIAL_MANDALA_PETALS: string[] = (() => {
  const petals: string[] = [];
  const count = 12;
  for (let i = 0; i < count; i++) {
    const a0 = (i * 2 * Math.PI) / count - Math.PI / 2;
    const aL = a0 - 0.22;
    const aR = a0 + 0.22;
    const xBaseL = (160 + 109 * Math.cos(aL)).toFixed(2);
    const yBaseL = (160 + 109 * Math.sin(aL)).toFixed(2);
    const xTip = (160 + 153.5 * Math.cos(a0)).toFixed(2);
    const yTip = (160 + 153.5 * Math.sin(a0)).toFixed(2);
    const xCtrlL = (160 + 132 * Math.cos(a0 - 0.26)).toFixed(2);
    const yCtrlL = (160 + 132 * Math.sin(a0 - 0.26)).toFixed(2);
    const xCtrlR = (160 + 132 * Math.cos(a0 + 0.26)).toFixed(2);
    const yCtrlR = (160 + 132 * Math.sin(a0 + 0.26)).toFixed(2);
    const xBaseR = (160 + 109 * Math.cos(aR)).toFixed(2);
    const yBaseR = (160 + 109 * Math.sin(aR)).toFixed(2);
    petals.push(`M ${xBaseL} ${yBaseL} Q ${xCtrlL} ${yCtrlL} ${xTip} ${yTip} Q ${xCtrlR} ${yCtrlR} ${xBaseR} ${yBaseR}`);
  }
  return petals;
})();

const buildPolarHarmonicPath = (
  cx: number,
  cy: number,
  baseR: number,
  amp: number,
  lobes: number,
  phaseRad: number,
  progressFrac: number,
  steps = 72
): { d: string; tipX: number; tipY: number } => {
  const clamped = Math.min(1, Math.max(0.002, progressFrac));
  const segs = Math.max(4, Math.round(steps * clamped));
  const cmds: string[] = [];
  let lastX = cx;
  let lastY = cy - baseR;
  for (let i = 0; i <= segs; i++) {
    const t = (i / segs) * clamped;
    const theta = -Math.PI / 2 + t * Math.PI * 2;
    const r = baseR + amp * Math.sin(lobes * (t * Math.PI * 2) + phaseRad);
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    lastX = x;
    lastY = y;
    cmds.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  if (clamped >= 0.999) cmds.push('Z');
  return { d: cmds.join(' '), tipX: lastX, tipY: lastY };
};

const buildToroidalHelixData = (
  cx: number,
  cy: number,
  meanR: number,
  amp: number,
  cycles: number,
  phaseRad: number,
  numRungs = 40
) => {
  const steps = 96;
  const pathA: string[] = [];
  const pathB: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const theta = -Math.PI / 2 + t * Math.PI * 2;
    const wave = amp * Math.sin(cycles * (t * Math.PI * 2) + phaseRad);
    const rA = meanR + wave;
    const rB = meanR - wave;
    pathA.push(`${i === 0 ? 'M' : 'L'} ${(cx + rA * Math.cos(theta)).toFixed(2)} ${(cy + rA * Math.sin(theta)).toFixed(2)}`);
    pathB.push(`${i === 0 ? 'M' : 'L'} ${(cx + rB * Math.cos(theta)).toFixed(2)} ${(cy + rB * Math.sin(theta)).toFixed(2)}`);
  }
  pathA.push('Z');
  pathB.push('Z');
  const rungs: { x1: number; y1: number; x2: number; y2: number; frac: number }[] = [];
  for (let i = 0; i < numRungs; i++) {
    const t = i / numRungs;
    const theta = -Math.PI / 2 + t * Math.PI * 2;
    const wave = amp * Math.sin(cycles * (t * Math.PI * 2) + phaseRad);
    const rA = meanR + wave;
    const rB = meanR - wave;
    rungs.push({
      x1: Number((cx + rA * Math.cos(theta)).toFixed(2)),
      y1: Number((cy + rA * Math.sin(theta)).toFixed(2)),
      x2: Number((cx + rB * Math.cos(theta)).toFixed(2)),
      y2: Number((cy + rB * Math.sin(theta)).toFixed(2)),
      frac: (i + 1) / numRungs,
    });
  }
  return { strandA: pathA.join(' '), strandB: pathB.join(' '), rungs };
};

// Precomputed Background Canvas geometry (800x600 viewBox)
const BG_SOLAR_PLANETS: {
  name: string;
  orbitR: number;
  size: number;
  period: string;
  delay: string;
  color: string;
  glow: string;
  hasRings?: boolean;
  hasMoon?: boolean;
  hasBands?: boolean;
}[] = [
  { name: 'mercury', orbitR: 92, size: 3.4, period: '16s', delay: '-3s', color: '#cbd5e1', glow: '#94a3b8' },
  { name: 'venus', orbitR: 128, size: 5.2, period: '26s', delay: '-14s', color: '#fde68a', glow: '#f59e0b' },
  { name: 'earth', orbitR: 168, size: 6.0, period: '38s', delay: '-8s', color: '#38bdf8', glow: '#0ea5e9', hasMoon: true },
  { name: 'mars', orbitR: 212, size: 4.5, period: '56s', delay: '-39s', color: '#fb7185', glow: '#e11d48' },
  { name: 'jupiter', orbitR: 268, size: 9.2, period: '86s', delay: '-22s', color: '#fdba74', glow: '#ea580c', hasBands: true },
  { name: 'saturn', orbitR: 326, size: 7.4, period: '124s', delay: '-76s', color: '#fef08a', glow: '#eab308', hasRings: true },
];

const BG_SOLAR_STARS: { x: number; y: number; r: number; op: number }[] = (() => {
  const rng = makeSeededRng(30319);
  const arr: { x: number; y: number; r: number; op: number }[] = [];
  for (let i = 0; i < 42; i++) {
    arr.push({
      x: Number((rng() * 800).toFixed(1)),
      y: Number((rng() * 600).toFixed(1)),
      r: Number((0.7 + rng() * 1.4).toFixed(2)),
      op: Number((0.25 + rng() * 0.6).toFixed(2)),
    });
  }
  return arr;
})();

const BG_GALAXY_ARMS = [
  { path: buildSpiralPath(400, 300, 0, 320, 18, 360, 44), tone: 'c1' as const, width: 34 },
  { path: buildSpiralPath(400, 300, 180, 320, 18, 360, 44), tone: 'c2' as const, width: 34 },
  { path: buildSpiralPath(400, 300, 90, 275, 24, 315, 38), tone: 'c3' as const, width: 24 },
  { path: buildSpiralPath(400, 300, 270, 275, 24, 315, 38), tone: 'c1' as const, width: 24 },
];

const BG_GALAXY_STARS: { x: number; y: number; r: number; op: number; tone: 'white' | 'c1' | 'c2' | 'c3' }[] = (() => {
  const rng = makeSeededRng(77123);
  const out: { x: number; y: number; r: number; op: number; tone: 'white' | 'c1' | 'c2' | 'c3' }[] = [];
  const arms = [0, 180, 90, 270];
  const tones: ('white' | 'c1' | 'c2' | 'c3')[] = ['white', 'white', 'c1', 'c2', 'c3'];
  for (let i = 0; i < 96; i++) {
    const arm = arms[i % 4];
    const t = Math.pow(rng(), 0.75);
    const sweep = i % 4 < 2 ? 320 : 275;
    const jitter = (rng() - 0.5) * (20 + t * 34);
    const rad = 20 + t * 338 + (rng() - 0.5) * 26;
    const a = ((arm + sweep * t + jitter) * Math.PI) / 180;
    out.push({
      x: Number((400 + rad * Math.cos(a)).toFixed(1)),
      y: Number((300 + rad * Math.sin(a)).toFixed(1)),
      r: Number((0.9 + rng() * 2.2).toFixed(2)),
      op: Number((0.3 + rng() * 0.65).toFixed(2)),
      tone: tones[Math.floor(rng() * tones.length)],
    });
  }
  return out;
})();

const BG_GALAXY_HALO: { x: number; y: number; r: number; op: number }[] = (() => {
  const rng = makeSeededRng(55821);
  const out: { x: number; y: number; r: number; op: number }[] = [];
  for (let i = 0; i < 36; i++) {
    const a = rng() * Math.PI * 2;
    const rad = 110 + rng() * 270;
    out.push({
      x: Number((400 + rad * Math.cos(a)).toFixed(1)),
      y: Number((300 + rad * Math.sin(a)).toFixed(1)),
      r: Number((0.8 + rng() * 1.6).toFixed(2)),
      op: Number((0.22 + rng() * 0.55).toFixed(2)),
    });
  }
  return out;
})();

const BG_WARP_STREAKS: { angle: number; length: number; thickness: number; dur: string; delay: string; tone: 'sec' | 'min' | 'hr' }[] = (() => {
  const rng = makeSeededRng(61429);
  const tones: ('sec' | 'min' | 'hr')[] = ['sec', 'min', 'hr'];
  const arr: { angle: number; length: number; thickness: number; dur: string; delay: string; tone: 'sec' | 'min' | 'hr' }[] = [];
  for (let i = 0; i < 40; i++) {
    const angle = Number(((i * 9 + (rng() - 0.5) * 6 + 360) % 360).toFixed(1));
    const durVal = 2.1 + rng() * 2.6;
    const delayVal = -(rng() * durVal);
    arr.push({
      angle,
      length: Math.round(52 + rng() * 76),
      thickness: Number((1.1 + rng() * 1.6).toFixed(1)),
      dur: `${durVal.toFixed(2)}s`,
      delay: `${delayVal.toFixed(2)}s`,
      tone: tones[i % 3],
    });
  }
  return arr;
})();

export const ClockBackgroundLayer: React.FC<{ bgFx: BackgroundFx; themeConfig: ThemeStyles }> = React.memo(({
  bgFx,
  themeConfig,
}) => {
  const bgUid = useId().replace(/:/g, '');
  if (bgFx === 'none') return null;

  const isLight = Boolean(themeConfig.isLight);
  const c1 = themeConfig.handSec;
  const c2 = themeConfig.handMin;
  const c3 = themeConfig.handHr;
  const pickTone = (tone: 'sec' | 'min' | 'hr') => (tone === 'sec' ? c1 : tone === 'min' ? c2 : c3);

  return (
    <div
      data-testid="clock-bg-layer"
      data-bg-fx-active={bgFx}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {/* 1. AURORA RIBBONS */}
      {bgFx === 'aurora' && (
        <>
          <div
            className="animate-bg-aurora-a absolute -top-1/3 -left-1/4 w-[82%] h-[82%] rounded-full blur-3xl"
            style={{
              background: `radial-gradient(ellipse at center, ${c1} 0%, ${c2} 42%, transparent 74%)`,
              opacity: isLight ? 0.22 : 0.24,
            }}
          />
          <div
            className="animate-bg-aurora-b absolute -bottom-1/3 -right-1/4 w-[85%] h-[85%] rounded-full blur-3xl"
            style={{
              background: `radial-gradient(ellipse at center, ${c3} 0%, ${c1} 45%, transparent 75%)`,
              opacity: isLight ? 0.18 : 0.22,
            }}
          />
          <div
            className="animate-bg-aurora-a absolute top-1/4 left-1/4 w-[58%] h-[58%] rounded-full blur-2xl"
            style={{
              animationDuration: '21s',
              background: `radial-gradient(circle, ${c2} 0%, transparent 70%)`,
              opacity: isLight ? 0.12 : 0.14,
            }}
          />
        </>
      )}

      {/* 2. SOLAR SYSTEM ORRERY CANVAS */}
      {bgFx === 'solar' && (
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
          <defs>
            <radialGradient id={`${bgUid}-solar-corona`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity={isLight ? '0.42' : '0.45'} />
              <stop offset="28%" stopColor="#f59e0b" stopOpacity={isLight ? '0.2' : '0.24'} />
              <stop offset="58%" stopColor={c1} stopOpacity={isLight ? '0.08' : '0.11'} />
              <stop offset="100%" stopColor={c1} stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`${bgUid}-comet-tail`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0" />
              <stop offset="65%" stopColor="#bae6fd" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Distant Deep-Space Star Flecks */}
          {BG_SOLAR_STARS.map((s, idx) => (
            <circle
              key={idx}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={isLight ? c3 : '#ffffff'}
              fillOpacity={isLight ? s.op * 0.45 : s.op * 0.72}
            />
          ))}

          {/* Pulsing Central Solar Corona Bloom Behind the Clock */}
          <circle cx="400" cy="300" r="210" fill={`url(#${bgUid}-solar-corona)`} className="animate-bg-solar-pulse" />

          {/* Concentric Planetary Orbit Tracks + Main Asteroid Belt */}
          {BG_SOLAR_PLANETS.map((p) => (
            <circle
              key={p.name}
              cx="400"
              cy="300"
              r={p.orbitR}
              fill="none"
              stroke={isLight ? c3 : '#ffffff'}
              strokeOpacity={isLight ? '0.16' : '0.14'}
              strokeWidth="1"
              strokeDasharray={p.name === 'saturn' ? '6 8' : undefined}
            />
          ))}
          <circle
            cx="400"
            cy="300"
            r="240"
            fill="none"
            stroke={c2}
            strokeOpacity={isLight ? '0.24' : '0.22'}
            strokeWidth="2.4"
            strokeDasharray="1.5 9.5"
            className="animate-bg-orbit-origin"
            style={{ animationDuration: '140s' }}
          />

          {/* Independently Orbiting Planets (view-box origin 400,300 prevents wobble) */}
          {BG_SOLAR_PLANETS.map((p) => {
            const px = 400 + p.orbitR;
            const py = 300;
            return (
              <g
                key={p.name}
                className="animate-bg-orbit-origin"
                style={{ animationDuration: p.period, animationDelay: p.delay }}
              >
                <circle cx={px} cy={py} r={p.size * 2.1} fill={p.glow} fillOpacity={isLight ? '0.18' : '0.26'} />
                {p.hasRings && (
                  <ellipse
                    cx={px}
                    cy={py}
                    rx={p.size * 2.35}
                    ry={p.size * 0.78}
                    transform={`rotate(-22 ${px} ${py})`}
                    fill="none"
                    stroke="#fde68a"
                    strokeWidth="2.2"
                    strokeOpacity="0.82"
                  />
                )}
                <circle cx={px} cy={py} r={p.size} fill={p.color} stroke="#ffffff" strokeOpacity="0.45" strokeWidth="0.7" />
                {p.hasBands && (
                  <>
                    <line x1={px - p.size * 0.85} y1={py - 2.4} x2={px + p.size * 0.85} y2={py - 2.4} stroke="#c2410c" strokeWidth="1.4" strokeOpacity="0.6" />
                    <line x1={px - p.size * 0.9} y1={py + 2.1} x2={px + p.size * 0.9} y2={py + 2.1} stroke="#9a3412" strokeWidth="1.2" strokeOpacity="0.55" />
                  </>
                )}
                {p.hasMoon && (
                  <g
                    className="animate-bg-orbit-origin"
                    style={{
                      transformBox: 'view-box',
                      transformOrigin: `${px}px ${py}px`,
                      animationDuration: '6s',
                    }}
                  >
                    <circle cx={px} cy={py} r={14} fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="0.6" />
                    <circle cx={px + 14} cy={py} r={2.1} fill="#e2e8f0" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Sweeping Outer Icy Comet */}
          <g className="animate-bg-orbit-origin" style={{ animationDuration: '24s', animationDelay: '-9s' }}>
            <path
              d="M 655 152 A 295 295 0 0 1 695 300"
              fill="none"
              stroke={`url(#${bgUid}-comet-tail)`}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <circle cx="695" cy="300" r="3.4" fill="#ffffff" />
            <circle cx="695" cy="300" r="7.5" fill="#7dd3fc" fillOpacity="0.35" />
          </g>
        </svg>
      )}

      {/* 3. SPIRAL GALAXY CANVAS */}
      {bgFx === 'galaxy' && (
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
          <defs>
            <radialGradient id={`${bgUid}-gal-core`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffbeb" stopOpacity={isLight ? '0.5' : '0.72'} />
              <stop offset="18%" stopColor={c1} stopOpacity={isLight ? '0.32' : '0.46'} />
              <stop offset="48%" stopColor={c2} stopOpacity={isLight ? '0.16' : '0.26'} />
              <stop offset="78%" stopColor={c3} stopOpacity={isLight ? '0.07' : '0.11'} />
              <stop offset="100%" stopColor={c3} stopOpacity="0" />
            </radialGradient>
            <filter id={`${bgUid}-nebula-blur`} x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="13" />
            </filter>
          </defs>

          {/* Perspective-Tilted Galactic Disk */}
          <g transform="translate(400 300) scale(1 0.68) rotate(-14) translate(-400 -300)">
            <circle cx="400" cy="300" r="350" fill={`url(#${bgUid}-gal-core)`} />

            {/* Rotating 4-Arm Logarithmic Spiral Nebula & Arm Star Clusters */}
            <g className="animate-bg-galaxy-spin">
              {/* Soft Feathered Gaseous Nebula Arms */}
              <g filter={`url(#${bgUid}-nebula-blur)`}>
                {BG_GALAXY_ARMS.map((arm, idx) => {
                  const armCol = arm.tone === 'c1' ? c1 : arm.tone === 'c2' ? c2 : c3;
                  return (
                    <g key={idx}>
                      <path
                        d={arm.path}
                        fill="none"
                        stroke={armCol}
                        strokeWidth={arm.width * 1.45}
                        strokeOpacity={isLight ? '0.22' : '0.26'}
                        strokeLinecap="round"
                      />
                      <path
                        d={arm.path}
                        fill="none"
                        stroke="#f472b6"
                        strokeWidth={arm.width * 0.52}
                        strokeOpacity={isLight ? '0.14' : '0.18'}
                        strokeLinecap="round"
                      />
                      <path
                        d={arm.path}
                        fill="none"
                        stroke="#fffbeb"
                        strokeWidth={arm.width * 0.24}
                        strokeOpacity={isLight ? '0.18' : '0.26'}
                        strokeLinecap="round"
                      />
                    </g>
                  );
                })}
              </g>

              {BG_GALAXY_STARS.map((st, idx) => (
                <circle
                  key={idx}
                  cx={st.x}
                  cy={st.y}
                  r={st.r}
                  fill={st.tone === 'white' ? (isLight ? c3 : '#ffffff') : st.tone === 'c1' ? c1 : st.tone === 'c2' ? c2 : c3}
                  fillOpacity={isLight ? st.op * 0.55 : st.op * 0.85}
                />
              ))}
            </g>

            {/* Counter-Rotating Outer Star Halo for Multi-Layer Depth */}
            <g className="animate-bg-galaxy-counter">
              {BG_GALAXY_HALO.map((st, idx) => (
                <circle
                  key={idx}
                  cx={st.x}
                  cy={st.y}
                  r={st.r}
                  fill={isLight ? c2 : '#e0f2fe'}
                  fillOpacity={isLight ? st.op * 0.45 : st.op * 0.65}
                />
              ))}
            </g>
          </g>
        </svg>
      )}

      {/* 4. HYPERSPACE WARP CANVAS */}
      {bgFx === 'warp' && (
        <div className="absolute inset-0">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[52%] h-[52%] rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${c1} 0%, ${c2} 45%, transparent 74%)`,
              opacity: isLight ? 0.16 : 0.22,
            }}
          />
          {BG_WARP_STREAKS.map((st, idx) => {
            const col = pickTone(st.tone);
            return (
              <span
                key={idx}
                className="animate-bg-warp-streak absolute left-1/2 top-1/2 rounded-full"
                style={
                  {
                    '--warp-angle': `${st.angle}deg`,
                    width: `${st.length}px`,
                    height: `${st.thickness}px`,
                    marginTop: `-${st.thickness / 2}px`,
                    background: `linear-gradient(90deg, transparent 0%, ${col} 55%, ${isLight ? col : '#ffffff'} 100%)`,
                    opacity: isLight ? 0.62 : 0.9,
                    animationDuration: st.dur,
                    animationDelay: st.delay,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </div>
      )}

      {/* 5. ORBITAL HALO */}
      {bgFx === 'orbital' && (
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
          <defs>
            <radialGradient id={`${bgUid}-orbital-core`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={c1} stopOpacity={isLight ? '0.16' : '0.18'} />
              <stop offset="55%" stopColor={c3} stopOpacity={isLight ? '0.05' : '0.07'} />
              <stop offset="100%" stopColor={c1} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="400" cy="300" r="320" fill={`url(#${bgUid}-orbital-core)`} />
          <g className="animate-bg-spin-cw">
            <circle
              cx="400"
              cy="300"
              r="185"
              fill="none"
              stroke={c1}
              strokeOpacity={isLight ? '0.28' : '0.3'}
              strokeWidth="1.2"
              strokeDasharray="10 14"
            />
            <circle cx="585" cy="300" r="4" fill={c1} fillOpacity="0.85" />
            <circle cx="215" cy="300" r="2.6" fill={c2} fillOpacity="0.7" />
          </g>
          <g className="animate-bg-spin-ccw">
            <circle
              cx="400"
              cy="300"
              r="245"
              fill="none"
              stroke={c2}
              strokeOpacity={isLight ? '0.24' : '0.24'}
              strokeWidth="1.1"
              strokeDasharray="3 12 22 12"
            />
            <circle cx="400" cy="55" r="4.5" fill={c2} fillOpacity="0.8" />
            <circle cx="400" cy="545" r="3" fill={c3} fillOpacity="0.7" />
          </g>
          <g className="animate-bg-spin-ultra">
            <circle
              cx="400"
              cy="300"
              r="312"
              fill="none"
              stroke={c3}
              strokeOpacity={isLight ? '0.18' : '0.2'}
              strokeWidth="1.3"
              strokeDasharray="2 18"
            />
            <circle cx="621" cy="79" r="3.8" fill={c3} fillOpacity="0.78" />
          </g>
        </svg>
      )}

      {/* 6. STARFIELD DRIFT */}
      {bgFx === 'starfield' && (
        <>
          <div className="animate-bg-drift-layer absolute inset-0">
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
              {BG_STARFIELD_POINTS.map((st, idx) => (
                <circle
                  key={idx}
                  cx={st.x}
                  cy={st.y}
                  r={st.r * 0.24}
                  fill={isLight ? pickTone(st.tone) : '#ffffff'}
                  fillOpacity={isLight ? '0.6' : '0.9'}
                  className="animate-bg-star-twinkle"
                  style={{ animationDelay: st.delay, animationDuration: st.dur }}
                />
              ))}
            </svg>
          </div>
          <div
            className="animate-bg-shooting-star absolute top-[14%] left-[12%] w-28 h-[1.5px] rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${c1}, #ffffff)`,
              opacity: isLight ? 0.55 : 0.85,
            }}
          />
          <div
            className="animate-bg-shooting-star absolute top-[48%] left-[38%] w-24 h-[1.5px] rounded-full"
            style={{
              animationDelay: '4.5s',
              background: `linear-gradient(90deg, transparent, ${c2}, #ffffff)`,
              opacity: isLight ? 0.45 : 0.75,
            }}
          />
        </>
      )}

      {/* 7. PLASMA WAVES */}
      {bgFx === 'waves' && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-bg-wave-drift absolute bottom-0 left-0 w-[200%] h-[58%]" style={{ animationDuration: '24s' }}>
            <svg viewBox="0 0 1600 320" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id={`${bgUid}-wave-a`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={c3} stopOpacity={isLight ? '0.24' : '0.32'} />
                  <stop offset="100%" stopColor={c3} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,120 C200,40 400,200 600,120 C700,80 750,120 800,120 C1000,40 1200,200 1400,120 C1500,80 1550,120 1600,120 L1600,320 L0,320 Z"
                fill={`url(#${bgUid}-wave-a)`}
              />
              <path
                d="M0,120 C200,40 400,200 600,120 C700,80 750,120 800,120 C1000,40 1200,200 1400,120 C1500,80 1550,120 1600,120"
                fill="none"
                stroke={c3}
                strokeWidth="2"
                strokeOpacity={isLight ? '0.38' : '0.45'}
              />
            </svg>
          </div>

          <div className="animate-bg-wave-drift-rev absolute bottom-0 left-0 w-[200%] h-[46%]" style={{ animationDuration: '18s' }}>
            <svg viewBox="0 0 1600 320" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id={`${bgUid}-wave-b`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={c2} stopOpacity={isLight ? '0.26' : '0.34'} />
                  <stop offset="100%" stopColor={c2} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,145 C200,225 400,65 600,145 C700,185 750,145 800,145 C1000,225 1200,65 1400,145 C1500,185 1550,145 1600,145 L1600,320 L0,320 Z"
                fill={`url(#${bgUid}-wave-b)`}
              />
              <path
                d="M0,145 C200,225 400,65 600,145 C700,185 750,145 800,145 C1000,225 1200,65 1400,145 C1500,185 1550,145 1600,145"
                fill="none"
                stroke={c2}
                strokeWidth="2.2"
                strokeOpacity={isLight ? '0.42' : '0.52'}
              />
            </svg>
          </div>

          <div className="animate-bg-wave-drift absolute bottom-0 left-0 w-[200%] h-[34%]" style={{ animationDuration: '13s' }}>
            <svg viewBox="0 0 1600 320" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id={`${bgUid}-wave-c`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={c1} stopOpacity={isLight ? '0.3' : '0.38'} />
                  <stop offset="100%" stopColor={c1} stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path
                d="M0,150 C200,75 400,225 600,150 C700,112 750,150 800,150 C1000,75 1200,225 1400,150 C1500,112 1550,150 1600,150 L1600,320 L0,320 Z"
                fill={`url(#${bgUid}-wave-c)`}
              />
              <path
                d="M0,150 C200,75 400,225 600,150 C700,112 750,150 800,150 C1000,75 1200,225 1400,150 C1500,112 1550,150 1600,150"
                fill="none"
                stroke={c1}
                strokeWidth="2.4"
                strokeOpacity={isLight ? '0.5' : '0.62'}
              />
            </svg>
          </div>
        </div>
      )}

      {/* 8. KINETIC GRID */}
      {bgFx === 'grid' && (
        <>
          <div
            className="animate-bg-grid-scroll absolute -inset-x-0 -top-12 -bottom-12"
            style={{
              opacity: isLight ? 0.16 : 0.22,
              backgroundSize: '44px 44px',
              backgroundImage: `linear-gradient(to right, ${c1} 1px, transparent 1px), linear-gradient(to bottom, ${c1} 1px, transparent 1px)`,
            }}
          />
          <div
            className="animate-bg-scanline absolute inset-x-0 top-0 h-20"
            style={{
              background: `linear-gradient(to bottom, transparent, ${c1}26, ${c2}18, transparent)`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, transparent 28%, ${isLight ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'} 100%)`,
            }}
          />
        </>
      )}

      {/* 9. AMBIENT BOKEH */}
      {bgFx === 'bokeh' && (
        <>
          {BG_BOKEH_ORBS.map((orb, idx) => (
            <div
              key={idx}
              className="animate-bg-bokeh-float absolute rounded-full blur-xl"
              style={{
                left: `${orb.x}%`,
                top: `${orb.y}%`,
                width: `${orb.size}px`,
                height: `${orb.size}px`,
                marginLeft: `-${orb.size / 2}px`,
                marginTop: `-${orb.size / 2}px`,
                background: `radial-gradient(circle, ${pickTone(orb.tone)} 0%, transparent 72%)`,
                opacity: isLight ? 0.24 : 0.26,
                animationDelay: orb.delay,
                animationDuration: orb.dur,
              }}
            />
          ))}
        </>
      )}

      {/* 10. SONAR RIPPLE */}
      {bgFx === 'ripple' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {[0, 1.5, 3, 4.5].map((delaySec, idx) => (
            <span
              key={idx}
              className="animate-bg-ripple absolute w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] rounded-full border-2"
              style={{
                borderColor: idx % 2 === 0 ? c1 : c2,
                animationDelay: `-${delaySec}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export const AnalogStyleGlyph: React.FC<{ styleId: AnalogStyle }> = ({ styleId }) => {
  return (
    <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
      <circle cx="10" cy="10" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.85" />
      {styleId === 'chronometer' && (
        <>
          <circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.45" />
          <line x1="10" y1="10" x2="10" y2="5.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="10" x2="13.8" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}
      {styleId === 'bauhaus' && (
        <>
          <line x1="10" y1="2.8" x2="10" y2="5.5" stroke="currentColor" strokeWidth="1.8" />
          <line x1="10" y1="10" x2="14.5" y2="6.5" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="14.5" cy="6.5" r="1.7" fill="currentColor" />
        </>
      )}
      {styleId === 'diver' && (
        <>
          <circle cx="10" cy="10" r="6.8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeOpacity="0.3" />
          <polygon points="10,4.8 8.3,2.2 11.7,2.2" fill="currentColor" />
          <line x1="10" y1="10" x2="13.5" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {styleId === 'roman' && (
        <>
          <circle cx="10" cy="10" r="4.5" fill="none" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5" />
          <line x1="10" y1="10" x2="10" y2="5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="10" cy="6.8" r="1.4" fill="none" stroke="currentColor" strokeWidth="1" />
        </>
      )}
      {styleId === 'pilot' && (
        <>
          <polygon points="10,3.2 8.2,6.2 11.8,6.2" fill="currentColor" />
          <circle cx="10" cy="13.8" r="2.1" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="10" y1="10" x2="13.8" y2="10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </>
      )}
      {styleId === 'atelier' && (
        <>
          <circle cx="10" cy="4.8" r="1.8" fill="currentColor" />
          <line x1="10" y1="10" x2="13.2" y2="12.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="10" y1="10" x2="7.2" y2="7.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </>
      )}
      {styleId === 'telemetry' && (
        <>
          <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.45" strokeDasharray="1.5 1.5" />
          <line x1="10" y1="3" x2="10" y2="17" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.45" strokeDasharray="1.5 1.5" />
          <path d="M10,10 L10,3.5 A6.5,6.5 0 0 1 15.6,6.8 Z" fill="currentColor" fillOpacity="0.35" />
        </>
      )}
      {styleId === 'california' && (
        <>
          <polygon points="10,5.2 8.4,3 11.6,3" fill="currentColor" />
          <line x1="3.4" y1="10" x2="5.6" y2="10" stroke="currentColor" strokeWidth="1.4" />
          <line x1="14.4" y1="10" x2="16.6" y2="10" stroke="currentColor" strokeWidth="1.4" />
          <line x1="10" y1="10" x2="13.2" y2="7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </>
      )}
      {styleId === 'tourbillon' && (
        <>
          <circle cx="10" cy="13.8" r="2.7" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <line x1="10" y1="11.1" x2="10" y2="16.5" stroke="currentColor" strokeWidth="0.9" />
          <line x1="7.3" y1="13.8" x2="12.7" y2="13.8" stroke="currentColor" strokeWidth="0.9" />
          <line x1="10" y1="10" x2="13.4" y2="6.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </>
      )}
      {styleId === 'celestial' && (
        <>
          <path d="M11.6,7.2 A3.6,3.6 0 1,0 13.8,12.5 A2.8,2.8 0 1,1 11.6,7.2 Z" fill="currentColor" />
          <circle cx="14.2" cy="6.5" r="0.8" fill="currentColor" />
          <circle cx="6.2" cy="6.8" r="0.7" fill="currentColor" />
        </>
      )}
      {styleId === 'chronograph' && (
        <>
          <circle cx="6.4" cy="10" r="2" fill="none" stroke="currentColor" strokeWidth="0.95" />
          <circle cx="13.6" cy="10" r="2" fill="none" stroke="currentColor" strokeWidth="0.95" />
          <circle cx="10" cy="13.6" r="2" fill="none" stroke="currentColor" strokeWidth="0.95" />
          <line x1="10" y1="10" x2="12.2" y2="5.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </>
      )}
      {styleId === 'artdeco' && (
        <>
          <rect x="6" y="6" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
          <polygon points="10,4 11.3,10 10,11 8.7,10" fill="currentColor" />
          <line x1="10" y1="10" x2="14" y2="10" stroke="currentColor" strokeWidth="1.2" />
        </>
      )}
      {styleId === 'orbital' && (
        <>
          <circle cx="10" cy="10" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.1" strokeDasharray="16 6" />
          <circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="1.1" strokeDasharray="9 5" />
          <circle cx="14.5" cy="7" r="1.3" fill="currentColor" />
        </>
      )}
      {styleId === 'kintsugi' && (
        <>
          <path d="M3,12.5 Q9,10.5 17,12" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <line x1="10" y1="10" x2="13.6" y2="6.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="10" y1="10" x2="7.2" y2="8.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </>
      )}
      {styleId === 'orrery' && (
        <>
          <circle cx="10" cy="10" r="2.2" fill="currentColor" />
          <circle cx="10" cy="10" r="4.8" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.65" />
          <circle cx="14.8" cy="10" r="1.2" fill="currentColor" />
          <circle cx="7.4" cy="5.8" r="1" fill="currentColor" />
        </>
      )}
      {styleId === 'galaxy' && (
        <>
          <circle cx="10" cy="10" r="1.6" fill="currentColor" />
          <path d="M10,10 C12.5,7 15.2,8.5 14.4,12.2" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M10,10 C7.5,13 4.8,11.5 5.6,7.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}
      {styleId === 'astrolabe' && (
        <>
          <circle cx="10" cy="8.8" r="4.6" fill="none" stroke="currentColor" strokeWidth="1" />
          <line x1="10" y1="3" x2="10" y2="17" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.55" />
          <line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.55" />
        </>
      )}
      {styleId === 'blackhole' && (
        <>
          <circle cx="10" cy="10" r="3" fill="currentColor" />
          <ellipse cx="10" cy="10" rx="6.8" ry="2.2" transform="rotate(-18 10 10)" fill="none" stroke="currentColor" strokeWidth="1.25" />
        </>
      )}
      {styleId === 'gears' && (
        <>
          <circle cx="8.2" cy="8.5" r="2.9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.6 1" />
          <circle cx="12.8" cy="12.2" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 0.9" />
          <circle cx="8.2" cy="8.5" r="0.9" fill="currentColor" />
        </>
      )}
      {styleId === 'cyberwave' && (
        <>
          <path d="M5.5,10.5 A4.5,4.5 0 0 1 14.5,10.5 Z" fill="currentColor" />
          <line x1="3.4" y1="12.2" x2="16.6" y2="12.2" stroke="currentColor" strokeWidth="1" />
          <line x1="5" y1="14.4" x2="15" y2="14.4" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.7" />
        </>
      )}
    </svg>
  );
};

interface AnalogDialFaceProps {
  uid: string;
  styleId: AnalogStyle;
  themeConfig: ThemeStyles;
  fontStyle: FontStyle;
  is24Hour: boolean;
  showDate: boolean;
  dayProgress: number;
  ampm: string;
  dayNum: number;
  weekdayShort: string;
  monthShort: string;
  timezoneLabel: string;
  lunarPhase: number;
}

const AnalogDialFace: React.FC<AnalogDialFaceProps> = React.memo(({
  uid,
  styleId,
  themeConfig,
  fontStyle,
  is24Hour,
  showDate,
  dayProgress,
  ampm,
  dayNum,
  weekdayShort,
  monthShort,
  timezoneLabel,
  lunarPhase,
}) => {
  const isLight = Boolean(themeConfig.isLight);
  const dialBase = themeConfig.dialBg;
  const borderAccent = themeConfig.dialBorder;
  const secColor = themeConfig.handSec;
  const majorTick = themeConfig.dialTickMajor || (isLight ? '#0f172a' : 'rgba(255,255,255,0.92)');
  const minorTick = themeConfig.dialTickMinor || (isLight ? 'rgba(15,23,42,0.34)' : 'rgba(255,255,255,0.28)');
  const numColor = themeConfig.dialNumColor || (isLight ? '#0f172a' : 'rgba(248,250,252,0.92)');
  const hairline = isLight ? 'rgba(15,23,42,0.12)' : 'rgba(255,255,255,0.12)';
  const subtleInk = isLight ? 'rgba(15,23,42,0.58)' : 'rgba(255,255,255,0.56)';
  const recessedBg = isLight ? 'rgba(15,23,42,0.06)' : 'rgba(0,0,0,0.42)';
  const fontMeta = getAnalogSvgFont(fontStyle, styleId === 'roman');
  const dayStr = dayNum.toString().padStart(2, '0');

  // Diver dark ceramic bezel ink stays bright white for crisp sports bezel readability
  const diverBezelBg = isLight ? '#1e293b' : '#090d16';
  const diverBezelInk = '#f8fafc';

  // Pilot 6 o'clock day-reserve sub-dial coordinates (center 150, 204, r=24)
  const pilotSubCx = 150;
  const pilotSubCy = 204;
  const pilotSubR = 17.5;
  const pilotArcCircumference = 2 * Math.PI * pilotSubR;
  const pilotArcSpan = pilotArcCircumference * 0.75; // 270 degree gauge
  const pilotFilledSpan = (Math.min(100, Math.max(0, dayProgress)) / 100) * pilotArcSpan;

  return (
    <g>
      {/* Dial Outer Base Circle */}
      <circle
        cx="150"
        cy="150"
        r="143"
        fill={dialBase}
        stroke={borderAccent}
        strokeWidth={styleId === 'atelier' ? '1.8' : styleId === 'telemetry' ? '1.5' : '3.5'}
        strokeOpacity={styleId === 'atelier' ? '0.55' : styleId === 'telemetry' ? '0.35' : '0.55'}
      />

      {/* Recessed Sunburst Depth Sheen Overlay */}
      <circle cx="150" cy="150" r="141.5" fill={`url(#${uid}-dial-depth)`} pointerEvents="none" />

      {/* STYLE 1: CHRONOMETER */}
      {styleId === 'chronometer' && (
        <g>
          <circle cx="150" cy="150" r="137" fill="none" stroke={hairline} strokeWidth="1" />
          <circle cx="150" cy="150" r="131" fill="none" stroke={hairline} strokeWidth="0.9" />
          <circle cx="150" cy="150" r="122" fill="none" stroke={hairline} strokeWidth="0.9" />

          {/* 60 Railway Minute Rungs */}
          {[...Array(60)].map((_, i) => {
            const isHour = i % 5 === 0;
            const isQuad = i % 15 === 0;
            return (
              <line
                key={i}
                x1="150"
                y1="19"
                x2="150"
                y2="28"
                stroke={isQuad ? borderAccent : isHour ? majorTick : minorTick}
                strokeWidth={isQuad ? '2.5' : isHour ? '1.9' : '0.95'}
                transform={`rotate(${i * 6} 150 150)`}
              />
            );
          })}

          {/* Applied Metallic Hour Batons */}
          {[...Array(12)].map((_, idx) => {
            if (showDate && idx === 3) return null;
            if (idx === 0) {
              return (
                <g key={idx}>
                  <rect x="146.8" y="30.5" width="2.4" height="10" rx="0.8" fill={majorTick} />
                  <rect x="150.8" y="30.5" width="2.4" height="10" rx="0.8" fill={majorTick} />
                </g>
              );
            }
            return (
              <rect
                key={idx}
                x={idx % 3 === 0 ? '148' : '148.7'}
                y="30.5"
                width={idx % 3 === 0 ? '4' : '2.6'}
                height={idx % 3 === 0 ? '10.5' : '8.5'}
                rx="1"
                fill={idx % 3 === 0 ? borderAccent : majorTick}
                fillOpacity={idx % 3 === 0 ? '0.95' : '0.8'}
                transform={`rotate(${idx * 30} 150 150)`}
              />
            );
          })}

          {/* Crisp Hour Numerals (3 replaced cleanly by date aperture when showDate) */}
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, idx) => {
            if (showDate && num === 3) return null;
            const rad = ((idx * 30 - 90) * Math.PI) / 180;
            const r = 95;
            return (
              <text
                key={num}
                x={150 + r * Math.cos(rad)}
                y={150 + r * Math.sin(rad)}
                textAnchor="middle"
                dominantBaseline="central"
                fill={numColor}
                fontSize={13.5 * fontMeta.scale}
                fontWeight={fontMeta.fontWeight}
                fontFamily={fontMeta.fontFamily}
              >
                {num}
              </text>
            );
          })}

          {/* Framed 3 o'clock Date Window */}
          {showDate && (
            <g>
              <rect
                x="231"
                y="141"
                width="27"
                height="18"
                rx="3"
                fill={recessedBg}
                stroke={borderAccent}
                strokeWidth="1.2"
                strokeOpacity="0.75"
              />
              <text
                x="244.5"
                y="150"
                textAnchor="middle"
                dominantBaseline="central"
                fill={numColor}
                fontSize="10.5"
                fontWeight="700"
                fontFamily="'JetBrains Mono', ui-monospace, monospace"
              >
                {dayStr}
              </text>
            </g>
          )}

          {/* Brand & Chronometer Micro Signature */}
          <text
            x="150"
            y="84"
            textAnchor="middle"
            dominantBaseline="central"
            fill={subtleInk}
            fontSize="6.4"
            fontWeight="700"
            letterSpacing="2.2"
            fontFamily="system-ui, sans-serif"
          >
            CHRONOMETER
          </text>
          <text
            x="150"
            y="211"
            textAnchor="middle"
            dominantBaseline="central"
            fill={secColor}
            fillOpacity="0.88"
            fontSize="6.5"
            fontWeight="700"
            letterSpacing="2"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
          >
            {showDate ? `${weekdayShort} • ${monthShort}` : 'AUTOMATIC'}
          </text>
        </g>
      )}

      {/* STYLE 2: SWISS BAUHAUS */}
      {styleId === 'bauhaus' && (
        <g>
          <circle cx="150" cy="150" r="139" fill="none" stroke={hairline} strokeWidth="0.8" />
          {[...Array(60)].map((_, i) => {
            const isHour = i % 5 === 0;
            const isQuad = i % 15 === 0;
            const isTwelve = i === 0;
            return (
              <line
                key={i}
                x1="150"
                y1="14.5"
                x2="150"
                y2={isTwelve ? '44' : isQuad ? '42' : isHour ? '37' : '22'}
                stroke={isTwelve ? secColor : isHour ? majorTick : minorTick}
                strokeWidth={isTwelve ? '6' : isQuad ? '4.6' : isHour ? '3.4' : '1.2'}
                strokeLinecap="butt"
                transform={`rotate(${i * 6} 150 150)`}
              />
            );
          })}

          <text
            x="150"
            y="86"
            textAnchor="middle"
            dominantBaseline="central"
            fill={subtleInk}
            fontSize="6.8"
            fontWeight="700"
            letterSpacing="3"
            fontFamily="system-ui, sans-serif"
          >
            BAUHAUS
          </text>

          {showDate && (
            <g>
              <rect
                x="126"
                y="200"
                width="48"
                height="16"
                rx="8"
                fill={recessedBg}
                stroke={hairline}
                strokeWidth="1"
              />
              <text
                x="150"
                y="208"
                textAnchor="middle"
                dominantBaseline="central"
                fill={numColor}
                fontSize="8"
                fontWeight="700"
                letterSpacing="0.8"
                fontFamily="'JetBrains Mono', ui-monospace, monospace"
              >
                {weekdayShort} {dayStr}
              </text>
            </g>
          )}
        </g>
      )}

      {/* STYLE 3: DIVER PRO SUBMARINER */}
      {styleId === 'diver' && (
        <g>
          {/* Coin-Edge Outer Notches */}
          {[...Array(72)].map((_, i) => (
            <line
              key={i}
              x1="150"
              y1="4.8"
              x2="150"
              y2="8"
              stroke={borderAccent}
              strokeOpacity="0.45"
              strokeWidth="1.2"
              transform={`rotate(${i * 5} 150 150)`}
            />
          ))}

          {/* Ceramic Graduated Dive Bezel */}
          <circle cx="150" cy="150" r="132" fill="none" stroke={diverBezelBg} strokeWidth="22" />
          <circle cx="150" cy="150" r="132" fill="none" stroke={borderAccent} strokeWidth="22" strokeOpacity="0.1" />
          <circle cx="150" cy="150" r="143" fill="none" stroke={borderAccent} strokeWidth="1.5" strokeOpacity="0.65" />
          <circle cx="150" cy="150" r="121" fill="none" stroke={borderAccent} strokeWidth="1.4" strokeOpacity="0.55" />

          {/* 12 o'clock Luminous Bezel Triangle + Pip */}
          <polygon points="150,27.5 143,10.5 157,10.5" fill={secColor} fillOpacity="0.92" />
          <circle cx="150" cy="16.5" r="2.2" fill="#ffffff" />

          {/* First-15 Minute Decompression Bezel Hash Ticks + 5-min Markers */}
          {[...Array(60)].map((_, i) => {
            if (i === 0) return null;
            if (i % 10 === 0) return null; // numbers placed cleanly at 10,20,30,40,50
            if (i < 15) {
              return (
                <line
                  key={i}
                  x1="150"
                  y1="11.5"
                  x2="150"
                  y2={i % 5 === 0 ? '24.5' : '19'}
                  stroke={diverBezelInk}
                  strokeOpacity={i % 5 === 0 ? '0.92' : '0.68'}
                  strokeWidth={i % 5 === 0 ? '2.2' : '1.1'}
                  transform={`rotate(${i * 6} 150 150)`}
                />
              );
            }
            if (i % 5 === 0) {
              return (
                <line
                  key={i}
                  x1="150"
                  y1="12.5"
                  x2="150"
                  y2="23.5"
                  stroke={diverBezelInk}
                  strokeOpacity="0.78"
                  strokeWidth="2.2"
                  transform={`rotate(${i * 6} 150 150)`}
                />
              );
            }
            return null;
          })}

          {/* Bezel Numerals: 10, 20, 30, 40, 50 */}
          {[10, 20, 30, 40, 50].map((val) => {
            const flipBottom = val >= 20 && val <= 40;
            return (
              <text
                key={val}
                x="150"
                y="18.2"
                textAnchor="middle"
                dominantBaseline="central"
                fill={diverBezelInk}
                fontSize="10.2"
                fontWeight="800"
                fontFamily="system-ui, sans-serif"
                transform={`rotate(${val * 6} 150 150)${flipBottom ? ' rotate(180 150 18.2)' : ''}`}
              >
                {val}
              </text>
            );
          })}

          {/* Inner Dial Minute Ticks */}
          {[...Array(60)].map((_, i) => (
            <line
              key={i}
              x1="150"
              y1="32"
              x2="150"
              y2={i % 5 === 0 ? '38.5' : '36'}
              stroke={i % 5 === 0 ? majorTick : minorTick}
              strokeWidth={i % 5 === 0 ? '1.8' : '0.9'}
              transform={`rotate(${i * 6} 150 150)`}
            />
          ))}

          {/* Diver Lume Hour Plots */}
          {/* 12: Inverted Triangle */}
          <polygon points="150,62 141.5,43.5 158.5,43.5" fill={majorTick} stroke={borderAccent} strokeWidth="1.2" />
          {/* 6 & 9: Bold Luminous Rectangles */}
          <rect x="146.8" y="236" width="6.4" height="17" rx="1.6" fill={majorTick} stroke={borderAccent} strokeWidth="1.2" />
          <rect x="47" y="146.8" width="17" height="6.4" rx="1.6" fill={majorTick} stroke={borderAccent} strokeWidth="1.2" />

          {/* 3: Cyclops Framed Date Aperture or Rectangle Plot */}
          {showDate ? (
            <g>
              <rect
                x="227"
                y="140.5"
                width="26"
                height="19"
                rx="3.5"
                fill={recessedBg}
                stroke={borderAccent}
                strokeWidth="1.5"
              />
              <text
                x="240"
                y="150"
                textAnchor="middle"
                dominantBaseline="central"
                fill={numColor}
                fontSize="10.8"
                fontWeight="800"
                fontFamily="'JetBrains Mono', ui-monospace, monospace"
              >
                {dayStr}
              </text>
            </g>
          ) : (
            <rect x="236" y="146.8" width="17" height="6.4" rx="1.6" fill={majorTick} stroke={borderAccent} strokeWidth="1.2" />
          )}

          {/* Circular Lume Dots at 1, 2, 4, 5, 7, 8, 10, 11 */}
          {[1, 2, 4, 5, 7, 8, 10, 11].map((hr) => {
            const rad = ((hr * 30 - 90) * Math.PI) / 180;
            const r = 97;
            return (
              <circle
                key={hr}
                cx={150 + r * Math.cos(rad)}
                cy={150 + r * Math.sin(rad)}
                r="5.2"
                fill={majorTick}
                stroke={borderAccent}
                strokeWidth="1.4"
              />
            );
          })}

          <text
            x="150"
            y="84"
            textAnchor="middle"
            dominantBaseline="central"
            fill={subtleInk}
            fontSize="6.4"
            fontWeight="800"
            letterSpacing="2.2"
            fontFamily="system-ui, sans-serif"
          >
            SUBMARINE PRO
          </text>
          <text
            x="150"
            y="214"
            textAnchor="middle"
            dominantBaseline="central"
            fill={secColor}
            fontSize="6.2"
            fontWeight="700"
            letterSpacing="1.6"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
          >
            200M / 660FT
          </text>
        </g>
      )}

      {/* STYLE 4: HERITAGE ROMAN */}
      {styleId === 'roman' && (
        <g>
          <circle cx="150" cy="150" r="138" fill="none" stroke={borderAccent} strokeWidth="1" strokeOpacity="0.4" />
          {/* Outer 60 Pearl Dots */}
          {[...Array(60)].map((_, i) => (
            <circle
              key={i}
              cx="150"
              cy="17"
              r={i % 5 === 0 ? '2.1' : '0.95'}
              fill={i % 5 === 0 ? borderAccent : minorTick}
              transform={`rotate(${i * 6} 150 150)`}
            />
          ))}

          {/* Guilloche Inner Sunburst Medallion */}
          <g clipPath={`url(#${uid}-roman-clip)`} opacity={isLight ? '0.09' : '0.075'}>
            {[...Array(36)].map((_, i) => (
              <line
                key={i}
                x1="150"
                y1="72"
                x2="150"
                y2="150"
                stroke={majorTick}
                strokeWidth="0.9"
                transform={`rotate(${i * 10} 150 150)`}
              />
            ))}
          </g>
          <circle cx="150" cy="150" r="76" fill="none" stroke={hairline} strokeWidth="1" />
          <circle cx="150" cy="150" r="71" fill="none" stroke={borderAccent} strokeWidth="0.9" strokeOpacity="0.35" />

          {/* Roman Numerals I - XII */}
          {['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].map((roman, idx) => {
            const rad = ((idx * 30 - 90) * Math.PI) / 180;
            const r = 106;
            return (
              <text
                key={roman}
                x={150 + r * Math.cos(rad)}
                y={150 + r * Math.sin(rad)}
                textAnchor="middle"
                dominantBaseline="central"
                fill={idx % 3 === 0 ? borderAccent : numColor}
                fontSize={13.5 * fontMeta.scale}
                fontWeight="700"
                fontFamily={fontMeta.fontFamily}
                letterSpacing="0.5"
              >
                {roman}
              </text>
            );
          })}

          <text
            x="150"
            y="102"
            textAnchor="middle"
            dominantBaseline="central"
            fill={subtleInk}
            fontSize="6.4"
            fontWeight="700"
            letterSpacing="2.4"
            fontFamily="Georgia, serif"
          >
            GENEVE
          </text>

          {showDate && (
            <g>
              <rect
                x="133"
                y="196"
                width="34"
                height="17"
                rx="2.5"
                fill={recessedBg}
                stroke={borderAccent}
                strokeWidth="1.1"
                strokeOpacity="0.65"
              />
              <text
                x="150"
                y="204.5"
                textAnchor="middle"
                dominantBaseline="central"
                fill={numColor}
                fontSize="9.5"
                fontWeight="700"
                fontFamily="Georgia, serif"
              >
                {dayStr}
              </text>
            </g>
          )}
        </g>
      )}

      {/* STYLE 5: PILOT COCKPIT */}
      {styleId === 'pilot' && (
        <g>
          <circle cx="150" cy="150" r="137" fill="none" stroke={hairline} strokeWidth="1" />

          {/* 60 Bold Instrument Minute Ticks */}
          {[...Array(60)].map((_, i) => {
            const isHour = i % 5 === 0;
            return (
              <line
                key={i}
                x1="150"
                y1="15.5"
                x2="150"
                y2={isHour ? '29.5' : '24'}
                stroke={isHour ? majorTick : minorTick}
                strokeWidth={isHour ? '3.1' : '1.2'}
                transform={`rotate(${i * 6} 150 150)`}
              />
            );
          })}

          {/* Flieger 12 o'clock Triangle + Flanking Dots */}
          <polygon points="150,35.5 141.5,53.5 158.5,53.5" fill={secColor} />
          <circle cx="137" cy="45" r="2.3" fill={majorTick} />
          <circle cx="163" cy="45" r="2.3" fill={majorTick} />

          {/* Aviation Numerals 1-11 (6 reserved for Day-Reserve Sub-Dial) */}
          {[1, 2, 3, 4, 5, 7, 8, 9, 10, 11].map((num) => {
            const rad = ((num * 30 - 90) * Math.PI) / 180;
            const r = 101;
            return (
              <text
                key={num}
                x={150 + r * Math.cos(rad)}
                y={150 + r * Math.sin(rad)}
                textAnchor="middle"
                dominantBaseline="central"
                fill={numColor}
                fontSize={16 * fontMeta.scale}
                fontWeight={fontMeta.fontWeight}
                fontFamily={fontMeta.fontFamily}
              >
                {num}
              </text>
            );
          })}

          {/* Optional Inner 24-Hour Military Ring when 24-Hour mode active */}
          {is24Hour && [13, 14, 15, 16, 17, 19, 20, 21, 22, 23].map((num) => {
            const rad = (((num % 12) * 30 - 90) * Math.PI) / 180;
            const r = 74;
            return (
              <text
                key={num}
                x={150 + r * Math.cos(rad)}
                y={150 + r * Math.sin(rad)}
                textAnchor="middle"
                dominantBaseline="central"
                fill={borderAccent}
                fillOpacity="0.65"
                fontSize="7.4"
                fontWeight="700"
                fontFamily="'JetBrains Mono', ui-monospace, monospace"
              >
                {num}
              </text>
            );
          })}

          {/* Top Instrument Tag */}
          <text
            x="150"
            y="84"
            textAnchor="middle"
            dominantBaseline="central"
            fill={subtleInk}
            fontSize="6.4"
            fontWeight="800"
            letterSpacing="2.2"
            fontFamily="system-ui, sans-serif"
          >
            FLIEGER GMT
          </text>

          {/* Cockpit Date Plate when enabled */}
          {showDate && (
            <g>
              <rect
                x="122"
                y="94"
                width="56"
                height="15"
                rx="3"
                fill={recessedBg}
                stroke={hairline}
                strokeWidth="1"
              />
              <text
                x="150"
                y="101.5"
                textAnchor="middle"
                dominantBaseline="central"
                fill={numColor}
                fontSize="7.8"
                fontWeight="700"
                letterSpacing="0.8"
                fontFamily="'JetBrains Mono', ui-monospace, monospace"
              >
                {weekdayShort} {monthShort} {dayStr}
              </text>
            </g>
          )}

          {/* Live 6-o'clock Power Reserve / Day Progress Sub-Dial */}
          <g>
            <circle cx={pilotSubCx} cy={pilotSubCy} r="24" fill={recessedBg} stroke={hairline} strokeWidth="1.2" />
            <circle
              cx={pilotSubCx}
              cy={pilotSubCy}
              r={pilotSubR}
              fill="none"
              stroke={hairline}
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeDasharray={`${pilotArcSpan} ${pilotArcCircumference}`}
              transform={`rotate(135 ${pilotSubCx} ${pilotSubCy})`}
            />
            <circle
              cx={pilotSubCx}
              cy={pilotSubCy}
              r={pilotSubR}
              fill="none"
              stroke={secColor}
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeDasharray={`${pilotFilledSpan} ${pilotArcCircumference}`}
              transform={`rotate(135 ${pilotSubCx} ${pilotSubCy})`}
            />
            <text
              x={pilotSubCx}
              y={pilotSubCy + 11.5}
              textAnchor="middle"
              dominantBaseline="central"
              fill={subtleInk}
              fontSize="5.8"
              fontWeight="800"
              letterSpacing="0.7"
              fontFamily="'JetBrains Mono', ui-monospace, monospace"
            >
              DAY {dayProgress}%
            </text>
          </g>
        </g>
      )}

      {/* STYLE 6: ATELIER DOT GALLERY MINIMAL */}
      {styleId === 'atelier' && (
        <g>
          {/* Minimalist Cardinal Hairlines at 3, 6, 9 */}
          {[90, 180, 270].map((deg) => (
            <line
              key={deg}
              x1="150"
              y1="14"
              x2="150"
              y2="21.5"
              stroke={minorTick}
              strokeWidth="1.4"
              strokeLinecap="round"
              transform={`rotate(${deg} 150 150)`}
            />
          ))}

          {/* Sculpted Signature 12 o'clock Concave Orb */}
          <circle cx="150" cy="40" r="11.5" fill={`url(#${uid}-atelier-orb)`} stroke={borderAccent} strokeOpacity="0.45" strokeWidth="1" />
          <circle cx="146.5" cy="36.5" r="3" fill="#ffffff" fillOpacity="0.28" />

          <text
            x="150"
            y="228"
            textAnchor="middle"
            dominantBaseline="central"
            fill={subtleInk}
            fontSize="6"
            fontWeight="600"
            letterSpacing="3.4"
            fontFamily="system-ui, sans-serif"
          >
            ATELIER
          </text>

          {showDate && (
            <text
              x="150"
              y="210"
              textAnchor="middle"
              dominantBaseline="central"
              fill={numColor}
              fillOpacity="0.68"
              fontSize="8.5"
              fontWeight="600"
              letterSpacing="1.6"
              fontFamily="'JetBrains Mono', ui-monospace, monospace"
            >
              {weekdayShort} • {dayStr}
            </text>
          )}
        </g>
      )}

      {/* STYLE 7: TELEMETRY HUD */}
      {styleId === 'telemetry' && (
        <g>
          {/* Broken Segmented Tactical Rings */}
          <circle
            cx="150"
            cy="150"
            r="142.5"
            fill="none"
            stroke={borderAccent}
            strokeWidth="2.5"
            strokeOpacity="0.5"
            strokeDasharray="66 18"
            transform="rotate(-33 150 150)"
          />
          <circle cx="150" cy="150" r="134" fill="none" stroke={hairline} strokeWidth="0.9" />
          <circle cx="150" cy="150" r="95" fill="none" stroke={hairline} strokeWidth="0.9" strokeDasharray="4 5" />
          <circle cx="150" cy="150" r="56" fill="none" stroke={hairline} strokeWidth="0.8" />

          {/* Crosshair Center Reticle Lines */}
          <line x1="36" y1="150" x2="132" y2="150" stroke={hairline} strokeWidth="0.9" strokeDasharray="3 4" />
          <line x1="168" y1="150" x2="264" y2="150" stroke={hairline} strokeWidth="0.9" strokeDasharray="3 4" />
          <line x1="150" y1="36" x2="150" y2="132" stroke={hairline} strokeWidth="0.9" strokeDasharray="3 4" />
          <line x1="150" y1="168" x2="150" y2="264" stroke={hairline} strokeWidth="0.9" strokeDasharray="3 4" />

          {/* 90 Precision Degree / Sector Ticks */}
          {[...Array(60)].map((_, i) => {
            const isMajor = i % 5 === 0;
            const isQuad = i % 15 === 0;
            return (
              <line
                key={i}
                x1="150"
                y1="19"
                x2="150"
                y2={isQuad ? '30' : isMajor ? '27' : '23.5'}
                stroke={isQuad ? secColor : isMajor ? majorTick : minorTick}
                strokeWidth={isQuad ? '2.2' : isMajor ? '1.5' : '0.8'}
                transform={`rotate(${i * 6} 150 150)`}
              />
            );
          })}

          {/* Azimuth Cardinal Degree Markers */}
          {[
            { label: '000°', x: 150, y: 40 },
            { label: '090°', x: 256, y: 150 },
            { label: '180°', x: 150, y: 260 },
            { label: '270°', x: 44, y: 150 },
          ].map((item) => (
            <text
              key={item.label}
              x={item.x}
              y={item.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={borderAccent}
              fontSize="7.4"
              fontWeight="700"
              fontFamily="'JetBrains Mono', ui-monospace, monospace"
            >
              {item.label}
            </text>
          ))}

          {/* Four-Quadrant Telemetry Status Tags */}
          <text
            x="96"
            y="96"
            textAnchor="middle"
            dominantBaseline="central"
            fill={subtleInk}
            fontSize="6.8"
            fontWeight="700"
            letterSpacing="1"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
          >
            {timezoneLabel}
          </text>
          <text
            x="204"
            y="96"
            textAnchor="middle"
            dominantBaseline="central"
            fill={secColor}
            fontSize="6.8"
            fontWeight="700"
            letterSpacing="1"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
          >
            {is24Hour ? '24H-SYS' : `${ampm || '12H'}`}
          </text>
          <text
            x="96"
            y="204"
            textAnchor="middle"
            dominantBaseline="central"
            fill={subtleInk}
            fontSize="6.8"
            fontWeight="700"
            letterSpacing="0.8"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
          >
            DAY {dayProgress}%
          </text>
          <text
            x="204"
            y="204"
            textAnchor="middle"
            dominantBaseline="central"
            fill={numColor}
            fillOpacity="0.82"
            fontSize="6.8"
            fontWeight="700"
            letterSpacing="0.8"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
          >
            {showDate ? `${monthShort} ${dayStr}` : 'ONLINE'}
          </text>
        </g>
      )}

      {/* STYLE 8: CALIFORNIA FIELD */}
      {styleId === 'california' && (
        <g>
          <circle cx="150" cy="150" r="137" fill="none" stroke={hairline} strokeWidth="1" />
          <circle cx="150" cy="150" r="131" fill="none" stroke={hairline} strokeWidth="0.9" />
          <circle cx="150" cy="150" r="123" fill="none" stroke={hairline} strokeWidth="0.9" />

          {[...Array(60)].map((_, i) => (
            <line
              key={i}
              x1="150"
              y1="19"
              x2="150"
              y2="27"
              stroke={i % 5 === 0 ? majorTick : minorTick}
              strokeWidth={i % 5 === 0 ? '2' : '0.9'}
              transform={`rotate(${i * 6} 150 150)`}
            />
          ))}

          {/* Luminous Perimeter Pips at Every Hour */}
          {[...Array(12)].map((_, idx) => {
            const rad = ((idx * 30 - 90) * Math.PI) / 180;
            return (
              <circle
                key={idx}
                cx={150 + 118 * Math.cos(rad)}
                cy={150 + 118 * Math.sin(rad)}
                r={idx === 0 ? '2.5' : '1.7'}
                fill={idx % 3 === 0 ? secColor : borderAccent}
              />
            );
          })}

          {/* 12 o'clock Inverted Explorer Triangle */}
          <polygon points="150,60 141.5,42 158.5,42" fill={majorTick} stroke={borderAccent} strokeWidth="1.1" />

          {/* Upper Semicircle Roman Numerals: I, II, X, XI */}
          {[
            { idx: 1, text: 'I' },
            { idx: 2, text: 'II' },
            { idx: 10, text: 'X' },
            { idx: 11, text: 'XI' },
          ].map(({ idx, text }) => {
            const rad = ((idx * 30 - 90) * Math.PI) / 180;
            const r = 98;
            return (
              <text
                key={text}
                x={150 + r * Math.cos(rad)}
                y={150 + r * Math.sin(rad)}
                textAnchor="middle"
                dominantBaseline="central"
                fill={numColor}
                fontSize={14.5 * fontMeta.scale}
                fontWeight={fontMeta.fontWeight}
                fontFamily={fontMeta.fontFamily}
              >
                {text}
              </text>
            );
          })}

          {/* Cardinal 6 and 9 Horizontal / Vertical Explorer Batons */}
          <rect x="147.2" y="236" width="5.6" height="16" rx="2" fill={majorTick} stroke={borderAccent} strokeWidth="0.9" />
          <rect x="48" y="147.2" width="16" height="5.6" rx="2" fill={majorTick} stroke={borderAccent} strokeWidth="0.9" />

          {/* Cardinal 3: Vintage Framed Date Aperture or Horizontal Baton */}
          {showDate ? (
            <g>
              <rect
                x="228"
                y="141"
                width="27"
                height="18"
                rx="3"
                fill={recessedBg}
                stroke={borderAccent}
                strokeWidth="1.2"
                strokeOpacity="0.75"
              />
              <text
                x="241.5"
                y="150"
                textAnchor="middle"
                dominantBaseline="central"
                fill={numColor}
                fontSize="10.2"
                fontWeight="700"
                fontFamily="'JetBrains Mono', ui-monospace, monospace"
              >
                {dayStr}
              </text>
            </g>
          ) : (
            <rect x="236" y="147.2" width="16" height="5.6" rx="2" fill={majorTick} stroke={borderAccent} strokeWidth="0.9" />
          )}

          {/* Lower Semicircle Arabic Numerals: 4, 5, 7, 8 */}
          {[4, 5, 7, 8].map((num) => {
            const rad = ((num * 30 - 90) * Math.PI) / 180;
            const r = 98;
            return (
              <text
                key={num}
                x={150 + r * Math.cos(rad)}
                y={150 + r * Math.sin(rad)}
                textAnchor="middle"
                dominantBaseline="central"
                fill={numColor}
                fontSize={14.5 * fontMeta.scale}
                fontWeight={fontMeta.fontWeight}
                fontFamily={fontMeta.fontFamily}
              >
                {num}
              </text>
            );
          })}

          <text
            x="150"
            y="84"
            textAnchor="middle"
            dominantBaseline="central"
            fill={subtleInk}
            fontSize="6.4"
            fontWeight="700"
            letterSpacing="2.2"
            fontFamily="system-ui, sans-serif"
          >
            CALIFORNIA FIELD
          </text>
          <text
            x="150"
            y="212"
            textAnchor="middle"
            dominantBaseline="central"
            fill={secColor}
            fillOpacity="0.9"
            fontSize="6.4"
            fontWeight="700"
            letterSpacing="1.8"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
          >
            {showDate ? `${weekdayShort} • ${monthShort}` : 'EXPLORER'}
          </text>
        </g>
      )}

      {/* STYLE 9: TOURBILLON (OPEN-HEART SKELETON ESCAPEMENT) */}
      {styleId === 'tourbillon' && (
        <g>
          {/* Outer Satin Track Rings */}
          <circle cx="150" cy="150" r="137" fill="none" stroke={borderAccent} strokeWidth="1.2" strokeOpacity="0.45" />
          <circle cx="150" cy="150" r="130" fill="none" stroke={hairline} strokeWidth="0.9" />

          {/* Exposed Corner Movement Screws on Chapter Ring */}
          {[45, 135, 225, 315].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 150 150)`}>
              <circle cx="150" cy="17" r="2.7" fill={recessedBg} stroke={borderAccent} strokeWidth="0.9" strokeOpacity="0.8" />
              <line x1="148.4" y1="17" x2="151.6" y2="17" stroke={borderAccent} strokeWidth="0.8" />
            </g>
          ))}

          {/* 60 Perimeter Minute Graduations */}
          {[...Array(60)].map((_, i) => (
            <line
              key={i}
              x1="150"
              y1="20"
              x2="150"
              y2={i % 5 === 0 ? '28.5' : '24.5'}
              stroke={i % 5 === 0 ? majorTick : minorTick}
              strokeWidth={i % 5 === 0 ? '1.8' : '0.8'}
              transform={`rotate(${i * 6} 150 150)`}
            />
          ))}

          {/* Applied Beveled Baton Indices (Skip 6 o'clock for Open-Heart Aperture) */}
          {[1, 2, 3, 4, 5, 7, 8, 9, 10, 11].map((idx) => (
            <rect
              key={idx}
              x="148.2"
              y="32"
              width="3.6"
              height="14"
              rx="1.2"
              fill={majorTick}
              stroke={borderAccent}
              strokeWidth="0.6"
              transform={`rotate(${idx * 30} 150 150)`}
            />
          ))}
          {/* Dual 12 o'clock Twin Faceted Batons */}
          <rect x="145.6" y="31" width="3.3" height="16" rx="1" fill={secColor} />
          <rect x="151.1" y="31" width="3.3" height="16" rx="1" fill={secColor} />

          {/* Upper Skeletonized Bridge Plate with Cotes de Geneve Stripes */}
          <g clipPath={`url(#${uid}-geneva-clip)`}>
            <circle cx="150" cy="150" r="70" fill={recessedBg} />
            {[-64, -52, -40, -28, -16, -4, 8, 20, 32, 44, 56].map((xOff) => (
              <line
                key={xOff}
                x1={150 + xOff}
                y1="78"
                x2={150 + xOff}
                y2="152"
                stroke={majorTick}
                strokeWidth="5"
                strokeOpacity={isLight ? '0.07' : '0.065'}
              />
            ))}
          </g>
          <path
            d="M 80 150 A 70 70 0 0 1 220 150"
            fill="none"
            stroke={borderAccent}
            strokeWidth="1.2"
            strokeOpacity="0.55"
          />

          {/* Twin Exposed Mainspring Gear Drums */}
          {[116, 184].map((gx) => (
            <g key={gx} opacity="0.88">
              <circle cx={gx} cy="112" r="19" fill={dialBase} fillOpacity="0.55" stroke={borderAccent} strokeWidth="1.2" strokeOpacity="0.7" />
              <circle cx={gx} cy="112" r="15" fill="none" stroke={majorTick} strokeWidth="1.2" strokeDasharray="3 2.5" strokeOpacity="0.5" />
              {[0, 60, 120].map((sp) => (
                <line
                  key={sp}
                  x1={gx}
                  y1="97"
                  x2={gx}
                  y2="127"
                  stroke={hairline}
                  strokeWidth="1.5"
                  transform={`rotate(${sp} ${gx} 112)`}
                />
              ))}
              <circle cx={gx} cy="112" r="4" fill={borderAccent} fillOpacity="0.8" />
              <circle cx={gx} cy="112" r="1.8" fill={secColor} />
            </g>
          ))}

          {/* Top Jewel Bearing & Heritage Signature */}
          <circle cx="150" cy="79" r="3.4" fill={secColor} stroke={borderAccent} strokeWidth="0.9" />
          <circle cx="150" cy="79" r="1.3" fill="#ffffff" fillOpacity="0.7" />
          <text
            x="150"
            y="60"
            textAnchor="middle"
            dominantBaseline="central"
            fill={subtleInk}
            fontSize="6.4"
            fontWeight="800"
            letterSpacing="2.4"
            fontFamily="system-ui, sans-serif"
          >
            TOURBILLON
          </text>

          {/* 6 o'clock Open-Heart Tourbillon Chamber Frame */}
          <circle cx="150" cy="198" r="33" fill={isLight ? '#1e293b' : '#050811'} stroke={borderAccent} strokeWidth="2.2" strokeOpacity="0.85" />
          <circle cx="150" cy="198" r="28" fill="none" stroke={hairline} strokeWidth="0.9" strokeDasharray="2 3" />
          {/* Horizontal Twin-Screw Balance Bridge */}
          <path d="M 113 198 Q 150 202 187 198" fill="none" stroke={borderAccent} strokeWidth="3.2" strokeOpacity="0.8" strokeLinecap="round" />
          <circle cx="116" cy="198" r="2.2" fill={majorTick} />
          <circle cx="184" cy="198" r="2.2" fill={majorTick} />

          {/* 3 o'clock Date Window */}
          {showDate && (
            <g>
              <rect
                x="218"
                y="141.5"
                width="27"
                height="17"
                rx="2.5"
                fill={recessedBg}
                stroke={borderAccent}
                strokeWidth="1.1"
                strokeOpacity="0.7"
              />
              <text
                x="231.5"
                y="150"
                textAnchor="middle"
                dominantBaseline="central"
                fill={numColor}
                fontSize="9.8"
                fontWeight="700"
                fontFamily="'JetBrains Mono', ui-monospace, monospace"
              >
                {dayStr}
              </text>
            </g>
          )}

          <text
            x="150"
            y="244"
            textAnchor="middle"
            dominantBaseline="central"
            fill={subtleInk}
            fontSize="5.8"
            fontWeight="700"
            letterSpacing="1.8"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
          >
            CAL. VT-60S
          </text>
        </g>
      )}

      {/* STYLE 10: CELESTIAL MOONPHASE */}
      {styleId === 'celestial' && (() => {
        const moonCx = 150;
        const moonCy = 188;
        const moonR = 16;
        const theta = lunarPhase * 2 * Math.PI;
        const rx = Math.max(0.15, Math.abs(Math.cos(theta)) * moonR);
        const isWaxing = lunarPhase < 0.5;
        const outerSweep = isWaxing ? 1 : 0;
        const innerSweep = isWaxing
          ? (lunarPhase < 0.25 ? 0 : 1)
          : (lunarPhase < 0.75 ? 0 : 1);
        const moonLitPath = `M ${moonCx} ${moonCy - moonR} A ${moonR} ${moonR} 0 0 ${outerSweep} ${moonCx} ${moonCy + moonR} A ${rx.toFixed(2)} ${moonR} 0 0 ${innerSweep} ${moonCx} ${moonCy - moonR} Z`;
        const illumPct = Math.round(((1 - Math.cos(theta)) / 2) * 100);

        return (
          <g>
            {/* Outer Precision Minute Chapter Track */}
            <circle cx="150" cy="150" r="137" fill="none" stroke={borderAccent} strokeWidth="1" strokeOpacity="0.45" />
            <circle cx="150" cy="150" r="131" fill="none" stroke={hairline} strokeWidth="0.9" />
            {[...Array(60)].map((_, i) => (
              <line
                key={i}
                x1="150"
                y1="19"
                x2="150"
                y2={i % 5 === 0 ? '26.5' : '22.5'}
                stroke={i % 5 === 0 ? majorTick : minorTick}
                strokeWidth={i % 5 === 0 ? '1.6' : '0.8'}
                transform={`rotate(${i * 6} 150 150)`}
              />
            ))}

            {/* Inner Celestial Sky Ecliptic Rings */}
            <circle cx="150" cy="150" r="102" fill="none" stroke={borderAccent} strokeWidth="0.9" strokeOpacity="0.35" strokeDasharray="3 4" />
            <circle cx="150" cy="150" r="95" fill="none" stroke={hairline} strokeWidth="0.8" />

            {/* Applied Faceted Spear Hour Indices (12 is Celestial Star Emblem) */}
            {[...Array(12)].map((_, idx) => (
              <g key={idx} transform={`rotate(${idx * 30} 150 150)`}>
                {idx === 0 ? (
                  <polygon points="150,48 145.8,31.5 154.2,31.5" fill={secColor} stroke={borderAccent} strokeWidth="0.7" />
                ) : (
                  <polygon points="150,46 147.6,33 152.4,33" fill={idx % 3 === 0 ? borderAccent : majorTick} />
                )}
              </g>
            ))}

            {/* Seeded Celestial Starlight Coordinates around Upper Hemisphere */}
            {[
              { x: 96, y: 108, s: 2.2 },
              { x: 112, y: 84, s: 1.5 },
              { x: 188, y: 84, s: 1.6 },
              { x: 204, y: 108, s: 2.1 },
              { x: 84, y: 136, s: 1.3 },
              { x: 216, y: 136, s: 1.4 },
            ].map((st, idx) => (
              <path
                key={idx}
                d={`M ${st.x} ${st.y - st.s} L ${st.x + st.s * 0.32} ${st.y - st.s * 0.32} L ${st.x + st.s} ${st.y} L ${st.x + st.s * 0.32} ${st.y + st.s * 0.32} L ${st.x} ${st.y + st.s} L ${st.x - st.s * 0.32} ${st.y + st.s * 0.32} L ${st.x - st.s} ${st.y} L ${st.x - st.s * 0.32} ${st.y - st.s * 0.32} Z`}
                fill={borderAccent}
                fillOpacity="0.65"
              />
            ))}

            {/* Upper Constellation Connector Hairline */}
            <polyline
              points="96,108 112,84 150,74 188,84 204,108"
              fill="none"
              stroke={borderAccent}
              strokeWidth="0.6"
              strokeOpacity="0.25"
              strokeDasharray="2 3"
            />

            <text
              x="150"
              y="66"
              textAnchor="middle"
              dominantBaseline="central"
              fill={subtleInk}
              fontSize="6"
              fontWeight="700"
              letterSpacing="2.4"
              fontFamily="Georgia, serif"
            >
              CELESTIAL
            </text>

            {/* Date Pill beneath 12 o'clock */}
            {showDate && (
              <g>
                <rect
                  x="126"
                  y="78"
                  width="48"
                  height="15"
                  rx="7.5"
                  fill={recessedBg}
                  stroke={borderAccent}
                  strokeWidth="0.9"
                  strokeOpacity="0.55"
                />
                <text
                  x="150"
                  y="85.5"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={numColor}
                  fontSize="7.4"
                  fontWeight="700"
                  letterSpacing="0.8"
                  fontFamily="'JetBrains Mono', ui-monospace, monospace"
                >
                  {monthShort} {dayStr}
                </text>
              </g>
            )}

            {/* Iconic Cloud-Shoulder Astronomical Moonphase Aperture */}
            <g clipPath={`url(#${uid}-moon-clip)`}>
              <rect x="106" y="158" width="88" height="52" fill="#070d1e" />
              <circle cx="126" cy="176" r="0.85" fill="#ffffff" fillOpacity="0.75" />
              <circle cx="174" cy="176" r="0.85" fill="#ffffff" fillOpacity="0.75" />
              <circle cx="135" cy="169" r="0.6" fill="#fde68a" fillOpacity="0.8" />
              <circle cx="166" cy="168" r="0.7" fill="#fde68a" fillOpacity="0.8" />
              <circle cx="119" cy="190" r="0.65" fill="#ffffff" fillOpacity="0.6" />
              <circle cx="180" cy="189" r="0.65" fill="#ffffff" fillOpacity="0.6" />

              {/* Unlit Lunar Shadow Disc */}
              <circle cx={moonCx} cy={moonCy} r={moonR} fill="#16213e" />
              {/* Illuminated Phase Shape */}
              {illumPct > 1 && (
                <path d={moonLitPath} fill={`url(#${uid}-moon-glow)`} />
              )}
              <circle cx={moonCx} cy={moonCy} r={moonR} fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="0.6" />
            </g>
            {/* Polished Aperture Rim Outline */}
            <path
              d="M 110 202 A 40 40 0 0 1 190 202 Q 170 191 160 198 A 10.5 10.5 0 0 1 140 198 Q 130 191 110 202 Z"
              fill="none"
              stroke={borderAccent}
              strokeWidth="1.5"
              strokeOpacity="0.85"
            />
            <text
              x="150"
              y="222"
              textAnchor="middle"
              dominantBaseline="central"
              fill={subtleInk}
              fontSize="6"
              fontWeight="700"
              letterSpacing="1.6"
              fontFamily="'JetBrains Mono', ui-monospace, monospace"
            >
              LUNA {illumPct}%
            </text>
          </g>
        );
      })()}

      {/* STYLE 11: CHRONOGRAPH (TRI-COMPAX TACHYMETER) */}
      {styleId === 'chronograph' && (
        <g>
          {/* Outer Anodized Motorsport Tachymeter Bezel */}
          <circle cx="150" cy="150" r="142.5" fill={diverBezelBg} />
          <circle cx="150" cy="150" r="122" fill={dialBase} stroke={borderAccent} strokeWidth="1.6" strokeOpacity="0.7" />
          <circle cx="150" cy="150" r="122" fill={`url(#${uid}-dial-depth)`} pointerEvents="none" />

          {/* Authentic Logarithmic Tachymeter Speed Scale */}
          {[
            { label: '60', angle: 0 },
            { label: 'TACHY', angle: 24, isTag: true },
            { label: '500', angle: 43.2 },
            { label: '400', angle: 54 },
            { label: '300', angle: 72 },
            { label: '240', angle: 90 },
            { label: '200', angle: 108 },
            { label: '160', angle: 135 },
            { label: '140', angle: 154.3 },
            { label: '120', angle: 180 },
            { label: '100', angle: 216 },
            { label: '90', angle: 240 },
            { label: '80', angle: 270 },
            { label: '70', angle: 308.6 },
            { label: '65', angle: 332.3 },
          ].map((item) => {
            const flipBottom = item.angle >= 100 && item.angle <= 260;
            return (
              <g key={item.label} transform={`rotate(${item.angle} 150 150)`}>
                {!item.isTag && (
                  <circle cx="150" cy="126.2" r="1.2" fill={item.angle === 0 ? secColor : diverBezelInk} fillOpacity="0.9" />
                )}
                <text
                  x="150"
                  y="17.8"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={item.isTag ? secColor : diverBezelInk}
                  fontSize={item.isTag ? '5.4' : '7.1'}
                  fontWeight="800"
                  letterSpacing={item.isTag ? '0.9' : '0.2'}
                  fontFamily="'JetBrains Mono', ui-monospace, monospace"
                  transform={flipBottom ? 'rotate(180 150 17.8)' : undefined}
                >
                  {item.label}
                </text>
              </g>
            );
          })}

          {/* Inner 1/5th-Second Chronograph Track */}
          {[...Array(60)].map((_, i) => (
            <line
              key={i}
              x1="150"
              y1="29.5"
              x2="150"
              y2={i % 5 === 0 ? '36.5' : '33'}
              stroke={i % 5 === 0 ? majorTick : minorTick}
              strokeWidth={i % 5 === 0 ? '1.8' : '0.8'}
              transform={`rotate(${i * 6} 150 150)`}
            />
          ))}

          {/* Applied Racing Lume Indices at Non-Sub-Dial Hours */}
          {[0, 1, 2, 4, 5, 7, 8, 10, 11].map((idx) => (
            <g key={idx} transform={`rotate(${idx * 30} 150 150)`}>
              {idx === 0 ? (
                <polygon points="150,53 144,39 156,39" fill={secColor} stroke={borderAccent} strokeWidth="0.6" />
              ) : (
                <rect x="148" y="38.5" width="4" height="10" rx="1.2" fill={majorTick} stroke={borderAccent} strokeWidth="0.5" />
              )}
            </g>
          ))}

          {/* Tri-Compax Sub-Dials: 9h (60 SEC), 3h (24H), 6h (60 MIN) */}
          {[
            { cx: 102, cy: 150, tag: 'SEC', topLabel: '60' },
            { cx: 198, cy: 150, tag: '24H', topLabel: '24' },
            { cx: 150, cy: 198, tag: 'MIN', topLabel: '60' },
          ].map((sd) => (
            <g key={sd.tag}>
              <circle cx={sd.cx} cy={sd.cy} r="23.5" fill={recessedBg} stroke={borderAccent} strokeWidth="1.2" strokeOpacity="0.6" />
              <circle cx={sd.cx} cy={sd.cy} r="19" fill="none" stroke={hairline} strokeWidth="0.8" />
              {[...Array(12)].map((_, t) => (
                <line
                  key={t}
                  x1={sd.cx}
                  y1={sd.cy - 22.5}
                  x2={sd.cx}
                  y2={t % 3 === 0 ? sd.cy - 18 : sd.cy - 20}
                  stroke={t % 3 === 0 ? majorTick : minorTick}
                  strokeWidth={t % 3 === 0 ? '1.3' : '0.7'}
                  transform={`rotate(${t * 30} ${sd.cx} ${sd.cy})`}
                />
              ))}
              <text
                x={sd.cx}
                y={sd.cy - 12.5}
                textAnchor="middle"
                dominantBaseline="central"
                fill={subtleInk}
                fontSize="5.2"
                fontWeight="800"
                fontFamily="'JetBrains Mono', ui-monospace, monospace"
              >
                {sd.topLabel}
              </text>
              <text
                x={sd.cx}
                y={sd.cy + 12}
                textAnchor="middle"
                dominantBaseline="central"
                fill={secColor}
                fontSize="5"
                fontWeight="800"
                letterSpacing="0.8"
                fontFamily="'JetBrains Mono', ui-monospace, monospace"
              >
                {sd.tag}
              </text>
            </g>
          ))}

          {/* Top Signature */}
          <text
            x="150"
            y="84"
            textAnchor="middle"
            dominantBaseline="central"
            fill={subtleInk}
            fontSize="6.2"
            fontWeight="800"
            letterSpacing="2"
            fontFamily="system-ui, sans-serif"
          >
            CHRONOGRAPH
          </text>

          {/* 4:30 Date Window when showDate is active */}
          {showDate && (
            <g>
              <rect
                x="185"
                y="188"
                width="24"
                height="16"
                rx="3"
                fill={recessedBg}
                stroke={borderAccent}
                strokeWidth="1.1"
                strokeOpacity="0.7"
              />
              <text
                x="197"
                y="196"
                textAnchor="middle"
                dominantBaseline="central"
                fill={numColor}
                fontSize="8.8"
                fontWeight="700"
                fontFamily="'JetBrains Mono', ui-monospace, monospace"
              >
                {dayStr}
              </text>
            </g>
          )}
        </g>
      )}

      {/* STYLE 12: ART DECO (1920s METROPOLIS SECTOR) */}
      {styleId === 'artdeco' && (
        <g>
          {/* Stepped Architectural Sector Rings */}
          <circle cx="150" cy="150" r="137" fill="none" stroke={borderAccent} strokeWidth="2.2" strokeOpacity="0.72" />
          <circle cx="150" cy="150" r="130" fill="none" stroke={hairline} strokeWidth="0.9" />
          <circle cx="150" cy="150" r="92" fill="none" stroke={borderAccent} strokeWidth="1.2" strokeOpacity="0.55" />
          <circle cx="150" cy="150" r="56" fill="none" stroke={borderAccent} strokeWidth="1" strokeOpacity="0.4" />

          {/* Sunburst Art Deco Fan Rays */}
          <g opacity={isLight ? '0.11' : '0.095'}>
            {[...Array(24)].map((_, i) => (
              <line
                key={i}
                x1="150"
                y1="56"
                x2="150"
                y2="92"
                stroke={borderAccent}
                strokeWidth="1.3"
                transform={`rotate(${i * 15} 150 150)`}
              />
            ))}
          </g>

          {/* Diagonal Art Deco Corner Frame Motif */}
          <rect
            x="108"
            y="108"
            width="84"
            height="84"
            fill="none"
            stroke={hairline}
            strokeWidth="0.9"
            transform="rotate(45 150 150)"
          />

          {/* 60 Crisp Geometric Ticks */}
          {[...Array(60)].map((_, i) => (
            <line
              key={i}
              x1="150"
              y1="21"
              x2="150"
              y2={i % 5 === 0 ? '28' : '24.5'}
              stroke={i % 5 === 0 ? borderAccent : minorTick}
              strokeWidth={i % 5 === 0 ? '1.6' : '0.8'}
              transform={`rotate(${i * 6} 150 150)`}
            />
          ))}

          {/* Elongated Tapered Chevron Baguette Markers for Intermediate Hours */}
          {[1, 2, 4, 5, 7, 8, 10, 11].map((idx) => (
            <polygon
              key={idx}
              points="150,51 146.5,33 153.5,33"
              fill={idx % 2 === 1 ? majorTick : borderAccent}
              fillOpacity={idx % 2 === 1 ? '0.88' : '0.75'}
              transform={`rotate(${idx * 30} 150 150)`}
            />
          ))}

          {/* Bold Architectural Cardinal Pylon Numerals */}
          {[
            { label: '12', x: 150, y: 42 },
            { label: '3', x: 256, y: 150 },
            { label: '6', x: 150, y: 256 },
            { label: '9', x: 44, y: 150 },
          ].map((item) => (
            <g key={item.label}>
              <polygon
                points={`${item.x},${item.y - 12} ${item.x + 12},${item.y} ${item.x},${item.y + 12} ${item.x - 12},${item.y}`}
                fill="none"
                stroke={borderAccent}
                strokeWidth="0.8"
                strokeOpacity="0.45"
              />
              <text
                x={item.x}
                y={item.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={item.label === '12' ? secColor : numColor}
                fontSize={16 * fontMeta.scale}
                fontWeight="800"
                fontFamily="Georgia, serif"
              >
                {item.label}
              </text>
            </g>
          ))}

          <text
            x="150"
            y="84"
            textAnchor="middle"
            dominantBaseline="central"
            fill={subtleInk}
            fontSize="6"
            fontWeight="800"
            letterSpacing="3"
            fontFamily="Georgia, serif"
          >
            METROPOLIS
          </text>

          {showDate && (
            <g>
              <polygon
                points="126,214 132,206 168,206 174,214 168,222 132,222"
                fill={recessedBg}
                stroke={borderAccent}
                strokeWidth="1"
                strokeOpacity="0.68"
              />
              <text
                x="150"
                y="214"
                textAnchor="middle"
                dominantBaseline="central"
                fill={numColor}
                fontSize="8.4"
                fontWeight="700"
                letterSpacing="1"
                fontFamily="'JetBrains Mono', ui-monospace, monospace"
              >
                {weekdayShort} {dayStr}
              </text>
            </g>
          )}
        </g>
      )}

      {/* STYLE 13: ORBITAL HUD (PLANETARY RINGS) */}
      {styleId === 'orbital' && (
        <g>
          {/* Outer Azimuth Track Ring */}
          <circle cx="150" cy="150" r="137" fill="none" stroke={hairline} strokeWidth="0.9" />
          {[...Array(72)].map((_, i) => (
            <circle
              key={i}
              cx="150"
              cy="17"
              r={i % 6 === 0 ? '1.7' : '0.85'}
              fill={i % 18 === 0 ? secColor : i % 6 === 0 ? majorTick : minorTick}
              transform={`rotate(${i * 5} 150 150)`}
            />
          ))}

          {/* Three Concentric Orbital Tracks (Hours r=64, Minutes r=94, Seconds r=124) */}
          <circle cx="150" cy="150" r="124" fill="none" stroke={hairline} strokeWidth="4.5" />
          <circle cx="150" cy="150" r="94" fill="none" stroke={hairline} strokeWidth="4.5" />
          <circle cx="150" cy="150" r="64" fill="none" stroke={hairline} strokeWidth="4.5" />

          {/* Crosshair Axis Hairlines */}
          <line x1="20" y1="150" x2="280" y2="150" stroke={hairline} strokeWidth="0.7" strokeDasharray="3 5" />
          <line x1="150" y1="20" x2="150" y2="280" stroke={hairline} strokeWidth="0.7" strokeDasharray="3 5" />

          {/* Clean Telemetry Tags Inside Inner Orbit Hub */}
          <text
            x="150"
            y="108"
            textAnchor="middle"
            dominantBaseline="central"
            fill={subtleInk}
            fontSize="6"
            fontWeight="800"
            letterSpacing="2.2"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
          >
            ORBITAL
          </text>
          <text
            x="150"
            y="190"
            textAnchor="middle"
            dominantBaseline="central"
            fill={secColor}
            fontSize="6.4"
            fontWeight="700"
            letterSpacing="1.2"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
          >
            {showDate ? `${monthShort} ${dayStr}` : `DAY ${dayProgress}%`}
          </text>
        </g>
      )}

      {/* STYLE 14: KINTSUGI (ZEN HORIZON CERAMIC & GOLD) */}
      {styleId === 'kintsugi' && (
        <g>
          {/* Asymmetrical Enso Calligraphy Ring */}
          <circle
            cx="150"
            cy="150"
            r="116"
            fill="none"
            stroke={borderAccent}
            strokeWidth="2.2"
            strokeOpacity="0.34"
            strokeLinecap="round"
            strokeDasharray="610 140"
            transform="rotate(-118 150 150)"
          />

          {/* Metallic Kintsugi Fracture Seams Crossing the Ceramic Dial */}
          <path
            d="M 24 186 Q 74 176 116 156 T 150 150 Q 204 140 278 118"
            fill="none"
            stroke={borderAccent}
            strokeWidth="2.4"
            strokeOpacity="0.78"
            strokeLinecap="round"
          />
          <path
            d="M 24 186 Q 74 176 116 156 T 150 150 Q 204 140 278 118"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.7"
            strokeOpacity="0.45"
            strokeLinecap="round"
          />
          <path
            d="M 116 156 Q 108 192 86 244"
            fill="none"
            stroke={borderAccent}
            strokeWidth="1.5"
            strokeOpacity="0.58"
            strokeLinecap="round"
          />
          <path
            d="M 206 138 Q 222 104 218 58"
            fill="none"
            stroke={borderAccent}
            strokeWidth="1.2"
            strokeOpacity="0.45"
            strokeLinecap="round"
          />

          {/* Subtle Off-Center Zen Water Ripple Arcs */}
          <circle cx="150" cy="212" r="24" fill="none" stroke={hairline} strokeWidth="0.8" />
          <circle cx="150" cy="212" r="42" fill="none" stroke={hairline} strokeWidth="0.7" strokeOpacity="0.65" />

          {/* Minimalist Ceramic Rice-Grain Hour Markers */}
          {[...Array(12)].map((_, idx) => (
            <g key={idx} transform={`rotate(${idx * 30} 150 150)`}>
              {idx === 0 ? (
                <>
                  <rect x="146" y="24" width="3.2" height="14" rx="1.6" fill={secColor} />
                  <rect x="150.8" y="24" width="3.2" height="14" rx="1.6" fill={secColor} />
                </>
              ) : idx % 3 === 0 ? (
                <rect x="148" y="24" width="4" height="12" rx="2" fill={majorTick} />
              ) : (
                <circle cx="150" cy="29" r="2.1" fill={borderAccent} fillOpacity="0.78" />
              )}
            </g>
          ))}

          {showDate && (
            <text
              x="150"
              y="88"
              textAnchor="middle"
              dominantBaseline="central"
              fill={subtleInk}
              fontSize="7.8"
              fontWeight="600"
              letterSpacing="2"
              fontFamily="'JetBrains Mono', ui-monospace, monospace"
            >
              {weekdayShort} • {dayStr}
            </text>
          )}

          {/* Traditional Minimalist Hanko Stamp Seal at 6 o'clock */}
          <g>
            <rect
              x="141"
              y="204"
              width="18"
              height="18"
              rx="3"
              fill="none"
              stroke={secColor}
              strokeWidth="1.4"
              strokeOpacity="0.85"
            />
            <text
              x="150"
              y="213"
              textAnchor="middle"
              dominantBaseline="central"
              fill={secColor}
              fontSize="6.5"
              fontWeight="800"
              letterSpacing="0.8"
              fontFamily="'JetBrains Mono', ui-monospace, monospace"
            >
              ZEN
            </text>
          </g>
        </g>
      )}

      {/* STYLE 15: SOLAR SYSTEM ORRERY (Real-Time Heliocentric Planetarium) */}
      {styleId === 'orrery' && (
        <g>
          {/* Deep Midnight Sapphire Space Dome */}
          <circle cx="150" cy="150" r="141" fill={`url(#${uid}-space-dome)`} stroke={borderAccent} strokeWidth="2.4" strokeOpacity="0.65" />
          <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(253,230,138,0.28)" strokeWidth="1" />
          <circle cx="150" cy="150" r="139" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.7" />

          {/* Outer Astronomical Degree & Ecliptic Bezel */}
          {[...Array(60)].map((_, i) => {
            const isHour = i % 5 === 0;
            const isQuad = i % 15 === 0;
            return (
              <line
                key={i}
                x1="150"
                y1={isQuad ? '10.5' : isHour ? '12' : '14'}
                x2="150"
                y2="19.5"
                stroke={isQuad ? '#fde68a' : isHour ? '#f8fafc' : 'rgba(226,232,240,0.34)'}
                strokeWidth={isQuad ? '2.2' : isHour ? '1.4' : '0.75'}
                strokeLinecap="round"
                transform={`rotate(${i * 6} 150 150)`}
              />
            );
          })}

          {/* 12 Faceted Gold Ecliptic Hour Diamonds */}
          {[...Array(12)].map((_, idx) => {
            const a = ((idx * 30 - 90) * Math.PI) / 180;
            const x = 150 + 134.5 * Math.cos(a);
            const y = 150 + 134.5 * Math.sin(a);
            const isCard = idx % 3 === 0;
            return isCard ? (
              <polygon
                key={idx}
                points={`${x},${y - 3.6} ${x + 2.8},${y} ${x},${y + 3.6} ${x - 2.8},${y}`}
                fill="#fde68a"
                stroke="#b45309"
                strokeWidth="0.5"
              />
            ) : (
              <circle key={idx} cx={x} cy={y} r="1.4" fill="rgba(248,250,252,0.75)" />
            );
          })}

          {/* Deep-Field Starry Background */}
          {DIAL_DEEP_STARS.map((s, idx) => (
            <circle key={idx} cx={s.x} cy={s.y} r={s.r} fill="#e0f2fe" fillOpacity={s.op * 0.85} />
          ))}

          {/* 6 Concentric Planetary Orbits + Main Asteroid Belt */}
          {[33, 47, 64, 80, 100, 118].map((r, idx) => (
            <circle
              key={r}
              cx="150"
              cy="150"
              r={r}
              fill="none"
              stroke={idx === 2 ? '#38bdf8' : '#fde68a'}
              strokeOpacity={idx === 2 ? '0.32' : '0.2'}
              strokeWidth={idx === 2 ? '0.95' : '0.75'}
              strokeDasharray={idx >= 4 ? '4 5' : undefined}
            />
          ))}
          <circle
            cx="150"
            cy="150"
            r="90"
            fill="none"
            stroke="rgba(226,232,240,0.34)"
            strokeWidth="2.2"
            strokeDasharray="1 5.5"
          />

          {/* Subtle Meridian Crosshairs */}
          <line x1="28" y1="150" x2="272" y2="150" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
          <line x1="150" y1="28" x2="150" y2="272" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />

          {/* Micro Horology Signatures */}
          <text
            x="150"
            y="26.5"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#fde68a"
            fillOpacity="0.82"
            fontSize="5.4"
            fontWeight="700"
            letterSpacing="2.2"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
          >
            SOLARIS ORRERY
          </text>
          {showDate && (
            <text
              x="150"
              y="273.5"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#cbd5e1"
              fillOpacity="0.85"
              fontSize="5.8"
              fontWeight="700"
              letterSpacing="1.6"
              fontFamily="'JetBrains Mono', ui-monospace, monospace"
            >
              {monthShort} {dayStr} • J2000
            </text>
          )}
        </g>
      )}

      {/* STYLE 16: SPIRAL GALAXY (Barred Spiral Nebula & Compass Star Indices) */}
      {styleId === 'galaxy' && (
        <g>
          <circle cx="150" cy="150" r="141" fill={`url(#${uid}-space-dome)`} stroke={borderAccent} strokeWidth="2.2" strokeOpacity="0.65" />
          <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.9" />
          <circle cx="150" cy="150" r="138" fill="none" stroke={secColor} strokeOpacity="0.22" strokeWidth="0.8" strokeDasharray="3 6" />

          {/* 60 Fine Stardust Minute Ticks */}
          {[...Array(60)].map((_, i) => {
            const isHour = i % 5 === 0;
            return (
              <line
                key={i}
                x1="150"
                y1={isHour ? '11.5' : '14.5'}
                x2="150"
                y2="19.5"
                stroke={isHour ? '#ffffff' : 'rgba(226,232,240,0.34)'}
                strokeWidth={isHour ? '1.5' : '0.7'}
                strokeLinecap="round"
                transform={`rotate(${i * 6} 150 150)`}
              />
            );
          })}

          {/* 4-Point Cardinal Compass Stars at 12, 3, 6, 9 */}
          {[0, 90, 180, 270].map((deg) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            const cx = 150 + 134 * Math.cos(rad);
            const cy = 150 + 134 * Math.sin(rad);
            const s = deg === 0 ? 5.2 : 4.1;
            return (
              <polygon
                key={deg}
                points={`${cx},${cy - s} ${cx + s * 0.28},${cy - s * 0.28} ${cx + s},${cy} ${cx + s * 0.28},${cy + s * 0.28} ${cx},${cy + s} ${cx - s * 0.28},${cy + s * 0.28} ${cx - s},${cy} ${cx - s * 0.28},${cy - s * 0.28}`}
                fill={deg === 0 ? secColor : '#f8fafc'}
              />
            );
          })}

          <text
            x="150"
            y="268"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#e2e8f0"
            fillOpacity="0.72"
            fontSize="5.4"
            fontWeight="700"
            letterSpacing="2.4"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
          >
            {showDate ? `NGC-72 • ${monthShort} ${dayStr}` : 'SPIRAL GALAXY'}
          </text>
        </g>
      )}

      {/* STYLE 17: ASTROLABE (Planispheric Stereographic Projection Plate) */}
      {styleId === 'astrolabe' && (
        <g>
          {/* Outer Engraved Brass/Silver Mater Limb */}
          <circle
            cx="150"
            cy="150"
            r="141"
            fill={isLight ? '#f5efe0' : '#0b1020'}
            stroke={isLight ? '#92400e' : '#d4af37'}
            strokeWidth="2.8"
            strokeOpacity="0.72"
          />
          <circle cx="150" cy="150" r="137.5" fill="none" stroke={isLight ? 'rgba(146,64,14,0.35)' : 'rgba(212,175,55,0.4)'} strokeWidth="0.9" />
          <circle cx="150" cy="150" r="118.5" fill="none" stroke={isLight ? '#92400e' : '#d4af37'} strokeWidth="1.6" strokeOpacity="0.7" />
          <circle
            cx="150"
            cy="150"
            r="116.5"
            fill={isLight ? '#ebe1c8' : '#0f172a'}
            stroke={isLight ? 'rgba(146,64,14,0.28)' : 'rgba(212,175,55,0.28)'}
            strokeWidth="0.8"
          />

          {/* 72 Five-Degree Limb Graduations */}
          {[...Array(72)].map((_, i) => {
            const isMajor = i % 6 === 0;
            return (
              <line
                key={i}
                x1="150"
                y1="10.5"
                x2="150"
                y2={isMajor ? '17.5' : '14.5'}
                stroke={isLight ? '#78350f' : '#e2c275'}
                strokeOpacity={isMajor ? '0.88' : '0.4'}
                strokeWidth={isMajor ? '1.3' : '0.7'}
                transform={`rotate(${i * 5} 150 150)`}
              />
            );
          })}

          {/* 12 Classical Roman Numerals on the Mater Limb */}
          {['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].map((rom, idx) => {
            const deg = idx * 30;
            const rad = ((deg - 90) * Math.PI) / 180;
            const x = 150 + 128 * Math.cos(rad);
            const y = 150 + 128 * Math.sin(rad);
            return (
              <text
                key={rom}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isLight ? '#451a03' : '#f3d997'}
                fontSize={idx % 3 === 0 ? '9.8' : '8.2'}
                fontWeight="700"
                fontFamily="Georgia, 'Times New Roman', serif"
              >
                {rom}
              </text>
            );
          })}

          {/* Stereographic Tympan (Climate Plate: Tropics, Almucantars, Azimuths) */}
          <g clipPath={`url(#${uid}-astrolabe-clip)`}>
            {/* Capricorn, Equator & Cancer Circles */}
            <circle cx="150" cy="150" r="106" fill="none" stroke={isLight ? 'rgba(120,53,15,0.34)' : 'rgba(212,175,55,0.3)'} strokeWidth="0.9" />
            <circle cx="150" cy="150" r="76" fill="none" stroke={isLight ? 'rgba(120,53,15,0.48)' : 'rgba(212,175,55,0.45)'} strokeWidth="1.05" strokeDasharray="3 3" />
            <circle cx="150" cy="150" r="46" fill="none" stroke={isLight ? 'rgba(120,53,15,0.34)' : 'rgba(212,175,55,0.3)'} strokeWidth="0.85" />

            {/* Stereographic Almucantar Altitude Circles Centered Toward Zenith */}
            {[
              { cy: 108, r: 22 },
              { cy: 102, r: 40 },
              { cy: 94, r: 60 },
              { cy: 84, r: 82 },
              { cy: 70, r: 108 },
            ].map((alm, idx) => (
              <circle
                key={idx}
                cx="150"
                cy={alm.cy}
                r={alm.r}
                fill="none"
                stroke={isLight ? 'rgba(120,53,15,0.24)' : 'rgba(148,163,184,0.28)'}
                strokeWidth={idx === 4 ? '1.15' : '0.75'}
              />
            ))}

            {/* Curved Azimuth Meridian Arcs Converging at Zenith (150, 108) */}
            {[-95, -52, -24, 24, 52, 95].map((offset, idx) => (
              <path
                key={idx}
                d={`M 150 108 Q ${150 + offset} 175 ${150 + offset * 1.45} 266`}
                fill="none"
                stroke={isLight ? 'rgba(120,53,15,0.2)' : 'rgba(148,163,184,0.22)'}
                strokeWidth="0.7"
              />
            ))}

            {/* Prime Meridian & East-West Celestial Axes */}
            <line x1="150" y1="34" x2="150" y2="266" stroke={isLight ? 'rgba(120,53,15,0.34)' : 'rgba(212,175,55,0.32)'} strokeWidth="0.85" />
            <line x1="34" y1="150" x2="266" y2="150" stroke={isLight ? 'rgba(120,53,15,0.34)' : 'rgba(212,175,55,0.32)'} strokeWidth="0.85" />
          </g>

          {showDate && (
            <g>
              <rect
                x="122"
                y="224"
                width="56"
                height="15"
                rx="7.5"
                fill={isLight ? '#f5efe0' : '#0b1020'}
                stroke={isLight ? '#92400e' : '#d4af37'}
                strokeWidth="0.9"
                strokeOpacity="0.75"
              />
              <text
                x="150"
                y="231.5"
                textAnchor="middle"
                dominantBaseline="central"
                fill={isLight ? '#78350f' : '#f3d997'}
                fontSize="6.4"
                fontWeight="700"
                letterSpacing="1"
                fontFamily="Georgia, 'Times New Roman', serif"
              >
                {monthShort} {dayStr}
              </text>
            </g>
          )}
        </g>
      )}

      {/* STYLE 18: SINGULARITY (Relativistic Black Hole & Gravitational Lensing) */}
      {styleId === 'blackhole' && (
        <g>
          <circle cx="150" cy="150" r="141" fill="#020308" stroke={borderAccent} strokeWidth="2.2" strokeOpacity="0.6" />
          <circle cx="150" cy="150" r="131" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />

          {/* Faint Background Gravitational-Well Coordinate Mesh */}
          {[70, 92, 114].map((r) => (
            <circle key={r} cx="150" cy="150" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.65" strokeDasharray="2 7" />
          ))}
          {DIAL_DEEP_STARS.slice(0, 34).map((s, idx) => (
            <circle key={idx} cx={s.x} cy={s.y} r={s.r * 0.85} fill="#e2e8f0" fillOpacity={s.op * 0.55} />
          ))}

          {/* Precision Telemetry Outer Chapter Ticks */}
          {[...Array(60)].map((_, i) => {
            const isHour = i % 5 === 0;
            const isQuad = i % 15 === 0;
            if (isQuad) return null;
            return (
              <line
                key={i}
                x1="150"
                y1={isHour ? '11.5' : '14.5'}
                x2="150"
                y2="19.5"
                stroke={isHour ? '#fde68a' : 'rgba(248,250,252,0.28)'}
                strokeWidth={isHour ? '1.6' : '0.7'}
                strokeLinecap="round"
                transform={`rotate(${i * 6} 150 150)`}
              />
            );
          })}

          {/* Bold Telemetry Cardinal Markers 00 / 03 / 06 / 09 */}
          {[
            { label: '12', x: 150, y: 18 },
            { label: '03', x: 282, y: 150 },
            { label: '06', x: 150, y: 282 },
            { label: '09', x: 18, y: 150 },
          ].map((m) => (
            <text
              key={m.label}
              x={m.x}
              y={m.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fffbeb"
              fontSize="9.5"
              fontWeight="800"
              letterSpacing="0.8"
              fontFamily="'JetBrains Mono', ui-monospace, monospace"
            >
              {m.label}
            </text>
          ))}

          <text
            x="150"
            y="264"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#fb923c"
            fillOpacity="0.78"
            fontSize="5.4"
            fontWeight="700"
            letterSpacing="2.2"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
          >
            {showDate ? `SINGULARITY • ${monthShort} ${dayStr}` : 'EVENT HORIZON'}
          </text>
        </g>
      )}

      {/* STYLE 19: AUTOMATON (Openworked Skeleton Mechanical Caliber) */}
      {styleId === 'gears' && (
        <g>
          {/* Outer Satin Metallic Chapter Bezel */}
          <circle
            cx="150"
            cy="150"
            r="141"
            fill={isLight ? '#e2e8f0' : '#0f172a'}
            stroke={borderAccent}
            strokeWidth="2.8"
            strokeOpacity="0.7"
          />
          <circle cx="150" cy="150" r="137" fill="none" stroke={hairline} strokeWidth="0.9" />

          {/* Recessed Dark Openworked Movement Cavity */}
          <circle
            cx="150"
            cy="150"
            r="116"
            fill={isLight ? '#141c2c' : '#070b14'}
            stroke={borderAccent}
            strokeWidth="1.6"
            strokeOpacity="0.6"
          />

          {/* Subtle Geneva Stripes on the Deep Mainplate */}
          <g clipPath={`url(#${uid}-gears-clip)`} opacity="0.24">
            {[...Array(11)].map((_, idx) => (
              <rect
                key={idx}
                x={36 + idx * 21}
                y="32"
                width="10"
                height="236"
                fill="rgba(255,255,255,0.12)"
              />
            ))}
          </g>

          {/* Engraved Caliber Signature */}
          <text
            x="150"
            y="53"
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(226,232,240,0.45)"
            fontSize="5.3"
            fontWeight="700"
            letterSpacing="2"
            fontFamily="'JetBrains Mono', ui-monospace, monospace"
          >
            CAL. VX-05 • 24 JEWELS
          </text>

          {/* 60 Precision Chapter Ring Ticks */}
          {[...Array(60)].map((_, i) => {
            const isHour = i % 5 === 0;
            const isQuad = i % 15 === 0;
            if (isQuad) return null;
            return (
              <line
                key={i}
                x1="150"
                y1={isHour ? '14' : '16.5'}
                x2="150"
                y2={isHour ? '27' : '22.5'}
                stroke={isHour ? majorTick : minorTick}
                strokeWidth={isHour ? '2.4' : '0.85'}
                strokeLinecap="round"
                transform={`rotate(${i * 6} 150 150)`}
              />
            );
          })}

          {/* Crisp Metallic Cardinal Numerals 60 / 15 / 30 / 45 */}
          {[
            { txt: '60', x: 150, y: 21 },
            { txt: '15', x: 279, y: 150 },
            { txt: '30', x: 150, y: 279 },
            { txt: '45', x: 21, y: 150 },
          ].map((c) => (
            <text
              key={c.txt}
              x={c.x}
              y={c.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={c.txt === '60' ? secColor : numColor}
              fontSize="10.2"
              fontWeight="800"
              fontFamily="'JetBrains Mono', ui-monospace, monospace"
            >
              {c.txt}
            </text>
          ))}

          {/* Four Chamfered Bezel Screws */}
          {[45, 135, 225, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const sx = 150 + 128 * Math.cos(rad);
            const sy = 150 + 128 * Math.sin(rad);
            return (
              <g key={deg}>
                <circle cx={sx} cy={sy} r="2.7" fill="#38bdf8" fillOpacity="0.85" stroke="#0f172a" strokeWidth="0.6" />
                <line x1={sx - 2} y1={sy - 1} x2={sx + 2} y2={sy + 1} stroke="#0f172a" strokeWidth="0.7" />
              </g>
            );
          })}

          {showDate && (
            <g>
              <rect x="64" y="142" width="32" height="16" rx="3" fill="rgba(2,6,23,0.88)" stroke="#d4af37" strokeWidth="0.9" />
              <text
                x="80"
                y="150"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fef08a"
                fontSize="8.2"
                fontWeight="800"
                fontFamily="'JetBrains Mono', ui-monospace, monospace"
              >
                {dayStr}
              </text>
            </g>
          )}
        </g>
      )}

      {/* STYLE 20: SYNTHWAVE (Retrofuturistic Sliced Sunset & 3D Laser Grid) */}
      {styleId === 'cyberwave' && (
        <g>
          {/* Outer Neon-Chrome Bezel */}
          <circle cx="150" cy="150" r="141" fill="#090418" stroke="#f472b6" strokeWidth="2.6" strokeOpacity="0.82" />
          <circle cx="150" cy="150" r="131" fill="none" stroke="#22d3ee" strokeWidth="1.2" strokeOpacity="0.75" />

          {/* Clipped Synthwave Panorama Inside r=130 */}
          <g clipPath={`url(#${uid}-dome-clip)`}>
            {/* Twilight Outrun Sky */}
            <rect x="18" y="18" width="264" height="146" fill={`url(#${uid}-synth-sky)`} />
            {/* Deep Neon Grid Floor */}
            <rect x="18" y="164" width="264" height="120" fill="#12052b" />

            {/* Retro Sky Stars */}
            {DIAL_DEEP_STARS.filter((s) => s.y < 146).map((s, idx) => (
              <circle key={idx} cx={s.x} cy={s.y} r={s.r} fill={idx % 3 === 0 ? '#67e8f9' : '#ffffff'} fillOpacity={s.op * 0.85} />
            ))}

            {/* Iconic Sliced Outrun Sunset */}
            <g clipPath={`url(#${uid}-synth-sun-clip)`}>
              <circle cx="150" cy="130" r="52" fill={`url(#${uid}-synth-sun)`} />
              {/* Horizontal Retrowave Scan Cutouts */}
              <rect x="94" y="132" width="112" height="2.4" fill="#2b0b52" />
              <rect x="94" y="139" width="112" height="3.2" fill="#3a0d63" />
              <rect x="94" y="147" width="112" height="4.2" fill="#4c1073" />
              <rect x="94" y="156" width="112" height="5.4" fill="#5e137e" />
            </g>

            {/* Twin Silhouetted Neon Wireframe Mountain Peaks Along Horizon */}
            <polygon
              points="18,164 52,130 78,148 106,120 132,164"
              fill="#0d0420"
              stroke="#22d3ee"
              strokeWidth="1.35"
              strokeLinejoin="round"
            />
            <polyline points="52,130 62,164 78,148 94,164 106,120 112,164" fill="none" stroke="#22d3ee" strokeOpacity="0.38" strokeWidth="0.8" />

            <polygon
              points="168,164 198,124 224,146 250,128 282,164"
              fill="#0d0420"
              stroke="#f472b6"
              strokeWidth="1.35"
              strokeLinejoin="round"
            />
            <polyline points="198,124 206,164 224,146 238,164 250,128 256,164" fill="none" stroke="#f472b6" strokeOpacity="0.4" strokeWidth="0.8" />

            {/* Neon Horizon Laser Line */}
            <line x1="18" y1="164" x2="282" y2="164" stroke="#f472b6" strokeWidth="2.2" />
            <line x1="18" y1="164" x2="282" y2="164" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.8" />

            {/* 3D Perspective Vanishing Rays Across Ground Plane */}
            {[-210, -145, -95, -55, -24, 0, 24, 55, 95, 145, 210].map((dx, idx) => (
              <line
                key={idx}
                x1="150"
                y1="164"
                x2={150 + dx}
                y2="286"
                stroke={idx % 2 === 0 ? '#ec4899' : '#22d3ee'}
                strokeOpacity="0.58"
                strokeWidth="0.95"
              />
            ))}
          </g>

          {/* Outer Bezel Retro Neon Markers */}
          {[...Array(12)].map((_, idx) => {
            const isCard = idx % 3 === 0;
            return (
              <rect
                key={idx}
                x={isCard ? '148.2' : '149'}
                y="10.5"
                width={isCard ? '3.6' : '2'}
                height={isCard ? '8.5' : '6'}
                rx="1"
                fill={idx === 0 ? '#fde047' : isCard ? '#22d3ee' : '#f472b6'}
                transform={`rotate(${idx * 30} 150 150)`}
              />
            );
          })}

          <text
            x="150"
            y="262"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#67e8f9"
            fontSize="6"
            fontWeight="800"
            letterSpacing="2.4"
            fontFamily="'Orbitron', 'JetBrains Mono', monospace"
          >
            {showDate ? `OUTRUN • ${weekdayShort} ${dayStr}` : 'SYNTHWAVE 84'}
          </text>
        </g>
      )}
    </g>
  );
});

export interface AnalogClockDialProps {
  styleId: AnalogStyle;
  motionMode: AnalogMotion;
  timezone: string;
  baseTime: Date;
  is24Hour: boolean;
  showSeconds: boolean;
  showDate: boolean;
  fontStyle: FontStyle;
  themeConfig: ThemeStyles;
  dayProgress: number;
  ampm: string;
}

export const AnalogClockDial: React.FC<AnalogClockDialProps> = ({
  styleId,
  motionMode,
  timezone,
  baseTime,
  is24Hour,
  showSeconds,
  showDate,
  fontStyle,
  themeConfig,
  dayProgress,
  ampm,
}) => {
  const uid = useId().replace(/:/g, '');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const isSweeping = motionMode === 'sweep' && showSeconds && !prefersReducedMotion;
  const [liveSnapshot, setLiveSnapshot] = useState<AnalogTimeSnapshot>(() =>
    getTimezoneSnapshot(Date.now(), timezone)
  );

  useEffect(() => {
    if (!isSweeping) return;
    let rafId = 0;
    const loop = () => {
      setLiveSnapshot(getTimezoneSnapshot(Date.now(), timezone));
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isSweeping, timezone]);

  const activeSnapshot: AnalogTimeSnapshot = useMemo(() => {
    if (isSweeping) return liveSnapshot;
    return {
      nowMs: baseTime.getTime(),
      hours24: baseTime.getHours(),
      minutes: baseTime.getMinutes(),
      seconds: baseTime.getSeconds(),
      milliseconds: 0,
      dayNum: baseTime.getDate(),
      weekdayShort: baseTime.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3).toUpperCase(),
      monthShort: baseTime.toLocaleDateString('en-US', { month: 'short' }).slice(0, 3).toUpperCase(),
    };
  }, [isSweeping, liveSnapshot, baseTime]);

  const secFloat = activeSnapshot.seconds + (isSweeping ? activeSnapshot.milliseconds / 1000 : 0);
  const continuousSec = activeSnapshot.nowMs / 1000;
  const secAngle = secFloat * 6;
  const minAngle = activeSnapshot.minutes * 6 + secFloat * 0.1;
  const hrAngle = (activeSnapshot.hours24 % 12) * 30 + activeSnapshot.minutes * 0.5 + secFloat * (0.5 / 60);

  const isLight = Boolean(themeConfig.isLight);
  const dialBase = themeConfig.dialBg;
  const borderAccent = themeConfig.dialBorder;
  const secColor = themeConfig.handSec;
  const minColor = themeConfig.handMin;
  const hrColor = themeConfig.handHr;
  const darkCavityHr = isLight ? '#fde68a' : hrColor;
  const darkCavityMin = isLight ? '#f8fafc' : minColor;
  const darkCavitySec = isLight ? '#38bdf8' : secColor;
  const bevelEdge = isLight ? 'rgba(15,23,42,0.2)' : 'rgba(255,255,255,0.22)';
  const shadowColor = isLight ? 'rgba(15,23,42,0.18)' : 'rgba(0,0,0,0.6)';
  const handShadowStyle = { filter: `drop-shadow(0 2px 4px ${shadowColor})` };

  const timezoneLabel = useMemo(() => {
    if (!timezone || timezone === 'local') return 'LOCAL';
    const segment = timezone.split('/').pop() || timezone;
    return segment.replace(/_/g, ' ').slice(0, 6).toUpperCase();
  }, [timezone]);

  // Pilot 6 o'clock day-reserve sub-dial needle angle (-135deg to +135deg)
  const pilotNeedleAngle = -135 + (Math.min(100, Math.max(0, dayProgress)) / 100) * 270;

  // Minute-bucketed lunar phase so static dial remains smoothly memoized during 60fps sweep
  const minuteBucket = Math.floor(baseTime.getTime() / 60000);
  const lunarPhase = useMemo(() => computeLunarPhaseFraction(minuteBucket * 60000), [minuteBucket]);

  // Live complication angles for Tourbillon cage, Chronograph sub-dials, Orbital nodes & 6 Showcase Dials
  const tourbillonCageAngle = (secFloat * 60) % 360;
  const chrono24Angle = ((activeSnapshot.hours24 + activeSnapshot.minutes / 60) / 24) * 360;

  const orbHrRad = (((hrAngle % 360) - 90) * Math.PI) / 180;
  const orbMinRad = (((minAngle % 360) - 90) * Math.PI) / 180;
  const orbSecRad = (((secAngle % 360) - 90) * Math.PI) / 180;
  const orbHrCirc = 2 * Math.PI * 64;
  const orbMinCirc = 2 * Math.PI * 94;
  const orbSecCirc = 2 * Math.PI * 124;

  // Real-time J2000 planetary longitudes (Solar System Orrery) & continuous motion angles
  const solarLongitudes = styleId === 'orrery' ? computeSolarSystemLongitudes(activeSnapshot.nowMs) : null;
  const solarCoronaAngle = (continuousSec * 8) % 360;
  const earthMoonAngle = (continuousSec * 42) % 360;
  const galaxySpinAngle = (continuousSec * 5.5) % 360;
  const galaxyCounterAngle = (-continuousSec * 1.6) % 360;
  const astrolabeReteAngle = (continuousSec * 4.5) % 360;
  const blackholePlasmaAngle = (continuousSec * 38) % 360;
  const blackholeRingAngle = (-continuousSec * 26) % 360;
  const balanceWheelAngle = prefersReducedMotion ? 0 : Math.sin(continuousSec * Math.PI * 8) * 26;

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl select-none">
      <defs>
        <radialGradient id={`${uid}-dial-depth`} cx="50%" cy="46%" r="55%">
          <stop offset="0%" stopColor={isLight ? '#ffffff' : '#ffffff'} stopOpacity={isLight ? '0.55' : '0.06'} />
          <stop offset="68%" stopColor={isLight ? '#e2e8f0' : '#000000'} stopOpacity="0" />
          <stop offset="100%" stopColor={isLight ? '#0f172a' : '#000000'} stopOpacity={isLight ? '0.09' : '0.38'} />
        </radialGradient>

        <radialGradient id={`${uid}-atelier-orb`} cx="35%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="35%" stopColor={secColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={borderAccent} stopOpacity="0.95" />
        </radialGradient>

        <radialGradient id={`${uid}-moon-glow`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fffbeb" stopOpacity="1" />
          <stop offset="60%" stopColor="#fde68a" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.92" />
        </radialGradient>

        <radialGradient id={`${uid}-space-dome`} cx="50%" cy="48%" r="54%">
          <stop offset="0%" stopColor="#0f1b3d" stopOpacity="1" />
          <stop offset="52%" stopColor="#070c1e" stopOpacity="1" />
          <stop offset="100%" stopColor="#02040a" stopOpacity="1" />
        </radialGradient>

        <radialGradient id={`${uid}-sun-core`} cx="45%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="36%" stopColor="#fef08a" stopOpacity="1" />
          <stop offset="72%" stopColor="#f59e0b" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.85" />
        </radialGradient>

        <radialGradient id={`${uid}-galaxy-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
          <stop offset="22%" stopColor="#fef08a" stopOpacity="0.85" />
          <stop offset="50%" stopColor={darkCavitySec} stopOpacity="0.42" />
          <stop offset="78%" stopColor="#7c3aed" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#02040a" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={`${uid}-orrery-comet`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
          <stop offset="60%" stopColor="#bae6fd" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.98" />
        </linearGradient>

        <radialGradient id={`${uid}-bh-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="28%" stopColor="#000000" stopOpacity="0" />
          <stop offset="46%" stopColor="#fb923c" stopOpacity="0.58" />
          <stop offset="64%" stopColor="#f59e0b" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={`${uid}-bh-disk`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#9a3412" stopOpacity="0.12" />
          <stop offset="20%" stopColor="#f97316" stopOpacity="0.88" />
          <stop offset="42%" stopColor="#fef08a" stopOpacity="0.98" />
          <stop offset="52%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="65%" stopColor="#fbbf24" stopOpacity="0.95" />
          <stop offset="84%" stopColor="#ea580c" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.1" />
        </linearGradient>

        <radialGradient id={`${uid}-ruby-jewel`} cx="35%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#fda4af" stopOpacity="1" />
          <stop offset="45%" stopColor="#e11d48" stopOpacity="1" />
          <stop offset="100%" stopColor="#881337" stopOpacity="1" />
        </radialGradient>

        <linearGradient id={`${uid}-synth-sky`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#060214" />
          <stop offset="48%" stopColor="#1e0742" />
          <stop offset="82%" stopColor="#581c87" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>

        <linearGradient id={`${uid}-synth-sun`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="38%" stopColor="#fb923c" />
          <stop offset="72%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#c026d3" />
        </linearGradient>

        <linearGradient id={`${uid}-radar-grad`} x1="15%" y1="65%" x2="95%" y2="5%">
          <stop offset="0%" stopColor={secColor} stopOpacity="0" />
          <stop offset="55%" stopColor={secColor} stopOpacity="0.09" />
          <stop offset="100%" stopColor={secColor} stopOpacity="0.28" />
        </linearGradient>

        <linearGradient id={`${uid}-glass-sheen`} x1="0%" y1="0%" x2="80%" y2="85%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={isLight ? '0.45' : '0.11'} />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <clipPath id={`${uid}-roman-clip`}>
          <circle cx="150" cy="150" r="76" />
        </clipPath>

        <clipPath id={`${uid}-geneva-clip`}>
          <path d="M 80 150 A 70 70 0 0 1 220 150 Z" />
        </clipPath>

        <clipPath id={`${uid}-moon-clip`}>
          <path d="M 110 202 A 40 40 0 0 1 190 202 Q 170 191 160 198 A 10.5 10.5 0 0 1 140 198 Q 130 191 110 202 Z" />
        </clipPath>

        <clipPath id={`${uid}-dome-clip`}>
          <circle cx="150" cy="150" r="130" />
        </clipPath>

        <clipPath id={`${uid}-astrolabe-clip`}>
          <circle cx="150" cy="150" r="116" />
        </clipPath>

        <clipPath id={`${uid}-gears-clip`}>
          <circle cx="150" cy="150" r="115" />
        </clipPath>

        <clipPath id={`${uid}-synth-sun-clip`}>
          <circle cx="150" cy="130" r="52" />
        </clipPath>

        <filter id={`${uid}-nebula-blur`} x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="5.2" />
        </filter>

        <filter id={`${uid}-bh-glow`} x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="3.0" />
        </filter>
      </defs>

      {/* Memoized Static Watch Dial Layers */}
      <AnalogDialFace
        uid={uid}
        styleId={styleId}
        themeConfig={themeConfig}
        fontStyle={fontStyle}
        is24Hour={is24Hour}
        showDate={showDate}
        dayProgress={dayProgress}
        ampm={ampm}
        dayNum={activeSnapshot.dayNum}
        weekdayShort={activeSnapshot.weekdayShort}
        monthShort={activeSnapshot.monthShort}
        timezoneLabel={timezoneLabel}
        lunarPhase={lunarPhase}
      />

      {/* Telemetry Dynamic Radar Sweep Cone */}
      {styleId === 'telemetry' && showSeconds && (
        <g transform={`rotate(${secAngle} 150 150)`} pointerEvents="none">
          <path
            d="M 150 150 L 65.7 56.4 A 126 126 0 0 1 150 24 Z"
            fill={`url(#${uid}-radar-grad)`}
          />
        </g>
      )}

      {/* Pilot Sub-Dial Live Needle */}
      {styleId === 'pilot' && (
        <g transform={`rotate(${pilotNeedleAngle} 150 204)`} pointerEvents="none">
          <line x1="150" y1="208" x2="150" y2="190" stroke={secColor} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="150" cy="204" r="2.2" fill={secColor} />
        </g>
      )}

      {/* Tourbillon Live Rotating Escapement Lyre Cage at 6 o'clock */}
      {styleId === 'tourbillon' && (
        <g pointerEvents="none">
          <g transform={`rotate(${tourbillonCageAngle} 150 198)`}>
            <circle cx="150" cy="198" r="21" fill="none" stroke={secColor} strokeWidth="1.4" strokeOpacity="0.85" />
            <circle cx="150" cy="198" r="14" fill="none" stroke={borderAccent} strokeWidth="1.1" strokeDasharray="3 2.5" />
            {[0, 120, 240].map((sp) => (
              <g key={sp} transform={`rotate(${sp} 150 198)`}>
                <line x1="150" y1="177" x2="150" y2="198" stroke={secColor} strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="150" cy="177" r="1.8" fill={borderAccent} />
              </g>
            ))}
          </g>
          <circle cx="150" cy="198" r="3.4" fill={secColor} stroke="#ffffff" strokeWidth="0.9" />
        </g>
      )}

      {/* Chronograph Live Tri-Compax Sub-Dial Needles */}
      {styleId === 'chronograph' && (
        <g pointerEvents="none">
          {/* 9h Running Seconds Sub-Dial Needle */}
          <g transform={`rotate(${secAngle} 102 150)`}>
            <line x1="102" y1="155" x2="102" y2="132" stroke={secColor} strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="102" cy="150" r="2.3" fill={secColor} />
          </g>
          {/* 3h 24-Hour Indicator Sub-Dial Needle */}
          <g transform={`rotate(${chrono24Angle} 198 150)`}>
            <line x1="198" y1="155" x2="198" y2="133" stroke={hrColor} strokeWidth="1.7" strokeLinecap="round" />
            <circle cx="198" cy="150" r="2.3" fill={hrColor} />
          </g>
          {/* 6h Minute Totalizer Sub-Dial Needle */}
          <g transform={`rotate(${minAngle} 150 198)`}>
            <line x1="150" y1="203" x2="150" y2="180" stroke={minColor} strokeWidth="1.7" strokeLinecap="round" />
            <circle cx="150" cy="198" r="2.3" fill={minColor} />
          </g>
        </g>
      )}

      {/* Orbital HUD Live Sweeping Progress Rings & Planetary Time Nodes */}
      {styleId === 'orbital' && (
        <g pointerEvents="none">
          {/* Hours Ring (r=64) */}
          <circle
            cx="150"
            cy="150"
            r="64"
            fill="none"
            stroke={hrColor}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray={orbHrCirc}
            strokeDashoffset={orbHrCirc * (1 - (hrAngle % 360) / 360)}
            transform="rotate(-90 150 150)"
          />
          <circle
            cx={150 + 64 * Math.cos(orbHrRad)}
            cy={150 + 64 * Math.sin(orbHrRad)}
            r="4.6"
            fill="#ffffff"
            stroke={hrColor}
            strokeWidth="2.2"
            style={{ filter: `drop-shadow(0 0 6px ${hrColor})` }}
          />

          {/* Minutes Ring (r=94) */}
          <circle
            cx="150"
            cy="150"
            r="94"
            fill="none"
            stroke={minColor}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray={orbMinCirc}
            strokeDashoffset={orbMinCirc * (1 - (minAngle % 360) / 360)}
            transform="rotate(-90 150 150)"
          />
          <circle
            cx={150 + 94 * Math.cos(orbMinRad)}
            cy={150 + 94 * Math.sin(orbMinRad)}
            r="4.8"
            fill="#ffffff"
            stroke={minColor}
            strokeWidth="2.2"
            style={{ filter: `drop-shadow(0 0 6px ${minColor})` }}
          />

          {/* Seconds Orbit Ring (r=124) */}
          {showSeconds && (
            <>
              <circle
                cx="150"
                cy="150"
                r="124"
                fill="none"
                stroke={secColor}
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeDasharray={orbSecCirc}
                strokeDashoffset={orbSecCirc * (1 - (secAngle % 360) / 360)}
                transform="rotate(-90 150 150)"
              />
              <circle
                cx={150 + 124 * Math.cos(orbSecRad)}
                cy={150 + 124 * Math.sin(orbSecRad)}
                r="5.2"
                fill="#ffffff"
                stroke={secColor}
                strokeWidth="2.2"
                style={{ filter: `drop-shadow(0 0 8px ${secColor})` }}
              />
            </>
          )}
        </g>
      )}

      {/* STYLE 15 DYNAMIC: SOLAR SYSTEM ORRERY LIVE PLANETS, MOON & COMET */}
      {styleId === 'orrery' && solarLongitudes && (
        <g pointerEvents="none">
          {/* Central Radiant Sun with Slowly Rotating Solar Corona */}
          <circle cx="150" cy="150" r="24" fill="#f59e0b" fillOpacity="0.2" />
          <g transform={`rotate(${solarCoronaAngle} 150 150)`} opacity="0.65">
            {[...Array(12)].map((_, idx) => (
              <line
                key={idx}
                x1="150"
                y1="131.5"
                x2="150"
                y2="136.5"
                stroke="#fde68a"
                strokeWidth={idx % 2 === 0 ? '1.6' : '1'}
                strokeLinecap="round"
                transform={`rotate(${idx * 30} 150 150)`}
              />
            ))}
          </g>
          <circle
            cx="150"
            cy="150"
            r="13.5"
            fill={`url(#${uid}-sun-core)`}
            style={{ filter: 'drop-shadow(0 0 10px rgba(251,191,36,0.8))' }}
          />

          {/* 6 Real-Time J2000 Heliocentric Planets */}
          {(() => {
            const pos = (deg: number, r: number) => {
              const rad = ((deg - 90) * Math.PI) / 180;
              return { x: 150 + r * Math.cos(rad), y: 150 + r * Math.sin(rad) };
            };
            const merc = pos(solarLongitudes.mercury, 33);
            const venus = pos(solarLongitudes.venus, 47);
            const earth = pos(solarLongitudes.earth, 64);
            const mars = pos(solarLongitudes.mars, 80);
            const jup = pos(solarLongitudes.jupiter, 100);
            const sat = pos(solarLongitudes.saturn, 118);
            const moonRad = ((earthMoonAngle - 90) * Math.PI) / 180;
            const moonX = earth.x + 9.4 * Math.cos(moonRad);
            const moonY = earth.y + 9.4 * Math.sin(moonRad);

            return (
              <>
                {/* Mercury */}
                <circle cx={merc.x} cy={merc.y} r="2.8" fill="#cbd5e1" stroke="#475569" strokeWidth="0.6" />

                {/* Venus */}
                <circle cx={venus.x} cy={venus.y} r="5.6" fill="#fde68a" fillOpacity="0.2" />
                <circle cx={venus.x} cy={venus.y} r="4.0" fill="#fde68a" stroke="#d97706" strokeWidth="0.6" />

                {/* Earth + Live Orbiting Moon */}
                <circle cx={earth.x} cy={earth.y} r="9.4" fill="none" stroke="rgba(186,230,253,0.34)" strokeWidth="0.6" />
                <circle cx={earth.x} cy={earth.y} r="6.8" fill="#38bdf8" fillOpacity="0.22" />
                <circle cx={earth.x} cy={earth.y} r="4.6" fill="#0284c7" stroke="#bae6fd" strokeWidth="0.7" />
                <path
                  d={`M ${earth.x - 2.4} ${earth.y - 1.2} Q ${earth.x} ${earth.y - 2.6} ${earth.x + 2.2} ${earth.y + 0.4} Q ${earth.x} ${earth.y + 2.2} ${earth.x - 1.8} ${earth.y + 1.2} Z`}
                  fill="#22c55e"
                  fillOpacity="0.88"
                />
                <circle cx={moonX} cy={moonY} r="1.75" fill="#f1f5f9" stroke="#64748b" strokeWidth="0.4" />

                {/* Mars */}
                <circle cx={mars.x} cy={mars.y} r="5.2" fill="#f97316" fillOpacity="0.2" />
                <circle cx={mars.x} cy={mars.y} r="3.6" fill="#ea580c" stroke="#fdba74" strokeWidth="0.55" />
                <circle cx={mars.x - 0.8} cy={mars.y - 1.6} r="0.8" fill="#fff7ed" fillOpacity="0.8" />

                {/* Jupiter with Cloud Bands & Great Red Spot */}
                <circle cx={jup.x} cy={jup.y} r="9.8" fill="#fdba74" fillOpacity="0.18" />
                <circle cx={jup.x} cy={jup.y} r="6.9" fill="#fed7aa" stroke="#b45309" strokeWidth="0.7" />
                <line x1={jup.x - 6.1} y1={jup.y - 2.1} x2={jup.x + 6.1} y2={jup.y - 2.1} stroke="#c2410c" strokeWidth="1.4" strokeOpacity="0.7" />
                <line x1={jup.x - 6.4} y1={jup.y + 1.2} x2={jup.x + 6.4} y2={jup.y + 1.2} stroke="#9a3412" strokeWidth="1.2" strokeOpacity="0.65" />
                <ellipse cx={jup.x + 2.1} cy={jup.y + 2.2} rx="1.6" ry="1.05" fill="#dc2626" />

                {/* Saturn with Authentic Back/Front Tilted Double Rings */}
                <g transform={`rotate(-24 ${sat.x} ${sat.y})`}>
                  <path
                    d={`M ${sat.x - 12.6} ${sat.y} A 12.6 4.1 0 0 1 ${sat.x + 12.6} ${sat.y}`}
                    fill="none"
                    stroke="#fde68a"
                    strokeWidth="2.4"
                    strokeOpacity="0.75"
                  />
                  <circle cx={sat.x} cy={sat.y} r="5.5" fill="#fef08a" stroke="#b45309" strokeWidth="0.65" />
                  <path
                    d={`M ${sat.x - 12.6} ${sat.y} A 12.6 4.1 0 0 0 ${sat.x + 12.6} ${sat.y}`}
                    fill="none"
                    stroke="#fef3c7"
                    strokeWidth="2.5"
                    strokeOpacity="0.92"
                  />
                  <path
                    d={`M ${sat.x - 9.8} ${sat.y} A 9.8 3.1 0 0 0 ${sat.x + 9.8} ${sat.y}`}
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="0.9"
                    strokeOpacity="0.65"
                  />
                </g>
              </>
            );
          })()}

          {/* Live Sweeping Comet Synced to Seconds Hand */}
          {showSeconds && (
            <g transform={`rotate(${secAngle} 150 150)`}>
              <path
                d="M 88 41 A 126.5 126.5 0 0 1 150 23.5"
                fill="none"
                stroke={`url(#${uid}-orrery-comet)`}
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              <circle cx="150" cy="23.5" r="5.5" fill="#38bdf8" fillOpacity="0.35" />
              <circle cx="150" cy="23.5" r="2.3" fill="#ffffff" />
            </g>
          )}
        </g>
      )}

      {/* STYLE 16 DYNAMIC: SPIRAL GALAXY ROTATING NEBULA & STAR CLUSTERS */}
      {styleId === 'galaxy' && (
        <g clipPath={`url(#${uid}-dome-clip)`} pointerEvents="none">
          {/* Counter-Drifting Deep Background Starfield */}
          <g transform={`rotate(${galaxyCounterAngle} 150 150)`}>
            {DIAL_DEEP_STARS.map((s, idx) => (
              <circle key={idx} cx={s.x} cy={s.y} r={s.r} fill="#cbd5e1" fillOpacity={s.op * 0.65} />
            ))}
          </g>

          {/* Rotating 4-Arm Barred Spiral Galaxy */}
          <g transform={`rotate(${galaxySpinAngle} 150 150)`}>
            <circle cx="150" cy="150" r="95" fill={`url(#${uid}-galaxy-core)`} />
            <g filter={`url(#${uid}-nebula-blur)`}>
              {DIAL_GALAXY_ARMS.map((arm, idx) => {
                const armCol = arm.tone === 'c1' ? darkCavitySec : arm.tone === 'c2' ? '#a855f7' : '#38bdf8';
                return (
                  <g key={idx}>
                    <path d={arm.main} fill="none" stroke={armCol} strokeWidth="18" strokeOpacity="0.34" strokeLinecap="round" />
                    <path d={arm.main} fill="none" stroke={armCol} strokeWidth="8.5" strokeOpacity="0.46" strokeLinecap="round" />
                    <path d={arm.sub} fill="none" stroke="#f472b6" strokeWidth="6.5" strokeOpacity="0.32" strokeLinecap="round" />
                    <path d={arm.main} fill="none" stroke="#e0f2fe" strokeWidth="2.4" strokeOpacity="0.38" strokeLinecap="round" />
                  </g>
                );
              })}
              {/* Soft Diffused Galactic Bar Aura */}
              <ellipse cx="150" cy="150" rx="28" ry="11" transform="rotate(14 150 150)" fill="#fef08a" fillOpacity="0.58" />
            </g>

            {/* Glowing Tilted Galactic Core Bar */}
            <ellipse cx="150" cy="150" rx="18" ry="6.8" transform="rotate(14 150 150)" fill="#fef08a" fillOpacity="0.52" />
            <ellipse cx="150" cy="150" rx="11" ry="4.4" transform="rotate(14 150 150)" fill="#ffffff" fillOpacity="0.92" />

            {/* Spiral Arm Star Clusters & H-II Regions */}
            {DIAL_GALAXY_STARS.map((st, idx) => {
              const col =
                st.hue === 'white'
                  ? '#ffffff'
                  : st.hue === 'gold'
                    ? '#fde68a'
                    : st.hue === 'pink'
                      ? '#f472b6'
                      : st.hue === 'c1'
                        ? darkCavitySec
                        : '#7dd3fc';
              return <circle key={idx} cx={st.x} cy={st.y} r={st.r} fill={col} fillOpacity={st.op} />;
            })}
          </g>
        </g>
      )}

      {/* STYLE 17 DYNAMIC: ASTROLABE ROTATING GOLDEN ZODIAC RETE & STAR POINTERS */}
      {styleId === 'astrolabe' && (
        <g clipPath={`url(#${uid}-astrolabe-clip)`} pointerEvents="none">
          <g transform={`rotate(${astrolabeReteAngle} 150 150)`}>
            {/* Pierced Equatorial Support Arcs */}
            <circle
              cx="150"
              cy="150"
              r="105"
              fill="none"
              stroke={isLight ? '#92400e' : '#d4af37'}
              strokeWidth="2.4"
              strokeOpacity="0.62"
              strokeDasharray="68 24"
            />
            <line
              x1="46"
              y1="150"
              x2="254"
              y2="150"
              stroke={isLight ? '#92400e' : '#d4af37'}
              strokeWidth="1.6"
              strokeOpacity="0.55"
            />
            <line
              x1="150"
              y1="46"
              x2="150"
              y2="254"
              stroke={isLight ? '#92400e' : '#d4af37'}
              strokeWidth="1.6"
              strokeOpacity="0.55"
            />

            {/* Authentic Off-Center Ecliptic Zodiac Ring */}
            <circle
              cx="150"
              cy="126"
              r="76"
              fill="none"
              stroke={isLight ? '#78350f' : '#f5d08a'}
              strokeWidth="6.2"
              strokeOpacity="0.82"
            />
            <circle
              cx="150"
              cy="126"
              r="76"
              fill="none"
              stroke={isLight ? '#fef3c7' : '#0f172a'}
              strokeWidth="1.1"
              strokeDasharray="1.6 38.2"
            />
            <circle
              cx="150"
              cy="126"
              r="79.2"
              fill="none"
              stroke={isLight ? '#b45309' : '#fde68a'}
              strokeWidth="0.9"
            />
            <circle
              cx="150"
              cy="126"
              r="72.8"
              fill="none"
              stroke={isLight ? '#b45309' : '#fde68a'}
              strokeWidth="0.9"
            />

            {/* 6 Ornate Flame-Curved Astrolabe Star Pointers */}
            {[
              { x1: 150, y1: 50, qx: 162, qy: 72, x2: 156, y2: 88 },
              { x1: 222, y1: 126, qx: 204, qy: 112, x2: 188, y2: 118 },
              { x1: 78, y1: 126, qx: 96, qy: 112, x2: 112, y2: 118 },
              { x1: 204, y1: 180, qx: 184, qy: 174, x2: 176, y2: 160 },
              { x1: 96, y1: 180, qx: 116, qy: 174, x2: 124, y2: 160 },
              { x1: 150, y1: 202, qx: 140, qy: 186, x2: 148, y2: 174 },
            ].map((sp, idx) => (
              <g key={idx}>
                <path
                  d={`M ${sp.x1} ${sp.y1} Q ${sp.qx} ${sp.qy} ${sp.x2} ${sp.y2}`}
                  fill="none"
                  stroke={isLight ? '#78350f' : '#fde68a'}
                  strokeWidth="2.1"
                  strokeLinecap="round"
                />
                <circle cx={sp.x2} cy={sp.y2} r="2.1" fill={isLight ? '#d97706' : '#ffffff'} />
              </g>
            ))}
          </g>
        </g>
      )}

      {/* STYLE 18 DYNAMIC: SINGULARITY (Gargantua Gravitational Lensing & Relativistic Accretion) */}
      {styleId === 'blackhole' && (
        <g clipPath={`url(#${uid}-dome-clip)`} pointerEvents="none">
          {/* Gravitational Lensing Corona Halo */}
          <circle cx="150" cy="150" r="88" fill={`url(#${uid}-bh-halo)`} />

          {/* Tilted Relativistic Accretion Plane (-16 deg) */}
          <g transform="rotate(-16 150 150)">
            {/* Seamless Gravitationally Lensed Upper & Lower Light Envelope (Blurred Relativistic Bloom) */}
            <g filter={`url(#${uid}-bh-glow)`}>
              <ellipse cx="150" cy="146" rx="58" ry="52" fill="none" stroke="#f97316" strokeWidth="11" strokeOpacity="0.34" />
              <ellipse cx="150" cy="147" rx="51" ry="45" fill="none" stroke="#fde68a" strokeWidth="4.8" strokeOpacity="0.62" />
              <ellipse cx="150" cy="153" rx="46" ry="39" fill="none" stroke="#ea580c" strokeWidth="7.5" strokeOpacity="0.28" />
              <path
                d="M 30 150 A 120 27 0 0 1 270 150"
                fill="none"
                stroke={`url(#${uid}-bh-disk)`}
                strokeWidth="13"
                strokeOpacity="0.54"
                strokeLinecap="round"
              />
            </g>

            {/* Fine Continuous Relativistic Lensing Caustics */}
            <ellipse cx="150" cy="148" rx="46" ry="41" fill="none" stroke="#fffbeb" strokeWidth="1.25" strokeOpacity="0.55" />
            <ellipse cx="150" cy="152" rx="43" ry="37" fill="none" stroke="#fbbf24" strokeWidth="1.2" strokeOpacity="0.4" />

            {/* Back-Half Equatorial Accretion Disk */}
            <path
              d="M 32 150 A 118 27 0 0 1 268 150"
              fill="none"
              stroke={`url(#${uid}-bh-disk)`}
              strokeWidth="8.5"
              strokeOpacity="0.62"
              strokeLinecap="round"
            />

            {/* Event Horizon Pure Obsidian Shadow Sphere + Incandescent Photon Ring */}
            <circle cx="150" cy="150" r="35.5" fill="#000000" />
            <circle cx="150" cy="150" r="36.2" fill="none" stroke="#fb923c" strokeWidth="2.4" strokeOpacity="0.88" />
            <circle cx="150" cy="150" r="35.2" fill="none" stroke="#fffbeb" strokeWidth="1.15" strokeOpacity="0.95" />

            {/* Shimmering Einstein Photon Ring Arc */}
            <g transform={`rotate(${blackholeRingAngle} 150 150)`}>
              <circle
                cx="150"
                cy="150"
                r="38.2"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.4"
                strokeDasharray="24 44 12 68"
                strokeLinecap="round"
                strokeOpacity="0.85"
              />
            </g>

            {/* Front-Half Sweeping Relativistic Accretion Disk Crossing In Front of the Shadow */}
            <path
              d="M 28 150 A 122 28 0 0 0 272 150"
              fill="none"
              stroke="#ea580c"
              strokeWidth="15"
              strokeOpacity="0.38"
              strokeLinecap="round"
              filter={`url(#${uid}-bh-glow)`}
            />
            <path d="M 34 150 A 116 25 0 0 0 266 150" fill="none" stroke={`url(#${uid}-bh-disk)`} strokeWidth="7.5" strokeLinecap="round" />
            <path d="M 48 150 A 102 20 0 0 0 252 150" fill="none" stroke="#fffbeb" strokeWidth="2.2" strokeOpacity="0.92" strokeLinecap="round" />

            {/* Live Orbiting Doppler-Beamed Relativistic Plasma Filaments */}
            {[0, 120, 240].map((offset, idx) => {
              const deg = (blackholePlasmaAngle + offset) % 360;
              const rad = (deg * Math.PI) / 180;
              const rx = idx === 0 ? 104 : idx === 1 ? 84 : 64;
              const ry = rx * 0.21;
              const px = 150 + rx * Math.cos(rad);
              const py = 150 + ry * Math.sin(rad);
              // Hide plasma particles passing behind the event horizon shadow (upper half inside r=36)
              const behindHole = Math.sin(rad) < 0 && Math.abs(px - 150) < 37;
              if (behindHole) return null;
              return (
                <g key={idx}>
                  <ellipse cx={px} cy={py} rx={5.5 - idx * 0.8} ry="1.8" fill="#fef08a" fillOpacity="0.88" />
                  <circle cx={px} cy={py} r="1.4" fill="#ffffff" />
                </g>
              );
            })}
          </g>
        </g>
      )}

      {/* STYLE 19 DYNAMIC: AUTOMATON 5-WHEEL MESHING GEAR TRAIN & 4HZ BALANCE WHEEL */}
      {styleId === 'gears' && (
        <g clipPath={`url(#${uid}-gears-clip)`} pointerEvents="none">
          {/* 5 Mathematically Meshing Counter-Rotating Toothed Wheels */}
          {AUTOMATON_GEARS.map((g) => {
            const angle = (g.phaseOffset + continuousSec * g.speedDegPerSec) % 360;
            const fillCol =
              g.tone === 'gold'
                ? '#d4af37'
                : g.tone === 'steel'
                  ? '#94a3b8'
                  : g.tone === 'bronze'
                    ? '#c27849'
                    : g.tone === 'accent'
                      ? darkCavitySec
                      : '#cbd5e1';
            const strokeCol =
              g.tone === 'gold'
                ? '#fef08a'
                : g.tone === 'bronze'
                  ? '#fdba74'
                  : g.tone === 'accent'
                    ? '#ffffff'
                    : '#e2e8f0';

            return (
              <g key={g.id}>
                <g transform={`rotate(${angle} ${g.cx} ${g.cy})`}>
                  {/* Outer Toothed Gear Rim */}
                  <path d={g.path} fill={fillCol} fillOpacity="0.88" stroke={strokeCol} strokeWidth="0.65" strokeOpacity="0.7" />
                  {/* Openworked Cavity Cutout */}
                  <circle cx={g.cx} cy={g.cy} r={g.innerR} fill="#090e1a" stroke={fillCol} strokeWidth="1.2" />
                  {/* Sculpted Spokes */}
                  {[...Array(g.spokes)].map((_, spIdx) => (
                    <line
                      key={spIdx}
                      x1={g.cx}
                      y1={g.cy - g.innerR}
                      x2={g.cx}
                      y2={g.cy}
                      stroke={fillCol}
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      transform={`rotate(${(spIdx * 360) / g.spokes} ${g.cx} ${g.cy})`}
                    />
                  ))}
                  {/* Central Collet Hub */}
                  <circle cx={g.cx} cy={g.cy} r={g.hubR} fill={fillCol} stroke={strokeCol} strokeWidth="0.65" />
                </g>
                {/* Synthetic Ruby Pivot Bearing */}
                <circle cx={g.cx} cy={g.cy} r={g.id === 'barrel' ? 3.2 : 2.5} fill={`url(#${uid}-ruby-jewel)`} stroke="#fde68a" strokeWidth="0.7" />
              </g>
            );
          })}

          {/* Openworked Architectural Movement Bridges */}
          <path
            d="M 52 106 Q 100 76 150 150"
            fill="none"
            stroke="#475569"
            strokeWidth="5.2"
            strokeLinecap="round"
            strokeOpacity="0.62"
          />
          <path
            d="M 52 106 Q 100 76 150 150"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="0.8"
            strokeOpacity="0.45"
          />
          <path
            d="M 150 150 Q 198 104 238 148"
            fill="none"
            stroke="#475569"
            strokeWidth="4.6"
            strokeLinecap="round"
            strokeOpacity="0.58"
          />

          {/* Live 4Hz Oscillating Swiss Balance Wheel & Spiral Hairspring at (168, 204) */}
          <g>
            {/* Stationary Blued-Steel Balance Cock */}
            <path d="M 168 204 L 216 230" stroke="#38bdf8" strokeWidth="3.2" strokeLinecap="round" strokeOpacity="0.75" />
            {/* Coiled Spiral Hairspring */}
            <path d={BALANCE_HAIRSPRING_PATH} fill="none" stroke="#38bdf8" strokeWidth="0.9" strokeOpacity="0.88" />
            {/* Oscillating Balance Rim + Poise Screws */}
            <g transform={`rotate(${balanceWheelAngle} 168 204)`}>
              <circle cx="168" cy="204" r="20" fill="none" stroke="#f5d08a" strokeWidth="2.8" />
              <line x1="148" y1="204" x2="188" y2="204" stroke="#f5d08a" strokeWidth="2" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                return (
                  <circle
                    key={deg}
                    cx={168 + 21.5 * Math.cos(rad)}
                    cy={204 + 21.5 * Math.sin(rad)}
                    r="1.15"
                    fill="#fde68a"
                  />
                );
              })}
            </g>
            {/* Incabloc Ruby Shock Jewel */}
            <circle cx="168" cy="204" r="3.4" fill={`url(#${uid}-ruby-jewel)`} stroke="#fde68a" strokeWidth="0.95" />
          </g>
        </g>
      )}

      {/* STYLE 20 DYNAMIC: SYNTHWAVE SCROLLING 3D LASER PERSPECTIVE GRID */}
      {styleId === 'cyberwave' && (
        <g clipPath={`url(#${uid}-dome-clip)`} pointerEvents="none">
          {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
            const phase = ((idx / 7) + (prefersReducedMotion ? 0 : continuousSec * 0.3)) % 1;
            const y = 164 + Math.pow(phase, 2.2) * 120;
            return (
              <line
                key={idx}
                x1="18"
                y1={y}
                x2="282"
                y2={y}
                stroke={idx % 2 === 0 ? '#f472b6' : '#22d3ee'}
                strokeWidth={0.65 + phase * 1.45}
                strokeOpacity={0.28 + phase * 0.7}
              />
            );
          })}
        </g>
      )}

      {/* ================= HOUR HAND BY STYLE ================= */}
      <g transform={`rotate(${hrAngle} 150 150)`} style={handShadowStyle}>
        {styleId === 'chronometer' && (
          <>
            <polygon
              points="150,162 144.6,146 147.6,76 150,70 152.4,76 155.4,146"
              fill={hrColor}
              stroke={bevelEdge}
              strokeWidth="0.7"
            />
            <polygon points="150,162 150,70 152.4,76 155.4,146" fill="#000000" fillOpacity="0.22" />
            <line x1="150" y1="138" x2="150" y2="83" stroke="#ffffff" strokeOpacity="0.72" strokeWidth="1.4" strokeLinecap="round" />
          </>
        )}

        {styleId === 'bauhaus' && (
          <polygon
            points="146.3,162 146.3,82 150,75 153.7,82 153.7,162"
            fill={hrColor}
            stroke={bevelEdge}
            strokeWidth="0.7"
          />
        )}

        {styleId === 'diver' && (
          <>
            <rect x="147.3" y="105" width="5.4" height="55" rx="1.4" fill={hrColor} stroke={bevelEdge} strokeWidth="0.7" />
            <circle cx="150" cy="97.5" r="8.4" fill={dialBase} stroke={hrColor} strokeWidth="2.8" />
            <line x1="150" y1="97.5" x2="150" y2="89.5" stroke={hrColor} strokeWidth="1.6" />
            <line x1="150" y1="97.5" x2="156.9" y2="101.5" stroke={hrColor} strokeWidth="1.6" />
            <line x1="150" y1="97.5" x2="143.1" y2="101.5" stroke={hrColor} strokeWidth="1.6" />
            <polygon points="147.2,90 150,74 152.8,90" fill={hrColor} />
          </>
        )}

        {styleId === 'roman' && (
          <>
            <polygon points="148.2,158 148.8,94 151.2,94 151.8,158" fill={hrColor} />
            <circle cx="150" cy="161" r="2.6" fill={hrColor} />
            <circle cx="150" cy="88" r="5.8" fill="none" stroke={hrColor} strokeWidth="2.5" />
            <polygon points="148.7,82.5 150,67 151.3,82.5" fill={hrColor} />
          </>
        )}

        {styleId === 'pilot' && (
          <>
            <polygon
              points="150,162 144.8,144 146.5,84 150,72 153.5,84 155.2,144"
              fill={hrColor}
              stroke={bevelEdge}
              strokeWidth="0.9"
            />
            <polygon points="147.8,138 148,87 150,78 152,87 152.2,138" fill="#ffffff" fillOpacity="0.32" />
          </>
        )}

        {styleId === 'atelier' && (
          <polygon
            points="150,158 147.4,144 148.6,78 150,71 151.4,78 152.6,144"
            fill={hrColor}
          />
        )}

        {styleId === 'telemetry' && (
          <>
            <polygon
              points="146.5,160 144.8,104 150,73 155.2,104 153.5,160"
              fill={dialBase}
              fillOpacity="0.35"
              stroke={hrColor}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <polygon points="147.8,90 150,73 152.2,90" fill={hrColor} />
          </>
        )}

        {styleId === 'california' && (
          <>
            <polygon
              points="148,158 146.2,112 144.4,102 150,72 155.6,102 153.8,112 152,158"
              fill={hrColor}
              stroke={bevelEdge}
              strokeWidth="0.7"
            />
            <polygon
              points="147,108 146.3,102 150,79 153.7,102 153,108"
              fill="#ffffff"
              fillOpacity="0.45"
            />
          </>
        )}

        {styleId === 'tourbillon' && (
          <>
            <polygon
              points="150,162 145.6,142 147.2,86 150,72 152.8,86 154.4,142"
              fill={dialBase}
              fillOpacity="0.28"
              stroke={hrColor}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <polygon points="148,91 150,72 152,91" fill={hrColor} />
          </>
        )}

        {styleId === 'celestial' && (
          <>
            <path d="M 148,158 C 145.2,126 145.8,98 150,71 C 154.2,98 154.8,126 152,158 Z" fill={hrColor} stroke={bevelEdge} strokeWidth="0.7" />
            <circle cx="150" cy="86" r="2" fill="#ffffff" fillOpacity="0.65" />
          </>
        )}

        {styleId === 'chronograph' && (
          <>
            <rect x="146.8" y="84" width="6.4" height="74" rx="1.8" fill={hrColor} stroke={bevelEdge} strokeWidth="0.7" />
            <polygon points="147.8,85 150,70 152.2,85" fill={hrColor} />
            <line x1="150" y1="138" x2="150" y2="88" stroke="#ffffff" strokeOpacity="0.78" strokeWidth="1.6" strokeLinecap="round" />
          </>
        )}

        {styleId === 'artdeco' && (
          <>
            <polygon points="150,164 144.8,142 147.4,84 150,69 152.6,84 155.2,142" fill={hrColor} stroke={bevelEdge} strokeWidth="0.8" />
            <polygon points="150,164 150,69 152.6,84 155.2,142" fill="#000000" fillOpacity="0.22" />
          </>
        )}

        {styleId === 'orbital' && (
          <>
            <line x1="150" y1="150" x2="150" y2="86" stroke={hrColor} strokeWidth="2.6" strokeOpacity="0.88" strokeLinecap="round" />
            <line x1="150" y1="150" x2="150" y2="164" stroke={hrColor} strokeWidth="2.6" strokeOpacity="0.45" strokeLinecap="round" />
          </>
        )}

        {styleId === 'kintsugi' && (
          <>
            <polygon points="150,162 146.5,146 148.2,80 150,70 151.8,80 153.5,146" fill={hrColor} />
            <line x1="150" y1="142" x2="150" y2="75" stroke={borderAccent} strokeWidth="0.7" strokeOpacity="0.5" />
          </>
        )}

        {styleId === 'orrery' && (
          <>
            <polygon
              points="148.2,158 147.4,96 150,72 152.6,96 151.8,158"
              fill="#fde68a"
              stroke="#78350f"
              strokeWidth="0.8"
            />
            <polygon points="150,79 152,88 150,95 148,88" fill="#ffffff" />
          </>
        )}

        {styleId === 'galaxy' && (
          <>
            <polygon
              points="150,164 146.4,144 148,80 150,69 152,80 153.6,144"
              fill={darkCavityHr}
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            <line x1="150" y1="138" x2="150" y2="78" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}

        {styleId === 'astrolabe' && (
          <>
            <polygon
              points="148,162 148.4,98 151.6,98 152,162"
              fill={isLight ? '#78350f' : '#f5d08a'}
              stroke={isLight ? '#451a03' : '#78350f'}
              strokeWidth="0.6"
            />
            <circle cx="150" cy="90" r="6.2" fill="none" stroke={isLight ? '#78350f' : '#f5d08a'} strokeWidth="2.2" />
            <circle cx="150" cy="90" r="2.2" fill={isLight ? '#d97706' : '#fffbeb'} />
            <polygon points="148.4,84 150,69 151.6,84" fill={isLight ? '#78350f' : '#f5d08a'} />
          </>
        )}

        {styleId === 'blackhole' && (
          <>
            <polygon
              points="150,162 145.8,142 147.6,84 150,70 152.4,84 154.2,142"
              fill="#020617"
              stroke="#fde68a"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
            <polygon points="148.2,90 150,72 151.8,90" fill="#fffbeb" />
          </>
        )}

        {styleId === 'gears' && (
          <>
            <polygon
              points="150,162 145.2,142 146.6,86 150,70 153.4,86 154.8,142"
              fill="rgba(2,6,23,0.45)"
              stroke={darkCavityHr}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <polygon points="148,92 150,71 152,92" fill="#ffffff" />
          </>
        )}

        {styleId === 'cyberwave' && (
          <>
            <polygon
              points="150,162 146,144 147.8,82 150,69 152.2,82 154,144"
              fill="#090418"
              stroke="#22d3ee"
              strokeWidth="2"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 6px #22d3ee)' }}
            />
            <line x1="150" y1="138" x2="150" y2="78" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" />
          </>
        )}
      </g>

      {/* ================= MINUTE HAND BY STYLE ================= */}
      <g transform={`rotate(${minAngle} 150 150)`} style={handShadowStyle}>
        {styleId === 'chronometer' && (
          <>
            <polygon
              points="150,166 146.2,146 148.5,43 150,35 151.5,43 153.8,146"
              fill={minColor}
              stroke={bevelEdge}
              strokeWidth="0.7"
            />
            <polygon points="150,166 150,35 151.5,43 153.8,146" fill="#000000" fillOpacity="0.2" />
            <line x1="150" y1="138" x2="150" y2="50" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}

        {styleId === 'bauhaus' && (
          <polygon
            points="147.4,166 147.4,40 150,33 152.6,40 152.6,166"
            fill={minColor}
            stroke={bevelEdge}
            strokeWidth="0.6"
          />
        )}

        {styleId === 'diver' && (
          <>
            <polygon
              points="147.5,164 146.8,108 148.4,42 150,35 151.6,42 153.2,108 152.5,164"
              fill={minColor}
              stroke={bevelEdge}
              strokeWidth="0.7"
            />
            <line x1="150" y1="132" x2="150" y2="49" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1.6" strokeLinecap="round" />
          </>
        )}

        {styleId === 'roman' && (
          <>
            <polygon points="148.4,162 149.1,59 150,32 150.9,59 151.6,162" fill={minColor} />
            <circle cx="150" cy="54" r="3.8" fill="none" stroke={minColor} strokeWidth="2.1" />
          </>
        )}

        {styleId === 'pilot' && (
          <>
            <polygon
              points="150,165 146.5,144 147.8,44 150,33 152.2,44 153.5,144"
              fill={minColor}
              stroke={bevelEdge}
              strokeWidth="0.8"
            />
            <polygon points="148.8,138 148.8,47 150,39 151.2,47 151.2,138" fill="#ffffff" fillOpacity="0.35" />
          </>
        )}

        {styleId === 'atelier' && (
          <polygon points="150,162 148.2,146 149,38 150,31 151,38 151.8,146" fill={minColor} />
        )}

        {styleId === 'telemetry' && (
          <>
            <polygon
              points="147.3,164 146.2,63 150,33 153.8,63 152.7,164"
              fill={dialBase}
              fillOpacity="0.35"
              stroke={minColor}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <polygon points="148.2,52 150,33 151.8,52" fill={minColor} />
          </>
        )}

        {styleId === 'california' && (
          <>
            <rect x="148" y="62" width="4" height="100" rx="1" fill={minColor} stroke={bevelEdge} strokeWidth="0.6" />
            <polygon points="149,62 150,34 151,62" fill={minColor} />
          </>
        )}

        {styleId === 'tourbillon' && (
          <>
            <polygon
              points="150,166 146.8,145 148,54 150,34 152,54 153.2,145"
              fill={dialBase}
              fillOpacity="0.28"
              stroke={minColor}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <polygon points="148.4,54 150,34 151.6,54" fill={minColor} />
          </>
        )}

        {styleId === 'celestial' && (
          <path d="M 148.4,162 C 146.4,122 147,68 150,33 C 153,68 153.6,122 151.6,162 Z" fill={minColor} stroke={bevelEdge} strokeWidth="0.6" />
        )}

        {styleId === 'chronograph' && (
          <>
            <rect x="147.6" y="48" width="4.8" height="114" rx="1.4" fill={minColor} stroke={bevelEdge} strokeWidth="0.6" />
            <polygon points="148.4,49 150,33 151.6,49" fill={minColor} />
            <line x1="150" y1="138" x2="150" y2="52" stroke="#ffffff" strokeOpacity="0.78" strokeWidth="1.4" strokeLinecap="round" />
          </>
        )}

        {styleId === 'artdeco' && (
          <>
            <polygon points="150,166 146.4,145 148.2,48 150,32 151.8,48 153.6,145" fill={minColor} stroke={bevelEdge} strokeWidth="0.7" />
            <polygon points="150,166 150,32 151.8,48 153.6,145" fill="#000000" fillOpacity="0.2" />
          </>
        )}

        {styleId === 'orbital' && (
          <>
            <line x1="150" y1="150" x2="150" y2="56" stroke={minColor} strokeWidth="2" strokeOpacity="0.9" strokeLinecap="round" />
            <line x1="150" y1="150" x2="150" y2="165" stroke={minColor} strokeWidth="2" strokeOpacity="0.45" strokeLinecap="round" />
          </>
        )}

        {styleId === 'kintsugi' && (
          <>
            <polygon points="150,165 147.4,146 148.7,44 150,32 151.3,44 152.6,146" fill={minColor} />
            <line x1="150" y1="142" x2="150" y2="38" stroke={borderAccent} strokeWidth="0.6" strokeOpacity="0.5" />
          </>
        )}

        {styleId === 'orrery' && (
          <>
            <polygon
              points="148.8,162 148.4,50 150,32 151.6,50 151.2,162"
              fill="#f8fafc"
              stroke="#0f172a"
              strokeWidth="0.7"
            />
            <circle cx="150" cy="48" r="2.2" fill="#fde68a" />
          </>
        )}

        {styleId === 'galaxy' && (
          <>
            <polygon
              points="150,166 147.4,145 148.7,42 150,31 151.3,42 152.6,145"
              fill={darkCavityMin}
              stroke="#ffffff"
              strokeWidth="0.65"
            />
            <line x1="150" y1="138" x2="150" y2="40" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
          </>
        )}

        {styleId === 'astrolabe' && (
          <>
            <polygon
              points="148.6,164 149,54 150,32 151,54 151.4,164"
              fill={isLight ? '#451a03' : '#fffbeb'}
            />
            <path
              d="M 146.5,58 A 4.4,4.4 0 1,1 153.5,58 A 3.4,3.4 0 1,0 146.5,58 Z"
              fill={isLight ? '#92400e' : '#fde68a'}
            />
          </>
        )}

        {styleId === 'blackhole' && (
          <>
            <polygon
              points="150,166 147,145 148.4,48 150,32 151.6,48 153,145"
              fill="#020617"
              stroke="#ffffff"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <polygon points="148.8,52 150,33 151.2,52" fill="#fde68a" />
          </>
        )}

        {styleId === 'gears' && (
          <>
            <polygon
              points="150,166 146.6,145 148,50 150,32 152,50 153.4,145"
              fill="rgba(2,6,23,0.45)"
              stroke={darkCavityMin}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <polygon points="148.6,54 150,33 151.4,54" fill="#ffffff" />
          </>
        )}

        {styleId === 'cyberwave' && (
          <>
            <polygon
              points="150,166 147.2,145 148.6,44 150,31 151.4,44 152.8,145"
              fill="#090418"
              stroke="#f472b6"
              strokeWidth="1.9"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 6px #f472b6)' }}
            />
            <line x1="150" y1="138" x2="150" y2="40" stroke="#ffffff" strokeWidth="1.15" strokeLinecap="round" />
          </>
        )}
      </g>

      {/* ================= SECOND HAND BY STYLE ================= */}
      {showSeconds && (
        <g transform={`rotate(${secAngle} 150 150)`}>
          {styleId === 'bauhaus' ? (
            <>
              <line x1="150" y1="184" x2="150" y2="164" stroke={secColor} strokeWidth="4.5" strokeLinecap="butt" />
              <line x1="150" y1="164" x2="150" y2="52" stroke={secColor} strokeWidth="2.3" strokeLinecap="round" />
              <circle
                cx="150"
                cy="49"
                r="8.2"
                fill={secColor}
                style={{ filter: `drop-shadow(0 0 6px ${secColor})` }}
              />
              <circle cx="150" cy="49" r="3" fill="#ffffff" fillOpacity="0.4" />
            </>
          ) : styleId === 'diver' ? (
            <>
              <line x1="150" y1="178" x2="150" y2="33" stroke={secColor} strokeWidth="2" strokeLinecap="round" />
              <circle cx="150" cy="52" r="4" fill="#ffffff" stroke={secColor} strokeWidth="1.8" />
              <circle cx="150" cy="173" r="3.4" fill={secColor} />
            </>
          ) : styleId === 'atelier' ? (
            <>
              <line x1="150" y1="166" x2="150" y2="29" stroke={secColor} strokeWidth="1.35" strokeLinecap="round" />
              <circle cx="150" cy="171" r="3.4" fill="none" stroke={secColor} strokeWidth="1.3" />
            </>
          ) : styleId === 'telemetry' ? (
            <>
              <line x1="150" y1="174" x2="150" y2="27" stroke={secColor} strokeWidth="1.6" strokeLinecap="round" />
              <circle
                cx="150"
                cy="33"
                r="2.6"
                fill="#ffffff"
                stroke={secColor}
                strokeWidth="1.5"
                style={{ filter: `drop-shadow(0 0 6px ${secColor})` }}
              />
            </>
          ) : styleId === 'roman' ? (
            <>
              <line x1="150" y1="168" x2="150" y2="31" stroke={secColor} strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="150" cy="172.5" r="3.4" fill="none" stroke={secColor} strokeWidth="1.4" />
            </>
          ) : styleId === 'celestial' ? (
            <>
              <line x1="150" y1="172" x2="150" y2="30" stroke={secColor} strokeWidth="1.4" strokeLinecap="round" />
              <path d="M 150,171 A 4.8,4.8 0 1,0 154,179 A 3.8,3.8 0 1,1 150,171 Z" fill={secColor} />
            </>
          ) : styleId === 'chronograph' ? (
            <>
              <line x1="150" y1="172" x2="150" y2="32" stroke={secColor} strokeWidth="1.6" strokeLinecap="round" />
              <polygon points="150,30 146.8,43 153.2,43" fill={secColor} />
              <circle cx="150" cy="176" r="4" fill="none" stroke={secColor} strokeWidth="1.6" />
            </>
          ) : styleId === 'orbital' ? (
            <>
              <line
                x1="150"
                y1="162"
                x2="150"
                y2="26"
                stroke={secColor}
                strokeWidth="1.4"
                strokeOpacity="0.82"
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 5px ${secColor})` }}
              />
            </>
          ) : styleId === 'kintsugi' ? (
            <>
              <line x1="150" y1="172" x2="150" y2="28" stroke={secColor} strokeWidth="1.4" strokeLinecap="round" />
              <polygon points="150,165 152.5,174 150,183 147.5,174" fill="none" stroke={secColor} strokeWidth="1.2" />
            </>
          ) : styleId === 'orrery' ? (
            <>
              <line x1="150" y1="168" x2="150" y2="26" stroke="#7dd3fc" strokeWidth="1.2" strokeOpacity="0.72" strokeLinecap="round" />
              <circle cx="150" cy="172" r="2.8" fill="none" stroke="#fde68a" strokeWidth="1.1" />
            </>
          ) : styleId === 'galaxy' ? (
            <>
              <line
                x1="150"
                y1="172"
                x2="150"
                y2="28"
                stroke={darkCavitySec}
                strokeWidth="1.4"
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 5px ${darkCavitySec})` }}
              />
              <polygon points="150,168 153,174 150,180 147,174" fill="#ffffff" />
            </>
          ) : styleId === 'astrolabe' ? (
            <>
              <line x1="150" y1="174" x2="150" y2="30" stroke={isLight ? '#b45309' : '#f59e0b'} strokeWidth="1.35" strokeLinecap="round" />
              <circle cx="150" cy="178" r="3.4" fill="none" stroke={isLight ? '#b45309' : '#f59e0b'} strokeWidth="1.2" />
            </>
          ) : styleId === 'blackhole' ? (
            <>
              <line
                x1="150"
                y1="172"
                x2="150"
                y2="28"
                stroke="#fb923c"
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 6px #fb923c)' }}
              />
              <circle cx="150" cy="30" r="2.4" fill="#ffffff" />
            </>
          ) : styleId === 'gears' ? (
            <>
              <line
                x1="150"
                y1="176"
                x2="150"
                y2="27"
                stroke={darkCavitySec}
                strokeWidth="1.55"
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 5px ${darkCavitySec})` }}
              />
              <circle cx="150" cy="174" r="3.2" fill="none" stroke={darkCavitySec} strokeWidth="1.4" />
            </>
          ) : styleId === 'cyberwave' ? (
            <>
              <line
                x1="150"
                y1="174"
                x2="150"
                y2="26"
                stroke="#fde047"
                strokeWidth="1.55"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 6px #fde047)' }}
              />
              <circle cx="150" cy="31" r="2.4" fill="#ffffff" />
            </>
          ) : (
            <>
              <line x1="150" y1="150" x2="150" y2="177" stroke={secColor} strokeWidth="2.6" strokeLinecap="round" />
              <polygon points="150,164 153.6,172 150,181 146.4,172" fill={secColor} />
              <line
                x1="150"
                y1="150"
                x2="150"
                y2="30"
                stroke={secColor}
                strokeWidth="1.8"
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 5px ${secColor})` }}
              />
            </>
          )}
        </g>
      )}

      {/* Center Pivot Cap */}
      <circle
        cx="150"
        cy="150"
        r={styleId === 'atelier' || styleId === 'orrery' || styleId === 'blackhole' ? '4.8' : '6.8'}
        fill={
          styleId === 'orrery'
            ? '#fde68a'
            : styleId === 'blackhole'
              ? '#000000'
              : styleId === 'cyberwave'
                ? '#22d3ee'
                : styleId === 'gears'
                  ? `url(#${uid}-ruby-jewel)`
                  : secColor
        }
        stroke={styleId === 'blackhole' ? '#fb923c' : isLight ? '#ffffff' : '#020617'}
        strokeWidth="1.8"
      />
      <circle
        cx="150"
        cy="150"
        r="2.0"
        fill={styleId === 'blackhole' ? '#fffbeb' : isLight ? '#0f172a' : '#ffffff'}
      />

      {/* Subtle Curved Sapphire Crystal Specular Sheen */}
      <circle cx="150" cy="150" r="141" fill={`url(#${uid}-glass-sheen)`} pointerEvents="none" />
    </svg>
  );
};

export const RadialStyleGlyph: React.FC<{ styleId: RadialStyle; className?: string }> = ({
  styleId,
  className = 'w-4 h-4 shrink-0',
}) => {
  switch (styleId) {
    case 'chronograph':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.6" />
          <path d="M 10 2 A 8 8 0 1 1 3.2 14.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 10 4.8 A 5.2 5.2 0 1 1 5.6 12.8" stroke="currentColor" strokeOpacity="0.72" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="10" r="1.4" fill="currentColor" />
        </svg>
      );
    case 'solar_orbit':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none">
          <circle cx="10" cy="10" r="2.2" fill="#fbbf24" />
          <circle cx="10" cy="10" r="5.4" stroke="#38bdf8" strokeOpacity="0.55" strokeWidth="1" />
          <circle cx="10" cy="10" r="8.2" stroke="#f59e0b" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="2 1.6" />
          <circle cx="14.2" cy="6.6" r="1.35" fill="#38bdf8" />
          <g transform="translate(5.5 14.5) rotate(-25)">
            <ellipse cx="0" cy="0" rx="3.2" ry="1.1" stroke="#fde68a" strokeWidth="0.9" />
            <circle cx="0" cy="0" r="1.4" fill="#f59e0b" />
          </g>
        </svg>
      );
    case 'galaxy_vortex':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none">
          <circle cx="10" cy="10" r="2.1" fill="#fef08a" />
          <path d="M 10 10 C 13 6, 17 8, 16.5 13" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M 10 10 C 7 14, 3 12, 3.5 7" stroke="#c084fc" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="14.5" cy="4.8" r="0.8" fill="#ffffff" />
          <circle cx="5.2" cy="15.2" r="0.8" fill="#7dd3fc" />
        </svg>
      );
    case 'supernova':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none">
          <circle cx="10" cy="10" r="7.5" stroke="#a855f7" strokeOpacity="0.5" strokeWidth="1.4" strokeDasharray="3 2" />
          <line x1="10" y1="1.8" x2="10" y2="18.2" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="2.2" y1="10" x2="17.8" y2="10" stroke="#f472b6" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="10" cy="10" r="2.6" fill="#ffffff" stroke="#38bdf8" strokeWidth="1" />
        </svg>
      );
    case 'blackhole_lens':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none">
          <circle cx="10" cy="10" r="4" fill="#020617" stroke="#fb923c" strokeWidth="1.4" />
          <ellipse cx="10" cy="10" rx="8.4" ry="2.6" transform="rotate(-18 10 10)" stroke="#fde68a" strokeWidth="1.4" />
          <path d="M 6.2 8.2 A 4.8 4.4 0 0 1 13.8 8.2" stroke="#f97316" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'cyber_hud':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none">
          <path d="M 3 7 V 3 H 7 M 13 3 H 17 V 7 M 17 13 V 17 H 13 M 7 17 H 3 V 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="10" cy="10" r="4.6" stroke="currentColor" strokeWidth="1.3" strokeDasharray="4 2" />
          <polygon points="10,4.2 11.4,6.4 8.6,6.4" fill="currentColor" />
        </svg>
      );
    case 'segmented_led':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, idx) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            const active = idx < 6;
            return (
              <line
                key={deg}
                x1={10 + 5.2 * Math.cos(rad)}
                y1={10 + 5.2 * Math.sin(rad)}
                x2={10 + 8.0 * Math.cos(rad)}
                y2={10 + 8.0 * Math.sin(rad)}
                stroke="currentColor"
                strokeOpacity={active ? 1 : 0.25}
                strokeWidth="2.1"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      );
    case 'turbine':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="10" r="2.2" fill="currentColor" />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <path
              key={deg}
              d="M 10 7.8 Q 13 5.5 16.5 5.2"
              transform={`rotate(${deg} 10 10)`}
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
            />
          ))}
        </svg>
      );
    case 'waveform':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
          <path
            d="M 2.5 10 Q 5 5.5 7.5 10 T 12.5 10 T 17.5 10"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="15.5" cy="7" r="1.4" fill="currentColor" />
        </svg>
      );
    case 'dna_helix':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none">
          <path d="M 3 5 Q 10 15 17 5" stroke="#22d3ee" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M 3 15 Q 10 5 17 15" stroke="#f472b6" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="6.5" y1="8.2" x2="6.5" y2="11.8" stroke="currentColor" strokeWidth="1.2" />
          <line x1="10" y1="6.8" x2="10" y2="13.2" stroke="currentColor" strokeWidth="1.2" />
          <line x1="13.5" y1="8.2" x2="13.5" y2="11.8" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'synth_prism':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none">
          <circle cx="10" cy="9.5" r="6.8" fill="#ec4899" fillOpacity="0.22" stroke="#f472b6" strokeWidth="1.4" />
          <line x1="4" y1="11.5" x2="16" y2="11.5" stroke="#fde047" strokeWidth="1.3" />
          <line x1="5" y1="14" x2="15" y2="14" stroke="#22d3ee" strokeWidth="1.3" />
          <polygon points="10,4.5 13.5,10 6.5,10" stroke="#fde047" strokeWidth="1.2" fill="none" />
        </svg>
      );
    case 'fractal_mandala':
    default:
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse
              key={deg}
              cx="10"
              cy="5.2"
              rx="1.6"
              ry="3.2"
              transform={`rotate(${deg} 10 10)`}
              stroke="currentColor"
              strokeWidth="1.05"
            />
          ))}
        </svg>
      );
  }
};

export interface RadialClockGaugeProps {
  styleId: RadialStyle;
  motionMode: AnalogMotion;
  timezone: string;
  baseTime: Date;
  is24Hour: boolean;
  showSeconds: boolean;
  showDate: boolean;
  fontStyle: FontStyle;
  fontClassName: string;
  animationTextClass: string;
  themeConfig: ThemeStyles;
  isFullscreen: boolean;
}

export const RadialClockGauge: React.FC<RadialClockGaugeProps> = ({
  styleId,
  motionMode,
  timezone,
  baseTime,
  is24Hour,
  showSeconds,
  showDate,
  fontStyle,
  fontClassName,
  animationTextClass,
  themeConfig,
  isFullscreen,
}) => {
  const rUid = useId().replace(/:/g, '');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const hasKineticLoop =
    motionMode === 'sweep' &&
    !prefersReducedMotion &&
    (showSeconds || !['chronograph', 'segmented_led'].includes(styleId));

  const [liveSnapshot, setLiveSnapshot] = useState<AnalogTimeSnapshot>(() =>
    getTimezoneSnapshot(Date.now(), timezone)
  );

  useEffect(() => {
    if (!hasKineticLoop) return;
    let rafId = 0;
    const loop = () => {
      setLiveSnapshot(getTimezoneSnapshot(Date.now(), timezone));
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [hasKineticLoop, timezone]);

  const activeSnapshot: AnalogTimeSnapshot = useMemo(() => {
    if (hasKineticLoop) return liveSnapshot;
    return {
      nowMs: baseTime.getTime(),
      hours24: baseTime.getHours(),
      minutes: baseTime.getMinutes(),
      seconds: baseTime.getSeconds(),
      milliseconds: 0,
      dayNum: baseTime.getDate(),
      weekdayShort: baseTime.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3).toUpperCase(),
      monthShort: baseTime.toLocaleDateString('en-US', { month: 'short' }).slice(0, 3).toUpperCase(),
    };
  }, [hasKineticLoop, liveSnapshot, baseTime]);

  const isSweeping = motionMode === 'sweep' && !prefersReducedMotion;
  const maxHours = is24Hour ? 24 : 12;
  const secFloat = activeSnapshot.seconds + (isSweeping ? activeSnapshot.milliseconds / 1000 : 0);
  const minFloat = activeSnapshot.minutes + secFloat / 60;
  const hrFloat = (activeSnapshot.hours24 % maxHours) + minFloat / 60;
  const continuousSec = activeSnapshot.nowMs / 1000;

  const hrProgress = Math.min(1, Math.max(0.002, hrFloat / maxHours));
  const minProgress = Math.min(1, Math.max(0.002, minFloat / 60));
  const secProgress = Math.min(
    1,
    Math.max(0.002, isSweeping ? secFloat / 60 : (activeSnapshot.seconds + 1) / 60)
  );

  let dispH = activeSnapshot.hours24;
  let localAmpm = '';
  if (!is24Hour) {
    localAmpm = dispH >= 12 ? 'PM' : 'AM';
    dispH = dispH % 12 || 12;
  }
  const hoursStr = dispH.toString().padStart(2, '0');
  const minutesStr = activeSnapshot.minutes.toString().padStart(2, '0');
  const secondsStr = activeSnapshot.seconds.toString().padStart(2, '0');
  const liveDayProgress = Math.round(
    ((activeSnapshot.hours24 * 3600 + activeSnapshot.minutes * 60 + activeSnapshot.seconds) / 86400) * 100
  );
  const isWideFont = fontStyle === 'digital' || fontStyle === 'minimal';

  // Ring geometry anchored strictly to RADIAL_GAUGE_CONFIG
  const cx = RADIAL_GAUGE_CONFIG.center;
  const cy = RADIAL_GAUGE_CONFIG.center;
  const r1Radius = RADIAL_GAUGE_CONFIG.hoursRadius;
  const r2Radius = RADIAL_GAUGE_CONFIG.minutesRadius;
  const r3Radius = RADIAL_GAUGE_CONFIG.secondsRadius;
  const innerR = RADIAL_GAUGE_CONFIG.innerChamberRadius;

  const r1Circ = 2 * Math.PI * r1Radius;
  const r2Circ = 2 * Math.PI * r2Radius;
  const r3Circ = 2 * Math.PI * r3Radius;

  const r1Offset = r1Circ * (1 - hrProgress);
  const r2Offset = r2Circ * (1 - minProgress);
  const r3Offset = r3Circ * (1 - secProgress);

  const r1TipRad = ((hrProgress * 360 - 90) * Math.PI) / 180;
  const r1TipX = cx + r1Radius * Math.cos(r1TipRad);
  const r1TipY = cy + r1Radius * Math.sin(r1TipRad);
  const r1Deg = hrProgress * 360;

  const r2TipRad = ((minProgress * 360 - 90) * Math.PI) / 180;
  const r2TipX = cx + r2Radius * Math.cos(r2TipRad);
  const r2TipY = cy + r2Radius * Math.sin(r2TipRad);
  const r2Deg = minProgress * 360;

  const r3TipRad = ((secProgress * 360 - 90) * Math.PI) / 180;
  const r3TipX = cx + r3Radius * Math.cos(r3TipRad);
  const r3TipY = cy + r3Radius * Math.sin(r3TipRad);
  const r3Deg = secProgress * 360;

  // Color system with dark cosmic cavity contrast protection
  const isLight = Boolean(themeConfig.isLight);
  const isDarkChamber = RADIAL_DARK_CHAMBER_STYLES.has(styleId);
  const useLightInkOnDark = isLight && isDarkChamber;

  const boostDark = isDarkChamber || !isLight;
  const ringHr = boostDark ? ensureBrightHex(themeConfig.handHr, '#fbbf24') : themeConfig.handHr;
  const ringMin = boostDark ? ensureBrightHex(themeConfig.handMin, '#38bdf8') : themeConfig.handMin;
  const ringSec = boostDark ? ensureBrightHex(themeConfig.handSec, '#f43f5e') : themeConfig.handSec;
  const ringBorder = boostDark ? ensureBrightHex(themeConfig.dialBorder, '#38bdf8') : themeConfig.dialBorder;

  const trackStroke = isDarkChamber
    ? 'rgba(255,255,255,0.11)'
    : isLight
      ? 'rgba(15,23,42,0.10)'
      : 'rgba(255,255,255,0.09)';

  // Kinetic motion angles
  const kineticSec = prefersReducedMotion ? 0 : continuousSec;
  const galaxySpinDeg = (kineticSec * 6.5) % 360;
  const galaxyCounterDeg = (-kineticSec * 2.2) % 360;
  const turbineSpinDeg = (kineticSec * 16) % 360;
  const turbineStatorDeg = (-kineticSec * 6) % 360;
  const hudVernierDeg = (kineticSec * 4) % 360;
  const earthMoonDeg = (kineticSec * 46) % 360;
  const blackholePlasmaDeg = (kineticSec * 36) % 360;
  const mandalaOuterDeg = (kineticSec * 3.5) % 360;
  const mandalaInnerDeg = (-kineticSec * 5.2) % 360;
  const solarLongitudes = styleId === 'solar_orbit' ? computeSolarSystemLongitudes(activeSnapshot.nowMs) : null;

  // Real-time Polar Wave & Toroidal Helix geometries
  const wavePhase = kineticSec * 3.4;
  const waveHr =
    styleId === 'waveform' ? buildPolarHarmonicPath(cx, cy, r1Radius, 2.3, 12, wavePhase, hrProgress, 72) : null;
  const waveMin =
    styleId === 'waveform'
      ? buildPolarHarmonicPath(cx, cy, r2Radius, 2.5, 18, -wavePhase * 1.25, minProgress, 84)
      : null;
  const waveSec =
    styleId === 'waveform' && showSeconds
      ? buildPolarHarmonicPath(cx, cy, r3Radius, 2.5, 24, wavePhase * 1.6, secProgress, 84)
      : null;
  const waveGhostHr =
    styleId === 'waveform' ? buildPolarHarmonicPath(cx, cy, r1Radius, 2.3, 12, wavePhase, 1, 72).d : '';
  const waveGhostMin =
    styleId === 'waveform' ? buildPolarHarmonicPath(cx, cy, r2Radius, 2.5, 18, -wavePhase * 1.25, 1, 84).d : '';
  const waveGhostSec =
    styleId === 'waveform' && showSeconds
      ? buildPolarHarmonicPath(cx, cy, r3Radius, 2.5, 24, wavePhase * 1.6, 1, 84).d
      : '';

  const helixData =
    styleId === 'dna_helix' ? buildToroidalHelixData(cx, cy, r2Radius, 9.2, 12, kineticSec * 1.4, 48) : null;

  // Center text classes
  const clockTextClass = useLightInkOnDark
    ? 'text-white drop-shadow-[0_0_24px_rgba(56,189,248,0.65)]'
    : themeConfig.clockText;
  const accentTextClass = useLightInkOnDark ? 'text-sky-300' : themeConfig.accent;
  const badgeClass = useLightInkOnDark ? 'bg-sky-400/20 text-sky-200 border-sky-400/40' : themeConfig.badgeBg;
  const subTextClass = useLightInkOnDark ? 'text-slate-300' : themeConfig.subText || 'text-slate-400';

  const dateMicroLabel = `${activeSnapshot.weekdayShort} ${activeSnapshot.monthShort} ${activeSnapshot.dayNum}`;

  return (
    <div
      style={
        isFullscreen
          ? ({ '--radial-d': 'clamp(16rem, min(72vh, 84vw), 46rem)' } as React.CSSProperties)
          : undefined
      }
      className={`relative flex items-center justify-center ${
        isFullscreen
          ? 'w-[var(--radial-d)] h-[var(--radial-d)]'
          : 'w-72 h-72 sm:w-80 sm:h-80 md:w-[25rem] md:h-[25rem]'
      }`}
    >
      <svg
        viewBox={`0 0 ${RADIAL_GAUGE_CONFIG.viewBoxSize} ${RADIAL_GAUGE_CONFIG.viewBoxSize}`}
        className="w-full h-full drop-shadow-2xl select-none"
      >
        <defs>
          <radialGradient id={`${rUid}-space-lens`} cx="50%" cy="48%" r="54%">
            <stop offset="0%" stopColor="#0f1b3d" stopOpacity="0.96" />
            <stop offset="56%" stopColor="#060b1c" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#02040a" stopOpacity="1" />
          </radialGradient>

          <radialGradient id={`${rUid}-bh-lens`} cx="50%" cy="50%" r="54%">
            <stop offset="0%" stopColor="#000000" stopOpacity="1" />
            <stop offset="56%" stopColor="#040208" stopOpacity="0.99" />
            <stop offset="100%" stopColor="#0d0512" stopOpacity="1" />
          </radialGradient>

          <radialGradient id={`${rUid}-galaxy-core`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#02040a" stopOpacity="0.95" />
            <stop offset="48%" stopColor="#091028" stopOpacity="0.88" />
            <stop offset="72%" stopColor={ringMin} stopOpacity="0.34" />
            <stop offset="88%" stopColor="#a855f7" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#02040a" stopOpacity="0" />
          </radialGradient>

          <radialGradient id={`${rUid}-solar-corona`} cx="50%" cy="50%" r="50%">
            <stop offset="52%" stopColor="#02040a" stopOpacity="0" />
            <stop offset="68%" stopColor="#f59e0b" stopOpacity="0.34" />
            <stop offset="78%" stopColor="#fef08a" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>

          <linearGradient id={`${rUid}-pulsar-beam`} x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.82" />
            <stop offset="45%" stopColor={ringSec} stopOpacity="0.48" />
            <stop offset="100%" stopColor={ringMin} stopOpacity="0" />
          </linearGradient>

          <linearGradient id={`${rUid}-pulsar-beam-rev`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.82" />
            <stop offset="45%" stopColor={ringSec} stopOpacity="0.48" />
            <stop offset="100%" stopColor={ringMin} stopOpacity="0" />
          </linearGradient>

          <linearGradient id={`${rUid}-bh-accretion`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#9a3412" stopOpacity="0.14" />
            <stop offset="22%" stopColor="#f97316" stopOpacity="0.88" />
            <stop offset="48%" stopColor="#fffbeb" stopOpacity="0.98" />
            <stop offset="76%" stopColor="#fbbf24" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.14" />
          </linearGradient>

          <linearGradient id={`${rUid}-radar-wedge`} x1="50%" y1="50%" x2="88%" y2="8%">
            <stop offset="0%" stopColor={ringSec} stopOpacity="0" />
            <stop offset="65%" stopColor={ringSec} stopOpacity="0.08" />
            <stop offset="100%" stopColor={ringSec} stopOpacity="0.32" />
          </linearGradient>

          <linearGradient id={`${rUid}-turbine-blade`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? '#cbd5e1' : '#94a3b8'} stopOpacity="0.52" />
            <stop offset="52%" stopColor={isLight ? '#64748b' : '#475569'} stopOpacity="0.28" />
            <stop offset="100%" stopColor={isLight ? '#334155' : '#1e293b'} stopOpacity="0.58" />
          </linearGradient>

          <linearGradient id={`${rUid}-synth-sky`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#060214" />
            <stop offset="52%" stopColor="#1b063d" />
            <stop offset="84%" stopColor="#581c87" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>

          <linearGradient id={`${rUid}-synth-spectrum`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="35%" stopColor="#f43f5e" />
            <stop offset="70%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>

          <filter id={`${rUid}-nebula-blur`} x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="4.8" />
          </filter>

          <filter id={`${rUid}-soft-glow`} x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="2.6" />
          </filter>

          <clipPath id={`${rUid}-outer-lens-clip`}>
            <circle cx={cx} cy={cy} r="155.5" />
          </clipPath>

          <clipPath id={`${rUid}-chamber-clip`}>
            <circle cx={cx} cy={cy} r={innerR} />
          </clipPath>

          <path id={`${rUid}-bottom-date-arc`} d="M 78 214 A 98 98 0 0 0 242 214" />
        </defs>

        {/* ================= OUTER LENS & SCENIC BACKDROP (CLIPPED TO r=155.5) ================= */}
        <g clipPath={`url(#${rUid}-outer-lens-clip)`}>
          {isDarkChamber && (
            <circle
              cx={cx}
              cy={cy}
              r="155.5"
              fill={
                styleId === 'blackhole_lens'
                  ? `url(#${rUid}-bh-lens)`
                  : styleId === 'synth_prism'
                    ? `url(#${rUid}-synth-sky)`
                    : `url(#${rUid}-space-lens)`
              }
            />
          )}

          {/* STYLE 2: SOLAR SYSTEM COSMIC PLANETARIUM BACKDROP */}
          {styleId === 'solar_orbit' && (
            <g pointerEvents="none">
              <circle cx={cx} cy={cy} r="154" fill={`url(#${rUid}-solar-corona)`} />
              {RADIAL_COSMIC_STARS.map((st, idx) => (
                <circle key={idx} cx={st.x} cy={st.y} r={st.r} fill="#e2e8f0" fillOpacity={st.op} />
              ))}
              {/* Asteroid Belt & Ephemeris Reference Trails */}
              {RADIAL_ASTEROID_BELT.map((ast, idx) => (
                <circle key={idx} cx={ast.x} cy={ast.y} r={ast.r} fill="#94a3b8" fillOpacity={ast.op} />
              ))}
              <circle cx={cx} cy={cy} r="113" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7" />
              <circle cx={cx} cy={cy} r="141" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7" />
              <circle cx={cx} cy={cy} r="154" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.6" strokeDasharray="2 4" />
              {/* Live J2000 Background Ephemeris Micro-Planets */}
              {solarLongitudes &&
                [
                  { deg: solarLongitudes.mercury, r: 113, size: 2.0, col: '#cbd5e1' },
                  { deg: solarLongitudes.venus, r: 127, size: 2.6, col: '#fde68a' },
                  { deg: solarLongitudes.mars, r: 141, size: 2.4, col: '#fb7185' },
                  { deg: solarLongitudes.jupiter, r: 154, size: 3.1, col: '#fdba74' },
                ].map((pl, idx) => {
                  const rad = ((pl.deg - 90) * Math.PI) / 180;
                  const px = cx + pl.r * Math.cos(rad);
                  const py = cy + pl.r * Math.sin(rad);
                  return <circle key={idx} cx={px} cy={py} r={pl.size} fill={pl.col} fillOpacity="0.78" />;
                })}
            </g>
          )}

          {/* STYLE 3: SPIRAL GALAXY ROTATING NEBULA & STAR CLUSTERS */}
          {styleId === 'galaxy_vortex' && (
            <g pointerEvents="none">
              <g transform={`rotate(${galaxyCounterDeg} ${cx} ${cy})`}>
                {RADIAL_COSMIC_STARS.map((st, idx) => (
                  <circle key={idx} cx={st.x} cy={st.y} r={st.r} fill="#cbd5e1" fillOpacity={st.op * 0.7} />
                ))}
              </g>
              <g transform={`rotate(${galaxySpinDeg} ${cx} ${cy})`}>
                <circle cx={cx} cy={cy} r="154" fill={`url(#${rUid}-galaxy-core)`} />
                <g filter={`url(#${rUid}-nebula-blur)`}>
                  {RADIAL_GALAXY_ARMS.map((arm, idx) => {
                    const armCol = arm.tone === 'c1' ? ringSec : arm.tone === 'c2' ? '#a855f7' : '#38bdf8';
                    return (
                      <g key={idx}>
                        <path d={arm.main} fill="none" stroke={armCol} strokeWidth="16" strokeOpacity="0.34" strokeLinecap="round" />
                        <path d={arm.main} fill="none" stroke={armCol} strokeWidth="7.5" strokeOpacity="0.45" strokeLinecap="round" />
                        <path d={arm.sub} fill="none" stroke="#f472b6" strokeWidth="5.5" strokeOpacity="0.3" strokeLinecap="round" />
                      </g>
                    );
                  })}
                </g>
                {RADIAL_GALAXY_STARS.map((st, idx) => {
                  const col =
                    st.hue === 'white'
                      ? '#ffffff'
                      : st.hue === 'gold'
                        ? '#fde68a'
                        : st.hue === 'pink'
                          ? '#f472b6'
                          : st.hue === 'c1'
                            ? ringSec
                            : '#7dd3fc';
                  return <circle key={idx} cx={st.x} cy={st.y} r={st.r} fill={col} fillOpacity={st.op} />;
                })}
              </g>
            </g>
          )}

          {/* STYLE 4: PULSAR NEBULA ROTATING MAGNETAR BEAMS */}
          {styleId === 'supernova' && (
            <g pointerEvents="none">
              {RADIAL_COSMIC_STARS.map((st, idx) => (
                <circle key={idx} cx={st.x} cy={st.y} r={st.r} fill="#f8fafc" fillOpacity={st.op * 0.72} />
              ))}
              <g filter={`url(#${rUid}-nebula-blur)`}>
                <circle cx={cx} cy={cy} r="138" fill="none" stroke={ringMin} strokeWidth="15" strokeOpacity="0.2" />
                <circle cx={cx} cy={cy} r="122" fill="none" stroke="#c084fc" strokeWidth="11" strokeOpacity="0.2" />
              </g>
              {/* Twin Opposing Relativistic Pulsar Beams Sweeping Around the Annulus */}
              <g transform={`rotate(${r3Deg} ${cx} ${cy})`}>
                <path
                  d="M 148 52 L 136 2 L 184 2 L 172 52 Z"
                  fill={`url(#${rUid}-pulsar-beam)`}
                  filter={`url(#${rUid}-soft-glow)`}
                />
                <line x1={cx} y1="52" x2={cx} y2="6" stroke="#ffffff" strokeWidth="1.6" strokeOpacity="0.72" />
                <path
                  d="M 148 268 L 136 318 L 184 318 L 172 268 Z"
                  fill={`url(#${rUid}-pulsar-beam-rev)`}
                  filter={`url(#${rUid}-soft-glow)`}
                />
                <line x1={cx} y1="268" x2={cx} y2="314" stroke="#ffffff" strokeWidth="1.6" strokeOpacity="0.72" />
                <circle cx={cx} cy={cy} r="141" fill="none" stroke="#ffffff" strokeWidth="0.85" strokeOpacity="0.28" strokeDasharray="3 9" />
              </g>
            </g>
          )}

          {/* STYLE 5: SINGULARITY GRAVITATIONAL LENSING PLANE */}
          {styleId === 'blackhole_lens' && (
            <g pointerEvents="none">
              {RADIAL_COSMIC_STARS.filter((_, i) => i % 2 === 0).map((st, idx) => (
                <circle key={idx} cx={st.x} cy={st.y} r={st.r} fill="#e2e8f0" fillOpacity={st.op * 0.65} />
              ))}
              <g transform={`rotate(-14 ${cx} ${cy})`}>
                {/* Upper & Lower Warped Gravitational Lensing Arches */}
                <g filter={`url(#${rUid}-soft-glow)`}>
                  <path d="M 38 158 A 122 118 0 0 1 282 158" fill="none" stroke="#ea580c" strokeWidth="14" strokeOpacity="0.42" />
                  <path d="M 44 158 A 116 112 0 0 1 276 158" fill="none" stroke="#fde68a" strokeWidth="5.5" strokeOpacity="0.68" />
                  <path d="M 42 162 A 118 112 0 0 0 278 162" fill="none" stroke="#f97316" strokeWidth="9" strokeOpacity="0.34" />
                  {/* Asymmetric Relativistic Doppler Equator Wings */}
                  <ellipse cx={cx} cy={cy} rx="154" ry="22" fill="none" stroke={`url(#${rUid}-bh-accretion)`} strokeWidth="13" strokeOpacity="0.78" />
                  <path d="M 6 160 L 54 156 L 54 164 Z" fill="#fffbeb" fillOpacity="0.72" />
                  <path d="M 314 160 L 266 157 L 266 163 Z" fill="#f97316" fillOpacity="0.58" />
                </g>
                {/* Crisp Inner Accretion Highlight Filaments */}
                <ellipse cx={cx} cy={cy} rx="153" ry="18" fill="none" stroke="#fffbeb" strokeWidth="1.4" strokeOpacity="0.62" />
                {/* Live Relativistic Accretion Filaments */}
                {[0, 120, 240].map((offset, idx) => {
                  const deg = (blackholePlasmaDeg + offset) % 360;
                  const rad = (deg * Math.PI) / 180;
                  const rx = 148 - idx * 7;
                  const ry = rx * 0.24;
                  const px = cx + rx * Math.cos(rad);
                  const py = cy + ry * Math.sin(rad);
                  const hiddenBehindCore = Math.hypot(px - cx, py - cy) < innerR - 4;
                  if (hiddenBehindCore) return null;
                  return <ellipse key={idx} cx={px} cy={py} rx="5" ry="1.8" fill="#fffbeb" fillOpacity="0.92" />;
                })}
              </g>
            </g>
          )}

          {/* STYLE 11: SYNTHWAVE OUTRUN LASER HORIZON */}
          {styleId === 'synth_prism' && (
            <g pointerEvents="none">
              {RADIAL_COSMIC_STARS.slice(0, 36).map((st, idx) => (
                <circle key={idx} cx={st.x} cy={st.y} r={st.r} fill="#f0abfc" fillOpacity={st.op * 0.8} />
              ))}
              {/* Perspective Laser Horizon Grid Across Lower Outer Annulus */}
              <g stroke="#22d3ee" strokeOpacity="0.34" strokeWidth="0.9">
                <line x1="6" y1="226" x2="314" y2="226" />
                <line x1="12" y1="244" x2="308" y2="244" />
                <line x1="22" y1="264" x2="298" y2="264" />
                <line x1="40" y1="286" x2="280" y2="286" />
                {[-3, -2, -1, 0, 1, 2, 3].map((k) => (
                  <line key={k} x1={cx + k * 14} y1="160" x2={cx + k * 66} y2="316" stroke="#f472b6" strokeOpacity="0.28" />
                ))}
              </g>
              {/* Top Glowing Outrun Sun Corona Arc */}
              <circle cx={cx} cy="72" r="56" fill="#f97316" fillOpacity="0.16" filter={`url(#${rUid}-nebula-blur)`} />
            </g>
          )}

          {/* STYLE 8: MACH TURBINE ROTATING STATOR & COMPRESSOR BLADES */}
          {styleId === 'turbine' && (
            <g pointerEvents="none">
              <g transform={`rotate(${turbineStatorDeg} ${cx} ${cy})`}>
                {Array.from({ length: 12 }).map((_, idx) => {
                  const deg = idx * 30;
                  return (
                    <line
                      key={idx}
                      x1={cx}
                      y1="52"
                      x2={cx}
                      y2="7"
                      transform={`rotate(${deg} ${cx} ${cy})`}
                      stroke={ringHr}
                      strokeWidth="1.2"
                      strokeOpacity="0.24"
                    />
                  );
                })}
              </g>
              <g transform={`rotate(${turbineSpinDeg} ${cx} ${cy})`}>
                {RADIAL_TURBINE_BLADES.map((d, idx) => (
                  <path
                    key={idx}
                    d={d}
                    fill={`url(#${rUid}-turbine-blade)`}
                    stroke={isLight ? 'rgba(15,23,42,0.22)' : 'rgba(255,255,255,0.16)'}
                    strokeWidth="0.7"
                  />
                ))}
              </g>
              {/* Outer Riveted Aerospace Stator Ring */}
              <circle cx={cx} cy={cy} r="154.2" fill="none" stroke={trackStroke} strokeWidth="2.5" />
              {Array.from({ length: 12 }).map((_, idx) => {
                const rad = (idx * 30 * Math.PI) / 180;
                return (
                  <circle
                    key={idx}
                    cx={cx + 154.2 * Math.cos(rad)}
                    cy={cy + 154.2 * Math.sin(rad)}
                    r="1.75"
                    fill={isLight ? '#475569' : '#94a3b8'}
                    stroke={isLight ? '#0f172a' : '#020617'}
                    strokeWidth="0.6"
                  />
                );
              })}
            </g>
          )}

          {/* STYLE 12: SACRED MANDALA ROTATING FILIGREE */}
          {styleId === 'fractal_mandala' && (
            <g pointerEvents="none">
              <g transform={`rotate(${mandalaOuterDeg} ${cx} ${cy})`}>
                {RADIAL_MANDALA_PETALS.map((d, idx) => (
                  <path
                    key={idx}
                    d={d}
                    fill={ringHr}
                    fillOpacity="0.06"
                    stroke={ringHr}
                    strokeOpacity="0.34"
                    strokeWidth="1.05"
                  />
                ))}
              </g>
              <g transform={`rotate(${mandalaInnerDeg + 15} ${cx} ${cy})`}>
                {RADIAL_MANDALA_PETALS.map((d, idx) => (
                  <path
                    key={idx}
                    d={d}
                    fill="none"
                    stroke={ringMin}
                    strokeOpacity="0.28"
                    strokeWidth="0.85"
                    strokeDasharray="3 2"
                  />
                ))}
              </g>
              <circle cx={cx} cy={cy} r="154" fill="none" stroke={ringBorder} strokeWidth="0.9" strokeOpacity="0.4" />
            </g>
          )}

          {/* STYLE 6: CYBER HUD TARGETING OPTICS & RADAR WEDGE */}
          {styleId === 'cyber_hud' && (
            <g pointerEvents="none">
              <g transform={`rotate(${hudVernierDeg} ${cx} ${cy})`}>
                {Array.from({ length: 36 }).map((_, idx) => {
                  const deg = idx * 10;
                  const major = idx % 3 === 0;
                  const rad = (deg * Math.PI) / 180;
                  return (
                    <line
                      key={idx}
                      x1={cx + (major ? 151.5 : 153) * Math.cos(rad)}
                      y1={cy + (major ? 151.5 : 153) * Math.sin(rad)}
                      x2={cx + 155 * Math.cos(rad)}
                      y2={cy + 155 * Math.sin(rad)}
                      stroke={ringSec}
                      strokeOpacity={major ? 0.65 : 0.25}
                      strokeWidth={major ? 1.4 : 0.8}
                    />
                  );
                })}
              </g>
              {/* 4 Corner Targeting Lock Brackets */}
              {[45, 135, 225, 315].map((deg) => (
                <path
                  key={deg}
                  d="M 150 6 L 160 4 L 170 6"
                  transform={`rotate(${deg} ${cx} ${cy})`}
                  fill="none"
                  stroke={ringMin}
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeOpacity="0.72"
                />
              ))}
              {/* Sweeping Radar Sector Wedge Following Seconds Angle */}
              {showSeconds && (
                <g transform={`rotate(${r3Deg} ${cx} ${cy})`}>
                  <path
                    d="M 160 52 A 108 108 0 0 0 112 63 L 94 25 A 150 150 0 0 1 160 10 Z"
                    fill={`url(#${rUid}-radar-wedge)`}
                  />
                </g>
              )}
            </g>
          )}

          {/* STYLE 1: CHRONOGRAPH CALIBRATED VERNIER BEZEL */}
          {styleId === 'chronograph' && (
            <g pointerEvents="none">
              {Array.from({ length: 60 }).map((_, idx) => {
                const rad = (((idx * 6 - 90) * Math.PI) / 180);
                const major = idx % 5 === 0;
                return (
                  <line
                    key={idx}
                    x1={cx + (major ? 152 : 153.2) * Math.cos(rad)}
                    y1={cy + (major ? 152 : 153.2) * Math.sin(rad)}
                    x2={cx + 155.2 * Math.cos(rad)}
                    y2={cy + 155.2 * Math.sin(rad)}
                    stroke={isLight ? '#0f172a' : '#ffffff'}
                    strokeOpacity={major ? 0.45 : 0.16}
                    strokeWidth={major ? 1.4 : 0.8}
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          )}
        </g>

        {/* ================= INNER CHRONOMETER CHAMBER BACKDROP (ALWAYS QUIET & CRISP) ================= */}
        <circle
          cx={cx}
          cy={cy}
          r={innerR}
          fill={isDarkChamber ? (styleId === 'blackhole_lens' ? '#000000' : '#050918') : themeConfig.dialBg}
          fillOpacity={isDarkChamber ? (styleId === 'galaxy_vortex' ? 0.78 : 0.88) : isLight ? 0.68 : 0.5}
          stroke={
            styleId === 'blackhole_lens'
              ? '#fb923c'
              : styleId === 'solar_orbit'
                ? '#fbbf24'
                : styleId === 'cyber_hud'
                  ? ringSec
                  : isDarkChamber
                    ? 'rgba(255,255,255,0.22)'
                    : isLight
                      ? 'rgba(15,23,42,0.1)'
                      : 'rgba(255,255,255,0.1)'
          }
          strokeOpacity={styleId === 'blackhole_lens' || styleId === 'solar_orbit' ? 0.85 : 0.45}
          strokeWidth={styleId === 'blackhole_lens' || styleId === 'solar_orbit' ? 1.8 : 1.1}
        />

        {/* Subtle Inner Chamfer Ring & Optional Curved Bottom Date Engraving */}
        <circle
          cx={cx}
          cy={cy}
          r={innerR - 4}
          fill="none"
          stroke={isDarkChamber ? 'rgba(255,255,255,0.09)' : isLight ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.06)'}
          strokeWidth="0.7"
          strokeDasharray={styleId === 'cyber_hud' ? '6 4' : undefined}
        />

        {/* Einstein Photon Ring Bloom on Black Hole Rim */}
        {styleId === 'blackhole_lens' && (
          <g pointerEvents="none">
            <circle cx={cx} cy={cy} r={innerR + 0.8} fill="none" stroke="#fffbeb" strokeWidth="1.2" strokeOpacity="0.92" />
            <circle
              cx={cx}
              cy={cy}
              r={innerR + 2.2}
              fill="none"
              stroke="#fb923c"
              strokeWidth="4.2"
              strokeOpacity="0.48"
              filter={`url(#${rUid}-soft-glow)`}
            />
          </g>
        )}

        {/* Style Signature Engraving at Top Rim of Chamber & Curved Date at Bottom Rim in Fullscreen */}
        <text
          x={cx}
          y={cy - innerR + 14}
          textAnchor="middle"
          fontSize="5.6"
          fontWeight="700"
          letterSpacing="1.8"
          fill={isDarkChamber || !isLight ? '#e2e8f0' : '#334155'}
          fillOpacity="0.52"
          style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
        >
          {styleId === 'solar_orbit'
            ? 'HELIOCENTRIC J2000'
            : styleId === 'galaxy_vortex'
              ? 'SPIRAL CORE NGC-72'
              : styleId === 'supernova'
                ? 'PULSAR MAGNETAR'
                : styleId === 'blackhole_lens'
                  ? 'EVENT HORIZON'
                  : styleId === 'cyber_hud'
                    ? 'HUD // OPTICS'
                    : styleId === 'segmented_led'
                      ? 'VU SPECTRUM'
                      : styleId === 'turbine'
                        ? 'MACH COMPRESSOR'
                        : styleId === 'waveform'
                          ? 'CYMATIC HARMONIC'
                          : styleId === 'dna_helix'
                            ? 'GENOME HELIX'
                            : styleId === 'synth_prism'
                              ? 'OUTRUN HORIZON'
                              : styleId === 'fractal_mandala'
                                ? 'ASTROLABE ROSETTE'
                                : 'CHRONOGRAPH'}
        </text>

        {isFullscreen && showDate && (
          <text
            fontSize="6.5"
            fontWeight="700"
            letterSpacing="1.6"
            fill={isDarkChamber || !isLight ? '#f1f5f9' : '#1e293b'}
            fillOpacity="0.72"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
          >
            <textPath href={`#${rUid}-bottom-date-arc`} startOffset="50%" textAnchor="middle">
              {dateMicroLabel}
            </textPath>
          </text>
        )}

        {/* ================= RING PROGRESS LAYERS BY STYLE ================= */}
        {styleId === 'segmented_led' ? (
          /* STYLE 7: VU TURBINE CRYSTAL LED SEGMENTS */
          <g>
            {/* Outer Hours Block Segments */}
            {(() => {
              const hrBlocks = is24Hour ? RADIAL_LED_24 : RADIAL_LED_12;
              const activeHrIdx = Math.min(hrBlocks.length - 1, Math.floor(hrProgress * hrBlocks.length));
              return hrBlocks.map((seg, idx) => {
                const lit = idx <= activeHrIdx;
                const isHead = idx === activeHrIdx;
                return (
                  <line
                    key={`hr-${idx}`}
                    x1={seg.x1}
                    y1={seg.y1}
                    x2={seg.x2}
                    y2={seg.y2}
                    stroke={lit ? ringHr : trackStroke}
                    strokeWidth={is24Hour ? 3.8 : 6.4}
                    strokeLinecap="round"
                    strokeOpacity={lit ? (isHead ? 1 : 0.85) : 0.9}
                    style={lit ? { filter: `drop-shadow(0 0 ${isHead ? 6 : 3}px ${ringHr})` } : undefined}
                  />
                );
              });
            })()}

            {/* Middle Minutes Matrix Bars */}
            {(() => {
              const activeMinIdx = Math.min(59, Math.floor(minProgress * 60));
              return RADIAL_LED_60_MIN.map((seg, idx) => {
                const lit = idx <= activeMinIdx;
                const isHead = idx === activeMinIdx;
                return (
                  <line
                    key={`min-${idx}`}
                    x1={seg.x1}
                    y1={seg.y1}
                    x2={seg.x2}
                    y2={seg.y2}
                    stroke={lit ? ringMin : trackStroke}
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeOpacity={lit ? (isHead ? 1 : 0.84) : 0.85}
                    style={lit ? { filter: `drop-shadow(0 0 ${isHead ? 5 : 2.5}px ${ringMin})` } : undefined}
                  />
                );
              });
            })()}

            {/* Inner Seconds Phosphor Matrix Bars with Smooth Decay Tail */}
            {showSeconds &&
              (() => {
                const liveSecVal = isSweeping ? secFloat : activeSnapshot.seconds;
                const activeSecIdx = Math.min(59, Math.max(0, Math.floor(liveSecVal)));
                return RADIAL_LED_60_SEC.map((seg, idx) => {
                  const lit = idx <= activeSecIdx;
                  const distFromHead = activeSecIdx - idx;
                  const isLead = idx === activeSecIdx;
                  const inTail = distFromHead > 0 && distFromHead <= 4;
                  const op = isLead ? 1 : inTail ? 0.94 - distFromHead * 0.08 : lit ? 0.56 : 0.78;
                  return (
                    <line
                      key={`sec-${idx}`}
                      x1={seg.x1}
                      y1={seg.y1}
                      x2={seg.x2}
                      y2={seg.y2}
                      stroke={lit ? (isLead ? '#ffffff' : ringSec) : trackStroke}
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeOpacity={op}
                      style={
                        lit && (isLead || inTail) ? { filter: `drop-shadow(0 0 ${isLead ? 6 : 3.5}px ${ringSec})` } : undefined
                      }
                    />
                  );
                });
              })()}
          </g>
        ) : styleId === 'waveform' && waveHr && waveMin ? (
          /* STYLE 9: SONIC CYMATIC HARMONIC WAVE RINGS */
          <g>
            {/* Reference Harmonic Wave Tracks */}
            <path d={waveGhostHr} fill="none" stroke={trackStroke} strokeWidth="2.6" />
            <path d={waveGhostMin} fill="none" stroke={trackStroke} strokeWidth="2.4" />
            {showSeconds && waveGhostSec && <path d={waveGhostSec} fill="none" stroke={trackStroke} strokeWidth="2.2" />}

            {/* Active Harmonic Waves */}
            <path
              d={waveHr.d}
              fill="none"
              stroke={ringHr}
              strokeWidth="4.6"
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 5px ${ringHr})` }}
            />
            <path d={waveHr.d} fill="none" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.65" strokeLinecap="round" />
            <circle cx={waveHr.tipX} cy={waveHr.tipY} r="5.5" fill="none" stroke={ringHr} strokeWidth="1.1" strokeOpacity="0.48" />
            <circle cx={waveHr.tipX} cy={waveHr.tipY} r="3.4" fill="#ffffff" stroke={ringHr} strokeWidth="1.7" />

            <path
              d={waveMin.d}
              fill="none"
              stroke={ringMin}
              strokeWidth="4.2"
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 5px ${ringMin})` }}
            />
            <path d={waveMin.d} fill="none" stroke="#ffffff" strokeWidth="1.1" strokeOpacity="0.6" strokeLinecap="round" />
            <circle cx={waveMin.tipX} cy={waveMin.tipY} r="5.2" fill="none" stroke={ringMin} strokeWidth="1.1" strokeOpacity="0.48" />
            <circle cx={waveMin.tipX} cy={waveMin.tipY} r="3.2" fill="#ffffff" stroke={ringMin} strokeWidth="1.6" />

            {showSeconds && waveSec && (
              <>
                <path
                  d={waveSec.d}
                  fill="none"
                  stroke={ringSec}
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 5px ${ringSec})` }}
                />
                <circle cx={waveSec.tipX} cy={waveSec.tipY} r="5.6" fill="none" stroke={ringSec} strokeWidth="1.2" strokeOpacity="0.55" />
                <circle cx={waveSec.tipX} cy={waveSec.tipY} r="3.0" fill="#ffffff" stroke={ringSec} strokeWidth="1.5" />
              </>
            )}
          </g>
        ) : styleId === 'dna_helix' && helixData ? (
          /* STYLE 10: BIO-LUMINESCENT TOROIDAL DOUBLE HELIX */
          <g>
            {/* Outer Hours Genome Rail & Inner Seconds Tracer Rail */}
            <circle cx={cx} cy={cy} r={r1Radius} fill="none" stroke={trackStroke} strokeWidth={RADIAL_GAUGE_CONFIG.hoursStrokeWidth} />
            {showSeconds && (
              <circle
                cx={cx}
                cy={cy}
                r={r3Radius}
                fill="none"
                stroke={trackStroke}
                strokeWidth={RADIAL_GAUGE_CONFIG.secondsStrokeWidth}
              />
            )}

            {/* 48 Double-Helix Base-Pair Rungs Coiled Along the Middle Annulus */}
            {helixData.rungs.map((rung, idx) => {
              const lit = rung.frac <= minProgress;
              return (
                <line
                  key={idx}
                  x1={rung.x1}
                  y1={rung.y1}
                  x2={rung.x2}
                  y2={rung.y2}
                  stroke={lit ? (idx % 2 === 0 ? ringSec : ringMin) : trackStroke}
                  strokeWidth={lit ? 1.85 : 1.0}
                  strokeOpacity={lit ? 0.9 : 0.45}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Twin Coiled Helix Ribbon Strands */}
            <path
              d={helixData.strandA}
              fill="none"
              stroke={ringMin}
              strokeWidth="2.3"
              strokeOpacity="0.86"
              style={{ filter: `drop-shadow(0 0 3px ${ringMin})` }}
            />
            <path
              d={helixData.strandB}
              fill="none"
              stroke={ringSec}
              strokeWidth="2.3"
              strokeOpacity="0.82"
              style={{ filter: `drop-shadow(0 0 3px ${ringSec})` }}
            />

            {/* Outer Hours Arc + Tip Node */}
            <circle
              cx={cx}
              cy={cy}
              r={r1Radius}
              fill="none"
              stroke={ringHr}
              strokeWidth={RADIAL_GAUGE_CONFIG.hoursStrokeWidth}
              strokeLinecap="round"
              strokeDasharray={r1Circ}
              strokeDashoffset={r1Offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ filter: `drop-shadow(0 0 5px ${ringHr})` }}
            />
            <circle cx={r1TipX} cy={r1TipY} r="3.9" fill="#ffffff" stroke={ringHr} strokeWidth="1.8" />
            <circle cx={r2TipX} cy={r2TipY} r="4.2" fill="#ffffff" stroke={ringMin} strokeWidth="2.0" />

            {showSeconds && (
              <>
                <circle
                  cx={cx}
                  cy={cy}
                  r={r3Radius}
                  fill="none"
                  stroke={ringSec}
                  strokeWidth={RADIAL_GAUGE_CONFIG.secondsStrokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={r3Circ}
                  strokeDashoffset={r3Offset}
                  transform={`rotate(-90 ${cx} ${cy})`}
                  style={{ filter: `drop-shadow(0 0 5px ${ringSec})` }}
                />
                <circle cx={r3TipX} cy={r3TipY} r="3.3" fill="#ffffff" stroke={ringSec} strokeWidth="1.6" />
              </>
            )}
          </g>
        ) : (
          /* STANDARD + COSMIC + TECHNICAL + SYNTHWAVE PRECISION RADIAL ARCS */
          <g>
            {/* Background Guide Tracks */}
            <circle
              cx={cx}
              cy={cy}
              r={r1Radius}
              fill="none"
              stroke={trackStroke}
              strokeWidth={RADIAL_GAUGE_CONFIG.hoursStrokeWidth}
              strokeDasharray={styleId === 'cyber_hud' ? '8 3' : undefined}
            />
            <circle
              cx={cx}
              cy={cy}
              r={r2Radius}
              fill="none"
              stroke={trackStroke}
              strokeWidth={RADIAL_GAUGE_CONFIG.minutesStrokeWidth}
              strokeDasharray={styleId === 'cyber_hud' ? '3 3' : undefined}
            />
            {showSeconds && (
              <circle
                cx={cx}
                cy={cy}
                r={r3Radius}
                fill="none"
                stroke={trackStroke}
                strokeWidth={RADIAL_GAUGE_CONFIG.secondsStrokeWidth}
              />
            )}

            {/* HOURS ARC + SPECULAR FILAMENT */}
            <circle
              cx={cx}
              cy={cy}
              r={r1Radius}
              fill="none"
              stroke={styleId === 'synth_prism' ? `url(#${rUid}-synth-spectrum)` : ringHr}
              strokeWidth={RADIAL_GAUGE_CONFIG.hoursStrokeWidth}
              strokeLinecap="round"
              strokeDasharray={r1Circ}
              strokeDashoffset={r1Offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ filter: `drop-shadow(0 0 6px ${ringHr})` }}
            />
            <circle
              cx={cx}
              cy={cy}
              r={r1Radius}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.25"
              strokeOpacity="0.48"
              strokeLinecap="round"
              strokeDasharray={r1Circ}
              strokeDashoffset={r1Offset}
              transform={`rotate(-90 ${cx} ${cy})`}
            />

            {/* MINUTES ARC + SPECULAR FILAMENT */}
            <circle
              cx={cx}
              cy={cy}
              r={r2Radius}
              fill="none"
              stroke={styleId === 'synth_prism' ? `url(#${rUid}-synth-spectrum)` : ringMin}
              strokeWidth={RADIAL_GAUGE_CONFIG.minutesStrokeWidth}
              strokeLinecap="round"
              strokeDasharray={r2Circ}
              strokeDashoffset={r2Offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ filter: `drop-shadow(0 0 5px ${ringMin})` }}
            />
            <circle
              cx={cx}
              cy={cy}
              r={r2Radius}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.1"
              strokeOpacity="0.42"
              strokeLinecap="round"
              strokeDasharray={r2Circ}
              strokeDashoffset={r2Offset}
              transform={`rotate(-90 ${cx} ${cy})`}
            />

            {/* SECONDS ARC */}
            {showSeconds && (
              <>
                <circle
                  cx={cx}
                  cy={cy}
                  r={r3Radius}
                  fill="none"
                  stroke={ringSec}
                  strokeWidth={RADIAL_GAUGE_CONFIG.secondsStrokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={r3Circ}
                  strokeDashoffset={r3Offset}
                  transform={`rotate(-90 ${cx} ${cy})`}
                  style={{ filter: `drop-shadow(0 0 6px ${ringSec})` }}
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={r3Radius}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.0"
                  strokeOpacity="0.45"
                  strokeLinecap="round"
                  strokeDasharray={r3Circ}
                  strokeDashoffset={r3Offset}
                  transform={`rotate(-90 ${cx} ${cy})`}
                />
              </>
            )}

            {/* ================= CUSTOM MOVING TIP NODES BY STYLE ================= */}
            {styleId === 'solar_orbit' ? (
              <>
                {/* Hours Tip: Ringed Gas Giant Saturn */}
                <g transform={`translate(${r1TipX} ${r1TipY}) rotate(-24)`}>
                  <ellipse cx="0" cy="0" rx="8.6" ry="3.1" fill="none" stroke="#fde68a" strokeWidth="1.4" strokeOpacity="0.9" />
                  <circle cx="0" cy="0" r="4.4" fill="#fbbf24" stroke="#78350f" strokeWidth="0.7" />
                  <path d="M -8.6 0 A 8.6 3.1 0 0 0 8.6 0" fill="none" stroke="#fef3c7" strokeWidth="1.3" />
                </g>
                {/* Minutes Tip: Earth + Live Orbiting Moon */}
                <g transform={`translate(${r2TipX} ${r2TipY})`}>
                  <circle cx="0" cy="0" r="6.8" fill="none" stroke="rgba(56,189,248,0.4)" strokeWidth="0.7" strokeDasharray="1.5 1.5" />
                  <circle cx="0" cy="0" r="4.1" fill="#0284c7" stroke="#bae6fd" strokeWidth="0.9" />
                  <circle cx="-1" cy="-0.8" r="1.4" fill="#4ade80" fillOpacity="0.85" />
                  <g transform={`rotate(${earthMoonDeg})`}>
                    <circle cx="6.8" cy="0" r="1.45" fill="#f8fafc" />
                  </g>
                </g>
                {/* Seconds Tip: Blazing Ice Comet + Plasma Tail */}
                {showSeconds && (
                  <g transform={`rotate(${r3Deg} ${cx} ${cy})`}>
                    <path
                      d="M 122.92 45.87 A 120 120 0 0 1 160 40"
                      fill="none"
                      stroke="#7dd3fc"
                      strokeWidth="2.8"
                      strokeOpacity="0.52"
                      strokeLinecap="round"
                    />
                    <circle cx={cx} cy={cy - r3Radius} r="5.5" fill="#38bdf8" fillOpacity="0.38" />
                    <circle cx={cx} cy={cy - r3Radius} r="2.8" fill="#ffffff" />
                  </g>
                )}
              </>
            ) : styleId === 'cyber_hud' ? (
              <>
                <g transform={`translate(${r1TipX} ${r1TipY}) rotate(${r1Deg})`}>
                  <polygon points="0,-5.5 5.2,0 0,5.5 -5.2,0" fill="#020617" stroke={ringHr} strokeWidth="1.8" />
                  <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
                </g>
                <g transform={`translate(${r2TipX} ${r2TipY}) rotate(${r2Deg})`}>
                  <polygon points="0,-5 4.8,0 0,5 -4.8,0" fill="#020617" stroke={ringMin} strokeWidth="1.7" />
                  <circle cx="0" cy="0" r="1.4" fill="#ffffff" />
                </g>
                {showSeconds && (
                  <g transform={`translate(${r3TipX} ${r3TipY}) rotate(${r3Deg})`}>
                    <polygon points="4.5,0 -3.5,-3.8 -3.5,3.8" fill="#ffffff" stroke={ringSec} strokeWidth="1.4" />
                  </g>
                )}
              </>
            ) : styleId === 'supernova' || styleId === 'galaxy_vortex' ? (
              <>
                {[
                  { x: r1TipX, y: r1TipY, c: ringHr, s: 5.5 },
                  { x: r2TipX, y: r2TipY, c: ringMin, s: 5.0 },
                  ...(showSeconds ? [{ x: r3TipX, y: r3TipY, c: ringSec, s: 4.5 }] : []),
                ].map((pt, idx) => (
                  <g key={idx} transform={`translate(${pt.x} ${pt.y})`}>
                    <circle cx="0" cy="0" r={pt.s} fill={pt.c} fillOpacity="0.32" />
                    <path
                      d={`M 0 ${-pt.s * 1.15} Q 0.8 -0.8 ${pt.s * 1.15} 0 Q 0.8 0.8 0 ${pt.s * 1.15} Q -0.8 0.8 ${-pt.s * 1.15} 0 Q -0.8 -0.8 0 ${-pt.s * 1.15} Z`}
                      fill="#ffffff"
                      stroke={pt.c}
                      strokeWidth="0.7"
                    />
                  </g>
                ))}
              </>
            ) : styleId === 'synth_prism' ? (
              <>
                <polygon
                  points={`${r1TipX},${r1TipY - 4.8} ${r1TipX + 4.4},${r1TipY + 3.4} ${r1TipX - 4.4},${r1TipY + 3.4}`}
                  fill="#090218"
                  stroke="#fde047"
                  strokeWidth="1.7"
                />
                <polygon
                  points={`${r2TipX},${r2TipY - 4.5} ${r2TipX + 4.1},${r2TipY + 3.1} ${r2TipX - 4.1},${r2TipY + 3.1}`}
                  fill="#090218"
                  stroke="#f472b6"
                  strokeWidth="1.6"
                />
                {showSeconds && <circle cx={r3TipX} cy={r3TipY} r="3.4" fill="#ffffff" stroke="#22d3ee" strokeWidth="1.6" />}
              </>
            ) : (
              <>
                <circle cx={r1TipX} cy={r1TipY} r="3.9" fill="#ffffff" stroke={ringHr} strokeWidth="1.8" />
                <circle cx={r2TipX} cy={r2TipY} r="3.6" fill="#ffffff" stroke={ringMin} strokeWidth="1.65" />
                {showSeconds && <circle cx={r3TipX} cy={r3TipY} r="3.3" fill="#ffffff" stroke={ringSec} strokeWidth="1.55" />}
              </>
            )}
          </g>
        )}
      </svg>

      {/* Center Digital Display Strictly Bounded Inside Inner Circle */}
      <div
        style={{ inset: `${RADIAL_GAUGE_CONFIG.centerSafeInsetPercent}%` }}
        className="absolute rounded-full flex flex-col items-center justify-center pointer-events-none select-none px-2"
      >
        <div
          className={`leading-none whitespace-nowrap ${fontClassName} ${clockTextClass} ${animationTextClass} ${
            isFullscreen
              ? isWideFont
                ? 'text-[calc(var(--radial-d)*0.088)]'
                : 'text-[calc(var(--radial-d)*0.106)]'
              : isWideFont
                ? 'text-xl sm:text-2xl md:text-[1.75rem]'
                : 'text-2xl sm:text-3xl md:text-4xl'
          }`}
        >
          {hoursStr}:{minutesStr}
        </div>
        <div className={`flex items-center justify-center gap-1.5 ${isFullscreen ? 'mt-2 sm:mt-2.5' : 'mt-1.5'}`}>
          {showSeconds && (
            <span
              className={`font-mono font-bold leading-none ${accentTextClass} ${
                isFullscreen ? 'text-[calc(var(--radial-d)*0.036)]' : 'text-xs sm:text-sm'
              }`}
            >
              :{secondsStr}
            </span>
          )}
          {!is24Hour && (
            <span
              className={`font-extrabold uppercase tracking-wider rounded-md border leading-none ${badgeClass} ${
                isFullscreen
                  ? 'px-2 py-0.5 text-[calc(var(--radial-d)*0.025)]'
                  : 'px-1.5 py-0.5 text-[10px] sm:text-xs'
              }`}
            >
              {localAmpm}
            </span>
          )}
        </div>
        <div
          className={`font-mono font-semibold uppercase tracking-widest opacity-75 leading-none ${subTextClass} ${
            isFullscreen ? 'text-[calc(var(--radial-d)*0.023)] mt-1.5 sm:mt-2' : 'text-[10px] mt-1'
          }`}
        >
          DAY {liveDayProgress}%
        </div>
      </div>
    </div>
  );
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
  const [bgFx, setBgFx] = useState<BackgroundFx>(() => {
    const saved = localStorage.getItem('vortexero_clock_bg_fx');
    return saved && CLOCK_BG_FX_OPTIONS.some((o) => o.id === saved) ? (saved as BackgroundFx) : 'aurora';
  });
  const [analogStyle, setAnalogStyle] = useState<AnalogStyle>(() => {
    const saved = localStorage.getItem('vortexero_clock_analog_style') as AnalogStyle | null;
    return saved && ANALOG_STYLES.some((s) => s.id === saved) ? saved : 'chronometer';
  });
  const [analogMotion, setAnalogMotion] = useState<AnalogMotion>(() => {
    const saved = localStorage.getItem('vortexero_clock_analog_motion');
    return saved === 'tick' ? 'tick' : 'sweep';
  });
  const [showAnalogSubDigital, setShowAnalogSubDigital] = useState<boolean>(() => {
    return localStorage.getItem('vortexero_clock_analog_subdigital') !== 'false';
  });
  const [radialStyle, setRadialStyle] = useState<RadialStyle>(() => {
    const saved = localStorage.getItem('vortexero_clock_radial_style') as RadialStyle | null;
    return saved && RADIAL_STYLES.some((s) => s.id === saved) ? saved : 'chronograph';
  });
  const [radialMotion, setRadialMotion] = useState<AnalogMotion>(() => {
    const saved = localStorage.getItem('vortexero_clock_radial_motion');
    return saved === 'tick' ? 'tick' : 'sweep';
  });
  const [showRadialTelemetry, setShowRadialTelemetry] = useState<boolean>(() => {
    return localStorage.getItem('vortexero_clock_radial_telemetry') !== 'false';
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

  useEffect(() => {
    localStorage.setItem('vortexero_clock_bg_fx', bgFx);
  }, [bgFx]);

  useEffect(() => {
    localStorage.setItem('vortexero_clock_analog_style', analogStyle);
  }, [analogStyle]);

  useEffect(() => {
    localStorage.setItem('vortexero_clock_analog_motion', analogMotion);
  }, [analogMotion]);

  useEffect(() => {
    localStorage.setItem('vortexero_clock_analog_subdigital', String(showAnalogSubDigital));
  }, [showAnalogSubDigital]);

  useEffect(() => {
    localStorage.setItem('vortexero_clock_radial_style', radialStyle);
  }, [radialStyle]);

  useEffect(() => {
    localStorage.setItem('vortexero_clock_radial_motion', radialMotion);
  }, [radialMotion]);

  useEffect(() => {
    localStorage.setItem('vortexero_clock_radial_telemetry', String(showRadialTelemetry));
  }, [showRadialTelemetry]);

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

  const playFlipSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Soft mechanical card release thud
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      bodyOsc.type = 'triangle';
      bodyOsc.frequency.setValueAtTime(220, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(75, now + 0.045);
      bodyGain.gain.setValueAtTime(0.035, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      bodyOsc.connect(bodyGain);
      bodyGain.connect(ctx.destination);
      bodyOsc.start(now);
      bodyOsc.stop(now + 0.05);

      // Delayed snap matching lower flap landing
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(520, now + 0.26);
      snapOsc.frequency.exponentialRampToValueAtTime(140, now + 0.295);
      snapGain.gain.setValueAtTime(0.03, now + 0.26);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start(now + 0.26);
      snapOsc.stop(now + 0.3);
    } catch {
      // Ignore
    }
  };

  // Wall-clock-aligned Clock Ticker (prevents second-boundary drift or skipped seconds)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleNextTick = () => {
      const msUntilNextSecond = 1000 - (Date.now() % 1000) + 8;
      timeoutId = setTimeout(() => {
        setCurrentTime(new Date());
        if (soundEnabled && (mode === 'analog' || (mode === 'radial' && radialMotion === 'tick'))) {
          playTickSound();
        }
        scheduleNextTick();
      }, msUntilNextSecond);
    };
    scheduleNextTick();
    return () => clearTimeout(timeoutId);
  }, [soundEnabled, mode, radialMotion]);

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

  const prevFlipAudioRef = useRef({
    mode,
    hoursStr,
    minutesStr,
    secondsStr,
    showSeconds,
  });

  useEffect(() => {
    const prev = prevFlipAudioRef.current;
    prevFlipAudioRef.current = { mode, hoursStr, minutesStr, secondsStr, showSeconds };
    const digitChanged =
      prev.hoursStr !== hoursStr ||
      prev.minutesStr !== minutesStr ||
      (showSeconds && prev.secondsStr !== secondsStr);
    if (
      mode === 'flip' &&
      prev.mode === 'flip' &&
      prev.showSeconds === showSeconds &&
      digitChanged &&
      soundEnabled
    ) {
      playFlipSound();
    }
  }, [mode, hoursStr, minutesStr, secondsStr, showSeconds, soundEnabled]);

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

  // Base Seconds / Minutes values used by Radial Gauge & Dial progress
  const secValue = displayTime.getSeconds();
  const minValue = displayTime.getMinutes();

  // Font styling class helper (returns non-conflicting family, weight, and tracking classes)
  const getFontFamilyClass = (compact = false) => {
    switch (fontStyle) {
      case 'sans':
        return 'font-sans font-black tracking-tight';
      case 'condensed':
        return 'font-sans font-black tracking-tighter uppercase inline-block';
      case 'minimal':
        return compact
          ? 'font-sans font-light tracking-[0.06em] uppercase'
          : 'font-sans font-light tracking-[0.12em] uppercase';
      case 'serif':
        return 'font-serif font-bold tracking-normal';
      case 'digital':
        return compact
          ? 'font-orbitron font-bold tracking-normal uppercase'
          : 'font-orbitron font-bold tracking-wide uppercase';
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

  const activeAnalogMeta =
    ANALOG_STYLES.find((s) => s.id === analogStyle) || ANALOG_STYLES[0];

  const handleDailyMix = () => {
    const otherStyles = ANALOG_STYLES.filter((s) => s.id !== analogStyle);
    const otherThemes = themes.filter((t) => t.id !== theme);
    const otherBgs = CLOCK_BG_FX_OPTIONS.filter((b) => b.id !== 'none' && b.id !== bgFx);
    if (otherStyles.length > 0) {
      const nextStyle = otherStyles[Math.floor(Math.random() * otherStyles.length)];
      setAnalogStyle(nextStyle.id);
    }
    if (otherThemes.length > 0) {
      const nextTheme = otherThemes[Math.floor(Math.random() * otherThemes.length)];
      setTheme(nextTheme.id);
    }
    if (bgFx !== 'none' && otherBgs.length > 0) {
      const nextBg = otherBgs[Math.floor(Math.random() * otherBgs.length)];
      setBgFx(nextBg.id);
    }
  };

  const activeRadialMeta =
    RADIAL_STYLES.find((s) => s.id === radialStyle) || RADIAL_STYLES[0];

  const handleRadialDailyMix = () => {
    const otherStyles = RADIAL_STYLES.filter((s) => s.id !== radialStyle);
    const otherThemes = themes.filter((t) => t.id !== theme);
    const otherBgs = CLOCK_BG_FX_OPTIONS.filter((b) => b.id !== 'none' && b.id !== bgFx);
    if (otherStyles.length > 0) {
      const nextStyle = otherStyles[Math.floor(Math.random() * otherStyles.length)];
      setRadialStyle(nextStyle.id);
    }
    if (otherThemes.length > 0) {
      const nextTheme = otherThemes[Math.floor(Math.random() * otherThemes.length)];
      setTheme(nextTheme.id);
    }
    if (bgFx !== 'none' && otherBgs.length > 0) {
      const nextBg = otherBgs[Math.floor(Math.random() * otherBgs.length)];
      setBgFx(nextBg.id);
    }
  };

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
  const dayProgress = Math.round(((displayTime.getHours() * 3600 + minValue * 60 + secValue) / 86400) * 100);
  const isWideFont = fontStyle === 'digital' || fontStyle === 'minimal';

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
            <div className="flex flex-wrap items-center gap-1.5 max-w-full">
              <select
                value={animationFx}
                onChange={(e) => setAnimationFx(e.target.value as AnimationFx)}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer max-w-full"
                title="Dynamic background & glow animation style"
              >
                {CLOCK_ANIMATION_FX_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <select
                data-testid="bg-fx-select"
                value={bgFx}
                onChange={(e) => setBgFx(e.target.value as BackgroundFx)}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer max-w-full"
                title="Animated background scene behind the clock canvas"
              >
                {CLOCK_BG_FX_OPTIONS.map((opt) => (
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

      {/* Radial Gauge Studio Bar (shown only when mode === 'radial') */}
      {mode === 'radial' && (
        <div
          data-testid="radial-style-bar"
          className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xs flex flex-col gap-2.5"
        >
          {/* Header Row: Title & Active Radial Style Tagline + Sweep/Tick, Ring Stats & Mix Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
                <Compass size={13} className="text-brand-500" />
                Radial Style
              </span>
              <span className="hidden md:inline-block text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate border-l border-slate-200 dark:border-slate-700 pl-2">
                {activeRadialMeta.tagline}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 ml-auto">
              <div
                className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold"
                title="Ring & kinetic motion: smooth 60fps fluid sweep or 1Hz quartz tick"
              >
                <button
                  onClick={() => setRadialMotion('sweep')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    radialMotion === 'sweep'
                      ? 'bg-white dark:bg-slate-700 shadow-xs text-brand-600 dark:text-brand-300'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  Sweep
                </button>
                <button
                  onClick={() => setRadialMotion('tick')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    radialMotion === 'tick'
                      ? 'bg-white dark:bg-slate-700 shadow-xs text-brand-600 dark:text-brand-300'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  Tick
                </button>
              </div>

              <button
                onClick={() => setShowRadialTelemetry(!showRadialTelemetry)}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  showRadialTelemetry
                    ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-600 dark:text-brand-300'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
                title="Show or hide Hour/Min/Sec ring progress telemetry badges below the gauge"
              >
                Ring Stats
              </button>

              <button
                onClick={handleRadialDailyMix}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700/60 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 whitespace-nowrap shadow-xs"
                title="Shuffle a fresh radial style, color theme, and animated background combo"
              >
                <Shuffle size={12} />
                <span>Daily Mix</span>
              </button>
            </div>
          </div>

          {/* 12 Selectable Radial Gauge Styles */}
          <div className="flex items-center gap-1.5 overflow-x-auto sm:overflow-visible sm:flex-wrap no-scrollbar pb-0.5 sm:pb-0">
            {RADIAL_STYLES.map((st) => {
              const isActive = radialStyle === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setRadialStyle(st.id)}
                  title={`${st.label} - ${st.tagline}`}
                  data-radial-style={st.id}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                    isActive
                      ? 'bg-brand-600 text-white border-brand-500 shadow-sm shadow-brand-500/25'
                      : 'bg-slate-100/90 dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700'
                  }`}
                >
                  <RadialStyleGlyph styleId={st.id} />
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>

          {/* Animated Canvas Background Presets */}
          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-800/70 overflow-x-auto sm:overflow-visible sm:flex-wrap no-scrollbar pb-0.5 sm:pb-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 shrink-0">
              Animated Bg
            </span>
            {CLOCK_BG_FX_OPTIONS.map((bg) => {
              const isActive = bgFx === bg.id;
              return (
                <button
                  key={bg.id}
                  onClick={() => setBgFx(bg.id)}
                  title={bg.tagline}
                  data-bg-fx={bg.id}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                    isActive
                      ? 'bg-brand-600 text-white border-brand-500 shadow-xs'
                      : 'bg-slate-100/80 dark:bg-slate-800/80 border-slate-200/70 dark:border-slate-700/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700'
                  }`}
                >
                  {bg.shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Analog Dial Style Studio Bar (shown only when mode === 'analog') */}
      {mode === 'analog' && (
        <div
          data-testid="analog-style-bar"
          className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xs flex flex-col gap-2.5"
        >
          {/* Header Row: Title & Active Horological Tagline + Movement & Mix Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
                <Watch size={13} className="text-brand-500" />
                Dial Style
              </span>
              <span className="hidden md:inline-block text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate border-l border-slate-200 dark:border-slate-700 pl-2">
                {activeAnalogMeta.tagline}
              </span>
            </div>

            {/* Movement Mode, Sub-Readout & Daily Shuffle */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 ml-auto">
              <div
                className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold"
                title="Second hand movement: smooth 60fps mechanical sweep or 1Hz quartz tick"
              >
                <button
                  onClick={() => setAnalogMotion('sweep')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    analogMotion === 'sweep'
                      ? 'bg-white dark:bg-slate-700 shadow-xs text-brand-600 dark:text-brand-300'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  Sweep
                </button>
                <button
                  onClick={() => setAnalogMotion('tick')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    analogMotion === 'tick'
                      ? 'bg-white dark:bg-slate-700 shadow-xs text-brand-600 dark:text-brand-300'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  Tick
                </button>
              </div>

              <button
                onClick={() => setShowAnalogSubDigital(!showAnalogSubDigital)}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  showAnalogSubDigital
                    ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-600 dark:text-brand-300'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
                title="Show or hide digital readout underneath the analog dial"
              >
                Sub-Digital
              </button>

              <button
                onClick={handleDailyMix}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700/60 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 whitespace-nowrap shadow-xs"
                title="Shuffle a fresh analog dial style and color theme combo"
              >
                <Shuffle size={12} />
                <span>Daily Mix</span>
              </button>
            </div>
          </div>

          {/* 20 Selectable Analog Watch Faces */}
          <div className="flex items-center gap-1.5 overflow-x-auto sm:overflow-visible sm:flex-wrap no-scrollbar pb-0.5 sm:pb-0">
            {ANALOG_STYLES.map((st) => {
              const isActive = analogStyle === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => setAnalogStyle(st.id)}
                  title={`${st.label} - ${st.tagline}`}
                  data-analog-style={st.id}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                    isActive
                      ? 'bg-brand-600 text-white border-brand-500 shadow-sm shadow-brand-500/25'
                      : 'bg-slate-100/90 dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700'
                  }`}
                >
                  <AnalogStyleGlyph styleId={st.id} />
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>

          {/* Animated Canvas Background Presets */}
          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-800/70 overflow-x-auto sm:overflow-visible sm:flex-wrap no-scrollbar pb-0.5 sm:pb-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 shrink-0">
              Animated Bg
            </span>
            {CLOCK_BG_FX_OPTIONS.map((bg) => {
              const isActive = bgFx === bg.id;
              return (
                <button
                  key={bg.id}
                  onClick={() => setBgFx(bg.id)}
                  title={bg.tagline}
                  data-bg-fx={bg.id}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                    isActive
                      ? 'bg-brand-600 text-white border-brand-500 shadow-xs'
                      : 'bg-slate-100/80 dark:bg-slate-800/80 border-slate-200/70 dark:border-slate-700/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700'
                  }`}
                >
                  {bg.shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
        className={`${themeConfig.bg} ${themeConfig.border} border flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-500 select-none ${
          isFullscreen
            ? 'fixed inset-0 z-[100] !mt-0 rounded-none h-screen h-[100dvh] min-h-0 w-screen w-full border-none px-4 sm:px-8 md:px-12 pt-16 sm:pt-20 pb-6 sm:pb-10 overflow-y-auto overflow-x-hidden no-scrollbar'
            : 'relative rounded-3xl p-6 sm:p-14 min-h-[460px] overflow-hidden'
        }`}
      >
        {/* Glow backdrop layer with dynamic animations */}
        <div
          className={`absolute inset-0 ${themeConfig.glow} ${getAnimationGlowClass()} pointer-events-none transition-all duration-700`}
        />

        {/* Animated Ambient Background Layer */}
        <ClockBackgroundLayer bgFx={bgFx} themeConfig={themeConfig} />

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
          <div className={`relative z-10 my-auto max-w-full px-2 ${isFullscreen ? 'space-y-6 sm:space-y-8' : 'space-y-4'}`}>
            <div className="flex flex-wrap items-baseline justify-center gap-1 sm:gap-3 max-w-full">
              <span
                className={`leading-none ${getFontFamilyClass(false)} ${themeConfig.clockText} ${getAnimationTextClass()} ${
                  isFullscreen
                    ? showSeconds
                      ? isWideFont
                        ? 'text-[clamp(2.2rem,min(10.5vw,22vh),13.5rem)]'
                        : 'text-[clamp(2.8rem,min(13.5vw,25vh),17rem)]'
                      : isWideFont
                        ? 'text-[clamp(3rem,min(15vw,30vh),18rem)]'
                        : 'text-[clamp(3.8rem,min(19vw,34vh),22rem)]'
                    : isWideFont
                      ? 'text-4xl sm:text-6xl md:text-7xl lg:text-8xl'
                      : 'text-5xl sm:text-7xl md:text-8xl lg:text-9xl'
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
                        ? isWideFont
                          ? 'text-[clamp(1.4rem,min(6vw,13vh),7.5rem)]'
                          : 'text-[clamp(1.8rem,min(8vw,15vh),10rem)]'
                        : isWideFont
                          ? 'text-2xl sm:text-4xl md:text-5xl'
                          : 'text-3xl sm:text-5xl md:text-6xl'
                    }`}>
                      {secondsStr}
                    </span>
                  </>
                )}
              </span>

              {!is24Hour && (
                <span className={`font-extrabold uppercase ${themeConfig.accent} ${
                  isFullscreen
                    ? 'text-[clamp(1.1rem,min(3.2vw,5.5vh),3.5rem)] ml-2 sm:ml-4'
                    : 'text-lg sm:text-2xl md:text-3xl ml-1.5 sm:ml-2'
                }`}>
                  {ampm}
                </span>
              )}
            </div>

            {showDate && (
              <p className={`font-medium tracking-wide ${themeConfig.subText || 'text-slate-400'} ${
                isFullscreen ? 'text-[clamp(1rem,min(2.5vw,3.8vh),2.25rem)] pt-3' : 'text-base sm:text-xl'
              }`}>
                {dateStr}
              </p>
            )}
          </div>
        )}

        {/* Mode 2: Modern StandBy Stacked Mode (Vertical Large Digits) */}
        {mode === 'stacked' && (
          <div className={`relative z-10 flex flex-col items-center justify-center my-auto max-w-full ${isFullscreen ? 'space-y-3 py-2 sm:py-4' : 'space-y-2 py-4'}`}>
            <div className="flex flex-col items-center select-none">
              <span
                className={`${getFontFamilyClass(false)} ${themeConfig.clockText} ${getAnimationTextClass()} ${
                  isFullscreen
                    ? 'text-[clamp(3.8rem,min(24vw,29vh),19rem)] leading-[0.82]'
                    : 'text-7xl sm:text-9xl md:text-[10rem] lg:text-[11rem] leading-[0.85]'
                }`}
              >
                {hoursStr}
              </span>
              <span
                className={`${getFontFamilyClass(false)} ${themeConfig.clockText} ${getAnimationTextClass()} ${
                  isFullscreen
                    ? 'text-[clamp(3.8rem,min(24vw,29vh),19rem)] leading-[0.82]'
                    : 'text-7xl sm:text-9xl md:text-[10rem] lg:text-[11rem] leading-[0.85]'
                }`}
              >
                {minutesStr}
              </span>
            </div>

            <div className={`flex flex-wrap items-center justify-center gap-3 ${isFullscreen ? 'pt-3 sm:pt-5' : 'pt-3'}`}>
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

        {/* Mode: 12-Style Radial Gauge Studio */}
        {mode === 'radial' && (
          <div className="relative z-10 flex flex-col items-center space-y-2.5 sm:space-y-3.5 my-auto max-w-full">
            <RadialClockGauge
              styleId={radialStyle}
              motionMode={radialMotion}
              timezone={selectedTimezone}
              baseTime={displayTime}
              is24Hour={is24Hour}
              showSeconds={showSeconds}
              showDate={showDate}
              fontStyle={fontStyle}
              fontClassName={getFontFamilyClass(true)}
              animationTextClass={getAnimationTextClass()}
              themeConfig={themeConfig}
              isFullscreen={isFullscreen}
            />

            {/* Radial Legend Badges (toggleable in standard view; hidden in fullscreen to showcase only the big gauge) */}
            {!isFullscreen && showRadialTelemetry && (
              <div className="flex flex-wrap items-center justify-center font-semibold text-xs gap-3 pt-0.5">
                {(() => {
                  const syncCosmicDots = !themeConfig.isLight;
                  const dotHr = syncCosmicDots ? ensureBrightHex(themeConfig.handHr, '#fbbf24') : themeConfig.handHr;
                  const dotMin = syncCosmicDots ? ensureBrightHex(themeConfig.handMin, '#38bdf8') : themeConfig.handMin;
                  const dotSec = syncCosmicDots ? ensureBrightHex(themeConfig.handSec, '#f43f5e') : themeConfig.handSec;
                  return (
                    <>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dotHr }} />
                        <span className={themeConfig.subText || 'text-slate-400'}>Hour ({Math.round(hrProgress * 100)}%)</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dotMin }} />
                        <span className={themeConfig.subText || 'text-slate-400'}>Min ({Math.round(minProgress * 100)}%)</span>
                      </span>
                      {showSeconds && (
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dotSec }} />
                          <span className={themeConfig.subText || 'text-slate-400'}>Sec ({Math.round(secProgress * 100)}%)</span>
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {!isFullscreen && showDate && (
              <p className={`font-medium tracking-wide ${themeConfig.subText || 'text-slate-400'} text-xs sm:text-sm`}>
                {dateStr}
              </p>
            )}
          </div>
        )}

        {/* Mode: Typographic Word Clock */}
        {mode === 'words' && (
          <div className={`relative z-10 flex flex-col items-center justify-center my-auto select-none w-full ${
            isFullscreen ? 'max-w-7xl px-4 sm:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6' : 'max-w-3xl px-4 py-6 space-y-4'
          }`}>
            <span className={`font-bold uppercase tracking-widest border ${themeConfig.badgeBg} ${
              isFullscreen ? 'px-5 py-2 text-sm sm:text-base rounded-full' : 'px-3 py-1 text-xs rounded-full'
            }`}>
              It Is
            </span>

            {/* Conversational Phrase */}
            <h3 className={`font-black uppercase tracking-tight ${themeConfig.accent} ${
              isFullscreen ? 'text-[clamp(1.6rem,min(5vw,7vh),4.25rem)]' : 'text-2xl sm:text-4xl md:text-5xl'
            }`}>
              {wordClockData.phrase}
            </h3>

            {/* Hero Target Hour */}
            <h1
              className={`leading-none flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 max-w-full ${getFontFamilyClass(false)} ${themeConfig.clockText} ${getAnimationTextClass()} ${
                isFullscreen
                  ? isWideFont
                    ? 'text-[clamp(2.5rem,min(8.5vw,14vh),8.5rem)]'
                    : 'text-[clamp(3.2rem,min(11vw,16vh),10.5rem)]'
                  : isWideFont
                    ? 'text-4xl sm:text-6xl md:text-7xl'
                    : 'text-5xl sm:text-7xl md:text-8xl'
              }`}
            >
              <span>{wordClockData.targetHour}</span>
              {wordClockData.isOclock && (
                <span className={`opacity-80 ${isFullscreen ? 'text-[clamp(1.8rem,min(5.5vw,9vh),5.5rem)]' : 'text-2xl sm:text-4xl md:text-5xl'}`}>
                  O&apos;CLOCK
                </span>
              )}
            </h1>

            {/* Natural Period */}
            <p className={`font-bold uppercase tracking-widest ${themeConfig.subText || 'text-slate-400'} ${
              isFullscreen ? 'text-[clamp(1rem,min(3vw,4.5vh),2.75rem)]' : 'text-base sm:text-2xl'
            }`}>
              {wordClockData.period}
            </p>

            {/* Bottom Digital Verification Pill */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
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
            isFullscreen ? 'max-w-7xl px-4 sm:px-6 py-4 sm:py-6 gap-6 lg:gap-12' : 'max-w-4xl px-2 py-4 gap-8'
          }`}>
            {/* Left / Main Section: Big Time & Day Focus */}
            <div className="lg:col-span-7 min-w-0 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
              <div className="flex flex-wrap items-baseline justify-center lg:justify-start gap-x-2 gap-y-1 max-w-full">
                <span className={`leading-none ${getFontFamilyClass(true)} ${themeConfig.clockText} ${getAnimationTextClass()} ${
                  isFullscreen
                    ? isWideFont
                      ? 'text-[clamp(2.4rem,min(5.2vw,10vh),4.75rem)]'
                      : 'text-[clamp(2.8rem,min(6.8vw,12vh),6.5rem)]'
                    : isWideFont
                      ? 'text-3xl sm:text-5xl md:text-6xl'
                      : 'text-4xl sm:text-6xl md:text-7xl'
                }`}>
                  {hoursStr}:{minutesStr}
                </span>
                {showSeconds && (
                  <span className={`font-mono font-bold opacity-80 ${themeConfig.accent} ${
                    isFullscreen ? 'text-[clamp(1.2rem,min(2.5vw,4.8vh),2.6rem)]' : 'text-xl sm:text-2xl md:text-3xl'
                  }`}>
                    :{secondsStr}
                  </span>
                )}
                {!is24Hour && (
                  <span className={`font-black uppercase ml-1 ${themeConfig.accent} ${
                    isFullscreen ? 'text-[clamp(0.95rem,min(1.8vw,3.4vh),1.75rem)]' : 'text-sm sm:text-lg'
                  }`}>
                    {ampm}
                  </span>
                )}
              </div>

              {/* Date & Week */}
              <div className="space-y-1">
                <p className={`font-bold ${themeConfig.subText || 'text-slate-300'} ${
                  isFullscreen ? 'text-lg sm:text-2xl' : 'text-base sm:text-lg'
                }`}>
                  {dateStr}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 justify-center lg:justify-start">
                  <span className={`rounded-lg font-semibold border ${themeConfig.border} ${
                    themeConfig.isLight ? 'bg-slate-200/60 text-slate-800' : 'bg-white/10 text-slate-300'
                  } ${isFullscreen ? 'px-3 py-1 text-xs sm:text-base' : 'px-2.5 py-0.5 text-xs'}`}>
                    Week {weekNumber}
                  </span>
                  <span className={`rounded-lg font-semibold border ${themeConfig.border} ${
                    themeConfig.isLight ? 'bg-slate-200/60 text-slate-800' : 'bg-white/10 text-slate-300'
                  } ${isFullscreen ? 'px-3 py-1 text-xs sm:text-base' : 'px-2.5 py-0.5 text-xs'}`}>
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
            <div className={`lg:col-span-5 min-w-0 w-full max-w-sm lg:max-w-none mx-auto border backdrop-blur-xl ${
              isFullscreen ? 'p-5 sm:p-7 rounded-[2.25rem]' : 'p-5 rounded-3xl'
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
                isFullscreen ? 'text-xs sm:text-base' : 'text-xs'
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
          <div className="relative z-10 space-y-6 my-auto max-w-full">
            <div className={`flex flex-wrap items-center justify-center ${isFullscreen ? 'gap-2 sm:gap-5' : 'gap-2 sm:gap-5'}`}>
              {/* Hours Card */}
              <FlipClockCard
                value={hoursStr}
                label="Hours"
                isFullscreen={isFullscreen}
                isWideFont={isWideFont}
                variant="primary"
                themeConfig={themeConfig}
                fontClassName={getFontFamilyClass(true)}
                animationTextClass={getAnimationTextClass()}
              />

              <div className={`font-black animate-pulse ${themeConfig.accent} ${
                isFullscreen ? 'text-[clamp(1.8rem,min(7vw,10vh),6.5rem)]' : 'text-3xl sm:text-6xl'
              }`}>:</div>

              {/* Minutes Card */}
              <FlipClockCard
                value={minutesStr}
                label="Minutes"
                isFullscreen={isFullscreen}
                isWideFont={isWideFont}
                variant="primary"
                themeConfig={themeConfig}
                fontClassName={getFontFamilyClass(true)}
                animationTextClass={getAnimationTextClass()}
              />

              {showSeconds && (
                <>
                  <div className={`font-black animate-pulse ${themeConfig.accent} ${
                    isFullscreen ? 'text-[clamp(1.8rem,min(7vw,10vh),6.5rem)]' : 'text-3xl sm:text-6xl'
                  }`}>:</div>
                  {/* Seconds Card */}
                  <FlipClockCard
                    value={secondsStr}
                    label="Seconds"
                    isFullscreen={isFullscreen}
                    isWideFont={isWideFont}
                    variant="secondary"
                    themeConfig={themeConfig}
                    fontClassName={getFontFamilyClass(true)}
                    animationTextClass={getAnimationTextClass()}
                  />
                </>
              )}

              {!is24Hour && (
                <div className="flex flex-col justify-center self-center pl-1 sm:pl-2">
                  <span className={`font-extrabold uppercase ${themeConfig.accent} ${
                    isFullscreen ? 'text-lg sm:text-3xl lg:text-5xl' : 'text-base sm:text-2xl'
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

        {/* Mode 4: Razor-Sharp Multi-Style SVG Analog Horology Studio */}
        {mode === 'analog' && (
          <div className="relative z-10 flex flex-col items-center space-y-3 sm:space-y-4 my-auto max-w-full">
            <div className={`relative flex items-center justify-center ${
              isFullscreen
                ? 'w-[clamp(16rem,min(74vh,84vw),46rem)] h-[clamp(16rem,min(74vh,84vw),46rem)]'
                : 'w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96'
            }`}>
              <AnalogClockDial
                styleId={analogStyle}
                motionMode={analogMotion}
                timezone={selectedTimezone}
                baseTime={displayTime}
                is24Hour={is24Hour}
                showSeconds={showSeconds}
                showDate={showDate}
                fontStyle={fontStyle}
                themeConfig={themeConfig}
                dayProgress={dayProgress}
                ampm={ampm}
              />
            </div>

            {/* Sub Digital Readout (toggleable in standard view; hidden in fullscreen to showcase only the big clock) */}
            {!isFullscreen && showAnalogSubDigital && (
              <div className={`flex items-center gap-2 ${getFontFamilyClass(true)} ${
                themeConfig.isLight ? 'text-slate-800' : 'text-slate-200'
              } text-xl`}>
                <span>{hoursStr}:{minutesStr}{showSeconds ? `:${secondsStr}` : ''}</span>
                {!is24Hour && (
                  <span className={`uppercase ${themeConfig.accent} text-xs`}>
                    {ampm}
                  </span>
                )}
              </div>
            )}

            {!isFullscreen && showDate && (
              <p className={`${themeConfig.subText || 'text-slate-400'} text-xs`}>
                {dateStr}
              </p>
            )}
          </div>
        )}

        {/* Mode 5: Pomodoro Focus Timer Mode */}
        {mode === 'pomodoro' && (
          <div className="relative z-10 space-y-6 my-auto max-w-full px-2">
            <span className={`rounded-full font-bold uppercase tracking-widest border backdrop-blur-md ${themeConfig.badgeBg} ${
              isFullscreen ? 'px-6 py-2 text-sm sm:text-base' : 'px-4 py-1.5 text-xs'
            }`}>
              {pomoMode === 'work' ? 'Focus Session' : 'Short Break'}
            </span>

            <div className={`leading-none ${getFontFamilyClass(false)} ${themeConfig.clockText} ${getAnimationTextClass()} ${
              isFullscreen
                ? isWideFont
                  ? 'text-[clamp(3.2rem,min(14vw,26vh),15rem)]'
                  : 'text-[clamp(4.2rem,min(18vw,30vh),20rem)]'
                : isWideFont
                  ? 'text-5xl sm:text-7xl md:text-8xl'
                  : 'text-7xl sm:text-9xl'
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
          <div className={`relative z-10 space-y-6 my-auto w-full px-2 ${isFullscreen ? 'max-w-6xl' : 'max-w-3xl'}`}>
            <div className={`leading-none ${getFontFamilyClass(false)} ${themeConfig.clockText} ${getAnimationTextClass()} ${
              isFullscreen
                ? isWideFont
                  ? 'text-[clamp(2.8rem,min(11vw,22vh),12rem)]'
                  : 'text-[clamp(3.5rem,min(14.5vw,25vh),16rem)]'
                : isWideFont
                  ? 'text-4xl sm:text-6xl md:text-7xl'
                  : 'text-5xl sm:text-7xl md:text-8xl'
            }`}>
              {swMinutes}:{swSeconds}
              <span className={`opacity-80 ${
                isFullscreen
                  ? isWideFont
                    ? 'text-[clamp(1.6rem,min(6.5vw,13vh),7rem)]'
                    : 'text-[clamp(2rem,min(8.5vw,15vh),9.5rem)]'
                  : isWideFont
                    ? 'text-2xl sm:text-3xl md:text-4xl'
                    : 'text-3xl sm:text-4xl md:text-5xl'
              }`}>
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
                className={`max-h-36 max-w-md mx-auto overflow-y-auto space-y-1 p-2 rounded-2xl ${
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
