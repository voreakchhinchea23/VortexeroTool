import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
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
  Check,
  Copy,
  ExternalLink,
  Flame,
  Award,
  Layers,
  CalendarCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import {
  toKhmerLunarDate,
  formatKhmerDate,
  getKhmerHolidays,
  toKhmerNumber,
  KhmerLunarDate,
  KhmerHoliday,
  FormatOptions
} from 'khmer-chhankitek-calendar';
import { CopyButton } from '../../common/CopyButton';

// 12 Khmer Animal Zodiacs Information
const ZODIAC_ANIMALS: Record<string, { km: string; en: string; emoji: string; element: string; traits: string }> = {
  'ជូត': { km: 'ជូត', en: 'Rat', emoji: '🐀', element: 'ធាតុទឹក (Water)', traits: 'វាងវៃ រហ័សរហួន មានប្រាជ្ញាឈ្លាសវៃ' },
  'ឆ្លូវ': { km: 'ឆ្លូវ', en: 'Ox', emoji: '🐂', element: 'ធាតុដី (Earth)', traits: 'អត់ធ្មត់ ឧស្សាហ៍ព្យាយាម ស្មោះត្រង់ ហ្មត់ចត់' },
  'ខាល': { km: 'ខាល', en: 'Tiger', emoji: '🐅', element: 'ធាតុឈើ (Wood)', traits: 'ក្លាហាន ម៉ឺងម៉ាត់ មានអំណាច ស្វាហាប់' },
  'ថោះ': { km: 'ថោះ', en: 'Rabbit', emoji: '🐇', element: 'ធាតុឈើ (Wood)', traits: 'ស្លូតបូត សុភាពរាបសារ រួសរាយ ពូកែទំនាក់ទំនង' },
  'រោង': { km: 'រោង', en: 'Dragon', emoji: '🐉', element: 'ធាតុដី (Earth)', traits: 'មានឫទ្ធិអំណាច ថ្លៃថ្នូរ ឧត្តមគតិខ្ពស់ ចិត្តទូលាយ' },
  'ម្សាញ់': { km: 'ម្សាញ់', en: 'Snake', emoji: '🐍', element: 'ធាតុភ្លើង (Fire)', traits: 'ឈ្លាសវៃ ស្ងប់ស្ងាត់ គិតស៊ីជម្រៅ មានមន្តស្នេហ៍' },
  'មមី': { km: 'មមី', en: 'Horse', emoji: '🐎', element: 'ធាតុភ្លើង (Fire)', traits: 'ស្វាហាប់ សកម្ម ស្រឡាញ់សេរីភាព មិនចុះចាញ់' },
  'មមែ': { km: 'មមែ', en: 'Goat', emoji: '🐐', element: 'ធាតុដី (Earth)', traits: 'សុភាពស្លូតបូត ចិត្តល្អ មានសិល្បៈនិយម ស្រឡាញ់សន្តិភាព' },
  'វក': { km: 'វក', en: 'Monkey', emoji: '🐒', element: 'ធាតុមាស (Metal)', traits: 'ឆ្លាតរហ័សរហួន រស់រវើក ចូលចិត្តរៀនសូត្រ' },
  'រកា': { km: 'រកា', en: 'Rooster', emoji: '🐓', element: 'ធាតុមាស (Metal)', traits: 'ទៀងទាត់ម៉ោងពេល ឧស្សាហ៍ រៀបរយ មានទំនុកចិត្ត' },
  'ច': { km: 'ច', en: 'Dog', emoji: '🐕', element: 'ធាតុដី (Earth)', traits: 'ស្មោះត្រង់ យុត្តិធម៌ គួរឱ្យទុកចិត្ត ស្រឡាញ់គ្រួសារ' },
  'កុរ': { km: 'កុរ', en: 'Pig', emoji: '🐖', element: 'ធាតុទឹក (Water)', traits: 'ចិត្តទូលាយ មានចិត្តមេត្តា ស្មោះត្រង់ នាំលាភសំណាង' },
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
  { km: 'សំរឹទ្ធិស័ក', en: 'Samriddhisak', num: 10, desc: 'ឆ្នាំទី ១០ នៃជុំស័ក' },
];

// 12 Khmer Lunar Months
const LUNAR_MONTHS_INFO = [
  { km: 'មិគសិរ', en: 'Migasir', days: 29, type: 'ខែខ្វះ (29 ថ្ងៃ)', period: 'វិច្ឆិកា - ធ្នូ' },
  { km: 'បុស្ស', en: 'Pous', days: 30, type: 'ខែពេញ (30 ថ្ងៃ)', period: 'ធ្នូ - មករា' },
  { km: 'មាឃ', en: 'Magha', days: 29, type: 'ខែខ្វះ (29 ថ្ងៃ)', period: 'មករា - កុម្ភៈ' },
  { km: 'ផល្គុន', en: 'Phalguna', days: 30, type: 'ខែពេញ (30 ថ្ងៃ)', period: 'កុម្ភៈ - មីនា' },
  { km: 'ចេត្រ', en: 'Chet', days: 29, type: 'ខែខ្វះ (29 ថ្ងៃ)', period: 'មីនា - មេសា' },
  { km: 'ពិសាខ', en: 'Vesak', days: 30, type: 'ខែពេញ (30 ថ្ងៃ)', period: 'មេសា - ឧសភា' },
  { km: 'ជេស្ឋ', en: 'Jeṭṭha', days: '29 ឬ 30', type: 'ធម្មតា/ចល័ត', period: 'ឧសភា - មិថុនា' },
  { km: 'អាសាឍ', en: 'Asadha', days: 30, type: 'ខែពេញ (30 ថ្ងៃ)', period: 'មិថុនា - កក្កដា' },
  { km: 'ស្រាពណ៍', en: 'Srapon', days: 29, type: 'ខែខ្វះ (29 ថ្ងៃ)', period: 'កក្កដា - សីហា' },
  { km: 'ភទ្របទ', en: 'Photrobot', days: 30, type: 'ខែពេញ (30 ថ្ងៃ)', period: 'សីហា - កញ្ញា' },
  { km: 'អស្សុជ', en: 'Assuj', days: 29, type: 'ខែខ្វះ (29 ថ្ងៃ)', period: 'កញ្ញា - តុលា' },
  { km: 'កត្តិក', en: 'Kattik', days: 30, type: 'ខែពេញ (30 ថ្ងៃ)', period: 'តុលា - វិច្ឆិកា' },
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
  { km: 'ធ្នូ', en: 'December', val: 11 },
];

const WEEKDAYS = [
  { km: 'អាទិត្យ', en: 'Sun', shortKm: 'អា', isWeekend: true, color: 'text-rose-500' },
  { km: 'ចន្ទ', en: 'Mon', shortKm: 'ច', isWeekend: false, color: 'text-slate-700 dark:text-slate-300' },
  { km: 'អង្គារ', en: 'Tue', shortKm: 'អ', isWeekend: false, color: 'text-slate-700 dark:text-slate-300' },
  { km: 'ពុធ', en: 'Wed', shortKm: 'ព', isWeekend: false, color: 'text-slate-700 dark:text-slate-300' },
  { km: 'ព្រហស្បតិ៍', en: 'Thu', shortKm: 'ព្រ', isWeekend: false, color: 'text-slate-700 dark:text-slate-300' },
  { km: 'សុក្រ', en: 'Fri', shortKm: 'សុ', isWeekend: false, color: 'text-slate-700 dark:text-slate-300' },
  { km: 'សៅរ៍', en: 'Sat', shortKm: 'ស', isWeekend: true, color: 'text-indigo-500 dark:text-indigo-400' },
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
  const [selectedDateIso, setSelectedDateIso] = useState<string>(() => todayIso);

  // Converter state
  const [converterDate, setConverterDate] = useState<string>(() => todayIso);
  const [convertLocale, setConvertLocale] = useState<'km' | 'en'>('km');
  const [convertFormat, setConvertFormat] = useState<'full' | 'long' | 'medium' | 'short'>('full');
  const [convertKhmerNum, setConvertKhmerNum] = useState<boolean>(true);
  const [convertIncludeGregorian, setConvertIncludeGregorian] = useState<boolean>(true);
  const [convertIncludeHoliday, setConvertIncludeHoliday] = useState<boolean>(true);

  // Holidays Explorer state
  const [holidayYear, setHolidayYear] = useState<number>(() => today.getFullYear());
  const [holidayFilter, setHolidayFilter] = useState<'all' | 'public' | 'religious' | 'traditional' | 'upcoming'>('all');
  const [holidaySearch, setHolidaySearch] = useState<string>('');

  // Selected Date Lunar Info
  const selectedLunarInfo = useMemo<KhmerLunarDate | null>(() => {
    try {
      return toKhmerLunarDate(selectedDateIso);
    } catch {
      return null;
    }
  }, [selectedDateIso]);

  // Calendar Days Computation
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
    }> = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevMonthIdx = calMonth === 0 ? 11 : calMonth - 1;
      const prevYear = calMonth === 0 ? calYear - 1 : calYear;
      const iso = formatIso(prevYear, prevMonthIdx, d);
      days.push({
        dateIso: iso,
        dayNum: d,
        isCurrentMonth: false,
        isToday: iso === todayIso,
        isSelected: iso === selectedDateIso,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = formatIso(calYear, calMonth, d);
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
      });
    }

    // Next month padding to fill a complete 35 or 42 grid
    const totalSlots = days.length <= 35 ? 35 : 42;
    const remaining = totalSlots - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextMonthIdx = calMonth === 11 ? 0 : calMonth + 1;
      const nextYear = calMonth === 11 ? calYear + 1 : calYear;
      const iso = formatIso(nextYear, nextMonthIdx, d);
      days.push({
        dateIso: iso,
        dayNum: d,
        isCurrentMonth: false,
        isToday: iso === todayIso,
        isSelected: iso === selectedDateIso,
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

  // Handlers for month navigation
  const handlePrevMonth = () => {
    if (calMonth === 0) {
      if (calYear > 1900) {
        setCalYear(prev => prev - 1);
        setCalMonth(11);
      }
    } else {
      setCalMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      if (calYear < 2099) {
        setCalYear(prev => prev + 1);
        setCalMonth(0);
      }
    } else {
      setCalMonth(prev => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCalYear(now.getFullYear());
    setCalMonth(now.getMonth());
    setSelectedDateIso(formatIso(now.getFullYear(), now.getMonth(), now.getDate()));
  };

  const handleSelectDay = (dateIso: string) => {
    setSelectedDateIso(dateIso);
    const [y, m] = dateIso.split('-').map(Number);
    if (y !== calYear || m - 1 !== calMonth) {
      setCalYear(y);
      setCalMonth(m - 1);
    }
  };

  // Holidays list query
  const allHolidaysForYear = useMemo(() => {
    try {
      return getKhmerHolidays(holidayYear);
    } catch {
      return [];
    }
  }, [holidayYear]);

  // Filtered Holidays
  const filteredHolidays = useMemo(() => {
    return allHolidaysForYear.filter(h => {
      // Type or upcoming filter
      if (holidayFilter === 'public' && h.type !== 'public') return false;
      if (holidayFilter === 'religious' && h.type !== 'religious') return false;
      if (holidayFilter === 'traditional' && h.type !== 'traditional') return false;
      if (holidayFilter === 'upcoming') {
        if (h.date < todayIso) return false;
      }

      // Search filter
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
    const list = getKhmerHolidays(today.getFullYear());
    return list.find(h => h.date >= todayIso) || null;
  }, [today, todayIso]);

  // Formatter Output for Tab 3
  const convertedResult = useMemo(() => {
    try {
      const options: FormatOptions = {
        locale: convertLocale,
        format: convertFormat,
        useKhmerNumbers: convertKhmerNum,
        includeGregorianDate: convertIncludeGregorian,
        includeHoliday: convertIncludeHoliday,
      };
      const text = formatKhmerDate(converterDate, options);
      const detailed = toKhmerLunarDate(converterDate);
      return { text, detailed, error: null };
    } catch (e: unknown) {
      return { text: '', detailed: null, error: (e as Error)?.message || 'Invalid date' };
    }
  }, [converterDate, convertLocale, convertFormat, convertKhmerNum, convertIncludeGregorian, convertIncludeHoliday]);

  // Jump from Holiday to Calendar
  const jumpToHolidayDate = (dateStr: string) => {
    const [y, m] = dateStr.split('-').map(Number);
    setCalYear(y);
    setCalMonth(m - 1);
    setSelectedDateIso(dateStr);
    setActiveTab('calendar');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-900/10 dark:from-amber-950/30 dark:via-slate-900/80 dark:to-slate-900/90 border border-amber-500/20 dark:border-amber-500/30 p-6 md:p-8 backdrop-blur-sm shadow-xl shadow-amber-500/5">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold tracking-wide">
              <Sparkles size={13} className="text-amber-500" />
              <span>ប្រព័ន្ធប្រតិទិនចន្ទគតិ និងបុណ្យជាតិកម្ពុជា</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="font-khmer text-amber-600 dark:text-amber-400">ប្រតិទិនចន្ទគតិខ្មែរ</span>
              <span className="text-lg md:text-xl font-medium text-slate-500 dark:text-slate-400">Khmer Lunar Calendar</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-khmer leading-relaxed">
              ពិនិត្យថ្ងៃខែចន្ទគតិ ថ្ងៃសីល ពេញបូណ៌មី ដាច់ខែ រោច កើត ឆ្នាំសត្វ ស័ក ពុទ្ធសករាជ និងបញ្ជីបុណ្យជាតិផ្លូវការនៅកម្ពុជា ជាមួយឧបករណ៍បម្លែងកាលបរិច្ឆេទទំនើប។
            </p>
          </div>

          {/* Today's Live Lunar Card */}
          {todayLunar && (
            <div className="w-full md:w-auto p-4 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-amber-500/25 shadow-md space-y-2.5 min-w-[280px]">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Clock size={13} />
                  ថ្ងៃនេះ Today
                </span>
                {todayLunar.isSilDay && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-sm shadow-amber-500/40 animate-pulse">
                    ☸️ ថ្ងៃសីល
                  </span>
                )}
              </div>

              <div className="font-khmer text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                {todayLunar.lunarDateText}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span>{todayLunar.gregorianDateText}</span>
                <span className="text-base" title={`ឆ្នាំ${todayLunar.animalYear}`}>
                  {ZODIAC_ANIMALS[todayLunar.animalYear]?.emoji || '🐎'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 overflow-x-auto">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
            activeTab === 'calendar'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
          }`}
        >
          <CalendarIcon size={16} />
          <span>ប្រតិទិនខែ Monthly Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab('holidays')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
            activeTab === 'holidays'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
          }`}
        >
          <Award size={16} />
          <span>បុណ្យជាតិ & សាសនា Holidays</span>
        </button>

        <button
          onClick={() => setActiveTab('converter')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
            activeTab === 'converter'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
          }`}
        >
          <RotateCcw size={16} />
          <span>បម្លែងកាលបរិច្ឆេទ Date Converter</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
            activeTab === 'guide'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
          }`}
        >
          <BookOpen size={16} />
          <span>ក្បួនចន្ទគតិ Zodiac & Guide</span>
        </button>
      </div>

      {/* TAB 1: MONTHLY CALENDAR VIEW */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Calendar Controls & Selected Day Detail Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Main Interactive Grid (8/12) */}
            <div className="lg:col-span-8 p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              {/* Controls Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {/* Month Dropdown */}
                  <select
                    value={calMonth}
                    onChange={e => setCalMonth(Number(e.target.value))}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer font-khmer"
                  >
                    {GREGORIAN_MONTHS.map(m => (
                      <option key={m.val} value={m.val}>
                        ខែ{m.km} ({m.en})
                      </option>
                    ))}
                  </select>

                  {/* Year Input / Stepper */}
                  <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                    <button
                      onClick={() => setCalYear(y => Math.max(1900, y - 1))}
                      className="px-2.5 py-2 hover:text-amber-500 transition-colors text-slate-600 dark:text-slate-400"
                      title="ឆ្នាំមុន Previous Year"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <input
                      type="number"
                      min={1900}
                      max={2099}
                      value={calYear}
                      onChange={e => {
                        const val = Number(e.target.value);
                        if (val >= 1900 && val <= 2099) setCalYear(val);
                      }}
                      className="w-16 bg-transparent text-center font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
                    />
                    <button
                      onClick={() => setCalYear(y => Math.min(2099, y + 1))}
                      className="px-2.5 py-2 hover:text-amber-500 transition-colors text-slate-600 dark:text-slate-400"
                      title="ឆ្នាំបន្ទាប់ Next Year"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Nav buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleJumpToToday}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-xs font-bold text-amber-700 dark:text-amber-300 transition-colors font-khmer"
                  >
                    ថ្ងៃនេះ Today
                  </button>
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="ខែមុន Previous Month"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="ខែបន្ទាប់ Next Month"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Month Header Banner */}
              <div className="text-center py-2 border-y border-slate-100 dark:border-slate-800">
                <h3 className="font-khmer text-xl font-bold text-slate-900 dark:text-white">
                  ខែ{GREGORIAN_MONTHS[calMonth].km} ឆ្នាំ{toKhmerNumber(calYear)}
                  <span className="ml-2 text-sm font-sans font-medium text-slate-400">
                    ({GREGORIAN_MONTHS[calMonth].en} {calYear})
                  </span>
                </h3>
              </div>

              {/* Weekday Labels */}
              <div className="grid grid-cols-7 gap-1 text-center font-khmer">
                {WEEKDAYS.map((wd, idx) => (
                  <div
                    key={idx}
                    className={`py-2 text-xs font-bold tracking-wide rounded-lg bg-slate-50 dark:bg-slate-800/50 ${wd.color}`}
                  >
                    <span>{wd.km}</span>
                    <span className="block text-[10px] font-sans font-normal opacity-70">{wd.en}</span>
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {calendarGrid.map((day, idx) => {
                  const lunar = day.lunar;
                  const isSil = lunar?.isSilDay;
                  const isFullMoon = lunar?.moonStatus === 'កើត' && lunar.moonDay === 15;
                  const isNewMoon = lunar?.moonStatus === 'រោច' && (lunar.moonDay === 14 || lunar.moonDay === 15);
                  const hasHoliday = (lunar?.holidays.length ?? 0) > 0;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectDay(day.dateIso)}
                      className={`relative min-h-[64px] sm:min-h-[76px] p-1.5 rounded-2xl flex flex-col justify-between items-center transition-all duration-150 text-left ${
                        !day.isCurrentMonth
                          ? 'opacity-30 hover:opacity-75 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400'
                          : day.isSelected
                          ? 'bg-amber-500/15 dark:bg-amber-500/20 border-2 border-amber-500 shadow-md shadow-amber-500/20'
                          : day.isToday
                          ? 'bg-blue-50/60 dark:bg-blue-950/30 border-2 border-blue-500 dark:border-blue-400'
                          : hasHoliday
                          ? 'bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 hover:border-amber-400'
                          : isSil
                          ? 'bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 hover:border-amber-400'
                          : 'bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-amber-400 hover:bg-slate-100/60 dark:hover:bg-slate-800'
                      }`}
                    >
                      {/* Top Row: Indicators & Gregorian Day */}
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {isSil && (
                            <span
                              className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"
                              title="ថ្ងៃសីល (Holy Day)"
                            />
                          )}
                          {hasHoliday && (
                            <span
                              className="w-2 h-2 rounded-full bg-rose-500"
                              title={lunar?.holidays.map(h => h.nameKm).join(', ')}
                            />
                          )}
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            day.isToday
                              ? 'text-blue-600 dark:text-blue-400 font-extrabold'
                              : hasHoliday
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {day.dayNum}
                        </span>
                      </div>

                      {/* Middle: Moon Phase Icon for Key Days */}
                      <div className="my-0.5 text-center">
                        {isFullMoon ? (
                          <span className="text-amber-500 text-xs" title="ពេញបូណ៌មី (Full Moon)">🌕</span>
                        ) : isNewMoon ? (
                          <span className="text-slate-400 text-xs" title="ដាច់ខែ (New Moon)">🌑</span>
                        ) : isSil ? (
                          <span className="text-amber-500 text-[11px]" title="ថ្ងៃសីល (Sil Day)">☸️</span>
                        ) : null}
                      </div>

                      {/* Bottom Row: Khmer Lunar Date representation */}
                      <div className="w-full text-center">
                        {lunar ? (
                          <span
                            className={`font-khmer text-[11px] leading-tight block truncate ${
                              isSil || isFullMoon
                                ? 'font-bold text-amber-600 dark:text-amber-400'
                                : hasHoliday
                                ? 'font-semibold text-rose-600 dark:text-rose-400'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {lunar.moonDayKhmer}
                            {lunar.moonStatus}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-300">-</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-khmer">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>ថ្ងៃសីល Sil Day</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-500 text-xs">🌕</span>
                    <span>ពេញបូណ៌មី Full Moon</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-xs">🌑</span>
                    <span>ដាច់ខែ New Moon</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>បុណ្យជាតិ Holiday</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-blue-500" />
                    <span>ថ្ងៃនេះ Today</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('holidays')}
                  className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                >
                  <span>មើលបុណ្យជាតិទាំងអស់</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Selected Day Info Sidebar (4/12) */}
            <div className="lg:col-span-4 space-y-4">
              {selectedLunarInfo ? (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/30 shadow-lg shadow-amber-500/5 space-y-5">
                  {/* Selected Date Header */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-bold font-khmer">
                        ព័ត៌មានលម្អិតកាលបរិច្ឆេទ
                      </span>
                      {selectedLunarInfo.isSilDay && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold animate-pulse">
                          ☸️ ថ្ងៃសីល
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-sans">{selectedLunarInfo.gregorianDate}</div>
                  </div>

                  {/* Full Lunar Sentence in Khmer */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 space-y-2">
                    <h4 className="font-khmer font-bold text-lg text-slate-900 dark:text-amber-300 leading-relaxed">
                      {selectedLunarInfo.lunarDateText}
                    </h4>
                    <p className="font-khmer text-xs text-slate-600 dark:text-slate-300">
                      ត្រូវនឹង {selectedLunarInfo.gregorianDateText}
                    </p>
                  </div>

                  {/* English Format */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {formatKhmerDate(selectedDateIso, { locale: 'en', format: 'full' })}
                  </div>

                  {/* Key Characteristics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-400 block mb-0.5">ខែចន្ទគតិ Month</span>
                      <span className="font-khmer font-bold text-slate-900 dark:text-white text-sm">
                        ខែ{selectedLunarInfo.khmerMonth}
                      </span>
                      {selectedLunarInfo.isLeapMonth && (
                        <span className="text-[10px] text-amber-500 font-semibold block">(ខែលើក)</span>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-400 block mb-0.5">ដំណាក់ព្រះចន្ទ Moon</span>
                      <span className="font-khmer font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1">
                        {selectedLunarInfo.moonDayKhmer} {selectedLunarInfo.moonStatus}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-400 block mb-0.5">ឆ្នាំសត្វ Animal Zodiac</span>
                      <span className="font-khmer font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        <span>ឆ្នាំ{selectedLunarInfo.animalYear}</span>
                        <span>{ZODIAC_ANIMALS[selectedLunarInfo.animalYear]?.emoji}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        ({ZODIAC_ANIMALS[selectedLunarInfo.animalYear]?.en})
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-slate-400 block mb-0.5">ស័ក & ពុទ្ធសករាជ</span>
                      <span className="font-khmer font-bold text-slate-900 dark:text-white text-sm block">
                        {selectedLunarInfo.sak}
                      </span>
                      <span className="font-khmer text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                        ព.ស. {selectedLunarInfo.buddhistEraYearKhmer}
                      </span>
                    </div>
                  </div>

                  {/* Holidays on this date if any */}
                  {selectedLunarInfo.holidays.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2">
                      <div className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5 font-khmer">
                        <Flame size={14} className="text-rose-500" />
                        <span>បុណ្យជាតិ និងសាសនា Holiday:</span>
                      </div>
                      <div className="space-y-1.5">
                        {selectedLunarInfo.holidays.map((h, i) => (
                          <div key={i} className="flex items-start justify-between gap-2 text-xs">
                            <span className="font-khmer font-bold text-slate-900 dark:text-white">
                              {h.nameKm}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-rose-200/60 dark:bg-rose-900/40 text-[10px] font-semibold text-rose-800 dark:text-rose-300 uppercase">
                              {h.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
              ) : (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-500">
                  ជ្រើសរើសថ្ងៃណាមួយក្នុងតារាងប្រតិទិន ដើម្បីមើលព័ត៌មានលម្អិត។
                </div>
              )}

              {/* Month Highlights: Sil Days in this Month */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h4 className="font-khmer font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Star size={15} className="text-amber-500" />
                  <span>ថ្ងៃសីលក្នុងខែនេះ ({currentMonthSilDays.length} ថ្ងៃ)</span>
                </h4>

                <div className="space-y-2">
                  {currentMonthSilDays.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectDay(d.dateIso)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-colors flex items-center justify-between text-xs font-khmer ${
                        d.isSelected
                          ? 'bg-amber-500/15 border-amber-500 font-bold text-amber-700 dark:text-amber-300'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>☸️</span>
                        <span>{d.lunar?.moonDayKhmer} {d.lunar?.moonStatus}</span>
                      </div>
                      <span className="text-slate-400 font-sans">{d.dateIso}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Month Highlights: Holidays in this Month */}
              {currentMonthHolidays.length > 0 && (
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <h4 className="font-khmer font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Flame size={15} className="text-rose-500" />
                    <span>បុណ្យជាតិក្នុងខែនេះ ({currentMonthHolidays.length} ថ្ងៃ)</span>
                  </h4>

                  <div className="space-y-2">
                    {currentMonthHolidays.map((d, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectDay(d.dateIso)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-colors flex items-center justify-between text-xs font-khmer ${
                          d.isSelected
                            ? 'bg-rose-500/15 border-rose-500 font-bold text-rose-700 dark:text-rose-300'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-rose-400'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <span className="font-semibold">{d.lunar?.holidays[0]?.nameKm}</span>
                        </div>
                        <span className="text-slate-400 font-sans shrink-0">{d.dateIso}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CAMBODIAN HOLIDAYS EXPLORER */}
      {activeTab === 'holidays' && (
        <div className="space-y-6">
          {/* Upcoming Holiday Banner */}
          {nextUpcomingHoliday && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-500/15 via-amber-500/15 to-orange-500/15 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={14} />
                  បុណ្យជាតិបន្ទាប់ Next Cambodia Holiday
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
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-500/20 font-khmer whitespace-nowrap flex items-center gap-2 cursor-pointer"
              >
                <span>មើលក្នុងប្រតិទិន View in Calendar</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Controls Bar: Year selector, filters, search */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Year Stepper */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 font-khmer">
                  ឆ្នាំ Year:
                </span>
                <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                  <button
                    onClick={() => setHolidayYear(y => Math.max(1900, y - 1))}
                    className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-amber-500"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <input
                    type="number"
                    value={holidayYear}
                    onChange={e => setHolidayYear(Number(e.target.value))}
                    className="w-20 bg-transparent text-center font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    onClick={() => setHolidayYear(y => Math.min(2099, y + 1))}
                    className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-amber-500"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <button
                  onClick={() => setHolidayYear(today.getFullYear())}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  ឆ្នាំនេះ Current Year
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ស្វែងរកឈ្មោះបុណ្យជាតិ (Search by Khmer or English name)..."
                  value={holidaySearch}
                  onChange={e => setHolidaySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-khmer text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setHolidayFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-khmer transition-colors ${
                  holidayFilter === 'all'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                ទាំងអស់ All ({allHolidaysForYear.length})
              </button>
              <button
                onClick={() => setHolidayFilter('public')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-khmer transition-colors ${
                  holidayFilter === 'public'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                ឈប់សម្រាកការងារ Public
              </button>
              <button
                onClick={() => setHolidayFilter('religious')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-khmer transition-colors ${
                  holidayFilter === 'religious'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                បុណ្យសាសនា Religious
              </button>
              <button
                onClick={() => setHolidayFilter('traditional')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-khmer transition-colors ${
                  holidayFilter === 'traditional'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                ប្រពៃណី Traditional
              </button>
              <button
                onClick={() => setHolidayFilter('upcoming')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-khmer transition-colors ${
                  holidayFilter === 'upcoming'
                    ? 'bg-amber-500 text-white'
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

              // Distance calculation
              const hDate = new Date(holiday.date + 'T00:00:00');
              const tDate = new Date(todayIso + 'T00:00:00');
              const diffTime = hDate.getTime() - tDate.getTime();
              const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold font-sans">
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
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                        {holiday.nameEn}
                      </p>
                    )}

                    {lunarDate && (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-khmer text-xs text-amber-700 dark:text-amber-400">
                        {lunarDate.lunarDateText}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span
                      className={`font-semibold ${
                        diffDays === 0
                          ? 'text-rose-600 dark:text-rose-400 font-bold'
                          : diffDays > 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {diffDays === 0
                        ? '🎉 ថ្ងៃនេះ Today!'
                        : diffDays > 0
                        ? `នៅសល់ ${toKhmerNumber(diffDays)} ថ្ងៃ (In ${diffDays} days)`
                        : `កន្លងផុត ${toKhmerNumber(Math.abs(diffDays))} ថ្ងៃ`}
                    </span>

                    <button
                      onClick={() => jumpToHolidayDate(holiday.date)}
                      className="px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 font-semibold font-khmer flex items-center gap-1 cursor-pointer"
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
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 font-khmer space-y-2">
              <p className="text-base font-bold">រកមិនឃើញបុណ្យជាតិណាមួយឡើយ</p>
              <p className="text-xs">សូមសាកល្បងផ្លាស់ប្តូរពាក្យស្វែងរក ឬឆ្នាំ</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DATE CONVERTER & FORMATTER */}
      {activeTab === 'converter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls (5/12) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="space-y-1">
              <h3 className="font-khmer text-lg font-bold text-slate-900 dark:text-white">
                បម្លែងកាលបរិច្ឆេទសកល ទៅជាចន្ទគតិ
              </h3>
              <p className="text-xs text-slate-500">
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
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-sans font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-500 font-khmer">កាលបរិច្ឆេទគំរូ Quick Presets:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setConverterDate(todayIso)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white text-xs font-khmer transition-colors"
                >
                  ថ្ងៃនេះ Today
                </button>
                <button
                  type="button"
                  onClick={() => setConverterDate('2026-04-14')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white text-xs font-khmer transition-colors"
                >
                  ចូលឆ្នាំខ្មែរ ២០២៦
                </button>
                <button
                  type="button"
                  onClick={() => setConverterDate('2026-05-01')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white text-xs font-khmer transition-colors"
                >
                  វិសាខបូជា ២០២៦
                </button>
                <button
                  type="button"
                  onClick={() => setConverterDate('2026-10-11')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white text-xs font-khmer transition-colors"
                >
                  ភ្ជុំបិណ្ឌ ២០២៦
                </button>
                <button
                  type="button"
                  onClick={() => setConverterDate('2026-11-23')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white text-xs font-khmer transition-colors"
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
                    className={`py-2 rounded-xl text-xs font-bold font-khmer border transition-colors ${
                      convertLocale === 'km'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    ភាសាខ្មែរ (Khmer)
                  </button>
                  <button
                    type="button"
                    onClick={() => setConvertLocale('en')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      convertLocale === 'en'
                        ? 'bg-amber-500 text-white border-amber-500'
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
                      className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-colors ${
                        convertFormat === fmt
                          ? 'bg-amber-500 text-white border-amber-500'
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
                    className="w-4 h-4 accent-amber-500"
                  />
                </label>

                <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <span className="font-khmer">ភ្ជាប់កាលបរិច្ឆេទសកល (Include Gregorian)</span>
                  <input
                    type="checkbox"
                    checked={convertIncludeGregorian}
                    onChange={e => setConvertIncludeGregorian(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                </label>

                <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <span className="font-khmer">ភ្ជាប់ឈ្មោះបុណ្យជាតិ (Include Holiday)</span>
                  <input
                    type="checkbox"
                    checked={convertIncludeHoliday}
                    onChange={e => setConvertIncludeHoliday(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Formatted Output & Tokens (7/12) */}
          <div className="lg:col-span-7 space-y-5">
            {convertedResult.error ? (
              <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 text-rose-700 text-sm">
                {convertedResult.error}
              </div>
            ) : (
              <>
                {/* Result Card */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/30 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-khmer flex items-center gap-1.5">
                      <Sparkles size={14} />
                      លទ្ធផលបម្លែង (Generated Result)
                    </span>
                    <CopyButton textToCopy={convertedResult.text} label="ចម្លង Copy" size="sm" />
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-base md:text-lg font-bold text-slate-900 dark:text-white leading-relaxed font-khmer">
                    {convertedResult.text}
                  </div>
                </div>

                {/* Structured Breakdown Fields */}
                {convertedResult.detailed && (
                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
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
                        <span className="font-khmer font-bold text-slate-900 dark:text-white text-sm">
                          {convertedResult.detailed.moonDayKhmer} {convertedResult.detailed.moonStatus}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                        <span className="text-slate-400 block mb-0.5 font-khmer">ឆ្នាំសត្វ Animal Zodiac</span>
                        <span className="font-khmer font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                          <span>ឆ្នាំ{convertedResult.detailed.animalYear}</span>
                          <span>{ZODIAC_ANIMALS[convertedResult.detailed.animalYear]?.emoji}</span>
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                        <span className="text-slate-400 block mb-0.5 font-khmer">ស័ក Sak</span>
                        <span className="font-khmer font-bold text-slate-900 dark:text-white text-sm">
                          {convertedResult.detailed.sak}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                        <span className="text-slate-400 block mb-0.5 font-khmer">ពុទ្ធសករាជ BE</span>
                        <span className="font-khmer font-bold text-amber-600 dark:text-amber-400 text-sm">
                          ព.ស. {convertedResult.detailed.buddhistEraYearKhmer}
                        </span>
                      </div>
                    </div>

                    {/* Sil Day & Observance notice */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-khmer">
                      <span>ស្ថានភាពថ្ងៃសីល (Observance Day):</span>
                      <span className="font-bold">
                        {convertedResult.detailed.isSilDay ? (
                          <span className="text-amber-600 dark:text-amber-400">☸️ ជាថ្ងៃសីល (Holy Observance Day)</span>
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

      {/* TAB 4: KHMER CALENDAR ENCYCLOPEDIA & ZODIAC GUIDE */}
      {activeTab === 'guide' && (
        <div className="space-y-8">
          {/* Section 1: 12 Animal Zodiac Years (ឆ្នាំទាំង១២) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="space-y-1">
              <h3 className="font-khmer text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>ឆ្នាំសត្វទាំង ១២ (The 12 Animal Zodiac Years)</span>
              </h3>
              <p className="text-xs text-slate-500 font-khmer">
                ក្នុងក្បួនហោរាសាស្ត្រ និងប្រតិទិនខ្មែរ រង្វិលជុំនៃឆ្នាំសត្វមាន ១២ ឆ្នាំ ដោយចាប់ផ្ដើមពីឆ្នាំជូត រហូតដល់ឆ្នាំកុរ។
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
              {Object.entries(ZODIAC_ANIMALS).map(([kmName, info], idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 hover:border-amber-400 transition-all text-center space-y-1.5"
                >
                  <div className="text-3xl">{info.emoji}</div>
                  <div className="font-khmer font-bold text-sm text-slate-900 dark:text-white">
                    ឆ្នាំ{kmName}
                  </div>
                  <div className="text-[11px] font-sans text-slate-400">{info.en}</div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-khmer">{info.element}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: 10 Saks (ស័កទាំង១០) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="space-y-1">
              <h3 className="font-khmer text-xl font-bold text-slate-900 dark:text-white">
                ស័កទាំង ១០ (The 10-Year Sak Cycle)
              </h3>
              <p className="text-xs text-slate-500 font-khmer">
                ស័ក គឺជាកាលរាប់ឆ្នាំជាជុំពី ១ ដល់ ១០ ភ្ជាប់ជាមួយឆ្នាំសត្វដើម្បីកំណត់អត្តសញ្ញាណឆ្នាំនីមួយៗឲ្យច្បាស់លាស់។
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {SAKS_DATA.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-center space-y-1"
                >
                  <span className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-600 text-xs font-bold inline-flex items-center justify-center">
                    {s.num}
                  </span>
                  <div className="font-khmer font-bold text-sm text-slate-900 dark:text-white">
                    {s.km}
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">{s.en}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: 12 Khmer Lunar Months (ខែចន្ទគតិទាំង១២) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="space-y-1">
              <h3 className="font-khmer text-xl font-bold text-slate-900 dark:text-white">
                ខែចន្ទគតិខ្មែរទាំង ១២ (The 12 Khmer Lunar Months)
              </h3>
              <p className="text-xs text-slate-500 font-khmer">
                ខែចន្ទគតិចែកជាខែខ្វះ (២៩ ថ្ងៃ - ពី ១កើត ដល់ ១៤រោច) និងខែពេញ (៣០ ថ្ងៃ - ពី ១កើត ដល់ ១៥រោច)។
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
              {LUNAR_MONTHS_INFO.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-khmer font-bold text-sm text-slate-900 dark:text-white">
                      ខែ{m.km}
                    </span>
                    <span className="text-[11px] font-sans text-slate-400">{m.en}</span>
                  </div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-khmer">{m.type}</div>
                  <div className="text-[10px] text-slate-400 font-khmer">ត្រូវនឹង: {m.period}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Holy Sil Days (ថ្ងៃសីល) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900/5 to-slate-900/10 dark:from-amber-950/30 dark:via-slate-900/80 dark:to-slate-900/90 border border-amber-500/30 space-y-4">
            <h3 className="font-khmer text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>☸️ ថ្ងៃសីលក្នុងព្រះពុទ្ធសាសនា (Buddhist Observance Days)</span>
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 font-khmer leading-relaxed">
              ក្នុងមួយខែចន្ទគតិ មានថ្ងៃសីលចំនួន ៤ ថ្ងៃ ដែលពុទ្ធបរិស័ទតែងតែទៅវត្តអារាម សមាទានសីល ស្ដាប់ព្រះធម៌ទេសនា និងធ្វើបុណ្យទាន:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/25 space-y-1">
                <span className="text-xl">🌓</span>
                <div className="font-khmer font-bold text-slate-900 dark:text-white">៨ កើត (8th Waxing)</div>
                <p className="text-xs text-slate-500 font-khmer">ចន្ទកន្លះវង់ខាងកើត</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/25 space-y-1">
                <span className="text-xl">🌕</span>
                <div className="font-khmer font-bold text-amber-600 dark:text-amber-400">១៥ កើត (15th Waxing)</div>
                <p className="text-xs text-slate-500 font-khmer">ពេញបូណ៌មី ព្រះចន្ទពេញវង់</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/25 space-y-1">
                <span className="text-xl">🌗</span>
                <div className="font-khmer font-bold text-slate-900 dark:text-white">៨ រោច (8th Waning)</div>
                <p className="text-xs text-slate-500 font-khmer">ចន្ទកន្លះវង់ខាងរោច</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/25 space-y-1">
                <span className="text-xl">🌑</span>
                <div className="font-khmer font-bold text-slate-900 dark:text-white">១៤/១៥ រោច (New Moon)</div>
                <p className="text-xs text-slate-500 font-khmer">ដាច់ខែ អមរវសី</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
