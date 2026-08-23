import React from 'react';
import { ArrowLeft, Star, Share2 } from 'lucide-react';
import { DynamicIcon } from './DynamicIcon';
import { Tool } from '../../types/tool';
import { useFavorites } from '../../context/FavoritesContext';
import { useClipboard } from '../../hooks/useClipboard';

interface ToolHeaderProps {
  tool: Tool;
  onBack: () => void;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({ tool, onBack }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { copyToClipboard } = useClipboard();
  const favorited = isFavorite(tool.id);

  const handleShare = () => {
    copyToClipboard(window.location.href, 'Tool link copied to clipboard!');
  };

  return (
    <div className="mb-6 sm:mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between gap-4 mb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors group cursor-pointer"
        >
          <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-brand-50 dark:group-hover:bg-brand-950/50 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            <ArrowLeft size={16} />
          </span>
          Back to all tools
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="Share tool"
          >
            <Share2 size={16} />
          </button>
          <button
            onClick={() => toggleFavorite(tool.id)}
            className={`p-2 rounded-xl border transition-all ${
              favorited
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'
            }`}
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star size={16} className={favorited ? 'fill-amber-500' : ''} />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 shrink-0">
          <DynamicIcon name={tool.iconName} size={24} />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {tool.name}
            </h1>
            {tool.badge && (
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60">
                {tool.badge}
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {tool.description}
          </p>
        </div>
      </div>
    </div>
  );
};
