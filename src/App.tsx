import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { SendView } from './components/SendView';
import { ReceiveView } from './components/ReceiveView';
import { TransferView } from './components/TransferView';
import { SystemSpecsModal } from './components/SystemSpecsModal';
import { KotlinApkModal } from './components/KotlinApkModal';
import { P2PTransferManager } from './services/p2pEngine';
import { NearbyPeer, ShareFile, TransferMode, TransferSession } from './types';

function MainApp() {
  const { defaultMode, deviceName } = useTheme();

  // Navigation states: 'home' | 'send' | 'receive' | 'transfer'
  const [currentView, setCurrentView] = useState<'home' | 'send' | 'receive' | 'transfer'>('home');
  const [activeSession, setActiveSession] = useState<TransferSession | null>(null);

  // Modals
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isKotlinModalOpen, setIsKotlinModalOpen] = useState(false);

  // P2P Transfer Manager instance
  const transferManagerRef = useRef<P2PTransferManager | null>(null);

  useEffect(() => {
    transferManagerRef.current = new P2PTransferManager(deviceName);
    return () => {
      transferManagerRef.current?.stopTransfer();
    };
  }, [deviceName]);

  // Sound feedback via native Web Audio API
  const playSound = (type: 'start' | 'complete' | 'pause' | 'cancel') => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'start') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'complete') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'pause') {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  // Start a send transfer
  const handleStartSendTransfer = (files: ShareFile[], peer: NearbyPeer, mode: TransferMode) => {
    if (!transferManagerRef.current) return;
    playSound('start');

    const session = transferManagerRef.current.startTransfer(
      files,
      peer,
      mode,
      'send',
      (updatedSession) => {
        setActiveSession({ ...updatedSession });
      },
      () => {
        playSound('complete');
      }
    );

    setActiveSession(session);
    setCurrentView('transfer');
  };

  // Start an incoming transfer in receive mode
  const handleAcceptIncomingTransfer = (files: ShareFile[], peer: NearbyPeer, mode: TransferMode) => {
    if (!transferManagerRef.current) return;
    playSound('start');

    const session = transferManagerRef.current.startTransfer(
      files,
      peer,
      mode,
      'receive',
      (updatedSession) => {
        setActiveSession({ ...updatedSession });
      },
      () => {
        playSound('complete');
      }
    );

    setActiveSession(session);
    setCurrentView('transfer');
  };

  const handlePauseTransfer = () => {
    playSound('pause');
    transferManagerRef.current?.pauseTransfer();
  };

  const handleResumeTransfer = () => {
    playSound('start');
    transferManagerRef.current?.resumeTransfer();
  };

  const handleCancelTransfer = () => {
    playSound('cancel');
    transferManagerRef.current?.cancelTransfer();
  };

  const handleFinishTransfer = () => {
    transferManagerRef.current?.stopTransfer();
    setActiveSession(null);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#121316] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        onOpenSpecs={() => setIsSpecsOpen(true)}
        onOpenKotlinApk={() => setIsKotlinModalOpen(true)}
      />

      {/* Main Viewport Router */}
      <main className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-6">
        {currentView === 'home' && (
          <HomeScreen
            onStartSend={() => setCurrentView('send')}
            onStartReceive={() => setCurrentView('receive')}
          />
        )}

        {currentView === 'send' && (
          <SendView
            onBack={() => setCurrentView('home')}
            onStartTransfer={handleStartSendTransfer}
            initialMode={defaultMode}
          />
        )}

        {currentView === 'receive' && (
          <ReceiveView
            onBack={() => setCurrentView('home')}
            onAcceptIncoming={handleAcceptIncomingTransfer}
          />
        )}

        {currentView === 'transfer' && activeSession && (
          <TransferView
            session={activeSession}
            onPause={handlePauseTransfer}
            onResume={handleResumeTransfer}
            onCancel={handleCancelTransfer}
            onDone={handleFinishTransfer}
          />
        )}
      </main>

      {/* System Specs & SDK Modal */}
      {isSpecsOpen && (
        <SystemSpecsModal onClose={() => setIsSpecsOpen(false)} />
      )}

      {/* Native Kotlin & APK Package Modal */}
      {isKotlinModalOpen && (
        <KotlinApkModal onClose={() => setIsKotlinModalOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
