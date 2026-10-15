export type TransferMode = 'wifi-5ghz' | 'wifi-2.4ghz' | 'bluetooth';

export type FileCategory = 'photo' | 'document' | 'video' | 'audio' | 'apk' | 'archive' | 'other';

export interface ShareFile {
  id: string;
  name: string;
  size: number;
  category: FileCategory;
  mimeType: string;
  fileObject?: File;
  previewUrl?: string;
  textSnippet?: string;
  dimensions?: { width: number; height: number };
  pageCount?: number;
  dateModified: number;
}

export type TransferStatus = 'queued' | 'transferring' | 'paused' | 'completed' | 'cancelled' | 'error';

export interface TransferItem {
  id: string;
  file: ShareFile;
  status: TransferStatus;
  progress: number; // 0 to 100
  transferredBytes: number;
  speedBytesPerSec: number;
  etaSeconds: number;
  error?: string;
}

export interface NearbyPeer {
  id: string;
  name: string;
  deviceModel: string;
  deviceType: 'android' | 'ios' | 'windows' | 'mac' | 'linux';
  avatarColor: string;
  signalStrength: number; // 1 to 4 bars
  preferredMode: TransferMode;
  supportedModes: TransferMode[];
  ipAddress?: string;
  isOnline: boolean;
  isRealLocalPeer?: boolean;
}

export interface TransferSession {
  id: string;
  direction: 'send' | 'receive';
  peer: NearbyPeer;
  connectionMode: TransferMode;
  items: TransferItem[];
  status: 'connecting' | 'transferring' | 'paused' | 'completed' | 'cancelled';
  currentSpeed: number; // bytes/sec
  peakSpeed: number;
  totalBytes: number;
  transferredBytes: number;
  startTime: number;
  endTime?: number;
}

export interface TransferHistoryRecord {
  id: string;
  fileName: string;
  fileSize: number;
  category: FileCategory;
  direction: 'send' | 'receive';
  peerName: string;
  mode: TransferMode;
  completedAt: number;
  durationSeconds: number;
  averageSpeedBytesPerSec: number;
  blobUrl?: string;
}

export interface MaterialThemeColor {
  name: string;
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  surface: string;
  surfaceContainer: string;
  accent: string;
}
