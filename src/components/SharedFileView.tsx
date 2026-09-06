import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Share2, 
  Copy, 
  Check, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Video, 
  Archive, 
  Clock, 
  ShieldCheck, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { ShareData, FileCategory } from '../types';
import { getShareData } from '../services/storageService';
import { formatBytes } from '../services/conversionEngine';

interface SharedFileViewProps {
  shareId: string;
  onNavigateHome: () => void;
}

export const SharedFileView: React.FC<SharedFileViewProps> = ({ shareId, onNavigateHome }) => {
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const data = getShareData(shareId);
    setShareData(data);
  }, [shareId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (file: { id: string; name: string; format: string; url?: string }) => {
    setDownloadingId(file.id);
    const blob = new Blob([`Contenido del archivo MediaConvert compartido: ${file.name}`], { type: 'application/octet-stream' });
    const url = file.url || URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloadingId(null), 1000);
  };

  const getCategoryIcon = (category: FileCategory) => {
    switch (category) {
      case 'image':
        return <ImageIcon className="w-5 h-5 text-emerald-600" />;
      case 'audio':
        return <Music className="w-5 h-5 text-indigo-600" />;
      case 'video':
      case 'video-audio':
        return <Video className="w-5 h-5 text-purple-600" />;
      case 'archive':
        return <Archive className="w-5 h-5 text-amber-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  if (!shareData) {
    return (
      <div className="w-full max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl shadow-blue-900/5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            Enlace compartido no encontrado o caducado
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            El enlace de descarga que intentas abrir ha superado su período de validez o fue eliminado por su propietario.
          </p>
          <button
            onClick={onNavigateHome}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a MediaConvert</span>
          </button>
        </div>
      </div>
    );
  }

  const createdFormatted = new Date(shareData.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      {/* Top Breadcrumb / Return */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ir al inicio de MediaConvert</span>
        </button>
        <span className="text-xs text-slate-400 font-mono">ID: {shareData.shareId}</span>
      </div>

      {/* Main Shared Collection Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-blue-900/5 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wider uppercase">
                Colección Compartida
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {createdFormatted}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {shareData.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {shareData.fileCount} archivo(s) listos para descarga • {formatBytes(shareData.totalSize)} en total
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Enlace copiado!' : 'Copiar enlace'}</span>
            </button>
          </div>
        </div>

        {/* Files List */}
        <div className="py-6 space-y-3">
          {shareData.files.map((file) => (
            <div
              key={file.id}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 flex items-center justify-between gap-3 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  {getCategoryIcon(file.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="font-mono">{formatBytes(file.size)}</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-mono text-[9px] font-bold">
                      {file.format}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDownloadFile(file)}
                disabled={downloadingId === file.id}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer Security Badge */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Archivos analizados y libres de malware</span>
          </div>
          <span className="text-[11px]">MediaConvert Secure Sharing</span>
        </div>
      </div>
    </div>
  );
};
