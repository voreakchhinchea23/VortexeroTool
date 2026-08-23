import React, { useState } from 'react';
import { CATEGORIES } from '../../data/toolsData';
import { ToolCategory } from '../../types/tool';
import { DynamicIcon } from './DynamicIcon';
import { Home, Layers, Search, Star, X } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';

interface MobileNavProps {
  selectedCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
  onOpenSearch: () => void;
  onGoHome: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenSearch,
  onGoHome,
}) => {
  const [showCategoryDrawer, setShowCategoryDrawer] = useState(false);
  const { favorites } = useFavorites();

  return (
    <>
      {/* Category Drawer Modal */}
      {showCategoryDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-6 max-h-[80vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Categories</h3>
              <button
                onClick={() => setShowCategoryDrawer(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {CATEGORIES.map(cat => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setShowCategoryDrawer(false);
                      onGoHome();
                    }}
                    className={`flex items-center gap-3 p-3 rounded-2xl text-left font-semibold text-xs transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <DynamicIcon name={cat.iconName} size={18} />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-6 py-2.5 flex items-center justify-around shadow-lg">
        <button
          onClick={onGoHome}
          className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
        >
          <Home size={20} />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        <button
          onClick={() => setShowCategoryDrawer(true)}
          className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
        >
          <Layers size={20} />
          <span className="text-[10px] font-semibold">Categories</span>
        </button>

        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
        >
          <Search size={20} />
          <span className="text-[10px] font-semibold">Search</span>
        </button>
      </div>
    </>
  );
};
