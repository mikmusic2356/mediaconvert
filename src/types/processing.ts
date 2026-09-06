import { FileCategory, ToolType, ProcessingType, ToolImplementationStatus } from './tools';

export type ProcessingStatus = 'idle' | 'analyzing' | 'processing' | 'completed' | 'error' | 'unsupported';

export interface ProcessingOptions {
  // Image & General
  quality: number; // 10 - 100
  resizeMode: 'original' | 'percentage' | 'custom';
  resizePercentage?: number;
  customWidth?: number;
  customHeight?: number;
  maintainAspectRatio?: boolean;
  grayscale?: boolean;
  invertColors?: boolean;
  
  // Document / Text
  csvDelimiter?: string;
  indentJson?: boolean;
  
  // Audio / Video
  audioBitrate?: string;
  videoResolution?: string;
  
  // Compression
  compressionLevel?: 'low' | 'balanced' | 'maximum';
}

export interface QueuedFile {
  id: string; // Unique identifier for the file item
  file: File;
  name: string;
  size: number;
  type: string;
  category: FileCategory;
  extension: string;
  previewUrl?: string;
  
  // Desired operation
  actionType: ToolType;
  targetFormat: string;
  options: ProcessingOptions;
  
  // Execution status
  status: ProcessingStatus;
  progress: number; // 0 to 100
  statusMessage?: string;
  
  // Result with unique result ID
  resultId?: string;
  resultBlob?: Blob;
  resultUrl?: string;
  resultSize?: number;
  resultName?: string;
  savingsPercentage?: number;
  processedAt?: number;
  processingTypeUsed?: ProcessingType;
  errorMessage?: string;
}

export interface ProcessingResult {
  id: string;
  blob: Blob;
  filename: string;
  size: number;
  targetFormat: string;
  savingsPercentage?: number;
  processingType: ProcessingType;
  processedAt: number;
}

export type ProgressCallback = (progress: number, message: string) => void;

export interface IProcessor {
  name: string;
  supportedFormats: string[];
  canHandle(file: File, targetFormat: string, actionType: ToolType): boolean;
  process(
    file: File, 
    targetFormat: string, 
    options: ProcessingOptions, 
    actionType: ToolType, 
    onProgress: ProgressCallback
  ): Promise<ProcessingResult>;
}
