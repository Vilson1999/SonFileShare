import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  ArrowLeft,
  Radio,
  QrCode,
  CheckCircle,
  Copy,
  Smartphone,
  Download
} from 'lucide-react';
import { NearbyPeer, ShareFile, TransferMode } from '../types';
import { SAMPLE_FILES } from '../services/sampleFiles';
import { useTheme } from '../context/ThemeContext';

interface ReceiveViewProps {
  onBack: () => void;
  onAcceptIncoming: (files: ShareFile[], peer: NearbyPeer, mode: TransferMode) => void;
}

export const ReceiveView: React.FC<ReceiveViewProps> = ({ onBack, onAcceptIncoming }) => {
  const { deviceName, defaultMode } = useTheme();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [incomingRequest, setIncomingRequest] = useState<{
    peer: NearbyPeer;
    files: ShareFile[];
    mode: TransferMode;
  } | null>(null);

  const pairingCode = 'SON-7492';

  useEffect(() => {
    // Generate QR code for instant cross-device offline pairing
    const payload = JSON.stringify({
      app: 'SonShare',
      dev: 'Son Skr',
      code: pairingCode,
      device: deviceName,
      freq: defaultMode,
      minSdk: 28,
    });

    QRCode.toDataURL(payload, {
      width: 240,
      margin: 1.5,
      color: {
        dark: '#006874',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation failed', err));
  }, [deviceName, defaultMode]);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(pairingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSimulateIncoming = () => {
    setIncomingRequest({
      peer: {
        id: 'peer-sim-s24',
        name: 'Son Galaxy S24 Ultra (Wi-Fi Direct)',
        deviceModel: 'Samsung SM-S928B',
        deviceType: 'android',
        avatarColor: '#006874',
        signalStrength: 4,
        preferredMode: defaultMode,
        supportedModes: ['wifi-5ghz', 'wifi-2.4ghz', 'bluetooth'],
        isOnline: true,
      },
      files: [SAMPLE_FILES[0], SAMPLE_FILES[1], SAMPLE_FILES[4]],
      mode: defaultMode,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col flex-1 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between py-4 mb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </button>

        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Receive Files</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ready for nearby senders</p>
        </div>

        <div className="w-20" />
      </div>

      {/* Main Waiting Card with Radar */}
      <div className="p-6 sm:p-8 rounded-[36px] bg-white dark:bg-[#1a1b1e] border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col items-center text-center space-y-6">
        
        {/* Receiver Beacon Icon (Static, clean, no ping/pulse animations) */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Radio className="w-10 h-10" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Broadcasting as &quot;{deviceName}&quot;
          </h3>
        </div>

        {/* Pairing QR Code Card */}
        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-[#141518] border border-slate-200/80 dark:border-slate-800/80 flex flex-col items-center space-y-3">
          {qrDataUrl ? (
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200/60">
              <img
                src={qrDataUrl}
                alt="SonShare Pairing QR Code"
                referrerPolicy="no-referrer"
                className="w-44 h-44 object-contain"
              />
            </div>
          ) : (
            <div className="w-44 h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
              <QrCode className="w-12 h-12 text-slate-400" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Fast Connect PIN:</span>
            <span className="font-mono-numbers font-bold text-sm tracking-wider bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-900 dark:text-white">
              {pairingCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition"
              title="Copy PIN"
            >
              {copiedCode ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Test Incoming Transfer Button (No sparkle animation) */}
        <div className="pt-2 w-full">
          <button
            onClick={handleSimulateIncoming}
            className="w-full py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <span>Simulate Incoming Transfer</span>
          </button>
        </div>
      </div>

      {/* Incoming Connection Dialog Prompt */}
      {incomingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-white dark:bg-[#1a1b1e] rounded-[32px] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: incomingRequest.peer.avatarColor }}
              >
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Incoming File Transfer
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  From: {incomingRequest.peer.name}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Items:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {incomingRequest.files.length} Files
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Total Size:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono-numbers">
                  51.4 MB
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Protocol:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  5 GHz Wi-Fi Direct (High-Speed)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIncomingRequest(null)}
                className="flex-1 py-3 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  const req = incomingRequest;
                  setIncomingRequest(null);
                  onAcceptIncoming(req.files, req.peer, req.mode);
                }}
                className="flex-1 py-3 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-lg shadow-teal-600/25 transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Accept & Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
