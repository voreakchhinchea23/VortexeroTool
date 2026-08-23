import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TOOLS, CATEGORIES } from './data/toolsData';
import { ToolCategory, Tool } from './types/tool';
import { useFavorites } from './context/FavoritesContext';

// Components
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastContainer } from './components/common/ToastContainer';
import { Footer } from './components/common/Footer';

// Dashboard Views
import { HeroSection } from './components/dashboard/HeroSection';
import { CategoryFilter } from './components/dashboard/CategoryFilter';
import { FavoritesSection } from './components/dashboard/FavoritesSection';
import { ToolsGrid } from './components/dashboard/ToolsGrid';

// Tool View
import { ToolRenderer } from './components/tools/ToolRenderer';

export function App() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeToolId, setActiveToolId] = useState<string | null>(() => {
    // Check URL hash on initial load (e.g. #password-generator)
    const hash = window.location.hash.replace('#', '');
    return TOOLS.some(t => t.id === hash) ? hash : null;
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const { addRecent } = useFavorites();

  // Sync activeToolId with browser URL hash
  useEffect(() => {
    if (activeToolId) {
      window.location.hash = activeToolId;
      addRecent(activeToolId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [activeToolId, addRecent]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTool = (id: string) => {
    if (id) {
      setActiveToolId(id);
    } else {
      setActiveToolId(null);
    }
  };

  const activeTool = useMemo(() => {
    return TOOLS.find(t => t.id === activeToolId) || null;
  }, [activeToolId]);

  // Tool Counts per category
  const toolCounts = useMemo(() => {
    const counts: Record<ToolCategory, number> = {
      all: TOOLS.length,
      productivity: 0,
      security: 0,
      web: 0,
      text: 0,
      design: 0,
      developer: 0,
    };
    TOOLS.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered tools for dashboard grid
  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchCat = selectedCategory === 'all' || tool.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.tags.some(tag => tag.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] bg-grid-pattern text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onHomeClick={() => setActiveToolId(null)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 pt-6">
        {/* Left Sidebar (Desktop) */}
        <Sidebar
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setActiveToolId(null);
          }}
          activeToolId={activeToolId}
          onSelectTool={handleSelectTool}
        />

        {/* Center Main Content */}
        <main className="flex-1 min-w-0 pb-16">
          <AnimatePresence mode="wait">
            {activeTool ? (
              <ToolRenderer
                key={activeTool.id}
                tool={activeTool}
                onBack={() => setActiveToolId(null)}
              />
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Hero Section */}
                <HeroSection
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
                />

                {/* Pinned Favorites Row */}
                {!searchQuery && selectedCategory === 'all' && (
                  <FavoritesSection onSelectTool={handleSelectTool} />
                )}

                {/* Category Navigation Pills */}
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  toolCounts={toolCounts}
                />

                {/* Tools Grid */}
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedCategory === 'all'
                      ? 'All Utilities'
                      : CATEGORIES.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <span className="text-xs font-mono text-slate-400">
                    Showing {filteredTools.length} tools
                  </span>
                </div>

                <ToolsGrid
                  tools={filteredTools}
                  onSelectTool={handleSelectTool}
                  searchQuery={searchQuery}
                  onClearSearch={() => setSearchQuery('')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Navigation Drawer / Bar */}
      <MobileNav
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onGoHome={() => setActiveToolId(null)}
      />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTool={handleSelectTool}
      />

      {/* Global Toast Notification System */}
      <ToastContainer />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveToolId(null);
        }}
        onSelectTool={handleSelectTool}
      />
    </div>
  );
}

export default App;
