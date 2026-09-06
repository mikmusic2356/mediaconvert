import React, { useState } from 'react';
import { 
  Layers, 
  RefreshCw, 
  Minimize2, 
  FolderLock, 
  User, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles, 
  Image as ImageIcon, 
  FileText, 
  Music, 
  Video, 
  Archive,
  Film,
  ShieldCheck,
  Check,
  Globe,
  ArrowRight,
  Zap,
  ChevronRight
} from 'lucide-react';
import { FileCategory, UserProfile } from '../types';
import { useI18n, LANGUAGES, SupportedLanguage } from '../i18n/I18nContext';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: any, categoryFilter?: FileCategory, toolSlug?: string, categorySlug?: string) => void;
  savedFilesCount: number;
  user: UserProfile;
  onOpenAuth: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  savedFilesCount,
  user,
  onOpenAuth,
  onOpenSearch,
}) => {
  const { language, setLanguage, t } = useI18n();
  const [convertDropdownOpen, setConvertDropdownOpen] = useState(false);
  const [compressDropdownOpen, setCompressDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileConvertOpen, setMobileConvertOpen] = useState(false);
  const [mobileCompressOpen, setMobileCompressOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Sub-categorías para el desplegable de Convertir
  const convertSubcategories = [
    {
      id: 'image',
      name: t.catImage,
      icon: ImageIcon,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      categorySlug: 'image',
      tools: [
        { name: 'JPG a PNG', slug: 'jpg-to-png' },
        { name: 'PNG a JPG', slug: 'png-to-jpg' },
        { name: 'WebP a PNG', slug: 'webp-to-png' },
        { name: 'WebP a JPG', slug: 'webp-to-jpg' },
        { name: 'HEIC a JPG', slug: 'heic-to-jpg' },
        { name: 'HEIC a PNG', slug: 'heic-to-png' },
        { name: 'PNG a SVG', slug: 'png-to-svg' },
        { name: 'JFIF a PNG', slug: 'jfif-to-png' },
      ]
    },
    {
      id: 'video',
      name: 'Video',
      icon: Video,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      categorySlug: 'video',
      tools: [
        { name: 'MOV a MP4', slug: 'mov-to-mp4' },
        { name: 'Video a MP3', slug: 'video-to-mp3' },
        { name: 'MP4 a MP3', slug: 'mp4-to-mp3' },
        { name: 'Conversor de Video', slug: 'video-converter' },
      ]
    },
    {
      id: 'audio',
      name: 'Audio',
      icon: Music,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      categorySlug: 'audio',
      tools: [
        { name: 'MP3 a WAV', slug: 'mp3-to-wav' },
        { name: 'WAV a MP3', slug: 'wav-to-mp3' },
        { name: 'MP3 a OGG', slug: 'mp3-to-ogg' },
        { name: 'Conversor MP3', slug: 'mp3-converter' },
      ]
    },
    {
      id: 'document',
      name: t.catPdfDoc,
      icon: FileText,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      categorySlug: 'pdf',
      tools: [
        { name: 'PDF a Word (DOCX)', slug: 'pdf-to-word' },
        { name: 'Word (DOCX) a PDF', slug: 'docx-to-pdf' },
        { name: 'PDF a JPG', slug: 'pdf-to-jpg' },
        { name: 'JPG a PDF', slug: 'jpg-to-pdf' },
        { name: 'HEIC a PDF', slug: 'heic-to-pdf' },
        { name: 'PDF a EPUB', slug: 'pdf-to-epub' },
        { name: 'CSV a JSON', slug: 'csv-to-json' },
        { name: 'JSON a CSV', slug: 'json-to-csv' },
      ]
    },
    {
      id: 'gif',
      name: t.catGif,
      icon: Film,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      categorySlug: 'gif',
      tools: [
        { name: 'Video a GIF', slug: 'video-to-gif' },
        { name: 'MP4 a GIF', slug: 'mp4-to-gif' },
        { name: 'GIF a MP4', slug: 'gif-to-mp4' },
        { name: 'WebM a GIF', slug: 'webm-to-gif' },
        { name: 'Imagen a GIF', slug: 'image-to-gif' },
      ]
    },
  ];

  // Sub-categorías para el desplegable de Comprimir
  const compressSubcategories = [
    {
      id: 'image-compress',
      name: t.catImage,
      icon: ImageIcon,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      categorySlug: 'image',
      tools: [
        { name: 'Comprimir JPG / JPEG', slug: 'compress-jpg', badge: '-80%' },
        { name: 'Comprimir PNG', slug: 'compress-png', badge: '-70%' },
        { name: 'Comprimir WebP', slug: 'compress-webp', badge: 'Ultra' },
      ]
    },
    {
      id: 'document-compress',
      name: 'Documentos & PDF',
      icon: FileText,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      categorySlug: 'pdf',
      tools: [
        { name: 'Comprimir PDF', slug: 'compress-pdf', badge: 'Nativo' },
      ]
    },
    {
      id: 'video-audio-compress',
      name: 'Video & Audio',
      icon: Video,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      categorySlug: 'video',
      tools: [
        { name: 'Comprimir Video MP4', slug: 'compress-mp4', badge: 'HD' },
        { name: 'Comprimir Audio MP3', slug: 'compress-mp3', badge: 'Bitrate' },
      ]
    },
    {
      id: 'archive-compress',
      name: t.catZip,
      icon: Archive,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
      categorySlug: 'zip',
      tools: [
        { name: 'Empaquetar y Crear ZIP', slug: 'files-to-zip', badge: 'JSZip' },
      ]
    },
  ];

  const currentLangInfo = LANGUAGES[language] || LANGUAGES.es;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-8 lg:gap-10">
            <button
              id="header-logo-button"
              onClick={() => onNavigate('home')}
              className="group flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1 -ml-1 transition-transform active:scale-95"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-600/25 group-hover:bg-blue-700 transition-colors">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                MEDIA<span className="text-blue-600">CONVERT</span>
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 lg:gap-3 text-[14px] font-semibold text-slate-600">
              
              {/* --- DESPLEGABLE CONVERTIR (POR SUB-CATEGORIAS) --- */}
              <div 
                className="relative"
                onMouseEnter={() => setConvertDropdownOpen(true)}
                onMouseLeave={() => setConvertDropdownOpen(false)}
              >
                <button
                  id="nav-convert-btn"
                  onClick={() => {
                    onNavigate('convert');
                    setConvertDropdownOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'convert' || convertDropdownOpen
                      ? 'text-blue-600 bg-blue-50'
                      : 'hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.convert}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${convertDropdownOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>

                {/* Mega Menú de Convertidores Organizados por Sub-categorías */}
                {convertDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[640px] rounded-2xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-900/15 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {t.convert} — {t.categories}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">Explora conversores nativos sin límites ni registros</p>
                      </div>
                      <button
                        onClick={() => {
                          onNavigate('convert');
                          setConvertDropdownOpen(false);
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <span>{t.allTools}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
                      {convertSubcategories.map((subcat) => {
                        const Icon = subcat.icon;
                        return (
                          <div key={subcat.id} className="space-y-1.5 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                            {/* Cabecera de la subcategoría */}
                            <button
                              onClick={() => {
                                onNavigate('category', undefined, undefined, subcat.categorySlug);
                                setConvertDropdownOpen(false);
                              }}
                              className="w-full flex items-center justify-between text-left group pb-1 border-b border-slate-200/60"
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${subcat.color}`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                  {subcat.name}
                                </span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                            </button>

                            {/* Lista de herramientas de la subcategoría */}
                            <div className="grid grid-cols-2 gap-1 pt-1">
                              {subcat.tools.map((tool) => (
                                <button
                                  key={tool.slug}
                                  onClick={() => {
                                    onNavigate('tool-page', undefined, tool.slug);
                                    setConvertDropdownOpen(false);
                                  }}
                                  className="text-left px-2 py-1 rounded-md text-[12px] font-medium text-slate-600 hover:text-blue-600 hover:bg-white hover:shadow-2xs transition-all truncate"
                                  title={tool.name}
                                >
                                  • {tool.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Aceleración local por GPU • Sin subir a servidores
                      </span>
                      <button
                        onClick={() => {
                          onNavigate('convert');
                          setConvertDropdownOpen(false);
                        }}
                        className="font-bold text-blue-600 hover:underline"
                      >
                        Ver todos los convertidores →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* --- DESPLEGABLE COMPRIMIR (POR SUB-CATEGORIAS) --- */}
              <div 
                className="relative"
                onMouseEnter={() => setCompressDropdownOpen(true)}
                onMouseLeave={() => setCompressDropdownOpen(false)}
              >
                <button
                  id="nav-compress-btn"
                  onClick={() => {
                    onNavigate('compress');
                    setCompressDropdownOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'compress' || compressDropdownOpen
                      ? 'text-blue-600 bg-blue-50'
                      : 'hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>{t.compress}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${compressDropdownOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>

                {/* Menú de Compresores Organizados por Sub-categorías */}
                {compressDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[480px] rounded-2xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-900/15 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {t.compress} — {t.filterCompressors}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">Optimización de tamaño inteligente sin pérdida perceptible</p>
                      </div>
                      <button
                        onClick={() => {
                          onNavigate('compress');
                          setCompressDropdownOpen(false);
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <span>{t.filterCompressors}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {compressSubcategories.map((subcat) => {
                        const Icon = subcat.icon;
                        return (
                          <div key={subcat.id} className="space-y-1.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                            {/* Cabecera de la subcategoría */}
                            <div className="flex items-center gap-2 pb-1 border-b border-slate-200/60">
                              <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${subcat.color}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs font-bold text-slate-800">
                                {subcat.name}
                              </span>
                            </div>

                            {/* Herramientas de compresión */}
                            <div className="space-y-1 pt-1">
                              {subcat.tools.map((tool) => (
                                <button
                                  key={tool.slug}
                                  onClick={() => {
                                    onNavigate('tool-page', undefined, tool.slug);
                                    setCompressDropdownOpen(false);
                                  }}
                                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[12px] font-medium text-slate-700 hover:text-blue-600 hover:bg-white hover:shadow-2xs transition-all text-left group"
                                >
                                  <span className="truncate group-hover:translate-x-0.5 transition-transform">• {tool.name}</span>
                                  {tool.badge && (
                                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded ml-1 shrink-0">
                                      {tool.badge}
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Privacidad 100% garantizada
                      </span>
                      <button
                        onClick={() => {
                          onNavigate('compress');
                          setCompressDropdownOpen(false);
                        }}
                        className="font-bold text-blue-600 hover:underline"
                      >
                        Ver todos los compresores (/compress) →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct links */}
              <button
                id="nav-my-files-btn"
                onClick={() => onNavigate('my-files')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'my-files'
                    ? 'text-blue-600 bg-blue-50'
                    : 'hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <FolderLock className="w-3.5 h-3.5" />
                <span>{t.myFiles}</span>
                {savedFilesCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[11px] font-bold bg-blue-100 text-blue-700 rounded-full">
                    {savedFilesCount}
                  </span>
                )}
              </button>

              <button
                id="nav-news-btn"
                onClick={() => onNavigate('news-list')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'news-list' || currentView === 'news-page'
                    ? 'text-orange-600 bg-orange-50 font-bold'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
                }`}
                title={t.newsAndTrends}
              >
                <span className="text-orange-500 text-sm">🔥</span>
                <span>{t.newsAndTrends}</span>
              </button>

              <button
                id="nav-admin-blog-btn"
                onClick={() => onNavigate('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentView === 'admin'
                    ? 'text-indigo-700 bg-indigo-50 border border-indigo-200 shadow-xs'
                    : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                }`}
                title="Constructor & Panel de Blogs SEO"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t.adminBlog}</span>
              </button>
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Selector Dropdown (Bandera + Iniciales del idioma) */}
            <div className="relative">
              <button
                id="language-selector-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                onBlur={() => setTimeout(() => setLangDropdownOpen(false), 200)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl transition-all shadow-2xs"
                title={t.chooseLanguage}
                aria-label={t.chooseLanguage}
              >
                <span className="text-base leading-none">{currentLangInfo.flag}</span>
                <span className="font-mono uppercase tracking-wider">{currentLangInfo.code}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-900/10 p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t.chooseLanguage}</p>
                  </div>
                  {(Object.keys(LANGUAGES) as SupportedLanguage[]).map((langKey) => {
                    const l = LANGUAGES[langKey];
                    const isSelected = language === l.code;
                    return (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                          isSelected
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{l.flag}</span>
                          <span>{l.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-bold">
                            /{l.code.toUpperCase()}
                          </span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Search Button */}
            <button
              id="header-search-btn"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-all"
              title={t.search}
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden lg:inline">{t.search}</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded">
                ⌘K
              </kbd>
            </button>

            {/* User Account / Iniciar Sesión */}
            <button
              id="header-user-account-btn"
              onClick={onOpenAuth}
              className={`text-xs sm:text-[13px] font-semibold px-3 py-2 rounded-lg transition-colors ${
                user.isLoggedIn
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {user.isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </div>
              ) : (
                <span>{t.login}</span>
              )}
            </button>

            {/* Mobile menu hamburger */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg max-h-[85vh] overflow-y-auto">
          {/* Mobile Language Selector */}
          <div className="p-2 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.chooseLanguage}:</span>
            </span>
            <div className="flex items-center gap-1">
              {(Object.keys(LANGUAGES) as SupportedLanguage[]).map((langKey) => {
                const l = LANGUAGES[langKey];
                const isSelected = language === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.code.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secciones Desplegables de Convertir y Comprimir para Móviles */}
          <div className="space-y-2 pt-1">
            {/* Convertir en Móvil */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
              <div className="flex items-center justify-between p-3 bg-white">
                <button
                  onClick={() => {
                    onNavigate('convert');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-blue-600"
                >
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  <span>{t.convert}</span>
                </button>
                <button
                  onClick={() => setMobileConvertOpen(!mobileConvertOpen)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                  aria-label="Toggle subcategories"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileConvertOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {mobileConvertOpen && (
                <div className="p-3 border-t border-slate-100 space-y-3 bg-slate-50">
                  {convertSubcategories.map((subcat) => (
                    <div key={subcat.id} className="space-y-1">
                      <p className="text-xs font-bold text-slate-700">{subcat.name}</p>
                      <div className="grid grid-cols-2 gap-1">
                        {subcat.tools.slice(0, 4).map((tool) => (
                          <button
                            key={tool.slug}
                            onClick={() => {
                              onNavigate('tool-page', undefined, tool.slug);
                              setMobileMenuOpen(false);
                            }}
                            className="text-left px-2 py-1 text-xs text-slate-600 hover:text-blue-600 hover:bg-white rounded"
                          >
                            • {tool.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      onNavigate('convert');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg text-center"
                  >
                    Ver todos los convertidores →
                  </button>
                </div>
              )}
            </div>

            {/* Comprimir en Móvil */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
              <div className="flex items-center justify-between p-3 bg-white">
                <button
                  onClick={() => {
                    onNavigate('compress');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-blue-600"
                >
                  <Minimize2 className="w-4 h-4 text-blue-600" />
                  <span>{t.compress}</span>
                </button>
                <button
                  onClick={() => setMobileCompressOpen(!mobileCompressOpen)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                  aria-label="Toggle compressors"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileCompressOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {mobileCompressOpen && (
                <div className="p-3 border-t border-slate-100 space-y-3 bg-slate-50">
                  {compressSubcategories.map((subcat) => (
                    <div key={subcat.id} className="space-y-1">
                      <p className="text-xs font-bold text-slate-700">{subcat.name}</p>
                      <div className="space-y-1">
                        {subcat.tools.map((tool) => (
                          <button
                            key={tool.slug}
                            onClick={() => {
                              onNavigate('tool-page', undefined, tool.slug);
                              setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-2 py-1 text-xs text-slate-600 hover:text-blue-600 hover:bg-white rounded"
                          >
                            <span>• {tool.name}</span>
                            {tool.badge && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                                {tool.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      onNavigate('compress');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg text-center"
                  >
                    Ver todos los compresores →
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              onNavigate('my-files');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-medium ${
              currentView === 'my-files' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-blue-600" />
              <span>{t.myFiles}</span>
            </div>
            {savedFilesCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-full">
                {savedFilesCount}
              </span>
            )}
          </button>

          <div className="pt-2 border-t border-slate-100 space-y-1">
            <button
              onClick={() => {
                onNavigate('news-list');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-200 text-sm font-bold text-orange-800"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🔥</span>
                <span>{t.newsAndTrends}</span>
              </div>
              <span className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded-full uppercase font-black">{t.newBadge}</span>
            </button>

            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-sm font-bold text-indigo-800"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>{t.adminBlog}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

