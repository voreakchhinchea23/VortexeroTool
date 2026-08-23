import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tool } from '../../types/tool';
import { ToolCard } from '../common/ToolCard';
import { Wrench } from 'lucide-react';

interface ToolsGridProps {
  tools: Tool[];
  onSelectTool: (id: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export const ToolsGrid: React.FC<ToolsGridProps> = ({
  tools,
  onSelectTool,
  searchQuery,
  onClearSearch,
}) => {
  if (tools.length === 0) {
    return (
      <div className="py-16 text-center rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 p-8">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
          <Wrench size={28} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No tools found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          We couldn't find any tool matching "<span className="text-brand-500 font-semibold">{searchQuery}</span>".
        </p>
        <button
          onClick={onClearSearch}
          className="mt-4 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          Clear search query
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <AnimatePresence>
        {tools.map(tool => (
          <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} />
        ))}
      </AnimatePresence>
    </div>
  );
};
