import { IStorageService, SavedFileItem, UserProfile } from '../../types';

const STORAGE_KEY_FILES = 'mediaconvert_saved_files_v2';
const STORAGE_KEY_USER = 'mediaconvert_user_v2';

// In-memory runtime map for active Blobs during the user session
const sessionBlobMap = new Map<string, Blob>();

export class StorageService implements IStorageService {
  getSavedFiles(): SavedFileItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_FILES);
      if (!raw) return [];
      const parsed: SavedFileItem[] = JSON.parse(raw);
      
      // Reattach in-memory session blobs if available
      return parsed.map(item => {
        if (sessionBlobMap.has(item.id)) {
          const blob = sessionBlobMap.get(item.id);
          return {
            ...item,
            blob,
            blobUrl: blob ? URL.createObjectURL(blob) : item.blobUrl
          };
        }
        return item;
      });
    } catch (e) {
      console.error('Error al cargar archivos guardados desde storage', e);
      return [];
    }
  }

  saveFile(item: Omit<SavedFileItem, 'id' | 'savedAt' | 'downloadsCount'> & { id?: string }): SavedFileItem {
    const current = this.getSavedFiles();
    const id = item.id || ('file_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now());

    if (item.blob) {
      sessionBlobMap.set(id, item.blob);
    }

    const newItem: SavedFileItem = {
      ...item,
      id,
      savedAt: new Date().toISOString(),
      downloadsCount: 0,
    };

    const updated = [newItem, ...current.filter(f => f.id !== id)];

    try {
      // Store metadata in localStorage without heavy raw blob objects to prevent quota errors
      const metaOnly = updated.map(({ blob, ...rest }) => rest);
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(metaOnly));
    } catch (e) {
      console.warn('Límite de LocalStorage alcanzado; recortando entradas antiguas', e);
      const trimmed = updated.slice(0, 30).map(({ blob, ...rest }) => rest);
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(trimmed));
    }

    return newItem;
  }

  getFileById(id: string): SavedFileItem | undefined {
    const files = this.getSavedFiles();
    return files.find(f => f.id === id);
  }

  removeFile(id: string): void {
    const current = this.getSavedFiles();
    const filtered = current.filter(f => f.id !== id);
    sessionBlobMap.delete(id);
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(filtered.map(({ blob, ...rest }) => rest)));
  }

  getUserProfile(): UserProfile {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USER);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    const defaultUser: UserProfile = {
      name: 'Usuario MediaConvert',
      email: 'usuario@mediaconvert.online',
      isLoggedIn: false,
      plan: 'free',
      storageUsedBytes: 24500000, // ~24.5 MB
      storageLimitBytes: 5 * 1024 * 1024 * 1024, // 5 GB
    };
    return defaultUser;
  }

  updateUserProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    return updated;
  }
}

export const storageService = new StorageService();
