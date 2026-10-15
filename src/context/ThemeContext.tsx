import React, { createContext, useContext, useEffect, useState } from 'react';
import { TransferMode } from '../types';

export interface ThemePalette {
  id: string;
  name: string;
  primaryLight: string;
  primaryDark: string;
  containerLight: string;
  containerDark: string;
  accent: string;
}

export const THEME_PALETTES: ThemePalette[] = [
  {
    id: 'teal',
    name: 'Ocean Cyan (M3)',
    primaryLight: '#006874',
    primaryDark: '#4fd8eb',
    containerLight: '#97f0ff',
    containerDark: '#004f58',
    accent: '#00bcd4',
  },
  {
    id: 'mint',
    name: 'Android Mint',
    primaryLight: '#006d39',
    primaryDark: '#56dd85',
    containerLight: '#73fb9f',
    containerDark: '#00532a',
    accent: '#10b981',
  },
  {
    id: 'indigo',
    name: 'Cosmic Violet',
    primaryLight: '#5954a8',
    primaryDark: '#c5c0ff',
    containerLight: '#e4dfff',
    containerDark: '#413c8f',
    accent: '#6366f1',
  },
  {
    id: 'amber',
    name: 'Sunset Amber',
    primaryLight: '#8c5000',
    primaryDark: '#ffb77c',
    containerLight: '#ffdcc2',
    containerDark: '#6b3c00',
    accent: '#f59e0b',
  },
];

interface ThemeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
  palette: ThemePalette;
  setPalette: (palette: ThemePalette) => void;
  defaultMode: TransferMode;
  setDefaultMode: (mode: TransferMode) => void;
  deviceName: string;
  setDeviceName: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('sonshare_theme_dark');
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [palette, setPalette] = useState<ThemePalette>(() => {
    const savedId = localStorage.getItem('sonshare_palette_id');
    const found = THEME_PALETTES.find((p) => p.id === savedId);
    return found || THEME_PALETTES[0];
  });

  const [defaultMode, setDefaultMode] = useState<TransferMode>(() => {
    const saved = localStorage.getItem('sonshare_preferred_mode') as TransferMode;
    return saved === 'wifi-2.4ghz' || saved === 'bluetooth' ? saved : 'wifi-5ghz';
  });

  const [deviceName, setDeviceName] = useState<string>(() => {
    const saved = localStorage.getItem('sonshare_device_name');
    if (saved) return saved;
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    return isMobile ? 'Pixel 9 Pro (Son)' : 'Son Skr Laptop (P2P)';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('sonshare_theme_dark', isDark ? 'true' : 'false');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('sonshare_palette_id', palette.id);
  }, [palette]);

  useEffect(() => {
    localStorage.setItem('sonshare_preferred_mode', defaultMode);
  }, [defaultMode]);

  useEffect(() => {
    localStorage.setItem('sonshare_device_name', deviceName);
  }, [deviceName]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleDarkMode,
        palette,
        setPalette,
        defaultMode,
        setDefaultMode,
        deviceName,
        setDeviceName,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
