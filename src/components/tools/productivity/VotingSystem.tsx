import React, { useState } from 'react';
import { Vote, Plus, Trash2, RotateCcw, Trophy, CheckCircle2, Share2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useClipboard } from '../../../hooks/useClipboard';

interface PollOption {
  id: string;
  text: string;
  votes: number;
  color: string;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#ef4444'];

export const VotingSystem: React.FC = () => {
  const [question, setQuestion] = useState('What is your favorite modern frontend framework / library?');
  const [hasVoted, setHasVoted] = useState<string | null>(null);
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: 'React.js & Next.js', votes: 42, color: '#3b82f6' },
    { id: '2', text: 'Vue.js & Nuxt', votes: 28, color: '#10b981' },
    { id: '3', text: 'Svelte & SvelteKit', votes: 19, color: '#f97316' },
    { id: '4', text: 'Solid.js / Astro', votes: 12, color: '#8b5cf6' },
  ]);

  const { copyToClipboard } = useClipboard();

  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);

  const handleVote = (id: string) => {
    setOptions(options.map(o => (o.id === id ? { ...o, votes: o.votes + 1 } : o)));
    setHasVoted(id);

    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
  };

  const handleAddOption = () => {
    if (options.length >= 8) return;
    const nextColor = COLORS[options.length % COLORS.length];
    setOptions([
      ...options,
      { id: Date.now().toString(), text: `New Option ${options.length + 1}`, votes: 0, color: nextColor },
    ]);
  };

  const handleReset = () => {
    setOptions(options.map(o => ({ ...o, votes: 0 })));
    setHasVoted(null);
  };

  const handleDelete = (id: string) => {
    if (options.length <= 2) return;
    setOptions(options.filter(o => o.id !== id));
  };

  const winningOption = [...options].sort((a, b) => b.votes - a.votes)[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Poll Editor Panel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Poll Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm sm:text-base font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Options ({options.length}/8)</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddOption}
                disabled={options.length >= 8}
                className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Choice</span>
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Reset votes"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.map((opt, i) => (
              <div key={opt.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: opt.color }} />
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) =>
                    setOptions(options.map(o => (o.id === opt.id ? { ...o, text: e.target.value } : o)))
                  }
                  className="flex-1 bg-transparent text-xs font-medium focus:outline-none"
                />
                <button
                  disabled={options.length <= 2}
                  onClick={() => handleDelete(opt.id)}
                  className="p-1 text-rose-500 hover:bg-rose-500/10 rounded disabled:opacity-30"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Graphic Voting Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/5 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Interactive Poll</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{question}</h3>
            <p className="text-xs text-slate-400 font-mono mt-1">{totalVotes} total votes cast</p>
          </div>

          {winningOption && winningOption.votes > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold shrink-0">
              <Trophy size={14} />
              <span>Leading: {winningOption.text}</span>
            </div>
          )}
        </div>

        {/* Voting Options with Live Graphical Percentage Bars */}
        <div className="space-y-3">
          {options.map((opt) => {
            const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
            const isUserChoice = hasVoted === opt.id;

            return (
              <div
                key={opt.id}
                onClick={() => handleVote(opt.id)}
                className={`group relative p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                  isUserChoice
                    ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/30'
                    : 'border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/40'
                }`}
              >
                {/* Live Percentage Background Fill Bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 opacity-15 dark:opacity-25 transition-all duration-500 pointer-events-none rounded-2xl"
                  style={{ width: `${percent}%`, backgroundColor: opt.color }}
                />

                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: opt.color }} />
                    <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {opt.text}
                    </span>
                    {isUserChoice && (
                      <CheckCircle2 size={16} className="text-brand-600 dark:text-brand-400" />
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-slate-400">{opt.votes} votes</span>
                    <span className="text-base font-black font-mono text-slate-900 dark:text-white min-w-[48px] text-right">
                      {percent}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 text-center">Click any card option to cast your vote!</p>
      </div>
    </div>
  );
};
