import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Download, 
  Share2, 
  Sparkles, 
  ChevronDown, 
  FileText, 
  Image as ImageIcon, 
  Trash2,
  RefreshCw,
  HelpCircle,
  Clock,
  Check,
  Cpu,
  Bookmark,
  ExternalLink,
  Layers,
  Upload,
  AlertCircle
} from 'lucide-react';
import { ToolConfig, QueuedFile, UserProfile, FileCategory } from '../types';
import { getRelatedToolConfigs } from '../data/toolsConfig';
import { formatBytes } from '../services/conversionEngine';
import { ToolResultsCard } from './ToolResultsCard';
import { ToolHonestStatusBanner } from './ToolHonestStatusBanner';
import { useI18n } from '../i18n/I18nContext';

interface FileConverterPageProps {
  tool: ToolConfig;
  queue: QueuedFile[];
  isProcessing: boolean;
  user: UserProfile;
  onFilesSelected: (files: File[], defaultAction?: any, defaultTarget?: string) => void;
  onUpdateFileTarget: (id: string, targetFormat: string) => void;
  onUpdateFileOptions: (id: string, options: any) => void;
  onRemoveFile: (id: string) => void;
  onStartProcessing: () => void;
  onDownloadFile: (file: QueuedFile) => void;
  onDownloadAllZip: () => void;
  onSaveFile: (file: QueuedFile) => void;
  onSaveAll: () => void;
  onShareFiles: (files: QueuedFile[]) => void;
  onReset: () => void;
  onNavigate: (view: any, categoryFilter?: FileCategory, toolSlug?: string, categorySlug?: string) => void;
  savedFileIds?: string[];
}

export const FileConverterPage: React.FC<FileConverterPageProps> = ({
  tool,
  queue,
  isProcessing,
  user,
  onFilesSelected,
  onUpdateFileTarget,
  onUpdateFileOptions,
  onRemoveFile,
  onStartProcessing,
  onDownloadFile,
  onDownloadAllZip,
  onSaveFile,
  onSaveAll,
  onShareFiles,
  onReset,
  onNavigate,
  savedFileIds = []
}) => {
  const { t, language } = useI18n();
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]); // First FAQ open by default
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const relatedTools = useMemo(() => getRelatedToolConfigs(tool.relatedTools || []), [tool.relatedTools]);

  // Dynamically update document title, meta tags, and JSON-LD schema for SEO
  useEffect(() => {
    // 1. Update Document Title
    document.title = tool.seo.title;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = tool.seo.metaDescription;

    // 3. Update Canonical Tag
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = tool.seo.canonical;

    // 4. Inject JSON-LD Schema (SoftwareApplication, HowTo, FAQPage)
    const schemaId = 'tool-json-ld';
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          'name': tool.name,
          'headline': tool.h1,
          'description': tool.description,
          'operatingSystem': 'Any (Web Browser)',
          'applicationCategory': 'UtilitiesApplication',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          },
          'featureList': tool.features
        },
        {
          '@type': 'HowTo',
          'name': `Cómo ${tool.name.toLowerCase()}`,
          'description': `Guía paso a paso para ${tool.name.toLowerCase()} usando MediaConvert.`,
          'step': tool.howToSteps.map((s) => ({
            '@type': 'HowToStep',
            'position': s.step,
            'name': s.title,
            'text': s.instruction
          }))
        },
        {
          '@type': 'FAQPage',
          'mainEntity': tool.faq.map((f) => ({
            '@type': 'Question',
            'name': f.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': f.answer
            }
          }))
        }
      ]
    };

    scriptTag.textContent = JSON.stringify(structuredData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tool]);

  // Clean queue when navigating between different tools so previous conversions do not linger
  useEffect(() => {
    onReset();
  }, [tool.id, tool.slug]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

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
      const filesArray = Array.from(e.dataTransfer.files);
      onFilesSelected(filesArray, tool.type, tool.defaultOutputFormat);
    }
  };

  const handleManualSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray, tool.type, tool.defaultOutputFormat);
      e.target.value = '';
    }
  };

  const completedFiles = queue.filter((f) => f.status === 'completed');
  const pendingFiles = queue.filter((f) => f.status !== 'completed');
  const hasQueue = queue.length > 0;
  const isAllCompleted = hasQueue && pendingFiles.length === 0;

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'image': return t.catImage;
      case 'video':
      case 'audio':
      case 'video-audio': return t.catVideoAudio;
      case 'pdf':
      case 'pdf-document':
      case 'document': return t.catPdfDoc;
      case 'gif': return t.catGif;
      default: return t.catZip;
    }
  };

  return (
    <div className="w-full">
      {/* 1. Breadcrumb: Inicio → Categoría → Herramienta */}
      <div className="w-full pt-4 pb-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
          <button 
            onClick={() => onNavigate('home')} 
            className="hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <span>{t.home}</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <button 
            onClick={() => onNavigate('category', undefined, undefined, tool.type === 'compress' ? 'compress' : 'convert')} 
            className="hover:text-blue-600 transition-colors capitalize"
          >
            {tool.type === 'compress' ? t.compress : t.convert}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <button 
            onClick={() => {
              const catSlug = tool.category === 'image' ? 'image' : 
                              (tool.category === 'video' || tool.category === 'audio' || tool.category === 'video-audio') ? 'video' :
                              (tool.category === 'pdf-document' || tool.category === 'document') ? 'pdf' :
                              tool.category === 'gif' ? 'gif' : 'zip';
              onNavigate('category', tool.category, undefined, catSlug);
            }} 
            className="hover:text-blue-600 transition-colors capitalize"
          >
            {getCategoryLabel(tool.category)}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-semibold truncate">{tool.shortName || tool.name}</span>
        </nav>
      </div>

      {/* 2. Tool Hero Section */}
      <section className="w-full py-6 sm:py-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          {/* Engine & Format Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-4 shadow-xs border border-blue-100">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>{tool.badge || '100% Nativo en Navegador'}</span>
            <span className="text-blue-300">•</span>
            <span className="font-mono uppercase text-blue-800">
              {tool.type === 'compress' 
                ? (tool.inputFormats.length === 1 ? `${tool.inputFormats[0]} • Compresión` : `${tool.inputFormats.join(', ')} • Optimización`) 
                : `${tool.inputFormats.join(', ')} → ${tool.defaultOutputFormat}`}
            </span>
          </div>

          {/* Primary H1 */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            {tool.h1}
          </h1>

          {/* Contextual Description */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {tool.contextualDescription}
          </p>

          {/* Security & Technical Commitments */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-5 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {t.noCloudUpload}
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              {t.noWatermarks}
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              {t.gpuAccelerated}
            </span>
          </div>
        </div>

        {/* 3. Área Principal de Conversión (DOMINANT VISUAL ELEMENT) */}
        <div className="w-full max-w-3xl mx-auto">
          {/* Honest Transparency Banner when tool is pending server infrastructure integration */}
          {(tool.status === 'server_pending' || tool.status === 'not_implemented') && (
            <ToolHonestStatusBanner
              tool={tool}
              onExploreOtherTools={() => onNavigate('category', undefined, undefined, 'convert')}
            />
          )}

          {/* Case A: Empty Dropzone */}
          {!hasQueue && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative rounded-3xl border-2 border-dashed transition-all cursor-pointer p-8 sm:p-12 text-center bg-white shadow-xl shadow-blue-900/5 ${
                isDragOver
                  ? 'border-blue-600 bg-blue-50/50 scale-[1.01]'
                  : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={tool.inputFormats.map(ext => `.${ext.toLowerCase()}`).join(',')}
                onChange={handleManualSelect}
                className="hidden"
              />

              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                {t.dragFileHere}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-5">
                {t.orClickToSelect}
              </p>

              {/* Supported formats pills */}
              <div className="inline-flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500">{t.supportedFormats}</span>
                {tool.inputFormats.map((ext) => (
                  <span
                    key={ext}
                    className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-bold text-[11px] uppercase border border-slate-200"
                  >
                    .{ext.toLowerCase()}
                  </span>
                ))}
                {tool.type !== 'compress' && (
                  <>
                    <span className="text-slate-300 text-xs">→</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-700 font-mono font-bold text-[11px] uppercase border border-blue-200">
                      .{tool.defaultOutputFormat.toLowerCase()}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Case B: Files Selected (Pending, Processing, or Mix) */}
          {hasQueue && !isAllCompleted && (
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-900/5 border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {t.queuedFiles} ({queue.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    {tool.type === 'compress' ? (
                      <span>{language === 'us' ? 'Optimization mode' : language === 'fr' ? 'Mode optimisation' : 'Modo optimización'} <strong className="font-mono text-blue-600 uppercase">.{tool.inputFormats.join(', .')}</strong></span>
                    ) : (
                      <span>{t.directConversionTo} <span className="font-mono font-bold text-blue-600 uppercase">.{tool.defaultOutputFormat}</span></span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
                  >
                    {t.addMoreFiles}
                  </button>
                  <button
                    onClick={onReset}
                    disabled={isProcessing}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
                  >
                    {t.clearQueue}
                  </button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={tool.inputFormats.map(ext => `.${ext.toLowerCase()}`).join(',')}
                onChange={handleManualSelect}
                className="hidden"
              />

              {/* List of Selected Files */}
              <div className="space-y-3 mb-6 max-h-[380px] overflow-y-auto pr-1">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {item.previewUrl ? (
                        <img
                          src={item.previewUrl}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                          <ImageIcon className="w-6 h-6 text-slate-500" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {item.name}
                          </p>
                          <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] uppercase font-bold shrink-0">
                            {item.extension}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>{formatBytes(item.size)}</span>
                          <span>•</span>
                          <span className="text-blue-600 font-semibold font-mono">
                            {t.destination} {item.targetFormat || tool.defaultOutputFormat}
                          </span>
                        </div>

                        {/* Status / Progress during Processing */}
                        {item.status === 'processing' && (
                          <div className="mt-2">
                            <div className="flex justify-between text-[10px] text-slate-600 mb-1">
                              <span>{item.statusMessage || t.processingInRam}</span>
                              <span className="font-bold font-mono">{item.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-blue-600 h-full rounded-full transition-all duration-200"
                                style={{ width: `${Math.max(item.progress, 15)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    {!isProcessing && item.status !== 'completed' && (
                      <button
                        onClick={() => onRemoveFile(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-colors shrink-0"
                        title="Eliminar de la cola"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {item.status === 'completed' && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t.ready}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Conversion Trigger CTA Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  {isProcessing 
                    ? t.processingPipeline 
                    : (tool.type === 'compress' 
                        ? (language === 'us' ? 'Ready to compress' : language === 'fr' ? 'Prêt pour la compression' : 'Listo para iniciar compresión') 
                        : t.readyToConvert)}
                </span>

                <button
                  onClick={onStartProcessing}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>
                        {tool.type === 'compress' ? t.compressingWithCount : t.convertingWithCount} ({queue.filter(q => q.status === 'completed').length}/{queue.length})...
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {tool.type === 'compress' 
                          ? t.compressNow 
                          : (tool.defaultOutputFormat 
                              ? t.convertFormatNow.replace('{format}', tool.defaultOutputFormat) 
                              : t.convertNow)}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Case C: Contextual Results View (Stay inside Tool View with Exact Details and Actions) */}
          {isAllCompleted && (
            <ToolResultsCard
              tool={tool}
              completedFiles={completedFiles}
              onDownloadFile={onDownloadFile}
              onSaveFile={onSaveFile}
              onShareFiles={onShareFiles}
              onReset={onReset}
              onSaveAll={onSaveAll}
              onDownloadAllZip={onDownloadAllZip}
              savedFileIds={savedFileIds}
            />
          )}
        </div>
      </section>

      {/* 4. SECCIÓN EDUCATIVA EN PROFUNDIDAD: ¿Qué es el formato de origen vs destino? */}
      {(tool.whatIsFrom || tool.whatIsTo) && (
        <section className="w-full py-10 border-t border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
              {t.formatBasics}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.understandBeforeConvert}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Format From Box */}
            {tool.whatIsFrom && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[10px] font-mono font-bold uppercase border border-amber-200">
                      {tool.whatIsFrom.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">{t.sourceFormat}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {tool.whatIsFrom.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {tool.whatIsFrom.description}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 block">{t.keyPoints}</span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {tool.whatIsFrom.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                    {tool.whatIsFrom.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-500">
                        <span className="text-amber-500 font-bold shrink-0">✕</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Format To Box */}
            {tool.whatIsTo && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-blue-200 shadow-sm flex flex-col justify-between bg-gradient-to-b from-blue-50/30 to-white">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-[10px] font-mono font-bold uppercase border border-blue-200">
                      {tool.whatIsTo.badge}
                    </span>
                    <span className="text-xs font-bold text-blue-600 font-mono">{t.recommendedDestination}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {tool.whatIsTo.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {tool.whatIsTo.description}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-blue-100">
                  <span className="text-[11px] font-bold text-blue-900 block">{t.outputAdvantages}</span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {tool.whatIsTo.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. ¿PARA QUÉ SIRVE CONVERTIR ESTE FORMATO? */}
      {tool.whyConvertReason && (
        <section className="w-full py-10 border-t border-slate-200/80">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
              {t.practicalUseCases}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {tool.whyConvertReason.heading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              {tool.whyConvertReason.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tool.whyConvertReason.points.map((point, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                    0{idx + 1}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    {point.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. COMPARATIVA TÉCNICA DETALLADA */}
      {tool.formatComparison && (
        <section className="w-full py-10 border-t border-slate-200/80">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
              {t.technicalComparison}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.keyDifferencesBetween} {tool.formatComparison.fromExt} & {tool.formatComparison.toExt}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              {t.technicalAnalysis}
            </p>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
                    <th className="p-4 sm:p-5 w-1/3">{t.technicalProperty}</th>
                    <th className="p-4 sm:p-5 w-1/3 text-slate-900">
                      {tool.formatComparison.fromName}
                    </th>
                    <th className="p-4 sm:p-5 w-1/3 text-blue-700 bg-blue-50/60">
                      {tool.formatComparison.toName}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {tool.formatComparison.points.map((pt, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-800">
                        {pt.feature}
                      </td>
                      <td className="p-4 sm:p-5 text-slate-600">
                        {pt.fromValue}
                      </td>
                      <td className="p-4 sm:p-5 text-slate-800 font-medium bg-blue-50/20">
                        <div className="flex items-center gap-2">
                          {pt.advantage === 'to' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          )}
                          <span>{pt.toValue}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* 7. QUÉ OCURRE DURANTE LA CONVERSIÓN & REQUISITOS DE ARCHIVOS */}
      <section className="w-full py-10 border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pipeline Details */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
              {t.internalProcess}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-4">
              {t.whatHappensDuringConversion}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              {t.zeroCloudModel}
            </p>

            <div className="space-y-4">
              {(tool.whatHappensDuringConversion || [
                { step: 1, title: language === 'us' ? 'Read in RAM memory' : language === 'fr' ? 'Lecture en mémoire RAM' : 'Lectura en memoria RAM', explanation: language === 'us' ? 'File binary data is decoded locally without transmitting to servers.' : language === 'fr' ? 'Les données binaires sont décodées localement sans aucun transfert.' : 'Se decodifican los datos binarios del archivo sin transmitir información a servidores.' },
                { step: 2, title: language === 'us' ? 'Matrix reconstruction' : language === 'fr' ? 'Reconstruction matricielle' : 'Reconstrucción matricial', explanation: language === 'us' ? 'Generates native 32-bit pixel map with 1:1 color accuracy.' : language === 'fr' ? 'Génère une carte de pixels native avec fidélité 1:1.' : 'Se genera un mapa de píxeles nativo de 32 bits con fidelidad cromática 1:1.' },
                { step: 3, title: language === 'us' ? 'Output encoding' : language === 'fr' ? 'Encodage de sortie' : 'Codificación de salida', explanation: language === 'us' ? 'Serializes data to destination format applying optimized compression.' : language === 'fr' ? 'Sérialise les données au format cible avec compression optimisée.' : 'Se serializan los datos al formato de destino aplicando compresión optimizada.' },
                { step: 4, title: language === 'us' ? 'Instant delivery' : language === 'fr' ? 'Livraison instantanée' : 'Entrega instantánea', explanation: language === 'us' ? 'Generates direct download link in memory ready to save.' : language === 'fr' ? 'Génère le lien direct en mémoire prêt à enregistrer.' : 'Se genera el enlace de descarga directa en memoria listo para guardar.' }
              ]).map((st) => (
                <div key={st.step} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {st.step}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 mb-0.5">
                      {st.title}
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {st.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accepted Files & Result Expected */}
          <div className="space-y-6">
            {/* Accepted files guide */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                {t.inputRequirements}
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {t.whatFilesAccepted}
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                {tool.acceptedFilesGuide?.description || (language === 'us' ? 'Accepts standard file formats compatible with this tool.' : language === 'fr' ? 'Prend en charge les formats standards compatibles avec cet outil.' : 'Admite archivos en formatos estándar compatibles con esta herramienta.')}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {(tool.acceptedFilesGuide?.extensions || tool.inputFormats).map((ext) => (
                  <span key={ext} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono text-xs font-bold">
                    {ext.startsWith('.') ? ext : `.${ext.toLowerCase()}`}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {t.sizeLimit} <span className="font-bold text-slate-800">{tool.acceptedFilesGuide?.maxSize || t.upTo2gb}</span>
              </p>
            </div>

            {/* Result Expected Guide */}
            <div className="bg-white rounded-3xl p-6 border border-blue-200 shadow-xs bg-gradient-to-b from-blue-50/20 to-white">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
                {t.guaranteedResult}
              </span>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {t.whatResultYouGet}
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                {tool.expectedResultGuide?.description || (language === 'us' ? 'You get high quality output with universal compatibility.' : language === 'fr' ? 'Vous obtenez un fichier de sortie haute fidélité avec une compatibilité universelle.' : 'Obtienes un archivo de salida de alta calidad y máxima compatibilidad.')}
              </p>
              <div className="space-y-1.5">
                {(tool.expectedResultGuide?.features || [
                  language === 'us' ? '100% preserved visual resolution' : language === 'fr' ? 'Résolution 100% préservée' : 'Resolución de imagen 100% conservada',
                  language === 'us' ? 'Universal viewer compatibility' : language === 'fr' ? 'Compatibilité universelle' : 'Compatibilidad universal con todos los visores',
                  language === 'us' ? 'No watermarks or download limits' : language === 'fr' ? 'Sans filigrane ni limite' : 'Descarga sin límites ni marcas de agua'
                ]).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 font-bold shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PREGUNTAS FRECUENTES ESPECÍFICAS (FAQ) */}
      {tool.faq && tool.faq.length > 0 && (
        <section className="w-full py-10 border-t border-slate-200/80">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
                {t.faqHeading}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t.resolvedQuestionsAbout} {tool.shortName || tool.name}
              </h2>
            </div>

            <div className="space-y-3">
              {tool.faq.map((item, index) => {
                const isOpen = openFaqIndices.includes(index);
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-slate-900 hover:text-blue-600 transition-colors gap-4"
                    >
                      <span className="text-xs sm:text-sm">{item.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transform transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-50">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 9. HERRAMIENTAS RELACIONADAS */}
      {relatedTools.length > 0 && (
        <section className="w-full py-10 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
                {t.relatedNavigation}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {t.otherPopularConversions}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('tools', tool.category)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>{t.viewAllOfCategory} {getCategoryLabel(tool.category)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((relTool) => (
              <button
                key={relTool.id}
                onClick={() => onNavigate('tool-page', undefined, relTool.slug)}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-900/5 transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold mb-3 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                    {relTool.inputFormats[0]} → {relTool.defaultOutputFormat}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                    {relTool.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {relTool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>{t.openTool}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
