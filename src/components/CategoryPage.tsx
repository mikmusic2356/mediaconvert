import React, { useState, useMemo } from 'react';
import { 
  FileCategory, 
  ToolConfig,
  ToolType
} from '../types';
import { 
  CATEGORIES_CONFIG, 
  getAllToolConfigs, 
  getToolsByCategory,
  getToolBySlug 
} from '../data/toolsConfig';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  ChevronRight, 
  Layers, 
  CheckCircle2,
  SlidersHorizontal,
  FileCheck,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { useI18n, getLocalizedToolConfig } from '../i18n/I18nContext';

interface CategoryPageProps {
  categorySlug: string; // 'convert' | 'image' | 'video' | 'audio' | 'video-audio' | 'pdf' | 'document' | 'pdf-document' | 'gif' | 'archive'
  onNavigate: (view: any, categoryFilter?: FileCategory, toolSlug?: string, categorySlug?: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  onNavigate
}) => {
  const { t, language } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'convert' | 'compress' | 'utility'>('all');

  // Determinar la categoría activa a partir del slug de URL
  const normalizedCategoryKey = useMemo(() => {
    const slug = categorySlug.toLowerCase().replace(/^\/+|\/+$/g, '');
    if (slug === 'compress' || slug === 'comprimir' || slug === 'compresser') return 'compress';
    if (slug === 'convert' || slug === 'all' || slug === 'todas') return 'all';
    if (slug === 'image' || slug === 'imagen' || slug === 'imagenes') return 'image';
    if (slug === 'video' || slug === 'audio' || slug === 'video-audio') return 'video-audio';
    if (slug === 'pdf' || slug === 'document' || slug === 'documentos' || slug === 'pdf-document' || slug === 'pdf-documentos') return 'pdf-document';
    if (slug === 'gif' || slug === 'gifs') return 'gif';
    if (slug === 'archive' || slug === 'zip' || slug === 'archivos-zip') return 'archive';
    return 'all';
  }, [categorySlug]);

  const categoryMeta = useMemo(() => {
    if (normalizedCategoryKey === 'compress') {
      return {
        id: 'compress',
        name: t.filterCompressors,
        emoji: '🗜️',
        description: language === 'us'
          ? 'Fast, private in-browser compression tools for JPG, PNG, WebP, MP4, MP3, and PDF files.'
          : language === 'fr'
          ? 'Outils de compression rapides et privés dans votre navigateur pour JPG, PNG, WebP, MP4, MP3 et PDF.'
          : 'Herramientas de compresión rápida y privada en tu navegador para archivos JPG, PNG, WebP, MP4, MP3 y PDF.',
        longDescription: language === 'us'
          ? 'Reduce file sizes without quality loss using smart local hardware acceleration and zero cloud uploads.'
          : language === 'fr'
          ? 'Réduisez la taille de vos fichiers sans perte de qualité avec une accélération matérielle locale et sans transfert cloud.'
          : 'Reduce el peso de tus archivos sin perder calidad usando aceleración de hardware local sin subir datos a la nube.',
        h1: `${t.filterCompressors} — MediaConvert`,
        breadcrumbs: [{ label: t.home, target: 'home' }, { label: t.compress, target: 'compress' }]
      };
    }

    if (normalizedCategoryKey === 'all') {
      return {
        id: 'all',
        name: t.catAll,
        emoji: '⚡',
        description: t.catalogSubtitle,
        longDescription: t.heroSubtitle,
        h1: t.catalogTitle,
        breadcrumbs: [{ label: t.home, target: 'home' }, { label: t.convert, target: 'category' }]
      };
    }

    const catDef = CATEGORIES_CONFIG.find(c => c.id === normalizedCategoryKey);
    
    // Configuración detallada para cada categoría
    switch (normalizedCategoryKey) {
      case 'image':
        return {
          id: 'image',
          name: t.catImage,
          emoji: '🖼️',
          description: t.catImageDesc,
          longDescription: language === 'us' 
            ? 'Transform your photos, logos, and vector graphics with highest chroma fidelity. In-browser local processing.' 
            : language === 'fr' 
            ? 'Transformez vos photos, logos et graphiques avec une fidélité chromatique maximale directement dans votre navigateur.' 
            : 'Transforma tus fotos, logotipos y gráficos vectoriales con la máxima fidelidad cromática en tu navegador.',
          h1: `${t.catImage}: ${t.filterConverters} & ${t.filterCompressors}`,
          breadcrumbs: [{ label: t.home, target: 'home' }, { label: t.convert, target: 'category-all' }, { label: t.catImage, target: 'category-current' }]
        };
      case 'video-audio':
        return {
          id: 'video-audio',
          name: t.catVideoAudio,
          emoji: '🎵',
          description: t.catVideoAudioDesc,
          longDescription: language === 'us'
            ? 'Extract high-fidelity MP3 audio, transform MP4, WebM, MOV videos, and optimize sound tracks without cloud uploads.'
            : language === 'fr'
            ? 'Extrayez un son MP3 haute fidélité, convertissez des vidéos MP4, WebM, MOV et optimisez des pistes audio sans passer par le cloud.'
            : 'Extrae audio a MP3 de alta fidelidad, transforma videos MP4, WebM, MOV y optimiza pistas sonoras sin subir archivos a la nube.',
          h1: `${t.catVideoAudio}: ${t.filterConverters}`,
          breadcrumbs: [{ label: t.home, target: 'home' }, { label: t.convert, target: 'category-all' }, { label: t.catVideoAudio, target: 'category-current' }]
        };
      case 'pdf-document':
        return {
          id: 'pdf-document',
          name: t.catPdfDoc,
          emoji: '📄',
          description: t.catPdfDocDesc,
          longDescription: language === 'us'
            ? 'Convert PDF documents to editable Word DOCX, images to PDF, compress PDFs, and manage EPUB books with zero cloud upload.'
            : language === 'fr'
            ? 'Convertissez vos documents PDF en Word DOCX éditable, images en PDF, compressez les PDF et traitez les livres EPUB en toute sécurité.'
            : 'Convierte documentos PDF a Word DOCX, imágenes JPG/PNG a PDF, comprime archivos PDF y gestiona libros EPUB de forma segura.',
          h1: `${t.catPdfDoc}: ${t.filterConverters}`,
          breadcrumbs: [{ label: t.home, target: 'home' }, { label: t.convert, target: 'category-all' }, { label: t.catPdfDoc, target: 'category-current' }]
        };
      case 'gif':
        return {
          id: 'gif',
          name: t.catGif,
          emoji: '🎞️',
          description: t.catGifDesc,
          longDescription: language === 'us'
            ? 'Create smooth GIF animations from MP4 videos, convert GIFs to lightweight WebM, and optimize animated loops for the web.'
            : language === 'fr'
            ? 'Créez des animations GIF fluides depuis des vidéos MP4, convertissez des GIF en WebM léger et optimisez des boucles animées.'
            : 'Crea animaciones GIF fluidas desde videos MP4, convierte GIFs a WebM ligero y optimiza bucles animados para web.',
          h1: `${t.catGif}: ${t.filterConverters}`,
          breadcrumbs: [{ label: t.home, target: 'home' }, { label: t.convert, target: 'category-all' }, { label: t.catGif, target: 'category-current' }]
        };
      case 'archive':
        return {
          id: 'archive',
          name: t.catZip,
          emoji: '📦',
          description: t.catZipDesc,
          longDescription: language === 'us'
            ? 'Compress dozens of files into secure .ZIP packages using instant in-browser DEFLATE algorithm in local RAM.'
            : language === 'fr'
            ? 'Compressez des dizaines de fichiers dans des archives .ZIP sécurisées grâce à l’algorithme DEFLATE instantané en mémoire RAM.'
            : 'Comprime decenas de archivos en contenedores .ZIP seguros con algoritmo DEFLATE instantáneo en memoria RAM.',
          h1: `${t.catZip}: ${t.filterCompressors}`,
          breadcrumbs: [{ label: t.home, target: 'home' }, { label: t.convert, target: 'category-all' }, { label: t.catZip, target: 'category-current' }]
        };
      default:
        return {
          id: 'all',
          name: catDef?.name || t.catAll,
          emoji: catDef?.emoji || '⚡',
          description: catDef?.description || t.catalogSubtitle,
          longDescription: t.heroSubtitle,
          h1: catDef?.name ? `${catDef.name}` : t.catalogTitle,
          breadcrumbs: [{ label: t.home, target: 'home' }, { label: t.convert, target: 'category-all' }]
        };
    }
  }, [normalizedCategoryKey, t, language]);

  // Lista de herramientas asociadas a la categoría
  const categoryTools = useMemo(() => {
    let list: ToolConfig[] = [];
    if (normalizedCategoryKey === 'compress') {
      list = getAllToolConfigs().filter(t => t.type === 'compress');
    } else if (normalizedCategoryKey === 'all') {
      list = getAllToolConfigs();
    } else {
      list = getToolsByCategory(normalizedCategoryKey as FileCategory);
    }

    const localizedList = list.map(t => getLocalizedToolConfig(t, language));

    return localizedList.filter(tool => {
      // Filtro de tipo (convert / compress / utility)
      const matchType = typeFilter === 'all' || tool.type === typeFilter;
      
      // Filtro de búsqueda
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        tool.name.toLowerCase().includes(q) ||
        tool.h1.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.inputFormats.some(fmt => fmt.toLowerCase().includes(q)) ||
        tool.outputFormats.some(fmt => fmt.toLowerCase().includes(q)) ||
        tool.slug.toLowerCase().includes(q)
      );

      return matchType && matchSearch;
    });
  }, [normalizedCategoryKey, typeFilter, searchQuery, language]);

  return (
    <div className="w-full">
      {/* 1. Breadcrumbs de Navegación SEO */}
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
            onClick={() => onNavigate('category', undefined, undefined, 'convert')} 
            className="hover:text-blue-600 transition-colors capitalize"
          >
            {t.convert}
          </button>
          {normalizedCategoryKey !== 'all' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-900 font-semibold truncate">{categoryMeta.name}</span>
            </>
          )}
        </nav>
      </div>

      {/* 2. Category Header / Hub Discovery Hero */}
      <section className="w-full py-6 sm:py-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 shadow-xs border border-blue-100">
            <span className="text-sm">{categoryMeta.emoji}</span>
            <span>{t.toolsCategoryBadge}</span>
            <span className="text-blue-300">•</span>
            <span className="font-mono uppercase text-blue-800 font-bold">{categoryTools.length} {t.toolsCountBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            {categoryMeta.h1}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto mb-4">
            {categoryMeta.longDescription}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {t.noCloudUpload}
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              {t.guaranteeFast}
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-600" />
              {t.gpuAccelerated}
            </span>
          </div>
        </div>

        {/* 3. Category Selector Tabs (Interlinking entre Categorías) */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8 max-w-4xl mx-auto">
          <button
            onClick={() => onNavigate('category', undefined, undefined, 'convert')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              normalizedCategoryKey === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-[1.02]'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            ⚡ {t.filterAll} ({getAllToolConfigs().length})
          </button>
          {CATEGORIES_CONFIG.map((cat) => {
            const isActive = normalizedCategoryKey === cat.id;
            const count = getToolsByCategory(cat.id).length;
            const catLabel = cat.id === 'image' ? t.catImage : 
                             cat.id === 'video-audio' ? t.catVideoAudio : 
                             cat.id === 'pdf-document' ? t.catPdfDoc : 
                             cat.id === 'gif' ? t.catGif : t.catZip;
            
            // Map canonical category slugs for routing
            let routeParam = 'image';
            if (cat.id === 'video-audio') routeParam = 'video';
            else if (cat.id === 'pdf-document') routeParam = 'pdf';
            else if (cat.id === 'gif') routeParam = 'gif';
            else if (cat.id === 'archive') routeParam = 'zip';

            return (
              <button
                key={cat.id}
                onClick={() => onNavigate('category', cat.id, undefined, routeParam)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-[1.02]'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{catLabel}</span>
                <span className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* 4. Controls: Search Input + Type Filters */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm max-w-5xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search within category */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por formato (ej. PNG, MP3, PDF, WebP)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Type buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto justify-center">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  typeFilter === 'all'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todas ({categoryTools.length})
              </button>
              <button
                onClick={() => setTypeFilter('convert')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  typeFilter === 'convert'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Conversión
              </button>
              <button
                onClick={() => setTypeFilter('compress')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  typeFilter === 'compress'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Compresión
              </button>
            </div>
          </div>
        </div>

        {/* 5. Tool Grid: Cada tarjeta apunta a su página individual SEO específica */}
        <div className="max-w-5xl mx-auto">
          {categoryTools.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                No se encontraron herramientas
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                No hay herramientas que coincidan con la búsqueda "{searchQuery}". Intenta buscar por extensión como "JPG", "PNG" o "MP4".
              </p>
              <button
                onClick={() => { setSearchQuery(''); setTypeFilter('all'); }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => onNavigate('tool-page', undefined, tool.slug)}
                  className="group bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-900/5 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Top Tag & Type */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-mono text-[11px] font-bold uppercase border border-blue-100">
                        {tool.inputFormats.slice(0, 2).join(', ')} → {tool.defaultOutputFormat}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {tool.type === 'compress' ? 'Compresor' : 'Conversor'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                      {tool.shortName || tool.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                      {tool.description}
                    </p>
                  </div>

                  {/* Footer Link & Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
                    <span className="font-mono text-[11px] text-slate-400">
                      {tool.routePath}
                    </span>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-700">
                        <span>Abrir</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('guide-page', undefined, tool.slug);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-blue-600 hover:underline transition-colors py-0.5"
                      >
                        <BookOpen className="w-3 h-3 text-blue-500" />
                        <span>¿Cómo se usa?</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. Contextual SEO & Educational Explanation for Category */}
        <section className="max-w-5xl mx-auto mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Guía de Navegación & Uso
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-3">
              ¿Cómo elegir la herramienta adecuada en esta categoría?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Cada herramienta listada arriba está optimizada de manera especializada para un par de formatos de entrada y salida o una tarea específica de compresión. Al hacer clic en una herramienta particular, accederás a su interfaz dedicada donde podrás personalizar parámetros técnicos, ver comparativas detalladas y ejecutar la conversión de forma 100% aislada en tu dispositivo.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-900 block mb-1">🎯 Intención Específica</span>
                <span className="text-slate-500">Cada página individual cuenta con su propia optimización y parámetros técnicos.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-900 block mb-1">🔒 Seguridad Garantizada</span>
                <span className="text-slate-500">Los datos nunca se transfieren a servidores externos. Cero retención.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-900 block mb-1">⚡ Sin Esperas ni Colas</span>
                <span className="text-slate-500">Aprovecha la capacidad multihilo y GPU de tu hardware local.</span>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};
