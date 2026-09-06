import { SavedFileItem, ShareData, UserProfile } from '../types';
import { storageService } from './storage/StorageService';
import { shareService } from './sharing/ShareService';

export function getSavedFiles(): SavedFileItem[] {
  return storageService.getSavedFiles();
}

export function saveFileToLibrary(item: Omit<SavedFileItem, 'id' | 'savedAt' | 'downloadsCount'> & { id?: string }): SavedFileItem {
  return storageService.saveFile(item);
}

export function removeSavedFile(id: string): void {
  storageService.removeFile(id);
}

export function createShareLink(
  title: string,
  files: { id: string; name: string; size: number; format: string; category: any; url?: string }[],
  expiresInDays: number = 7
): ShareData {
  return shareService.createShare(files, title, expiresInDays);
}

export function getShareData(shareId: string): ShareData | null {
  return shareService.getShare(shareId);
}

export function getUserProfile(): UserProfile {
  return storageService.getUserProfile();
}

export function updateUserProfile(profile: Partial<UserProfile>): UserProfile {
  return storageService.updateUserProfile(profile);
}
