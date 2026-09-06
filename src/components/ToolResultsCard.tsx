import React from 'react';
import { 
  CheckCircle2, 
  Download, 
  Bookmark, 
  Share2, 
  FileCheck, 
  RotateCcw, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Image as ImageIcon,
  FileText,
  Music,
  Video,
  Archive,
  Film
} from 'lucide-react';
import { QueuedFile, ToolConfig, FileCategory } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface ToolResultsCardProps {
  tool: ToolConfig;
  completedFiles: QueuedFile[];
  onDownloadFile: (file: QueuedFile) => void;
  onSaveFile: (file: QueuedFile) => void;
  onShareFiles: (files: QueuedFile[]) => void;
  onReset: () => void;
  onSaveAll: () => void;
  onDownloadAllZip: () => void;
  savedFileIds?: string[];
}

export const ToolResultsCard: React.FC<ToolResultsCardProps> = ({
  tool,
  completedFiles,
  onDownloadFile,
  onSaveFile,
  onShareFiles,
  onReset,
  onSaveAll,
  onDownloadAllZip,
  savedFileIds = []
}) => {
  const { t, language } = useI18n();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getCategoryIcon = (category: FileCategory) => {
    switch (category) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-emerald-600" />;
      case 'video-audio':
      case 'audio':
        return <Music className="w-5 h-5 text-amber-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-rose-600" />;
      case 'pdf-document':
      case 'document':
        return <FileText className="w-5 h-5 text-indigo-600" />;
      case 'gif':
        return <Film className="w-5 h-5 text-rose-600" />;
      case 'archive':
        return <Archive className="w-5 h-5 text-cyan-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  const isCompress = tool.type === 'compress';
  const conversionCompletedText = isCompress
    ? (language === 'us' ? 'Compression Completed' : language === 'fr' ? 'Compression terminée' : 'Compresión completada')
    : (language === 'us' ? 'Conversion Completed' : language === 'fr' ? 'Conversion terminée' : 'Conversión completada');
  const readyToDownloadText = language === 'us' ? 'Your file is ready to download!' : language === 'fr' ? 'Votre fichier est prêt à être téléchargé !' : '¡Tu archivo está listo para descargar!';
  const processedLocallyText = isCompress
    ? (language === 'us' ? `Optimized and compressed locally with ${tool.shortName || tool.name}` : language === 'fr' ? `Optimisé et compressé localement avec ${tool.shortName || tool.name}` : `Optimizado y comprimido localmente con ${tool.shortName || tool.name}`)
    : (language === 'us' ? `Processed locally in ${tool.shortName || tool.name} to format` : language === 'fr' ? `Traité localement dans ${tool.shortName || tool.name} au format` : `Procesado localmente en esta herramienta (${tool.shortName || tool.name}) a formato`);
  const originalLabel = language === 'us' ? 'Original:' : language === 'fr' ? 'Original :' : 'Original:';
  const resultLabel = language === 'us' ? 'Result:' : language === 'fr' ? 'Résultat :' : 'Resultado:';
  const downloadBtn = language === 'us' ? 'Download' : language === 'fr' ? 'Télécharger' : 'Descargar';
  const saveBtn = language === 'us' ? 'Save' : language === 'fr' ? 'Enregistrer' : 'Guardar';
  const savedBtn = language === 'us' ? 'Saved' : language === 'fr' ? 'Enregistré' : 'Guardado';
  const convertAnotherBtn = isCompress
    ? (language === 'us' ? 'Compress another file' : language === 'fr' ? 'Compresser un autre fichier' : 'Comprimir otro archivo')
    : (language === 'us' ? 'Convert another file' : language === 'fr' ? 'Convertir un autre fichier' : 'Convertir otro archivo');
  const saveAllBtn = language === 'us' ? 'Save All' : language === 'fr' ? 'Tout enregistrer' : 'Guardar Todos';
  const downloadZipBtn = language === 'us' ? 'Download All (.ZIP)' : language === 'fr' ? 'Tout télécharger (.ZIP)' : 'Descargar Todos (.ZIP)';
  const shareBtn = language === 'us' ? 'Share' : language === 'fr' ? 'Partager' : 'Compartir';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-900/5 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
      {/* 1. Encabezado de Estado de Éxito Contextualizado */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3.5 shadow-xs border border-emerald-100">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2 border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{conversionCompletedText}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {readyToDownloadText}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
          {processedLocallyText}{' '}
          <span className="font-mono font-bold text-blue-600 uppercase">.{tool.defaultOutputFormat}</span>.
        </p>
      </div>

      {/* 2. Lista de Archivos Convertidos con Comparativa Original vs Resultado */}
      <div className="space-y-3 mb-6 max-h-[380px] overflow-y-auto pr-1">
        {completedFiles.map((file) => {
          const isSaved = savedFileIds.includes(file.id);
          const originalName = file.name;
          const originalSizeFormatted = formatBytes(file.size);
          const resultName = file.resultName || `${file.name.replace(/\.[^/.]+$/, '')}.${tool.defaultOutputFormat.toLowerCase()}`;
          const resultSizeFormatted = formatBytes(file.resultSize || file.size);

          return (
            <div
              key={file.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-slate-100/60"
            >
              {/* Info Column */}
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                {file.previewUrl ? (
                  <img
                    src={file.previewUrl}
                    alt={resultName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-white shadow-2xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                    {getCategoryIcon(tool.category)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  {/* Resultado Header */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {resultName}
                    </p>
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-mono font-bold text-[10px] uppercase">
                      {tool.defaultOutputFormat}
                    </span>
                  </div>

                  {/* Detalle Explicito Original vs Resultado */}
                  <div className="mt-1.5 space-y-0.5 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span className="font-medium">{originalLabel}</span>
                      <span className="font-mono text-slate-600 truncate max-w-[180px] sm:max-w-xs">{originalName}</span>
                      <span>—</span>
                      <span className="font-semibold text-slate-700">{originalSizeFormatted}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-700">
                      <span className="font-bold text-emerald-700">{resultLabel}</span>
                      <span className="font-mono text-slate-800 font-bold truncate max-w-[180px] sm:max-w-xs">{resultName}</span>
                      <span>—</span>
                      <span className="font-bold text-emerald-600">{resultSizeFormatted}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción: Descargar, Guardar, Compartir */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => onDownloadFile(file)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadBtn}</span>
                </button>

                <button
                  onClick={() => onSaveFile(file)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSaved
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                  }`}
                  title="Guardar en biblioteca"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isSaved ? savedBtn : saveBtn}</span>
                </button>

                <button
                  onClick={() => onShareFiles([file])}
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                  title="Compartir archivo"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Barra de Acciones Globales & Reset Contextual */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>{convertAnotherBtn}</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {completedFiles.length > 1 && (
            <>
              <button
                onClick={onSaveAll}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{saveAllBtn}</span>
              </button>

              <button
                onClick={onDownloadAllZip}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm shadow-emerald-600/20"
              >
                <Download className="w-4 h-4" />
                <span>{downloadZipBtn}</span>
              </button>
            </>
          )}

          {completedFiles.length === 1 && (
            <button
              onClick={() => onShareFiles(completedFiles)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{shareBtn}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
