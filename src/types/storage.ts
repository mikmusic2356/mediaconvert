import { FileCategory, ToolType } from './tools';

export interface SavedFileItem {
  id: string; // Unique identifier
  name: string;
  originalSize: number;
  resultSize: number;
  category: FileCategory;
  format: string;
  action: ToolType;
  savedAt: string;
  blobUrl?: string;
  blob?: Blob;
  shareId?: string;
  expiresAt?: string;
  downloadsCount: number;
}

export interface SharedFileMetadata {
  id: string;
  name: string;
  size: number;
  format: string;
  category: FileCategory;
  url?: string;
}

export interface ShareData {
  shareId: string; // Unique share identifier (e.g. 'af_9b8f2d')
  title: string;
  fileCount: number;
  totalSize: number;
  createdAt: string;
  expiresInDays: number;
  files: SharedFileMetadata[];
  isPasswordProtected?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  isLoggedIn: boolean;
  plan: 'free' | 'pro';
  storageUsedBytes: number;
  storageLimitBytes: number;
}

export interface IStorageService {
  getSavedFiles(): SavedFileItem[];
  saveFile(item: Omit<SavedFileItem, 'id' | 'savedAt' | 'downloadsCount'>): SavedFileItem;
  getFileById(id: string): SavedFileItem | undefined;
  removeFile(id: string): void;
  getUserProfile(): UserProfile;
  updateUserProfile(profile: Partial<UserProfile>): UserProfile;
}

export interface IShareService {
  createShare(files: SharedFileMetadata[], title?: string, expiresInDays?: number): ShareData;
  getShare(shareId: string): ShareData | null;
  getShareUrl(shareId: string): string;
}
