import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowUpRight } from 'lucide-react';
import { DynamicIcon } from './DynamicIcon';
import { Tool } from '../../types/tool';
import { useFavorites } from '../../context/FavoritesContext';
import { useTheme } from '../../context/ThemeContext';
import { getToolColor } from '../../data/toolColors';

interface ToolCardProps {
  tool: Tool;
  onSelect: (toolId: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isVibrant } = useTheme();
  const favorited = isFavorite(tool.id);
  const color = getToolColor(tool.id, tool.category);

  const getBadgeColors = (badge: string) => {
    switch (badge) {
      case 'Popular':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25';
      case 'Hot':
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25';
      case 'New':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25';
      case 'Featured':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25';
      default:
        return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/25';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(tool.id)}
      style={{
        boxShadow: isVibrant ? `0 4px 20px -2px rgba(0,0,0,0.3)` : undefined
      }}
      className={`group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl backdrop-blur-xl transition-all duration-200 cursor-pointer overflow-hidden ${
        isVibrant
          ? `bg-[#0d121e]/90 border ${color.vibrantBorder} hover:border-slate-500/60 ${color.vibrantGlow}`
          : 'bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/50 dark:hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-500/10'
      }`}
    >
      {/* Dynamic ambient color glow blob */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: color.accentHex }}
      />

      {/* Subtle hover gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-200 pointer-events-none ${color.gradient}`}
      />

      <div>
        <div className="flex items-center justify-between gap-3 mb-3.5 relative z-10">
          {/* Tool Icon Box with signature tool color */}
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-xs ${
              isVibrant
                ? `${color.iconBg} ${color.iconBorder} ${color.iconColor} ${color.iconHoverGradient}`
                : `${color.iconBg} ${color.iconBorder} ${color.iconColor} ${color.iconHoverGradient}`
            } group-hover:scale-105`}
          >
            <DynamicIcon name={tool.iconName} size={20} />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getBadgeColors(
                  tool.badge
                )}`}
              >
                {tool.badge}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(tool.id);
              }}
              className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors ${
                favorited ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'
              }`}
              title={favorited ? 'Remove favorite' : 'Pin tool'}
            >
              <Star size={15} className={favorited ? 'fill-amber-500' : ''} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1.5 relative z-10">
          <h3
            className={`text-base font-bold text-slate-900 dark:text-white transition-colors line-clamp-1 ${
              isVibrant ? 'group-hover:text-white' : 'group-hover:text-brand-600 dark:group-hover:text-brand-400'
            }`}
          >
            {tool.name}
          </h3>
          <ArrowUpRight
            size={15}
            className={`opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200 shrink-0 ${color.iconColor}`}
          />
        </div>
      </div>

      {/* Tags Row */}
      <div className="flex flex-wrap gap-1.5 mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/60 relative z-10">
        {tool.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className={`px-2 py-0.5 text-[10px] font-medium rounded-md transition-colors ${
              isVibrant
                ? `bg-slate-800/60 text-slate-400 border border-slate-700/40 ${color.tagBgHover} ${color.tagTextHover}`
                : `bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 ${color.tagBgHover} ${color.tagTextHover}`
            }`}
          >
            #{tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};
