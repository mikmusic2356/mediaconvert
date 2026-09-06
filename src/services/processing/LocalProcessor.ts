import { 
  IProcessor, 
  ProcessingOptions, 
  ProcessingResult, 
  ToolType, 
  ProgressCallback 
} from '../../types';
import { processImageLocal } from './processors/imageProcessor';
import { processDocumentLocal } from './processors/documentProcessor';
import { processAudioToWavLocal } from './processors/audioProcessor';
import { processArchiveLocal } from './processors/archiveProcessor';
import { processVideoLocal } from './processors/videoProcessor';

export class LocalProcessor implements IProcessor {
  name = 'LocalBrowserProcessor';
  supportedFormats = ['JPG', 'JPEG', 'PNG', 'WEBP', 'AVIF', 'BMP', 'SVG', 'CSV', 'JSON', 'MD', 'HTML', 'TXT', 'WAV', 'ZIP', 'MP4', 'WEBM', 'MOV', 'AVI', 'MKV'];

  canHandle(file: File, targetFormat: string, actionType: ToolType): boolean {
    const ext = file.name.split('.').pop()?.toUpperCase() || '';
    const target = targetFormat.toUpperCase();
    const mime = file.type.toLowerCase();

    // 1. Image operations
    const isSourceImage = mime.startsWith('image/') || ['JPG', 'JPEG', 'PNG', 'WEBP', 'SVG', 'GIF', 'AVIF', 'BMP', 'ICO'].includes(ext);
    const isTargetImage = ['JPG', 'JPEG', 'PNG', 'WEBP', 'AVIF', 'BMP'].includes(target);
    if (isSourceImage && isTargetImage) return true;

    // 2. Video compression
    const isSourceVideo = mime.startsWith('video/') || ['MP4', 'WEBM', 'MOV', 'AVI', 'MKV', 'FLV'].includes(ext);
    if (isSourceVideo && actionType === 'compress') return true;

    // 3. Structured text / Data operations
    if (
      (ext === 'CSV' && target === 'JSON') ||
      (ext === 'JSON' && target === 'CSV') ||
      (ext === 'MD' && target === 'HTML') ||
      (['TXT', 'MD'].includes(ext) && ['TXT', 'MD'].includes(target))
    ) {
      return true;
    }

    // 4. Audio conversion to WAV
    if ((mime.startsWith('audio/') || ['MP3', 'OGG', 'WAV', 'AAC', 'M4A', 'FLAC'].includes(ext)) && target === 'WAV') {
      return true;
    }

    // 5. Archive packaging / ZIP compression
    if (target === 'ZIP' || actionType === 'compress') {
      return true;
    }

    return false;
  }

  async process(
    file: File,
    targetFormat: string,
    options: ProcessingOptions,
    actionType: ToolType,
    onProgress: ProgressCallback
  ): Promise<ProcessingResult> {
    const ext = file.name.split('.').pop()?.toUpperCase() || '';
    const target = targetFormat.toUpperCase();
    const mime = file.type.toLowerCase();

    // Video compression branch
    if (
      (mime.startsWith('video/') || ['MP4', 'WEBM', 'MOV', 'AVI', 'MKV', 'FLV'].includes(ext)) &&
      actionType === 'compress'
    ) {
      return await processVideoLocal(file, targetFormat, options, actionType, onProgress);
    }

    // Image branch
    if (
      mime.startsWith('image/') ||
      ['JPG', 'JPEG', 'PNG', 'WEBP', 'SVG', 'GIF', 'AVIF', 'BMP', 'ICO'].includes(ext)
    ) {
      return await processImageLocal(file, targetFormat, options, actionType, onProgress);
    }

    // Document branch
    if (
      ['CSV', 'JSON', 'MD', 'HTML', 'TXT'].includes(ext) ||
      mime.includes('json') ||
      mime.includes('csv') ||
      mime.includes('text')
    ) {
      return await processDocumentLocal(file, targetFormat, options, actionType, onProgress);
    }

    // Audio to WAV branch
    if (
      (mime.startsWith('audio/') || ['MP3', 'OGG', 'WAV', 'AAC', 'M4A', 'FLAC', 'MP4', 'WEBM'].includes(ext)) &&
      target === 'WAV'
    ) {
      return await processAudioToWavLocal(file, onProgress);
    }

    // ZIP compression / packaging branch
    if (target === 'ZIP' || actionType === 'compress') {
      return await processArchiveLocal(file, targetFormat, options, actionType, onProgress);
    }

    throw new Error(
      `El motor local no admite la conversión de .${ext} a ${targetFormat}. Se requiere infraestructura de servidor.`
    );
  }
}
