import React, { useState, useEffect, useMemo } from 'react';
import { Cake, Calendar, Clock, Sparkles, Copy, ArrowRightLeft } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';
import { calculateAgeBreakdown, calculateDateDuration, addDateOffset } from '../../../utils/everydayUtils';

type TabMode = 'age' | 'diff' | 'offset';

export const AgeDateCalculator: React.FC = () => {
  const todayIso = new Date().toISOString().slice(0, 10);
  const [tab, setTab] = useState<TabMode>('age');

  // Tab 1: Exact Age
  const [birthDate, setBirthDate] = useState<string>('2000-05-15');
  const [now, setNow] = useState<Date>(() => new Date());

  // Tab 2: Date Duration
  const [startDate, setStartDate] = useState<string>(todayIso);
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date(Date.now() + 90 * 86400000);
    return d.toISOString().slice(0, 10);
  });

  // Tab 3: Date Add / Subtract
  const [baseDate, setBaseDate] = useState<string>(todayIso);
  const [offsetOp, setOffsetOp] = useState<'add' | 'subtract'>('add');
  const [offsetAmount, setOffsetAmount] = useState<number>(30);
  const [offsetUnit, setOffsetUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('days');

  const { copyToClipboard } = useClipboard();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const age = useMemo(() => calculateAgeBreakdown(birthDate, now), [birthDate, now]);
  const duration = useMemo(() => calculateDateDuration(startDate, endDate), [startDate, endDate]);
  const shifted = useMemo(
    () => addDateOffset(baseDate, offsetOp, offsetAmount, offsetUnit),
    [baseDate, offsetOp, offsetAmount, offsetUnit]
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Mode Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {[
          { id: 'age', label: 'Exact Age & Birthday', icon: Cake },
          { id: 'diff', label: 'Days & Workdays Between Dates', icon: ArrowRightLeft },
          { id: 'offset', label: 'Add / Subtract Date', icon: Calendar },
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as TabMode)}
              className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                active
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Icon size={17} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Age & Birthday */}
      {tab === 'age' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cake size={17} className="text-rose-500" />
              Date of Birth
            </h2>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Select Birthdate</label>
              <input
                type="date"
                max={todayIso}
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-base font-bold"
              />
            </div>

            {age && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Born on:</span>
                  <strong className="text-slate-900 dark:text-white">{age.bornWeekday}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Western Zodiac:</span>
                  <strong className="text-rose-600 dark:text-rose-400">{age.westernZodiac}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Animal Zodiac Year:</span>
                  <strong className="text-slate-900 dark:text-white">{age.animalZodiac}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Generation:</span>
                  <strong className="text-slate-900 dark:text-white">{age.generation}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">10,000 Days Alive Date:</span>
                  <strong className="font-mono text-indigo-600 dark:text-indigo-400">{age.tenThousandDaysDate}</strong>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 p-6 rounded-3xl bg-gradient-to-br from-rose-950/45 via-slate-900/95 to-[#16070d] border border-rose-500/30 text-white shadow-xl space-y-6">
            {age ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-rose-300">Exact Current Age</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-200 border border-rose-500/30">
                    Next birthday in {age.daysUntilNextBirthday} days ({age.nextBirthdayWeekday})
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-white">{age.years}</span>
                    <span className="text-[11px] uppercase font-bold text-rose-300 block mt-1">Years</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-white">{age.months}</span>
                    <span className="text-[11px] uppercase font-bold text-rose-300 block mt-1">Months</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-white">{age.days}</span>
                    <span className="text-[11px] uppercase font-bold text-rose-300 block mt-1">Days</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Total Weeks</span>
                    <p className="text-base font-extrabold font-mono mt-0.5">{age.totalWeeks.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Total Days</span>
                    <p className="text-base font-extrabold font-mono mt-0.5">{age.totalDays.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/50 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Live Seconds</span>
                    <p className="text-base font-extrabold font-mono text-amber-300 mt-0.5">{age.totalSeconds.toLocaleString()}</p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    copyToClipboard(
                      `Age: ${age.years} years, ${age.months} months, ${age.days} days (${age.totalDays.toLocaleString()} total days). Next birthday in ${age.daysUntilNextBirthday} days!`,
                      'Age breakdown copied!'
                    )
                  }
                  className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 cursor-pointer"
                >
                  <Copy size={14} />
                  <span>Copy Age Breakdown</span>
                </button>
              </>
            ) : (
              <p className="text-sm text-rose-200">Select a valid birth date in the past.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Days & Workdays Between Dates */}
      {tab === 'diff' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Select Date Range</h2>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-sm"
              />
            </div>
          </div>

          <div className="md:col-span-7 p-6 rounded-3xl bg-gradient-to-br from-rose-950/45 via-slate-900/95 to-[#16070d] border border-rose-500/30 text-white shadow-xl space-y-5">
            {duration ? (
              <>
                <span className="text-xs font-extrabold uppercase tracking-widest text-rose-300 block">Date Difference</span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-5xl font-black font-mono">{duration.totalDays.toLocaleString()}</span>
                  <span className="text-sm text-slate-400">calendar days</span>
                </div>
                <p className="text-xs text-rose-200">
                  Equivalent to <strong>{duration.years}y {duration.months}m {duration.days}d</strong>
                </p>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30">
                    <span className="text-[10px] font-bold uppercase text-emerald-300">Business / Workdays (Mon–Fri)</span>
                    <p className="text-2xl font-black font-mono mt-1">{duration.businessDays.toLocaleString()}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Weekend Days (Sat–Sun)</span>
                    <p className="text-2xl font-black font-mono mt-1">{duration.weekendDays.toLocaleString()}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-rose-200">Select valid start and end dates.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Add / Subtract Date */}
      {tab === 'offset' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Calculate Future or Past Date</h2>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">Starting Date</label>
              <input
                type="date"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <select
                value={offsetOp}
                onChange={(e) => setOffsetOp(e.target.value as 'add' | 'subtract')}
                className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer"
              >
                <option value="add">+ Add</option>
                <option value="subtract">- Subtract</option>
              </select>

              <input
                type="number"
                min="0"
                value={offsetAmount}
                onChange={(e) => setOffsetAmount(Number(e.target.value))}
                className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-sm text-center"
              />

              <select
                value={offsetUnit}
                onChange={(e) => setOffsetUnit(e.target.value as 'days' | 'weeks' | 'months' | 'years')}
                className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-6 p-6 rounded-3xl bg-gradient-to-br from-rose-950/45 via-slate-900/95 to-[#16070d] border border-rose-500/30 text-white shadow-xl space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-rose-300 block">Resulting Date</span>
            {shifted ? (
              <>
                <p className="text-4xl font-black font-mono text-white">{shifted.iso}</p>
                <p className="text-sm font-semibold text-rose-200">{shifted.weekday}</p>
                <button
                  onClick={() => copyToClipboard(`${shifted.iso} (${shifted.weekday})`, 'Resulting date copied!')}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy size={13} />
                  <span>Copy Date</span>
                </button>
              </>
            ) : (
              <p className="text-sm text-rose-200">Select a valid date.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
