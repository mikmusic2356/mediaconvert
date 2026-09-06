import React, { useState } from 'react';
import { 
  QueuedFile, 
  FileCategory 
} from '../types';
import { 
  formatBytes, 
  createBatchZip 
} from '../services/conversionEngine';
import { 
  Download, 
  Archive, 
  FolderPlus, 
  Share2, 
  CheckCircle2, 
  Eye, 
  RotateCcw, 
  Sparkles, 
  ExternalLink, 
  Check, 
  X,
  FileText,
  Image as ImageIcon,
  Music,
  Video
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultsViewProps {
  completedFiles: QueuedFile[];
  onReset: () => void;
  onSaveToLibrary: (file: QueuedFile) => void;
  onSaveAllToLibrary: () => void;
  onOpenShareModal: (files: QueuedFile[]) => void;
  savedFileIds: string[];
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  completedFiles,
  onReset,
  onSaveToLibrary,
  onSaveAllToLibrary,
  onOpenShareModal,
  savedFileIds,
}) => {
  const [previewFile, setPreviewFile] = useState<QueuedFile | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [downloadAllSuccess, setDownloadAllSuccess] = useState(false);

  // Trigger celebration confetti on initial render
  React.useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#3b82f6', '#f59e0b'],
      });
    } catch (e) {}
  }, []);

  const totalOriginalSize = completedFiles.reduce((sum, f) => sum + f.size, 0);
  const totalResultSize = completedFiles.reduce((sum, f) => sum + (f.resultSize || f.size), 0);
  const totalSavings = totalOriginalSize > 0
    ? Math.round(((totalOriginalSize - totalResultSize) / totalOriginalSize) * 100)
    : 0;

  const handleDownloadSingle = (file: QueuedFile) => {
    if (!file.resultBlob) return;
    const url = URL.createObjectURL(file.resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.resultName || `archivo_${file.targetFormat.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownloadAllZip = async () => {
    if (completedFiles.length === 0) return;
    setIsZipping(true);
    try {
      const itemsToZip = completedFiles
        .filter((f) => f.resultBlob)
        .map((f) => ({
          blob: f.resultBlob!,
          name: f.resultName || `${f.name}.${f.targetFormat.toLowerCase()}`,
        }));

      const zipBlob = await createBatchZip(itemsToZip, 'MediaConvert_archivos_convertidos.zip');
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MediaConvert_lote_${completedFiles.length}_archivos.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setDownloadAllSuccess(true);
      setTimeout(() => setDownloadAllSuccess(false), 3000);
    } catch (e) {
      console.error('Error generating zip', e);
    } finally {
      setIsZipping(false);
    }
  };

  const getCategoryIcon = (category: FileCategory) => {
    switch (category) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-emerald-600" />;
      case 'audio':
        return <Music className="w-5 h-5 text-amber-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-rose-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Completion Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          ¡Archivos procesados correctamente!
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          Se han completado {completedFiles.length} {completedFiles.length === 1 ? 'archivo' : 'archivos'} listos para descarga o almacenamiento.
        </p>

        {/* Global Summary Stats */}
        <div className="grid grid-cols-3 max-w-lg mx-auto bg-slate-50 rounded-2xl p-3 border border-slate-200 text-center gap-2 mb-6">
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase">Tamaño original</p>
            <p className="text-sm font-bold text-slate-800">{formatBytes(totalOriginalSize)}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase">Tamaño final</p>
            <p className="text-sm font-bold text-blue-600">{formatBytes(totalResultSize)}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase">Ahorro total</p>
            <p className={`text-sm font-bold ${totalSavings > 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
              {totalSavings > 0 ? `-${totalSavings}%` : 'Optimizado'}
            </p>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Download All in ZIP */}
          <button
            id="results-download-zip-btn"
            onClick={handleDownloadAllZip}
            disabled={isZipping}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all"
          >
            {isZipping ? (
              <span>Empaquetando en ZIP...</span>
            ) : downloadAllSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡ZIP Descargado!</span>
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" />
                <span>Descargar todo en .ZIP ({completedFiles.length})</span>
              </>
            )}
          </button>

          {/* Share via Link */}
          <button
            id="results-share-link-btn"
            onClick={() => onOpenShareModal(completedFiles)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-300 rounded-xl shadow-xs transition-all"
          >
            <Share2 className="w-4 h-4 text-blue-600" />
            <span>Compartir mediante enlace</span>
          </button>

          {/* Save All to My Files Library */}
          <button
            id="results-save-all-library-btn"
            onClick={onSaveAllToLibrary}
            className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-300 rounded-xl shadow-xs transition-all"
          >
            <FolderPlus className="w-4 h-4 text-emerald-600" />
            <span>Guardar en Mis Archivos</span>
          </button>
        </div>
      </div>

      {/* Completed File Cards List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-sm font-bold text-slate-900">Archivos individuales</h4>
          <button
            onClick={onReset}
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Procesar nuevos archivos</span>
          </button>
        </div>

        {completedFiles.map((file) => {
          const isSaved = savedFileIds.includes(file.id);
          const hasBlob = !!file.resultBlob;
          const previewObjectUrl = hasBlob && file.category === 'image' ? URL.createObjectURL(file.resultBlob!) : file.previewUrl;

          return (
            <div
              key={file.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* File Info */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 relative overflow-hidden">
                  {previewObjectUrl ? (
                    <img
                      src={previewObjectUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    getCategoryIcon(file.category)
                  )}
                  <span className="absolute bottom-0 right-0 px-1 text-[9px] font-mono font-bold bg-blue-600 text-white rounded-tl">
                    {file.targetFormat}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 truncate" title={file.resultName || file.name}>
                    {file.resultName || file.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500">
                    <span className="line-through text-slate-400">{formatBytes(file.size)}</span>
                    <span className="text-slate-400">→</span>
                    <span className="font-bold text-slate-900">{formatBytes(file.resultSize || file.size)}</span>
                    {file.savingsPercentage !== undefined && file.savingsPercentage > 0 && (
                      <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                        -{file.savingsPercentage}% de ahorro
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Visual Preview */}
                {file.category === 'image' && (
                  <button
                    onClick={() => setPreviewFile(file)}
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                    title="Vista previa del resultado"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}

                {/* Save to library */}
                <button
                  onClick={() => onSaveToLibrary(file)}
                  className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    isSaved
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                  title="Guardar en tu biblioteca de Mis Archivos"
                >
                  {isSaved ? <Check className="w-3.5 h-3.5" /> : <FolderPlus className="w-3.5 h-3.5" />}
                  <span>{isSaved ? 'Guardado' : 'Guardar'}</span>
                </button>

                {/* Individual Download */}
                <button
                  id={`download-single-btn-${file.id}`}
                  onClick={() => handleDownloadSingle(file)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-blue-600 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Visual Image Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setPreviewFile(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Vista previa: {previewFile.resultName || previewFile.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Formato de salida {previewFile.targetFormat} • {formatBytes(previewFile.resultSize || previewFile.size)}
            </p>

            <div className="w-full max-h-[60vh] overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center p-4">
              {previewFile.resultBlob ? (
                <img
                  src={URL.createObjectURL(previewFile.resultBlob)}
                  alt="Resultado"
                  className="max-h-[50vh] max-w-full object-contain rounded-lg shadow-xs"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <p className="text-sm text-slate-500">Sin vista previa disponible</p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  handleDownloadSingle(previewFile);
                  setPreviewFile(null);
                }}
                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar archivo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
