import { ShareFile } from '../types';

// Built-in high-quality demo files with rich document and photo previews
export const SAMPLE_FILES: ShareFile[] = [
  {
    id: 'sample-photo-1',
    name: 'SonSkr_Mountain_Sunset_RAW.jpg',
    size: 28_400_000, // 28.4 MB
    category: 'photo',
    mimeType: 'image/jpeg',
    dimensions: { width: 4032, height: 3024 },
    dateModified: Date.now() - 3600000 * 2,
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ff7e5f"/><stop offset="50%" stop-color="%23feb47b"/><stop offset="100%" stop-color="%236a11cb"/></linearGradient><linearGradient id="m" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="800" height="600" fill="url(%23g)"/><circle cx="620" cy="180" r="70" fill="%23fff" opacity="0.85"/><polygon points="0,600 240,320 480,600" fill="url(%23m)" opacity="0.95"/><polygon points="320,600 580,260 800,600" fill="url(%23m)"/><polygon points="120,600 360,390 600,600" fill="%23334155" opacity="0.8"/><text x="40" y="550" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="28">SonShare 4K HDR Camera Capture (4032x3024)</text></svg>',
  },
  {
    id: 'sample-doc-1',
    name: 'SonShare_Wi-Fi_Direct_Whitepaper_v2.pdf',
    size: 14_850_000, // 14.85 MB
    category: 'document',
    mimeType: 'application/pdf',
    pageCount: 32,
    dateModified: Date.now() - 3600000 * 5,
    textSnippet: 'SonShare P2P Protocol Specification (Author: Son Skr)\nSection 1: Zero-Config Wi-Fi Direct (IEEE 802.11ax/ac P2P Group Negotiation)\nSection 2: Bluetooth LE 5.4 Coded PHY Discovery Beacon Format\nSection 3: Min SDK 28 Scoped Storage and Encrypted Chunk Transmission (AES-GCM-256)\nSection 4: Throughput Benchmarks across 5 GHz (80/160MHz) and 2.4 GHz BSSID topologies.',
  },
  {
    id: 'sample-photo-2',
    name: 'Architectural_Blueprint_SonSkr.png',
    size: 42_200_000, // 42.2 MB
    category: 'photo',
    mimeType: 'image/png',
    dimensions: { width: 5120, height: 2880 },
    dateModified: Date.now() - 86400000,
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="%230c4a6e"/><path d="M0 50 h800 M0 100 h800 M0 150 h800 M0 200 h800 M0 250 h800 M0 300 h800 M0 350 h800 M0 400 h800" stroke="%2338bdf8" stroke-width="0.8" opacity="0.3"/><path d="M50 0 v450 M100 0 v450 M150 0 v450 M200 0 v450 M250 0 v450 M300 0 v450 M350 0 v450 M400 0 v450 M450 0 v450 M500 0 v450 M550 0 v450 M600 0 v450 M650 0 v450 M700 0 v450 M750 0 v450" stroke="%2338bdf8" stroke-width="0.8" opacity="0.3"/><rect x="120" y="90" width="560" height="260" rx="16" fill="none" stroke="%23bae6fd" stroke-width="3"/><circle cx="280" cy="220" r="70" fill="none" stroke="%2338bdf8" stroke-width="2"/><text x="150" y="140" fill="%23f0f9ff" font-family="monospace" font-size="20">SCHEMATIC: SONSHARE P2P DUAL-BAND ENGINE</text><text x="150" y="180" fill="%237dd3fc" font-family="monospace" font-size="14">WIFI-DIRECT 5GHz + BLE BEACON BROADCASTER</text><text x="150" y="320" fill="%2338bdf8" font-family="monospace" font-size="13">DESIGNED BY SON SKR - MIN SDK 28 READY</text></svg>',
  },
  {
    id: 'sample-apk-1',
    name: 'SonShare_Android_Universal_v3.4.apk',
    size: 68_500_000, // 68.5 MB
    category: 'apk',
    mimeType: 'application/vnd.android.package-archive',
    dateModified: Date.now() - 3600000 * 24,
    textSnippet: 'Package: com.sonskr.sonshare\nMin SDK: 28 (Android 9 Pie)\nTarget SDK: 35 (Android 15+)\nPermissions: NEARBY_WIFI_DEVICES, BLUETOOTH_SCAN, BLUETOOTH_ADVERTISE\nArchitecture: arm64-v8a, armeabi-v7a, x86_64',
  },
  {
    id: 'sample-doc-2',
    name: 'Financial_Quarterly_Report_2026.xlsx',
    size: 8_200_000, // 8.2 MB
    category: 'document',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pageCount: 14,
    dateModified: Date.now() - 3600000 * 12,
    textSnippet: 'Sheet 1: Transfer Speed Benchmarks across 5GHz vs 2.4GHz\nAverage 5GHz Speed: 84.6 MB/s (676.8 Mbps)\nAverage 2.4GHz Speed: 18.2 MB/s (145.6 Mbps)\nPacket Loss: 0.0001% over 100,000 P2P frames\nAudited by: Son Skr Engineering Group',
  },
];

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatSpeed(bytesPerSec: number): { value: string; unit: string } {
  if (bytesPerSec <= 0) return { value: '0.0', unit: 'KB/s' };
  if (bytesPerSec < 1024 * 1024) {
    return {
      value: (bytesPerSec / 1024).toFixed(1),
      unit: 'KB/s',
    };
  }
  return {
    value: (bytesPerSec / (1024 * 1024)).toFixed(1),
    unit: 'MB/s',
  };
}

export function formatEta(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--';
  if (seconds < 1) return '< 1s';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hours}h ${remMins}m`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getFileCategory(file: File): { category: 'photo' | 'document' | 'video' | 'audio' | 'apk' | 'archive' | 'other'; mimeType: string } {
  const mime = file.type || '';
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'svg', 'bmp'].includes(ext)) {
    return { category: 'photo', mimeType: mime || 'image/jpeg' };
  }
  if (mime.startsWith('video/') || ['mp4', 'mov', 'mkv', 'webm', 'avi'].includes(ext)) {
    return { category: 'video', mimeType: mime || 'video/mp4' };
  }
  if (mime.startsWith('audio/') || ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(ext)) {
    return { category: 'audio', mimeType: mime || 'audio/mpeg' };
  }
  if (['apk', 'xapk', 'aab'].includes(ext)) {
    return { category: 'apk', mimeType: 'application/vnd.android.package-archive' };
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return { category: 'archive', mimeType: mime || 'application/zip' };
  }
  if (
    mime.includes('pdf') ||
    mime.includes('word') ||
    mime.includes('document') ||
    mime.includes('sheet') ||
    mime.includes('presentation') ||
    ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md', 'csv'].includes(ext)
  ) {
    return { category: 'document', mimeType: mime || 'application/pdf' };
  }

  return { category: 'other', mimeType: mime || 'application/octet-stream' };
}
