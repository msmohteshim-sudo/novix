import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type DashboardTheme = 'pink' | 'dark-blue';

interface ThemeContextType {
  theme: DashboardTheme;
  setTheme: (theme: DashboardTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<DashboardTheme>(() => {
    const saved = localStorage.getItem('novax_theme');
    return (saved === 'dark-blue' || saved === 'pink') ? saved : 'pink';
  });

  const setTheme = (newTheme: DashboardTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('novax_theme', newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'pink' ? 'dark-blue' : 'pink';
    setTheme(nextTheme);
  };

  useEffect(() => {
    document.body.classList.remove('theme-pink', 'theme-dark-blue');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
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
