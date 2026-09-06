import React, { useRef, useState, useEffect } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  FileText, 
  Music, 
  Video, 
  Layers
} from 'lucide-react';
import { FileCategory, ToolType } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface DropzoneProps {
  onFilesSelected: (files: File[], targetCategory?: FileCategory) => void;
  activeMode?: ToolType;
  onModeChange?: (mode: ToolType) => void;
  selectedCategory?: string;
  onCategoryChange?: (cat: string) => void;
  isQueueEmpty?: boolean;
  acceptedExtensions?: string[];
  actionType?: ToolType;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesSelected,
  activeMode = 'convert',
  onModeChange,
  selectedCategory = 'all',
  onCategoryChange,
  acceptedExtensions,
}) => {
  const { t } = useI18n();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptString = () => {
    if (acceptedExtensions && acceptedExtensions.length > 0) {
      return acceptedExtensions.map((ext) => (ext.startsWith('.') ? ext : `.${ext.toLowerCase()}`)).join(',');
    }
    if (selectedCategory === 'image') return 'image/*';
    if (selectedCategory === 'document') return '.pdf,.doc,.docx,.txt,.csv,.json,.md,.html';
    if (selectedCategory === 'video') return 'video/*';
    if (selectedCategory === 'audio') return 'audio/*';
    return undefined;
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const pastedFiles = Array.from(e.clipboardData.files);
        onFilesSelected(pastedFiles);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFilesSelected]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      onFilesSelected(droppedFiles);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      onFilesSelected(selected);
      e.target.value = '';
    }
  };

  const categoryFormats = [
    { id: 'all', label: t.filterAll, icon: Layers },
    { id: 'image', label: t.catImage, icon: ImageIcon },
    { id: 'document', label: t.catPdfDoc, icon: FileText },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'audio', label: 'Audio', icon: Music },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Top Mode Segmented Control */}
      {onModeChange && (
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="inline-flex p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
            <button
              id="dropzone-mode-convert"
              onClick={() => onModeChange('convert')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeMode === 'convert'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.convert}
            </button>
            <button
              id="dropzone-mode-compress"
              onClick={() => onModeChange('compress')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeMode === 'compress'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.compress}
            </button>
          </div>

          {/* Formats category pills */}
          {onCategoryChange && (
            <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto py-1">
              {categoryFormats.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onCategoryChange(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Main Upload Area */}
      <div
        id="file-dropzone-container"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-200 p-8 sm:p-12 text-center bg-white shadow-2xl shadow-blue-900/5 ${
          isDragOver
            ? 'border-blue-600 bg-blue-50/40 ring-4 ring-blue-500/10 scale-[1.008]'
            : 'border-blue-300/80 hover:border-blue-600 hover:bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          id="file-input-element"
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          accept={getAcceptString()}
        />

        {/* Center Icon */}
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md shadow-blue-600/10">
          <UploadCloud className="w-9 h-9" />
        </div>

        {/* Main Prompt Text */}
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5">
          {acceptedExtensions && acceptedExtensions.length > 0
            ? `${t.dropzoneTitle} (.${acceptedExtensions.join(', .')})`
            : t.dropzoneTitle}
        </h3>
        <p className="text-sm font-medium text-slate-500 mb-6">
          <span className="text-blue-600 font-semibold underline underline-offset-4 group-hover:text-blue-700">{t.selectFiles}</span>
        </p>

        {/* Accepted Formats Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto pt-4 border-t border-slate-100">
          {acceptedExtensions && acceptedExtensions.length > 0 ? (
            acceptedExtensions.map((ext) => (
              <span key={ext} className="text-xs font-bold uppercase tracking-widest bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full">
                .{ext}
              </span>
            ))
          ) : (
            <>
              <span className="text-xs font-bold uppercase tracking-widest bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded-full">
                PDF
              </span>
              <span className="text-xs font-bold uppercase tracking-widest bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded-full">
                JPG
              </span>
              <span className="text-xs font-bold uppercase tracking-widest bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded-full">
                PNG
              </span>
              <span className="text-xs font-bold uppercase tracking-widest bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded-full">
                MP4
              </span>
              <span className="text-xs font-bold uppercase tracking-widest bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded-full">
                CSV
              </span>
              <span className="text-xs font-bold uppercase tracking-widest bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded-full">
                ZIP
              </span>
            </>
          )}
        </div>

        {/* Sub-info */}
        <div className="mt-5 flex items-center justify-center gap-4 text-xs font-medium text-slate-400">
          <span>{t.dropzoneSubtitle}</span>
          <span>•</span>
          <span className="hidden sm:inline">{t.pasteClipboard}</span>
        </div>
      </div>
    </div>
  );
};
