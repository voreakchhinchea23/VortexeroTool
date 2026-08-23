import React from 'react';
import { Sparkles, Search, Zap, Shield, Globe, Terminal } from 'lucide-react';
import { TOOLS } from '../../data/toolsData';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCommandPalette: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  onOpenCommandPalette,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900/10 via-indigo-900/5 to-purple-900/10 dark:from-brand-950/40 dark:via-indigo-950/20 dark:to-purple-950/30 border border-brand-500/20 p-6 sm:p-10 mb-8 backdrop-blur-xl">
      {/* Decorative gradient glow blobs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles size={14} className="animate-spin-slow" />
          Modern Web & Developer Suite
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Supercharge your workflow with{' '}
          <span className="text-gradient">Vortexero Tools</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
          Ultra-fast, private, and beautifully crafted tools for security, web sharing, text processing, design, and data conversion.
        </p>

        {/* Live Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by tool name, tag (e.g. password, qr, wifi, hash)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-lg shadow-brand-500/5 text-sm sm:text-base transition-all"
            />
          </div>

          <button
            onClick={onOpenCommandPalette}
            type="button"
            className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-950/10 dark:shadow-brand-500/20 transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <Terminal size={16} />
            <span>Command Palette (Ctrl+K)</span>
          </button>
        </div>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap gap-4 mt-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <Shield size={14} className="text-emerald-500" />
            <span>100% Client-Side & Private</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-amber-500" />
            <span>Instant & Zero Latency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe size={14} className="text-blue-500" />
            <span>{TOOLS.length} Ready-to-use Tools</span>
          </div>
        </div>
      </div>
    </div>
  );
};
