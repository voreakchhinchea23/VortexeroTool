import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Search, Moon, Sun, Github, Command, Coffee, Palette, Check, LucideIcon } from 'lucide-react';
import { useTheme, Theme } from '../../context/ThemeContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onHomeClick: () => void;
  onOpenDonate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onHomeClick, onOpenDonate }) => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes: { id: Theme; label: string; icon: LucideIcon; desc: string; badge?: string }[] = [
    {
      id: 'vibrant',
      label: 'Vivid Chroma',
      icon: Palette,
      desc: 'Colorful neon studio with distinct tool signatures',
      badge: 'New'
    },
    {
      id: 'dark',
      label: 'Obsidian Dark',
      icon: Moon,
      desc: 'Classic clean midnight theme',
    },
    {
      id: 'light',
      label: 'Clean Light',
      icon: Sun,
      desc: 'Bright and crisp daylight theme',
    },
  ];

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
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl bg-slate-100/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-400 hover:border-brand-500/50 dark:hover:border-brand-500/50 hover:bg-slate-100 text-sm transition-all shadow-inner"
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
          {/* Buy Me a Coffee Button */}
          <button
            onClick={onOpenDonate}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
            title="Buy me a coffee / Support project"
          >
            <Coffee size={15} className="animate-pulse" />
            <span className="hidden sm:inline">Coffee</span>
          </button>

          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2.5 rounded-xl md:hidden text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Search tools (Ctrl+K)"
          >
            <Search size={18} />
          </button>

          {/* Theme Selector Popover & Quick Toggle */}
          <div className="relative" ref={themeMenuRef}>
            <button
              onClick={() => setIsThemeMenuOpen(prev => !prev)}
              onContextMenu={(e) => {
                e.preventDefault();
                toggleTheme();
              }}
              className={`p-2.5 rounded-xl border transition-all relative cursor-pointer flex items-center gap-1.5 ${
                theme === 'vibrant'
                  ? 'border-indigo-500/40 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 text-indigo-400 hover:border-indigo-500/60 shadow-sm shadow-indigo-500/10'
                  : theme === 'dark'
                  ? 'border-slate-200 dark:border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-200 text-amber-600 hover:bg-slate-100'
              }`}
              title={`Theme: ${theme.toUpperCase()} (Click to change theme)`}
            >
              {theme === 'vibrant' ? (
                <Palette size={18} className="text-fuchsia-400 animate-pulse" />
              ) : theme === 'dark' ? (
                <Moon size={18} className="text-slate-300" />
              ) : (
                <Sun size={18} className="text-amber-500" />
              )}
            </button>

            {/* Dropdown Menu */}
            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Theme Experience
                  </span>
                </div>
                <div className="space-y-1">
                  {themes.map(t => {
                    const isActive = theme === t.id;
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTheme(t.id);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          isActive
                            ? 'bg-brand-500/15 text-brand-600 dark:text-brand-300 border border-brand-500/30'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              t.id === 'vibrant'
                                ? 'bg-gradient-to-tr from-indigo-500/20 to-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30'
                                : t.id === 'dark'
                                ? 'bg-slate-800 text-slate-300'
                                : 'bg-amber-100 text-amber-600'
                            }`}
                          >
                            <Icon size={14} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold">{t.label}</span>
                              {t.badge && (
                                <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded-full bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30">
                                  {t.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">{t.desc}</p>
                          </div>
                        </div>

                        {isActive && <Check size={14} className="text-brand-500 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

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
