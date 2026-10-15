import React from 'react';
import {
  Pause,
  Play,
  XCircle,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Smartphone,
  HardDrive,
  Home,
  Gauge
} from 'lucide-react';
import { TransferSession } from '../types';
import { formatBytes, formatEta, formatSpeed } from '../services/sampleFiles';

interface TransferViewProps {
  session: TransferSession;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onDone: () => void;
}

export const TransferView: React.FC<TransferViewProps> = ({
  session,
  onPause,
  onResume,
  onCancel,
  onDone,
}) => {
  const isCompleted = session.status === 'completed';
  const isPaused = session.status === 'paused';
  const isCancelled = session.status === 'cancelled';

  // Overall progress percentage
  const overallProgress =
    session.totalBytes > 0
      ? Math.min(100, Math.round((session.transferredBytes / session.totalBytes) * 100))
      : 0;

  // Active or completed files ETA
  const remainingBytes = Math.max(0, session.totalBytes - session.transferredBytes);
  const etaSeconds =
    session.currentSpeed > 0 ? Math.ceil(remainingBytes / session.currentSpeed) : 0;

  const { value: speedValue, unit: speedUnit } = formatSpeed(session.currentSpeed);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col flex-1 pb-12">
      {/* Container card following Material You 3 aesthetics */}
      <div className="p-6 sm:p-8 rounded-[36px] bg-white dark:bg-[#1a1b1e] border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-6">
        
        {/* ONE ROW HEADER: TOTAL ON LEFT, SPEED IN CENTER WITH SPEEDOMETER ICON, TIME ON RIGHT (BIG TEXT, NO LABELS) */}
        <div className="pb-6 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            
            {/* TOTAL (LEFT SIDE) - BIG TEXT, NO LABEL */}
            <div className="flex-1 text-left min-w-0">
              <span className="text-lg sm:text-2xl lg:text-3xl font-black font-mono-numbers text-slate-900 dark:text-white tracking-tight truncate block">
                {formatBytes(session.transferredBytes)} / {formatBytes(session.totalBytes)}
              </span>
            </div>

            {/* SPEED (CENTER) WITH SPEEDOMETER ICON - BIG TEXT */}
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 shrink-0 px-2">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-teal-500/10 dark:bg-teal-400/15 text-teal-600 dark:text-teal-300 flex items-center justify-center shrink-0">
                <Gauge className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono-numbers text-slate-900 dark:text-white tracking-tight">
                  {isPaused ? '0.0' : speedValue}
                </span>
                <span className="text-xs sm:text-sm font-bold text-teal-600 dark:text-teal-400 uppercase font-mono-numbers">
                  {speedUnit}
                </span>
              </div>
            </div>

            {/* TIME (RIGHT SIDE) - BIG TEXT, NO LABEL */}
            <div className="flex-1 text-right min-w-0">
              <span className="text-lg sm:text-2xl lg:text-3xl font-black font-mono-numbers text-slate-900 dark:text-white tracking-tight block">
                {isCompleted ? '00:00' : isPaused ? 'Paused' : formatEta(etaSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* OVERALL PROGRESS BAR */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">
              {session.direction === 'send' ? 'Sending to' : 'Receiving from'}:{' '}
              <strong className="text-teal-600 dark:text-teal-400">{session.peer.name}</strong>
            </span>
            <span className="font-mono-numbers text-teal-600 dark:text-teal-400 text-sm font-bold">
              {overallProgress}%
            </span>
          </div>

          {/* Smooth Material You Progress Bar */}
          <div className="relative w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-200 ${
                isCompleted
                  ? 'bg-emerald-500'
                  : isPaused
                  ? 'bg-amber-500'
                  : isCancelled
                  ? 'bg-red-500'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-400'
              }`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* TRANSFER MENU / FILE ITEMS LIST */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              File Details & Status ({session.items.length})
            </h4>
            <span className="text-xs font-mono-numbers text-slate-400">
              {session.items.filter((i) => i.status === 'completed').length} of {session.items.length} completed
            </span>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {session.items.map((item) => {
              const isPhoto = item.file.category === 'photo';
              const isDoc = item.file.category === 'document';
              const isApk = item.file.category === 'apk';

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 space-y-2"
                >
                  <div className="flex items-center justify-between gap-3 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                        {isPhoto ? (
                          <ImageIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        ) : isDoc ? (
                          <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : isApk ? (
                          <Smartphone className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                        ) : (
                          <HardDrive className="w-5 h-5 text-slate-500" />
                        )}
                      </div>

                      <div className="min-w-0">
                        {/* File Name */}
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.file.name}
                        </h5>
                        {/* File Size & Transferred Amount */}
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono-numbers">
                          {formatBytes(item.transferredBytes)} / {formatBytes(item.file.size)}
                        </p>
                      </div>
                    </div>

                    {/* Transfer Status Badge */}
                    <div className="shrink-0 text-right">
                      {item.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Done
                        </span>
                      ) : item.status === 'transferring' ? (
                        <span className="text-teal-600 dark:text-teal-400 font-bold text-xs font-mono-numbers">
                          {Math.round(item.progress)}%
                        </span>
                      ) : item.status === 'paused' ? (
                        <span className="text-amber-500 text-xs font-bold">Paused</span>
                      ) : item.status === 'cancelled' ? (
                        <span className="text-red-500 text-xs font-bold">Cancelled</span>
                      ) : (
                        <span className="text-slate-400 text-xs">Queued</span>
                      )}
                    </div>
                  </div>

                  {/* Individual file progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-150 ${
                        item.status === 'completed'
                          ? 'bg-emerald-500'
                          : item.status === 'paused'
                          ? 'bg-amber-400'
                          : 'bg-teal-500'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTION BUTTONS: Pause, Resume, and Cancel Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {!isCompleted && !isCancelled ? (
            <div className="flex items-center justify-between gap-3">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 px-4 rounded-full border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel</span>
              </button>

              {/* Pause or Resume Button */}
              {isPaused ? (
                <button
                  type="button"
                  onClick={onResume}
                  className="flex-1 py-3 px-4 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-teal-600/25 transition active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onPause}
                  className="flex-1 py-3 px-4 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-amber-500/25 transition active:scale-95"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </button>
              )}
            </div>
          ) : isCompleted ? (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Transfer Successfully Completed!
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-mono-numbers">
                    {session.items.length} files ({formatBytes(session.totalBytes)}) transmitted seamlessly.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={onDone}
                  className="flex-1 py-3.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <Home className="w-4 h-4" />
                  <span>Return to Home</span>
                </button>
              </div>
            </div>
          ) : (
            /* Cancelled state */
            <div className="space-y-3 text-center">
              <p className="text-xs text-red-500 font-medium">
                Transfer was cancelled by the user.
              </p>
              <button
                onClick={onDone}
                className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
              >
                Return to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
