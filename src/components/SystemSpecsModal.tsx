import React from 'react';
import {
  X,
  ShieldCheck,
  Cpu,
  Wifi,
  Radio,
  HardDrive,
  Code,
  Layers,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface SystemSpecsModalProps {
  onClose: () => void;
}

export const SystemSpecsModal: React.FC<SystemSpecsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1b1e] rounded-[32px] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 dark:bg-teal-400/15 flex items-center justify-center text-teal-600 dark:text-teal-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                SonShare Architecture & Specs
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Created by Son Skr
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Developer badge card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wider block">
                Lead Architect & Engineer
              </span>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                Son Skr
              </h4>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold bg-teal-600 text-white px-2.5 py-1 rounded-full">
                SonShare Core v3.4
              </span>
            </div>
          </div>

          {/* Android SDK Matrix */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <span>Android SDK Compatibility</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">Minimum SDK</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm font-mono-numbers">
                  API 28 (Android 9 Pie)
                </span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">Wi-Fi Direct P2P Ready</span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400 block mb-0.5">Maximum SDK</span>
                <span className="font-extrabold text-teal-600 dark:text-teal-400 text-sm font-mono-numbers">
                  Future-Proof (API 35+)
                </span>
                <span className="text-[10px] text-teal-600 block mt-0.5">Open Architecture</span>
              </div>
            </div>
          </div>

          {/* Radio & Networking Protocols */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              <Wifi className="w-4 h-4 text-teal-500" />
              <span>Direct Link Capabilities</span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800/50">
                <span className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-emerald-500" /> 5 GHz Wi-Fi Direct
                </span>
                <span className="font-mono-numbers font-semibold text-slate-900 dark:text-white">
                  802.11ac / 802.11ax (~96 MB/s)
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800/50">
                <span className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-cyan-500" /> 2.4 GHz Wi-Fi Direct
                </span>
                <span className="font-mono-numbers font-semibold text-slate-900 dark:text-white">
                  802.11b/g/n (~26 MB/s)
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-800/50">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-indigo-500" /> Bluetooth Discovery
                </span>
                <span className="font-mono-numbers font-semibold text-slate-900 dark:text-white">
                  BLE 5.4 Coded PHY Beacon
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-500" /> Design System
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  Android Material You (M3)
                </span>
              </div>
            </div>
          </div>

          {/* Privacy & Zero-Cloud Guarantee */}
          <div className="p-3.5 rounded-2xl bg-teal-500/5 border border-teal-500/10 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong className="text-teal-700 dark:text-teal-300">100% Offline P2P:</strong> Files are sliced and transferred directly device-to-device via local socket streams and peer beacons. Zero cloud relays, zero accounts required, complete data sovereignty.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white dark:bg-[#1a1b1e] border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
