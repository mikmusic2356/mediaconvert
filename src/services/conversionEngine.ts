import { QueuedFile, FileCategory, ToolType, ToolConfig } from '../types';
import { processingService } from './processing/ProcessingService';
import { createBatchZipArchive } from './processing/processors/archiveProcessor';

export function detectFileCategory(file: File): { category: FileCategory; extension: string } {
  const ext = file.name.split('.').pop()?.toUpperCase() || '';
  const mime = file.type.toLowerCase();

  if (mime.startsWith('image/') || ['JPG', 'JPEG', 'PNG', 'WEBP', 'SVG', 'GIF', 'AVIF', 'BMP', 'ICO'].includes(ext)) {
    return { category: 'image', extension: ext || 'PNG' };
  }
  if (mime.startsWith('audio/') || ['MP3', 'WAV', 'OGG', 'AAC', 'M4A', 'FLAC', 'WMA'].includes(ext)) {
    return { category: 'audio', extension: ext || 'MP3' };
  }
  if (mime.startsWith('video/') || ['MP4', 'WEBM', 'MOV', 'MKV', 'AVI', 'FLV'].includes(ext)) {
    return { category: 'video', extension: ext || 'MP4' };
  }
  if (['ZIP', 'TAR', 'GZ', '7Z', 'RAR'].includes(ext) || mime.includes('zip') || mime.includes('compressed')) {
    return { category: 'archive', extension: ext || 'ZIP' };
  }
  return { category: 'document', extension: ext || 'TXT' };
}

export function getDefaultTargetFormat(category: FileCategory, currentExt: string, actionType: ToolType): string {
  const norm = currentExt.toUpperCase();
  if (actionType === 'compress') {
    return norm;
  }

  switch (category) {
    case 'image':
      if (norm === 'PNG') return 'WEBP';
      if (norm === 'JPG' || norm === 'JPEG') return 'PNG';
      if (norm === 'WEBP') return 'JPG';
      if (norm === 'SVG') return 'PNG';
      return 'WEBP';
    case 'document':
      if (norm === 'CSV') return 'JSON';
      if (norm === 'JSON') return 'CSV';
      if (norm === 'MD') return 'HTML';
      if (norm === 'TXT') return 'MD';
      return 'JSON';
    case 'audio':
      if (norm === 'MP3') return 'WAV';
      return 'WAV';
    case 'video':
      if (norm === 'MOV') return 'MP4';
      if (norm === 'MP4') return 'GIF';
      return 'MP4';
    case 'archive':
      return 'ZIP';
    default:
      return 'TXT';
  }
}

export function getAvailableTargetFormats(category: FileCategory, currentExt: string): string[] {
  const ext = currentExt.toUpperCase();
  switch (category) {
    case 'image':
      return ['JPG', 'PNG', 'WEBP', 'AVIF', 'BMP'].filter((f) => f !== ext);
    case 'document':
      return ['JSON', 'CSV', 'HTML', 'TXT', 'MD'].filter((f) => f !== ext);
    case 'audio':
      return ['WAV'].filter((f) => f !== ext);
    case 'video':
      return ['WAV', 'MP4'].filter((f) => f !== ext);
    case 'archive':
      return ['ZIP'];
    default:
      return ['TXT'];
  }
}

/**
 * Main file conversion & compression coordinator (Delegates to decoupled ProcessingService)
 * REGLA ABSOLUTA: No simulaciones ficticias.
 */
export async function executeFileOperation(
  queuedFile: QueuedFile,
  onProgress: (progress: number, message: string) => void,
  toolConfig?: ToolConfig | null
): Promise<{
  resultId: string;
  resultBlob: Blob;
  resultName: string;
  resultSize: number;
  savingsPercentage?: number;
}> {
  const result = await processingService.executeQueuedFile(queuedFile, toolConfig || null, onProgress);
  return {
    resultId: result.id,
    resultBlob: result.blob,
    resultName: result.filename,
    resultSize: result.size,
    savingsPercentage: result.savingsPercentage,
  };
}

/**
 * Package multiple processed files into a single ZIP for batch download
 */
export async function createBatchZip(
  files: { blob: Blob; name: string }[],
  _zipName: string = 'MediaConvert_archivos.zip'
): Promise<Blob> {
  return await createBatchZipArchive(files);
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
