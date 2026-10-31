import React, { useState, useMemo, useCallback } from 'react';
import {
  Calendar as CalendarIcon,
  CalendarDays,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  Search,
  RotateCcw,
  BookOpen,
  Star,
  Award,
  ArrowRight,
  Download,
  Printer,
  CalendarCheck,
  Compass,
  Layers,
  Heart,
  ShieldAlert
} from 'lucide-react';
import {
  toKhmerLunarDate,
  formatKhmerDate,
  getKhmerHolidays,
  toKhmerNumber,
  KhmerLunarDate,
  KhmerHoliday,
  FormatOptions,
  KhmerMonth,
  DAYS_OF_WEEK_EN_BY_KM
} from 'khmer-chhankitek-calendar';
import { CopyButton } from '../../common/CopyButton';

// ==========================================
// BESPOKE SVG ICONS (100% PURE VECTOR - NO EMOJIS)
// ==========================================

/** Dharmachakra (Buddhist Wheel of Law) for ថ្ងៃសីល (Holy Observance Days) */
export const DharmaWheelIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = 'text-amber-500' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block shrink-0 ${className}`}
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3.2" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    <line x1="12" y1="3" x2="12" y2="8.8" />
    <line x1="12" y1="15.2" x2="12" y2="21" />
    <line x1="3" y1="12" x2="8.8" y2="12" />
    <line x1="15.2" y1="12" x2="21" y2="12" />
    <line x1="5.64" y1="5.64" x2="9.74" y2="9.74" />
    <line x1="14.26" y1="14.26" x2="18.36" y2="18.36" />
    <line x1="5.64" y1="18.36" x2="9.74" y2="14.26" />
    <line x1="14.26" y1="9.74" x2="18.36" y2="5.64" />
  </svg>
);

/** Full Moon (ពេញបូណ៌មី - 15th Waxing) */
export const FullMoonIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={`inline-block shrink-0 ${className}`}>
    <defs>
      <radialGradient id="fullMoonGlowGrad" cx="38%" cy="38%" r="65%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="65%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </radialGradient>
    </defs>
    <circle cx="12" cy="12" r="9.5" fill="url(#fullMoonGlowGrad)" stroke="#b45309" strokeWidth="0.8" />
    <circle cx="8.5" cy="8.5" r="1.5" fill="#fef3c7" opacity="0.6" />
    <circle cx="15" cy="14" r="2" fill="#d97706" opacity="0.25" />
    <circle cx="14" cy="8" r="1" fill="#d97706" opacity="0.2" />
  </svg>
);

/** New Moon (ដាច់ខែ - 14th/15th Waning) */
export const NewMoonIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={`inline-block shrink-0 ${className}`}>
    <circle cx="12" cy="12" r="9.5" fill="#1e293b" stroke="#64748b" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="7.2" fill="none" stroke="#475569" strokeWidth="0.75" strokeDasharray="2 2" />
  </svg>
);

/** Waxing Half Moon (៨ កើត) */
export const WaxingHalfMoonIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={`inline-block shrink-0 ${className}`}>
    <circle cx="12" cy="12" r="9.5" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
    <path d="M 12 2.5 A 9.5 9.5 0 0 1 12 21.5 Z" fill="#f59e0b" />
  </svg>
);

/** Waning Half Moon (៨ រោច) */
export const WaningHalfMoonIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={`inline-block shrink-0 ${className}`}>
    <circle cx="12" cy="12" r="9.5" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
    <path d="M 12 2.5 A 9.5 9.5 0 0 0 12 21.5 Z" fill="#f59e0b" />
  </svg>
);

/** Waxing Crescent (ចន្ទកើត) */
export const WaxingCrescentIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={`inline-block shrink-0 ${className}`}>
    <circle cx="12" cy="12" r="9.5" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
    <path d="M 12 2.5 A 9.5 9.5 0 0 1 12 21.5 A 7 9.5 0 0 0 12 2.5 Z" fill="#f59e0b" />
  </svg>
);

/** Waning Crescent (ចន្ទរោច) */
export const WaningCrescentIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={`inline-block shrink-0 ${className}`}>
    <circle cx="12" cy="12" r="9.5" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
    <path d="M 12 2.5 A 9.5 9.5 0 0 0 12 21.5 A 7 9.5 0 0 1 12 2.5 Z" fill="#f59e0b" />
  </svg>
);

/** Vector Moon Phase Glyph selector */
export const MoonPhaseGlyph: React.FC<{ status: 'កើត' | 'រោច'; day: number; size?: number; className?: string }> = ({
  status,
  day,
  size = 14,
  className = ''
}) => {
  if (status === 'កើត') {
    if (day === 15) return <FullMoonIcon size={size} className={className} />;
    if (day === 8) return <WaxingHalfMoonIcon size={size} className={className} />;
    return <WaxingCrescentIcon size={size} className={className} />;
  } else {
    if (day === 14 || day === 15) return <NewMoonIcon size={size} className={className} />;
    if (day === 8) return <WaningHalfMoonIcon size={size} className={className} />;
    return <WaningCrescentIcon size={size} className={className} />;
  }
};

// ==========================================
// 12 BESPOKE KHMER ZODIAC ANIMAL VECTOR ICONS
// ==========================================

const RatIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 19c-1.5-2-1.5-5 0-7-2-1-4-1-6 0-1-1.5-2.5-2-4.5-1.5A3 3 0 0 0 5 13.5c0 2 1.5 3.5 3.5 4.5 3 1.5 7 1.5 10.5 1z" />
    <circle cx="8" cy="12" r="0.75" fill="currentColor" />
    <path d="M19 12c2.5-1 4 1 3 3" />
  </svg>
);

const OxIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 7c1.5 0 3 1.5 3.5 4M20 7c-1.5 0-3 1.5-3.5 4" />
    <path d="M7.5 11a4.5 4.5 0 0 0 9 0c0-2-1.5-4-4.5-4s-4.5 2-4.5 4z" />
    <path d="M9 16c0 2.5 1.5 4 3 4s3-1.5 3-4" />
    <circle cx="10" cy="12" r="0.75" fill="currentColor" />
    <circle cx="14" cy="12" r="0.75" fill="currentColor" />
  </svg>
);

const TigerIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 8c0-3 3-4 4-2M19 8c0-3-3-4-4-2" />
    <circle cx="12" cy="13" r="7" />
    <path d="M10 9l2 2 2-2M12 11v3M9 15h6" />
    <circle cx="9.5" cy="12.5" r="0.75" fill="currentColor" />
    <circle cx="14.5" cy="12.5" r="0.75" fill="currentColor" />
  </svg>
);

const RabbitIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 3c-1 3 0 6 1.5 8M15 3c1 3 0 6-1.5 8" />
    <circle cx="12" cy="15" r="5" />
    <circle cx="10" cy="14" r="0.75" fill="currentColor" />
    <circle cx="14" cy="14" r="0.75" fill="currentColor" />
    <path d="M11 16.5c.5.5 1.5.5 2 0" />
  </svg>
);

const DragonIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3l2 4 4-1-2 4 4 1-4 3 2 4-5-2-4 4-1-5-4-1 4-3-1-4 4 1z" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

const SnakeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 5a3 3 0 0 1 6 0c0 2-2 3-3 4-2 2-3 4-1 7 1.5 2 4.5 2 6 0 1.5-2 1-4-1-5" />
    <circle cx="9" cy="5" r="0.75" fill="currentColor" />
  </svg>
);

const HorseIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 19c-2-1-4-3-4-6 0-3 1-5 2-8-3 0-6 2-7 5L8 9c-2 0-3 1.5-3 3 0 1 1.5 2 3 2l2 6h9z" />
    <circle cx="8" cy="11" r="0.75" fill="currentColor" />
  </svg>
);

const GoatIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 4c-2 2-3 5-1 7M17 4c2 2 3 5 1 7" />
    <path d="M9 10a3 3 0 0 0 6 0c0-2-1.5-3-3-3s-3 1-3 3z" />
    <path d="M12 13v4l-1 3h2l-1-3" />
    <circle cx="10.5" cy="10" r="0.75" fill="currentColor" />
    <circle cx="13.5" cy="10" r="0.75" fill="currentColor" />
  </svg>
);

const MonkeyIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="5" cy="12" r="2.5" />
    <circle cx="19" cy="12" r="2.5" />
    <circle cx="12" cy="12" r="5.5" />
    <circle cx="10" cy="11" r="0.75" fill="currentColor" />
    <circle cx="14" cy="11" r="0.75" fill="currentColor" />
    <path d="M10.5 14.5c.8.6 2.2.6 3 0" />
  </svg>
);

const RoosterIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 4c-.5 1.5-2 2-2 3.5 0 1 .5 1.5 1.5 1.5" />
    <path d="M13 3c-.5 2-2.5 3-2.5 4.5" />
    <path d="M8 10c0 4 3 7 7 7l4-2-3-3c0-3-2-6-5-6-1 0-2 .5-3 1.5z" />
    <path d="M7 11l-3 1 3 1" />
    <circle cx="8" cy="10" r="0.75" fill="currentColor" />
    <path d="M12 17v4M10 21h4" />
  </svg>
);

const DogIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 6l3 4M18 6l-3 4" />
    <path d="M9 10a3 3 0 0 0 6 0c0-2-1.5-3-3-3s-3 1-3 3z" />
    <path d="M9 13c-2 2-2 5 0 6 2 1 4 1 6 0 2-1 2-4 0-6" />
    <circle cx="10.5" cy="10.5" r="0.75" fill="currentColor" />
    <circle cx="13.5" cy="10.5" r="0.75" fill="currentColor" />
    <path d="M11.5 14.5c.3.3.7.3 1 0" />
  </svg>
);

const PigIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="13" r="6.5" />
    <path d="M7 7l2 3M17 7l-2 3" />
    <ellipse cx="12" cy="14" rx="2.5" ry="1.8" />
    <circle cx="11.2" cy="14" r="0.5" fill="currentColor" />
    <circle cx="12.8" cy="14" r="0.5" fill="currentColor" />
    <circle cx="9.5" cy="11.5" r="0.75" fill="currentColor" />
    <circle cx="14.5" cy="11.5" r="0.75" fill="currentColor" />
  </svg>
);

export const ZodiacAnimalIcon: React.FC<{ name: string; size?: number; className?: string }> = ({
  name,
  size = 20,
  className = ''
}) => {
  switch (name) {
    case 'ជូត':
      return <RatIcon size={size} className={className} />;
    case 'ឆ្លូវ':
      return <OxIcon size={size} className={className} />;
    case 'ខាល':
      return <TigerIcon size={size} className={className} />;
    case 'ថោះ':
      return <RabbitIcon size={size} className={className} />;
    case 'រោង':
      return <DragonIcon size={size} className={className} />;
    case 'ម្សាញ់':
      return <SnakeIcon size={size} className={className} />;
    case 'មមី':
      return <HorseIcon size={size} className={className} />;
    case 'មមែ':
      return <GoatIcon size={size} className={className} />;
    case 'វក':
      return <MonkeyIcon size={size} className={className} />;
    case 'រកា':
      return <RoosterIcon size={size} className={className} />;
    case 'ច':
      return <DogIcon size={size} className={className} />;
    case 'កុរ':
      return <PigIcon size={size} className={className} />;
    default:
      return <HorseIcon size={size} className={className} />;
  }
};

// 12 Khmer Animal Zodiacs Information & Astrological Harmony
interface ZodiacInfo {
  km: string;
  en: string;
  element: string;
  elementColor: string;
  traits: string;
  compatible: string[]; // ត្រីធាតុ / Sam Hap (3 Harmonious Signs)
  clash: string;        // គូឆុង / Tu Hap (Direct Clash Sign)
}

const ZODIAC_ANIMALS: Record<string, ZodiacInfo> = {
  'ជូត': {
    km: 'ជូត',
    en: 'Rat',
    element: 'ធាតុទឹក (Water)',
    elementColor: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
    traits: 'វាងវៃ រហ័សរហួន មានប្រាជ្ញាឈ្លាសវៃ និងសន្សំសំចៃ',
    compatible: ['រោង', 'វក'],
    clash: 'មមី'
  },
  'ឆ្លូវ': {
    km: 'ឆ្លូវ',
    en: 'Ox',
    element: 'ធាតុដី (Earth)',
    elementColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    traits: 'អត់ធ្មត់ ឧស្សាហ៍ព្យាយាម ស្មោះត្រង់ ហ្មត់ចត់',
    compatible: ['ម្សាញ់', 'រកា'],
    clash: 'មមែ'
  },
  'ខាល': {
    km: 'ខាល',
    en: 'Tiger',
    element: 'ធាតុឈើ (Wood)',
    elementColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    traits: 'ក្លាហាន ម៉ឺងម៉ាត់ មានអំណាច ស្វាហាប់ និងមានភាពជាអ្នកដឹកនាំ',
    compatible: ['មមី', 'ច'],
    clash: 'វក'
  },
  'ថោះ': {
    km: 'ថោះ',
    en: 'Rabbit',
    element: 'ធាតុឈើ (Wood)',
    elementColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    traits: 'ស្លូតបូត សុភាពរាបសារ រួសរាយ ពូកែទំនាក់ទំនង',
    compatible: ['មមែ', 'កុរ'],
    clash: 'រកា'
  },
  'រោង': {
    km: 'រោង',
    en: 'Dragon',
    element: 'ធាតុដី (Earth)',
    elementColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    traits: 'មានឫទ្ធិអំណាច ថ្លៃថ្នូរ ឧត្តមគតិខ្ពស់ ចិត្តទូលាយ',
    compatible: ['ជូត', 'វក'],
    clash: 'ច'
  },
  'ម្សាញ់': {
    km: 'ម្សាញ់',
    en: 'Snake',
    element: 'ធាតុភ្លើង (Fire)',
    elementColor: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
    traits: 'ឈ្លាសវៃ ស្ងប់ស្ងាត់ គិតស៊ីជម្រៅ មានមន្តស្នេហ៍',
    compatible: ['ឆ្លូវ', 'រកា'],
    clash: 'កុរ'
  },
  'មមី': {
    km: 'មមី',
    en: 'Horse',
    element: 'ធាតុភ្លើង (Fire)',
    elementColor: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
    traits: 'ស្វាហាប់ សកម្ម ស្រឡាញ់សេរីភាព មិនចុះចាញ់ឧបសគ្គ',
    compatible: ['ខាល', 'ច'],
    clash: 'ជូត'
  },
  'មមែ': {
    km: 'មមែ',
    en: 'Goat',
    element: 'ធាតុដី (Earth)',
    elementColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    traits: 'សុភាពស្លូតបូត ចិត្តល្អ មានសិល្បៈនិយម ស្រឡាញ់សន្តិភាព',
    compatible: ['ថោះ', 'កុរ'],
    clash: 'ឆ្លូវ'
  },
  'វក': {
    km: 'វក',
    en: 'Monkey',
    element: 'ធាតុមាស (Metal)',
    elementColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
    traits: 'ឆ្លាតរហ័សរហួន រស់រវើក ចូលចិត្តរៀនសូត្រ និងបត់បែន',
    compatible: ['ជូត', 'រោង'],
    clash: 'ខាល'
  },
  'រកា': {
    km: 'រកា',
    en: 'Rooster',
    element: 'ធាតុមាស (Metal)',
    elementColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
    traits: 'ទៀងទាត់ម៉ោងពេល ឧស្សាហ៍ រៀបរយ មានទំនុកចិត្តលើខ្លួនឯង',
    compatible: ['ឆ្លូវ', 'ម្សាញ់'],
    clash: 'ថោះ'
  },
  'ច': {
    km: 'ច',
    en: 'Dog',
    element: 'ធាតុដី (Earth)',
    elementColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    traits: 'ស្មោះត្រង់ យុត្តិធម៌ គួរឱ្យទុកចិត្ត ស្រឡាញ់គ្រួសារ',
    compatible: ['ខាល', 'មមី'],
    clash: 'រោង'
  },
  'កុរ': {
    km: 'កុរ',
    en: 'Pig',
    element: 'ធាតុទឹក (Water)',
    elementColor: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
    traits: 'ចិត្តទូលាយ មានចិត្តមេត្តា ស្មោះត្រង់ នាំលាភសំណាង និងសិរីមង្គល',
    compatible: ['ថោះ', 'មមែ'],
    clash: 'ម្សាញ់'
  }
};

// 10 Saks (ស័កទាំង១០)
const SAKS_DATA = [
  { km: 'ឯកស័ក', en: 'Aekasak', num: 1, desc: 'ឆ្នាំទី ១ នៃជុំស័ក' },
  { km: 'ទោស័ក', en: 'Tosak', num: 2, desc: 'ឆ្នាំទី ២ នៃជុំស័ក' },
  { km: 'ត្រីស័ក', en: 'Treisak', num: 3, desc: 'ឆ្នាំទី ៣ នៃជុំស័ក' },
  { km: 'ចត្វាស័ក', en: 'Chatvasak', num: 4, desc: 'ឆ្នាំទី ៤ នៃជុំស័ក' },
  { km: 'បញ្ចស័ក', en: 'Panchasak', num: 5, desc: 'ឆ្នាំទី ៥ នៃជុំស័ក' },
  { km: 'ឆស័ក', en: 'Chhasak', num: 6, desc: 'ឆ្នាំទី ៦ នៃជុំស័ក' },
  { km: 'សប្តស័ក', en: 'Saptasak', num: 7, desc: 'ឆ្នាំទី ៧ នៃជុំស័ក' },
  { km: 'អដ្ឋស័ក', en: 'Atthasak', num: 8, desc: 'ឆ្នាំទី ៨ នៃជុំស័ក' },
  { km: 'នព្វស័ក', en: 'Navasak', num: 9, desc: 'ឆ្នាំទី ៩ នៃជុំស័ក' },
  { km: 'សំរឹទ្ធិស័ក', en: 'Samriddhisak', num: 10, desc: 'ឆ្នាំទី ១០ នៃជុំស័ក' }
];

// 14 Khmer Lunar Months (including leap months)
const ALL_KHMER_MONTHS: Array<{
  km: KhmerMonth;
  en: string;
  days: number | string;
  type: string;
  period: string;
}> = [
  { km: 'មិគសិរ', en: 'Migasir', days: 29, type: 'ខែខ្វះ (29 ថ្ងៃ)', period: 'វិច្ឆិកា - ធ្នូ' },
  { km: 'បុស្ស', en: 'Pous', days: 30, type: 'ខែពេញ (30 ថ្ងៃ)', period: 'ធ្នូ - មករា' },
  { km: 'មាឃ', en: 'Magha', days: 29, type: 'ខែខ្វះ (29 ថ្ងៃ)', period: 'មករា - កុម្ភៈ' },
  { km: 'ផល្គុន', en: 'Phalguna', days: 30, type: 'ខែពេញ (30 ថ្ងៃ)', period: 'កុម្ភៈ - មីនា' },
  { km: 'ចេត្រ', en: 'Chet', days: 29, type: 'ខែខ្វះ (29 ថ្ងៃ)', period: 'មីនា - មេសា' },
  { km: 'ពិសាខ', en: 'Vesak', days: 30, type: 'ខែពេញ (30 ថ្ងៃ)', period: 'មេសា - ឧសភា' },
  { km: 'ជេស្ឋ', en: 'Jeṭṭha', days: '29 ឬ 30', type: 'ធម្មតា/ចល័ត (ខែលើកថ្ងៃ)', period: 'ឧសភា - មិថុនា' },
  { km: 'អាសាឍ', en: 'Asadha', days: 30, type: 'ខែពេញ (ឆ្នាំធម្មតា)', period: 'មិថុនា - កក្កដា' },
  { km: 'បឋមាសាឍ', en: 'Pathamasadha', days: 30, type: 'ខែពេញ (អាសាឍទី១ ឆ្នាំលើកខែ)', period: 'មិថុនា - កក្កដា' },
  { km: 'ទុតិយាសាឍ', en: 'Tutiyasadha', days: 30, type: 'ខែពេញ (អាសាឍទី២ ឆ្នាំលើកខែ)', period: 'កក្កដា - សីហា' },
  { km: 'ស្រាពណ៍', en: 'Srapon', days: 29, type: 'ខែខ្វះ (29 ថ្ងៃ)', period: 'កក្កដា - សីហា' },
  { km: 'ភទ្របទ', en: 'Photrobot', days: 30, type: 'ខែពេញ (30 ថ្ងៃ)', period: 'សីហា - កញ្ញា' },
  { km: 'អស្សុជ', en: 'Assuj', days: 29, type: 'ខែខ្វះ (29 ថ្ងៃ)', period: 'កញ្ញា - តុលា' },
  { km: 'កត្តិក', en: 'Kattik', days: 30, type: 'ខែពេញ (30 ថ្ងៃ)', period: 'តុលា - វិច្ឆិកា' }
];

const GREGORIAN_MONTHS = [
  { km: 'មករា', en: 'January', val: 0 },
  { km: 'កុម្ភៈ', en: 'February', val: 1 },
  { km: 'មីនា', en: 'March', val: 2 },
  { km: 'មេសា', en: 'April', val: 3 },
  { km: 'ឧសភា', en: 'May', val: 4 },
  { km: 'មិថុនា', en: 'June', val: 5 },
  { km: 'កក្កដា', en: 'July', val: 6 },
  { km: 'សីហា', en: 'August', val: 7 },
  { km: 'កញ្ញា', en: 'September', val: 8 },
  { km: 'តុលា', en: 'October', val: 9 },
  { km: 'វិច្ឆិកា', en: 'November', val: 10 },
  { km: 'ធ្នូ', en: 'December', val: 11 }
];

const WEEKDAYS = [
  { km: 'អាទិត្យ', en: 'Sun', shortKm: 'អា', isWeekend: true, headerColor: 'text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-900/50' },
  { km: 'ចន្ទ', en: 'Mon', shortKm: 'ច', isWeekend: false, headerColor: 'text-emerald-800 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/40' },
  { km: 'អង្គារ', en: 'Tue', shortKm: 'អ', isWeekend: false, headerColor: 'text-emerald-800 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/40' },
  { km: 'ពុធ', en: 'Wed', shortKm: 'ព', isWeekend: false, headerColor: 'text-emerald-800 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/40' },
  { km: 'ព្រហស្បតិ៍', en: 'Thu', shortKm: 'ព្រ', isWeekend: false, headerColor: 'text-emerald-800 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/40' },
  { km: 'សុក្រ', en: 'Fri', shortKm: 'សុ', isWeekend: false, headerColor: 'text-emerald-800 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/40' },
  { km: 'សៅរ៍', en: 'Sat', shortKm: 'ស', isWeekend: true, headerColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200/80 dark:border-indigo-900/50' }
];

function formatIso(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export const KhmerLunarCalendar: React.FC = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'calendar' | 'holidays' | 'converter' | 'guide'>('calendar');

  // Today reference
  const today = useMemo(() => new Date(), []);
  const todayIso = useMemo(() => {
    return formatIso(today.getFullYear(), today.getMonth(), today.getDate());
  }, [today]);

  const todayLunar = useMemo(() => {
    try {
      return toKhmerLunarDate(todayIso);
    } catch {
      return null;
    }
  }, [todayIso]);

  // Calendar View State
  const [calYear, setCalYear] = useState<number>(() => today.getFullYear());
  const [calMonth, setCalMonth] = useState<number>(() => today.getMonth());
  const [calYearInput, setCalYearInput] = useState<string>(() => String(today.getFullYear()));
  const [selectedDateIso, setSelectedDateIso] = useState<string>(() => todayIso);

  // Sync Year Input with calYear
  const updateMonthYear = useCallback(
    (newYear: number, newMonth: number) => {
      const clampedYear = Math.max(1900, Math.min(2099, newYear));
      setCalYear(clampedYear);
      setCalYearInput(String(clampedYear));
      setCalMonth(newMonth);

      // Synchronize selected date to keep sidebar relevant
      if (clampedYear === today.getFullYear() && newMonth === today.getMonth()) {
        setSelectedDateIso(todayIso);
      } else {
        const currentSelectedDay = Number(selectedDateIso.split('-')[2]) || 1;
        const maxDaysInNewMonth = new Date(clampedYear, newMonth + 1, 0).getDate();
        const clampedDay = Math.min(currentSelectedDay, maxDaysInNewMonth);
        setSelectedDateIso(formatIso(clampedYear, newMonth, clampedDay));
      }
    },
    [selectedDateIso, today, todayIso]
  );

  // Handlers for month navigation
  const handlePrevMonth = () => {
    if (calMonth === 0) {
      if (calYear > 1900) {
        updateMonthYear(calYear - 1, 11);
      }
    } else {
      updateMonthYear(calYear, calMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      if (calYear < 2099) {
        updateMonthYear(calYear + 1, 0);
      }
    } else {
      updateMonthYear(calYear, calMonth + 1);
    }
  };

  const handleJumpToToday = () => {
    const now = new Date();
    updateMonthYear(now.getFullYear(), now.getMonth());
    setSelectedDateIso(formatIso(now.getFullYear(), now.getMonth(), now.getDate()));
  };

  const handleSelectDay = (dateIso: string) => {
    setSelectedDateIso(dateIso);
    const [y, m] = dateIso.split('-').map(Number);
    if (y !== calYear || m - 1 !== calMonth) {
      setCalYear(y);
      setCalYearInput(String(y));
      setCalMonth(m - 1);
    }
  };

  const handleCalYearInputBlur = () => {
    const val = parseInt(calYearInput, 10);
    if (!isNaN(val) && val >= 1900 && val <= 2099) {
      updateMonthYear(val, calMonth);
    } else {
      setCalYearInput(String(calYear));
    }
  };

  // Holidays Explorer state
  const [holidayYear, setHolidayYear] = useState<number>(() => today.getFullYear());
  const [holidayYearInput, setHolidayYearInput] = useState<string>(() => String(today.getFullYear()));
  const [holidayFilter, setHolidayFilter] = useState<'all' | 'public' | 'religious' | 'traditional' | 'upcoming'>('all');
  const [holidaySearch, setHolidaySearch] = useState<string>('');

  const handleHolidayYearChange = (newYear: number) => {
    const clamped = Math.max(1900, Math.min(2099, newYear));
    setHolidayYear(clamped);
    setHolidayYearInput(String(clamped));
  };

  // Converter state
  const [converterMode, setConverterMode] = useState<'solar-to-lunar' | 'lunar-to-solar'>('solar-to-lunar');
  const [converterDate, setConverterDate] = useState<string>(() => todayIso);
  const [convertLocale, setConvertLocale] = useState<'km' | 'en'>('km');
  const [convertFormat, setConvertFormat] = useState<'full' | 'long' | 'medium' | 'short'>('full');
  const [convertKhmerNum, setConvertKhmerNum] = useState<boolean>(true);
  const [convertIncludeGregorian, setConvertIncludeGregorian] = useState<boolean>(true);
  const [convertIncludeHoliday, setConvertIncludeHoliday] = useState<boolean>(true);

  // Reverse Converter state (Khmer Lunar -> Gregorian)
  const [revYear, setRevYear] = useState<number>(() => today.getFullYear());
  const [revMonth, setRevMonth] = useState<KhmerMonth>('ពិសាខ');
  const [revMoonStatus, setRevMoonStatus] = useState<'កើត' | 'រោច'>('កើត');
  const [revMoonDay, setRevMoonDay] = useState<number>(15);

  // Selected Date Lunar Info
  const selectedLunarInfo = useMemo<KhmerLunarDate | null>(() => {
    try {
      return toKhmerLunarDate(selectedDateIso);
    } catch {
      return null;
    }
  }, [selectedDateIso]);

  // Calendar Days Computation with Full Lunar Data on All Visible Slots
  const calendarGrid = useMemo(() => {
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDayIndex = new Date(calYear, calMonth, 1).getDay(); // 0 = Sunday
    const prevMonthDays = new Date(calYear, calMonth, 0).getDate();

    const days: Array<{
      dateIso: string;
      dayNum: number;
      isCurrentMonth: boolean;
      lunar?: KhmerLunarDate;
      isToday: boolean;
      isSelected: boolean;
      weekdayIdx: number;
    }> = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevMonthIdx = calMonth === 0 ? 11 : calMonth - 1;
      const prevYear = calMonth === 0 ? calYear - 1 : calYear;
      const iso = formatIso(prevYear, prevMonthIdx, d);
      let lunar: KhmerLunarDate | undefined;
      if (prevYear >= 1900 && prevYear <= 2099) {
        try {
          lunar = toKhmerLunarDate(iso);
        } catch {
          // ignore
        }
      }
      days.push({
        dateIso: iso,
        dayNum: d,
        isCurrentMonth: false,
        lunar,
        isToday: iso === todayIso,
        isSelected: iso === selectedDateIso,
        weekdayIdx: (firstDayIndex - 1 - i) % 7
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = formatIso(calYear, calMonth, d);
      const curWeekdayIdx = new Date(calYear, calMonth, d).getDay();
      let lunar: KhmerLunarDate | undefined;
      try {
        lunar = toKhmerLunarDate(iso);
      } catch {
        // Fallback for safety
      }
      days.push({
        dateIso: iso,
        dayNum: d,
        isCurrentMonth: true,
        lunar,
        isToday: iso === todayIso,
        isSelected: iso === selectedDateIso,
        weekdayIdx: curWeekdayIdx
      });
    }

    // Next month padding to fill a complete 35 or 42 grid
    const totalSlots = days.length <= 35 ? 35 : 42;
    const remaining = totalSlots - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextMonthIdx = calMonth === 11 ? 0 : calMonth + 1;
      const nextYear = calMonth === 11 ? calYear + 1 : calYear;
      const iso = formatIso(nextYear, nextMonthIdx, d);
      const nextWeekdayIdx = new Date(nextYear, nextMonthIdx, d).getDay();
      let lunar: KhmerLunarDate | undefined;
      if (nextYear >= 1900 && nextYear <= 2099) {
        try {
          lunar = toKhmerLunarDate(iso);
        } catch {
          // ignore
        }
      }
      days.push({
        dateIso: iso,
        dayNum: d,
        isCurrentMonth: false,
        lunar,
        isToday: iso === todayIso,
        isSelected: iso === selectedDateIso,
        weekdayIdx: nextWeekdayIdx
      });
    }

    return days;
  }, [calYear, calMonth, todayIso, selectedDateIso]);

  // Sil Days in Current Month
  const currentMonthSilDays = useMemo(() => {
    return calendarGrid.filter(d => d.isCurrentMonth && d.lunar?.isSilDay);
  }, [calendarGrid]);

  // Holidays in Current Month
  const currentMonthHolidays = useMemo(() => {
    return calendarGrid.filter(d => d.isCurrentMonth && d.lunar && d.lunar.holidays.length > 0);
  }, [calendarGrid]);

  // Active Khmer Lunar Month in Current Gregorian Month (first day & last day)
  const activeKhmerMonthsInView = useMemo(() => {
    const monthsFound = new Set<string>();
    calendarGrid.forEach(d => {
      if (d.isCurrentMonth && d.lunar?.khmerMonth) {
        monthsFound.add(d.lunar.khmerMonth);
      }
    });
    return Array.from(monthsFound);
  }, [calendarGrid]);

  // Current Lunisolar Context for the month banner
  const monthLunisolarDetails = useMemo(() => {
    const midDay = calendarGrid.find(d => d.isCurrentMonth && d.dayNum === 15)?.lunar || calendarGrid.find(d => d.isCurrentMonth)?.lunar;
    return midDay || null;
  }, [calendarGrid]);

  // Holidays list query
  const allHolidaysForYear = useMemo(() => {
    try {
      if (holidayYear < 1900 || holidayYear > 2099) return [];
      return getKhmerHolidays(holidayYear);
    } catch {
      return [];
    }
  }, [holidayYear]);

  // Filtered Holidays
  const filteredHolidays = useMemo(() => {
    return allHolidaysForYear.filter(h => {
      if (holidayFilter === 'public' && h.type !== 'public') return false;
      if (holidayFilter === 'religious' && h.type !== 'religious') return false;
      if (holidayFilter === 'traditional' && h.type !== 'traditional') return false;
      if (holidayFilter === 'upcoming') {
        if (h.date < todayIso) return false;
      }

      if (holidaySearch.trim()) {
        const q = holidaySearch.toLowerCase().trim();
        const kmMatch = h.nameKm.toLowerCase().includes(q);
        const enMatch = (h.nameEn || '').toLowerCase().includes(q);
        const dateMatch = h.date.includes(q);
        if (!kmMatch && !enMatch && !dateMatch) return false;
      }
      return true;
    });
  }, [allHolidaysForYear, holidayFilter, holidaySearch, todayIso]);

  // Next Upcoming Holiday in the current year
  const nextUpcomingHoliday = useMemo(() => {
    try {
      const list = getKhmerHolidays(today.getFullYear());
      return list.find(h => h.date >= todayIso) || null;
    } catch {
      return null;
    }
  }, [today, todayIso]);

  // Formatter Output for Tab 3 (Mode A: Solar -> Lunar)
  const convertedResult = useMemo(() => {
    if (!converterDate) {
      return { text: '', detailed: null, error: 'សូមជ្រើសរើសកាលបរិច្ឆេទ Please select a date' };
    }
    try {
      const options: FormatOptions = {
        locale: convertLocale,
        format: convertFormat,
        useKhmerNumbers: convertKhmerNum,
        includeGregorianDate: convertIncludeGregorian,
        includeHoliday: convertIncludeHoliday
      };
      const text = formatKhmerDate(converterDate, options);
      const detailed = toKhmerLunarDate(converterDate);
      return { text, detailed, error: null };
    } catch (e: unknown) {
      return { text: '', detailed: null, error: (e as Error)?.message || 'Invalid date' };
    }
  }, [converterDate, convertLocale, convertFormat, convertKhmerNum, convertIncludeGregorian, convertIncludeHoliday]);

  // Reverse Search Output for Tab 3 (Mode B: Lunar -> Solar)
  const reverseSearchResults = useMemo(() => {
    if (revYear < 1900 || revYear > 2099) return [];
    const results: Array<{ iso: string; lunar: KhmerLunarDate }> = [];
    const start = new Date(revYear, 0, 1);
    const end = new Date(revYear, 11, 31);

    for (let cur = new Date(start); cur <= end; cur.setDate(cur.getDate() + 1)) {
      const iso = formatIso(cur.getFullYear(), cur.getMonth(), cur.getDate());
      try {
        const l = toKhmerLunarDate(iso);
        if (l.khmerMonth === revMonth && l.moonStatus === revMoonStatus && l.moonDay === revMoonDay) {
          results.push({ iso, lunar: l });
        }
      } catch {
        // ignore
      }
    }
    return results;
  }, [revYear, revMonth, revMoonStatus, revMoonDay]);

  // Jump from Holiday or Converter to Calendar
  const jumpToHolidayDate = (dateStr: string) => {
    const [y, m] = dateStr.split('-').map(Number);
    updateMonthYear(y, m - 1);
    setSelectedDateIso(dateStr);
    setActiveTab('calendar');
  };

  // Export Cambodia Holidays as iCalendar (.ics)
  const handleExportHolidaysIcs = () => {
    if (allHolidaysForYear.length === 0) return;
    const events = allHolidaysForYear
      .map(h => {
        const cleanDate = h.date.replace(/-/g, '');
        const parts = h.date.split('-').map(Number);
        const nextDate = new Date(parts[0], parts[1] - 1, parts[2] + 1);
        const cleanNextDate = formatIso(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate()).replace(/-/g, '');
        return [
          'BEGIN:VEVENT',
          `UID:${h.date}-${encodeURIComponent(h.nameKm)}@vortexerotool.kh`,
          `DTSTAMP:${cleanDate}T000000Z`,
          `DTSTART;VALUE=DATE:${cleanDate}`,
          `DTEND;VALUE=DATE:${cleanNextDate}`,
          `SUMMARY:${h.nameKm}${h.nameEn ? ` (${h.nameEn})` : ''}`,
          `DESCRIPTION:Cambodian Holiday (${h.type}) - ${h.nameKm}`,
          'STATUS:CONFIRMED',
          'TRANSP:TRANSPARENT',
          'END:VEVENT'
        ].join('\r\n');
      })
      .join('\r\n');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VortexeroTool//Khmer Lunar Calendar//KM',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:Cambodia Holidays ${holidayYear}`,
      'X-WR-TIMEZONE:Asia/Phnom_Penh',
      events,
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cambodia-holidays-${holidayYear}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Print Calendar Function
  const handlePrintCalendar = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-800 dark:text-slate-100">
      {/* Top Hero Banner - Clean Cambodian Emerald & Slate Theme */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-emerald-600/10 via-emerald-600/5 to-slate-900/10 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-950 border border-emerald-500/25 dark:border-emerald-500/30 p-6 md:p-7 backdrop-blur-sm shadow-xl shadow-emerald-500/5 print:hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold tracking-wide">
              <DharmaWheelIcon size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span className="font-khmer">ប្រតិទិនចន្ទគតិខ្មែរផ្លូវការ & បុណ្យជាតិកម្ពុជា</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white flex flex-wrap items-baseline gap-3">
              <span className="font-khmer text-emerald-700 dark:text-emerald-400">ប្រតិទិនចន្ទគតិខ្មែរ</span>
              <span className="text-base sm:text-lg lg:text-xl font-medium text-slate-500 dark:text-slate-400 font-sans">
                Khmer Lunar Calendar & Chhankitek
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-khmer leading-relaxed">
              ពិនិត្យមើលថ្ងៃខែចន្ទគតិ ថ្ងៃសីល ពេញបូណ៌មី ដាច់ខែ កើត រោច ឆ្នាំសត្វ ស័ក ពុទ្ធសករាជ និងកាលវិភាគបុណ្យជាតិផ្លូវការនៅកម្ពុជា ជាមួយឧបករណ៍បម្លែងកាលបរិច្ឆេទសងខាង។
            </p>
          </div>

          {/* Today's Live Lunar Quick Card */}
          {todayLunar && (
            <div className="w-full lg:w-auto p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-emerald-500/30 shadow-md space-y-2.5 min-w-[310px]">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-sans">
                  <Clock size={13} />
                  Today / ថ្ងៃនេះ
                </span>
                {todayLunar.isSilDay ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-sm shadow-amber-500/40">
                    <DharmaWheelIcon size={12} className="text-white" />
                    <span className="font-khmer">ថ្ងៃសីល</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 font-sans">{todayLunar.gregorianDate}</span>
                )}
              </div>

              <div className="font-khmer text-base font-bold text-slate-900 dark:text-white leading-snug">
                {todayLunar.lunarDateText}
              </div>

              {todayLunar.observanceText && (
                <div className="text-xs font-khmer text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                  <Star size={12} className="text-amber-500 shrink-0" />
                  <span>{todayLunar.observanceText}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800 font-khmer">
                <span>{todayLunar.gregorianDateText}</span>
                <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold" title={`ឆ្នាំ${todayLunar.animalYear}`}>
                  <ZodiacAnimalIcon name={todayLunar.animalYear} size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span>ឆ្នាំ{todayLunar.animalYear}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 overflow-x-auto print:hidden">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap cursor-pointer ${
            activeTab === 'calendar'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
          }`}
        >
          <CalendarDays size={16} />
          <span className="font-khmer">ប្រតិទិនខែ Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab('holidays')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap cursor-pointer ${
            activeTab === 'holidays'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
          }`}
        >
          <Award size={16} />
          <span className="font-khmer">បុណ្យជាតិផ្លូវការ Holidays</span>
        </button>

        <button
          onClick={() => setActiveTab('converter')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap cursor-pointer ${
            activeTab === 'converter'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
          }`}
        >
          <RotateCcw size={16} />
          <span className="font-khmer">បម្លែងកាលបរិច្ឆេទ Date Converter</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap cursor-pointer ${
            activeTab === 'guide'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
          }`}
        >
          <Compass size={16} />
          <span className="font-khmer">ក្បួនចន្ទគតិ & ឆ្នាំសត្វ Zodiac Guide</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: MONTHLY CALENDAR VIEW                         */}
      {/* ==================================================== */}
      {activeTab === 'calendar' && (
        <div className="space-y-8">
          {/* Main Interactive Calendar Grid (Full Width & Spacious) */}
          <div className="w-full p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 sm:space-y-6">
              {/* Controls Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Month Dropdown */}
                  <select
                    value={calMonth}
                    onChange={e => updateMonthYear(calYear, Number(e.target.value))}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer font-khmer"
                  >
                    {GREGORIAN_MONTHS.map(m => (
                      <option key={m.val} value={m.val}>
                        ខែ{m.km} ({m.en})
                      </option>
                    ))}
                  </select>

                  {/* Year Input / Stepper with proper typing support */}
                  <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                    <button
                      onClick={() => updateMonthYear(Math.max(1900, calYear - 1), calMonth)}
                      className="px-2.5 py-2 hover:text-emerald-600 transition-colors text-slate-600 dark:text-slate-400 cursor-pointer"
                      title="ឆ្នាំមុន Previous Year"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <input
                      type="text"
                      value={calYearInput}
                      onChange={e => setCalYearInput(e.target.value)}
                      onBlur={handleCalYearInputBlur}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleCalYearInputBlur();
                      }}
                      className="w-16 bg-transparent text-center font-bold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none font-sans"
                      title="វាយបញ្ចូលឆ្នាំ (1900 - 2099)"
                    />
                    <button
                      onClick={() => updateMonthYear(Math.min(2099, calYear + 1), calMonth)}
                      className="px-2.5 py-2 hover:text-emerald-600 transition-colors text-slate-600 dark:text-slate-400 cursor-pointer"
                      title="ឆ្នាំបន្ទាប់ Next Year"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Nav & utility buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleJumpToToday}
                    className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors font-khmer cursor-pointer"
                  >
                    ថ្ងៃនេះ Today
                  </button>

                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="ខែមុន Previous Month"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="ខែបន្ទាប់ Next Month"
                  >
                    <ChevronRight size={18} />
                  </button>

                  <button
                    onClick={handlePrintCalendar}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="បោះពុម្ពប្រតិទិន Print Month"
                  >
                    <Printer size={18} />
                  </button>
                </div>
              </div>

              {/* Month Header Banner with Lunisolar Proclamation */}
              <div className="py-4 px-5 sm:px-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-center space-y-1.5">
                <h3 className="font-khmer text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2 flex-wrap">
                  <span>
                    ខែ{GREGORIAN_MONTHS[calMonth].km} ឆ្នាំ{toKhmerNumber(calYear)}
                  </span>
                  <span className="text-base sm:text-lg md:text-xl font-sans font-normal text-slate-400">
                    ({GREGORIAN_MONTHS[calMonth].en} {calYear})
                  </span>
                </h3>
                {activeKhmerMonthsInView.length > 0 && (
                  <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-khmer font-semibold flex items-center justify-center flex-wrap gap-x-2 gap-y-0.5">
                    <span>
                      ត្រូវនឹងខែចន្ទគតិ: {activeKhmerMonthsInView.map(m => `ខែ${m}`).join(' - ')}
                    </span>
                    {monthLunisolarDetails && (
                      <span className="text-slate-500 dark:text-slate-400 font-normal">
                        • ឆ្នាំ{monthLunisolarDetails.animalYear} {monthLunisolarDetails.sak} ព.ស. {monthLunisolarDetails.buddhistEraYearKhmer}
                      </span>
                    )}
                  </p>
                )}
                <div className="flex items-center justify-center gap-3 pt-1 text-xs font-khmer text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                    <DharmaWheelIcon size={13} className="text-amber-500" />
                    ថ្ងៃសីល: {toKhmerNumber(currentMonthSilDays.length)} ថ្ងៃ
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                    <Award size={13} className="text-rose-500" />
                    ឈប់សម្រាក: {toKhmerNumber(currentMonthHolidays.length)} ថ្ងៃ
                  </span>
                </div>
              </div>

              {/* Weekday Column Headers */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 text-center font-khmer">
                {WEEKDAYS.map((wd, idx) => (
                  <div
                    key={idx}
                    className={`py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-bold tracking-wide shadow-xs ${wd.headerColor}`}
                  >
                    <span className="hidden sm:inline">{wd.km}</span>
                    <span className="sm:hidden">{wd.shortKm}</span>
                    <span className="block text-[10px] sm:text-xs font-sans font-normal opacity-75">{wd.en}</span>
                  </div>
                ))}
              </div>

              {/* Modern Calendar Grid */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
                {calendarGrid.map((day, idx) => {
                  const lunar = day.lunar;
                  const isSil = lunar?.isSilDay;
                  const isFullMoon = lunar?.moonStatus === 'កើត' && lunar.moonDay === 15;
                  const isNewMoon = lunar?.moonStatus === 'រោច' && (lunar.moonDay === 14 || lunar.moonDay === 15);
                  const isWaxingHalf = lunar?.moonStatus === 'កើត' && lunar.moonDay === 8;
                  const isWaningHalf = lunar?.moonStatus === 'រោច' && lunar.moonDay === 8;
                  const hasHoliday = (lunar?.holidays.length ?? 0) > 0;
                  const isFirstDayOfLunarMonth = lunar?.moonStatus === 'កើត' && lunar.moonDay === 1;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectDay(day.dateIso)}
                      className={`group relative min-h-[96px] sm:min-h-[112px] md:min-h-[124px] lg:min-h-[132px] p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl flex flex-col justify-between transition-all duration-150 text-left border cursor-pointer ${
                        !day.isCurrentMonth
                          ? 'opacity-35 hover:opacity-65 bg-slate-50/40 dark:bg-slate-900/20 border-slate-200/50 dark:border-slate-800/40'
                          : day.isSelected
                          ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-2 border-emerald-600 dark:border-emerald-500 shadow-lg ring-2 ring-emerald-500/25 z-10'
                          : day.isToday
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-2 border-emerald-500 dark:border-emerald-400'
                          : hasHoliday
                          ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 hover:border-emerald-400 hover:shadow-sm'
                          : isSil
                          ? 'bg-amber-50/60 dark:bg-amber-950/25 border-amber-300 dark:border-amber-800/50 hover:border-emerald-400 hover:shadow-sm'
                          : 'bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:shadow-sm'
                      }`}
                    >
                      {/* Top Row: Solar Day Number + Observance Glyphs */}
                      <div className="w-full flex items-center justify-between">
                        <span
                          className={`text-xs sm:text-base md:text-lg font-bold font-sans ${
                            day.isToday
                              ? 'inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-600 text-white text-[11px] sm:text-xs font-black shadow-sm'
                              : day.isSelected
                              ? 'text-emerald-700 dark:text-emerald-400 font-extrabold'
                              : day.weekdayIdx === 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : day.weekdayIdx === 6
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {day.dayNum}
                        </span>

                        {/* Top-right Status Glyphs */}
                        <div className="flex items-center gap-1">
                          {isSil && (
                            <span
                              className="inline-flex items-center justify-center p-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400"
                              title="ថ្ងៃសីល (Buddhist Observance Day)"
                            >
                              <DharmaWheelIcon size={14} />
                            </span>
                          )}
                          {hasHoliday && (
                            <span
                              className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"
                              title={lunar?.holidays.map(h => h.nameKm).join(', ')}
                            />
                          )}
                        </div>
                      </div>

                      {/* Middle: Astronomical Moon Phase or Month Marker */}
                      <div className="w-full flex items-center justify-center my-0.5 sm:my-1">
                        {isFullMoon ? (
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-khmer font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                            <FullMoonIcon size={15} />
                            <span className="hidden sm:inline">ពេញបូណ៌មី</span>
                          </div>
                        ) : isNewMoon ? (
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-khmer font-bold text-slate-600 dark:text-slate-400 bg-slate-500/10 px-1.5 py-0.5 rounded-md">
                            <NewMoonIcon size={15} />
                            <span className="hidden sm:inline">ដាច់ខែ</span>
                          </div>
                        ) : isWaxingHalf ? (
                          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-khmer font-semibold text-amber-600 dark:text-amber-400">
                            <WaxingHalfMoonIcon size={14} />
                            <span className="hidden md:inline">សីល ៨កើត</span>
                          </div>
                        ) : isWaningHalf ? (
                          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-khmer font-semibold text-amber-600 dark:text-amber-400">
                            <WaningHalfMoonIcon size={14} />
                            <span className="hidden md:inline">សីល ៨រោច</span>
                          </div>
                        ) : isFirstDayOfLunarMonth && lunar ? (
                          <span className="text-[10px] sm:text-xs font-khmer font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded truncate max-w-full">
                            ខែ{lunar.khmerMonth}
                          </span>
                        ) : null}
                      </div>

                      {/* Bottom Row: Khmer Lunar Date representation & Holiday snippet */}
                      <div className="w-full space-y-1">
                        {lunar ? (
                          <div
                            className={`font-khmer text-[11px] sm:text-xs md:text-sm leading-tight text-center ${
                              isSil || isFullMoon
                                ? 'font-bold text-amber-600 dark:text-amber-400'
                                : hasHoliday
                                ? 'font-semibold text-rose-600 dark:text-rose-400'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <span>
                              {lunar.moonDayKhmer} {lunar.moonStatus}
                            </span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-300 dark:text-slate-700 text-center">-</div>
                        )}

                        {/* Holiday Mini Pill */}
                        {hasHoliday && lunar && lunar.holidays[0] && (
                          <div
                            className="w-full truncate text-[10px] sm:text-xs font-khmer text-rose-700 dark:text-rose-300 bg-rose-500/15 border border-rose-500/20 rounded-md px-1.5 py-0.5 text-center font-medium"
                            title={lunar.holidays[0].nameKm}
                          >
                            {lunar.holidays[0].nameKm}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-khmer print:hidden">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <DharmaWheelIcon size={13} className="text-amber-500" />
                    <span>ថ្ងៃសីល Sil Day</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FullMoonIcon size={13} />
                    <span>ពេញបូណ៌មី Full Moon</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <NewMoonIcon size={13} />
                    <span>ដាច់ខែ New Moon</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>បុណ្យជាតិ Holiday</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span>ថ្ងៃនេះ Today</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('holidays')}
                  className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                >
                  <span>មើលបុណ្យជាតិទាំងអស់</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

          {/* Underneath Bottom Section: Responsive Multi-Card Layout (Selected Day, Daily Tear-Off Sheet, Astrological & Monthly Highlights) */}
          <div className="space-y-4 print:hidden">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-khmer text-slate-900 dark:text-white flex items-center gap-2">
                    <span>ព័ត៌មានលម្អិតថ្ងៃជ្រើសរើស & កាលវិភាគប្រចាំខែ</span>
                    <span className="text-xs font-sans font-normal text-slate-400">
                      ({selectedLunarInfo ? selectedLunarInfo.gregorianDate : selectedDateIso})
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                    Selected Day Tear-off Sheet, Astrological Profile & Monthly Highlights
                  </p>
                </div>
              </div>

              {selectedDateIso !== todayIso && (
                <button
                  onClick={handleJumpToToday}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors font-khmer cursor-pointer self-start sm:self-auto"
                >
                  <RotateCcw size={13} />
                  <span>ត្រឡប់មកថ្ងៃនេះ Jump to Today</span>
                </button>
              )}
            </div>

            {/* Bottom 3-Card Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {/* Card 1: Selected Day Authentic Cambodian Daily Tear-off Sheet */}
              {selectedLunarInfo ? (
                <div className="rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden flex flex-col justify-between">
                  {/* Traditional Tear-off Sheet Top Header Strip */}
                  <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 p-3 sm:p-4 text-white">
                    <div className="flex items-center justify-between text-xs font-khmer">
                      <div className="flex items-center gap-1.5 font-bold">
                        <ZodiacAnimalIcon name={selectedLunarInfo.animalYear} size={18} className="text-amber-300" />
                        <span>ឆ្នាំ{selectedLunarInfo.animalYear} ({ZODIAC_ANIMALS[selectedLunarInfo.animalYear]?.en})</span>
                      </div>
                      <div className="text-[11px] opacity-90 font-medium">
                        {selectedLunarInfo.sak} • ព.ស. {selectedLunarInfo.buddhistEraYearKhmer}
                      </div>
                    </div>
                  </div>

                  {/* Tear-off Sheet Card Body */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Gregorian & Lunar Proclamation Header */}
                      <div className="text-center space-y-0.5">
                        <div className="text-xs font-sans font-medium text-slate-400 dark:text-slate-500">
                          {selectedLunarInfo.gregorianDate}
                        </div>
                        <h4 className="font-khmer text-sm font-bold text-slate-700 dark:text-slate-300">
                          {selectedLunarInfo.gregorianMonthText} {selectedLunarInfo.gregorianYearText}
                        </h4>
                      </div>

                      {/* Prominent Day Number & Moon Proclamation Card */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                        <div className="flex items-center justify-between px-2 text-xs font-khmer text-slate-500 dark:text-slate-400">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                            ខែ{selectedLunarInfo.khmerMonth}
                          </span>
                          {selectedLunarInfo.isSilDay ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-sm shadow-amber-500/30">
                              <DharmaWheelIcon size={12} className="text-white" />
                              <span>ថ្ងៃសីល</span>
                            </span>
                          ) : (
                            <span>{selectedLunarInfo.isLeapMonth ? '(ខែលើក)' : 'ខែធម្មតា'}</span>
                          )}
                        </div>

                        {/* Huge Solar Date Display */}
                        <div
                          className={`text-6xl sm:text-7xl font-black font-sans tracking-tight py-1 ${
                            selectedLunarInfo.dayOfWeek === 'អាទិត្យ' || selectedLunarInfo.holidays.length > 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : selectedLunarInfo.dayOfWeek === 'សៅរ៍'
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {Number(selectedDateIso.split('-')[2])}
                        </div>

                        {/* Flanked Moon Phase Proclamation */}
                        <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-xs font-khmer font-bold text-slate-800 dark:text-slate-200 shadow-xs">
                          <MoonPhaseGlyph
                            status={selectedLunarInfo.moonStatus}
                            day={selectedLunarInfo.moonDay}
                            size={16}
                          />
                          <span>
                            {selectedLunarInfo.moonDayKhmer} {selectedLunarInfo.moonStatus}
                          </span>
                        </div>

                        {/* Weekday Banner */}
                        <div className="pt-1">
                          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold font-khmer bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                            ថ្ងៃ{selectedLunarInfo.dayOfWeek} — {DAYS_OF_WEEK_EN_BY_KM[selectedLunarInfo.dayOfWeek]}
                          </span>
                        </div>
                      </div>

                      {/* Full Proclamation Sentence */}
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-800/40 space-y-1">
                        <div className="font-khmer font-bold text-sm text-slate-900 dark:text-emerald-200 leading-relaxed">
                          {selectedLunarInfo.lunarDateText}
                        </div>
                        <div className="font-khmer text-xs text-slate-500 dark:text-slate-400">
                          ត្រូវនឹង {selectedLunarInfo.gregorianDateText}
                        </div>
                      </div>

                      {/* Observance Banner if present */}
                      {selectedLunarInfo.observanceText && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs font-khmer text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-2">
                          <Star size={14} className="text-amber-500 shrink-0" />
                          <span>{selectedLunarInfo.observanceText}</span>
                        </div>
                      )}

                      {/* Holidays on this date if any */}
                      {selectedLunarInfo.holidays.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2">
                          <div className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5 font-khmer">
                            <Award size={14} className="text-rose-500" />
                            <span>បុណ្យជាតិ និងសាសនា Holiday:</span>
                          </div>
                          <div className="space-y-1.5">
                            {selectedLunarInfo.holidays.map((h, i) => (
                              <div key={i} className="flex items-start justify-between gap-2 text-xs">
                                <span className="font-khmer font-bold text-slate-900 dark:text-white">{h.nameKm}</span>
                                <span className="px-2 py-0.5 rounded-md bg-rose-200/60 dark:bg-rose-900/40 text-[10px] font-semibold text-rose-800 dark:text-rose-300 uppercase">
                                  {h.type}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick Copy Buttons */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <CopyButton
                        textToCopy={selectedLunarInfo.lunarDateText}
                        label="ចម្លងកាលបរិច្ឆេទខ្មែរ (Copy Khmer Date)"
                        className="w-full text-xs font-khmer justify-center"
                      />
                      <CopyButton
                        textToCopy={selectedLunarInfo.fullText}
                        label="ចម្លងប្រយោគពេញ (Copy Full Sentence)"
                        variant="outline"
                        className="w-full text-xs font-khmer justify-center"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-500 font-khmer flex items-center justify-center">
                  ជ្រើសរើសថ្ងៃណាមួយក្នុងតារាងប្រតិទិន ដើម្បីមើលព័ត៌មានលម្អិត។
                </div>
              )}

              {/* Card 2: Daily Astrological Harmony & Zodiac Compatibility */}
              {selectedLunarInfo && (
                <div className="rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-5 sm:p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <Compass size={18} />
                        </div>
                        <div>
                          <h4 className="font-khmer font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                            ក្បួនហុងស៊ុយ & ឆ្នាំរាសី
                          </h4>
                          <span className="text-[11px] font-sans text-slate-400">Zodiac Harmony & Feng Shui</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-khmer bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                        <ZodiacAnimalIcon name={selectedLunarInfo.animalYear} size={15} className="text-emerald-600 dark:text-emerald-400" />
                        <span>ឆ្នាំ{selectedLunarInfo.animalYear}</span>
                      </span>
                    </div>

                    {/* Animal Spotlight Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/60 dark:from-slate-800/50 dark:to-slate-800/20 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-extrabold font-khmer text-slate-900 dark:text-white">
                            ឆ្នាំ{selectedLunarInfo.animalYear}
                          </span>
                          <span className="text-xs font-sans text-slate-400">
                            ({ZODIAC_ANIMALS[selectedLunarInfo.animalYear]?.en})
                          </span>
                        </div>
                        <div className="text-xs font-khmer text-slate-600 dark:text-slate-300 leading-relaxed">
                          {ZODIAC_ANIMALS[selectedLunarInfo.animalYear]?.traits}
                        </div>
                        <div className="pt-1 flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-khmer font-bold border ${ZODIAC_ANIMALS[selectedLunarInfo.animalYear]?.elementColor}`}>
                            {ZODIAC_ANIMALS[selectedLunarInfo.animalYear]?.element}
                          </span>
                          <span className="text-[11px] text-slate-400 font-khmer">
                            ព.ស. {selectedLunarInfo.buddhistEraYearKhmer}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 shrink-0 shadow-xs">
                        <ZodiacAnimalIcon name={selectedLunarInfo.animalYear} size={36} />
                      </div>
                    </div>

                    {/* Compatibility Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-khmer">
                      {/* Compatible Tri-Harmony */}
                      <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/50 space-y-2">
                        <div className="text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5">
                          <Heart size={14} className="text-emerald-600 dark:text-emerald-400" />
                          <span>ឆ្នាំត្រូវគ្នា (ត្រីធាតុ):</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {ZODIAC_ANIMALS[selectedLunarInfo.animalYear]?.compatible.map(anim => (
                            <span
                              key={anim}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300/60 dark:border-emerald-800 text-slate-800 dark:text-slate-200 font-bold shadow-xs"
                            >
                              <ZodiacAnimalIcon name={anim} size={15} className="text-emerald-600 dark:text-emerald-400" />
                              <span>ឆ្នាំ{anim}</span>
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          រាសីត្រូវធាតុគ្នា ជួយជ្រោមជ្រែង នាំលាភសំណាង និងសេចក្តីសុខ
                        </p>
                      </div>

                      {/* Clashing Sign */}
                      <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-800/50 space-y-2">
                        <div className="text-rose-700 dark:text-rose-300 font-bold flex items-center gap-1.5">
                          <ShieldAlert size={14} className="text-rose-500" />
                          <span>ឆ្នាំឆុង (មិនត្រូវ):</span>
                        </div>
                        <div className="flex items-center gap-2 pt-0.5">
                          {ZODIAC_ANIMALS[selectedLunarInfo.animalYear]?.clash && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-rose-300/60 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold shadow-xs">
                              <ZodiacAnimalIcon name={ZODIAC_ANIMALS[selectedLunarInfo.animalYear].clash} size={15} className="text-rose-500" />
                              <span>ឆ្នាំ{ZODIAC_ANIMALS[selectedLunarInfo.animalYear].clash}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          ឆ្នាំទល់មុខផ្ទុយធាតុ គប្បីប្រុងប្រយ័ត្នក្នុងការប្រាស្រ័យទាក់ទង
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Astronomical & Lunisolar Specifications */}
                  <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs font-khmer">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>ស័កប្រចាំឆ្នាំ (Ten-Year Era Cycle):</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedLunarInfo.sak}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>ប្រភេទខែចន្ទគតិ (Lunar Month Type):</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        ខែ{selectedLunarInfo.khmerMonth} ({selectedLunarInfo.isLeapMonth ? 'ខែលើក Leap' : 'ខែធម្មតា Regular'})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span>ដំណាក់ព្រះចន្ទ (Lunar Phase):</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {selectedLunarInfo.moonDayKhmer} {selectedLunarInfo.moonStatus}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 3: Month Highlights - Sil Days & Holidays */}
              <div className="rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-5 sm:p-6 flex flex-col justify-between space-y-4 md:col-span-2 lg:col-span-1">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <CalendarCheck size={18} />
                      </div>
                      <div>
                        <h4 className="font-khmer font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          កាលវិភាគប្រចាំខែនេះ
                        </h4>
                        <span className="text-[11px] font-sans text-slate-400">
                          {GREGORIAN_MONTHS[calMonth].en} {calYear} Highlights
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('holidays')}
                      className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-khmer font-semibold cursor-pointer"
                    >
                      <span>មើលទាំងអស់</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                    {/* Subpanel A: Sil Days in Month */}
                    <div className="space-y-2">
                      <h5 className="font-khmer font-bold text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                        <DharmaWheelIcon size={14} className="text-amber-500" />
                        <span>ថ្ងៃសីលក្នុងខែនេះ ({toKhmerNumber(currentMonthSilDays.length)} ថ្ងៃ)</span>
                      </h5>

                      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                        {currentMonthSilDays.map((d, i) => (
                          <button
                            key={i}
                            onClick={() => handleSelectDay(d.dateIso)}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between text-xs font-khmer cursor-pointer ${
                              d.isSelected
                                ? 'bg-amber-500/15 border-amber-500 font-bold text-amber-800 dark:text-amber-200 ring-1 ring-amber-500/30'
                                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-amber-400'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {d.lunar?.moonDay === 15 && d.lunar?.moonStatus === 'កើត' ? (
                                <FullMoonIcon size={14} />
                              ) : d.lunar?.moonDay === 8 ? (
                                d.lunar?.moonStatus === 'កើត' ? <WaxingHalfMoonIcon size={14} /> : <WaningHalfMoonIcon size={14} />
                              ) : (
                                <DharmaWheelIcon size={13} className="text-amber-500" />
                              )}
                              <span>
                                {d.lunar?.moonDayKhmer} {d.lunar?.moonStatus} {d.lunar?.moonDay === 15 && d.lunar?.moonStatus === 'កើត' ? '(ពេញបូណ៌មី)' : ''}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-sans">{d.dateIso}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Subpanel B: Holidays in Month */}
                    <div className="space-y-2">
                      <h5 className="font-khmer font-bold text-xs text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                        <Award size={14} className="text-rose-500" />
                        <span>បុណ្យជាតិក្នុងខែនេះ ({toKhmerNumber(currentMonthHolidays.length)} ថ្ងៃ)</span>
                      </h5>

                      {currentMonthHolidays.length > 0 ? (
                        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                          {currentMonthHolidays.map((d, i) => (
                            <button
                              key={i}
                              onClick={() => handleSelectDay(d.dateIso)}
                              className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between text-xs font-khmer cursor-pointer ${
                                d.isSelected
                                  ? 'bg-rose-500/15 border-rose-500 font-bold text-rose-800 dark:text-rose-200 ring-1 ring-rose-500/30'
                                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-rose-400'
                              }`}
                            >
                              <div className="truncate pr-2">
                                <span className="font-semibold">{d.lunar?.holidays[0]?.nameKm}</span>
                              </div>
                              <span className="text-[11px] text-slate-400 font-sans shrink-0">{d.dateIso}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-400 font-khmer">
                          គ្មានថ្ងៃឈប់សម្រាកបុណ្យជាតិក្នុងខែនេះទេ
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-khmer flex items-center justify-between">
                  <span>ចុចលើថ្ងៃណាមួយដើម្បីជ្រើសរើស</span>
                  <span className="font-sans">Click item to inspect</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: CAMBODIAN HOLIDAYS EXPLORER                   */}
      {/* ==================================================== */}
      {activeTab === 'holidays' && (
        <div className="space-y-6">
          {/* Upcoming Holiday Banner */}
          {nextUpcomingHoliday && (
            <div className="p-6 rounded-2xl md:rounded-3xl bg-gradient-to-r from-emerald-600/15 via-teal-600/15 to-rose-600/15 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                  <Award size={14} />
                  Next Cambodian Holiday / បុណ្យជាតិបន្ទាប់
                </span>
                <h3 className="font-khmer text-xl font-extrabold text-slate-900 dark:text-white">
                  {nextUpcomingHoliday.nameKm}
                  {nextUpcomingHoliday.nameEn && (
                    <span className="ml-2 text-sm font-sans font-normal text-slate-500 dark:text-slate-400">
                      ({nextUpcomingHoliday.nameEn})
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-khmer">
                  កាលបរិច្ឆេទ: {nextUpcomingHoliday.date}
                </p>
              </div>

              <button
                onClick={() => jumpToHolidayDate(nextUpcomingHoliday.date)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 font-khmer whitespace-nowrap flex items-center gap-2 cursor-pointer"
              >
                <span>មើលក្នុងប្រតិទិន View in Calendar</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Controls Bar: Year selector, filters, search, iCal export */}
          <div className="p-4 sm:p-5 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Year Stepper */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 font-khmer">ឆ្នាំ Year:</span>
                <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                  <button
                    onClick={() => handleHolidayYearChange(holidayYear - 1)}
                    className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 cursor-pointer"
                    title="ឆ្នាំមុន"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <input
                    type="text"
                    value={holidayYearInput}
                    onChange={e => setHolidayYearInput(e.target.value)}
                    onBlur={() => {
                      const val = parseInt(holidayYearInput, 10);
                      if (!isNaN(val) && val >= 1900 && val <= 2099) {
                        handleHolidayYearChange(val);
                      } else {
                        setHolidayYearInput(String(holidayYear));
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        const val = parseInt(holidayYearInput, 10);
                        if (!isNaN(val) && val >= 1900 && val <= 2099) {
                          handleHolidayYearChange(val);
                        }
                      }
                    }}
                    className="w-16 bg-transparent text-center font-bold text-sm text-slate-900 dark:text-white focus:outline-none font-sans"
                  />
                  <button
                    onClick={() => handleHolidayYearChange(holidayYear + 1)}
                    className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 cursor-pointer"
                    title="ឆ្នាំបន្ទាប់"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <button
                  onClick={() => handleHolidayYearChange(today.getFullYear())}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 font-khmer cursor-pointer"
                >
                  ឆ្នាំនេះ Current Year
                </button>
              </div>

              {/* Search Bar & Export iCal */}
              <div className="flex flex-1 items-center gap-2 max-w-lg">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ស្វែងរកឈ្មោះបុណ្យជាតិ (Search by name or date)..."
                    value={holidaySearch}
                    onChange={e => setHolidaySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-khmer text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  onClick={handleExportHolidaysIcs}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap font-khmer cursor-pointer"
                  title="ទាញយកប្រតិទិនបុណ្យជាតិ (.ics) សម្រាប់ Google Calendar / Apple Calendar"
                >
                  <Download size={14} />
                  <span>ទាញយក iCal</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setHolidayFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-khmer transition-colors cursor-pointer ${
                  holidayFilter === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                ទាំងអស់ All ({allHolidaysForYear.length})
              </button>
              <button
                onClick={() => setHolidayFilter('public')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-khmer transition-colors cursor-pointer ${
                  holidayFilter === 'public'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                ឈប់សម្រាកការងារ Public
              </button>
              <button
                onClick={() => setHolidayFilter('religious')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-khmer transition-colors cursor-pointer ${
                  holidayFilter === 'religious'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                បុណ្យសាសនា Religious
              </button>
              <button
                onClick={() => setHolidayFilter('traditional')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-khmer transition-colors cursor-pointer ${
                  holidayFilter === 'traditional'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                ប្រពៃណី Traditional
              </button>
              <button
                onClick={() => setHolidayFilter('upcoming')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-khmer transition-colors cursor-pointer ${
                  holidayFilter === 'upcoming'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                បុណ្យបន្ទាប់ Upcoming Only
              </button>
            </div>
          </div>

          {/* Holidays Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHolidays.map((holiday, idx) => {
              let lunarDate: KhmerLunarDate | null = null;
              try {
                lunarDate = toKhmerLunarDate(holiday.date);
              } catch {
                // Ignore
              }

              const [hy, hm, hd] = holiday.date.split('-').map(Number);
              const [ty, tm, td] = todayIso.split('-').map(Number);
              const hDate = new Date(hy, hm - 1, hd);
              const tDate = new Date(ty, tm - 1, td);
              const diffTime = hDate.getTime() - tDate.getTime();
              const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 text-xs font-bold font-sans">
                        {holiday.date}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          holiday.type === 'public'
                            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400'
                            : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400'
                        }`}
                      >
                        {holiday.type}
                      </span>
                    </div>

                    <h4 className="font-khmer text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {holiday.nameKm}
                    </h4>

                    {holiday.nameEn && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">{holiday.nameEn}</p>
                    )}

                    {lunarDate && (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-khmer text-xs text-emerald-800 dark:text-emerald-400">
                        {lunarDate.lunarDateText}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span
                      className={`font-semibold font-khmer ${
                        diffDays === 0
                          ? 'text-rose-600 dark:text-rose-400 font-bold'
                          : diffDays > 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {diffDays === 0
                        ? 'ថ្ងៃនេះ Today!'
                        : diffDays > 0
                        ? `នៅសល់ ${toKhmerNumber(diffDays)} ថ្ងៃ (In ${diffDays} days)`
                        : `កន្លងផុត ${toKhmerNumber(Math.abs(diffDays))} ថ្ងៃ (${Math.abs(diffDays)} days ago)`}
                    </span>

                    <button
                      onClick={() => jumpToHolidayDate(holiday.date)}
                      className="px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold font-khmer flex items-center gap-1 cursor-pointer"
                    >
                      <span>មើលប្រតិទិន</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredHolidays.length === 0 && (
            <div className="p-12 text-center rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 font-khmer space-y-2">
              <p className="text-base font-bold">រកមិនឃើញបុណ្យជាតិណាមួយឡើយ</p>
              <p className="text-xs">សូមសាកល្បងផ្លាស់ប្តូរពាក្យស្វែងរក ឬឆ្នាំ</p>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: TWO-WAY DATE CONVERTER & FORMATTER            */}
      {/* ==================================================== */}
      {activeTab === 'converter' && (
        <div className="space-y-6">
          {/* Converter Mode Selector */}
          <div className="flex justify-center">
            <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setConverterMode('solar-to-lunar')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  converterMode === 'solar-to-lunar'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sun size={15} />
                <span className="font-khmer">សុរិយគតិ → ចន្ទគតិ (Solar → Lunar)</span>
              </button>
              <button
                type="button"
                onClick={() => setConverterMode('lunar-to-solar')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  converterMode === 'lunar-to-solar'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Moon size={15} />
                <span className="font-khmer">ចន្ទគតិ → សុរិយគតិ (Lunar → Solar)</span>
              </button>
            </div>
          </div>

          {/* MODE A: SOLAR -> LUNAR */}
          {converterMode === 'solar-to-lunar' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Controls (5/12) */}
              <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="space-y-1">
                  <h3 className="font-khmer text-lg font-bold text-slate-900 dark:text-white">
                    បម្លែងកាលបរិច្ឆេទសកល ទៅជាចន្ទគតិ
                  </h3>
                  <p className="text-xs text-slate-500 font-khmer">
                    ជ្រើសរើសថ្ងៃខែឆ្នាំ ឬជ្រើសរើសទម្រង់កំណត់កាលបរិច្ឆេទតាមតម្រូវការ។
                  </p>
                </div>

                {/* Date Picker Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-khmer">
                    កាលបរិច្ឆេទសកល (Gregorian Date):
                  </label>
                  <input
                    type="date"
                    min="1900-01-01"
                    max="2099-12-31"
                    value={converterDate}
                    onChange={e => setConverterDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-sans font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-500 font-khmer">កាលបរិច្ឆេទគំរូ Quick Presets:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setConverterDate(todayIso)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-xs font-khmer transition-colors cursor-pointer"
                    >
                      ថ្ងៃនេះ Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setConverterDate('2026-04-14')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-xs font-khmer transition-colors cursor-pointer"
                    >
                      ចូលឆ្នាំខ្មែរ ២០២៦
                    </button>
                    <button
                      type="button"
                      onClick={() => setConverterDate('2026-05-01')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-xs font-khmer transition-colors cursor-pointer"
                    >
                      វិសាខបូជា ២០២៦
                    </button>
                    <button
                      type="button"
                      onClick={() => setConverterDate('2026-10-11')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-xs font-khmer transition-colors cursor-pointer"
                    >
                      ភ្ជុំបិណ្ឌ ២០២៦
                    </button>
                    <button
                      type="button"
                      onClick={() => setConverterDate('2026-11-23')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-xs font-khmer transition-colors cursor-pointer"
                    >
                      បុណ្យអុំទូក ២០២៦
                    </button>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {/* Language */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-khmer">
                      ភាសា Language:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setConvertLocale('km')}
                        className={`py-2 rounded-xl text-xs font-bold font-khmer border transition-colors cursor-pointer ${
                          convertLocale === 'km'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        ភាសាខ្មែរ (Khmer)
                      </button>
                      <button
                        type="button"
                        onClick={() => setConvertLocale('en')}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          convertLocale === 'en'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        English
                      </button>
                    </div>
                  </div>

                  {/* Format length */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-khmer">
                      ទម្រង់កាលបរិច្ឆេទ Format Style:
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['full', 'long', 'medium', 'short'] as const).map(fmt => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => setConvertFormat(fmt)}
                          className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-colors cursor-pointer ${
                            convertFormat === fmt
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-2 pt-2">
                    <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      <span className="font-khmer">ប្រើលេខខ្មែរ (Khmer Numbers ០-៩)</span>
                      <input
                        type="checkbox"
                        checked={convertKhmerNum}
                        onChange={e => setConvertKhmerNum(e.target.checked)}
                        className="w-4 h-4 accent-emerald-600"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      <span className="font-khmer">ភ្ជាប់កាលបរិច្ឆេទសកល (Include Gregorian)</span>
                      <input
                        type="checkbox"
                        checked={convertIncludeGregorian}
                        onChange={e => setConvertIncludeGregorian(e.target.checked)}
                        className="w-4 h-4 accent-emerald-600"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      <span className="font-khmer">ភ្ជាប់ឈ្មោះបុណ្យជាតិ (Include Holiday)</span>
                      <input
                        type="checkbox"
                        checked={convertIncludeHoliday}
                        onChange={e => setConvertIncludeHoliday(e.target.checked)}
                        className="w-4 h-4 accent-emerald-600"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Formatted Output & Tokens (7/12) */}
              <div className="lg:col-span-7 space-y-5">
                {convertedResult.error ? (
                  <div className="p-6 rounded-2xl md:rounded-3xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-sm font-khmer">
                    {convertedResult.error}
                  </div>
                ) : (
                  <>
                    {/* Result Card */}
                    <div className="p-6 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/30 shadow-md space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-khmer flex items-center gap-1.5">
                          <Sparkles size={14} />
                          លទ្ធផលបម្លែង (Generated Result)
                        </span>
                        <CopyButton textToCopy={convertedResult.text} label="ចម្លង Copy" size="sm" />
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 text-base md:text-lg font-bold text-slate-900 dark:text-white leading-relaxed font-khmer">
                        {convertedResult.text}
                      </div>

                      {convertedResult.detailed?.observanceText && (
                        <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 font-khmer font-semibold flex items-center gap-2">
                          <Star size={13} className="text-amber-500" />
                          <span>{convertedResult.detailed.observanceText}</span>
                        </div>
                      )}
                    </div>

                    {/* Structured Breakdown Fields */}
                    {convertedResult.detailed && (
                      <div className="p-6 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <h4 className="font-khmer font-bold text-sm text-slate-900 dark:text-white">
                          ទិន្នន័យលម្អិតតាមផ្នែក (Structured Data Breakdown)
                        </h4>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                            <span className="text-slate-400 block mb-0.5 font-khmer">ថ្ងៃនៃសប្តាហ៍ Day</span>
                            <span className="font-khmer font-bold text-slate-900 dark:text-white text-sm">
                              {convertedResult.detailed.dayOfWeek}
                            </span>
                          </div>

                          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                            <span className="text-slate-400 block mb-0.5 font-khmer">ខែចន្ទគតិ Month</span>
                            <span className="font-khmer font-bold text-slate-900 dark:text-white text-sm">
                              ខែ{convertedResult.detailed.khmerMonth}
                            </span>
                          </div>

                          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                            <span className="text-slate-400 block mb-0.5 font-khmer">ដំណាក់ចន្ទ Moon</span>
                            <div className="font-khmer font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                              <MoonPhaseGlyph
                                status={convertedResult.detailed.moonStatus}
                                day={convertedResult.detailed.moonDay}
                                size={15}
                              />
                              <span>
                                {convertedResult.detailed.moonDayKhmer} {convertedResult.detailed.moonStatus}
                              </span>
                            </div>
                          </div>

                          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                            <span className="text-slate-400 block mb-0.5 font-khmer">ឆ្នាំសត្វ Zodiac</span>
                            <div className="font-khmer font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                              <ZodiacAnimalIcon name={convertedResult.detailed.animalYear} size={16} className="text-emerald-600 dark:text-emerald-400" />
                              <span>ឆ្នាំ{convertedResult.detailed.animalYear}</span>
                            </div>
                          </div>

                          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                            <span className="text-slate-400 block mb-0.5 font-khmer">ស័ក Sak</span>
                            <span className="font-khmer font-bold text-slate-900 dark:text-white text-sm">
                              {convertedResult.detailed.sak}
                            </span>
                          </div>

                          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                            <span className="text-slate-400 block mb-0.5 font-khmer">ពុទ្ធសករាជ BE</span>
                            <span className="font-khmer font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                              ព.ស. {convertedResult.detailed.buddhistEraYearKhmer}
                            </span>
                          </div>
                        </div>

                        {/* Sil Day & Observance notice */}
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-khmer">
                          <span>ស្ថានភាពថ្ងៃសីល (Observance Day):</span>
                          <span className="font-bold">
                            {convertedResult.detailed.isSilDay ? (
                              <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                                <DharmaWheelIcon size={14} />
                                <span>ជាថ្ងៃសីល (Holy Observance Day)</span>
                              </span>
                            ) : (
                              <span className="text-slate-400">មិនមែនជាថ្ងៃសីលទេ</span>
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* MODE B: LUNAR -> SOLAR FINDER */}
          {converterMode === 'lunar-to-solar' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Lunar Picker Controls (5/12) */}
              <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="space-y-1">
                  <h3 className="font-khmer text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Moon size={18} className="text-emerald-600 dark:text-emerald-400" />
                    <span>ស្វែងរកថ្ងៃសុរិយគតិពីចន្ទគតិ</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-khmer">
                    ជ្រើសរើសឆ្នាំ ខែចន្ទគតិ ដំណាក់ចន្ទ (កើត/រោច) និងថ្ងៃ ដើម្បីស្វែងរកកាលបរិច្ឆេទសកលត្រូវគ្នា។
                  </p>
                </div>

                {/* Target Year Stepper */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-khmer">
                    ឆ្នាំសកល Target Year:
                  </label>
                  <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setRevYear(y => Math.max(1900, y - 1))}
                      className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <input
                      type="number"
                      min={1900}
                      max={2099}
                      value={revYear}
                      onChange={e => {
                        const val = Number(e.target.value);
                        if (val >= 1900 && val <= 2099) setRevYear(val);
                      }}
                      className="w-full bg-transparent text-center font-bold text-sm text-slate-900 dark:text-white focus:outline-none font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setRevYear(y => Math.min(2099, y + 1))}
                      className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 cursor-pointer"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Khmer Lunar Month */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-khmer">
                    ខែចន្ទគតិ Lunar Month:
                  </label>
                  <select
                    value={revMonth}
                    onChange={e => setRevMonth(e.target.value as KhmerMonth)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer font-khmer"
                  >
                    {ALL_KHMER_MONTHS.map(m => (
                      <option key={m.km} value={m.km}>
                        ខែ{m.km} ({m.en}) - {m.type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Moon Status (កើត / រោច) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-khmer">
                    ដំណាក់ព្រះចន្ទ Moon Phase:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRevMoonStatus('កើត')}
                      className={`py-2.5 rounded-xl text-xs font-bold font-khmer border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                        revMoonStatus === 'កើត'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <WaxingHalfMoonIcon size={15} />
                      <span>កើត (Waxing)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRevMoonStatus('រោច');
                        if (revMoonDay > 14 && ALL_KHMER_MONTHS.find(m => m.km === revMonth)?.days === 29) {
                          setRevMoonDay(14);
                        }
                      }}
                      className={`py-2.5 rounded-xl text-xs font-bold font-khmer border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                        revMoonStatus === 'រោច'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <WaningHalfMoonIcon size={15} />
                      <span>រោច (Waning)</span>
                    </button>
                  </div>
                </div>

                {/* Moon Day (1 to 15) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 font-khmer">
                    <span>ថ្ងៃទី (Moon Day):</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">
                      {toKhmerNumber(revMoonDay)} {revMoonStatus} ({revMoonDay}{' '}
                      {revMoonStatus === 'កើត' ? 'Waxing' : 'Waning'})
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {Array.from({ length: 15 }, (_, i) => i + 1).map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setRevMoonDay(day)}
                        className={`py-2 rounded-xl text-xs font-bold font-khmer border transition-colors cursor-pointer ${
                          revMoonDay === day
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {toKhmerNumber(day)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reverse Search Results (7/12) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-6 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/30 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-khmer flex items-center gap-1.5">
                      <Sparkles size={14} />
                      លទ្ធផលស្វែងរក (Search Results)
                    </span>
                    <span className="text-xs text-slate-400 font-khmer">
                      រកឃើញ {reverseSearchResults.length} កាលបរិច្ឆេទ
                    </span>
                  </div>

                  {reverseSearchResults.length > 0 ? (
                    <div className="space-y-4">
                      {reverseSearchResults.map((res, i) => (
                        <div
                          key={i}
                          className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-200/60 dark:border-emerald-800/60 pb-3">
                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-sans">
                              {res.iso}
                            </span>
                            <div className="flex items-center gap-2">
                              {res.lunar.isSilDay && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-bold font-khmer">
                                  <DharmaWheelIcon size={12} className="text-white" />
                                  <span>ថ្ងៃសីល</span>
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => jumpToHolidayDate(res.iso)}
                                className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-khmer flex items-center gap-1 cursor-pointer"
                              >
                                <span>មើលក្នុងប្រតិទិន</span>
                                <ArrowRight size={12} />
                              </button>
                            </div>
                          </div>

                          <div className="font-khmer text-base font-bold text-slate-900 dark:text-emerald-200 leading-relaxed">
                            {res.lunar.fullText}
                          </div>

                          {res.lunar.holidays.length > 0 && (
                            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs font-khmer space-y-1">
                              <span className="font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1">
                                <Award size={13} className="text-rose-500" />
                                <span>បុណ្យជាតិលើកាលបរិច្ឆេទនេះ:</span>
                              </span>
                              {res.lunar.holidays.map((h, idx) => (
                                <div key={idx} className="text-slate-800 dark:text-slate-200">
                                  • {h.nameKm} ({h.nameEn || h.type})
                                </div>
                              ))}
                            </div>
                          )}

                          <CopyButton textToCopy={res.lunar.fullText} label="ចម្លងព័ត៌មាន (Copy All)" size="sm" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-500 font-khmer space-y-1.5">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        រកមិនឃើញកាលបរិច្ឆេទត្រូវគ្នាក្នុងឆ្នាំ {toKhmerNumber(revYear)} ឡើយ
                      </p>
                      <p className="text-xs">
                        សូមពិនិត្យមើលថាតើខែនេះជាខែខ្វះ (មានត្រឹម ១៤រោច) ឬសាកល្បងផ្លាស់ប្តូរឆ្នាំ
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: KHMER CALENDAR ENCYCLOPEDIA & ZODIAC GUIDE   */}
      {/* ==================================================== */}
      {activeTab === 'guide' && (
        <div className="space-y-8">
          {/* Section 1: 12 Animal Zodiac Years (ឆ្នាំទាំង១២) */}
          <div className="p-6 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="space-y-1">
              <h3 className="font-khmer text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass size={20} className="text-emerald-600 dark:text-emerald-400" />
                <span>ឆ្នាំសត្វទាំង ១២ (The 12 Animal Zodiac Years)</span>
              </h3>
              <p className="text-xs text-slate-500 font-khmer">
                ក្នុងក្បួនហោរាសាស្ត្រ និងប្រតិទិនខ្មែរ រង្វិលជុំនៃឆ្នាំសត្វមាន ១២ ឆ្នាំ ដោយចាប់ផ្ដើមពីឆ្នាំជូត រហូតដល់ឆ្នាំកុរ ភ្ជាប់ជាមួយធាតុ និងចរិតលក្ខណៈពិសេស។
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 pt-2">
              {Object.entries(ZODIAC_ANIMALS).map(([kmName, info], idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 hover:border-emerald-400 transition-all text-center space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/25 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                      <ZodiacAnimalIcon name={kmName} size={26} />
                    </div>
                    <div className="font-khmer font-bold text-base text-slate-900 dark:text-white">
                      ឆ្នាំ{kmName}
                    </div>
                    <div className="text-xs font-sans text-slate-400 font-medium">Year of the {info.en}</div>
                    <div className={`text-xs font-khmer font-semibold px-2 py-0.5 rounded-full inline-block border ${info.elementColor}`}>
                      {info.element}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div className="text-[11px] font-khmer text-slate-600 dark:text-slate-300 leading-relaxed">
                      {info.traits}
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-khmer pt-1 border-t border-slate-200/40 dark:border-slate-700/40 text-slate-500">
                      <span>ត្រូវគ្នា: <strong>{info.compatible.join(', ')}</strong></span>
                      <span className="text-rose-600 dark:text-rose-400">ឆុង: <strong>{info.clash}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: 10 Saks (ស័កទាំង១០) */}
          <div className="p-6 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="space-y-1">
              <h3 className="font-khmer text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers size={20} className="text-emerald-600 dark:text-emerald-400" />
                <span>ស័កទាំង ១០ (The 10-Year Sak Cycle)</span>
              </h3>
              <p className="text-xs text-slate-500 font-khmer">
                ស័ក គឺជាកាលរាប់ឆ្នាំជាជុំពី ១ ដល់ ១០ ភ្ជាប់ជាមួយឆ្នាំសត្វដើម្បីកំណត់អត្តសញ្ញាណឆ្នាំនីមួយៗឲ្យច្បាស់លាស់ (រៀងរាល់ ៦០ ឆ្នាំ ឆ្នាំសត្វ និងស័កនឹងវិលមកជួបគ្នាម្ដងទៀត)។
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {SAKS_DATA.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-center space-y-1.5"
                >
                  <span className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-bold inline-flex items-center justify-center font-sans">
                    {s.num}
                  </span>
                  <div className="font-khmer font-bold text-sm text-slate-900 dark:text-white">{s.km}</div>
                  <div className="text-[11px] text-slate-400 font-sans">{s.en}</div>
                  <div className="text-[10px] text-slate-500 font-khmer">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: 12 Khmer Lunar Months & Astronomical Leap Systems */}
          <div className="p-6 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="font-khmer text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen size={20} className="text-emerald-600 dark:text-emerald-400" />
                <span>ខែចន្ទគតិ និងក្បួនលើកខែ (12 Months & Leap Month Rules)</span>
              </h3>
              <p className="text-xs text-slate-500 font-khmer">
                ខែចន្ទគតិចែកជាខែខ្វះ (២៩ ថ្ងៃ - ពី ១កើត ដល់ ១៤រោច) និងខែពេញ (៣០ ថ្ងៃ - ពី ១កើត ដល់ ១៥រោច)។
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {ALL_KHMER_MONTHS.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-khmer font-bold text-sm text-slate-900 dark:text-white">ខែ{m.km}</span>
                    <span className="text-[11px] font-sans text-slate-400">{m.en}</span>
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 font-khmer font-semibold">{m.type}</div>
                  <div className="text-[10px] text-slate-400 font-khmer">ត្រូវនឹង: {m.period}</div>
                </div>
              ))}
            </div>

            {/* Leap System Explanations */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-3">
              <h4 className="font-khmer font-bold text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles size={15} />
                <span>ក្បួនឆ្នាំអធិកមាស និងអធិកវារ (Khmer Leap Rules)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-khmer leading-relaxed">
                <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-emerald-500/20 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">ឆ្នាំប្រក្រតីមាស (Normal Year)</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    មាន ១២ ខែ និង ៣៥៤ ថ្ងៃ ជាឆ្នាំធម្មតាដែលមិនមានការបន្ថែមខែ ឬបន្ថែមថ្ងៃឡើយ។
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-emerald-500/20 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">ឆ្នាំអធិកមាស (Leap Month Year)</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    មាន ១៣ ខែ និង ៣៨៤ ថ្ងៃ ដោយមានខែអាសាឍចំនួន ២ ដង គឺ <strong>បឋមាសាឍ</strong> (អាសាឍទី១) និង{' '}
                    <strong>ទុតិយាសាឍ</strong> (អាសាឍទី២)។
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-emerald-500/20 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">ឆ្នាំអធិកវារ (Leap Day Year)</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    មាន ១២ ខែ និង ៣៥៥ ថ្ងៃ ដោយខែជេស្ឋដែលធម្មតាមាន ២៩ ថ្ងៃ ត្រូវបន្ថែម ១ ថ្ងៃទៀតទៅជា ៣០ ថ្ងៃ (១៥រោច ខែជេស្ឋ)។
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Holy Sil Days (ថ្ងៃសីល) */}
          <div className="p-6 rounded-2xl md:rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900/5 to-slate-900/10 dark:from-amber-950/30 dark:via-slate-900/80 dark:to-slate-900/90 border border-amber-500/30 space-y-4">
            <h3 className="font-khmer text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DharmaWheelIcon size={22} className="text-amber-500" />
              <span>ថ្ងៃសីលក្នុងព្រះពុទ្ធសាសនា (Buddhist Observance Days)</span>
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 font-khmer leading-relaxed">
              ក្នុងមួយខែចន្ទគតិ មានថ្ងៃសីលចំនួន ៤ ថ្ងៃ ដែលពុទ្ធបរិស័ទតែងតែទៅវត្តអារាម សមាទានសីល ស្ដាប់ព្រះធម៌ទេសនា និងធ្វើបុណ្យទាន:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/25 space-y-2">
                <div className="flex items-center gap-2 text-amber-500">
                  <WaxingHalfMoonIcon size={22} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">8th Waxing</span>
                </div>
                <div className="font-khmer font-bold text-slate-900 dark:text-white">៨ កើត (8th Waxing)</div>
                <p className="text-xs text-slate-500 font-khmer">ចន្ទកន្លះវង់ខាងកើត សីលឧបោសថ</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/25 space-y-2">
                <div className="flex items-center gap-2 text-amber-500">
                  <FullMoonIcon size={22} />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500 font-sans">Full Moon</span>
                </div>
                <div className="font-khmer font-bold text-amber-600 dark:text-amber-400">១៥ កើត (15th Waxing)</div>
                <p className="text-xs text-slate-500 font-khmer">ពេញបូណ៌មី ព្រះចន្ទពេញវង់</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/25 space-y-2">
                <div className="flex items-center gap-2 text-amber-500">
                  <WaningHalfMoonIcon size={22} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">8th Waning</span>
                </div>
                <div className="font-khmer font-bold text-slate-900 dark:text-white">៨ រោច (8th Waning)</div>
                <p className="text-xs text-slate-500 font-khmer">ចន្ទកន្លះវង់ខាងរោច</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/25 space-y-2">
                <div className="flex items-center gap-2 text-amber-500">
                  <NewMoonIcon size={22} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">New Moon</span>
                </div>
                <div className="font-khmer font-bold text-slate-900 dark:text-white">១៤/១៥ រោច (New Moon)</div>
                <p className="text-xs text-slate-500 font-khmer">ដាច់ខែ អមរវសី ចុងខែចន្ទគតិ</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
