import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command, ArrowRight } from 'lucide-react';
import { TOOLS } from '../../data/toolsData';
import { DynamicIcon } from './DynamicIcon';
import { Tool } from '../../types/tool';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTool,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTools = TOOLS.filter(tool => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.tags.some(tag => tag.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          // We rely on parent to open, but handled in parent
        }
        return;
      }

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredTools.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredTools.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          onSelectTool(filteredTools[selectedIndex].id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex, onClose, onSelectTool]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Box */}
            <div className="relative flex items-center px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a tool name, category, or keyword..."
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-base sm:text-lg focus:outline-none font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
                >
                  <X size={16} />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                ESC to close
              </div>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
              {filteredTools.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-sm font-medium">No tools found matching "{query}"</p>
                  <p className="text-xs text-slate-500 mt-1">Try searching for password, qr, json, or case converter</p>
                </div>
              ) : (
                filteredTools.map((tool, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={tool.id}
                      onClick={() => {
                        onSelectTool(tool.id);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400'
                          }`}
                        >
                          <DynamicIcon name={tool.iconName} size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm tracking-tight truncate">{tool.name}</span>
                            <span
                              className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {tool.category}
                            </span>
                          </div>
                          <p
                            className={`text-xs truncate mt-0.5 ${
                              isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {tool.description}
                          </p>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center gap-1.5 shrink-0 ml-3">
                        <ArrowRight size={16} className={isSelected ? 'text-white' : 'text-slate-400 opacity-0 group-hover:opacity-100'} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Tip */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span>Navigate with <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">↑</kbd> <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">↓</kbd></span>
                <span>Select with <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">Enter</kbd></span>
              </div>
              <span>{filteredTools.length} tools available</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
