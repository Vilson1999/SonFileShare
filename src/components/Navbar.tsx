import React from 'react';
import {
  Share2,
  Moon,
  Sun,
  ShieldCheck,
  Wifi,
  Radio
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { TransferMode } from '../types';

interface NavbarProps {
  onOpenSpecs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSpecs }) => {
  const { isDark, toggleDarkMode, defaultMode, setDefaultMode } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-[#121316]/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single element brand mark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                SonShare
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
                P2P
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
              by Son Skr
            </p>
          </div>
        </div>

        {/* Zone 2: Frequency Selector (5 GHz / 2.4 GHz / Bluetooth) */}
        <div className="hidden sm:flex items-center p-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <button
            onClick={() => setDefaultMode('wifi-5ghz')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
              defaultMode === 'wifi-5ghz'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>5 GHz Direct</span>
          </button>

          <button
            onClick={() => setDefaultMode('wifi-2.4ghz')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
              defaultMode === 'wifi-2.4ghz'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>2.4 GHz</span>
          </button>

          <button
            onClick={() => setDefaultMode('bluetooth')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
              defaultMode === 'bluetooth'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>BLE</span>
          </button>
        </div>

        {/* Zone 3: Specs Modal & Dark Mode Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSpecs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="System Specs & SDK Info"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="hidden md:inline">Min SDK 28</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
