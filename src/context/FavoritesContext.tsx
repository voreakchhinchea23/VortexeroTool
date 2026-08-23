import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface FavoritesContextType {
  favorites: string[];
  recentTools: string[];
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  addRecent: (toolId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vortexero_favorites');
      return saved ? JSON.parse(saved) : ['password-generator', 'qr-generator', 'json-formatter'];
    } catch {
      return ['password-generator', 'qr-generator', 'json-formatter'];
    }
  });

  const [recentTools, setRecentTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vortexero_recents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('vortexero_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('vortexero_recents', JSON.stringify(recentTools));
  }, [recentTools]);

  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites(prev => 
      prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]
    );
  }, []);

  const isFavorite = useCallback((toolId: string) => {
    return favorites.includes(toolId);
  }, [favorites]);

  const addRecent = useCallback((toolId: string) => {
    setRecentTools(prev => {
      const filtered = prev.filter(id => id !== toolId);
      return [toolId, ...filtered].slice(0, 8); // Keep up to 8 recents
    });
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, recentTools, toggleFavorite, isFavorite, addRecent }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
