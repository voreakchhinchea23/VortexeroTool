import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowUpRight } from 'lucide-react';
import { DynamicIcon } from './DynamicIcon';
import { Tool } from '../../types/tool';
import { useFavorites } from '../../context/FavoritesContext';

interface ToolCardProps {
  tool: Tool;
  onSelect: (toolId: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(tool.id);

  const getBadgeColors = (badge: string) => {
    switch (badge) {
      case 'Popular':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Hot':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'New':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Featured':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(tool.id)}
      className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/50 dark:hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Subtle hover gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:scale-105 group-hover:bg-brand-600 group-hover:text-white transition-all duration-200 shadow-xs">
            <DynamicIcon name={tool.iconName} size={20} />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getBadgeColors(tool.badge)}`}>
                {tool.badge}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(tool.id);
              }}
              className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                favorited ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'
              }`}
              title={favorited ? 'Remove favorite' : 'Pin tool'}
            >
              <Star size={15} className={favorited ? 'fill-amber-500' : ''} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1.5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
            {tool.name}
          </h3>
          <ArrowUpRight size={15} className="text-slate-400 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 shrink-0" />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/60">
        {tool.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-950/40 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors"
          >
            #{tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};
