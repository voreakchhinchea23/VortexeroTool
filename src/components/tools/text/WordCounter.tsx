import React, { useState, useMemo } from 'react';
import { TextQuote, Clock, BookOpen, Volume2, Copy, Trash2, Check } from 'lucide-react';
import { useClipboard } from '../../../hooks/useClipboard';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState(
    `VortexeroTool is a modern web platform designed to streamline developer and power-user workflows with speed and privacy. Every single tool runs client-side inside your browser, ensuring zero telemetry and maximum performance.`
  );

  const { copyToClipboard } = useClipboard();

  const stats = useMemo(() => {
    const raw = text.trim();
    const words = raw ? raw.split(/\s+/).filter(Boolean) : [];
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s+/g, '').length;
    const sentences = raw ? (raw.match(/[.!?]+(?:\s+|$)/g) || []).length || (raw.length > 0 ? 1 : 0) : 0;
    const paragraphs = raw ? raw.split(/\n+/).filter(Boolean).length : 0;

    // Reading & Speaking times
    const readingTimeMinutes = Math.ceil(words.length / 200);
    const readingSeconds = Math.round((words.length / 200) * 60);
    const speakingSeconds = Math.round((words.length / 130) * 60);

    // Keyword density
    const frequency: Record<string, number> = {};
    words.forEach(w => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean.length > 2) {
        frequency[clean] = (frequency[clean] || 0) + 1;
      }
    });

    const topKeywords = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word, count]) => ({
        word,
        count,
        percent: ((count / (words.length || 1)) * 100).toFixed(1),
      }));

    return {
      wordCount: words.length,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingSeconds,
      speakingSeconds,
      topKeywords,
    };
  }, [text]);

  const formatDuration = (secs: number) => {
    if (secs < 60) return `${secs} sec`;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s > 0 ? `${s}s` : ''}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400 font-mono">
            {stats.wordCount}
          </span>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">Total Words</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
            {stats.characters}
          </span>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">Characters (all)</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-violet-600 dark:text-violet-400 font-mono">
            {stats.charactersNoSpaces}
          </span>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">No Spaces</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {stats.sentences}
          </span>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">Sentences</p>
        </div>
      </div>

      {/* Reading & Speaking Estimation Pill Bar */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-around gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-blue-500" />
          <span>Reading Time: <strong className="text-slate-900 dark:text-white font-mono">{formatDuration(stats.readingSeconds)}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Volume2 size={16} className="text-emerald-500" />
          <span>Speaking Time: <strong className="text-slate-900 dark:text-white font-mono">{formatDuration(stats.speakingSeconds)}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <TextQuote size={16} className="text-amber-500" />
          <span>Paragraphs: <strong className="text-slate-900 dark:text-white font-mono">{stats.paragraphs}</strong></span>
        </div>
      </div>

      {/* Editor Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Editor</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(text, 'Copied text!')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Copy text"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={() => setText('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              title="Clear editor"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <textarea
          rows={9}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or pasting your essay, article, or notes..."
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-sans text-sm sm:text-base focus:ring-2 focus:ring-brand-500 focus:outline-none resize-y leading-relaxed"
        />
      </div>

      {/* Keyword Density Table */}
      {stats.topKeywords.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Top Keyword Density
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {stats.topKeywords.map(k => (
              <div
                key={k.word}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70"
              >
                <p className="font-bold text-xs text-slate-900 dark:text-white truncate">"{k.word}"</p>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                  <span>{k.count}x</span>
                  <span>{k.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
