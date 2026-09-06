import { ProcessingOptions, ProcessingResult, ToolType, ProgressCallback } from '../../../types';

export async function processArchiveLocal(
  file: File,
  _targetFormat: string,
  options: ProcessingOptions,
  _actionType: ToolType,
  onProgress: ProgressCallback
): Promise<ProcessingResult> {
  onProgress(20, 'Cargando motor de compresión DEFLATE en memoria...');
  
  // Lazy loading JSZip engine on demand
  const { default: JSZip } = await import('jszip');
  
  onProgress(45, `Empaquetando y comprimiendo ${file.name}...`);
  const zip = new JSZip();
  zip.file(file.name, file);

  const compressionLevel = options.compressionLevel === 'maximum' ? 9 : options.compressionLevel === 'low' ? 1 : 6;

  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: compressionLevel },
    },
    (metadata) => {
      onProgress(
        Math.round(45 + metadata.percent * 0.5),
        `Comprimiendo: ${Math.round(metadata.percent)}%`
      );
    }
  );

  const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const savings = file.size > 0 ? Math.round(((file.size - zipBlob.size) / file.size) * 100) : 0;
  const uniqueId = 'res_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();

  return {
    id: uniqueId,
    blob: zipBlob,
    filename: `${baseName}.zip`,
    size: zipBlob.size,
    targetFormat: 'ZIP',
    savingsPercentage: savings,
    processingType: 'local',
    processedAt: Date.now(),
  };
}

export async function createBatchZipArchive(
  files: { blob: Blob; name: string }[],
  onProgress?: ProgressCallback
): Promise<Blob> {
  if (onProgress) onProgress(20, 'Iniciando empaquetador ZIP por lotes...');
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  files.forEach((f) => {
    zip.file(f.name, f.blob);
  });

  return await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' }, (metadata) => {
    if (onProgress) {
      onProgress(Math.round(20 + metadata.percent * 0.75), `Empaquetando ZIP: ${Math.round(metadata.percent)}%`);
    }
  });
}
