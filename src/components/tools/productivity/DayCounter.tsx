import React, { useState, useEffect } from 'react';
import { Heart, Trophy, Sparkles, PartyPopper, Plus, Trash2, CheckCircle2, Calendar, Clock, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CustomGoal {
  id: string;
  title: string;
  days: number;
  emoji: string;
}

const DEFAULT_MILESTONES = [
  { label: '1 Week (7 Days)', days: 7, emoji: '🌱' },
  { label: '1 Month (30 Days)', days: 30, emoji: '🌙' },
  { label: '50 Days', days: 50, emoji: '✨' },
  { label: '100 Days Milestone', days: 100, emoji: '💖' },
  { label: '6 Months (182 Days)', days: 182, emoji: '🌸' },
  { label: '200 Days', days: 200, emoji: '🥂' },
  { label: '300 Days', days: 300, emoji: '💌' },
  { label: '1 Year (365 Days)', days: 365, emoji: '🎂' },
  { label: '500 Days of Love', days: 500, emoji: '⭐' },
  { label: '600 Days', days: 600, emoji: '🌻' },
  { label: '2 Years (730 Days)', days: 730, emoji: '🎁' },
  { label: '800 Days', days: 800, emoji: '💫' },
  { label: '1,000 Days Milestone', days: 1000, emoji: '💎' },
  { label: '3 Years (1,095 Days)', days: 1095, emoji: '🕊️' },
  { label: '1,500 Days', days: 1500, emoji: '🌌' },
  { label: '4 Years (1,460 Days)', days: 1460, emoji: '🌹' },
  { label: '5 Years (1,825 Days)', days: 1825, emoji: '🌲' },
  { label: '2,000 Days', days: 2000, emoji: '🔥' },
  { label: '7 Years (2,555 Days)', days: 2555, emoji: '🍀' },
  { label: '3,000 Days', days: 3000, emoji: '🎯' },
  { label: '10 Years (3,650 Days)', days: 3650, emoji: '👑' },
  { label: '5,000 Days', days: 5000, emoji: '🌟' },
  { label: '15 Years (5,475 Days)', days: 5475, emoji: '🔮' },
  { label: '20 Years (7,300 Days)', days: 7300, emoji: '💎' },
  { label: '10,000 Days Together', days: 10000, emoji: '🏆' },
  { label: '25 Years (Silver Jubilee)', days: 9125, emoji: '🥈' },
  { label: '50 Years (Golden Jubilee)', days: 18250, emoji: '🥇' },
];

export const DayCounter: React.FC = () => {
  const [title, setTitle] = useState('Our Love Story ❤️');
  const [person1, setPerson1] = useState('John');
  const [person2, setPerson2] = useState('Sarah');
  const [targetDate, setTargetDate] = useState('2024-01-01T00:00');
  const [now, setNow] = useState(new Date());

  // Custom user milestones
  const [customGoals, setCustomGoals] = useState<CustomGoal[]>([
    { id: '1', title: 'First Vacation Trip ✈️', days: 150, emoji: '✈️' },
    { id: '2', title: 'Moving in Together 🏡', days: 400, emoji: '🏡' },
    { id: '3', title: 'Engagement Day 💍', days: 850, emoji: '💍' },
  ]);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDays, setNewGoalDays] = useState<number>(100);

  // Live second ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const startDate = new Date(targetDate);
  const isPast = now.getTime() >= startDate.getTime();
  const diffMs = Math.abs(now.getTime() - startDate.getTime());

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  // Exact breakdown
  const years = Math.floor(totalDays / 365.25);
  const months = Math.floor((totalDays % 365.25) / 30.4375);
  const days = Math.floor((totalDays % 365.25) % 30.4375);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  const triggerLoveConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#f472b6', '#fb7185', '#fda4af', '#e11d48'],
      });
    } catch {
      // ignore
    }
  };

  const handleAddCustomGoal = () => {
    if (!newGoalTitle.trim() || newGoalDays <= 0) return;
    setCustomGoals([
      ...customGoals,
      {
        id: Date.now().toString(),
        title: newGoalTitle.trim(),
        days: Number(newGoalDays),
        emoji: '🎯',
      }
    ]);
    setNewGoalTitle('');
    setNewGoalDays(100);
  };

  const handleDeleteCustomGoal = (id: string) => {
    setCustomGoals(customGoals.filter(g => g.id !== id));
  };

  const allMilestones = [
    ...DEFAULT_MILESTONES,
    ...customGoals.map(g => ({ label: g.title, days: g.days, emoji: g.emoji })),
  ].sort((a, b) => a.days - b.days);

  const completedCount = allMilestones.filter(m => totalDays >= m.days).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Event Details Configurator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Relationship Title / Milestone</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Our Love Story, Anniversary, Sobriety Counter..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm sm:text-base font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Partner 1</label>
            <input
              type="text"
              value={person1}
              onChange={(e) => setPerson1(e.target.value)}
              placeholder="Partner 1"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Partner 2</label>
            <input
              type="text"
              value={person2}
              onChange={(e) => setPerson2(e.target.value)}
              placeholder="Partner 2"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Anniversary / Start Date</label>
            <input
              type="datetime-local"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Main Big Celebration Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600 text-white p-8 sm:p-14 text-center shadow-2xl shadow-rose-500/25 space-y-4">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={triggerLoveConfetti}
            className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            title="Celebrate Love!"
          >
            <PartyPopper size={18} />
          </button>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider">
          <Heart size={14} className="fill-white animate-pulse" />
          <span>{person1} & {person2}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold">{title}</h2>

        {/* Big Total Days Number */}
        <div className="py-2">
          <span className="text-6xl sm:text-8xl font-black font-mono tracking-tight drop-shadow-md">
            {totalDays.toLocaleString()}
          </span>
          <p className="text-base sm:text-xl font-bold uppercase tracking-widest text-white/90 mt-1">
            {isPast ? 'Days Together' : 'Days Remaining'}
          </p>
        </div>

        {/* Live Exact Breakdown HUD */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-4 max-w-2xl mx-auto">
          <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md">
            <span className="text-xl sm:text-2xl font-black font-mono">{years}</span>
            <p className="text-[11px] font-semibold text-white/80 uppercase">Years</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md">
            <span className="text-xl sm:text-2xl font-black font-mono">{months}</span>
            <p className="text-[11px] font-semibold text-white/80 uppercase">Months</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md">
            <span className="text-xl sm:text-2xl font-black font-mono">{days}</span>
            <p className="text-[11px] font-semibold text-white/80 uppercase">Days</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md">
            <span className="text-xl sm:text-2xl font-black font-mono">{hours}</span>
            <p className="text-[11px] font-semibold text-white/80 uppercase">Hours</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md">
            <span className="text-xl sm:text-2xl font-black font-mono">{minutes}</span>
            <p className="text-[11px] font-semibold text-white/80 uppercase">Mins</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md">
            <span className="text-xl sm:text-2xl font-black font-mono animate-pulse">{seconds}</span>
            <p className="text-[11px] font-semibold text-white/80 uppercase">Secs</p>
          </div>
        </div>
      </div>

      {/* Add Custom Goal / Milestone Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Star size={16} className="text-amber-500" />
          <span>Add Custom Love / Relationship Goal</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <input
            type="text"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            placeholder="Goal Name (e.g. Euro Trip, Proposal, House)..."
            className="sm:col-span-7 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium"
          />
          <input
            type="number"
            value={newGoalDays}
            onChange={(e) => setNewGoalDays(Number(e.target.value))}
            placeholder="Target Days"
            className="sm:col-span-3 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
          />
          <button
            onClick={handleAddCustomGoal}
            className="sm:col-span-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Goal</span>
          </button>
        </div>
      </div>

      {/* Comprehensive Relationship & Journey Milestones */}
      {isPast && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              <span>Relationship & Journey Milestones ({completedCount} / {allMilestones.length} Reached)</span>
            </h3>
            <span className="text-xs font-bold text-rose-500 font-mono">
              {Math.round((completedCount / allMilestones.length) * 100)}% Completed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {allMilestones.map((m, idx) => {
              const reached = totalDays >= m.days;
              const progress = Math.min(100, Math.round((totalDays / m.days) * 100));

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    reached
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <span>{m.emoji}</span>
                      <span>{m.label}</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white dark:bg-slate-900">
                      {reached ? '✨ Reached' : `${(m.days - totalDays).toLocaleString()}d left`}
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full transition-all duration-300 ${reached ? 'bg-rose-500' : 'bg-brand-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
