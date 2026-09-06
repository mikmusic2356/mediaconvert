import { 
  ToolConfig, 
  QueuedFile, 
  ProcessingOptions, 
  ProcessingResult, 
  ProgressCallback, 
  ToolType 
} from '../../types';
import { LocalProcessor } from './LocalProcessor';
import { ServerProcessor } from './ServerProcessor';

export class ProcessingService {
  private localProcessor: LocalProcessor;
  private serverProcessor: ServerProcessor;

  constructor() {
    this.localProcessor = new LocalProcessor();
    this.serverProcessor = new ServerProcessor();
  }

  /**
   * Primary entry point decoupling UI from low-level execution logic
   */
  async execute(
    file: File,
    toolConfig: ToolConfig | null,
    targetFormat: string,
    options: ProcessingOptions,
    actionType: ToolType,
    onProgress: ProgressCallback
  ): Promise<ProcessingResult> {
    // 1. Honesty check: Validate tool implementation status (Requirement 16)
    if (toolConfig) {
      if (toolConfig.status === 'not_implemented' || toolConfig.status === 'server_pending') {
        const explanation = toolConfig.statusExplanation || 
          `Esta herramienta (${toolConfig.name}) está en fase de desarrollo e integración de infraestructura. MediaConvert no realiza conversiones simuladas ni genera descargas ficticias.`;
        throw new Error(explanation);
      }
    }

    // 2. Determine processing method from toolConfig or dynamic capability
    const processingType = toolConfig ? toolConfig.processingType : 'local';

    onProgress(5, `Iniciando procesador (${processingType === 'local' ? 'Motor de navegador' : 'Clúster en la nube'})...`);

    if (processingType === 'local') {
      if (!this.localProcessor.canHandle(file, targetFormat, actionType)) {
        throw new Error(
          `La conversión directa de este formato no es soportada por el motor local del navegador. Requiere procesamiento en servidor.`
        );
      }
      return await this.localProcessor.process(file, targetFormat, options, actionType, onProgress);
    }

    if (processingType === 'server') {
      return await this.serverProcessor.process(file, targetFormat, options, actionType, onProgress);
    }

    // Hybrid mode: Try local first, fallback to server
    if (this.localProcessor.canHandle(file, targetFormat, actionType)) {
      try {
        return await this.localProcessor.process(file, targetFormat, options, actionType, onProgress);
      } catch (err: any) {
        onProgress(40, 'Transfiriendo tarea al procesador de servidor...');
        return await this.serverProcessor.process(file, targetFormat, options, actionType, onProgress);
      }
    }

    return await this.serverProcessor.process(file, targetFormat, options, actionType, onProgress);
  }

  /**
   * Helper to execute a QueuedFile
   */
  async executeQueuedFile(
    queuedFile: QueuedFile,
    toolConfig: ToolConfig | null,
    onProgress: ProgressCallback
  ): Promise<ProcessingResult> {
    return await this.execute(
      queuedFile.file,
      toolConfig,
      queuedFile.targetFormat,
      queuedFile.options,
      queuedFile.actionType,
      onProgress
    );
  }
}

// Global Singleton Instance
export const processingService = new ProcessingService();
