'use client';

import Cookies from 'js-cookie';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';

export const ThemeContext = createContext({
  theme: 'light',
  toggle: () => { },
});

export const ThemeProvider: React.FC<PropsWithChildren<{ initialTheme?: 'light' | 'dark' }>> = ({ children, initialTheme = 'light' }) => {
  const [theme, setTheme] = useState(initialTheme);

  const toggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    Cookies.set('theme', newTheme, { expires: 365 });
  };

  useEffect(() => {
    document.documentElement.classList.remove(theme === 'light' ? 'dark' : 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
