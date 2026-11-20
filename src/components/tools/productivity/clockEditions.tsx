import React from 'react';

export type ClockEdition =
  | 'classic'
  | 'invincible'
  | 'cyberpunk'
  | 'dune'
  | 'doomsday'
  | 'spiderverse'
  | 'evangelion'
  | 'tron'
  | 'akira';

export interface EditionThemeStyles {
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

export interface ClockEditionMeta {
  id: ClockEdition;
  label: string;
  shortTag: string;
  tagline: string;
  recommendedBg: string;
  recommendedAnalog?: string;
  recommendedRadial?: string;
  swatchClass: string;
  // Bespoke per-mode lore badges & UI labels
  digitalEyebrow: string;
  stackedEyebrow: string;
  wordEyebrow: string;
  deskHeader: string;
  pomoWorkLabel: string;
  pomoBreakLabel: string;
  pomoStartLabel: string;
  stopwatchEyebrow: string;
}

export const CLOCK_EDITIONS: ClockEditionMeta[] = [
  {
    id: 'classic',
    label: 'Classic Studio',
    shortTag: 'STUDIO',
    tagline: 'Use any of the 45 curated color themes with clean precision typography',
    recommendedBg: 'aurora',
    swatchClass: 'bg-gradient-to-tr from-indigo-500 to-sky-400',
    digitalEyebrow: '',
    stackedEyebrow: '',
    wordEyebrow: 'It Is',
    deskHeader: 'Desk Station',
    pomoWorkLabel: 'Focus Session',
    pomoBreakLabel: 'Short Break',
    pomoStartLabel: 'Start Focus',
    stopwatchEyebrow: '',
  },
  {
    id: 'invincible',
    label: 'Invincible',
    shortTag: 'VILTRUM',
    tagline: 'Bold hero title-card yellow on Viltrumite blue with halftone ink and crimson flecks',
    recommendedBg: 'comic_burst',
    recommendedAnalog: 'invincible',
    recommendedRadial: 'invincible_arc',
    swatchClass: 'bg-gradient-to-tr from-[#0062e6] via-[#0095ff] to-[#ffe600]',
    digitalEyebrow: 'GDA HERO DISPATCH // TITLE CARD',
    stackedEyebrow: 'ISSUE #01 // EARTH-PRIME',
    wordEyebrow: 'IT IS',
    deskHeader: 'GDA Command Calendar',
    pomoWorkLabel: 'GUARDIANS TRAINING',
    pomoBreakLabel: 'RECOVERY CYCLE',
    pomoStartLabel: 'Engage Focus',
    stopwatchEyebrow: 'VILTRUMITE MACH CHRONO',
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    shortTag: 'NC-2077',
    tagline: 'Night City Edgerunners netrunner HUD with chamfered corners, glitch yellow and neon rain',
    recommendedBg: 'cyber_rain',
    recommendedAnalog: 'cyberwave',
    recommendedRadial: 'cyber_hud',
    swatchClass: 'bg-gradient-to-tr from-[#ff003c] via-[#fcee0a] to-[#00f0ff]',
    digitalEyebrow: 'NET://NC-2077 // ICE: ACTIVE // SYNC 99.8%',
    stackedEyebrow: 'ARASAKA TOWER // SECTOR 07',
    wordEyebrow: 'BREACH // TIME',
    deskHeader: 'Fixer Cyberdeck',
    pomoWorkLabel: 'SANDEVISTAN OVERCLOCK',
    pomoBreakLabel: 'NEURAL COOLDOWN',
    pomoStartLabel: 'Run Sandevistan',
    stopwatchEyebrow: 'SANDEVISTAN REFLEX SPLIT',
  },
  {
    id: 'dune',
    label: 'Dune Arrakis',
    shortTag: 'ARRAKIS',
    tagline: 'Monumental Arrakeen desert ochre, twin-sun eclipse horizon and glowing Fremen spice blue',
    recommendedBg: 'sandstorm',
    recommendedAnalog: 'dune',
    recommendedRadial: 'dune_eclipse',
    swatchClass: 'bg-gradient-to-tr from-[#92400e] via-[#f59e0b] to-[#38bdf8]',
    digitalEyebrow: 'ARRAKIS // IMPERIAL CYCLE 10191',
    stackedEyebrow: 'MUAD-DIB // SECOND MOON',
    wordEyebrow: 'DESERT ORACLE',
    deskHeader: 'Guild Star-Chart',
    pomoWorkLabel: 'LITANY FOCUS CYCLE',
    pomoBreakLabel: 'STILLSUIT REST',
    pomoStartLabel: 'Begin Cycle',
    stopwatchEyebrow: 'ORNITHOPTER FLIGHT CHRONO',
  },
  {
    id: 'doomsday',
    label: 'Doomsday',
    shortTag: 'MIDNIGHT',
    tagline: 'Armored vault steel, Minutes-to-Midnight crimson danger sector and reactor hazard bars',
    recommendedBg: 'ripple',
    recommendedAnalog: 'doomsday',
    recommendedRadial: 'doomsday_core',
    swatchClass: 'bg-gradient-to-tr from-[#18181b] via-[#dc2626] to-[#f59e0b]',
    digitalEyebrow: 'VAULT SECTOR 00 // MINUTES TO MIDNIGHT',
    stackedEyebrow: 'CONTAINMENT SILO // DEFCON 2',
    wordEyebrow: 'ALERT // SIGNAL',
    deskHeader: 'Bunker Command Log',
    pomoWorkLabel: 'REACTOR CONTAINMENT',
    pomoBreakLabel: 'VENTING COOLDOWN',
    pomoStartLabel: 'Arm Timer',
    stopwatchEyebrow: 'LAUNCH TELEMETRY CHRONO',
  },
  {
    id: 'spiderverse',
    label: 'Spider-Verse',
    shortTag: 'EARTH-1610',
    tagline: 'Chromatic cyan-magenta comic misregistration, Ben-Day halftones and multiverse portal web',
    recommendedBg: 'comic_burst',
    recommendedAnalog: 'spider_web',
    recommendedRadial: 'spider_web',
    swatchClass: 'bg-gradient-to-tr from-[#00f5ff] via-[#7c3aed] to-[#ff2a85]',
    digitalEyebrow: 'EARTH-1610 // MULTIVERSE GIZMO SYNC',
    stackedEyebrow: 'ACROSS DIMENSIONS // 1610',
    wordEyebrow: 'EARTH-1610',
    deskHeader: 'Dimensional Watch',
    pomoWorkLabel: 'PORTAL STABILIZER',
    pomoBreakLabel: 'ANOMALY REST',
    pomoStartLabel: 'Leap Into Focus',
    stopwatchEyebrow: 'WEB-SLINGER VELOCITY',
  },
  {
    id: 'evangelion',
    label: 'Evangelion',
    shortTag: 'NERV-01',
    tagline: 'NERV MAGI tactical cockpit amber, internal battery countdown cells and AT-Field hex grid',
    recommendedBg: 'hex_field',
    recommendedAnalog: 'evangelion',
    recommendedRadial: 'nerv_hex',
    swatchClass: 'bg-gradient-to-tr from-[#ff1e27] via-[#ff6a00] to-[#39ff14]',
    digitalEyebrow: 'NERV MAGI-01 // INTERNAL POWER // ACTIVE',
    stackedEyebrow: 'ENTRY PLUG // SYNC RATIO 94.2%',
    wordEyebrow: 'MELCHIOR • BALTHASAR • CASPER',
    deskHeader: 'GeoFront Tactical Deck',
    pomoWorkLabel: 'INTERNAL BATTERY ACTIVE',
    pomoBreakLabel: 'UMBILICAL RECHARGE',
    pomoStartLabel: 'Launch Unit-01',
    stopwatchEyebrow: 'SYNCHRONIZATION CHRONO',
  },
  {
    id: 'tron',
    label: 'Tron Grid',
    shortTag: 'ENCOM',
    tagline: 'Obsidian glass digital arena, razor Identity Disc cyan light-ribbons and fiery orange nodes',
    recommendedBg: 'grid',
    recommendedAnalog: 'tron_disc',
    recommendedRadial: 'tron_disc',
    swatchClass: 'bg-gradient-to-tr from-[#020617] via-[#00f2ff] to-[#ff6b00]',
    digitalEyebrow: 'ENCOM // THE GRID // IDENTITY DISC VERIFIED',
    stackedEyebrow: 'GRID SECTOR 04 // LIGHT CYCLE',
    wordEyebrow: 'GRID DIRECTIVE',
    deskHeader: 'ISO System Terminal',
    pomoWorkLabel: 'ARENA GRID CYCLE',
    pomoBreakLabel: 'DISC STANDBY',
    pomoStartLabel: 'Enter The Grid',
    stopwatchEyebrow: 'LIGHT-CYCLE ARENA SPLIT',
  },
  {
    id: 'akira',
    label: 'Akira 2019',
    shortTag: 'NEO-TOKYO',
    tagline: '1988 Neo-Tokyo crimson bike lacquer, laser taillight trails and analog phosphor tachometer',
    recommendedBg: 'warp',
    recommendedAnalog: 'cyberwave',
    recommendedRadial: 'turbine',
    swatchClass: 'bg-gradient-to-tr from-[#ef233c] via-[#f97316] to-[#14b8a6]',
    digitalEyebrow: 'NEO-TOKYO // 2019 // SOL-740 TELEMETRY',
    stackedEyebrow: 'CAPSULE HIGHWAY // 12,000 RPM',
    wordEyebrow: 'NEO-TOKYO // 2019',
    deskHeader: 'Orbital SOL Console',
    pomoWorkLabel: 'TURBO OVERDRIVE',
    pomoBreakLabel: 'ENGINE COOLING',
    pomoStartLabel: 'Ignite Drive',
    stopwatchEyebrow: 'HIGHWAY CHASE SPLIT',
  },
];

export const getEditionThemeStyles = (edition: Exclude<ClockEdition, 'classic'>): EditionThemeStyles => {
  switch (edition) {
    case 'invincible':
      return {
        bg: 'bg-gradient-to-br from-[#005ae0] via-[#0082f3] to-[#0047b3]',
        clockText: 'edition-invincible-text',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(255,230,0,0.22),transparent_72%)]',
        accent: 'text-[#ffe600]',
        border: 'border-[#020617] ring-2 ring-[#ffe600]/80',
        badgeBg: 'bg-[#ffe600] text-[#020617] border-[#020617] font-black shadow-[2px_2px_0_#020617]',
        handSec: '#ef4444',
        handMin: '#ffe600',
        handHr: '#38bdf8',
        dialBg: '#0066e6',
        dialBorder: '#ffe600',
        flipCard: 'bg-[#020617] text-[#ffe600] border-[#ffe600] shadow-[4px_6px_0_#020617]',
        progressBar: 'bg-gradient-to-r from-[#ffe600] via-[#facc15] to-[#ef4444]',
        subText: 'text-sky-100',
        dialTickMajor: '#ffe600',
        dialTickMinor: 'rgba(255,255,255,0.48)',
        dialNumColor: '#ffffff',
      };
    case 'cyberpunk':
      return {
        bg: 'bg-[#090910]',
        clockText: 'edition-cyberpunk-text',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(252,238,10,0.14),rgba(0,240,255,0.08)_45%,transparent_75%)]',
        accent: 'text-[#00f0ff]',
        border: 'border-[#fcee0a]/60',
        badgeBg: 'bg-[#fcee0a]/15 text-[#fcee0a] border-[#fcee0a]/60',
        handSec: '#ff003c',
        handMin: '#00f0ff',
        handHr: '#fcee0a',
        dialBg: '#0b0c16',
        dialBorder: '#fcee0a',
        flipCard: 'bg-[#12121e] text-[#fcee0a] border-[#00f0ff]/60 shadow-[#00f0ff]/20',
        progressBar: 'bg-gradient-to-r from-[#fcee0a] via-[#00f0ff] to-[#ff003c]',
        subText: 'text-cyan-200/85',
        dialTickMajor: '#fcee0a',
        dialTickMinor: 'rgba(0,240,255,0.34)',
        dialNumColor: '#fcee0a',
      };
    case 'dune':
      return {
        bg: 'bg-gradient-to-b from-[#160e07] via-[#261608] to-[#3b210b]',
        clockText: 'text-transparent bg-clip-text bg-gradient-to-b from-[#fef3c7] via-[#f59e0b] to-[#b45309] drop-shadow-[0_0_32px_rgba(245,158,11,0.55)]',
        glow: 'bg-[radial-gradient(ellipse_at_50%_70%,rgba(245,158,11,0.22),rgba(56,189,248,0.08)_55%,transparent_78%)]',
        accent: 'text-[#38bdf8]',
        border: 'border-amber-500/40',
        badgeBg: 'bg-amber-500/15 text-amber-200 border-amber-400/40',
        handSec: '#38bdf8',
        handMin: '#fbbf24',
        handHr: '#d97706',
        dialBg: '#1c1108',
        dialBorder: '#d97706',
        flipCard: 'bg-[#211409] text-amber-200 border-amber-500/45 shadow-amber-950/60',
        progressBar: 'bg-gradient-to-r from-amber-700 via-amber-400 to-sky-400',
        subText: 'text-amber-200/75',
        dialTickMajor: '#fde68a',
        dialTickMinor: 'rgba(251,191,36,0.32)',
        dialNumColor: '#fef3c7',
      };
    case 'doomsday':
      return {
        bg: 'bg-[#090a0d]',
        clockText: 'text-[#ff3b1f] drop-shadow-[0_0_34px_rgba(255,59,31,0.85)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.2),rgba(245,158,11,0.08)_48%,transparent_75%)]',
        accent: 'text-[#f59e0b]',
        border: 'border-red-600/55',
        badgeBg: 'bg-red-600/20 text-red-300 border-red-500/60',
        handSec: '#ff2a00',
        handMin: '#f59e0b',
        handHr: '#94a3b8',
        dialBg: '#111317',
        dialBorder: '#ef4444',
        flipCard: 'bg-[#14171c] text-[#ff4d2e] border-red-600/50 shadow-red-950/60',
        progressBar: 'bg-gradient-to-r from-amber-500 via-red-600 to-red-500',
        subText: 'text-slate-300',
        dialTickMajor: '#f8fafc',
        dialTickMinor: 'rgba(248,250,252,0.28)',
        dialNumColor: '#f1f5f9',
      };
    case 'spiderverse':
      return {
        bg: 'bg-gradient-to-br from-[#0c0521] via-[#170936] to-[#080d22]',
        clockText: 'edition-spiderverse-text',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(255,42,133,0.22),rgba(0,245,255,0.14)_52%,transparent_76%)]',
        accent: 'text-[#00f5ff]',
        border: 'border-[#ff2a85]/60',
        badgeBg: 'bg-[#ff2a85]/20 text-[#ff85b8] border-[#00f5ff]/55',
        handSec: '#ff2a85',
        handMin: '#00f5ff',
        handHr: '#facc15',
        dialBg: '#110729',
        dialBorder: '#ff2a85',
        flipCard: 'bg-[#140933] text-white border-[#00f5ff]/60 shadow-[#ff2a85]/35',
        progressBar: 'bg-gradient-to-r from-[#00f5ff] via-[#ff2a85] to-[#facc15]',
        subText: 'text-fuchsia-200/85',
        dialTickMajor: '#00f5ff',
        dialTickMinor: 'rgba(255,42,133,0.42)',
        dialNumColor: '#ffffff',
      };
    case 'evangelion':
      return {
        bg: 'bg-[#050302]',
        clockText: 'text-[#ff7b00] drop-shadow-[0_0_32px_rgba(255,106,0,0.9)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(255,106,0,0.18),rgba(255,30,39,0.08)_50%,transparent_75%)]',
        accent: 'text-[#39ff14]',
        border: 'border-[#ff6a00]/65',
        badgeBg: 'bg-[#ff6a00]/15 text-[#ff8c26] border-[#ff6a00]/60',
        handSec: '#ff1e27',
        handMin: '#ff7b00',
        handHr: '#39ff14',
        dialBg: '#090503',
        dialBorder: '#ff6a00',
        flipCard: 'bg-[#0e0703] text-[#ff7b00] border-[#ff6a00]/65 shadow-[#ff6a00]/25',
        progressBar: 'bg-gradient-to-r from-[#39ff14] via-[#ff7b00] to-[#ff1e27]',
        subText: 'text-orange-200/80',
        dialTickMajor: '#ff7b00',
        dialTickMinor: 'rgba(255,106,0,0.34)',
        dialNumColor: '#ff9433',
      };
    case 'tron':
      return {
        bg: 'bg-[#020710]',
        clockText: 'text-[#67f8ff] drop-shadow-[0_0_32px_rgba(0,242,255,0.9)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(0,242,255,0.16),rgba(255,107,0,0.06)_52%,transparent_76%)]',
        accent: 'text-[#ff7b1a]',
        border: 'border-[#00f2ff]/55',
        badgeBg: 'bg-[#00f2ff]/12 text-[#7cf9ff] border-[#00f2ff]/50',
        handSec: '#ff6b00',
        handMin: '#00f2ff',
        handHr: '#38bdf8',
        dialBg: '#030b17',
        dialBorder: '#00f2ff',
        flipCard: 'bg-[#040f1f] text-[#7cf9ff] border-[#00f2ff]/60 shadow-[#00f2ff]/25',
        progressBar: 'bg-gradient-to-r from-[#00f2ff] via-[#38bdf8] to-[#ff6b00]',
        subText: 'text-cyan-200/80',
        dialTickMajor: '#00f2ff',
        dialTickMinor: 'rgba(0,242,255,0.3)',
        dialNumColor: '#a5f3fc',
      };
    case 'akira':
    default:
      return {
        bg: 'bg-[#0c0407]',
        clockText: 'text-[#ff2a4b] drop-shadow-[0_0_32px_rgba(239,35,60,0.9)]',
        glow: 'bg-[radial-gradient(ellipse_at_center,rgba(239,35,60,0.22),rgba(251,191,36,0.08)_50%,transparent_76%)]',
        accent: 'text-[#fbbf24]',
        border: 'border-[#ef233c]/60',
        badgeBg: 'bg-[#ef233c]/20 text-rose-200 border-[#ef233c]/60',
        handSec: '#ef233c',
        handMin: '#fbbf24',
        handHr: '#14b8a6',
        dialBg: '#13060a',
        dialBorder: '#ef233c',
        flipCard: 'bg-[#19080e] text-[#fbbf24] border-[#ef233c]/65 shadow-[#ef233c]/30',
        progressBar: 'bg-gradient-to-r from-[#ef233c] via-[#f97316] to-[#fbbf24]',
        subText: 'text-rose-200/80',
        dialTickMajor: '#fbbf24',
        dialTickMinor: 'rgba(239,35,60,0.38)',
        dialNumColor: '#fde68a',
      };
  }
};

export const CinemaEditionGlyph: React.FC<{ edition: ClockEdition; className?: string }> = ({
  edition,
  className = 'w-4 h-4 shrink-0',
}) => {
  switch (edition) {
    case 'invincible':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <rect x="2" y="2" width="16" height="16" rx="4" fill="#0077ff" stroke="#020617" strokeWidth="1.4" />
          <path d="M 4.5 6.5 H 15.5 L 13.5 9.8 H 6.5 Z" fill="#ffe600" stroke="#020617" strokeWidth="0.9" />
          <rect x="8.3" y="10.2" width="3.4" height="5.5" rx="0.6" fill="#ffe600" stroke="#020617" strokeWidth="0.9" />
          <circle cx="15.4" cy="14.5" r="1.2" fill="#ef4444" />
        </svg>
      );
    case 'cyberpunk':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <polygon points="5,2 18,2 18,15 15,18 2,18 2,5" fill="#0c0c16" stroke="#fcee0a" strokeWidth="1.4" />
          <path d="M 5.5 8.5 H 14.5 L 12.5 12.2 H 7.5 Z" fill="#00f0ff" fillOpacity="0.85" />
          <line x1="5" y1="15" x2="13.5" y2="15" stroke="#ff003c" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'dune':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="9.2" r="5.6" fill="#f59e0b" fillOpacity="0.28" stroke="#fbbf24" strokeWidth="1.3" />
          <path d="M 3 14.8 Q 10 11 17 14.8" stroke="#d97706" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="10" cy="9.2" r="1.8" fill="#38bdf8" />
        </svg>
      );
    case 'doomsday':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.8" fill="#111317" stroke="#ef4444" strokeWidth="1.4" />
          <path d="M 10 2.2 A 7.8 7.8 0 0 0 4.5 4.5 L 10 10 Z" fill="#ef4444" fillOpacity="0.65" />
          <line x1="10" y1="10" x2="8.2" y2="4.4" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="10" r="1.5" fill="#ffffff" />
        </svg>
      );
    case 'spiderverse':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.6" stroke="#00f5ff" strokeWidth="1.2" />
          <circle cx="10" cy="10" r="4.2" stroke="#ff2a85" strokeWidth="1.1" />
          <line x1="10" y1="2.4" x2="10" y2="17.6" stroke="#ff2a85" strokeWidth="0.9" />
          <line x1="2.4" y1="10" x2="17.6" y2="10" stroke="#00f5ff" strokeWidth="0.9" />
          <line x1="4.6" y1="4.6" x2="15.4" y2="15.4" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="0.8" />
          <line x1="15.4" y1="4.6" x2="4.6" y2="15.4" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="0.8" />
        </svg>
      );
    case 'evangelion':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <polygon points="10,2 17,6 17,14 10,18 3,14 3,6" fill="#090503" stroke="#ff6a00" strokeWidth="1.4" />
          <polygon points="10,5.2 14.2,7.6 14.2,12.4 10,14.8 5.8,12.4 5.8,7.6" stroke="#ff1e27" strokeWidth="1.1" />
          <circle cx="10" cy="10" r="1.6" fill="#39ff14" />
        </svg>
      );
    case 'tron':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.6" stroke="#00f2ff" strokeWidth="1.6" />
          <circle cx="10" cy="10" r="4.4" stroke="#00f2ff" strokeOpacity="0.7" strokeWidth="1.2" strokeDasharray="6 3" />
          <circle cx="10" cy="10" r="1.6" fill="#ff6b00" />
        </svg>
      );
    case 'akira':
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" fill="#19080e" stroke="#ef233c" strokeWidth="1.5" />
          <path d="M 4.5 13 A 6 6 0 1 1 15.5 13" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="10" y1="10" x2="14.5" y2="6.5" stroke="#ef233c" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    case 'classic':
    default:
      return (
        <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.4" />
          <path d="M 10 3.5 L 11.8 8.2 L 16.5 10 L 11.8 11.8 L 10 16.5 L 8.2 11.8 L 3.5 10 L 8.2 8.2 Z" fill="currentColor" />
        </svg>
      );
  }
};

export const ClockEditionOverlay: React.FC<{ edition: ClockEdition; isFullscreen: boolean }> = React.memo(({
  edition,
  isFullscreen,
}) => {
  if (edition === 'classic') return null;

  return (
    <div
      data-testid="clock-edition-overlay"
      data-edition-active={edition}
      className="absolute inset-0 pointer-events-none select-none z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {/* INVINCIBLE: Comic Halftone Texture + Graphic Panel Border + Stylized Crimson Ink Flecks */}
      {edition === 'invincible' && (
        <>
          <div className="edition-halftone-dark absolute inset-0 opacity-65" />
          <div className="absolute inset-3 sm:inset-4 rounded-2xl border-[3px] border-[#020617]/80 shadow-[inset_0_0_0_2px_rgba(255,230,0,0.45)]" />
          <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-[#ffe600]/22 via-transparent to-transparent" />
          {/* Stylized Comic Action Corner Flecks */}
          <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            <g fill="#dc2626" fillOpacity="0.82">
              <circle cx="726" cy="74" r="7" />
              <circle cx="744" cy="58" r="4" />
              <circle cx="755" cy="86" r="3" />
              <ellipse cx="708" cy="64" rx="5" ry="2.2" transform="rotate(-32 708 64)" />
              <circle cx="74" cy="428" r="6" />
              <circle cx="56" cy="444" r="3.5" />
              <ellipse cx="92" cy="440" rx="4.5" ry="2" transform="rotate(24 92 440)" />
            </g>
            {/* Dynamic Yellow Comic Corner Chevrons */}
            <polygon points="0,468 78,468 62,500 0,500" fill="#ffe600" fillOpacity="0.92" />
            <polygon points="738,0 800,0 800,32 722,32" fill="#ffe600" fillOpacity="0.88" />
          </svg>
        </>
      )}

      {/* CYBERPUNK: Scanlines + 45-deg Tactical Brackets + Hazard Caution Strip */}
      {edition === 'cyberpunk' && (
        <>
          <div className="edition-scanlines absolute inset-0 opacity-75" />
          <div className="edition-hazard-stripe absolute bottom-0 inset-x-0 h-2 opacity-80" />
          <div className="absolute top-16 left-5 w-6 h-6 border-t-2 border-l-2 border-[#fcee0a]/75" />
          <div className="absolute top-16 right-5 w-6 h-6 border-t-2 border-r-2 border-[#00f0ff]/75" />
          <div className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 border-[#00f0ff]/75" />
          <div className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 border-[#ff003c]/80" />
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 left-10 right-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.22em] text-[#00f0ff]/65">
              <span>NET://NC-2077.84</span>
              <span className="text-[#fcee0a]/75">DAEMON // BREACH READY</span>
            </div>
          )}
        </>
      )}

      {/* DUNE: Monumental Arrakis Golden Horizon + Spice Blue Glint + Thin Imperial Frame */}
      {edition === 'dune' && (
        <>
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#b45309]/28 via-[#d97706]/8 to-transparent" />
          <div className="absolute inset-4 rounded-2xl border border-amber-400/20" />
          <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-55">
            <circle cx="400" cy="485" r="210" fill="none" stroke="#fbbf24" strokeOpacity="0.22" strokeWidth="1" />
            <circle cx="400" cy="485" r="245" fill="none" stroke="#38bdf8" strokeOpacity="0.16" strokeWidth="0.8" strokeDasharray="3 8" />
            <line x1="60" y1="456" x2="740" y2="456" stroke="#f59e0b" strokeOpacity="0.28" strokeWidth="0.9" />
          </svg>
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono tracking-[0.34em] uppercase text-amber-200/55">
              <span>ARRAKIS // 10191</span>
              <span className="text-sky-300/70">MELANGE SPICE</span>
            </div>
          )}
        </>
      )}

      {/* DOOMSDAY: Bunker Steel Rivets + Hazard Caution Chevrons + Alert Frame */}
      {edition === 'doomsday' && (
        <>
          <div className="edition-doomsday-stripe absolute bottom-0 inset-x-0 h-2.5 opacity-90" />
          <div className="absolute inset-3.5 rounded-2xl border border-red-500/35 shadow-[inset_0_0_40px_rgba(220,38,38,0.12)]" />
          {/* 4 Industrial Corner Hex Rivets */}
          {[
            'top-16 left-5',
            'top-16 right-5',
            'bottom-5 left-5',
            'bottom-5 right-5',
          ].map((pos, idx) => (
            <span
              key={idx}
              className={`absolute ${pos} w-3 h-3 rounded-full bg-zinc-800 border border-red-500/60 shadow-inner flex items-center justify-center`}
            >
              <span className="w-1 h-1 rounded-full bg-amber-400/80" />
            </span>
          ))}
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-12 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.26em] text-red-400/70">
              <span>SECTOR 00 // VAULT CLOCK</span>
              <span className="text-amber-400/75">MIDNIGHT PROTOCOL</span>
            </div>
          )}
        </>
      )}

      {/* SPIDER-VERSE: Cyan + Magenta Offset Comic Frame & Halftone Matrix */}
      {edition === 'spiderverse' && (
        <>
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(rgba(0,245,255,0.45) 1.2px, transparent 1.2px), radial-gradient(rgba(255,42,133,0.4) 1.2px, transparent 1.2px)',
              backgroundSize: '18px 18px',
              backgroundPosition: '0 0, 9px 9px',
            }}
          />
          <div className="absolute inset-3.5 rounded-2xl border-2 border-[#00f5ff]/55 translate-x-[-2px] translate-y-[-2px]" />
          <div className="absolute inset-3.5 rounded-2xl border-2 border-[#ff2a85]/55 translate-x-[2px] translate-y-[2px]" />
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-4 inset-x-10 items-center justify-between text-[9px] font-mono font-black uppercase tracking-[0.26em] text-[#00f5ff]/75">
              <span>EARTH-1610</span>
              <span className="text-[#ff2a85]/85">DIMENSIONAL SYNC</span>
            </div>
          )}
        </>
      )}

      {/* EVANGELION: NERV MAGI Hex Corners + Amber Tactical Rails + Scanlines */}
      {edition === 'evangelion' && (
        <>
          <div className="edition-scanlines absolute inset-0 opacity-70" />
          <div className="absolute inset-3.5 border border-[#ff6a00]/45" />
          <div className="absolute top-16 left-5 right-5 h-px bg-gradient-to-r from-[#ff6a00]/65 via-transparent to-[#ff6a00]/65" />
          <div className="absolute bottom-5 left-5 right-5 h-px bg-gradient-to-r from-[#ff1e27]/65 via-[#ff6a00]/30 to-[#39ff14]/65" />
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-2 left-6 right-6 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.22em] text-[#ff7b00]/75">
              <span>MAGI-01 // MELCHIOR</span>
              <span className="text-[#39ff14]/80">AT-FIELD: NOMINAL</span>
            </div>
          )}
        </>
      )}

      {/* TRON GRID: Parallel Twin Glowing Cyan Light-Cycle Circuit Frame */}
      {edition === 'tron' && (
        <>
          <div className="absolute inset-3 rounded-2xl border border-[#00f2ff]/55 shadow-[inset_0_0_24px_rgba(0,242,255,0.16)]" />
          <div className="absolute inset-[18px] rounded-xl border border-[#00f2ff]/25" />
          <div className="absolute bottom-0 inset-x-12 h-[2px] bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent opacity-80" />
          <div className="absolute top-1/2 left-3 w-1.5 h-16 -translate-y-1/2 rounded-full bg-[#00f2ff]/70 shadow-[0_0_12px_#00f2ff]" />
          <div className="absolute top-1/2 right-3 w-1.5 h-16 -translate-y-1/2 rounded-full bg-[#ff6b00]/80 shadow-[0_0_12px_#ff6b00]" />
        </>
      )}

      {/* AKIRA: Neo-Tokyo 1988 Crimson Tail-Light Laser Streaks & Scanlines */}
      {edition === 'akira' && (
        <>
          <div className="edition-scanlines absolute inset-0 opacity-65" />
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#ef233c] via-[#fbbf24] to-[#14b8a6] opacity-85" />
          <div className="absolute inset-3.5 rounded-2xl border border-[#ef233c]/40" />
          <svg viewBox="0 0 800 500" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-55">
            <line x1="0" y1="435" x2="220" y2="435" stroke="#ef233c" strokeWidth="2.2" />
            <line x1="0" y1="444" x2="145" y2="444" stroke="#fbbf24" strokeWidth="1.4" />
            <line x1="580" y1="435" x2="800" y2="435" stroke="#ef233c" strokeWidth="2.2" />
            <line x1="655" y1="444" x2="800" y2="444" stroke="#14b8a6" strokeWidth="1.4" />
          </svg>
          {!isFullscreen && (
            <div className="hidden sm:flex absolute bottom-3 inset-x-10 items-center justify-between text-[9px] font-mono font-bold uppercase tracking-[0.28em] text-rose-300/70">
              <span>NEO-TOKYO // 2019</span>
              <span className="text-amber-300/80">KANEDA // 12000 RPM</span>
            </div>
          )}
        </>
      )}
    </div>
  );
});

export const getEditionDigitFrameClass = (edition: ClockEdition, isFullscreen: boolean): string => {
  switch (edition) {
    case 'invincible':
      return `${isFullscreen ? 'px-8 py-5 sm:px-14 sm:py-8' : 'px-6 py-4 sm:px-10 sm:py-6'} -skew-x-6 rounded-2xl bg-[#005ae0]/55 border-[3px] border-[#020617] shadow-[8px_8px_0_#020617] backdrop-blur-xs`;
    case 'cyberpunk':
      return `${isFullscreen ? 'px-8 py-5 sm:px-14 sm:py-8' : 'px-6 py-4 sm:px-10 sm:py-5'} edition-chamfer bg-black/65 border border-[#fcee0a]/60 shadow-[0_0_36px_rgba(0,240,255,0.18)] backdrop-blur-md`;
    case 'dune':
      return `${isFullscreen ? 'px-8 py-4 sm:px-14 sm:py-6' : 'px-6 py-3 sm:px-10 sm:py-5'} border-y border-amber-400/35 bg-gradient-to-r from-transparent via-amber-950/35 to-transparent`;
    case 'doomsday':
      return `${isFullscreen ? 'px-8 py-5 sm:px-14 sm:py-8' : 'px-6 py-4 sm:px-10 sm:py-6'} rounded-xl bg-[#0d0f13]/90 border-2 border-red-600/65 shadow-[0_0_40px_rgba(220,38,38,0.28),inset_0_0_24px_rgba(0,0,0,0.9)]`;
    case 'spiderverse':
      return `${isFullscreen ? 'px-8 py-5 sm:px-14 sm:py-8' : 'px-6 py-4 sm:px-10 sm:py-6'} -rotate-1 rounded-2xl bg-[#100626]/75 border-2 border-[#00f5ff] shadow-[6px_6px_0_#ff2a85,-4px_-4px_0_#00f5ff]`;
    case 'evangelion':
      return `${isFullscreen ? 'px-8 py-5 sm:px-14 sm:py-8' : 'px-6 py-4 sm:px-10 sm:py-6'} bg-black/85 border-2 border-[#ff6a00]/80 shadow-[0_0_32px_rgba(255,106,0,0.28)]`;
    case 'tron':
      return `${isFullscreen ? 'px-8 py-5 sm:px-14 sm:py-8' : 'px-6 py-4 sm:px-10 sm:py-6'} rounded-2xl bg-[#020a16]/75 border border-[#00f2ff]/70 ring-1 ring-[#00f2ff]/30 ring-offset-4 ring-offset-transparent shadow-[0_0_36px_rgba(0,242,255,0.24)]`;
    case 'akira':
      return `${isFullscreen ? 'px-8 py-5 sm:px-14 sm:py-8' : 'px-6 py-4 sm:px-10 sm:py-6'} rounded-2xl bg-[#140509]/82 border-y-2 border-x border-[#ef233c]/75 shadow-[0_0_36px_rgba(239,35,60,0.3)]`;
    case 'classic':
    default:
      return '';
  }
};

export const ClockEditionPowerMeter: React.FC<{
  edition: ClockEdition;
  progress: number;
  isFullscreen?: boolean;
}> = ({ edition, progress, isFullscreen = false }) => {
  if (edition === 'classic') return null;
  const clamped = Math.min(1, Math.max(0, progress));
  const segments = edition === 'evangelion' || edition === 'akira' ? 16 : 12;
  const litCount = Math.round(clamped * segments);

  return (
    <div className={`w-full mx-auto ${isFullscreen ? 'max-w-xl' : 'max-w-sm'} flex flex-col gap-1.5`}>
      <div className="flex items-center gap-1 w-full">
        {Array.from({ length: segments }).map((_, idx) => {
          const lit = idx < litCount;
          let activeColor = 'bg-sky-400';
          if (edition === 'invincible') activeColor = idx >= segments - 2 ? 'bg-[#ef4444]' : 'bg-[#ffe600]';
          else if (edition === 'cyberpunk') activeColor = idx % 3 === 0 ? 'bg-[#00f0ff]' : 'bg-[#fcee0a]';
          else if (edition === 'dune') activeColor = idx >= segments - 3 ? 'bg-[#38bdf8]' : 'bg-[#f59e0b]';
          else if (edition === 'doomsday') activeColor = idx >= segments - 4 ? 'bg-[#ff2a00]' : 'bg-[#f59e0b]';
          else if (edition === 'spiderverse') activeColor = idx % 2 === 0 ? 'bg-[#00f5ff]' : 'bg-[#ff2a85]';
          else if (edition === 'evangelion')
            activeColor = idx >= segments - 3 ? 'bg-[#ff1e27]' : idx < 3 ? 'bg-[#39ff14]' : 'bg-[#ff7b00]';
          else if (edition === 'tron') activeColor = idx >= segments - 2 ? 'bg-[#ff6b00]' : 'bg-[#00f2ff]';
          else if (edition === 'akira') activeColor = idx >= segments - 4 ? 'bg-[#ef233c]' : 'bg-[#fbbf24]';

          return (
            <span
              key={idx}
              className={`h-2 flex-1 rounded-xs transition-all duration-300 ${
                lit ? `${activeColor} shadow-xs` : 'bg-white/10'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
