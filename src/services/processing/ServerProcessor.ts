import { 
  IProcessor, 
  ProcessingOptions, 
  ProcessingResult, 
  ToolType, 
  ProgressCallback 
} from '../../types';

export class ServerProcessor implements IProcessor {
  name = 'ServerCloudProcessor';
  supportedFormats = ['PDF', 'DOCX', 'XLSX', 'PPTX', 'MP4', 'MKV', 'AVI', 'MOV', 'WEBM', 'EPUB'];

  private serverApiEndpoint: string;

  constructor(serverApiEndpoint: string = '/api/convert') {
    this.serverApiEndpoint = serverApiEndpoint;
  }

  canHandle(file: File, targetFormat: string, _actionType: ToolType): boolean {
    const ext = file.name.split('.').pop()?.toUpperCase() || '';
    const target = targetFormat.toUpperCase();
    return this.supportedFormats.includes(ext) || this.supportedFormats.includes(target);
  }

  async process(
    file: File,
    targetFormat: string,
    _options: ProcessingOptions,
    _actionType: ToolType,
    onProgress: ProgressCallback
  ): Promise<ProcessingResult> {
    onProgress(15, 'Conectando con nodo de procesamiento en la nube...');
    
    // Check if server API route is configured
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetFormat', targetFormat);

      onProgress(35, `Enviando ${file.name} al clúster de conversión...`);

      const response = await fetch(this.serverApiEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Honest response if server pipeline is in preparation
        if (response.status === 404 || response.status === 501) {
          throw new Error(
            `El nodo de conversión en servidor para el formato ${targetFormat} se encuentra en fase de integración técnica. MediaConvert no realiza conversiones simuladas.`
          );
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error del servidor HTTP ${response.status}`);
      }

      onProgress(85, 'Recibiendo archivo transformado...');
      const blob = await response.blob();
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const uniqueId = 'res_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();

      onProgress(100, 'Procesamiento en servidor completado');

      return {
        id: uniqueId,
        blob,
        filename: `${baseName}.${targetFormat.toLowerCase()}`,
        size: blob.size,
        targetFormat: targetFormat.toUpperCase(),
        processingType: 'server',
        processedAt: Date.now(),
      };
    } catch (err: any) {
      // Re-throw with clear message
      throw new Error(
        err.message ||
        `Esta herramienta requiere procesamiento en servidor dedicado que está actualmente en fase de integración. No realizamos simulaciones falsas.`
      );
    }
  }
}
