import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'vibrant';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isVibrant: boolean;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('vortexero_theme') as Theme;
    if (saved === 'dark' || saved === 'light' || saved === 'vibrant') return saved;
    return 'vibrant'; // Default to the new gorgeous Vivid Chroma theme!
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'vibrant');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'vibrant') {
      root.classList.add('dark', 'vibrant');
    } else {
      root.classList.add('light');
    }

    localStorage.setItem('vortexero_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => {
      if (prev === 'vibrant') return 'dark';
      if (prev === 'dark') return 'light';
      return 'vibrant';
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const isVibrant = theme === 'vibrant';
  const isDark = theme === 'dark' || theme === 'vibrant';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isVibrant, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
