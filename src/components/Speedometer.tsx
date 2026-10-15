import React from 'react';
import { Gauge, Zap, Wifi } from 'lucide-react';
import { TransferMode } from '../types';
import { formatSpeed } from '../services/sampleFiles';

interface SpeedometerProps {
  speedBytesPerSec: number;
  mode: TransferMode;
  isPaused?: boolean;
}

export const Speedometer: React.FC<SpeedometerProps> = ({ speedBytesPerSec, mode, isPaused }) => {
  const { value, unit } = formatSpeed(speedBytesPerSec);

  // Determine max scale for speedometer dial based on active frequency/technology
  const maxSpeedScale = mode === 'wifi-5ghz' ? 100 : mode === 'wifi-2.4ghz' ? 30 : 4; // in MB/s
  const currentSpeedMB = speedBytesPerSec / (1024 * 1024);
  const percentage = Math.min(100, Math.max(0, (currentSpeedMB / maxSpeedScale) * 100));

  // Gauge angle (-90 deg to +90 deg arc)
  const angle = -90 + (percentage / 100) * 180;

  return (
    <div className="flex flex-col items-center justify-center py-2">
      {/* Center speedometer header with speedometer icon directly next to it */}
      <div className="relative flex flex-col items-center">
        {/* Semi-circular speedometer arc gauge */}
        <div className="relative w-48 h-24 overflow-hidden flex items-end justify-center">
          <svg className="w-48 h-48 -mb-24" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              strokeDasharray="125.6 251.2"
              strokeDashoffset="0"
              transform="rotate(180 50 50)"
              className="text-slate-200 dark:text-slate-800"
            />
            {/* Active speed arc with color transition */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#speed-gradient)"
              strokeWidth="7.5"
              strokeDasharray="125.6 251.2"
              strokeDashoffset={125.6 - (percentage / 100) * 125.6}
              strokeLinecap="round"
              transform="rotate(180 50 50)"
              className="transition-all duration-300 ease-out"
            />
            <defs>
              <linearGradient id="speed-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="60%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>

          {/* Animated speedometer needle */}
          <div
            className="absolute bottom-0 left-1/2 w-1.5 h-16 origin-bottom -translate-x-1/2 transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-50%) rotate(${isPaused ? -90 : angle}deg)` }}
          >
            <div className="w-1.5 h-12 bg-gradient-to-t from-teal-500 to-emerald-400 rounded-full shadow-md" />
            <div className="w-3.5 h-3.5 bg-slate-800 dark:bg-white rounded-full -mt-1 -ml-1 border-2 border-teal-500" />
          </div>
        </div>

        {/* Speed readout with Speedometer Icon placed prominently right in the center */}
        <div className="mt-1 flex items-center justify-center gap-2.5">
          <div className="p-2 rounded-2xl bg-teal-500/10 dark:bg-teal-400/15 text-teal-600 dark:text-teal-300 flex items-center justify-center shadow-sm">
            <Gauge className="w-6 h-6" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono-numbers text-slate-900 dark:text-white">
              {isPaused ? '0.0' : value}
            </span>
            <span className="text-sm sm:text-base font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider font-mono-numbers">
              {unit}
            </span>
          </div>
        </div>

        {/* Bandwidth / Frequency chip */}
        <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 font-medium">
            {mode === 'wifi-5ghz' ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">5 GHz High-Band Wi-Fi Direct</span>
                <span className="text-slate-400 dark:text-slate-500">· Peak 1200 Mbps</span>
              </>
            ) : mode === 'wifi-2.4ghz' ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-cyan-500" />
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">2.4 GHz Long-Range Direct</span>
                <span className="text-slate-400 dark:text-slate-500">· 300 Mbps</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400 font-semibold">Bluetooth 5.4 LE Offline</span>
                <span className="text-slate-400 dark:text-slate-500">· Low Power</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
