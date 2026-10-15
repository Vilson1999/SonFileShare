import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Smartphone,
  Code2,
  FolderArchive,
  Terminal,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { KOTLIN_PROJECT_FILES, KotlinFile } from '../services/kotlinProjectSources';
import { downloadCompiledApk, downloadKotlinProjectZip } from '../services/apkGenerator';

interface KotlinApkModalProps {
  onClose: () => void;
}

export const KotlinApkModal: React.FC<KotlinApkModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<KotlinFile>(KOTLIN_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isDownloadingApk, setIsDownloadingApk] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadApk = async () => {
    try {
      setIsDownloadingApk(true);
      await downloadCompiledApk();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloadingApk(false);
    }
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloadingZip(true);
      await downloadKotlinProjectZip();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#1a1b1e] rounded-[32px] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                SonShare — Native Kotlin & APK Package
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Jetpack Compose · Min SDK 28 · Developed by Son Skr
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

        {/* Top Download Action Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-emerald-500/10 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold bg-teal-600 text-white px-2.5 py-0.5 rounded-full">
                Release v1.0.0
              </span>
              <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                ARMv7 & ARMv8 Only
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Android 11 (API 30) Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              Strictly built for ARMv7 (armeabi-v7a) and ARMv8 (arm64-v8a) architectures. Signed with APK Signature Scheme v2 &amp; v3 for seamless installation on Android 11+.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* DOWNLOAD COMPILED APK BUTTON */}
            <button
              onClick={handleDownloadApk}
              disabled={isDownloadingApk}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/25 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloadingApk ? 'Downloading APK...' : 'Download APK (ARMv7 & ARMv8)'}</span>
            </button>

            {/* DOWNLOAD KOTLIN PROJECT ZIP */}
            <button
              onClick={handleDownloadZip}
              disabled={isDownloadingZip}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition"
            >
              <FolderArchive className="w-4 h-4 text-emerald-500" />
              <span>{isDownloadingZip ? 'Zipping...' : 'Project ZIP'}</span>
            </button>
          </div>
        </div>

        {/* Source File Explorer Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row min-h-0">
          
          {/* File sidebar tabs */}
          <div className="w-full md:w-64 border-r border-slate-100 dark:border-slate-800 p-3 overflow-y-auto space-y-1.5 shrink-0 bg-slate-50/60 dark:bg-slate-900/40">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
              Kotlin Source Tree
            </span>
            {KOTLIN_PROJECT_FILES.map((file) => (
              <button
                key={file.filename}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition flex items-center gap-2 ${
                  selectedFile.filename === file.filename
                    ? 'bg-teal-500/15 text-teal-800 dark:text-teal-200 font-bold border border-teal-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0 text-teal-500" />
                <span className="truncate">{file.filename}</span>
              </button>
            ))}

            <div className="pt-4 px-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Build Command
              </span>
              <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] flex items-center gap-1.5 overflow-x-auto">
                <Terminal className="w-3 h-3 text-slate-400 shrink-0" />
                <span>./gradlew assembleRelease</span>
              </div>
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-950 text-slate-100">
            {/* Code Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 truncate text-slate-400 font-mono">
                <Code2 className="w-3.5 h-3.5 text-teal-400" />
                <span className="truncate">{selectedFile.path}</span>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-200 selection:bg-teal-500/40">
              <pre className="whitespace-pre">{selectedFile.content}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white dark:bg-[#1a1b1e] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Target SDK 35 (Android 15+) · Min SDK 28</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
