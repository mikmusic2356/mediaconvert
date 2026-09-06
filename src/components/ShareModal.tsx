import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Clock, 
  Lock, 
  ShieldCheck, 
  QrCode, 
  ExternalLink,
  Download,
  FileText
} from 'lucide-react';
import { createShareLink } from '../services/storageService';
import { formatBytes } from '../services/conversionEngine';
import { useI18n } from '../i18n/I18nContext';

interface ShareModalProps {
  files: any[];
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ files, onClose }) => {
  const { language } = useI18n();
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const titleText = language === 'us' ? 'Share files via direct link' : language === 'fr' ? 'Partager des fichiers via lien direct' : 'Compartir archivos mediante enlace';
  const subtitleText = language === 'us' ? 'Anyone with the link can download the files directly.' : language === 'fr' ? 'Toute personne avec le lien peut télécharger directement les fichiers.' : 'Cualquiera con el enlace podrá descargar los archivos de forma directa.';
  const directDownloadLabel = language === 'us' ? 'Direct download link' : language === 'fr' ? 'Lien direct de téléchargement' : 'Enlace directo de descarga';
  const copiedBtn = language === 'us' ? 'Copied!' : language === 'fr' ? 'Copié !' : '¡Copiado!';
  const copyBtn = language === 'us' ? 'Copy' : language === 'fr' ? 'Copier' : 'Copiar';
  const linkExpirationLabel = language === 'us' ? 'Link expiration' : language === 'fr' ? 'Expiration du lien' : 'Caducidad del enlace';
  const exp24h = language === 'us' ? '24 Hours' : language === 'fr' ? '24 Heures' : '24 Horas';
  const exp7d = language === 'us' ? '7 Days' : language === 'fr' ? '7 Jours' : '7 Días';
  const exp30d = language === 'us' ? '30 Days' : language === 'fr' ? '30 Jours' : '30 Días';
  const expNever = language === 'us' ? 'No expiration (Pro)' : language === 'fr' ? 'Sans expiration (Pro)' : 'Sin caducidad (Pro)';
  const hideQrBtn = language === 'us' ? 'Hide QR code' : language === 'fr' ? 'Masquer le code QR' : 'Ocultar código QR';
  const showQrBtn = language === 'us' ? 'View QR code' : language === 'fr' ? 'Voir le code QR' : 'Ver código QR';
  const scanQrText = language === 'us' ? 'Scan with your mobile camera to download immediately.' : language === 'fr' ? 'Scannez avec votre appareil photo mobile pour télécharger immédiatement.' : 'Escanea con tu cámara móvil para descargar inmediatamente.';
  const securityNoticeText = language === 'us' ? 'Shared links contain no trackers or ads. Recipients download files directly.' : language === 'fr' ? 'Les liens partagés ne contiennent aucun traceur ni publicité. Les destinataires accèdent directement aux fichiers.' : 'Los enlaces compartidos no contienen rastreadores ni publicidad. Los destinatarios acceden directamente al archivo.';

  // Generate share structure
  const preparedFiles = files.map((f, i) => ({
    id: f.id || `f_${i}`,
    name: f.resultName || f.name,
    size: f.resultSize || f.size,
    format: f.targetFormat || f.format || 'FILE',
    category: f.category || 'document',
  }));

  const shareData = createShareLink(
    files.length === 1 ? `Archivo: ${preparedFiles[0].name}` : `Colección de ${files.length} archivos`,
    preparedFiles,
    expiresInDays
  );

  const shareUrl = `${window.location.origin}/share/${shareData.shareId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative animate-in zoom-in-95 duration-150 border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {titleText}
            </h3>
            <p className="text-xs text-slate-500">
              {subtitleText}
            </p>
          </div>
        </div>

        {/* Shared Files List Preview */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 mb-5 space-y-2 max-h-36 overflow-y-auto">
          {preparedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate flex-1 mr-2">
                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800 truncate">{file.name}</span>
              </div>
              <span className="text-slate-500 font-mono text-[11px] shrink-0">
                {formatBytes(file.size)}
              </span>
            </div>
          ))}
        </div>

        {/* Generated Share Link Box */}
        <div className="mb-5">
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            {directDownloadLabel}
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-800 truncate select-all">
              {shareUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? copiedBtn : copyBtn}</span>
            </button>
          </div>
        </div>

        {/* Sharing Options */}
        <div className="grid grid-cols-2 gap-3 mb-6 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {linkExpirationLabel}
            </label>
            <select
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(parseInt(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 font-medium"
            >
              <option value={1}>{exp24h}</option>
              <option value={7}>{exp7d}</option>
              <option value={30}>{exp30d}</option>
              <option value={365}>{expNever}</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={() => setShowQr(!showQr)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-700 text-xs transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-600" />
              <span>{showQr ? hideQrBtn : showQrBtn}</span>
            </button>
          </div>
        </div>

        {/* QR Code Visual Area */}
        {showQr && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center mb-5 animate-in fade-in duration-150">
            <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center">
              {/* QR Vector Pattern */}
              <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-slate-950 rounded">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-[1px] ${
                      (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                        ? 'bg-white'
                        : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {scanQrText}
            </p>
          </div>
        )}

        {/* Security Note */}
        <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            {securityNoticeText}
          </p>
        </div>
      </div>
    </div>
  );
};

