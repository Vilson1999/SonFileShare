import { NearbyPeer, ShareFile, TransferItem, TransferMode, TransferSession, TransferHistoryRecord } from '../types';

export const DEFAULT_NEARBY_PEERS: NearbyPeer[] = [
  {
    id: 'peer-s24-ultra',
    name: 'Son Galaxy S24 Ultra',
    deviceModel: 'Samsung SM-S928B (Android 15)',
    deviceType: 'android',
    avatarColor: '#006874',
    signalStrength: 4,
    preferredMode: 'wifi-5ghz',
    supportedModes: ['wifi-5ghz', 'wifi-2.4ghz', 'bluetooth'],
    ipAddress: '192.168.49.12',
    isOnline: true,
  },
  {
    id: 'peer-pixel-9',
    name: "Pixel 9 Pro (Son Skr's Lab)",
    deviceModel: 'Google Tensor G4 (Android 16)',
    deviceType: 'android',
    avatarColor: '#006d39',
    signalStrength: 4,
    preferredMode: 'wifi-5ghz',
    supportedModes: ['wifi-5ghz', 'wifi-2.4ghz', 'bluetooth'],
    ipAddress: '192.168.49.25',
    isOnline: true,
  },
  {
    id: 'peer-oneplus-12',
    name: 'OnePlus 12 5G (Direct)',
    deviceModel: 'OnePlus CPH2573',
    deviceType: 'android',
    avatarColor: '#8c5000',
    signalStrength: 3,
    preferredMode: 'wifi-5ghz',
    supportedModes: ['wifi-5ghz', 'wifi-2.4ghz', 'bluetooth'],
    ipAddress: '192.168.49.77',
    isOnline: true,
  },
  {
    id: 'peer-macbook-pro',
    name: "Son Skr's MacBook (SonShare Web)",
    deviceModel: 'Apple Silicon M3 Max',
    deviceType: 'mac',
    avatarColor: '#5954a8',
    signalStrength: 3,
    preferredMode: 'wifi-5ghz',
    supportedModes: ['wifi-5ghz', 'wifi-2.4ghz', 'bluetooth'],
    ipAddress: '192.168.1.140',
    isOnline: true,
  },
  {
    id: 'peer-ble-tracker',
    name: 'BT-LE Device (Nearby)',
    deviceModel: 'Generic Bluetooth 5.4 Peripheral',
    deviceType: 'android',
    avatarColor: '#475569',
    signalStrength: 2,
    preferredMode: 'bluetooth',
    supportedModes: ['bluetooth'],
    isOnline: true,
  },
];

// Speed profile bounds (Bytes per second)
export const SPEED_PROFILES: Record<TransferMode, { min: number; max: number; label: string }> = {
  'wifi-5ghz': {
    min: 58 * 1024 * 1024, // ~58 MB/s
    max: 96 * 1024 * 1024, // ~96 MB/s (approx 800 Mbps)
    label: '5 GHz Wi-Fi Direct (High-Speed)',
  },
  'wifi-2.4ghz': {
    min: 14 * 1024 * 1024, // ~14 MB/s
    max: 26 * 1024 * 1024, // ~26 MB/s
    label: '2.4 GHz Wi-Fi Direct (Standard)',
  },
  'bluetooth': {
    min: 1.2 * 1024 * 1024, // ~1.2 MB/s
    max: 2.8 * 1024 * 1024, // ~2.8 MB/s
    label: 'Bluetooth 5.4 LE Coded (Offline)',
  },
};

export class P2PTransferManager {
  private activeSession: TransferSession | null = null;
  private intervalId: number | null = null;
  private onUpdateCallback: ((session: TransferSession) => void) | null = null;
  private onCompleteCallback: ((records: TransferHistoryRecord[]) => void) | null = null;
  private channel: BroadcastChannel | null = null;
  private localPeerId: string;

  constructor(localPeerName: string) {
    this.localPeerId = 'local-' + Math.random().toString(36).substring(2, 9);
    try {
      this.channel = new BroadcastChannel('sonshare_p2p_channel');
      this.channel.onmessage = this.handleBroadcastMessage.bind(this);
    } catch {
      // Fallback if BroadcastChannel is not supported in environment
    }
  }

  private handleBroadcastMessage(event: MessageEvent) {
    // Allows multi-tab offline testing between two SonShare tabs on the same computer or phone
    const data = event.data;
    if (!data || data.senderId === this.localPeerId) return;

    if (data.type === 'PING_ANNOUNCE') {
      this.channel?.postMessage({
        type: 'PONG_PEER',
        senderId: this.localPeerId,
        peer: {
          id: data.senderId,
          name: data.senderName,
          deviceModel: 'Web Peer (Live Tab)',
          deviceType: 'android',
          avatarColor: '#006874',
          signalStrength: 4,
          preferredMode: 'wifi-5ghz',
          supportedModes: ['wifi-5ghz', 'wifi-2.4ghz', 'bluetooth'],
          isOnline: true,
          isRealLocalPeer: true,
        },
      });
    }
  }

  public getActiveSession(): TransferSession | null {
    return this.activeSession;
  }

  public startTransfer(
    files: ShareFile[],
    peer: NearbyPeer,
    mode: TransferMode,
    direction: 'send' | 'receive' = 'send',
    onUpdate: (session: TransferSession) => void,
    onComplete: (records: TransferHistoryRecord[]) => void
  ): TransferSession {
    this.stopTransfer();

    this.onUpdateCallback = onUpdate;
    this.onCompleteCallback = onComplete;

    const totalBytes = files.reduce((acc, f) => acc + f.size, 0);

    const items: TransferItem[] = files.map((file, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      file,
      status: idx === 0 ? 'transferring' : 'queued',
      progress: 0,
      transferredBytes: 0,
      speedBytesPerSec: 0,
      etaSeconds: 0,
    }));

    const session: TransferSession = {
      id: `session-${Date.now()}`,
      direction,
      peer,
      connectionMode: mode,
      items,
      status: 'transferring',
      currentSpeed: 0,
      peakSpeed: 0,
      totalBytes,
      transferredBytes: 0,
      startTime: Date.now(),
    };

    this.activeSession = session;
    this.runTransferLoop();

    this.onUpdateCallback(this.activeSession);
    return session;
  }

  private runTransferLoop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    const TICK_INTERVAL_MS = 120; // 120ms tick for fluid speedometer and smooth progress bar

    this.intervalId = window.setInterval(() => {
      if (!this.activeSession || this.activeSession.status !== 'transferring') {
        return;
      }

      const mode = this.activeSession.connectionMode;
      const profile = SPEED_PROFILES[mode] || SPEED_PROFILES['wifi-5ghz'];

      // Realistic speed variation with slight organic jitter
      const targetSpeed = profile.min + Math.random() * (profile.max - profile.min);
      const prevSpeed = this.activeSession.currentSpeed || profile.min;
      // Exponential moving average for natural needle movement on speedometer
      const instantSpeed = prevSpeed * 0.7 + targetSpeed * 0.3;

      const bytesThisTick = Math.floor(instantSpeed * (TICK_INTERVAL_MS / 1000));

      let pendingChunk = bytesThisTick;
      let allDone = true;

      const updatedItems = this.activeSession.items.map((item) => {
        if (item.status === 'completed') {
          return item;
        }

        allDone = false;

        if (item.status === 'queued') {
          // If no active item, activate next in line
          return { ...item, status: 'transferring' as const };
        }

        if (item.status === 'transferring') {
          const newTransferred = Math.min(item.file.size, item.transferredBytes + pendingChunk);
          const itemRemainingBytes = item.file.size - newTransferred;
          pendingChunk = Math.max(0, pendingChunk - (newTransferred - item.transferredBytes));

          const progress = Math.min(100, (newTransferred / item.file.size) * 100);
          const isItemDone = newTransferred >= item.file.size;
          const eta = instantSpeed > 0 ? Math.ceil(itemRemainingBytes / instantSpeed) : 0;

          return {
            ...item,
            transferredBytes: newTransferred,
            progress: parseFloat(progress.toFixed(1)),
            speedBytesPerSec: instantSpeed,
            etaSeconds: eta,
            status: isItemDone ? ('completed' as const) : ('transferring' as const),
          };
        }

        return item;
      });

      const totalTransferred = updatedItems.reduce((acc, it) => acc + it.transferredBytes, 0);
      const remainingTotalBytes = Math.max(0, this.activeSession.totalBytes - totalTransferred);
      const overallEta = instantSpeed > 0 ? Math.ceil(remainingTotalBytes / instantSpeed) : 0;

      const updatedSession: TransferSession = {
        ...this.activeSession,
        items: updatedItems,
        currentSpeed: instantSpeed,
        peakSpeed: Math.max(this.activeSession.peakSpeed, instantSpeed),
        transferredBytes: totalTransferred,
      };

      this.activeSession = updatedSession;
      this.onUpdateCallback?.(updatedSession);

      // Check if all items completed
      const checkAllCompleted = updatedItems.every((it) => it.status === 'completed');
      if (checkAllCompleted) {
        this.finishTransfer(updatedSession);
      }
    }, TICK_INTERVAL_MS);
  }

  private finishTransfer(session: TransferSession) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    const duration = Math.max(1, (Date.now() - session.startTime) / 1000);
    const avgSpeed = session.totalBytes / duration;

    const completedSession: TransferSession = {
      ...session,
      status: 'completed',
      currentSpeed: 0,
      endTime: Date.now(),
    };
    this.activeSession = completedSession;
    this.onUpdateCallback?.(completedSession);

    // Build history records
    const records: TransferHistoryRecord[] = session.items.map((item) => ({
      id: `hist-${Date.now()}-${item.id}`,
      fileName: item.file.name,
      fileSize: item.file.size,
      category: item.file.category,
      direction: session.direction,
      peerName: session.peer.name,
      mode: session.connectionMode,
      completedAt: Date.now(),
      durationSeconds: Math.ceil(duration),
      averageSpeedBytesPerSec: avgSpeed,
      blobUrl: item.file.previewUrl,
    }));

    this.onCompleteCallback?.(records);
  }

  public pauseTransfer() {
    if (!this.activeSession || this.activeSession.status !== 'transferring') return;
    this.activeSession = {
      ...this.activeSession,
      status: 'paused',
      currentSpeed: 0,
      items: this.activeSession.items.map((item) =>
        item.status === 'transferring' ? { ...item, status: 'paused' as const, speedBytesPerSec: 0 } : item
      ),
    };
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.onUpdateCallback?.(this.activeSession);
  }

  public resumeTransfer() {
    if (!this.activeSession || this.activeSession.status !== 'paused') return;
    this.activeSession = {
      ...this.activeSession,
      status: 'transferring',
      items: this.activeSession.items.map((item) =>
        item.status === 'paused' ? { ...item, status: 'transferring' as const } : item
      ),
    };
    this.runTransferLoop();
    this.onUpdateCallback?.(this.activeSession);
  }

  public cancelTransfer() {
    if (!this.activeSession) return;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.activeSession = {
      ...this.activeSession,
      status: 'cancelled',
      currentSpeed: 0,
      items: this.activeSession.items.map((item) =>
        item.status === 'transferring' || item.status === 'paused'
          ? { ...item, status: 'cancelled' as const, speedBytesPerSec: 0 }
          : item
      ),
    };
    this.onUpdateCallback?.(this.activeSession);
  }

  public stopTransfer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.activeSession = null;
  }
}
