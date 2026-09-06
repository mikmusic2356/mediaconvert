import { IShareService, ShareData, SharedFileMetadata } from '../../types';

const STORAGE_KEY_SHARES = 'mediaconvert_shares_v2';

export class ShareService implements IShareService {
  createShare(
    files: SharedFileMetadata[],
    title?: string,
    expiresInDays: number = 7,
    isPasswordProtected: boolean = false
  ): ShareData {
    // Unique share identifier
    const shareId = 'af_' + Math.random().toString(36).substring(2, 9);
    const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0);

    const shareData: ShareData = {
      shareId,
      title: title || (files.length === 1 ? files[0].name : `Colección de ${files.length} archivos`),
      fileCount: files.length,
      totalSize,
      createdAt: new Date().toISOString(),
      expiresInDays,
      files,
      isPasswordProtected,
    };

    try {
      const raw = localStorage.getItem(STORAGE_KEY_SHARES);
      const shares: ShareData[] = raw ? JSON.parse(raw) : [];
      shares.unshift(shareData);
      // Keep up to 50 active shares in local cache
      localStorage.setItem(STORAGE_KEY_SHARES, JSON.stringify(shares.slice(0, 50)));
    } catch (e) {
      console.error('Error al guardar enlace compartido', e);
    }

    return shareData;
  }

  getShare(shareId: string): ShareData | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SHARES);
      if (!raw) return null;
      const shares: ShareData[] = JSON.parse(raw);
      const found = shares.find((s) => s.shareId === shareId);
      if (!found) return null;

      // Check expiration
      const createdDate = new Date(found.createdAt).getTime();
      const expiresMs = found.expiresInDays * 24 * 60 * 60 * 1000;
      if (Date.now() > createdDate + expiresMs) {
        return null; // Expired
      }

      return found;
    } catch (e) {
      console.error('Error al recuperar share', e);
      return null;
    }
  }

  getShareUrl(shareId: string): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mediaconvert.io';
    return `${origin}/share/${shareId}`;
  }
}

export const shareService = new ShareService();
