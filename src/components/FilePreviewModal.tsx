import React, { useState } from 'react';
import { X, Image as ImageIcon, FileText, Download, ZoomIn, ZoomOut, Check, Calendar, HardDrive, FileSpreadsheet, FileArchive, Smartphone } from 'lucide-react';
import { ShareFile } from '../types';
import { formatBytes } from '../services/sampleFiles';

interface FilePreviewModalProps {
  file: ShareFile | null;
  onClose: () => void;
  onConfirmTransmission?: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ file, onClose, onConfirmTransmission }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  if (!file) return null;

  const isPhoto = file.category === 'photo';
  const isDocument = file.category === 'document';
  const isApk = file.category === 'apk';
  const isArchive = file.category === 'archive';

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.3, 0.7));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1b1e] rounded-[32px] overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col max-h-[90vh]">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 dark:bg-teal-400/15 flex items-center justify-center text-teal-600 dark:text-teal-300 shrink-0">
              {isPhoto ? (
                <ImageIcon className="w-5 h-5" />
              ) : isDocument ? (
                <FileText className="w-5 h-5" />
              ) : isApk ? (
                <Smartphone className="w-5 h-5" />
              ) : isArchive ? (
                <FileArchive className="w-5 h-5" />
              ) : (
                <FileSpreadsheet className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                {file.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-numbers">
                {formatBytes(file.size)} · {file.mimeType}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-[#141518]">
          {isPhoto && file.previewUrl ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative w-full max-h-[380px] rounded-2xl overflow-hidden bg-slate-950/10 dark:bg-black/40 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                <img
                  src={file.previewUrl}
                  alt={file.name}
                  referrerPolicy="no-referrer"
                  style={{ transform: `scale(${zoomLevel})` }}
                  className="max-h-[380px] w-auto max-w-full object-contain transition-transform duration-200"
                />
              </div>

              {/* Photo controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleZoomOut}
                  className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  <ZoomOut className="w-3.5 h-3.5" /> Zoom Out
                </button>
                <span className="text-xs font-mono-numbers text-slate-500">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  <ZoomIn className="w-3.5 h-3.5" /> Zoom In
                </button>
              </div>
            </div>
          ) : isDocument ? (
            <div className="space-y-4">
              {/* Document Mock View */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm font-sans">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      Document Preview
                    </span>
                  </div>
                  {file.pageCount && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono-numbers">
                      {file.pageCount} Pages total
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-mono text-xs bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                    {file.textSnippet || 'SonShare Verified Document Header:\nEncoded with AES-256 P2P payload.\nReady for instant transmission over Wi-Fi Direct.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 dark:bg-teal-400/15 flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <HardDrive className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{file.name}</h4>
                  <p className="text-xs text-slate-500 font-mono-numbers">{formatBytes(file.size)}</p>
                </div>
              </div>

              {file.textSnippet && (
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800/60 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line">
                  {file.textSnippet}
                </div>
              )}
            </div>
          )}

          {/* Metadata Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-1">
                <HardDrive className="w-3.5 h-3.5" /> File Size
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white font-mono-numbers">
                {formatBytes(file.size)}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-1">
                <Calendar className="w-3.5 h-3.5" /> Modified
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {new Date(file.dateModified).toLocaleDateString()}
              </p>
            </div>

            {file.dimensions && (
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-1">
                  <ImageIcon className="w-3.5 h-3.5" /> Resolution
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white font-mono-numbers">
                  {file.dimensions.width} × {file.dimensions.height}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#1a1b1e] border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Close
          </button>

          {onConfirmTransmission && (
            <button
              onClick={() => {
                onClose();
                onConfirmTransmission();
              }}
              className="px-6 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-teal-600/20 active:scale-95 transition"
            >
              <Check className="w-4 h-4" /> Ready to Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
