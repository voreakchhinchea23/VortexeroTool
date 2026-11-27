import React, { useState, useEffect, useMemo } from 'react';
import {
  Globe2,
  Clock,
  Plus,
  Trash2,
  Copy,
  Sun,
  Moon,
  Sunrise,
  CheckCircle2,
  RotateCcw,
  Users,
} from 'lucide-react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useClipboard } from '../../../hooks/useClipboard';

interface CityTimezone {
  id: string;
  city: string;
  country: string;
  tz: string;
}

const WORLD_CITIES: CityTimezone[] = [
  { id: 'phnom-penh', city: 'Phnom Penh', country: 'Cambodia', tz: 'Asia/Phnom_Penh' },
  { id: 'bangkok', city: 'Bangkok', country: 'Thailand', tz: 'Asia/Bangkok' },
  { id: 'singapore', city: 'Singapore', country: 'Singapore', tz: 'Asia/Singapore' },
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', tz: 'Asia/Tokyo' },
  { id: 'seoul', city: 'Seoul', country: 'South Korea', tz: 'Asia/Seoul' },
  { id: 'shanghai', city: 'Shanghai', country: 'China', tz: 'Asia/Shanghai' },
  { id: 'hong-kong', city: 'Hong Kong', country: 'China', tz: 'Asia/Hong_Kong' },
  { id: 'taipei', city: 'Taipei', country: 'Taiwan', tz: 'Asia/Taipei' },
  { id: 'ho-chi-minh', city: 'Ho Chi Minh City', country: 'Vietnam', tz: 'Asia/Ho_Chi_Minh' },
  { id: 'manila', city: 'Manila', country: 'Philippines', tz: 'Asia/Manila' },
  { id: 'jakarta', city: 'Jakarta', country: 'Indonesia', tz: 'Asia/Jakarta' },
  { id: 'kuala-lumpur', city: 'Kuala Lumpur', country: 'Malaysia', tz: 'Asia/Kuala_Lumpur' },
  { id: 'mumbai', city: 'Mumbai', country: 'India', tz: 'Asia/Kolkata' },
  { id: 'dubai', city: 'Dubai', country: 'UAE', tz: 'Asia/Dubai' },
  { id: 'riyadh', city: 'Riyadh', country: 'Saudi Arabia', tz: 'Asia/Riyadh' },
  { id: 'london', city: 'London', country: 'United Kingdom', tz: 'Europe/London' },
  { id: 'paris', city: 'Paris', country: 'France', tz: 'Europe/Paris' },
  { id: 'berlin', city: 'Berlin', country: 'Germany', tz: 'Europe/Berlin' },
  { id: 'amsterdam', city: 'Amsterdam', country: 'Netherlands', tz: 'Europe/Amsterdam' },
  { id: 'madrid', city: 'Madrid', country: 'Spain', tz: 'Europe/Madrid' },
  { id: 'zurich', city: 'Zurich', country: 'Switzerland', tz: 'Europe/Zurich' },
  { id: 'istanbul', city: 'Istanbul', country: 'Turkey', tz: 'Europe/Istanbul' },
  { id: 'new-york', city: 'New York', country: 'USA (EST/EDT)', tz: 'America/New_York' },
  { id: 'chicago', city: 'Chicago', country: 'USA (CST/CDT)', tz: 'America/Chicago' },
  { id: 'denver', city: 'Denver', country: 'USA (MST/MDT)', tz: 'America/Denver' },
  { id: 'los-angeles', city: 'Los Angeles', country: 'USA (PST/PDT)', tz: 'America/Los_Angeles' },
  { id: 'toronto', city: 'Toronto', country: 'Canada', tz: 'America/Toronto' },
  { id: 'vancouver', city: 'Vancouver', country: 'Canada', tz: 'America/Vancouver' },
  { id: 'sao-paulo', city: 'São Paulo', country: 'Brazil', tz: 'America/Sao_Paulo' },
  { id: 'mexico-city', city: 'Mexico City', country: 'Mexico', tz: 'America/Mexico_City' },
  { id: 'sydney', city: 'Sydney', country: 'Australia', tz: 'Australia/Sydney' },
  { id: 'melbourne', city: 'Melbourne', country: 'Australia', tz: 'Australia/Melbourne' },
  { id: 'auckland', city: 'Auckland', country: 'New Zealand', tz: 'Pacific/Auckland' },
  { id: 'utc', city: 'UTC', country: 'Universal Time', tz: 'UTC' },
];

function getTimeInZone(date: Date, tz: string, use24h: boolean) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: !use24h,
  }).formatToParts(date);

  const hour24Parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value || '';
  const hour24 = Number(hour24Parts.find((p) => p.type === 'hour')?.value || 0) % 24;

  const formattedTime = use24h
    ? `${String(hour24).padStart(2, '0')}:${get('minute')}`
    : `${get('hour')}:${get('minute')} ${get('dayPeriod')}`;

  const dateLabel = `${get('weekday')}, ${get('month')} ${get('day')}`;
  const dayKey = new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(date);

  let status: 'work' | 'evening' | 'sleep' = 'sleep';
  if (hour24 >= 9 && hour24 < 18) status = 'work';
  else if ((hour24 >= 7 && hour24 < 9) || (hour24 >= 18 && hour24 < 22)) status = 'evening';

  return { formattedTime, dateLabel, dayKey, hour24, status };
}

export const WorldClockPlanner: React.FC = () => {
  const [pinnedIds, setPinnedIds] = useLocalStorage<string[]>('vortexero_world_cities', [
    'phnom-penh',
    'london',
    'new-york',
    'tokyo',
  ]);
  const [now, setNow] = useState<Date>(() => new Date());
  const [offsetMinutes, setOffsetMinutes] = useState<number>(0);
  const [use24h, setUse24h] = useState<boolean>(false);
  const [selectedCityToAdd, setSelectedCityToAdd] = useState<string>('singapore');

  const { copyToClipboard } = useClipboard();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(timer);
  }, []);

  const targetDate = useMemo(() => {
    return new Date(now.getTime() + offsetMinutes * 60000);
  }, [now, offsetMinutes]);

  const pinnedCities = useMemo(() => {
    return pinnedIds
      .map((id) => WORLD_CITIES.find((c) => c.id === id))
      .filter((c): c is CityTimezone => Boolean(c));
  }, [pinnedIds]);

  const availableCities = useMemo(() => {
    return WORLD_CITIES.filter((c) => !pinnedIds.includes(c.id));
  }, [pinnedIds]);

  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const localDayKey = new Intl.DateTimeFormat('en-CA', { timeZone: localTz }).format(targetDate);

  // Best overlapping meeting hours over next 24h (where every pinned city is 08:00 - 21:00)
  const bestSlots = useMemo(() => {
    if (pinnedCities.length < 2) return [];
    const baseHourStart = new Date(now);
    baseHourStart.setMinutes(0, 0, 0);
    const slots: { offsetHours: number; label: string; allWork: boolean }[] = [];

    for (let h = 0; h < 24; h++) {
      const candidate = new Date(baseHourStart.getTime() + h * 3600000);
      const states = pinnedCities.map((c) => getTimeInZone(candidate, c.tz, use24h));
      const allAwake = states.every((s) => s.hour24 >= 8 && s.hour24 <= 21);
      const allWork = states.every((s) => s.hour24 >= 9 && s.hour24 <= 17);
      if (allAwake) {
        const localTimeStr = getTimeInZone(candidate, localTz, use24h).formattedTime;
        slots.push({ offsetHours: h, label: localTimeStr, allWork });
      }
    }
    return slots;
  }, [now, pinnedCities, localTz, use24h]);

  const handleAddCity = () => {
    if (!selectedCityToAdd || pinnedIds.includes(selectedCityToAdd)) return;
    setPinnedIds((prev) => [...prev, selectedCityToAdd]);
    const nextAvail = WORLD_CITIES.find((c) => !pinnedIds.includes(c.id) && c.id !== selectedCityToAdd);
    if (nextAvail) setSelectedCityToAdd(nextAvail.id);
  };

  const handleCopyInvite = () => {
    const lines = [
      `Meeting Time Comparison (${offsetMinutes === 0 ? 'Live Now' : 'Planned Slot'}):`,
      ...pinnedCities.map((c) => {
        const info = getTimeInZone(targetDate, c.tz, use24h);
        return `• ${c.city}: ${info.formattedTime} (${info.dateLabel})`;
      }),
    ];
    copyToClipboard(lines.join('\n'), 'Meeting time summary copied!');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Planner Controls */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={selectedCityToAdd}
              onChange={(e) => setSelectedCityToAdd(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold cursor-pointer"
            >
              {availableCities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.city} ({c.country})
                </option>
              ))}
            </select>
            <button
              onClick={handleAddCity}
              disabled={availableCities.length === 0}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm disabled:opacity-40 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add City</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
              <button
                onClick={() => setUse24h(false)}
                className={`px-3 py-1 rounded-lg cursor-pointer ${!use24h ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
              >
                12h
              </button>
              <button
                onClick={() => setUse24h(true)}
                className={`px-3 py-1 rounded-lg cursor-pointer ${use24h ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
              >
                24h
              </button>
            </div>

            <button
              onClick={handleCopyInvite}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Copy size={13} />
              <span>Copy Meeting Times</span>
            </button>
          </div>
        </div>

        {/* Interactive 24-Hour Time Scrubber */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800/70 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
              <Clock size={15} className="text-indigo-500" />
              <span>
                Time Scrubber:{' '}
                <span className="font-mono text-indigo-600 dark:text-indigo-400">
                  {offsetMinutes === 0
                    ? 'Live Current Time'
                    : `${offsetMinutes > 0 ? '+' : ''}${(offsetMinutes / 60).toFixed(1)} hours from now`}
                </span>
              </span>
            </div>
            {offsetMinutes !== 0 && (
              <button
                onClick={() => setOffsetMinutes(0)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} />
                Reset to Live Now
              </button>
            )}
          </div>

          <input
            type="range"
            min="-720"
            max="1440"
            step="30"
            value={offsetMinutes}
            onChange={(e) => setOffsetMinutes(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>-12h</span>
            <span>-6h</span>
            <span>Now</span>
            <span>+6h</span>
            <span>+12h</span>
            <span>+18h</span>
            <span>+24h</span>
          </div>
        </div>

        {/* Best Meeting Overlap Bar */}
        {pinnedCities.length >= 2 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Users size={14} className="text-emerald-500" />
              Best Overlap (Your Local Time):
            </span>
            {bestSlots.length === 0 ? (
              <span className="text-slate-400 italic">No single hour falls inside 8 AM – 9 PM for all selected cities simultaneously.</span>
            ) : (
              bestSlots.slice(0, 8).map((slot) => (
                <button
                  key={slot.offsetHours}
                  onClick={() => {
                    const targetH = new Date(now);
                    targetH.setMinutes(0, 0, 0);
                    const deltaMin = Math.round((targetH.getTime() + slot.offsetHours * 3600000 - now.getTime()) / 60000);
                    setOffsetMinutes(deltaMin);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold border transition-colors cursor-pointer ${
                    slot.allWork
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/25 hover:bg-amber-500/20'
                  }`}
                >
                  {slot.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* City Clock Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {pinnedCities.map((city) => {
          const info = getTimeInZone(targetDate, city.tz, use24h);
          const StatusIcon = info.status === 'work' ? Sun : info.status === 'evening' ? Sunrise : Moon;
          const statusStyle =
            info.status === 'work'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
              : info.status === 'evening'
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30'
              : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300/60 dark:border-slate-700';
          const statusLabel =
            info.status === 'work' ? 'Work Hours' : info.status === 'evening' ? 'Awake / Flex' : 'Night / Sleep';

          const dayDeltaLabel =
            info.dayKey === localDayKey
              ? 'Same day'
              : info.dayKey > localDayKey
              ? 'Tomorrow'
              : 'Yesterday';

          return (
            <div
              key={city.id}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{city.city}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                      {dayDeltaLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{city.country} • {city.tz}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 ${statusStyle}`}>
                    <StatusIcon size={12} />
                    {statusLabel}
                  </span>
                  {pinnedCities.length > 1 && (
                    <button
                      onClick={() => setPinnedIds((prev) => prev.filter((id) => id !== city.id))}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                      title="Remove city"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                  {info.formattedTime}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{info.dateLabel}</span>
              </div>

              {/* 24h Day/Night Visual Bar */}
              <div className="space-y-1">
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative flex">
                  <div className="h-full bg-slate-400/40 w-[29.16%]" title="00:00 - 07:00" />
                  <div className="h-full bg-amber-400/70 w-[8.33%]" title="07:00 - 09:00" />
                  <div className="h-full bg-emerald-500/80 w-[37.5%]" title="09:00 - 18:00" />
                  <div className="h-full bg-amber-400/70 w-[16.66%]" title="18:00 - 22:00" />
                  <div className="h-full bg-slate-400/40 w-[8.35%]" title="22:00 - 24:00" />
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-indigo-600 dark:bg-white shadow"
                    style={{ left: `${(info.hour24 / 24) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
