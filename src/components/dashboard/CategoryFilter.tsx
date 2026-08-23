import React from 'react';
import { CATEGORIES } from '../../data/toolsData';
import { ToolCategory } from '../../types/tool';
import { DynamicIcon } from '../common/DynamicIcon';

interface CategoryFilterProps {
  selectedCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
  toolCounts: Record<ToolCategory, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  toolCounts,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
      {CATEGORIES.map(cat => {
        const isActive = selectedCategory === cat.id;
        const count = toolCounts[cat.id] ?? 0;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              isActive
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25 scale-[1.02]'
                : 'bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <DynamicIcon
              name={cat.iconName}
              size={16}
              className={isActive ? 'text-white' : 'text-slate-400'}
            />
            <span>{cat.name}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
