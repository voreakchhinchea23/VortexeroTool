import React from 'react';
import { Star } from 'lucide-react';
import { TOOLS } from '../../data/toolsData';
import { useFavorites } from '../../context/FavoritesContext';
import { ToolCard } from '../common/ToolCard';

interface FavoritesSectionProps {
  onSelectTool: (id: string) => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({ onSelectTool }) => {
  const { favorites } = useFavorites();
  const favoriteTools = TOOLS.filter(t => favorites.includes(t.id));

  if (favoriteTools.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
          <Star size={16} className="fill-amber-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Pinned Favorites
        </h2>
        <span className="text-xs font-mono text-slate-400">({favoriteTools.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {favoriteTools.map(tool => (
          <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} />
        ))}
      </div>
    </div>
  );
};
