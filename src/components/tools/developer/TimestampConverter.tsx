import React, { useState, useEffect } from 'react';
import { Clock, Copy, RefreshCw, Calendar, ArrowDownUp, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

export const TimestampConverter: React.FC = () => {
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));
  const [epochInput, setEpochInput] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [dateInput, setDateInput] = useState<string>(new Date().toISOString().slice(0, 16));

  const { copyToClipboard } = useClipboard();

  // Live ticking clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute parsed dates from epoch input
  const parsedDates = (() => {
    try {
      const num = Number(epochInput.trim());
      if (isNaN(num)) return null;

      // Detect if milliseconds or seconds
      const ms = num > 1e11 ? num : num * 1000;
      const d = new Date(ms);

      if (isNaN(d.getTime())) return null;

      return {
        utc: d.toUTCString(),
        local: d.toLocaleString(),
        iso: d.toISOString(),
        relative: getRelativeTimeString(d),
      };
    } catch {
      return null;
    }
  })();

  function getRelativeTimeString(date: Date) {
    const now = new Date();
    const diffSec = Math.round((date.getTime() - now.getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
    const diffMin = Math.round(diffSec / 60);
    if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
    const diffHours = Math.round(diffMin / 60);
    if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour');
    const diffDays = Math.round(diffHours / 24);
    return rtf.format(diffDays, 'day');
  }

  // Convert picked date to epoch
  const convertedFromDate = (() => {
    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return null;
      return {
        seconds: Math.floor(d.getTime() / 1000),
        milliseconds: d.getTime(),
      };
    } catch {
      return null;
    }
  })();

  const setPreset = (offsetSeconds: number) => {
    const target = Math.floor(Date.now() / 1000) + offsetSeconds;
    setEpochInput(target.toString());
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Live Current Epoch Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-brand-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5 mb-1">
            <Clock size={14} className="animate-pulse" />
            Current Unix Epoch Timestamp (Live)
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight select-all">
            {currentEpoch}
          </span>
        </div>

        <button
          onClick={() => {
            setEpochInput(currentEpoch.toString());
            copyToClipboard(currentEpoch.toString(), 'Current epoch copied!');
          }}
          className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-2 self-start sm:self-center cursor-pointer"
        >
          <Copy size={14} />
          <span>Copy & Use Now</span>
        </button>
      </div>

      {/* Epoch to Human Date */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar size={18} className="text-brand-500" />
          <span>Convert Timestamp to Human Date</span>
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={epochInput}
            onChange={(e) => setEpochInput(e.target.value)}
            placeholder="Enter seconds or milliseconds timestamp..."
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm sm:text-base focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
          <button
            onClick={() => setEpochInput(Math.floor(Date.now() / 1000).toString())}
            className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Reset to Now
          </button>
        </div>

        {/* Quick Offset Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button onClick={() => setPreset(3600)} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-500">+1 Hour</button>
          <button onClick={() => setPreset(86400)} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-500">+1 Day</button>
          <button onClick={() => setPreset(604800)} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-500">+1 Week</button>
          <button onClick={() => setPreset(2592000)} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-500">+1 Month</button>
        </div>

        {parsedDates && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold">Local Timezone</p>
                <p className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{parsedDates.local}</p>
              </div>
              <button onClick={() => copyToClipboard(parsedDates.local, 'Copied local date!')} className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white"><Copy size={14} /></button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold">UTC (GMT)</p>
                <p className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{parsedDates.utc}</p>
              </div>
              <button onClick={() => copyToClipboard(parsedDates.utc, 'Copied UTC date!')} className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white"><Copy size={14} /></button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold">ISO 8601</p>
                <p className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{parsedDates.iso}</p>
              </div>
              <button onClick={() => copyToClipboard(parsedDates.iso, 'Copied ISO string!')} className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white"><Copy size={14} /></button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold">Relative Time</p>
                <p className="font-mono text-xs sm:text-sm font-bold text-brand-600 dark:text-brand-400 mt-0.5">{parsedDates.relative}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Date Picker to Epoch */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ArrowDownUp size={18} className="text-indigo-500" />
          <span>Convert Date & Time to Timestamp</span>
        </h3>

        <input
          type="datetime-local"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm sm:text-base font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
        />

        {convertedFromDate && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold">Seconds Timestamp</p>
                <p className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5">{convertedFromDate.seconds}</p>
              </div>
              <button onClick={() => copyToClipboard(convertedFromDate.seconds.toString(), 'Copied seconds timestamp!')} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white"><Copy size={16} /></button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-semibold">Milliseconds Timestamp</p>
                <p className="font-mono text-base font-bold text-slate-900 dark:text-white mt-0.5">{convertedFromDate.milliseconds}</p>
              </div>
              <button onClick={() => copyToClipboard(convertedFromDate.milliseconds.toString(), 'Copied ms timestamp!')} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white"><Copy size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
