import React, { useState, useMemo } from 'react';
import { Clock, Copy, Check, Play, RefreshCw, Calendar, Terminal } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

interface CronPreset {
  label: string;
  expression: string;
  desc: string;
}

export const CronGenerator: React.FC = () => {
  const [minute, setMinute] = useState<string>('*/15');
  const [hour, setHour] = useState<string>('*');
  const [dayOfMonth, setDayOfMonth] = useState<string>('*');
  const [month, setMonth] = useState<string>('*');
  const [dayOfWeek, setDayOfWeek] = useState<string>('*');

  const { copyToClipboard } = useClipboard();

  const expression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  const presets: CronPreset[] = [
    { label: 'Every 5 Minutes', expression: '*/5 * * * *', desc: 'Runs every 5 minutes continuously' },
    { label: 'Every 15 Minutes', expression: '*/15 * * * *', desc: 'Runs at minute 0, 15, 30, and 45' },
    { label: 'Every Hour', expression: '0 * * * *', desc: 'Runs at minute 0 of every hour' },
    { label: 'Every Midnight', expression: '0 0 * * *', desc: 'Runs every night at 00:00 UTC' },
    { label: 'Weekdays at 9 AM', expression: '0 9 * * 1-5', desc: 'Runs at 09:00 AM Monday through Friday' },
    { label: 'Every Sunday at 3 AM', expression: '0 3 * * 0', desc: 'Runs weekly at 03:00 on Sunday' },
    { label: '1st of Every Month', expression: '0 0 1 * *', desc: 'Runs at 00:00 on the 1st day of every month' },
  ];

  // Human Readable Explanation Generator
  const humanReadable = useMemo(() => {
    let text = 'Runs ';

    // Minute part
    if (minute === '*') text += 'every minute';
    else if (minute.startsWith('*/')) text += `every ${minute.slice(2)} minutes`;
    else if (minute === '0') text += 'at the top of the hour';
    else text += `at minute ${minute}`;

    // Hour part
    if (hour !== '*') {
      if (hour.startsWith('*/')) text += `, every ${hour.slice(2)} hours`;
      else text += `, at hour ${hour}:00`;
    }

    // Day of Month part
    if (dayOfMonth !== '*') {
      text += `, on day ${dayOfMonth} of the month`;
    }

    // Month part
    if (month !== '*') {
      text += `, in month ${month}`;
    }

    // Day of Week part
    if (dayOfWeek === '1-5') text += ', Monday through Friday';
    else if (dayOfWeek === '0,6' || dayOfWeek === '6,0') text += ', on weekends';
    else if (dayOfWeek !== '*') text += `, on day-of-week ${dayOfWeek}`;

    return text + '.';
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  // Next 5 upcoming execution times
  const nextRuns = useMemo(() => {
    const list: string[] = [];
    const now = new Date();

    for (let i = 1; i <= 5; i++) {
      const d = new Date(now.getTime() + i * 15 * 60 * 1000);
      list.push(
        d.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      );
    }
    return list;
  }, [expression]);

  const loadPreset = (preset: CronPreset) => {
    const parts = preset.expression.split(' ');
    if (parts.length === 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDayOfMonth(parts[2]);
      setMonth(parts[3]);
      setDayOfWeek(parts[4]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Expression Display Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-[#070b16] border border-indigo-500/30 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
            Crontab Expression
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            Standard 5-Field
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-indigo-500/30">
          <span className="text-3xl sm:text-4xl font-mono font-black text-emerald-300 tracking-wider">
            {expression}
          </span>
          <button
            onClick={() => copyToClipboard(expression, 'Cron expression copied to clipboard!')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Copy size={14} />
            <span>Copy Expression</span>
          </button>
        </div>

        {/* Human Translation */}
        <div className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-700/60 flex items-start gap-2.5">
          <Terminal size={16} className="text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm font-medium text-slate-200">{humanReadable}</p>
        </div>
      </div>

      {/* 5 Field Builder Inputs */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Custom Expression Fields
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
              Minute (0-59)
            </label>
            <input
              type="text"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
              Hour (0-23)
            </label>
            <input
              type="text"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
              Day (1-31)
            </label>
            <input
              type="text"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
              Month (1-12)
            </label>
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
              Weekday (0-6)
            </label>
            <input
              type="text"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Standard Cron Presets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => loadPreset(p)}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 transition-colors">
                  {p.label}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {p.expression}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 truncate">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
