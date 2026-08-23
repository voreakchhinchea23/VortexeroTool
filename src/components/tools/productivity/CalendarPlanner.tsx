import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Calculator, Clock, Check } from 'lucide-react';

export const CalendarPlanner: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Date duration calculator states
  const [calcDate1, setCalcDate1] = useState(new Date().toISOString().slice(0, 10));
  const [calcDate2, setCalcDate2] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    setCurrentDate(new Date());
  };

  const today = new Date();
  const isCurrentMonthToday = today.getFullYear() === year && today.getMonth() === month;

  // Duration calculations
  const calculateDifference = () => {
    const d1 = new Date(calcDate1);
    const d2 = new Date(calcDate2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const weeks = (totalDays / 7).toFixed(1);

    // Business days (Mon-Fri)
    let businessDays = 0;
    const start = d1 < d2 ? new Date(d1) : new Date(d2);
    const end = d1 < d2 ? new Date(d2) : new Date(d1);

    while (start < end) {
      start.setDate(start.getDate() + 1);
      const dayOfWeek = start.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDays++;
      }
    }

    return { totalDays, weeks, businessDays };
  };

  const diffStats = calculateDifference();

  // Day of Year
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Monthly Calendar (7/12) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {monthNames[month]} {year}
            </h3>

            <div className="flex items-center gap-1.5">
              <button
                onClick={jumpToToday}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
              >
                Today
              </button>
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Weekday Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold">
            {/* Empty slots for start day */}
            {[...Array(firstDayIndex)].map((_, i) => (
              <div key={`empty-${i}`} className="py-2.5 opacity-0" />
            ))}

            {/* Days */}
            {[...Array(daysInMonth)].map((_, i) => {
              const dayNum = i + 1;
              const isToday = isCurrentMonthToday && today.getDate() === dayNum;

              return (
                <div
                  key={dayNum}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    isToday
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 font-bold scale-105'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {dayNum}
                </div>
              );
            })}
          </div>
        </div>

        {/* Date Math & Duration Calculator (5/12) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator size={16} className="text-brand-500" />
              <span>Days Between Dates Calculator</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
                <input
                  type="date"
                  value={calcDate1}
                  onChange={(e) => setCalcDate1(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">End Date</label>
                <input
                  type="date"
                  value={calcDate2}
                  onChange={(e) => setCalcDate2(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                />
              </div>
            </div>

            {diffStats && (
              <div className="pt-2 grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/70 text-center">
                  <span className="text-2xl font-black font-mono text-brand-600 dark:text-brand-400">{diffStats.totalDays}</span>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase mt-0.5">Total Days</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/70 text-center">
                  <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{diffStats.businessDays}</span>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase mt-0.5">Working Days</p>
                </div>
              </div>
            )}
          </div>

          {/* Year Stats */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Day {dayOfYear} of {isLeapYear ? 366 : 365} ({year})</span>
            <span className="font-mono text-brand-600 dark:text-brand-400">{isLeapYear ? 'Leap Year' : 'Common Year'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
