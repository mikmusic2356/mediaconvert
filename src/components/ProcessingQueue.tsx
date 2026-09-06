import React, { useState } from 'react';
import { 
  QueuedFile, 
  ProcessingOptions, 
  FileCategory, 
  ToolType 
} from '../types';
import { 
  formatBytes, 
  getAvailableTargetFormats 
} from '../services/conversionEngine';
import { 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Video, 
  Archive, 
  Trash2, 
  Settings2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Plus, 
  Play, 
  Sliders, 
  Sparkles,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

interface ProcessingQueueProps {
  queue: QueuedFile[];
  onRemoveFile: (id: string) => void;
  onClearQueue: () => void;
  onUpdateFileTarget: (id: string, targetFormat: string) => void;
  onUpdateFileOptions: (id: string, options: Partial<ProcessingOptions>) => void;
  onUpdateFileAction: (id: string, actionType: ToolType) => void;
  onStartProcessing: () => void;
  onAddMoreFiles: () => void;
  isProcessing: boolean;
  onBatchSetTarget: (format: string) => void;
}

export const ProcessingQueue: React.FC<ProcessingQueueProps> = ({
  queue,
  onRemoveFile,
  onClearQueue,
  onUpdateFileTarget,
  onUpdateFileOptions,
  onUpdateFileAction,
  onStartProcessing,
  onAddMoreFiles,
  isProcessing,
  onBatchSetTarget,
}) => {
  const [activeSettingsFileId, setActiveSettingsFileId] = useState<string | null>(null);

  const getCategoryIcon = (category: FileCategory) => {
    switch (category) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-emerald-600" />;
      case 'audio':
        return <Music className="w-5 h-5 text-amber-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-rose-600" />;
      case 'archive':
        return <Archive className="w-5 h-5 text-cyan-600" />;
      default:
        return <FileText className="w-5 h-5 text-indigo-600" />;
    }
  };

  const completedCount = queue.filter((f) => f.status === 'completed').length;
  const idleCount = queue.filter((f) => f.status === 'idle').length;
  const processingCount = queue.filter((f) => f.status === 'processing' || f.status === 'analyzing').length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Top Header with Quick Batch Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
            {queue.length}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Archivos en cola para procesar
            </h4>
            <p className="text-xs text-slate-500">
              {idleCount > 0 ? `${idleCount} listos para iniciar` : ''}
              {processingCount > 0 ? ` • ${processingCount} procesando...` : ''}
              {completedCount > 0 ? ` • ${completedCount} completados` : ''}
            </p>
          </div>
        </div>

        {/* Global Batch Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Batch Target Format for Images */}
          {queue.some((q) => q.category === 'image') && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <span className="font-medium">Todo a:</span>
              <button
                onClick={() => onBatchSetTarget('WEBP')}
                className="px-1.5 py-0.5 font-semibold text-blue-600 hover:bg-blue-50 rounded"
              >
                WEBP
              </button>
              <span>•</span>
              <button
                onClick={() => onBatchSetTarget('PNG')}
                className="px-1.5 py-0.5 font-semibold text-blue-600 hover:bg-blue-50 rounded"
              >
                PNG
              </button>
              <span>•</span>
              <button
                onClick={() => onBatchSetTarget('JPG')}
                className="px-1.5 py-0.5 font-semibold text-blue-600 hover:bg-blue-50 rounded"
              >
                JPG
              </button>
            </div>
          )}

          <button
            id="queue-add-more-btn"
            onClick={onAddMoreFiles}
            disabled={isProcessing}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir</span>
          </button>

          <button
            id="queue-clear-all-btn"
            onClick={onClearQueue}
            disabled={isProcessing}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
            title="Limpiar lista"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Queue File Items */}
      <div className="space-y-3">
        {queue.map((item) => {
          const availableFormats = getAvailableTargetFormats(item.category, item.extension);
          const isSettingsOpen = activeSettingsFileId === item.id;

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-2xl transition-all shadow-xs overflow-hidden ${
                item.status === 'completed'
                  ? 'border-emerald-200 bg-emerald-50/10'
                  : item.status === 'error'
                  ? 'border-rose-200 bg-rose-50/10'
                  : item.status === 'processing'
                  ? 'border-blue-300 ring-2 ring-blue-500/10'
                  : 'border-slate-200'
              }`}
            >
              <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left: Thumbnail / File details */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 relative overflow-hidden">
                    {item.previewUrl ? (
                      <img
                        src={item.previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      getCategoryIcon(item.category)
                    )}
                    <span className="absolute bottom-0 right-0 px-1 text-[9px] font-mono font-bold bg-slate-900 text-white rounded-tl">
                      {item.extension}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 truncate" title={item.name}>
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <span>{formatBytes(item.size)}</span>
                      <span>•</span>
                      <span className="capitalize">{item.category}</span>
                      {item.status === 'completed' && item.resultSize && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600 font-bold">
                            {formatBytes(item.resultSize)}
                            {item.savingsPercentage !== undefined && item.savingsPercentage > 0 && (
                              <span className="ml-1 bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full text-[10px]">
                                -{item.savingsPercentage}%
                              </span>
                            )}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Center / Right: Operation & Target Format Selector */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
                  {/* Action Mode (Convertir vs Comprimir) */}
                  <div className="flex items-center gap-1.5">
                    <select
                      value={item.actionType}
                      disabled={isProcessing || item.status === 'completed'}
                      onChange={(e) => onUpdateFileAction(item.id, e.target.value as ToolType)}
                      className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="convert">Convertir a</option>
                      <option value="compress">Comprimir</option>
                    </select>

                    {item.actionType === 'convert' && (
                      <div className="relative">
                        <select
                          value={item.targetFormat}
                          disabled={isProcessing || item.status === 'completed'}
                          onChange={(e) => onUpdateFileTarget(item.id, e.target.value)}
                          className="text-xs font-bold text-blue-700 bg-blue-50/80 border border-blue-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-7 cursor-pointer"
                        >
                          <option value={item.targetFormat}>{item.targetFormat}</option>
                          {availableFormats.map((fmt) => (
                            <option key={fmt} value={fmt}>
                              {fmt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-blue-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    )}
                  </div>

                  {/* Settings / Gear Button */}
                  <button
                    onClick={() => setActiveSettingsFileId(isSettingsOpen ? null : item.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isSettingsOpen
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                    title="Opciones avanzadas del archivo"
                  >
                    <Settings2 className="w-4 h-4" />
                  </button>

                  {/* Status Indicator / Delete Button */}
                  {item.status === 'processing' || item.status === 'analyzing' ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{item.progress}%</span>
                    </div>
                  ) : item.status === 'completed' ? (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Listo</span>
                    </div>
                  ) : item.status === 'error' ? (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg text-xs font-medium">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Error</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onRemoveFile(item.id)}
                      disabled={isProcessing}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Quitar de la cola"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar line */}
              {(item.status === 'processing' || item.status === 'analyzing') && (
                <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.max(5, item.progress)}%` }}
                  />
                </div>
              )}

              {/* Status Message */}
              {item.statusMessage && (
                <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                  <span>{item.statusMessage}</span>
                  {item.status === 'error' && item.errorMessage && (
                    <span className="text-rose-600 font-medium">{item.errorMessage}</span>
                  )}
                </div>
              )}

              {/* Advanced Options Accordion Panel */}
              {isSettingsOpen && (
                <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-in fade-in duration-150">
                  {/* Image Options */}
                  {item.category === 'image' && (
                    <>
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="font-semibold text-slate-700">
                            Calidad de compresión ({item.options.quality}%)
                          </label>
                          <span className="text-slate-500">
                            {item.options.quality >= 80 ? 'Alta nitidez' : item.options.quality >= 50 ? 'Equilibrada' : 'Máximo ahorro'}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="5"
                          value={item.options.quality}
                          onChange={(e) =>
                            onUpdateFileOptions(item.id, { quality: parseInt(e.target.value) })
                          }
                          className="w-full accent-blue-600"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Redimensionar
                        </label>
                        <select
                          value={item.options.resizeMode}
                          onChange={(e) =>
                            onUpdateFileOptions(item.id, {
                              resizeMode: e.target.value as any,
                              resizePercentage: e.target.value === 'percentage' ? 75 : undefined,
                            })
                          }
                          className="w-full bg-white border border-slate-300 rounded-lg p-1.5"
                        >
                          <option value="original">Mantener tamaño original</option>
                          <option value="percentage">Escalar al 75%</option>
                          <option value="percentage">Escalar al 50%</option>
                          <option value="custom">Dimensiones personalizadas (px)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-4 sm:col-span-2 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.options.grayscale || false}
                            onChange={(e) =>
                              onUpdateFileOptions(item.id, { grayscale: e.target.checked })
                            }
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-slate-700">Convertir a escala de grises</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.options.invertColors || false}
                            onChange={(e) =>
                              onUpdateFileOptions(item.id, { invertColors: e.target.checked })
                            }
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-slate-700">Invertir colores</span>
                        </label>
                      </div>
                    </>
                  )}

                  {/* Document / CSV / JSON Options */}
                  {item.category === 'document' && (
                    <>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Delimitador CSV
                        </label>
                        <select
                          value={item.options.csvDelimiter || ','}
                          onChange={(e) =>
                            onUpdateFileOptions(item.id, { csvDelimiter: e.target.value })
                          }
                          className="w-full bg-white border border-slate-300 rounded-lg p-1.5"
                        >
                          <option value=",">Coma (,)</option>
                          <option value=";">Punto y coma (;)</option>
                          <option value="\t">Tabulación (\t)</option>
                        </select>
                      </div>

                      <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.options.indentJson !== false}
                            onChange={(e) =>
                              onUpdateFileOptions(item.id, { indentJson: e.target.checked })
                            }
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-slate-700">Formatear JSON con sangría (Pretty print)</span>
                        </label>
                      </div>
                    </>
                  )}

                  {/* General Compression Level */}
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Nivel de compresión de archivo
                    </label>
                    <select
                      value={item.options.compressionLevel || 'balanced'}
                      onChange={(e) =>
                        onUpdateFileOptions(item.id, { compressionLevel: e.target.value as any })
                      }
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5"
                    >
                      <option value="balanced">Equilibrado (Recomendado)</option>
                      <option value="maximum">Máxima compresión (Menor peso)</option>
                      <option value="low">Rápido (Baja compresión)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Execution Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 text-center sm:text-left">
          Los archivos se procesan de forma privada y segura en tu navegador.
        </p>

        <button
          id="queue-execute-process-btn"
          onClick={onStartProcessing}
          disabled={isProcessing || idleCount === 0}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all ${
            isProcessing || idleCount === 0
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-lg shadow-blue-600/20'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Procesando {processingCount} archivos...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>
                {idleCount === queue.length
                  ? `Iniciar procesamiento (${queue.length} archivos)`
                  : `Procesar restantes (${idleCount})`}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
