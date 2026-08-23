import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, Plus, Share2, Play, Check, Flame } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

interface PresetEvent {
  title: string;
  date: string;
  category: string;
}

export const EventCountdown: React.FC = () => {
  const [eventTitle, setEventTitle] = useState<string>('New Year 2027 Countdown');
  // Default to Next New Year
  const [targetDate, setTargetDate] = useState<string>(() => {
    const nextYear = new Date().getFullYear() + 1;
    return `${nextYear}-01-01T00:00`;
  });
  const [now, setNow] = useState<Date>(new Date());

  const { copyToClipboard } = useClipboard();

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const target = new Date(targetDate).getTime();
  const diff = Math.max(0, target - now.getTime());
  const isPast = target <= now.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const presets: PresetEvent[] = [
    {
      title: 'New Year Celebration',
      date: `${now.getFullYear() + 1}-01-01T00:00`,
      category: 'Holiday',
    },
    {
      title: 'Next Weekend (Saturday 00:00)',
      date: (() => {
        const d = new Date(now);
        const day = d.getDay();
        const diffDays = (6 - day + 7) % 7 || 7;
        d.setDate(d.getDate() + diffDays);
        d.setHours(0, 0, 0, 0);
        return d.toISOString().slice(0, 16);
      })(),
      category: 'Weekend',
    },
    {
      title: 'Halloween Eve',
      date: `${now.getFullYear()}-10-31T00:00`,
      category: 'Festival',
    },
    {
      title: 'Christmas Eve',
      date: `${now.getFullYear()}-12-25T00:00`,
      category: 'Holiday',
    },
  ];

  const handleShare = () => {
    copyToClipboard(window.location.href, 'Countdown link copied to clipboard!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Event Configuration Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar size={18} className="text-rose-500" />
            Target Event Settings
          </h2>
          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
          >
            <Share2 size={14} />
            Share Event
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="e.g. Product Launch, Vacation, Birthday"
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Target Date & Time
            </label>
            <input
              type="datetime-local"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Popular Event Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.title}
                onClick={() => {
                  setEventTitle(p.title);
                  setTargetDate(p.date);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/15 hover:text-rose-600 dark:hover:text-rose-300 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Countdown Stage */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-[#0e0712] border border-rose-500/30 p-8 sm:p-14 text-center text-white shadow-2xl space-y-8">
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 via-purple-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {isPast ? 'Event Completed' : 'Counting Down To'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight pt-2">
            {eventTitle}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-400">
            {new Date(targetDate).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* 4 Digit Cards */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {/* Days */}
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-850/90 border border-rose-500/30 shadow-xl backdrop-blur-xl">
            <span className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white block">
              {days.toString().padStart(2, '0')}
            </span>
            <span className="text-xs uppercase font-extrabold text-rose-400 mt-2 block">Days</span>
          </div>

          {/* Hours */}
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-850/90 border border-rose-500/30 shadow-xl backdrop-blur-xl">
            <span className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white block">
              {hours.toString().padStart(2, '0')}
            </span>
            <span className="text-xs uppercase font-extrabold text-rose-400 mt-2 block">Hours</span>
          </div>

          {/* Minutes */}
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-850/90 border border-rose-500/30 shadow-xl backdrop-blur-xl">
            <span className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white block">
              {minutes.toString().padStart(2, '0')}
            </span>
            <span className="text-xs uppercase font-extrabold text-rose-400 mt-2 block">Minutes</span>
          </div>

          {/* Seconds */}
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-850/90 border border-rose-500/30 shadow-xl backdrop-blur-xl">
            <span className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-rose-400 block animate-pulse">
              {seconds.toString().padStart(2, '0')}
            </span>
            <span className="text-xs uppercase font-extrabold text-rose-400 mt-2 block">Seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};
