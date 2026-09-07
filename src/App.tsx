/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  QueuedFile, 
  FileCategory, 
  ToolType, 
  ProcessingOptions, 
  SavedFileItem, 
  UserProfile, 
  FileTool 
} from './types';
import { 
  detectFileCategory, 
  getDefaultTargetFormat, 
  executeFileOperation, 
  createBatchZip
} from './services/conversionEngine';
import { 
  getSavedFiles, 
  saveFileToLibrary, 
  removeSavedFile, 
  getUserProfile, 
  updateUserProfile 
} from './services/storageService';
import { 
  getToolBySlug, 
  TOOLS_CONFIG 
} from './data/toolsConfig';

import { useI18n, extractLanguageFromPath, SupportedLanguage } from './i18n/I18nContext';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Dropzone } from './components/Dropzone';
import { ProcessingQueue } from './components/ProcessingQueue';
import { ResultsView } from './components/ResultsView';
import { ToolCatalog } from './components/ToolCatalog';
import { MyFilesView } from './components/MyFilesView';
import { ShareModal } from './components/ShareModal';
import { AuthModal } from './components/AuthModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { HowItWorks } from './components/HowItWorks';
import { SecuritySection } from './components/SecuritySection';
import { Footer } from './components/Footer';
import { FileConverterPage } from './components/FileConverterPage';
import { CategoryPage } from './components/CategoryPage';
import { SitemapView } from './components/SitemapView';
import { SharedFileView } from './components/SharedFileView';
import { GuideBlogPage } from './components/GuideBlogPage';
import { NewsBlogPage } from './components/NewsBlogPage';
import { NewsListPage } from './components/NewsListPage';
import { AdminBlogManager } from './components/admin/AdminBlogManager';
import { AdBanner } from './components/AdBanner';
import { CookieBanner } from './components/CookieBanner';
import { PrivacyPolicyModal, CookiePolicyModal } from './components/LegalModals';

export default function App() {
  const { language, setLanguage, getLocalizedPath } = useI18n();

  // Navigation & View State
  const [currentView, setCurrentView] = useState<'home' | 'convert' | 'compress' | 'category' | 'my-files' | 'tools' | 'tool-page' | 'guide-page' | 'news-page' | 'news-list' | 'admin' | 'sitemap' | 'share'>('home');
  const [currentToolSlug, setCurrentToolSlug] = useState<string | null>(null);
  const [currentCategorySlug, setCurrentCategorySlug] = useState<string>('convert');
  const [currentShareId, setCurrentShareId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeMode, setActiveMode] = useState<ToolType>('convert');

  // Queue & Processing State
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [savedFileIds, setSavedFileIds] = useState<string[]>([]);
  const [presetTargetFormat, setPresetTargetFormat] = useState<string | null>(null);

  // Storage & User State
  const [savedFiles, setSavedFiles] = useState<SavedFileItem[]>([]);
  const [user, setUser] = useState<UserProfile>(getUserProfile());

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [shareModalFiles, setShareModalFiles] = useState<any[] | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize Route from browser location pathname (with language prefix support ES/, US/, FR/)
  useEffect(() => {
    const handleLocationChange = () => {
      // Clear any prior file processing state when URL/location changes
      setQueue([]);
      setIsCompleted(false);
      setPresetTargetFormat(null);

      const rawPath = window.location.pathname;
      const { lang, pathWithoutLang } = extractLanguageFromPath(rawPath);

      // If URL does not have language prefix, redirect to /{LANG}/...
      const segments = rawPath.split('/').filter(Boolean);
      const firstSegment = segments.length > 0 ? segments[0].toLowerCase() : '';
      if (firstSegment !== 'es' && firstSegment !== 'us' && firstSegment !== 'en' && firstSegment !== 'fr') {
        const targetUrl = `/${lang.toUpperCase()}${rawPath === '/' ? '' : rawPath}`;
        window.history.replaceState({}, '', targetUrl);
      }

      const path = pathWithoutLang;

      if (path === '/admin' || path === '/admin/' || path.startsWith('/admin')) {
        setCurrentView('admin');
        setCurrentToolSlug(null);
      } else if (path === '/sitemap' || path === '/sitemap.xml') {
        setCurrentView('sitemap');
        setCurrentToolSlug(null);
      } else if (path.startsWith('/share/')) {
        const shareId = path.split('/share/')[1] || '';
        setCurrentView('share');
        setCurrentShareId(shareId);
        setCurrentToolSlug(null);
      } else if (path === '/my-files') {
        setCurrentView('my-files');
        setCurrentToolSlug(null);
      } else if (path === '/tools') {
        setCurrentView('tools');
        setCurrentToolSlug(null);
      } else if (path === '/convert' || path === '/convert/') {
        setCurrentView('category');
        setCurrentCategorySlug('convert');
        setCurrentToolSlug(null);
      } else if (path === '/compress' || path === '/compress/') {
        setCurrentView('category');
        setCurrentCategorySlug('compress');
        setCurrentToolSlug(null);
      } else if (
        path === '/convert/image' || 
        path === '/convert/video' || 
        path === '/convert/audio' || 
        path === '/convert/pdf' || 
        path === '/convert/gif' || 
        path === '/convert/zip' ||
        path.startsWith('/category/')
      ) {
        const catSlug = path.split('/').pop() || 'convert';
        setCurrentView('category');
        setCurrentCategorySlug(catSlug);
        setCurrentToolSlug(null);
      } else if (path === '/news' || path === '/news/' || path === '/noticias' || path === '/noticias/') {
        setCurrentView('news-list');
        setCurrentToolSlug(null);
      } else if (path.startsWith('/news/') || path.startsWith('/noticias/')) {
        const newsSlug = path.split('/').pop() || '';
        setCurrentView('news-page');
        setCurrentToolSlug(newsSlug);
      } else if (path.startsWith('/guide/') || path.startsWith('/how-to/')) {
        const slug = path.split('/').pop() || '';
        const tool = getToolBySlug(slug);
        if (tool) {
          setCurrentView('guide-page');
          setCurrentToolSlug(slug);
        } else {
          setCurrentView('tools');
          setCurrentToolSlug(null);
        }
      } else if (path.startsWith('/convert/') || path.startsWith('/compress/')) {
        const slug = path.split('/').pop() || '';
        const tool = getToolBySlug(slug);
        if (tool) {
          setCurrentView('tool-page');
          setCurrentToolSlug(tool.slug);
        } else {
          setCurrentView('tools');
          setCurrentToolSlug(null);
        }
      } else {
        setCurrentView('home');
        setCurrentToolSlug(null);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Load saved files on mount
  useEffect(() => {
    setSavedFiles(getSavedFiles());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add files to processing queue
  const handleFilesSelected = useCallback((files: File[], defaultAction?: ToolType, defaultTarget?: string) => {
    const actionToUse = defaultAction || activeMode;

    const newItems: QueuedFile[] = files.map((file) => {
      const { category, extension } = detectFileCategory(file);
      const targetFormat = defaultTarget || presetTargetFormat || getDefaultTargetFormat(category, extension, actionToUse);

      let previewUrl: string | undefined;
      if (category === 'image') {
        try {
          previewUrl = URL.createObjectURL(file);
        } catch (e) {}
      }

      const defaultOptions: ProcessingOptions = {
        quality: actionToUse === 'compress' ? 70 : 80,
        resizeMode: 'original',
        csvDelimiter: ',',
        indentJson: true,
        compressionLevel: 'balanced',
      };

      return {
        id: 'q_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        category,
        extension,
        previewUrl,
        actionType: actionToUse,
        targetFormat,
        options: defaultOptions,
        status: 'idle',
        progress: 0,
      };
    });

    setQueue((prev) => [...prev, ...newItems]);
    setIsCompleted(false);
    showToast(`Se han añadido ${newItems.length} ${newItems.length === 1 ? 'archivo' : 'archivos'} a la cola.`);
  }, [activeMode, presetTargetFormat]);

  // Remove file from queue
  const handleRemoveFile = (id: string) => {
    setQueue((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item?.previewUrl) {
        try {
          URL.revokeObjectURL(item.previewUrl);
        } catch (e) {}
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  // Clear entire queue
  const handleClearQueue = () => {
    queue.forEach((f) => {
      if (f.previewUrl) {
        try {
          URL.revokeObjectURL(f.previewUrl);
        } catch (e) {}
      }
    });
    setQueue([]);
    setIsCompleted(false);
    setPresetTargetFormat(null);
  };

  // Update target format for an item
  const handleUpdateFileTarget = (id: string, targetFormat: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, targetFormat } : item))
    );
  };

  // Update options for an item
  const handleUpdateFileOptions = (id: string, options: Partial<ProcessingOptions>) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, options: { ...item.options, ...options } } : item
      )
    );
  };

  // Update action type (convert vs compress)
  const handleUpdateFileAction = (id: string, actionType: ToolType) => {
    setQueue((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newTarget = getDefaultTargetFormat(item.category, item.extension, actionType);
          const newOptions = {
            ...item.options,
            quality: actionType === 'compress' && item.options.quality === 80 ? 70 : item.options.quality,
          };
          return { ...item, actionType, targetFormat: newTarget, options: newOptions };
        }
        return item;
      })
    );
  };

  // Set target format for all images in queue
  const handleBatchSetTarget = (format: string) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.category === 'image' ? { ...item, targetFormat: format } : item
      )
    );
    showToast(`Todos los formatos de imagen configurados a ${format}`);
  };

  // Start executing the processing pipeline
  const handleStartProcessing = async () => {
    if (queue.length === 0 || isProcessing) return;

    setIsProcessing(true);

    for (let i = 0; i < queue.length; i++) {
      const currentItem = queue[i];
      if (currentItem.status === 'completed') continue;

      setQueue((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: 'processing', progress: 10, statusMessage: 'Iniciando...' } : f
        )
      );

      try {
        const result = await executeFileOperation(
          currentItem,
          (progress, message) => {
            setQueue((prev) =>
              prev.map((f, idx) =>
                idx === i ? { ...f, progress, statusMessage: message } : f
              )
            );
          },
          currentToolConfig
        );

        setQueue((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? {
                  ...f,
                  status: 'completed',
                  progress: 100,
                  statusMessage: '¡Procesado exitosamente!',
                  resultId: result.resultId,
                  resultBlob: result.resultBlob,
                  resultName: result.resultName,
                  resultSize: result.resultSize,
                  savingsPercentage: result.savingsPercentage,
                  processedAt: Date.now(),
                }
              : f
          )
        );
      } catch (err: any) {
        setQueue((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? {
                  ...f,
                  status: 'error',
                  progress: 0,
                  statusMessage: 'Error de procesamiento',
                  errorMessage: err.message || 'No se pudo procesar el archivo',
                }
              : f
          )
        );
      }
    }

    setIsProcessing(false);
    setIsCompleted(true);
  };

  // Save single file to library
  const handleSaveToLibrary = (file: QueuedFile) => {
    const fileId = file.resultId || file.id;
    if (savedFileIds.includes(fileId)) return;

    const saved = saveFileToLibrary({
      id: fileId,
      name: file.resultName || file.name,
      originalSize: file.size,
      resultSize: file.resultSize || file.size,
      category: file.category,
      format: file.targetFormat,
      action: file.actionType,
      blob: file.resultBlob,
    });

    setSavedFiles(getSavedFiles());
    setSavedFileIds((prev) => [...prev, fileId]);
    showToast(`"${saved.name}" se guardó en Mis Archivos.`);
  };

  // Save all completed files to library
  const handleSaveAllToLibrary = () => {
    const completed = queue.filter((f) => f.status === 'completed' && !savedFileIds.includes(f.id));
    completed.forEach((file) => {
      saveFileToLibrary({
        name: file.resultName || file.name,
        originalSize: file.size,
        resultSize: file.resultSize || file.size,
        category: file.category,
        format: file.targetFormat,
        action: file.actionType,
        blob: file.resultBlob,
      });
    });

    setSavedFiles(getSavedFiles());
    setSavedFileIds((prev) => [...prev, ...completed.map((c) => c.id)]);
    showToast(`Se han guardado ${completed.length} archivos en tu biblioteca.`);
  };

  // Download single completed file
  const handleDownloadSingleFile = (file: QueuedFile) => {
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

  // Download all completed files in a single ZIP
  const handleDownloadAllZip = async () => {
    const completed = queue.filter((f) => f.status === 'completed' && f.resultBlob);
    if (completed.length === 0) return;

    try {
      showToast('Empaquetando archivo .ZIP...');
      const filesForZip = completed.map((f) => ({
        blob: f.resultBlob!,
        name: f.resultName || `${f.name.replace(/\.[^/.]+$/, '')}.${f.targetFormat.toLowerCase()}`,
      }));
      const zipBlob = await createBatchZip(filesForZip, 'MediaConvert_archivos_convertidos.zip');
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'MediaConvert_archivos_convertidos.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('Descarga del ZIP iniciada.');
    } catch (e) {
      showToast('No se pudo generar el archivo ZIP.');
    }
  };

  // Delete from library
  const handleDeleteSavedFile = (id: string) => {
    removeSavedFile(id);
    setSavedFiles(getSavedFiles());
    showToast('Archivo eliminado de tu biblioteca.');
  };

  // Select tool from catalog or quick search
  const handleSelectTool = (tool: FileTool) => {
    // Reset any previous queue state immediately
    handleClearQueue();

    if (tool.slug) {
      handleNavigate('tool-page', undefined, tool.slug);
      return;
    }

    if (tool.type === 'compress') {
      setActiveMode('compress');
      handleNavigate('compress');
    } else {
      setActiveMode('convert');
      handleNavigate('convert');
    }

    if (tool.toFormat) {
      setPresetTargetFormat(tool.toFormat);
    }
    if (tool.category) {
      setSelectedCategory(tool.category);
    }
  };

  // Universal Navigation Handler with Multilingual URL management (US/, ES/, FR/)
  const handleNavigate = (
    view: 'home' | 'convert' | 'compress' | 'category' | 'my-files' | 'tools' | 'tool-page' | 'guide-page' | 'news-page' | 'news-list' | 'admin' | 'sitemap' | 'share',
    catFilter?: FileCategory,
    toolSlug?: string,
    categorySlug?: string,
    shareId?: string
  ) => {
    // Reset file processing queue whenever user navigates to a new view or a new tool
    if (view !== currentView || toolSlug !== currentToolSlug) {
      handleClearQueue();
    }

    setCurrentView(view);

    if (view === 'tool-page' && toolSlug) {
      setCurrentToolSlug(toolSlug);
      const tool = getToolBySlug(toolSlug);
      if (tool) {
        window.history.pushState({}, '', getLocalizedPath(tool.routePath));
      }
    } else if (view === 'guide-page' && toolSlug) {
      setCurrentToolSlug(toolSlug);
      const tool = getToolBySlug(toolSlug);
      if (tool) {
        window.history.pushState({}, '', getLocalizedPath(`/guide/${tool.slug}`));
      }
    } else if (view === 'news-list') {
      setCurrentToolSlug(null);
      window.history.pushState({}, '', getLocalizedPath('/news'));
      document.title = 'Noticias y Tendencias — MediaConvert';
    } else if (view === 'news-page' && toolSlug) {
      setCurrentToolSlug(toolSlug);
      window.history.pushState({}, '', getLocalizedPath(`/news/${toolSlug}`));
      document.title = 'Artículo de Tendencias — MediaConvert';
    } else if (view === 'admin') {
      setCurrentToolSlug(null);
      window.history.pushState({}, '', getLocalizedPath('/admin'));
      document.title = 'Panel Administrativo — MediaConvert';
    } else if (view === 'share') {
      setCurrentToolSlug(null);
      setCurrentShareId(shareId || null);
      if (shareId) {
        window.history.pushState({}, '', getLocalizedPath(`/share/${shareId}`));
        document.title = 'Colección Compartida — MediaConvert';
      }
    } else if (view === 'category') {
      setCurrentToolSlug(null);
      const cat = categorySlug || (catFilter ? catFilter : 'convert');
      setCurrentCategorySlug(cat);
      const path = cat === 'convert' ? '/convert' : `/convert/${cat}`;
      window.history.pushState({}, '', getLocalizedPath(path));
      document.title = `${cat === 'convert' ? 'Todas las Herramientas' : cat.toUpperCase()} — MediaConvert`;
    } else if (view === 'sitemap') {
      setCurrentToolSlug(null);
      window.history.pushState({}, '', getLocalizedPath('/sitemap'));
      document.title = 'Mapa del Sitio — MediaConvert';
    } else if (view === 'my-files') {
      setCurrentToolSlug(null);
      window.history.pushState({}, '', getLocalizedPath('/my-files'));
      document.title = 'Mis Archivos Guardados — MediaConvert';
    } else if (view === 'tools') {
      setCurrentToolSlug(null);
      window.history.pushState({}, '', getLocalizedPath('/tools'));
      document.title = 'Catálogo de Herramientas de Archivo — MediaConvert';
    } else if (view === 'convert') {
      setCurrentToolSlug(null);
      setCurrentCategorySlug('convert');
      window.history.pushState({}, '', getLocalizedPath('/convert'));
      document.title = 'Conversor de Archivos Online Gratis — MediaConvert';
    } else if (view === 'compress') {
      setCurrentToolSlug(null);
      setCurrentCategorySlug('compress');
      window.history.pushState({}, '', getLocalizedPath('/compress'));
      document.title = 'Compresor de Archivos Online — MediaConvert';
    } else {
      setCurrentToolSlug(null);
      window.history.pushState({}, '', getLocalizedPath('/'));
      document.title = 'MediaConvert — Convierte y Comprime Archivos Online';
    }

    if (catFilter) {
      setSelectedCategory(catFilter);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login handler
  const handleLogin = (name: string, email: string) => {
    const updated = updateUserProfile({
      name,
      email,
      isLoggedIn: true,
    });
    setUser(updated);
    showToast(`¡Bienvenido de nuevo, ${name}!`);
  };

  // Logout handler
  const handleLogout = () => {
    const updated = updateUserProfile({
      name: 'Usuario Invitado',
      email: 'invitado@mediaconvert.online',
      isLoggedIn: false,
    });
    setUser(updated);
    showToast('Has cerrado sesión.');
  };

  // Resolve current active tool config if on a tool page
  const currentToolConfig = currentToolSlug ? getToolBySlug(currentToolSlug) : null;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-geometric-grid text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Header with Language Selector Dropdown */}
      <Header
        currentView={currentView as any}
        onNavigate={handleNavigate}
        savedFilesCount={savedFiles.length}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
      />

      {/* Main Content Area with Centered Div & Lateral AdSense Rails */}
      <main className="flex-1 pb-16">
        <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-center items-start gap-4 lg:gap-6">
            {/* Left Lateral Ad Rail (Google AdSense Skyscraper) */}
            <div className="hidden xl:block w-[160px] 2xl:w-[180px] shrink-0 sticky top-20 self-start space-y-6 pt-4">
              <AdBanner slotType="vertical-skyscraper" />
            </div>

            {/* Central Main Content Container */}
            <div className="flex-1 min-w-0 max-w-5xl w-full mx-auto">
              {/* Optional Top Leaderboard Ad */}
              <AdBanner slotType="horizontal-leaderboard" className="mb-6" />

              {currentView === 'admin' ? (
                /* View: Admin Blog CMS & Builder Panel */
                <AdminBlogManager
                  onNavigate={handleNavigate}
                  onPreviewPost={(slug) => handleNavigate('guide-page', undefined, slug)}
                />
              ) : currentView === 'sitemap' ? (
                /* View: Sitemap & Directory for Crawlers and Users */
                <SitemapView onNavigate={handleNavigate} />
              ) : currentView === 'share' ? (
                /* View: Colección Compartida (/share/:id) */
                <SharedFileView
                  shareId={currentShareId || ''}
                  onNavigateHome={() => handleNavigate('home')}
                />
              ) : currentView === 'category' ? (
                /* View: Category Discovery & Navigation Hub */
                <CategoryPage
                  categorySlug={currentCategorySlug}
                  onNavigate={handleNavigate}
                />
              ) : currentView === 'news-list' ? (
                /* View: Noticias y Tendencias — índice de artículos */
                <NewsListPage onNavigate={handleNavigate} />
              ) : currentView === 'news-page' && currentToolSlug ? (
                /* View: Artículo individual de Noticias y Tendencias */
                <NewsBlogPage
                  slug={currentToolSlug}
                  onNavigate={handleNavigate}
                />
              ) : currentView === 'guide-page' && currentToolConfig ? (
                /* View: ¿Cómo se usa? Blog / Tutorial Page (SEO Driven) */
                <GuideBlogPage
                  tool={currentToolConfig}
                  onNavigate={handleNavigate}
                />
              ) : currentView === 'tool-page' && currentToolConfig ? (
                /* View: Individual Independent SEO Tool Page */
                <FileConverterPage
                  tool={currentToolConfig}
                  queue={queue}
                  isProcessing={isProcessing}
                  user={user}
                  onFilesSelected={handleFilesSelected}
                  onUpdateFileTarget={handleUpdateFileTarget}
                  onUpdateFileOptions={handleUpdateFileOptions}
                  onRemoveFile={handleRemoveFile}
                  onStartProcessing={handleStartProcessing}
                  onDownloadFile={handleDownloadSingleFile}
                  onDownloadAllZip={handleDownloadAllZip}
                  onSaveFile={handleSaveToLibrary}
                  onSaveAll={handleSaveAllToLibrary}
                  onShareFiles={(files) => setShareModalFiles(files)}
                  onReset={handleClearQueue}
                  onNavigate={handleNavigate}
                  savedFileIds={savedFileIds}
                />
              ) : currentView === 'my-files' ? (
                /* View: Mis Archivos */
                <MyFilesView
                  files={savedFiles}
                  user={user}
                  onDeleteFile={handleDeleteSavedFile}
                  onOpenShareModal={(files) => setShareModalFiles(files)}
                  onNavigateHome={() => handleNavigate('home')}
                />
              ) : currentView === 'tools' ? (
                /* View: Catálogo completo de herramientas */
                <div className="pt-2">
                  <ToolCatalog
                    onSelectTool={handleSelectTool}
                    onNavigateToTool={(slug) => handleNavigate('tool-page', undefined, slug)}
                    onNavigateToGuide={(slug) => handleNavigate('guide-page', undefined, slug)}
                    initialCategory={(selectedCategory as any) || 'all'}
                  />
                </div>
              ) : (
                /* Main Workspace View: Home / Convert / Compress */
                <div className="space-y-10">
                  {/* Hero Section */}
                  <Hero
                    onSelectCategory={(cat) => setSelectedCategory(cat)}
                    activeCategory={selectedCategory}
                  />

                  {/* Core Interactive Area: Dropzone, Queue, or Results */}
                  <div className="w-full">
                    {isCompleted && queue.some((q) => q.status === 'completed') ? (
                      /* 3. Results View */
                      <ResultsView
                        completedFiles={queue.filter((q) => q.status === 'completed')}
                        onReset={handleClearQueue}
                        onSaveToLibrary={handleSaveToLibrary}
                        onSaveAllToLibrary={handleSaveAllToLibrary}
                        onOpenShareModal={(files) => setShareModalFiles(files)}
                        savedFileIds={savedFileIds}
                      />
                    ) : queue.length > 0 ? (
                      /* 2. Processing Queue View */
                      <ProcessingQueue
                        queue={queue}
                        onRemoveFile={handleRemoveFile}
                        onClearQueue={handleClearQueue}
                        onUpdateFileTarget={handleUpdateFileTarget}
                        onUpdateFileOptions={handleUpdateFileOptions}
                        onUpdateFileAction={handleUpdateFileAction}
                        onStartProcessing={handleStartProcessing}
                        onAddMoreFiles={() => {
                          const input = document.getElementById('file-input-element');
                          input?.click();
                        }}
                        isProcessing={isProcessing}
                        onBatchSetTarget={handleBatchSetTarget}
                      />
                    ) : (
                      /* 1. Upload Dropzone */
                      <Dropzone
                        onFilesSelected={handleFilesSelected}
                        activeMode={activeMode}
                        onModeChange={(mode) => setActiveMode(mode)}
                        selectedCategory={selectedCategory}
                        onCategoryChange={(cat) => setSelectedCategory(cat)}
                        isQueueEmpty={queue.length === 0}
                      />
                    )}
                  </div>

                  {/* Tool Catalog on Homepage for Discovery */}
                  <ToolCatalog
                    onSelectTool={handleSelectTool}
                    onNavigateToTool={(slug) => handleNavigate('tool-page', undefined, slug)}
                    onNavigateToGuide={(slug) => handleNavigate('guide-page', undefined, slug)}
                    initialCategory={(selectedCategory as any) || 'all'}
                  />

                  {/* How It Works 3-Step Flow */}
                  <HowItWorks />

                  {/* Security & Integrity Commitment */}
                  <SecuritySection />
                </div>
              )}

              {/* Bottom Leaderboard Ad before Footer */}
              <AdBanner slotType="horizontal-leaderboard" className="mt-12" />
            </div>

            {/* Right Lateral Ad Rail (Google AdSense Skyscraper) */}
            <div className="hidden xl:block w-[160px] 2xl:w-[180px] shrink-0 sticky top-20 self-start space-y-6 pt-4">
              <AdBanner slotType="vertical-skyscraper" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={handleNavigate}
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
        onOpenCookiePolicy={() => setIsCookieModalOpen(true)}
      />

      {/* Cookie Consent Banner */}
      <CookieBanner
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
        onOpenCookiePolicy={() => setIsCookieModalOpen(true)}
      />

      {/* Legal Modals */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <CookiePolicyModal
        isOpen={isCookieModalOpen}
        onClose={() => setIsCookieModalOpen(false)}
      />

      {/* Share Modal */}
      {shareModalFiles && (
        <ShareModal
          files={shareModalFiles}
          onClose={() => setShareModalFiles(null)}
        />
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {/* Quick Search Modal (Cmd+K) */}
      <QuickSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectTool={handleSelectTool}
        onNavigateToTool={(slug) => handleNavigate('tool-page', undefined, slug)}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
