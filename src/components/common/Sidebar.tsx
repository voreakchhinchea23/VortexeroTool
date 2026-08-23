import React from 'react';
import { CATEGORIES, TOOLS } from '../../data/toolsData';
import { ToolCategory } from '../../types/tool';
import { DynamicIcon } from './DynamicIcon';
import { useFavorites } from '../../context/FavoritesContext';
import { useTheme } from '../../context/ThemeContext';
import { getCategoryColor, getToolColor } from '../../data/toolColors';
import { Star, Sparkles, Coffee, Tv, ExternalLink } from 'lucide-react';

interface SidebarProps {
  selectedCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
  activeToolId: string | null;
  onSelectTool: (id: string) => void;
  onOpenDonate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  activeToolId,
  onSelectTool,
  onOpenDonate,
}) => {
  const { favorites } = useFavorites();
  const { isVibrant } = useTheme();
  const favoriteTools = TOOLS.filter(t => favorites.includes(t.id));

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-slate-200/80 dark:border-slate-800/80 p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] sticky top-16">
      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-3">
          Categories
        </h4>
        <nav className="space-y-1">
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id && activeToolId === null;
            const count = cat.id === 'all' ? TOOLS.length : TOOLS.filter(t => t.category === cat.id).length;
            const catColor = getCategoryColor(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  if (activeToolId) {
                    onSelectTool('');
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? `${catColor.pillActive}`
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <DynamicIcon
                    name={cat.iconName}
                    size={18}
                    className={isActive ? 'text-white' : catColor.iconColor}
                  />
                  <span>{cat.name}</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pinned / Favorites */}
      {favoriteTools.length > 0 && (
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between px-3 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Star size={13} className="text-amber-500 fill-amber-500" />
              Pinned Tools
            </h4>
            <span className="text-[11px] font-mono text-slate-400">{favoriteTools.length}</span>
          </div>
          <div className="space-y-1">
            {favoriteTools.map(tool => {
              const isActive = activeToolId === tool.id;
              const toolColor = getToolColor(tool.id, tool.category);

              return (
                <button
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left truncate cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <DynamicIcon
                    name={tool.iconName}
                    size={15}
                    className={`shrink-0 ${toolColor.iconColor}`}
                  />
                  <span className="truncate">{tool.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MultiWatches Stream Hub Card */}
      <a
        href="https://multi-watches.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full p-4 rounded-2xl bg-gradient-to-br from-purple-600/15 via-indigo-600/10 to-pink-600/15 border border-purple-500/30 block hover:border-purple-500/60 transition-all cursor-pointer group shadow-sm"
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Tv size={14} />
            </div>
            <span className="font-bold text-xs text-slate-900 dark:text-white">MultiWatches</span>
          </div>
          <ExternalLink size={12} className="text-purple-400 opacity-70 group-hover:opacity-100" />
        </div>
        <p className="text-[11px] text-purple-600 dark:text-purple-300/80 leading-tight">
          Watch multiple live streams together in split grids 🔴
        </p>
      </a>

      {/* Buy Me a Coffee Support Card */}
      {onOpenDonate && (
        <button
          onClick={onOpenDonate}
          className="w-full p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-500/30 text-left hover:border-amber-500/60 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Coffee size={15} />
            </div>
            <span className="font-bold text-xs text-slate-900 dark:text-white">Buy Me a Coffee</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Support VortexeroTool with ABA Pay ☕
          </p>
        </button>
      )}

      {/* Pro Badge Card */}
      <div className={`p-4 rounded-2xl border text-center ${
        isVibrant 
          ? 'bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-pink-500/15 border-indigo-500/30' 
          : 'bg-gradient-to-br from-brand-500/10 via-indigo-500/10 to-violet-500/10 border-brand-500/20'
      }`}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
          <Sparkles size={16} />
        </div>
        <h5 className="text-xs font-bold text-slate-900 dark:text-white">100% Client-Side</h5>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          Zero data stored on servers. Your data stays private in your browser.
        </p>
      </div>
    </aside>
  );
};
