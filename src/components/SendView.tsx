import React, { useState, useRef } from 'react';
import {
  Upload,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Smartphone,
  HardDrive,
  Trash2,
  Eye,
  Plus,
  Wifi,
  Radio,
  Send as SendIcon,
  CheckCircle2,
  QrCode,
  Laptop
} from 'lucide-react';
import { NearbyPeer, ShareFile, TransferMode } from '../types';
import { SAMPLE_FILES, formatBytes, getFileCategory } from '../services/sampleFiles';
import { DEFAULT_NEARBY_PEERS } from '../services/p2pEngine';
import { FilePreviewModal } from './FilePreviewModal';

interface SendViewProps {
  onBack: () => void;
  onStartTransfer: (files: ShareFile[], peer: NearbyPeer, mode: TransferMode) => void;
  initialMode: TransferMode;
}

export const SendView: React.FC<SendViewProps> = ({ onBack, onStartTransfer, initialMode }) => {
  const [selectedFiles, setSelectedFiles] = useState<ShareFile[]>([
    SAMPLE_FILES[0], // Preload one sample photo for convenience
    SAMPLE_FILES[1], // Preload one sample doc for previewing
  ]);
  const [previewingFile, setPreviewingFile] = useState<ShareFile | null>(null);
  const [currentStep, setCurrentStep] = useState<'pick' | 'peers'>('pick');
  const [transferMode, setTransferMode] = useState<TransferMode>(initialMode);
  const [peers, setPeers] = useState<NearbyPeer[]>(DEFAULT_NEARBY_PEERS);
  const [selectedPeer, setSelectedPeer] = useState<NearbyPeer | null>(DEFAULT_NEARBY_PEERS[0]);
  const [isScanning, setIsScanning] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload handler
  const handleFilesAdded = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const newFiles: ShareFile[] = [];

    Array.from(event.target.files).forEach((file, idx) => {
      const { category, mimeType } = getFileCategory(file);
      const isImage = category === 'photo';

      const shareFile: ShareFile = {
        id: `file-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
        name: file.name,
        size: file.size,
        category,
        mimeType,
        fileObject: file,
        dateModified: file.lastModified,
      };

      if (isImage) {
        shareFile.previewUrl = URL.createObjectURL(file);
      } else if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          shareFile.textSnippet = (e.target?.result as string)?.slice(0, 500);
        };
        reader.readAsText(file.slice(0, 1024));
      }

      newFiles.push(shareFile);
    });

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleLoadAllSamples = () => {
    setSelectedFiles(SAMPLE_FILES);
  };

  const totalBytes = selectedFiles.reduce((acc, f) => acc + f.size, 0);

  const handleProceedToPeers = () => {
    if (selectedFiles.length === 0) return;
    setCurrentStep('peers');
    setIsScanning(true);
  };

  const handleTriggerTransfer = (peer: NearbyPeer) => {
    setSelectedPeer(peer);
    onStartTransfer(selectedFiles, peer, transferMode);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col flex-1 pb-12">
      {/* Top bar */}
      <div className="flex items-center justify-between py-4 mb-4">
        <button
          onClick={currentStep === 'peers' ? () => setCurrentStep('pick') : onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentStep === 'peers' ? 'Back to Files' : 'Home'}
        </button>

        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {currentStep === 'pick' ? 'Select Files to Send' : 'Nearby Devices'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-numbers">
            {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} · {formatBytes(totalBytes)}
          </p>
        </div>

        <div className="w-20" /> {/* Spacer for symmetry */}
      </div>

      {currentStep === 'pick' ? (
        <div className="space-y-6">
          {/* Hidden native file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFilesAdded}
            multiple
            className="hidden"
          />

          {/* Drag & Drop / Select File Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group relative border-2 border-dashed border-teal-500/40 hover:border-teal-500 dark:border-teal-400/30 dark:hover:border-teal-400 rounded-[32px] p-8 text-center cursor-pointer bg-teal-500/5 hover:bg-teal-500/10 dark:bg-teal-500/[0.03] dark:hover:bg-teal-500/[0.07] transition-all flex flex-col items-center justify-center space-y-3"
          >
            <div className="w-16 h-16 rounded-full bg-teal-500/10 dark:bg-teal-400/15 flex items-center justify-center text-teal-600 dark:text-teal-300 group-hover:scale-110 transition-transform shadow-sm">
              <Upload className="w-7 h-7" />
            </div>

            <div>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                Tap to pick documents, photos, or apps
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports RAW, 4K Photos, PDFs, DOCX, APKs, Videos, and ZIP archives
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-5 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md active:scale-95 transition"
              >
                Browse Device Storage
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLoadAllSamples();
                }}
                className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition"
              >
                Load Demo Files
              </button>
            </div>
          </div>

          {/* File Previews List */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Files in Transmission Queue ({selectedFiles.length})
                </span>
                <span className="text-xs text-slate-400 font-mono-numbers">
                  ({formatBytes(totalBytes)})
                </span>
              </div>
              <button
                onClick={() => setSelectedFiles([])}
                className="text-xs text-red-500 hover:text-red-600 font-medium"
                disabled={selectedFiles.length === 0}
              >
                Clear all
              </button>
            </div>

            {selectedFiles.length === 0 ? (
              <div className="text-center py-12 rounded-[28px] bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No files selected yet. Pick files or load demo samples above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedFiles.map((file) => {
                  const isPhoto = file.category === 'photo';
                  const isDocument = file.category === 'document';
                  const isApk = file.category === 'apk';

                  return (
                    <div
                      key={file.id}
                      onClick={() => setPreviewingFile(file)}
                      className="group p-3.5 rounded-[24px] bg-white dark:bg-[#1a1b1e] border border-slate-200/80 dark:border-slate-800/80 hover:border-teal-500/60 dark:hover:border-teal-400/60 transition shadow-sm flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Thumbnail or Icon */}
                        <div className="relative w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                          {isPhoto && file.previewUrl ? (
                            <img
                              src={file.previewUrl}
                              alt={file.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : isDocument ? (
                            <FileText className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                          ) : isApk ? (
                            <Smartphone className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <HardDrive className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                          )}
                        </div>

                        {/* Title and metadata */}
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {file.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-numbers">
                            {formatBytes(file.size)}
                            {file.dimensions && ` · ${file.dimensions.width}×${file.dimensions.height}`}
                            {file.pageCount && ` · ${file.pageCount} pgs`}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewingFile(file);
                          }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-800 transition"
                          title="Preview file"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveFile(file.id, e)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 transition"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Proceed CTA */}
          <div className="pt-4 flex items-center justify-end">
            <button
              onClick={handleProceedToPeers}
              disabled={selectedFiles.length === 0}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <span>Scan for Nearby Devices</span>
              <SendIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Step 2: Peer Discovery & Frequency Selection */
        <div className="space-y-6">
          {/* Frequency & Connectivity Selector */}
          <div className="p-4 rounded-[28px] bg-white dark:bg-[#1a1b1e] border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Transmission Frequency & Protocol
              </span>
              <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold font-mono-numbers">
                Min SDK 28 Compatible
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setTransferMode('wifi-5ghz')}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                  transferMode === 'wifi-5ghz'
                    ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-200'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Wifi className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">5 GHz Wi-Fi Direct</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Up to 96 MB/s (Fastest)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTransferMode('wifi-2.4ghz')}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                  transferMode === 'wifi-2.4ghz'
                    ? 'border-cyan-500 bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-800 dark:text-cyan-200'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 flex items-center justify-center shrink-0">
                  <Wifi className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">2.4 GHz Direct</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Longer Range (~25 MB/s)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTransferMode('bluetooth')}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                  transferMode === 'bluetooth'
                    ? 'border-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-800 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0">
                  <Radio className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Bluetooth 5.4 LE</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Offline Zero-Net (~2.5 MB/s)</div>
                </div>
              </button>
            </div>
          </div>

          {/* Radar Scanning Visualizer */}
          <div className="relative p-8 rounded-[32px] bg-slate-900 text-white overflow-hidden flex flex-col items-center justify-center min-h-[200px]">
            {/* Concentric radar waves (clean, static) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 rounded-full border border-teal-500/30" />
              <div className="w-56 h-56 rounded-full border border-teal-500/20" />
              <div className="w-80 h-80 rounded-full border border-teal-500/10" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3">
                <Radio className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold">Scanning for nearby SonShare receivers...</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Make sure the receiving device has SonShare open and has tapped &apos;Receive&apos;.
              </p>
            </div>
          </div>

          {/* Discovered Nearby Peers List */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Discovered Devices ({peers.length})
              </span>
              <span className="text-xs text-slate-400">Tap a device to begin high-speed transfer</span>
            </div>

            <div className="space-y-2.5">
              {peers.map((peer) => (
                <div
                  key={peer.id}
                  onClick={() => handleTriggerTransfer(peer)}
                  className="group p-4 rounded-[24px] bg-white dark:bg-[#1a1b1e] border border-slate-200/80 dark:border-slate-800/80 hover:border-teal-500 hover:shadow-md transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shrink-0 shadow-sm"
                      style={{ backgroundColor: peer.avatarColor }}
                    >
                      {peer.deviceType === 'android' ? (
                        <Smartphone className="w-6 h-6" />
                      ) : peer.deviceType === 'mac' ? (
                        <Laptop className="w-6 h-6" />
                      ) : (
                        <Radio className="w-6 h-6" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {peer.name}
                        </h4>
                        {peer.isRealLocalPeer && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded-full">
                            Active Tab
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {peer.deviceModel} {peer.ipAddress ? `· ${peer.ipAddress}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block font-mono-numbers">
                        {transferMode === 'wifi-5ghz' ? '~85 MB/s' : transferMode === 'wifi-2.4ghz' ? '~22 MB/s' : '~2 MB/s'}
                      </span>
                      <span className="text-[10px] text-slate-400">Ready</span>
                    </div>

                    <button
                      type="button"
                      className="px-5 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md active:scale-95 transition flex items-center gap-1.5"
                    >
                      <span>Send</span>
                      <SendIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Preview Modal for photos and documents */}
      <FilePreviewModal
        file={previewingFile}
        onClose={() => setPreviewingFile(null)}
      />
    </div>
  );
};
