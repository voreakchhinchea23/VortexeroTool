import React from 'react';
import { Sparkles, Search, Moon, Sun, Github, Command } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onHomeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onHomeClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#090d16]/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Sparkles size={20} className="animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                Vortexero<span className="text-brand-600 dark:text-brand-400">Tool</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/50">
                PRO
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
              Universal Web & Dev Utilities
            </p>
          </div>
        </button>

        {/* Global Search Bar (Trigger for Command Palette) */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            type="button"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl bg-slate-100/90 dark:bg-slate-850 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-400 hover:border-brand-500/50 dark:hover:border-brand-500/50 hover:bg-slate-100 text-sm transition-all shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <Search size={16} className="text-slate-400" />
              <span>Search tools, algorithms, formats...</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700">
              <Command size={10} />
              <span>K</span>
            </div>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2.5 rounded-xl md:hidden text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Search tools (Ctrl+K)"
          >
            <Search size={20} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
          </button>

          {/* User GitHub Profile */}
          <a
            href="https://github.com/voreakchhinchea23"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400 transition-colors hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold"
            title="Voreak Chhinchea on GitHub"
          >
            <Github size={18} />
            <span className="hidden lg:inline">voreakchhinchea23</span>
          </a>
        </div>
      </div>
    </header>
  );
};
