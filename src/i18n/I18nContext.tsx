import React, { createContext, useContext, useState, useEffect } from 'react';
import { BlogPost, ToolConfig, FileTool } from '../types';

export type SupportedLanguage = 'es' | 'us' | 'fr';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  flag: string;
  prefix: string;
}

export const LANGUAGES: Record<SupportedLanguage, LanguageInfo> = {
  es: { code: 'es', name: 'Español', flag: '🇪🇸', prefix: 'es' },
  us: { code: 'us', name: 'English (US)', flag: '🇺🇸', prefix: 'us' },
  fr: { code: 'fr', name: 'Français', flag: '🇫🇷', prefix: 'fr' },
};

export const UI_TRANSLATIONS = {
  es: {
    // Navigation & Header
    chooseLanguage: 'Elige tu idioma',
    tools: 'Herramientas',
    categories: 'Categorías de Herramientas',
    convert: 'Convertir',
    compress: 'Comprimir',
    myFiles: 'Mis archivos',
    newsAndTrends: 'Noticias & Tendencias',
    adminBlog: 'Admin Blog',
    search: 'Buscar...',
    searchPlaceholder: 'Buscar herramientas de conversión (ej. JPG, WebP, PDF)...',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    allTools: 'Ver todas las herramientas disponibles',
    allOS: 'Todos los sistemas operativos',
    newBadge: 'Nuevo',
    home: 'Inicio',
    
    // Categories
    catAll: 'Todas las herramientas',
    catVideoAudio: 'Video & Audio',
    catVideoAudioDesc: 'MP4, MP3, MOV, OGG, Extraer Audio',
    catImage: 'Imagen',
    catImageDesc: 'JPG, PNG, WebP, HEIC, SVG, JFIF',
    catPdfDoc: 'PDF & Documentos',
    catPdfDocDesc: 'PDF, Word DOCX, EPUB, Libros',
    catGif: 'GIF',
    catGifDesc: 'Video a GIF, MP4 a GIF, APNG, Bucles',
    catZip: 'Archivos ZIP',
    catZipDesc: 'Empaquetador y compresor seguro',

    // Hero Section
    badgeNoAds: '100% Sin publicidad invasiva ni descargas engañosas',
    badgePrivacy: 'Privacidad local garantizada',
    heroTitlePart1: 'Convierte, comprime, guarda y ',
    heroTitlePart2: 'comparte tus archivos.',
    heroSubtitle: 'La plataforma tecnológica para procesar documentos, imágenes, vídeos y audio con máxima velocidad, privacidad local y sin intermediarios dudosos.',
    guaranteeFast: 'Procesamiento nativo ultra rápido',
    guaranteePrivacy: 'Tus archivos no se venden ni rastrean',
    guaranteeDownload: 'Descarga directa sin esperas',

    // Dropzone
    dropzoneTitle: 'Arrastra tus archivos aquí o haz clic para subir',
    dropzoneSubtitle: 'Soporta imágenes, vídeos, audios, documentos y archivos comprimidos de hasta 2 GB.',
    selectFiles: 'Seleccionar Archivos',
    pasteClipboard: 'o pega archivos desde el portapapeles (Ctrl + V)',
    convertingTo: 'Convirtiendo a',
    compressing: 'Comprimiendo',
    
    // Tool Catalog
    catalogBadge: 'Catálogo de herramientas reales',
    catalogTitle: 'Explora las herramientas disponibles',
    catalogSubtitle: 'Herramientas nativas de alta velocidad para conversión y optimización sin intermediarios.',
    filterAll: 'Todas las herramientas',
    filterConverters: 'Convertidores',
    filterCompressors: 'Compresores',
    nativeBadge: 'Nativo',
    howToUse: '¿Cómo se usa?',
    useTool: 'Usar',
    noToolsFound: 'No se encontraron herramientas con los filtros seleccionados.',
    resetFilters: 'Restablecer todos los filtros',
    openConverter: 'Abrir conversor',
    openTool: 'Abrir',

    // How it works
    howItWorksTitle: '¿Cómo funciona MediaConvert?',
    howItWorksSubtitle: 'Un flujo directo, sin intermediarios engañosos ni ventanas emergentes.',
    step1Title: 'Sube tu archivo',
    step1Desc: 'Arrastra cualquier documento, imagen, vídeo o pista de audio, o selecciona desde tu dispositivo. Soporta hasta 2 GB por lote.',
    step2Title: 'Configura y Procesa',
    step2Desc: 'Elige el formato de destino o nivel de compresión deseado. Ajusta calidad, dimensiones o delimitadores según tus necesidades.',
    step3Title: 'Descarga o Comparte',
    step3Desc: 'Obtén tu archivo transformado al instante de forma individual o empaquetado en .ZIP. Guárdalo o compártelo mediante enlace privado.',

    // Security & Integrity
    securityBadge: 'Compromiso de integridad y privacidad',
    securityTitle: 'Herramientas reales, sin trampas ni trucos publicitarios.',
    securityDesc: 'Construimos MediaConvert como la alternativa limpia y transparente frente a los sitios web saturados de publicidad dudosa y descargas fraudulentas.',
    secLocalTitle: 'Procesamiento en tu propio navegador',
    secLocalDesc: 'Para formatos de imagen y datos estándar, la conversión se ejecuta localmente mediante la potencia de tu CPU/GPU. Tus archivos no se suben a servidores de terceros.',
    secNoAdsTitle: 'Cero Publicidad Invasiva',
    secNoAdsDesc: 'No existen anuncios engañosos, falsos botones de descarga verde ni banners invasivos. La interfaz está 100% dedicada a tu trabajo.',
    secDirectTitle: 'Enlaces de descarga directa',
    secDirectDesc: 'Sin temporizadores forzados de 30 segundos ni captchas molestos. Cuando tu archivo está listo, se descarga inmediatamente.',
    secCleanupTitle: 'Eliminación automática de temporales',
    secCleanupDesc: 'La memoria temporal se libera en cuanto cierras la pestaña o descargas tu lote. Tu información personal nunca es comercializada.',

    // News & Discover
    newsDiscoverBadge: 'GOOGLE DISCOVER • EDICIÓN 2026',
    newsFeedTitle: 'Noticias y Tendencias',
    newsFeedSubtitle: 'Artículos y guías de vanguardia sobre conversión de vídeo, formatos de imagen WebP/AVIF/HEIC, IA y productividad móvil. Cada artículo incluye 3 herramientas gratuitas listas para usar.',
    allTrends: 'Todas las tendencias',
    readArticle: 'Leer',
    readArticleFull: 'Leer artículo completo →',
    minRead: 'min de lectura',
    shareArticle: 'Compartir',
    copyLink: 'Copiar Enlace',
    linkCopied: '¡Enlace copiado!',
    interactiveTools: 'Herramientas Interactivas Disponibles',
    tryToolNow: 'Probar Herramienta Ahora',
    authorBy: 'Por',
    relatedArticles: 'Artículos Relacionados',
    backToNews: '← Volver a Noticias y Tendencias',
    openToolFree: 'Abrir Herramienta Gratis',
    moreToolsHub: 'Más de 30 herramientas gratuitas en el navegador',
    moreToolsHubDesc: 'Convierte, comprime y optimiza archivos de imagen, audio, vídeo y PDF con privacidad y sin registro.',
    exploreToolsCatalog: 'Explorar catálogo completo de herramientas',
    featuredToolsForArticle: 'Herramientas Recomendadas para este Artículo',
    tryDirectlyInBrowser: 'Pruébalas gratis directamente en tu navegador sin instalar nada',
    readyToolsCount: 'Herramientas Listas',
    seoTagsAndRelated: 'Etiquetas SEO & Temas Relacionados',
    moreDiscoverNews: 'Más Noticias & Tendencias de Google Discover',
    viewAll: 'Ver todas',
    mobileOptimized: 'Optimizado para Móviles',
    articleNotFound: 'Artículo no encontrado',
    articleNotFoundDesc: 'No pudimos encontrar este artículo de tendencias para Google Discover.',
    viewAllNewsBtn: 'Ver todas las noticias y tendencias',
    needConvertToday: '¿Necesitas convertir o comprimir archivos hoy?',
    suiteSubtitle: 'Más de 30 herramientas gratis. Sin subir tus archivos a la nube, 100% privado y seguro en tu dispositivo.',
    exploreAllToolsBtn: 'Explorar Todas las Herramientas',
    trendBadge: 'Tendencia',
    free100Badge: '100% Gratis',
    noSignupBadge: 'Sin Registro',
    toolNumber: 'Herramienta #',

    // File Converter Page
    uploadToStart: 'Selecciona o arrastra tus archivos para comenzar',
    dragFileHere: 'Arrastra tu archivo aquí',
    orClickToSelect: 'o haz clic para seleccionar archivo desde tu dispositivo',
    supportedFormats: 'Formatos compatibles:',
    queuedFiles: 'Archivos en cola',
    directConversionTo: 'Conversión directa a',
    addMoreFiles: '+ Añadir más',
    clearQueue: 'Limpiar',
    destination: 'Destino:',
    readyToConvert: 'Listo para iniciar conversión instantánea',
    convertingWithCount: 'Convirtiendo',
    compressingWithCount: 'Comprimiendo',
    convertNow: 'Convertir Ahora',
    compressNow: 'Comprimir Ahora',
    convertFormatNow: 'Convertir a {format} Ahora',
    compressFormatNow: 'Comprimir Ahora',
    readyToProcess: 'Listo para procesar',
    processingPipeline: 'Pipeline de procesamiento activo',
    downloadZip: 'Descargar todo en .ZIP',
    saveLibrary: 'Guardar en Mis Archivos',
    startNew: 'Convertir otros archivos',
    howItWorksHeading: '¿Cómo funciona esta herramienta?',
    faqHeading: 'Preguntas Frecuentes',
    reviewsHeading: 'Opiniones y Valoraciones',
    whyConvertHeading: '¿Para qué sirve convertir este formato?',
    formatBasics: 'Fundamentos de Formato',
    understandBeforeConvert: 'Comprende los formatos antes de convertir',
    sourceFormat: 'Origen',
    recommendedDestination: 'Destino Recomendado',
    keyPoints: 'Puntos clave:',
    outputAdvantages: 'Ventajas de salida:',
    practicalUseCases: 'Casos de Uso Prácticos',
    technicalComparison: 'Tabla Comparativa',
    keyDifferencesBetween: 'Diferencias clave entre',
    technicalAnalysis: 'Análisis técnico de compresión, fidelidad, transparencia y escenarios óptimos.',
    technicalProperty: 'Propiedad Técnica',
    internalProcess: 'Proceso Interno',
    whatHappensDuringConversion: '¿Qué ocurre durante la conversión?',
    zeroCloudModel: 'El motor de conversión de MediaConvert opera bajo un modelo de arquitectura zero-cloud en el que tu procesador ejecuta cada instrucción localmente:',
    inputRequirements: 'Requisitos de entrada',
    whatFilesAccepted: '¿Qué archivos acepta este conversor?',
    sizeLimit: 'Límite de tamaño:',
    upTo2gb: 'Hasta 2 GB por archivo',
    guaranteedResult: 'Resultado garantizado',
    whatResultYouGet: '¿Qué resultado obtendrás?',
    resolvedQuestionsAbout: 'Dudas resueltas sobre',
    relatedNavigation: 'Navegación Relacionada',
    otherPopularConversions: 'Otras conversiones populares',
    viewAllOfCategory: 'Ver todas las de',
    noCloudUpload: 'Sin subida a servidores (100% privado)',
    noWatermarks: 'Sin marcas de agua ni límites',
    gpuAccelerated: 'Acelerado por GPU local',
    ready: 'Listo',
    processingInRam: 'Procesando en memoria RAM...',

    // Quick Search Modal
    quickSearchPlaceholder: 'Buscar por nombre, formato (ej. jpg png, heic, pdf)...',
    quickSearchPopular: 'Populares:',
    quickSearchNoResults: 'No se encontraron herramientas',
    quickSearchNoResultsDesc: 'No hay coincidencias para tu búsqueda. Prueba con formatos como "HEIC", "JPG", "PNG", "PDF" o "MP4".',
    quickSearchNavigate: 'Navegar',
    quickSearchOpenTool: 'Abrir herramienta',
    quickSearchEsc: 'ESC para cerrar',

    // Category Page
    toolsCategoryBadge: 'Categoría de Herramientas',
    toolsCountBadge: 'Herramientas',
    categoryGuideTitle: '¿Cómo elegir la herramienta adecuada en esta categoría?',
    categoryGuideDesc: 'Cada herramienta listada arriba está optimizada de manera especializada para un par de formatos de entrada y salida o una tarea específica de compresión.',
    catSpecificIntent: 'Intención Específica',
    catSpecificIntentDesc: 'Cada página individual cuenta con su propia optimización y parámetros técnicos.',
    catGuaranteedSec: 'Seguridad Garantizada',
    catGuaranteedSecDesc: 'Los datos nunca se transfieren a servidores externos. Cero retención.',
    catNoWaiting: 'Sin Esperas ni Colas',
    catNoWaitingDesc: 'Aprovecha la capacidad multihilo y GPU de tu hardware local.',

    // Footer
    footerDesc: 'La plataforma profesional para convertir, comprimir, guardar y compartir archivos con total privacidad, velocidad nativa y sin publicidad engañosa.',
    popularConversions: 'Conversión Popular',
    quickLinks: 'Enlaces Rápidos',
    siteDirectory: 'Catálogo de Herramientas',
    sitemapSeo: 'Mapa del Sitio & SEO',
    privacyPolicy: 'Política de Privacidad',
    termsOfService: 'Términos del Servicio',
    rightsReserved: 'Todos los derechos reservados.',
    sslEncrypted: 'Cifrado SSL/TLS de extremo a extremo',
  },
  us: {
    // Navigation & Header
    chooseLanguage: 'Choose your language',
    tools: 'Tools',
    categories: 'Tool Categories',
    convert: 'Convert',
    compress: 'Compress',
    myFiles: 'My Files',
    newsAndTrends: 'News & Trends',
    adminBlog: 'Admin Blog',
    search: 'Search...',
    searchPlaceholder: 'Search conversion tools (e.g. JPG, WebP, PDF)...',
    login: 'Sign In',
    logout: 'Sign Out',
    allTools: 'View all available tools',
    allOS: 'All Operating Systems Supported',
    newBadge: 'New',
    home: 'Home',

    // Categories
    catAll: 'All Tools',
    catVideoAudio: 'Video & Audio',
    catVideoAudioDesc: 'MP4, MP3, MOV, OGG, Extract Audio',
    catImage: 'Image',
    catImageDesc: 'JPG, PNG, WebP, HEIC, SVG, JFIF',
    catPdfDoc: 'PDF & Documents',
    catPdfDocDesc: 'PDF, Word DOCX, EPUB, Books',
    catGif: 'GIF',
    catGifDesc: 'Video to GIF, MP4 to GIF, APNG, Loops',
    catZip: 'ZIP Archives',
    catZipDesc: 'Secure packer and compressor',

    // Hero Section
    badgeNoAds: '100% No invasive ads or deceptive downloads',
    badgePrivacy: 'Guaranteed local privacy',
    heroTitlePart1: 'Convert, compress, save and ',
    heroTitlePart2: 'share your files.',
    heroSubtitle: 'The technological platform to process documents, images, videos, and audio with top speed, local privacy, and zero shady intermediaries.',
    guaranteeFast: 'Ultra-fast native processing',
    guaranteePrivacy: 'Your files are never sold or tracked',
    guaranteeDownload: 'Direct download with no waiting time',

    // Dropzone
    dropzoneTitle: 'Drag your files here or click to browse',
    dropzoneSubtitle: 'Supports images, videos, audio, documents, and archives up to 2 GB.',
    selectFiles: 'Select Files',
    pasteClipboard: 'or paste files from clipboard (Ctrl + V)',
    convertingTo: 'Converting to',
    compressing: 'Compressing',

    // Tool Catalog
    catalogBadge: 'Real tools catalog',
    catalogTitle: 'Explore all available tools',
    catalogSubtitle: 'High-speed native tools for clean file conversion and compression.',
    filterAll: 'All Tools',
    filterConverters: 'Converters',
    filterCompressors: 'Compressors',
    nativeBadge: 'Native',
    howToUse: 'How to use?',
    useTool: 'Use',
    noToolsFound: 'No tools found matching your filters.',
    resetFilters: 'Reset all filters',
    openConverter: 'Open converter',
    openTool: 'Open',

    // How it works
    howItWorksTitle: 'How does MediaConvert work?',
    howItWorksSubtitle: 'A straightforward workflow with zero misleading ads or annoying popups.',
    step1Title: 'Upload your file',
    step1Desc: 'Drag any document, image, video, or audio track, or select from your device. Supports up to 2 GB per batch.',
    step2Title: 'Configure & Process',
    step2Desc: 'Choose your target format or compression level. Adjust quality, resolution, or delimiters according to your needs.',
    step3Title: 'Download or Share',
    step3Desc: 'Get your transformed file instantly either individually or bundled in a .ZIP package. Save or share via private link.',

    // Security & Integrity
    securityBadge: 'Integrity & Privacy Commitment',
    securityTitle: 'Real tools, zero traps or deceptive advertising tricks.',
    securityDesc: 'We built MediaConvert as the clean, transparent alternative to bloated websites filled with suspicious ads and fake download buttons.',
    secLocalTitle: 'In-browser processing',
    secLocalDesc: 'For standard image and data formats, conversion runs locally using your device CPU/GPU. Your files never leave your system.',
    secNoAdsTitle: 'Zero Invasive Ads',
    secNoAdsDesc: 'No deceptive ads, no fake green download buttons, and no intrusive banners. The interface is 100% dedicated to your work.',
    secDirectTitle: 'Direct download links',
    secDirectDesc: 'No forced 30-second waiting timers or annoying captchas. Once ready, your files download immediately.',
    secCleanupTitle: 'Automatic temporary cleanup',
    secCleanupDesc: 'Temporary memory is cleared the moment you close the tab or download your batch. Your personal data is never commercialized.',

    // News & Discover
    newsDiscoverBadge: 'GOOGLE DISCOVER • 2026 EDITION',
    newsFeedTitle: 'News and Trends',
    newsFeedSubtitle: 'Cutting-edge articles and guides on video conversion, WebP/AVIF/HEIC image formats, AI and mobile productivity. Each article includes 3 ready-to-use free tools.',
    allTrends: 'All Trends',
    readArticle: 'Read',
    readArticleFull: 'Read full article →',
    minRead: 'min read',
    shareArticle: 'Share',
    copyLink: 'Copy Link',
    linkCopied: 'Link copied!',
    interactiveTools: 'Available Interactive Tools',
    tryToolNow: 'Try Tool Now',
    authorBy: 'By',
    relatedArticles: 'Related Articles',
    backToNews: '← Back to News & Trends',
    openToolFree: 'Open Free Tool',
    moreToolsHub: 'Over 30 free tools right in your browser',
    moreToolsHubDesc: 'Convert, compress, and optimize images, audio, video, and PDF files with total privacy and zero sign-up.',
    exploreToolsCatalog: 'Explore complete tool catalog',
    featuredToolsForArticle: 'Recommended Tools for this Article',
    tryDirectlyInBrowser: 'Try them for free directly in your browser without installing anything',
    readyToolsCount: 'Tools Ready',
    seoTagsAndRelated: 'SEO Tags & Related Topics',
    moreDiscoverNews: 'More News & Trends from Google Discover',
    viewAll: 'View all',
    mobileOptimized: 'Mobile Optimized',
    articleNotFound: 'Article not found',
    articleNotFoundDesc: 'We could not find this trending article for Google Discover.',
    viewAllNewsBtn: 'View all news & trends',
    needConvertToday: 'Need to convert or compress files today?',
    suiteSubtitle: 'Over 30 free tools. Zero cloud uploads, 100% private and secure on your device.',
    exploreAllToolsBtn: 'Explore All Tools',
    trendBadge: 'Trending',
    free100Badge: '100% Free',
    noSignupBadge: 'No Sign-up',
    toolNumber: 'Tool #',

    // File Converter Page
    uploadToStart: 'Select or drag your files to start',
    dragFileHere: 'Drag your file here',
    orClickToSelect: 'or click to browse files from your device',
    supportedFormats: 'Supported formats:',
    queuedFiles: 'Queued files',
    directConversionTo: 'Direct conversion to',
    addMoreFiles: '+ Add more',
    clearQueue: 'Clear',
    destination: 'Target:',
    readyToConvert: 'Ready for instant conversion',
    convertingWithCount: 'Converting',
    compressingWithCount: 'Compressing',
    convertNow: 'Convert Now',
    compressNow: 'Compress Now',
    convertFormatNow: 'Convert to {format} Now',
    compressFormatNow: 'Compress Now',
    readyToProcess: 'Ready to process',
    processingPipeline: 'Active processing pipeline',
    downloadZip: 'Download all as .ZIP',
    saveLibrary: 'Save to My Files',
    startNew: 'Convert other files',
    howItWorksHeading: 'How does this tool work?',
    faqHeading: 'Frequently Asked Questions',
    reviewsHeading: 'User Reviews & Ratings',
    whyConvertHeading: 'Why convert this format?',
    formatBasics: 'Format Fundamentals',
    understandBeforeConvert: 'Understand the formats before converting',
    sourceFormat: 'Source',
    recommendedDestination: 'Recommended Target',
    keyPoints: 'Key points:',
    outputAdvantages: 'Output advantages:',
    practicalUseCases: 'Practical Use Cases',
    technicalComparison: 'Comparison Table',
    keyDifferencesBetween: 'Key differences between',
    technicalAnalysis: 'Technical analysis of compression, fidelity, transparency, and optimal scenarios.',
    technicalProperty: 'Technical Property',
    internalProcess: 'Internal Process',
    whatHappensDuringConversion: 'What happens during conversion?',
    zeroCloudModel: 'The MediaConvert engine operates on a zero-cloud architecture where your processor executes every instruction locally:',
    inputRequirements: 'Input requirements',
    whatFilesAccepted: 'What files does this converter accept?',
    sizeLimit: 'Size limit:',
    upTo2gb: 'Up to 2 GB per file',
    guaranteedResult: 'Guaranteed result',
    whatResultYouGet: 'What result will you get?',
    resolvedQuestionsAbout: 'Questions answered about',
    relatedNavigation: 'Related Navigation',
    otherPopularConversions: 'Other popular conversions',
    viewAllOfCategory: 'View all from',
    noCloudUpload: 'No server upload (100% private)',
    noWatermarks: 'No watermarks or limits',
    gpuAccelerated: 'Locally GPU accelerated',
    ready: 'Ready',
    processingInRam: 'Processing in RAM memory...',

    // Quick Search Modal
    quickSearchPlaceholder: 'Search by name, format (e.g. jpg png, heic, pdf)...',
    quickSearchPopular: 'Popular:',
    quickSearchNoResults: 'No tools found',
    quickSearchNoResultsDesc: 'No matches found for your search. Try formats like "HEIC", "JPG", "PNG", "PDF" or "MP4".',
    quickSearchNavigate: 'Navigate',
    quickSearchOpenTool: 'Open tool',
    quickSearchEsc: 'ESC to close',

    // Category Page
    toolsCategoryBadge: 'Tool Category',
    toolsCountBadge: 'Tools',
    categoryGuideTitle: 'How to choose the right tool in this category?',
    categoryGuideDesc: 'Each tool listed above is specialized and optimized for a specific pair of input/output formats or compression task.',
    catSpecificIntent: 'Specific Purpose',
    catSpecificIntentDesc: 'Each dedicated page provides tailored optimizations and technical parameters.',
    catGuaranteedSec: 'Guaranteed Security',
    catGuaranteedSecDesc: 'Data is never transferred to remote servers. Zero retention.',
    catNoWaiting: 'Zero Waiting Queues',
    catNoWaitingDesc: 'Takes full advantage of multi-threaded CPU and local GPU hardware.',

    // Footer
    footerDesc: 'The professional platform to convert, compress, store, and share files with total privacy, native speed, and zero deceptive ads.',
    popularConversions: 'Popular Conversions',
    quickLinks: 'Quick Links',
    siteDirectory: 'Tool Directory',
    sitemapSeo: 'Sitemap & SEO',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    rightsReserved: 'All rights reserved.',
    sslEncrypted: 'End-to-end SSL/TLS Encryption',
  },
  fr: {
    // Navigation & Header
    chooseLanguage: 'Choisissez votre langue',
    tools: 'Outils',
    categories: "Catégories d'outils",
    convert: 'Convertir',
    compress: 'Compresser',
    myFiles: 'Mes fichiers',
    newsAndTrends: 'Actualités & Tendances',
    adminBlog: 'Admin Blog',
    search: 'Rechercher...',
    searchPlaceholder: 'Rechercher des outils (ex. JPG, WebP, PDF)...',
    login: 'Se connecter',
    logout: 'Se déconnecter',
    allTools: 'Voir tous les outils disponibles',
    allOS: 'Tous les systèmes d’exploitation supportés',
    newBadge: 'Nouveau',
    home: 'Accueil',

    // Categories
    catAll: 'Tous les outils',
    catVideoAudio: 'Vidéo & Audio',
    catVideoAudioDesc: 'MP4, MP3, MOV, OGG, Extraire Audio',
    catImage: 'Image',
    catImageDesc: 'JPG, PNG, WebP, HEIC, SVG, JFIF',
    catPdfDoc: 'PDF & Documents',
    catPdfDocDesc: 'PDF, Word DOCX, EPUB, Livres',
    catGif: 'GIF',
    catGifDesc: 'Vidéo en GIF, MP4 en GIF, APNG, Boucles',
    catZip: 'Archives ZIP',
    catZipDesc: 'Compresseur et assembleur sécurisé',

    // Hero Section
    badgeNoAds: '100% Sans publicités invasives ni faux téléchargements',
    badgePrivacy: 'Confidentialité locale garantie',
    heroTitlePart1: 'Convertissez, compressez, enregistrez et ',
    heroTitlePart2: 'partagez vos fichiers.',
    heroSubtitle: 'La plateforme technologique pour traiter documents, images, vidéos et audio avec une vitesse maximale, une confidentialité totale et sans intermédiaires douteux.',
    guaranteeFast: 'Traitement natif ultra rapide',
    guaranteePrivacy: 'Vos fichiers ne sont jamais vendus ni tracés',
    guaranteeDownload: 'Téléchargement direct et sans attente',

    // Dropzone
    dropzoneTitle: 'Glissez vos fichiers ici ou cliquez pour parcourir',
    dropzoneSubtitle: 'Prend en charge images, vidéos, audios, documents et archives jusqu’à 2 Go.',
    selectFiles: 'Sélectionner des fichiers',
    pasteClipboard: 'ou collez des fichiers depuis le presse-papiers (Ctrl + V)',
    convertingTo: 'Conversion vers',
    compressing: 'Compression',

    // Tool Catalog
    catalogBadge: 'Catalogue des outils disponibles',
    catalogTitle: 'Explorez tous nos outils',
    catalogSubtitle: 'Des outils natifs à haute vitesse pour la conversion et l’optimisation sans intermédiaires.',
    filterAll: 'Tous les outils',
    filterConverters: 'Convertisseurs',
    filterCompressors: 'Compresseurs',
    nativeBadge: 'Natif',
    howToUse: 'Mode d’emploi',
    useTool: 'Utiliser',
    noToolsFound: 'Aucun outil ne correspond à vos filtres.',
    resetFilters: 'Réinitialiser tous les filtres',
    openConverter: 'Ouvrir le convertisseur',
    openTool: 'Ouvrir',

    // How it works
    howItWorksTitle: 'Comment fonctionne MediaConvert ?',
    howItWorksSubtitle: 'Un flux direct, sans publicités trompeuses ni fenêtres contextuelles agaçantes.',
    step1Title: 'Téléversez votre fichier',
    step1Desc: 'Glissez n’importe quel document, image, vidéo ou piste audio, ou sélectionnez depuis votre appareil. Jusqu’à 2 Go par lot.',
    step2Title: 'Configurez & Traitez',
    step2Desc: 'Choisissez votre format de destination ou niveau de compression. Ajustez la qualité, les dimensions ou les délimiteurs.',
    step3Title: 'Téléchargez ou Partagez',
    step3Desc: 'Obtenez votre fichier transformé instantanément ou regroupé dans un fichier .ZIP. Enregistrez-le ou partagez-le par lien privé.',

    // Security & Integrity
    securityBadge: 'Engagement d’intégrité et de confidentialité',
    securityTitle: 'Des outils fiables, sans pièges ni astuces publicitaires.',
    securityDesc: 'Nous avons conçu MediaConvert comme l’alternative propre et transparente face aux sites saturés de publicités douteuses et de faux boutons de téléchargement.',
    secLocalTitle: 'Traitement directement dans votre navigateur',
    secLocalDesc: 'Pour les formats d’image et de données courants, la conversion s’exécute localement grâce au CPU/GPU de votre appareil. Vos fichiers ne quittent pas votre système.',
    secNoAdsTitle: 'Zéro Publicité Invasive',
    secNoAdsDesc: 'Aucune publicité trompeuse, aucun faux bouton vert de téléchargement ni bannière envahissante. L’interface est 100% dédiée à votre travail.',
    secDirectTitle: 'Liens de téléchargement direct',
    secDirectDesc: 'Aucun compte à rebours forcé de 30 secondes ni captcha contraignant. Dès qu’il est prêt, votre fichier est téléchargé immédiatement.',
    secCleanupTitle: 'Nettoyage automatique de la mémoire',
    secCleanupDesc: 'La mémoire temporaire est libérée dès que vous fermez l’onglet ou téléchargez votre lot. Vos données personnelles ne sont jamais commercialisées.',

    // News & Discover
    newsDiscoverBadge: 'GOOGLE DISCOVER • ÉDITION 2026',
    newsFeedTitle: 'Actualités et Tendances',
    newsFeedSubtitle: 'Articles et guides de pointe sur la conversion vidéo, les formats d’image WebP/AVIF/HEIC, l’IA et la productivité mobile. Chaque article inclut 3 outils gratuits prêts à l’emploi.',
    allTrends: 'Toutes les tendances',
    readArticle: 'Lire',
    readArticleFull: 'Lire l’article complet →',
    minRead: 'min de lecture',
    shareArticle: 'Partager',
    copyLink: 'Copier le lien',
    linkCopied: 'Lien copié !',
    interactiveTools: 'Outils Interactifs Disponibles',
    tryToolNow: 'Tester l’outil maintenant',
    authorBy: 'Par',
    relatedArticles: 'Articles Connexes',
    backToNews: '← Retour aux Actualités & Tendances',
    openToolFree: 'Ouvrir l’outil gratuitement',
    moreToolsHub: 'Plus de 30 outils gratuits dans votre navigateur',
    moreToolsHubDesc: 'Convertissez, compressez et optimisez des images, fichiers audio, vidéo et PDF avec une confidentialité totale et sans inscription.',
    exploreToolsCatalog: 'Explorer le catalogue complet des outils',
    featuredToolsForArticle: 'Outils recommandés pour cet article',
    tryDirectlyInBrowser: 'Testez-les gratuitement dans votre navigateur sans rien installer',
    readyToolsCount: 'Outils Prêts',
    seoTagsAndRelated: 'Balises SEO & Sujets Connexes',
    moreDiscoverNews: 'Plus d’actualités Google Discover',
    viewAll: 'Voir tout',
    mobileOptimized: 'Optimisé pour Mobile',
    articleNotFound: 'Article introuvable',
    articleNotFoundDesc: 'Nous n’avons pas trouvé cet article de tendances pour Google Discover.',
    viewAllNewsBtn: 'Voir toutes les actualités et tendances',
    needConvertToday: 'Besoin de convertir ou compresser des fichiers aujourd’hui ?',
    suiteSubtitle: 'Plus de 30 outils gratuits. Sans transfert vers le cloud, 100% privé et sécurisé sur votre appareil.',
    exploreAllToolsBtn: 'Explorer tous les outils',
    trendBadge: 'Tendance',
    free100Badge: '100% Gratuit',
    noSignupBadge: 'Sans Inscription',
    toolNumber: 'Outil #',

    // File Converter Page
    uploadToStart: 'Sélectionnez ou glissez vos fichiers pour commencer',
    dragFileHere: 'Glissez votre fichier ici',
    orClickToSelect: 'ou cliquez pour sélectionner un fichier depuis votre appareil',
    supportedFormats: 'Formats pris en charge :',
    queuedFiles: 'Fichiers dans la file d’attente',
    directConversionTo: 'Conversion directe vers',
    addMoreFiles: '+ Ajouter d’autres',
    clearQueue: 'Effacer',
    destination: 'Cible :',
    readyToConvert: 'Prêt pour une conversion instantanée',
    convertingWithCount: 'Conversion en cours',
    compressingWithCount: 'Compression en cours',
    convertNow: 'Convertir maintenant',
    compressNow: 'Compresser maintenant',
    convertFormatNow: 'Convertir en {format} maintenant',
    compressFormatNow: 'Compresser maintenant',
    readyToProcess: 'Prêt pour le traitement',
    processingPipeline: 'Pipeline de traitement actif',
    downloadZip: 'Tout télécharger en .ZIP',
    saveLibrary: 'Enregistrer dans Mes Fichiers',
    startNew: 'Convertir d’autres fichiers',
    howItWorksHeading: 'Comment fonctionne cet outil ?',
    faqHeading: 'Foire Aux Questions',
    reviewsHeading: 'Avis et Évaluations',
    whyConvertHeading: 'Pourquoi convertir ce format ?',
    formatBasics: 'Fondamentaux des Formats',
    understandBeforeConvert: 'Comprendre les formats avant de convertir',
    sourceFormat: 'Source',
    recommendedDestination: 'Cible recommandée',
    keyPoints: 'Points clés :',
    outputAdvantages: 'Avantages du format de sortie :',
    practicalUseCases: 'Cas d’Usage Pratiques',
    technicalComparison: 'Tableau Comparatif',
    keyDifferencesBetween: 'Différences clés entre',
    technicalAnalysis: 'Analyse technique de la compression, fidélité, transparence et scénarios optimaux.',
    technicalProperty: 'Propriété Technique',
    internalProcess: 'Processus Interne',
    whatHappensDuringConversion: 'Que se passe-t-il pendant la conversion ?',
    zeroCloudModel: 'Le moteur de MediaConvert fonctionne selon une architecture zero-cloud où votre processeur exécute chaque instruction localement :',
    inputRequirements: 'Conditions d’entrée',
    whatFilesAccepted: 'Quels fichiers ce convertisseur accepte-t-il ?',
    sizeLimit: 'Limite de taille :',
    upTo2gb: 'Jusqu’à 2 Go par fichier',
    guaranteedResult: 'Résultat garanti',
    whatResultYouGet: 'Quel résultat obtiendrez-vous ?',
    resolvedQuestionsAbout: 'Questions résolues sur',
    relatedNavigation: 'Navigation Connexe',
    otherPopularConversions: 'Autres conversions populaires',
    viewAllOfCategory: 'Voir tout dans',
    noCloudUpload: 'Aucun envoi sur serveur (100% privé)',
    noWatermarks: 'Sans filigrane ni limite',
    gpuAccelerated: 'Accélération GPU locale',
    ready: 'Prêt',
    processingInRam: 'Traitement en mémoire RAM...',

    // Quick Search Modal
    quickSearchPlaceholder: 'Rechercher par nom, format (ex. jpg png, heic, pdf)...',
    quickSearchPopular: 'Populaires :',
    quickSearchNoResults: 'Aucun outil trouvé',
    quickSearchNoResultsDesc: 'Aucune correspondance trouvée. Essayez des formats comme "HEIC", "JPG", "PNG", "PDF" ou "MP4".',
    quickSearchNavigate: 'Naviguer',
    quickSearchOpenTool: 'Ouvrir l’outil',
    quickSearchEsc: 'ÉCHAP pour fermer',

    // Category Page
    toolsCategoryBadge: 'Catégorie d’outils',
    toolsCountBadge: 'Outils',
    categoryGuideTitle: 'Comment choisir le bon outil dans cette catégorie ?',
    categoryGuideDesc: 'Chaque outil répertorié ci-dessus est spécialement optimisé pour une paire de formats ou une tâche de compression.',
    catSpecificIntent: 'Objectif Spécifique',
    catSpecificIntentDesc: 'Chaque page dédiée propose des optimisations et réglages sur-mesure.',
    catGuaranteedSec: 'Sécurité Garantie',
    catGuaranteedSecDesc: 'Les données ne sont jamais transmises à des serveurs distants. Zéro rétention.',
    catNoWaiting: 'Zéro File d’Attente',
    catNoWaitingDesc: 'Tire parti du calcul multithread et du GPU local de votre appareil.',

    // Footer
    footerDesc: 'La plateforme professionnelle pour convertir, compresser, stocker et partager des fichiers avec une confidentialité totale, une vitesse native et sans publicité trompeuse.',
    popularConversions: 'Conversions Populaires',
    quickLinks: 'Liens Rapides',
    siteDirectory: 'Catalogue d’outils',
    sitemapSeo: 'Plan du site & SEO',
    privacyPolicy: 'Politique de Confidentialité',
    termsOfService: 'Conditions d’Utilisation',
    rightsReserved: 'Tous droits réservés.',
    sslEncrypted: 'Chiffrement SSL/TLS de bout en bout',
  }
};

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (typeof UI_TRANSLATIONS)['es'];
  getLocalizedPath: (path: string, targetLang?: SupportedLanguage) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_LANG_KEY = 'mediaconvert_preferred_lang_v1';

export const extractLanguageFromPath = (pathname: string): { lang: SupportedLanguage; pathWithoutLang: string } => {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const segments = cleanPath.split('/').filter(Boolean);
  
  if (segments.length > 0) {
    const first = segments[0].toLowerCase();
    if (first === 'es' || first === 'us' || first === 'en' || first === 'fr') {
      const matchedLang: SupportedLanguage = first === 'en' ? 'us' : (first as SupportedLanguage);
      const remainingSegments = segments.slice(1);
      const remainingPath = remainingSegments.length > 0 ? `/${remainingSegments.join('/')}` : '/';
      return { lang: matchedLang, pathWithoutLang: remainingPath };
    }
  }

  let savedLang: SupportedLanguage = 'es';
  try {
    const saved = localStorage.getItem(STORAGE_LANG_KEY) as SupportedLanguage;
    if (saved && (saved === 'es' || saved === 'us' || saved === 'fr')) {
      savedLang = saved;
    }
  } catch (e) {}

  return { lang: savedLang, pathWithoutLang: cleanPath };
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return extractLanguageFromPath(window.location.pathname).lang;
  });

  const getLocalizedPath = (path: string, targetLang?: SupportedLanguage): string => {
    const langToUse = targetLang || language;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const { pathWithoutLang } = extractLanguageFromPath(cleanPath);
    
    if (pathWithoutLang === '/' || pathWithoutLang === '') {
      return `/${langToUse.toUpperCase()}`;
    }
    return `/${langToUse.toUpperCase()}${pathWithoutLang}`;
  };

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, newLang);
    } catch (e) {}

    const currentPath = window.location.pathname;
    const { pathWithoutLang } = extractLanguageFromPath(currentPath);
    
    let newPath = `/${newLang.toUpperCase()}`;
    if (pathWithoutLang !== '/' && pathWithoutLang !== '') {
      newPath += pathWithoutLang;
    }
    
    window.history.pushState({}, '', newPath);
    // Dispatch popstate so router and components re-render immediately
    window.dispatchEvent(new Event('popstate'));
  };

  useEffect(() => {
    const onLocationChange = () => {
      const { lang } = extractLanguageFromPath(window.location.pathname);
      setLanguageState(lang);
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  const value: I18nContextType = {
    language,
    setLanguage,
    t: UI_TRANSLATIONS[language] || UI_TRANSLATIONS.es,
    getLocalizedPath
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextType => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
};

/* =========================================================================
   LOCALIZACIÓN DE TARJETAS Y HERRAMIENTAS (FileTool & ToolConfig)
   ========================================================================= */

interface ToolTranslation {
  name: string;
  description: string;
}

const TOOL_TRANSLATIONS: Record<string, Record<SupportedLanguage, ToolTranslation>> = {
  // IMAGES
  'png-a-jpg': {
    es: { name: 'Convertidor PNG a JPG', description: 'Transforma imágenes PNG a formato JPG de alta compatibilidad y menor tamaño.' },
    us: { name: 'PNG to JPG Converter', description: 'Convert PNG images to highly compatible JPG format with smaller file size.' },
    fr: { name: 'Convertisseur PNG en JPG', description: 'Transformez vos images PNG au format JPG haute compatibilité et taille réduite.' }
  },
  'png-to-jpg': {
    es: { name: 'Convertidor PNG a JPG', description: 'Transforma imágenes PNG a formato JPG de alta compatibilidad y menor tamaño.' },
    us: { name: 'PNG to JPG Converter', description: 'Convert PNG images to highly compatible JPG format with smaller file size.' },
    fr: { name: 'Convertisseur PNG en JPG', description: 'Transformez vos images PNG au format JPG haute compatibilité et taille réduite.' }
  },
  'jpg-a-png': {
    es: { name: 'Convertidor JPG a PNG', description: 'Convierte JPG a formato PNG con soporte para máxima nitidez y compresión sin pérdidas.' },
    us: { name: 'JPG to PNG Converter', description: 'Convert JPG to PNG format with maximum sharpness and lossless compression support.' },
    fr: { name: 'Convertisseur JPG en PNG', description: 'Convertissez JPG en PNG avec netteté maximale et compression sans perte.' }
  },
  'jpg-to-png': {
    es: { name: 'Convertidor JPG a PNG', description: 'Convierte JPG a formato PNG con soporte para máxima nitidez y compresión sin pérdidas.' },
    us: { name: 'JPG to PNG Converter', description: 'Convert JPG to PNG format with maximum sharpness and lossless compression support.' },
    fr: { name: 'Convertisseur JPG en PNG', description: 'Convertissez JPG en PNG avec netteté maximale et compression sans perte.' }
  },
  'convertir-a-webp': {
    es: { name: 'Convertidor a WebP', description: 'Convierte cualquier imagen (PNG, JPG, BMP) a WebP moderno para optimizar páginas web.' },
    us: { name: 'Convert to WebP', description: 'Convert any image (PNG, JPG, BMP) to modern WebP for web optimization.' },
    fr: { name: 'Convertisseur vers WebP', description: 'Convertissez toute image (PNG, JPG, BMP) en WebP moderne pour optimiser le web.' }
  },
  'webp-to-jpg': {
    es: { name: 'Convertidor WebP a JPG', description: 'Pasa archivos WebP descargados de internet a formato clásico JPEG compatible.' },
    us: { name: 'WebP to JPG Converter', description: 'Convert downloaded WebP files to classic compatible JPEG format.' },
    fr: { name: 'Convertisseur WebP en JPG', description: 'Convertissez les fichiers WebP téléchargés au format JPEG classique compatible.' }
  },
  'webp-a-jpg': {
    es: { name: 'Convertidor WebP a JPG', description: 'Pasa archivos WebP descargados de internet a formato clásico JPEG compatible.' },
    us: { name: 'WebP to JPG Converter', description: 'Convert downloaded WebP files to classic compatible JPEG format.' },
    fr: { name: 'Convertisseur WebP en JPG', description: 'Convertissez les fichiers WebP téléchargés au format JPEG classique compatible.' }
  },
  'webp-to-png': {
    es: { name: 'Convertidor WebP a PNG', description: 'Convierte imágenes WebP a formato PNG conservando canal alfa y transparencia.' },
    us: { name: 'WebP to PNG Converter', description: 'Convert WebP images to PNG format preserving alpha channel and transparency.' },
    fr: { name: 'Convertisseur WebP en PNG', description: 'Convertissez WebP en PNG en préservant le canal alpha et la transparence.' }
  },
  'webp-a-png': {
    es: { name: 'Convertidor WebP a PNG', description: 'Convierte imágenes WebP a formato PNG conservando canal alfa y transparencia.' },
    us: { name: 'WebP to PNG Converter', description: 'Convert WebP images to PNG format preserving alpha channel and transparency.' },
    fr: { name: 'Convertisseur WebP en PNG', description: 'Convertissez WebP en PNG en préservant le canal alpha et la transparence.' }
  },
  'heic-to-jpg': {
    es: { name: 'Convertidor HEIC a JPG', description: 'Pasa fotos de iPhone HEIC a formato universal JPG compatible con Windows y Android.' },
    us: { name: 'HEIC to JPG Converter', description: 'Convert iPhone HEIC photos to universal JPG format compatible with Windows & Android.' },
    fr: { name: 'Convertisseur HEIC en JPG', description: 'Convertissez les photos iPhone HEIC en JPG universel compatible Windows et Android.' }
  },
  'heic-a-jpg': {
    es: { name: 'Convertidor HEIC a JPG', description: 'Pasa fotos de iPhone HEIC a formato universal JPG compatible con Windows y Android.' },
    us: { name: 'HEIC to JPG Converter', description: 'Convert iPhone HEIC photos to universal JPG format compatible with Windows & Android.' },
    fr: { name: 'Convertisseur HEIC en JPG', description: 'Convertissez les photos iPhone HEIC en JPG universel compatible Windows et Android.' }
  },
  'heic-to-png': {
    es: { name: 'Convertidor HEIC a PNG', description: 'Extrae fotos de iPhone HEIC a formato PNG sin pérdidas listo para edición.' },
    us: { name: 'HEIC to PNG Converter', description: 'Extract iPhone HEIC photos to lossless PNG format ready for editing.' },
    fr: { name: 'Convertisseur HEIC en PNG', description: 'Extrayez les photos iPhone HEIC au format PNG sans perte pour l\'édition.' }
  },
  'heic-a-png': {
    es: { name: 'Convertidor HEIC a PNG', description: 'Extrae fotos de iPhone HEIC a formato PNG sin pérdidas listo para edición.' },
    us: { name: 'HEIC to PNG Converter', description: 'Extract iPhone HEIC photos to lossless PNG format ready for editing.' },
    fr: { name: 'Convertisseur HEIC en PNG', description: 'Extrayez les photos iPhone HEIC au format PNG sans perte pour l\'édition.' }
  },
  'svg-a-png': {
    es: { name: 'Convertidor SVG a PNG', description: 'Renderiza y rasteriza vectores SVG a imágenes PNG en cualquier resolución.' },
    us: { name: 'SVG to PNG Converter', description: 'Render and rasterize SVG vectors to PNG images at any resolution.' },
    fr: { name: 'Convertisseur SVG en PNG', description: 'Rendez et rastérisez les vecteurs SVG en images PNG à toute résolution.' }
  },
  'png-to-svg': {
    es: { name: 'Convertidor PNG a SVG', description: 'Vectoriza imágenes y logotipos PNG a formato vectorial escalable SVG.' },
    us: { name: 'PNG to SVG Converter', description: 'Vectorize PNG images and logos to scalable SVG vector format.' },
    fr: { name: 'Convertisseur PNG en SVG', description: 'Vectorisez les images et logos PNG au format vectoriel évolutif SVG.' }
  },
  'svg-converter': {
    es: { name: 'Convertidor SVG', description: 'Convierte archivos SVG a formato PNG, JPG o exporta vectores escalables.' },
    us: { name: 'SVG Converter', description: 'Convert SVG files to PNG, JPG or export scalable vectors.' },
    fr: { name: 'Convertisseur SVG', description: 'Convertissez les fichiers SVG en PNG, JPG ou exportez des vecteurs.' }
  },
  'convertir-a-avif': {
    es: { name: 'Convertidor a AVIF', description: 'Convierte a formato AVIF de nueva generación con ultra eficiencia de compresión.' },
    us: { name: 'Convert to AVIF', description: 'Convert to next-generation AVIF format with ultra compression efficiency.' },
    fr: { name: 'Convertisseur vers AVIF', description: 'Convertissez au format AVIF nouvelle génération avec ultra-efficacité.' }
  },
  'avif-a-jpg': {
    es: { name: 'Convertidor AVIF a JPG', description: 'Transforma imágenes AVIF a formato JPG estándar para máxima compatibilidad.' },
    us: { name: 'AVIF to JPG Converter', description: 'Transform AVIF images to standard JPG format for maximum compatibility.' },
    fr: { name: 'Convertisseur AVIF en JPG', description: 'Transformez les images AVIF au format JPG standard pour une compatibilité totale.' }
  },
  'avif-a-png': {
    es: { name: 'Convertidor AVIF a PNG', description: 'Pasa imágenes AVIF a PNG conservando nitidez y transparencia.' },
    us: { name: 'AVIF to PNG Converter', description: 'Convert AVIF images to PNG preserving sharpness and transparency.' },
    fr: { name: 'Convertisseur AVIF en PNG', description: 'Convertissez AVIF en PNG en conservant netteté et transparence.' }
  },
  'image-converter': {
    es: { name: 'Convertidor de Imágenes', description: 'Convierte entre múltiples formatos de imagen: JPG, PNG, WEBP, AVIF, HEIC, SVG.' },
    us: { name: 'Image Converter', description: 'Convert between multiple image formats: JPG, PNG, WEBP, AVIF, HEIC, SVG.' },
    fr: { name: 'Convertisseur d\'images', description: 'Convertissez entre plusieurs formats d\'image : JPG, PNG, WEBP, AVIF, HEIC, SVG.' }
  },

  // COMPRESSORS
  'comprimir-jpg': {
    es: { name: 'Compresor JPG / JPEG', description: 'Reduce el peso de imágenes JPG hasta un 80% manteniendo una nitidez visual excelente.' },
    us: { name: 'JPG / JPEG Compressor', description: 'Reduce JPG image size by up to 80% while preserving excellent visual sharpness.' },
    fr: { name: 'Compresseur JPG / JPEG', description: 'Réduisez la taille des images JPG jusqu\'à 80% en conservant une excellente netteté.' }
  },
  'compress-jpg': {
    es: { name: 'Compresor JPG / JPEG', description: 'Reduce el peso de imágenes JPG hasta un 80% manteniendo una nitidez visual excelente.' },
    us: { name: 'JPG / JPEG Compressor', description: 'Reduce JPG image size by up to 80% while preserving excellent visual sharpness.' },
    fr: { name: 'Compresseur JPG / JPEG', description: 'Réduisez la taille des images JPG jusqu\'à 80% en conservant une excellente netteté.' }
  },
  'comprimir-png': {
    es: { name: 'Compresor PNG', description: 'Optimiza archivos PNG reduciendo peso mediante cuantización y paleta inteligente.' },
    us: { name: 'PNG Compressor', description: 'Optimize PNG files by reducing file size via smart quantization and palette.' },
    fr: { name: 'Compresseur PNG', description: 'Optimisez les fichiers PNG en réduisant le poids grâce à la quantification.' }
  },
  'compress-png': {
    es: { name: 'Compresor PNG', description: 'Optimiza archivos PNG reduciendo peso mediante cuantización y paleta inteligente.' },
    us: { name: 'PNG Compressor', description: 'Optimize PNG files by reducing file size via smart quantization and palette.' },
    fr: { name: 'Compresseur PNG', description: 'Optimisez les fichiers PNG en réduisant le poids grâce à la quantification.' }
  },
  'comprimir-webp': {
    es: { name: 'Compresor WebP', description: 'Comprime imágenes WebP para carga ultrarrápida en sitios y aplicaciones móviles.' },
    us: { name: 'WebP Compressor', description: 'Compress WebP images for ultra-fast loading on websites and mobile apps.' },
    fr: { name: 'Compresseur WebP', description: 'Compressez les images WebP pour un chargement ultra-rapide sur le web.' }
  },
  'compress-webp': {
    es: { name: 'Compresor WebP', description: 'Comprime imágenes WebP para carga ultrarrápida en sitios y aplicaciones móviles.' },
    us: { name: 'WebP Compressor', description: 'Compress WebP images for ultra-fast loading on websites and mobile apps.' },
    fr: { name: 'Compresseur WebP', description: 'Compressez les images WebP pour un chargement ultra-rapide sur le web.' }
  },
  'comprimir-pdf': {
    es: { name: 'Compresor de PDF', description: 'Reduce el tamaño de documentos PDF pesados optimizando fuentes e imágenes internas.' },
    us: { name: 'PDF Compressor', description: 'Reduce large PDF document size by optimizing embedded fonts and images.' },
    fr: { name: 'Compresseur de PDF', description: 'Réduisez la taille des documents PDF lourds en optimisant polices et images.' }
  },
  'compress-pdf': {
    es: { name: 'Compresor de PDF', description: 'Reduce el tamaño de documentos PDF pesados optimizando fuentes e imágenes internas.' },
    us: { name: 'PDF Compressor', description: 'Reduce large PDF document size by optimizing embedded fonts and images.' },
    fr: { name: 'Compresseur de PDF', description: 'Réduisez la taille des documents PDF lourds en optimisant polices et images.' }
  },
  'comprimir-mp4': {
    es: { name: 'Compresor de Vídeo MP4', description: 'Reduce el tamaño de vídeos MP4 manteniendo resolución HD y audio sincronizado.' },
    us: { name: 'MP4 Video Compressor', description: 'Reduce MP4 video size while preserving HD resolution and synchronized audio.' },
    fr: { name: 'Compresseur Vidéo MP4', description: 'Réduisez la taille des vidéos MP4 en conservant la résolution HD et l\'audio.' }
  },
  'compress-mp4': {
    es: { name: 'Compresor de Vídeo MP4', description: 'Reduce el tamaño de vídeos MP4 manteniendo resolución HD y audio sincronizado.' },
    us: { name: 'MP4 Video Compressor', description: 'Reduce MP4 video size while preserving HD resolution and synchronized audio.' },
    fr: { name: 'Compresseur Vidéo MP4', description: 'Réduisez la taille des vidéos MP4 en conservant la résolution HD et l\'audio.' }
  },
  'comprimir-mp3': {
    es: { name: 'Compresor de Audio MP3', description: 'Reduce la tasa de bits y el peso de pistas de audio para podcasts y envíos rápidos.' },
    us: { name: 'MP3 Audio Compressor', description: 'Reduce bitrate and file size of audio tracks for podcasts and fast sharing.' },
    fr: { name: 'Compresseur Audio MP3', description: 'Réduisez le débit et la taille des pistes audio pour podcasts et partages.' }
  },
  'compress-mp3': {
    es: { name: 'Compresor de Audio MP3', description: 'Reduce la tasa de bits y el peso de pistas de audio para podcasts y envíos rápidos.' },
    us: { name: 'MP3 Audio Compressor', description: 'Reduce bitrate and file size of audio tracks for podcasts and fast sharing.' },
    fr: { name: 'Compresseur Audio MP3', description: 'Réduisez le débit et la taille des pistes audio pour podcasts et partages.' }
  },

  // DOCUMENTS
  'csv-a-json': {
    es: { name: 'Convertidor CSV a JSON', description: 'Convierte tablas y hojas de cálculo CSV en estructuras JSON jerárquicas y formateadas.' },
    us: { name: 'CSV to JSON Converter', description: 'Convert CSV tables and spreadsheets into formatted hierarchical JSON structures.' },
    fr: { name: 'Convertisseur CSV en JSON', description: 'Convertissez tableaux CSV en structures JSON hiérarchiques et formatées.' }
  },
  'csv-to-json': {
    es: { name: 'Convertidor CSV a JSON', description: 'Convierte tablas y hojas de cálculo CSV en estructuras JSON jerárquicas y formateadas.' },
    us: { name: 'CSV to JSON Converter', description: 'Convert CSV tables and spreadsheets into formatted hierarchical JSON structures.' },
    fr: { name: 'Convertisseur CSV en JSON', description: 'Convertissez tableaux CSV en structures JSON hiérarchiques et formatées.' }
  },
  'json-a-csv': {
    es: { name: 'Convertidor JSON a CSV', description: 'Transforma colecciones de objetos JSON en hojas tabulares CSV compatibles con Excel.' },
    us: { name: 'JSON to CSV Converter', description: 'Transform JSON object collections into CSV tabular sheets compatible with Excel.' },
    fr: { name: 'Convertisseur JSON en CSV', description: 'Transformez des objets JSON en feuilles tabulaires CSV compatibles Excel.' }
  },
  'json-to-csv': {
    es: { name: 'Convertidor JSON a CSV', description: 'Transforma colecciones de objetos JSON en hojas tabulares CSV compatibles con Excel.' },
    us: { name: 'JSON to CSV Converter', description: 'Transform JSON object collections into CSV tabular sheets compatible with Excel.' },
    fr: { name: 'Convertisseur JSON en CSV', description: 'Transformez des objets JSON en feuilles tabulaires CSV compatibles Excel.' }
  },
  'markdown-a-html': {
    es: { name: 'Convertidor Markdown a HTML', description: 'Convierte texto formateado Markdown (.md) a código HTML limpio y estilizable.' },
    us: { name: 'Markdown to HTML Converter', description: 'Convert formatted Markdown (.md) text into clean and stylable HTML code.' },
    fr: { name: 'Convertisseur Markdown en HTML', description: 'Convertissez du texte Markdown (.md) en code HTML propre et stylisable.' }
  },
  'md-to-html': {
    es: { name: 'Convertidor Markdown a HTML', description: 'Convierte texto formateado Markdown (.md) a código HTML limpio y estilizable.' },
    us: { name: 'Markdown to HTML Converter', description: 'Convert formatted Markdown (.md) text into clean and stylable HTML code.' },
    fr: { name: 'Convertisseur Markdown en HTML', description: 'Convertissez du texte Markdown (.md) en code HTML propre et stylisable.' }
  },
  'txt-a-pdf': {
    es: { name: 'Convertidor TXT a Documento PDF', description: 'Genera un documento PDF formateado a partir de cualquier archivo de texto sin formato.' },
    us: { name: 'TXT to PDF Document Converter', description: 'Generate a formatted PDF document from any plain text file.' },
    fr: { name: 'Convertisseur TXT en Document PDF', description: 'Générez un document PDF formaté à partir de tout fichier texte brut.' }
  },
  'txt-to-pdf': {
    es: { name: 'Convertidor TXT a Documento PDF', description: 'Genera un documento PDF formateado a partir de cualquier archivo de texto sin formato.' },
    us: { name: 'TXT to PDF Document Converter', description: 'Generate a formatted PDF document from any plain text file.' },
    fr: { name: 'Convertisseur TXT en Document PDF', description: 'Générez un document PDF formaté à partir de tout fichier texte brut.' }
  },
  'pdf-a-docx': {
    es: { name: 'Convertidor PDF a Word DOCX', description: 'Extrae contenido, tablas y estilos de documentos PDF hacia documentos Word editables.' },
    us: { name: 'PDF to Word DOCX Converter', description: 'Extract content, tables and styles from PDF documents into editable Word files.' },
    fr: { name: 'Convertisseur PDF en Word DOCX', description: 'Extrayez contenu, tableaux et styles de PDF vers Word modifiable.' }
  },
  'pdf-to-docx': {
    es: { name: 'Convertidor PDF a Word DOCX', description: 'Extrae contenido, tablas y estilos de documentos PDF hacia documentos Word editables.' },
    us: { name: 'PDF to Word DOCX Converter', description: 'Extract content, tables and styles from PDF documents into editable Word files.' },
    fr: { name: 'Convertisseur PDF en Word DOCX', description: 'Extrayez contenu, tableaux et styles de PDF vers Word modifiable.' }
  },
  'pdf-to-word': {
    es: { name: 'Convertidor PDF a Word', description: 'Convierte documentos PDF a archivos Word DOCX editables con máxima fidelidad.' },
    us: { name: 'PDF to Word Converter', description: 'Convert PDF documents to editable Word DOCX files with maximum fidelity.' },
    fr: { name: 'Convertisseur PDF en Word', description: 'Convertissez des documents PDF en fichiers Word DOCX modifiables avec fidélité.' }
  },
  'docx-a-pdf': {
    es: { name: 'Convertidor Word DOCX a PDF', description: 'Convierte documentos Word a formato PDF estándar para compartir e imprimir.' },
    us: { name: 'Word DOCX to PDF Converter', description: 'Convert Word documents to standard PDF format for sharing and printing.' },
    fr: { name: 'Convertisseur Word DOCX en PDF', description: 'Convertissez des documents Word au format PDF standard pour partager.' }
  },
  'docx-to-pdf': {
    es: { name: 'Convertidor Word DOCX a PDF', description: 'Convierte documentos Word a formato PDF estándar para compartir e imprimir.' },
    us: { name: 'Word DOCX to PDF Converter', description: 'Convert Word documents to standard PDF format for sharing and printing.' },
    fr: { name: 'Convertisseur Word DOCX en PDF', description: 'Convertissez des documents Word au format PDF standard pour partager.' }
  },
  'jpg-to-pdf': {
    es: { name: 'Convertidor JPG a PDF', description: 'Agrupa y convierte imágenes JPG a un único documento PDF listo para imprimir.' },
    us: { name: 'JPG to PDF Converter', description: 'Combine and convert JPG images into a single print-ready PDF document.' },
    fr: { name: 'Convertisseur JPG en PDF', description: 'Combinez et convertissez des images JPG en un seul document PDF.' }
  },
  'jpg-a-pdf': {
    es: { name: 'Convertidor JPG a PDF', description: 'Agrupa y convierte imágenes JPG a un único documento PDF listo para imprimir.' },
    us: { name: 'JPG to PDF Converter', description: 'Combine and convert JPG images into a single print-ready PDF document.' },
    fr: { name: 'Convertisseur JPG en PDF', description: 'Combinez et convertissez des images JPG en un seul document PDF.' }
  },

  // VIDEO & AUDIO
  'mp4-to-mp3': {
    es: { name: 'Convertidor MP4 a MP3', description: 'Extrae la pista de audio de vídeos MP4 a formato MP3 de 320 kbps con máxima nitidez.' },
    us: { name: 'MP4 to MP3 Converter', description: 'Extract audio track from MP4 videos into high-clarity 320 kbps MP3 format.' },
    fr: { name: 'Convertisseur MP4 en MP3', description: 'Extrayez la piste audio des vidéos MP4 en MP3 320 kbps haute clarté.' }
  },
  'video-to-mp3': {
    es: { name: 'Extraer Audio de Vídeo a MP3', description: 'Separa la pista sonora de cualquier vídeo y expórtala como archivo MP3.' },
    us: { name: 'Extract Video Audio to MP3', description: 'Separate soundtrack from any video and export as an MP3 audio file.' },
    fr: { name: 'Extraire l\'audio de vidéo en MP3', description: 'Séparez la bande son de toute vidéo et exportez au format MP3.' }
  },
  'mov-to-mp4': {
    es: { name: 'Convertidor MOV a MP4', description: 'Transforma vídeos de iPhone/Apple QuickTime MOV a formato MP4 universal.' },
    us: { name: 'MOV to MP4 Converter', description: 'Transform iPhone/Apple QuickTime MOV videos to universal MP4 format.' },
    fr: { name: 'Convertisseur MOV en MP4', description: 'Transformez les vidéos iPhone/Apple MOV au format universel MP4.' }
  },
  'mov-a-mp4': {
    es: { name: 'Convertidor MOV a MP4', description: 'Transforma vídeos de iPhone/Apple QuickTime MOV a formato MP4 universal.' },
    us: { name: 'MOV to MP4 Converter', description: 'Transform iPhone/Apple QuickTime MOV videos to universal MP4 format.' },
    fr: { name: 'Convertisseur MOV en MP4', description: 'Transformez les vidéos iPhone/Apple MOV au format universel MP4.' }
  },
  'mp4-to-gif': {
    es: { name: 'Convertidor Vídeo MP4 a GIF', description: 'Crea animaciones GIF a partir de clips de vídeo MP4 o WebM.' },
    us: { name: 'MP4 Video to GIF Converter', description: 'Create GIF animations from MP4 or WebM video clips.' },
    fr: { name: 'Convertisseur Vidéo MP4 en GIF', description: 'Créez des animations GIF à partir de clips vidéo MP4 ou WebM.' }
  },
  'mp4-a-gif': {
    es: { name: 'Convertidor Vídeo MP4 a GIF', description: 'Crea animaciones GIF a partir de clips de vídeo MP4 o WebM.' },
    us: { name: 'MP4 Video to GIF Converter', description: 'Create GIF animations from MP4 or WebM video clips.' },
    fr: { name: 'Convertisseur Vidéo MP4 en GIF', description: 'Créez des animations GIF à partir de clips vidéo MP4 ou WebM.' }
  },
  'video-to-gif': {
    es: { name: 'Convertidor de Vídeo a GIF', description: 'Convierte cualquier fragmento de vídeo en animación GIF compartible.' },
    us: { name: 'Video to GIF Converter', description: 'Convert any video clip into a shareable animated GIF.' },
    fr: { name: 'Convertisseur Vidéo en GIF', description: 'Convertissez tout clip vidéo en animation GIF partageable.' }
  },
  'audio-a-wav': {
    es: { name: 'Convertidor Audio a WAV', description: 'Decodifica cualquier archivo de audio del navegador a formato WAV PCM sin pérdidas.' },
    us: { name: 'Audio to WAV Converter', description: 'Decode any audio file in browser to lossless WAV PCM format.' },
    fr: { name: 'Convertisseur Audio en WAV', description: 'Décodez tout fichier audio en format WAV PCM sans perte.' }
  },
  'wav-a-mp3': {
    es: { name: 'Convertidor WAV a MP3', description: 'Convierte pistas de audio de alta fidelidad a formato MP3 ligero y universal.' },
    us: { name: 'WAV to MP3 Converter', description: 'Convert high-fidelity audio tracks to lightweight universal MP3 format.' },
    fr: { name: 'Convertisseur WAV en MP3', description: 'Convertissez des pistes audio haute fidélité en format MP3 léger.' }
  },
  'mp3-a-wav': {
    es: { name: 'Convertidor MP3 a WAV', description: 'Extrae audio MP3 a formato WAV sin compresión para edición profesional.' },
    us: { name: 'MP3 to WAV Converter', description: 'Extract MP3 audio into uncompressed WAV format for pro editing.' },
    fr: { name: 'Convertisseur MP3 en WAV', description: 'Extrayez l\'audio MP3 en format WAV non compressé pour l\'édition.' }
  },
  'video-converter': {
    es: { name: 'Convertidor de Vídeo', description: 'Convierte tus vídeos a MP4, WebM, MOV, AVI o extrae el audio en MP3 de forma rápida.' },
    us: { name: 'Video Converter', description: 'Convert your videos to MP4, WebM, MOV, AVI or extract MP3 audio quickly.' },
    fr: { name: 'Convertisseur Vidéo', description: 'Convertissez vos vidéos en MP4, WebM, MOV, AVI ou extrayez l\'audio MP3.' }
  },
  'audio-converter': {
    es: { name: 'Convertidor de Audio', description: 'Convierte archivos de audio entre formatos MP3, WAV, OGG, M4A, FLAC y AAC.' },
    us: { name: 'Audio Converter', description: 'Convert audio files between MP3, WAV, OGG, M4A, FLAC, and AAC formats.' },
    fr: { name: 'Convertisseur Audio', description: 'Convertissez des fichiers audio entre formats MP3, WAV, OGG, M4A, FLAC et AAC.' }
  },

  // ARCHIVE & ZIP
  'crear-zip': {
    es: { name: 'Creador y Compresor ZIP', description: 'Empaqueta y comprime múltiples archivos o carpetas en un archivo .ZIP descargable.' },
    us: { name: 'ZIP Creator & Compressor', description: 'Pack and compress multiple files or folders into a downloadable .ZIP archive.' },
    fr: { name: 'Créateur & Compresseur ZIP', description: 'Empaquetez et compressez plusieurs fichiers en archive .ZIP téléchargeable.' }
  },
  'files-to-zip': {
    es: { name: 'Creador y Compresor ZIP', description: 'Empaqueta y comprime múltiples archivos o carpetas en un archivo .ZIP descargable.' },
    us: { name: 'ZIP Creator & Compressor', description: 'Pack and compress multiple files or folders into a downloadable .ZIP archive.' },
    fr: { name: 'Créateur & Compresseur ZIP', description: 'Empaquetez et compressez plusieurs fichiers en archive .ZIP téléchargeable.' }
  },
  'descomprimir-zip': {
    es: { name: 'Extractor e Inspector ZIP', description: 'Abre archivos ZIP y extrae su contenido sin necesidad de instalar software externo.' },
    us: { name: 'ZIP Extractor & Inspector', description: 'Open ZIP files and extract their contents without external software.' },
    fr: { name: 'Extracteur & Inspecteur ZIP', description: 'Ouvrez les fichiers ZIP et extrayez leur contenu sans logiciel externe.' }
  },
  'zip-extractor': {
    es: { name: 'Extractor e Inspector ZIP', description: 'Abre archivos ZIP y extrae su contenido sin necesidad de instalar software externo.' },
    us: { name: 'ZIP Extractor & Inspector', description: 'Open ZIP files and extract their contents without external software.' },
    fr: { name: 'Extracteur & Inspecteur ZIP', description: 'Ouvrez les fichiers ZIP et extrayez leur contenu sans logiciel externe.' }
  }
};

/**
 * Localizes a FileTool (cards in ToolCatalog, CategoryPage, etc.)
 */
export function getLocalizedFileTool(tool: FileTool, lang: SupportedLanguage): FileTool {
  if (lang === 'es') return tool;

  const key = tool.slug || tool.id;
  const match = TOOL_TRANSLATIONS[key] || TOOL_TRANSLATIONS[tool.id];

  if (match && match[lang]) {
    return {
      ...tool,
      name: match[lang].name,
      description: match[lang].description
    };
  }

  // General fallback translation based on fromFormat and toFormat
  if (tool.type === 'compress') {
    const fmt = tool.fromFormat.toUpperCase();
    return {
      ...tool,
      name: lang === 'us' ? `Compress ${fmt}` : `Compresser ${fmt}`,
      description: lang === 'us'
        ? `Reduce ${fmt} file size with intelligent compression in your browser.`
        : `Réduisez la taille des fichiers ${fmt} avec une compression intelligente.`
    };
  }

  if (tool.fromFormat && tool.toFormat) {
    const from = tool.fromFormat.toUpperCase();
    const to = tool.toFormat.toUpperCase();
    return {
      ...tool,
      name: lang === 'us' ? `${from} to ${to} Converter` : `Convertisseur ${from} en ${to}`,
      description: lang === 'us'
        ? `Convert ${from} files to ${to} format instantly and with 100% privacy.`
        : `Convertissez vos fichiers ${from} en ${to} instantanément et en toute confidentialité.`
    };
  }

  return tool;
}

/**
 * Localizes a full ToolConfig
 */
export function getLocalizedToolConfig(tool: ToolConfig, lang: SupportedLanguage): ToolConfig {
  if (lang === 'es') return tool;

  const key = tool.slug || tool.id;
  const match = TOOL_TRANSLATIONS[key] || TOOL_TRANSLATIONS[tool.id];

  const localizedName = match && match[lang] ? match[lang].name : (
    tool.type === 'compress'
      ? (lang === 'us' ? `Compress ${tool.defaultOutputFormat}` : `Compresser ${tool.defaultOutputFormat}`)
      : (lang === 'us' ? `${tool.inputFormats[0]} to ${tool.defaultOutputFormat} Converter` : `Convertisseur ${tool.inputFormats[0]} en ${tool.defaultOutputFormat}`)
  );

  const localizedDesc = match && match[lang] ? match[lang].description : tool.description;

  return {
    ...tool,
    name: localizedName,
    shortName: localizedName,
    h1: tool.type === 'compress' 
      ? (lang === 'us' ? `Compress ${tool.defaultOutputFormat} Online` : `Compresser ${tool.defaultOutputFormat} en ligne`)
      : (lang === 'us' ? `Convert ${tool.inputFormats[0]} to ${tool.defaultOutputFormat}` : `Convertir ${tool.inputFormats[0]} en ${tool.defaultOutputFormat}`),
    description: localizedDesc
  };
}

/* =========================================================================
   TRADUCCIÓN COMPLETA DE ARTÍCULOS DE NOTICIAS & TENDENCIAS / DISCOVER
   ========================================================================= */

interface BlogPostTranslation {
  title: string;
  h1: string;
  excerpt: string;
  readingTime?: string;
  tags?: string[];
  content?: string;
}

const BLOG_TRANSLATIONS: Record<string, Record<SupportedLanguage, BlogPostTranslation>> = {
  // 1. mp4-to-mp3 guide
  'mp4-to-mp3': {
    es: {
      title: 'Cómo Convertir MP4 a MP3 Online Sin Perder Calidad (Guía Completa 2026)',
      h1: 'Guía Definitiva: Cómo Extraer y Convertir Audio MP4 a MP3',
      excerpt: 'Aprende a extraer la pista de sonido de tus vídeos MP4 y convertirla en MP3 de 320 kbps con máxima nitidez y 100% de privacidad en tu navegador.',
      readingTime: '3 min read',
      tags: ['MP4', 'MP3', 'Audio', 'Tutorial', 'Local Conversion', 'Music']
    },
    us: {
      title: 'How to Convert MP4 to MP3 Online Without Quality Loss (Full 2026 Guide)',
      h1: 'Ultimate Guide: How to Extract and Convert MP4 Audio to MP3',
      excerpt: 'Learn how to extract soundtrack from MP4 videos and convert it to 320 kbps MP3 with maximum clarity and 100% privacy in your browser.',
      readingTime: '3 min read',
      tags: ['MP4', 'MP3', 'Audio', 'Tutorial', 'Local Conversion', 'Music']
    },
    fr: {
      title: 'Comment convertir MP4 en MP3 en ligne sans perte de qualité (Guide 2026)',
      h1: 'Guide Ultime : Comment extraire et convertir l\'audio MP4 en MP3',
      excerpt: 'Apprenez à extraire la bande sonore de vos vidéos MP4 et à la convertir en MP3 320 kbps avec netteté maximale et 100% de confidentialité.',
      readingTime: '3 min de lecture',
      tags: ['MP4', 'MP3', 'Audio', 'Tutoriel', 'Conversion locale', 'Musique']
    }
  },

  // 2. jpg-to-png guide
  'jpg-to-png': {
    es: {
      title: 'Cómo Convertir JPG a PNG Sin Pérdida de Calidad y con Transparencia',
      h1: 'Guía Completa: Convertir Imágenes JPG a PNG con Máxima Nitidez',
      excerpt: 'Descubre las diferencias técnicas entre JPG y PNG, por qué conviene convertir tus fotos y cómo preparar gráficos para fondos transparentes.',
      readingTime: '3 min read',
      tags: ['JPG', 'PNG', 'Graphic Design', 'Transparency', 'Lossless', 'Tutorial']
    },
    us: {
      title: 'How to Convert JPG to PNG Without Quality Loss and with Transparency',
      h1: 'Complete Guide: Convert JPG Images to PNG with Maximum Sharpness',
      excerpt: 'Discover the technical differences between JPG and PNG, why to convert your photos and how to prepare graphics for transparent backgrounds.',
      readingTime: '3 min read',
      tags: ['JPG', 'PNG', 'Graphic Design', 'Transparency', 'Lossless', 'Tutorial']
    },
    fr: {
      title: 'Comment convertir JPG en PNG sans perte de qualité et avec transparence',
      h1: 'Guide Complet : Convertir des images JPG en PNG avec netteté maximale',
      excerpt: 'Découvrez les différences techniques entre JPG et PNG, pourquoi convertir vos photos et comment préparer des graphiques transparents.',
      readingTime: '3 min de lecture',
      tags: ['JPG', 'PNG', 'Design Graphique', 'Transparence', 'Sans Perte', 'Tutoriel']
    }
  },

  // 3. mov-to-mp4 guide
  'mov-to-mp4': {
    es: {
      title: 'Cómo Convertir Vídeos MOV de iPhone a MP4 Compatible con Todo',
      h1: 'Convertir Vídeos QuickTime MOV a MP4 Universal',
      excerpt: 'Soluciona problemas de reproducción en Windows, Android y televisores convirtiendo vídeos MOV de Apple a MP4 H.264 ligero y rápido.',
      readingTime: '2 min read',
      tags: ['MOV', 'MP4', 'iPhone', 'Apple', 'Video', 'Tutorial']
    },
    us: {
      title: 'How to Convert iPhone MOV Videos to Universal MP4 Compatible Everywhere',
      h1: 'Convert QuickTime MOV Videos to Universal MP4',
      excerpt: 'Fix playback issues on Windows, Android and Smart TVs by converting Apple MOV videos to fast, lightweight H.264 MP4.',
      readingTime: '2 min read',
      tags: ['MOV', 'MP4', 'iPhone', 'Apple', 'Video', 'Tutorial']
    },
    fr: {
      title: 'Comment convertir les vidéos MOV d\'iPhone en MP4 universel compatible partout',
      h1: 'Convertir les vidéos QuickTime MOV en MP4 universel',
      excerpt: 'Résolvez les problèmes de lecture sur Windows et Android en convertissant les vidéos MOV Apple en MP4 H.264 léger et rapide.',
      readingTime: '2 min de lecture',
      tags: ['MOV', 'MP4', 'iPhone', 'Apple', 'Vidéo', 'Tutoriel']
    }
  },

  // 4. webp-to-jpg guide
  'webp-to-jpg': {
    es: {
      title: 'Cómo Convertir Imágenes WebP a JPG para Abrirlas en Cualquier Programa',
      h1: 'Cómo Pasar Imágenes WebP a JPG en Segundos',
      excerpt: '¿Descargaste una imagen de internet y no puedes abrirla en Photoshop o visores clásicos? Aprende a transformarla en JPG universal.',
      readingTime: '2 min read',
      tags: ['WebP', 'JPG', 'Internet', 'Tutorial', 'Compatibility']
    },
    us: {
      title: 'How to Convert WebP Images to JPG to Open Them in Any Software',
      h1: 'How to Turn WebP Images into JPG in Seconds',
      excerpt: 'Downloaded an image and cannot open it in Photoshop or classic viewers? Learn how to turn it into universal JPG.',
      readingTime: '2 min read',
      tags: ['WebP', 'JPG', 'Internet', 'Tutorial', 'Compatibility']
    },
    fr: {
      title: 'Comment convertir les images WebP en JPG pour les ouvrir dans n\'importe quel logiciel',
      h1: 'Comment transformer des images WebP en JPG en quelques secondes',
      excerpt: 'Image WebP impossible à ouvrir dans vos logiciels classiques ? Découvrez comment la convertir en JPG universel.',
      readingTime: '2 min de lecture',
      tags: ['WebP', 'JPG', 'Internet', 'Tutoriel', 'Compatibilité']
    }
  }
};

/**
 * Intelligent dictionary translator for News & Trend titles and excerpts
 */
function translateNewsText(text: string, lang: SupportedLanguage): string {
  if (lang === 'es' || !text) return text;

  if (lang === 'us') {
    return text
      // Title patterns
      .replace(/En 2026 tus imágenes pesan MÁS: descubre cómo CAMBIAR su formato GRATIS/gi, 'In 2026 your images are LARGER: learn how to CHANGE their format for FREE')
      .replace(/Tus imágenes pesan MÁS en 2026: descubre cómo CAMBIAR su formato GRATIS/gi, 'Your images are LARGER in 2026: discover how to CHANGE their format for FREE')
      .replace(/En 2026 tus vídeos pesan MÁS: aprende a REDUCIRLOS GRATIS/gi, 'In 2026 your videos are HEAVIER: learn how to REDUCE them for FREE')
      .replace(/Tus vídeos pesan MÁS en 2026: aprende a REDUCIRLOS GRATIS/gi, 'Your videos are HEAVIER in 2026: learn how to REDUCE them for FREE')
      .replace(/En 2026 convertir imágenes es más útil que nunca: pasa PNG a SVG GRATIS/gi, 'In 2026 converting images is more useful than ever: turn PNG into SVG for FREE')
      .replace(/¿Tu foto HEIC no abre\? En 2026 puedes convertirla a JPG GRATIS/gi, 'HEIC photo won\'t open? In 2026 you can convert it to JPG for FREE')
      .replace(/¿Tu HEIC no funciona\? DESCUBRE cómo pasarlo a PNG GRATIS/gi, 'HEIC not working? DISCOVER how to convert it to PNG for FREE')
      .replace(/WEBP crece en 2026, pero JPG sigue siendo necesario: conviértelo GRATIS/gi, 'WEBP is growing in 2026, but JPG is still needed: convert it for FREE')
      .replace(/SVG gana terreno en 2026: descubre cómo convertir tus imágenes GRATIS/gi, 'SVG gains momentum in 2026: discover how to convert your images for FREE')
      .replace(/Por qué en 2026 el formato GIF sigue vivo y cómo CREARLO GRATIS/gi, 'Why the GIF format is still alive in 2026 and how to CREATE IT for FREE')
      .replace(/En 2026 necesitas editar un PDF: aprende a pasarlo a Word GRATIS/gi, 'Need to edit a PDF in 2026: learn how to convert it to Word for FREE')
      .replace(/El truco definitivo de 2026 para ENVIAR imágenes: únelas en un PDF GRATIS/gi, 'The ultimate 2026 trick for SHARING images: merge them into a PDF for FREE')
      .replace(/Extrae el AUDIO de tus vídeos en 2026: pasa MP4 a MP3 GRATIS/gi, 'Extract AUDIO from your videos in 2026: turn MP4 into MP3 for FREE')
      .replace(/iPhone graba en MOV en 2026: conviértelo a MP4 universal GRATIS/gi, 'iPhone records in MOV in 2026: convert it to universal MP4 for FREE')
      .replace(/Convierte vídeos pesados a GIF en 2026 con un solo clic GRATIS/gi, 'Convert heavy videos to GIF in 2026 with a single click for FREE')
      .replace(/Pasa tus documentos escaneados a PDF profesional en 2026 GRATIS/gi, 'Convert scanned documents to professional PDF in 2026 for FREE')
      // Common phrase replacements in excerpts and content
      .replace(/Imagina poder almacenar miles de fotos en tu móvil o servidor sin recibir jamás la temida notificación de "memoria llena"/gi, 'Imagine being able to store thousands of photos on your phone or server without ever getting the dreaded "storage full" notification')
      .replace(/Este año, optimizar tus recursos visuales no es solo un truco de organización, sino una necesidad/gi, 'This year, optimizing your visual assets is not just an organization trick, but an absolute necessity')
      .replace(/Si utilizas un iPhone, es muy probable que tus fotos se guarden de forma automática en el formato HEIC/gi, 'If you use an iPhone, your photos are likely saved automatically in HEIC format')
      .replace(/En un mundo donde las pantallas varían desde pequeños relojes inteligentes hasta gigantescos monitores/gi, 'In a world where screens range from smartwatches to giant ultra-high definition displays')
      .replace(/Te prometemos que hoy descubrirás/gi, 'We promise that today you will discover')
      .replace(/totalmente gratis/gi, 'completely free')
      .replace(/de forma gratuita/gi, 'for free')
      .replace(/sin perder calidad/gi, 'without losing quality')
      .replace(/en tu navegador/gi, 'in your browser')
      .replace(/100% privado/gi, '100% private')
      .replace(/min de lectura/gi, 'min read')
      .replace(/### Claves y contexto en 2026/gi, '### Key Context in 2026')
      .replace(/### Desafíos técnicos y arquitectura de formatos/gi, '### Technical Challenges & Format Architecture')
      .replace(/### La solución directa en MediaConvert/gi, '### Direct Solution on MediaConvert')
      .replace(/### Herramientas interactivas recomendadas para tu flujo de trabajo/gi, '### Recommended Interactive Tools for Your Workflow')
      .replace(/Prueba directamente las siguientes herramientas de conversión optimizadas para este formato:/gi, 'Try the following optimized conversion tools directly in your browser:');
  }

  if (lang === 'fr') {
    return text
      // Title patterns
      .replace(/En 2026 tus imágenes pesan MÁS: descubre cómo CAMBIAR su formato GRATIS/gi, 'En 2026 vos images sont plus LOURDES : apprenez à CHANGER de format GRATUITEMENT')
      .replace(/Tus imágenes pesan MÁS en 2026: descubre cómo CAMBIAR su formato GRATIS/gi, 'Vos images sont plus LOURDES en 2026 : découvrez comment CHANGER de format GRATUITEMENT')
      .replace(/En 2026 tus vídeos pesan MÁS: aprende a REDUCIRLOS GRATIS/gi, 'En 2026 vos vidéos sont plus LOURDES : apprenez à les RÉDUIRE GRATUITEMENT')
      .replace(/Tus vídeos pesan MÁS en 2026: aprende a REDUCIRLOS GRATIS/gi, 'Vos vidéos sont plus LOURDES en 2026 : apprenez à les RÉDUIRE GRATUITEMENT')
      .replace(/En 2026 convertir imágenes es más útil que nunca: pasa PNG a SVG GRATIS/gi, 'En 2026 convertir des images est plus utile que jamais : passez de PNG à SVG GRATUITEMENT')
      .replace(/¿Tu foto HEIC no abre\? En 2026 puedes convertirla a JPG GRATIS/gi, 'Votre photo HEIC ne s\'ouvre pas ? En 2026 convertissez-la en JPG GRATUITEMENT')
      .replace(/¿Tu HEIC no funciona\? DESCUBRE cómo pasarlo a PNG GRATIS/gi, 'Votre HEIC ne fonctionne pas ? DÉCOUVREZ comment le convertir en PNG GRATUITEMENT')
      .replace(/WEBP crece en 2026, pero JPG sigue siendo necesario: conviértelo GRATIS/gi, 'WEBP progresse en 2026, mais JPG reste indispensable : convertissez-le GRATUITEMENT')
      .replace(/SVG gana terreno en 2026: descubre cómo convertir tus imágenes GRATIS/gi, 'SVG gagne du terrain en 2026 : découvrez comment convertir vos images GRATUITEMENT')
      .replace(/Por qué en 2026 el formato GIF sigue vivo y cómo CREARLO GRATIS/gi, 'Pourquoi le format GIF est toujours vivant en 2026 et comment le CRÉER GRATUITEMENT')
      .replace(/En 2026 necesitas editar un PDF: aprende a pasarlo a Word GRATIS/gi, 'Besoin d\'éditer un PDF en 2026 : apprenez à le convertir en Word GRATUITEMENT')
      .replace(/El truco definitivo de 2026 para ENVIAR imágenes: únelas en un PDF GRATIS/gi, 'L\'astuce ultime de 2026 pour ENVOYER des images : fusionnez-les en PDF GRATUITEMENT')
      .replace(/Extrae el AUDIO de tus vídeos en 2026: pasa MP4 a MP3 GRATIS/gi, 'Extrayez l\'AUDIO de vos vidéos en 2026 : passez de MP4 à MP3 GRATUITEMENT')
      .replace(/iPhone graba en MOV en 2026: conviértelo a MP4 universal GRATIS/gi, 'L\'iPhone enregistre en MOV en 2026 : convertissez-le en MP4 universel GRATUITEMENT')
      .replace(/Convierte vídeos pesados a GIF en 2026 con un solo clic GRATIS/gi, 'Convertissez des vidéos lourdes en GIF en 2026 en un clic GRATUITEMENT')
      .replace(/Pasa tus documentos escaneados a PDF profesional en 2026 GRATIS/gi, 'Convertissez vos documents scannés en PDF professionnel en 2026 GRATUITEMENT')
      // Common phrase replacements in excerpts and content
      .replace(/Imagina poder almacenar miles de fotos en tu móvil o servidor sin recibir jamás la temida notificación de "memoria llena"/gi, 'Imaginez pouvoir stocker des milliers de photos sur votre mobile ou serveur sans jamais recevoir la notification de "mémoire pleine"')
      .replace(/Este año, optimizar tus recursos visuales no es solo un truco de organización, sino una necesidad/gi, 'Cette année, optimiser vos ressources visuelles n\'est pas qu\'une astuce d\'organisation, c\'est une nécessité absolue')
      .replace(/Si utilizas un iPhone, es muy probable que tus fotos se guarden de forma automática en el formato HEIC/gi, 'Si vous utilisez un iPhone, vos photos sont très probablement enregistrées automatiquement au format HEIC')
      .replace(/En un mundo donde las pantallas varían desde pequeños relojes inteligentes hasta gigantescos monitores/gi, 'Dans un monde où les écrans vont des montres connectées aux moniteurs ultra haute définition')
      .replace(/Te prometemos que hoy descubrirás/gi, 'Nous vous promettons qu\'aujourd\'hui vous découvrirez')
      .replace(/totalmente gratis/gi, 'totalement gratuit')
      .replace(/de forma gratuita/gi, 'gratuitement')
      .replace(/sin perder calidad/gi, 'sans perte de qualité')
      .replace(/en tu navegador/gi, 'dans votre navigateur')
      .replace(/100% privado/gi, '100% privé')
      .replace(/min de lectura/gi, 'min de lecture')
      .replace(/### Claves y contexto en 2026/gi, '### Clés et contexte en 2026')
      .replace(/### Desafíos técnicos y arquitectura de formatos/gi, '### Défis techniques et architecture des formats')
      .replace(/### La solución directa en MediaConvert/gi, '### La solution directe sur MediaConvert')
      .replace(/### Herramientas interactivas recomendadas para tu flujo de trabajo/gi, '### Outils interactifs recommandés pour votre travail')
      .replace(/Prueba directamente las siguientes herramientas de conversión optimizadas para este formato:/gi, 'Essayez directement les outils de conversion optimisés pour ce format :');
  }

  return text;
}

/**
 * Localizes a single BlogPost (for NewsBlogPage & NewsListPage)
 */
export function getLocalizedBlogPost(post: BlogPost, lang: SupportedLanguage): BlogPost {
  if (lang === 'es') return post;

  // Direct exact slug match
  const directMatch = BLOG_TRANSLATIONS[post.slug] || (post.toolSlug ? BLOG_TRANSLATIONS[post.toolSlug] : null);
  if (directMatch && directMatch[lang]) {
    const d = directMatch[lang];
    return {
      ...post,
      title: d.title || translateNewsText(post.title, lang),
      h1: d.h1 || translateNewsText(post.h1, lang),
      excerpt: d.excerpt || translateNewsText(post.excerpt, lang),
      content: d.content ? d.content : translateNewsText(post.content, lang),
      readingTime: d.readingTime || (lang === 'us' ? '3 min read' : '3 min de lecture'),
      tags: d.tags || post.tags,
      seoTitle: d.title ? `${d.title} | MediaConvert` : translateNewsText(post.seoTitle, lang),
      seoMetaDescription: d.excerpt ? d.excerpt : translateNewsText(post.seoMetaDescription, lang)
    };
  }

  // Dynamic news translation
  const translatedTitle = translateNewsText(post.title, lang);
  const translatedH1 = translateNewsText(post.h1 || post.title, lang);
  const translatedExcerpt = translateNewsText(post.excerpt, lang);
  const translatedContent = translateNewsText(post.content, lang);

  return {
    ...post,
    title: translatedTitle,
    h1: translatedH1,
    excerpt: translatedExcerpt,
    content: translatedContent,
    readingTime: lang === 'us' ? '3 min read' : lang === 'fr' ? '3 min de lecture' : post.readingTime,
    seoTitle: `${translatedTitle} | MediaConvert`,
    seoMetaDescription: translatedExcerpt.slice(0, 160)
  };
}
