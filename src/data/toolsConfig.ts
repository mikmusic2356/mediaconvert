import { ToolConfig, FileCategory, CategoryDefinition, ToolGuideArticle } from '../types';

// ==========================================
// CATEGORÍAS REGISTRADAS
// ==========================================
export const CATEGORIES_CONFIG: CategoryDefinition[] = [
  {
    id: 'video-audio',
    name: 'Video & Audio',
    emoji: '🎵',
    description: 'Conversores de vídeo, extracción de pistas de audio, MP4, MP3, MOV y OGG.',
    slug: 'video-audio',
    iconName: 'Music',
  },
  {
    id: 'image',
    name: 'Imagen',
    emoji: '🖼️',
    description: 'Transformación y optimización de imágenes en JPG, PNG, WebP, HEIC, SVG y JFIF.',
    slug: 'imagen',
    iconName: 'Image',
  },
  {
    id: 'pdf-document',
    name: 'PDF & Documentos',
    emoji: '📄',
    description: 'Herramientas de conversión para archivos PDF, Word, EPUB, DOCX y libros electrónicos.',
    slug: 'pdf-documentos',
    iconName: 'FileText',
  },
  {
    id: 'gif',
    name: 'GIF',
    emoji: '🎞️',
    description: 'Generación, conversión y extracción de animaciones GIF a partir de vídeos e imágenes.',
    slug: 'gif',
    iconName: 'Film',
  },
  {
    id: 'archive',
    name: 'Archivos ZIP',
    emoji: '📦',
    description: 'Empaquetador y compresor de archivos en contenedores .ZIP seguros.',
    slug: 'archivos-zip',
    iconName: 'Archive',
  },
];

// ==========================================
// REGISTRO CENTRAL DE HERRAMIENTAS (TOOLS_CONFIG)
// ==========================================
export const TOOLS_CONFIG: Record<string, ToolConfig> = {
  // ==========================================
  // 1. 🖼️ IMAGEN
  // ==========================================
  'jpg-to-png': {
    id: 'jpg-to-png',
    slug: 'jpg-to-png',
    routePath: '/convert/jpg-to-png',
    category: 'image',
    type: 'convert',
    name: 'JPG a PNG',
    shortName: 'JPG a PNG',
    title: 'Convertir JPG a PNG Online — Rápido, Sin Pérdidas y Gratis | MediaConvert',
    h1: 'Convertir JPG a PNG',
    description: 'Convierte tus imágenes JPG a formato PNG con máxima nitidez y fidelidad cromática directamente en tu navegador.',
    contextualDescription: 'Esta herramienta permite convertir imágenes JPG al formato PNG de forma sencilla. El usuario puede cargar una imagen JPG, procesarla y obtener una versión PNG compatible con diferentes aplicaciones y usos digitales.',
    badge: 'Sin Pérdidas • Procesamiento Local',
    inputFormats: ['JPG', 'JPEG', 'JFIF', 'PJPEG'],
    outputFormats: ['PNG'],
    defaultOutputFormat: 'PNG',
    processingType: 'local',
    maxFileSize: 2147483648, // 2GB

    whatIsFrom: {
      title: '¿Qué es el formato JPG?',
      badge: 'Joint Photographic Experts Group',
      description: 'JPG (o JPEG) es el estándar de compresión de imágenes fotográficas más extendido en el mundo digital. Utiliza un algoritmo de compresión con pérdidas (lossy) basado en la Transformada de Coseno Discreta (DCT), descartando información visual imperceptible para el ojo humano con el objetivo de reducir enormemente el peso del archivo. No admite canal alfa (transparencia) ni capas.',
      pros: ['Archivos muy livianos ideales para almacenar fotos', 'Compatibilidad absoluta en cualquier dispositivo o navegador', 'Excelente reproducción de gradientes cromáticos y tonos continuos'],
      cons: ['Compresión con pérdida que deteriora la calidad en cada guardado', 'Sin soporte para transparencias (siempre tiene fondo sólido)', 'Artefactos de compresión visibles en bordes de texto y logotipos']
    },

    whatIsTo: {
      title: '¿Qué es el formato PNG?',
      badge: 'Portable Network Graphics',
      description: 'PNG es un estándar abierto de mapa de bits diseñado específicamente para suplir las carencias de los formatos antiguos en la web. Emplea un algoritmo de compresión sin pérdidas (lossless) basado en DEFLATE (LZ77 + codificación Huffman). Admite color verdadero de 24 bits y un canal alfa independiente de 8 bits que proporciona hasta 256 niveles de transparencia gradual.',
      pros: ['Compresión sin pérdidas que mantiene la nitidez al 100%', 'Soporte completo de canal alfa y fondos transparentes', 'Bordes nítidos perfectos para tipografía, iconos, capturas y diseño gráfico'],
      cons: ['Tamaño de archivo más pesado que JPG en fotografías complejas', 'No soporta animación nativa (a diferencia de APNG o GIF)']
    },

    whyConvertReason: {
      heading: '¿Para qué sirve convertir JPG a PNG?',
      description: 'La conversión de JPG a formato PNG es fundamental cuando necesitas manipular o utilizar una imagen en entornos donde la calidad, la transparencia y la estabilidad de píxeles son prioritarias.',
      points: [
        {
          title: 'Detener la degradación acumulativa',
          desc: 'Cada vez que guardas o editas un archivo JPG, el algoritmo de compresión comprime de nuevo los bloques de 8x8 píxeles, acumulando ruido y borrosidad. Al convertir a PNG, la imagen queda congelada en compresión sin pérdidas, permitiendo editar y exportar infinitas veces sin perder nitidez.'
        },
        {
          title: 'Preparación para recortar fondos y aplicar transparencias',
          desc: 'Los archivos JPG siempre tienen un fondo de color sólido. Al pasarlo a PNG, puedes abrirlo en cualquier software o editor para aislar objetos, eliminar el fondo y aprovechar el canal alfa RGBA.'
        },
        {
          title: 'Logotipos, capturas de pantalla y gráficos UI',
          desc: 'Las interfaces de usuario, esquemas técnicos y textos sufren distorsión en JPG por artefactos de alta frecuencia. En PNG, las líneas rectas y el contraste de bordes se representan con absoluta claridad.'
        },
        {
          title: 'Requisitos de plataformas y motores de renderizado',
          desc: 'Muchos motores de videojuegos (Unity, Unreal), sistemas de impresión digital y herramientas de diseño (Figma, Illustrator, Canva) exigen archivos rasterizados PNG para asegurar máxima fidelidad.'
        }
      ]
    },

    whatHappensDuringConversion: [
      {
        step: 1,
        title: 'Lectura y decodificación local en RAM',
        explanation: 'El navegador lee el archivo JPG a través de la API File y decodifica la matriz DCT directamente en la memoria local, sin enviar ni un solo byte a servidores externos.'
      },
      {
        step: 2,
        title: 'Reconstrucción de la matriz de píxeles RGBA',
        explanation: 'Se crea un lienzo en memoria de alta resolución (Canvas 2D con aceleración por hardware GPU) renderizando los valores de color de 32 bits (Rojo, Verde, Azul y canal Alfa predeterminado).'
      },
      {
        step: 3,
        title: 'Filtro de predicción y compresión DEFLATE',
        explanation: 'El motor serializa los píxeles mediante los filtros Paeth del estándar PNG y aplica la compresión LZ77 sin pérdidas, generando un archivo binario PNG puro.'
      },
      {
        step: 4,
        title: 'Generación instantánea del archivo descargable',
        explanation: 'Se construye un Blob binario en tu navegador listo para descarga inmediata, empaquetado en .ZIP o almacenamiento en tu biblioteca.'
      }
    ],

    acceptedFilesGuide: {
      extensions: ['.jpg', '.jpeg', '.jfif', '.pjpeg'],
      description: 'Cualquier imagen en formato JPEG estándar procedente de cámaras réflex, smartphones Android/iOS, capturas web o software de edición.',
      maxSize: 'Hasta 2 GB por archivo',
      notes: 'No hay límite de cantidad de archivos simultáneos.'
    },

    expectedResultGuide: {
      format: 'PNG (image/png)',
      description: 'Un archivo PNG de máxima resolución, idéntico visualmente al original pero libre de futuras pérdidas de compresión, compatible con el 100% de visores, navegadores y herramientas de diseño.',
      features: [
        'Espacio de color sRGB preservado con fidelidad cromática exacta',
        'Profundidad de color de 24/32 bits lista para edición gráfica',
        'Descarga individual inmediata o paquete .ZIP consolidado'
      ]
    },

    features: [
      'Conversión sin pérdida de píxeles ni reducción de resolución',
      'Soporte completo para canal alfa y fondos transparentes',
      'Procesamiento en memoria RAM local sin subir datos a la nube',
      'Conversión por lotes de múltiples imágenes simultáneamente',
      'Descarga individual o empaquetado instantáneo en archivo .ZIP'
    ],
    howToSteps: [
      {
        step: 1,
        title: 'Selecciona o arrastra tus archivos JPG',
        instruction: 'Arrastra tus imágenes .jpg o .jpeg al área de carga superior o búscalas en tu almacenamiento local.'
      },
      {
        step: 2,
        title: 'Configura las opciones de salida',
        instruction: 'El formato PNG se preselecciona automáticamente. Opcionalmente puedes ajustar dimensiones, escala o filtros.'
      },
      {
        step: 3,
        title: 'Descarga tu imagen PNG',
        instruction: 'Haz clic en Convertir y descarga tus archivos PNG convertidos al instante de forma individual o en un archivo .ZIP.'
      }
    ],
    formatComparison: {
      fromName: 'Joint Photographic Experts Group (JPG)',
      toName: 'Portable Network Graphics (PNG)',
      fromExt: 'JPG',
      toExt: 'PNG',
      points: [
        { feature: 'Tipo de compresión', fromValue: 'Con pérdidas (Lossy)', toValue: 'Sin pérdidas (Lossless)', advantage: 'to' },
        { feature: 'Soporte de transparencia', fromValue: 'No disponible (Fondo sólido)', toValue: 'Canal Alfa RGBA (Transparente)', advantage: 'to' },
        { feature: 'Nitidez en textos y gráficos', fromValue: 'Genera artefactos difuminados', toValue: 'Bordes vectoriales ultra nítidos', advantage: 'to' },
        { feature: 'Degradación por re-guardado', fromValue: 'Pierde calidad en cada guardado', toValue: 'Calidad 100% inalterable', advantage: 'to' },
        { feature: 'Tamaño de archivo en fotos', fromValue: 'Muy reducido y ligero', toValue: 'Moderado / Mayor peso', advantage: 'from' },
        { feature: 'Uso recomendado', fromValue: 'Fotografía real y web ligera', toValue: 'Logotipos, iconos, capturas y diseño UI', advantage: 'neutral' }
      ]
    },
    seo: {
      title: 'Convertir JPG a PNG Online Gratis — Sin Límites ni Pérdidas | MediaConvert',
      metaDescription: 'Convierte archivos JPG a PNG en alta calidad y sin pérdidas. Conversión local, instantánea, segura y 100% privada sin subir tus imágenes a servidores.',
      canonical: 'https://mediaconvert.io/convert/jpg-to-png',
      keywords: ['convertir jpg a png', 'jpg to png', 'jpeg a png', 'transformar jpg en png transparente', 'conversor imagenes gratis']
    },
    faq: [
      {
        question: '¿La conversión de JPG a PNG hace que el fondo se vuelva transparente automáticamente?',
        answer: 'No de forma mágica: un archivo JPG de origen ya tiene los píxeles del fondo sólidos integrados en la imagen. Al convertir a PNG obtienes el contenedor compatible con transparencia (canal alfa). Una vez en formato PNG, puedes utilizar cualquier editor gráfico para aislar el sujeto y eliminar el fondo sin perder calidad.'
      },
      {
        question: '¿Por qué el archivo PNG resultante a veces pesa más que el JPG original?',
        answer: 'Esto ocurre porque PNG utiliza compresión sin pérdidas (lossless). Mientras que JPG descartó información para ahorrar espacio, PNG almacena la cuadrícula completa de píxeles con precisión matemática para evitar cualquier degradación visual futura.'
      },
      {
        question: '¿Mis fotos o documentos se envían a servidores externos?',
        answer: 'No. En MediaConvert el motor de conversión opera 100% en tu propio navegador usando la memoria RAM y la GPU de tu dispositivo mediante la API HTML5 Canvas. Tus archivos nunca viajan por internet.'
      },
      {
        question: '¿Puedo convertir múltiples archivos JPG al mismo tiempo?',
        answer: 'Sí. Puedes seleccionar decenas de fotos JPG y MediaConvert las procesará en paralelo de forma ultra rápida, permitiéndote descargarlas una a una o todas agrupadas en un archivo .ZIP comprimido.'
      },
      {
        question: '¿Se pierde resolución o dimensiones al convertir de JPG a PNG?',
        answer: 'No. La imagen convertida conserva exactamente el mismo ancho y alto en píxeles (resolución 1:1) que el archivo original, manteniendo intactos todos los detalles visuales.'
      }
    ],
    relatedTools: ['png-to-jpg', 'webp-to-png', 'heic-to-jpg', 'compress-jpg'],
    sitemap: {
      include: true,
      priority: 1.0,
      changeFrequency: 'weekly'
    }
  },

  'png-to-jpg': {
    id: 'png-to-jpg',
    slug: 'png-to-jpg',
    routePath: '/convert/png-to-jpg',
    category: 'image',
    type: 'convert',
    name: 'PNG a JPG',
    shortName: 'PNG a JPG',
    title: 'Convertir PNG a JPG Online — Reducir Peso sin Perder Calidad | MediaConvert',
    h1: 'Convertir PNG a JPG',
    description: 'Transforma imágenes PNG a formato JPG con compresión optimizada y máxima compatibilidad.',
    contextualDescription: 'El conversor de PNG a JPG de MediaConvert transforma imágenes pesadas en archivos JPEG ligeros con un equilibrio perfecto entre calidad visual y tamaño de archivo.',
    badge: '100% Privado en Navegador',
    inputFormats: ['PNG'],
    outputFormats: ['JPG', 'JPEG'],
    defaultOutputFormat: 'JPG',
    processingType: 'local',
    maxFileSize: 2147483648,
    features: [
      'Reducción drástica del tamaño de archivo (hasta un 80% más ligero)',
      'Ajuste fino de calidad de compresión JPEG',
      'Relleno de fondo blanco automático para áreas transparentes',
      'Procesamiento ultra veloz por GPU local'
    ],
    howToSteps: [
      { step: 1, title: 'Carga tus imágenes PNG', instruction: 'Arrastra tus archivos .png al cuadro interactivo.' },
      { step: 2, title: 'Elige el nivel de calidad JPG', instruction: 'Ajusta el control deslizante de calidad deseado.' },
      { step: 3, title: 'Descarga tus JPGs listos', instruction: 'Obtén los archivos optimizados individualmente o en un paquete .ZIP.' }
    ],
    seo: {
      title: 'Convertir PNG a JPG Online — Rápido, Gratis y Sin Límites | MediaConvert',
      metaDescription: 'Convierte tus imágenes PNG a JPG en segundos. Reduce el peso de tus fotos conservando máxima calidad visual.',
      canonical: 'https://mediaconvert.io/convert/png-to-jpg',
      keywords: ['convertir png a jpg', 'png to jpg', 'png a jpeg', 'reducir tamaño png a jpg']
    },
    faq: [
      {
        question: '¿Qué ocurre con las partes transparentes de mi PNG?',
        answer: 'Dado que JPG no soporta transparencia, las zonas transparentes se rellenan automáticamente con un fondo blanco limpio y uniforme.'
      }
    ],
    relatedTools: ['jpg-to-png', 'webp-to-jpg', 'compress-png'],
    sitemap: {
      include: true,
      priority: 0.9,
      changeFrequency: 'weekly'
    }
  },

  'image-converter': {
    id: 'image-converter',
    slug: 'image-converter',
    routePath: '/convert/image-converter',
    category: 'image',
    type: 'convert',
    name: 'Convertidor de Imágenes',
    shortName: 'Convertidor de Imágenes',
    title: 'Convertidor de Imágenes Online Gratis — JPG, PNG, WebP, SVG, HEIC | MediaConvert',
    h1: 'Convertidor de Imágenes Universal',
    description: 'Transforma cualquier formato de imagen a JPG, PNG, WebP, SVG, ICO o AVIF de forma instantánea.',
    contextualDescription: 'Herramienta integral de conversión gráfica multiformato. Carga fotografías y gráficos en cualquier estándar y selecciona el formato de salida deseado con aceleración local por GPU.',
    badge: 'Multiformato Universal',
    inputFormats: ['JPG', 'JPEG', 'PNG', 'WEBP', 'SVG', 'HEIC', 'AVIF', 'BMP', 'ICO', 'TIFF', 'JFIF'],
    outputFormats: ['PNG', 'JPG', 'WEBP', 'SVG', 'ICO', 'AVIF'],
    defaultOutputFormat: 'PNG',
    processingType: 'local',
    maxFileSize: 2147483648,
    features: [
      'Soporte completo para más de 10 formatos gráficos',
      'Conversión en lote simultánea con descarga .ZIP',
      'Procesamiento privado sin subir archivos a la nube',
      'Conservación de resolución original'
    ],
    howToSteps: [
      { step: 1, title: 'Sube tus imágenes', instruction: 'Arrastra cualquier imagen en formato compatible.' },
      { step: 2, title: 'Selecciona el formato de destino', instruction: 'Elige PNG, JPG, WebP o cualquier otro estándar.' },
      { step: 3, title: 'Descarga tus imágenes', instruction: 'Guarda los archivos convertidos individualmente o en .ZIP.' }
    ],
    seo: {
      title: 'Convertidor de Imágenes Online — Gratuito y Sin Límites | MediaConvert',
      metaDescription: 'Convierte imágenes a cualquier formato online: JPG, PNG, WebP, SVG, HEIC y más. Rápido, seguro y privado.',
      canonical: 'https://mediaconvert.io/convert/image-converter',
      keywords: ['convertidor de imagenes', 'convertir imagenes online', 'conversor formato imagen', 'image converter free']
    },
    faq: [
      {
        question: '¿Qué formatos de imagen son compatibles?',
        answer: 'MediaConvert admite JPG, PNG, WebP, SVG, HEIC, AVIF, BMP, ICO, TIFF y JFIF.'
      }
    ],
    relatedTools: ['jpg-to-png', 'webp-to-png', 'heic-to-jpg', 'png-to-svg'],
    sitemap: {
      include: true,
      priority: 0.9,
      changeFrequency: 'weekly'
    }
  },

  'webp-to-png': {
    id: 'webp-to-png',
    slug: 'webp-to-png',
    routePath: '/convert/webp-to-png',
    category: 'image',
    type: 'convert',
    name: 'WEBP a PNG',
    shortName: 'WEBP a PNG',
    title: 'Convertir WEBP a PNG Online Gratis — Preserva Transparencia | MediaConvert',
    h1: 'Convertir WEBP a PNG',
    description: 'Transforma imágenes WebP modernas a formato PNG compatible con todos los editores y sistemas operativos.',
    contextualDescription: 'Convierte imágenes en formato WebP a PNG conservando la transparencia alfa y la nitidez original para utilizarlas en Photoshop, Office y visores clásicos.',
    badge: 'Sin Pérdidas • Transparencia RGBA',
    inputFormats: ['WEBP'],
    outputFormats: ['PNG'],
    defaultOutputFormat: 'PNG',
    processingType: 'local',
    maxFileSize: 2147483648,
    features: ['Conservación de transparencia alfa', 'Fidelidad de color exacta', 'Procesamiento en memoria RAM'],
    howToSteps: [
      { step: 1, title: 'Carga tus archivos WebP', instruction: 'Arrastra tus imágenes .webp.' },
      { step: 2, title: 'Inicia la conversión', instruction: 'El motor local procesa la imagen en milisegundos.' },
      { step: 3, title: 'Descarga en PNG', instruction: 'Guarda tu archivo PNG transparente.' }
    ],
    seo: {
      title: 'Convertir WEBP a PNG Online — Rápido y Gratis | MediaConvert',
      metaDescription: 'Convierte WebP a PNG con canal alfa transparente y máxima resolución. 100% privado en tu navegador.',
      canonical: 'https://mediaconvert.io/convert/webp-to-png',
      keywords: ['webp a png', 'convertir webp a png', 'transformar webp en png transparente']
    },
    faq: [
      { question: '¿Mantiene la transparencia?', answer: 'Sí, el canal alfa se conserva con 256 niveles de gradiente.' }
    ],
    relatedTools: ['webp-to-jpg', 'jpg-to-png', 'image-converter'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'jfif-to-png': {
    id: 'jfif-to-png',
    slug: 'jfif-to-png',
    routePath: '/convert/jfif-to-png',
    category: 'image',
    type: 'convert',
    name: 'JFIF a PNG',
    shortName: 'JFIF a PNG',
    title: 'Convertir JFIF a PNG Online Gratis — Alta Calidad | MediaConvert',
    h1: 'Convertir JFIF a PNG',
    description: 'Convierte archivos JFIF a formato estándar PNG para abrirlos en cualquier aplicación.',
    contextualDescription: 'Las imágenes descargadas de la web en formato .jfif suelen dar problemas en editores tradicionales. Conviértelas a PNG con máxima compatibilidad.',
    badge: 'Procesamiento Local',
    inputFormats: ['JFIF'],
    outputFormats: ['PNG'],
    defaultOutputFormat: 'PNG',
    processingType: 'local',
    maxFileSize: 2147483648,
    features: ['Soluciona incompatibilidades de formato JFIF', 'Conversión sin pérdidas', 'Procesamiento instantáneo'],
    howToSteps: [
      { step: 1, title: 'Carga el archivo JFIF', instruction: 'Arrastra tus archivos .jfif.' },
      { step: 2, title: 'Convierte a PNG', instruction: 'Haz clic en Convertir.' },
      { step: 3, title: 'Descarga tu PNG', instruction: 'Guarda tu archivo PNG universal.' }
    ],
    seo: {
      title: 'Convertir JFIF a PNG Online Gratis | MediaConvert',
      metaDescription: 'Transforma imágenes JFIF a PNG en segundos. Conversor gratuito y sin registros.',
      canonical: 'https://mediaconvert.io/convert/jfif-to-png',
      keywords: ['jfif a png', 'convertir jfif a png', 'cambiar jfif a png']
    },
    faq: [{ question: '¿Por qué se descargan imágenes en .jfif?', answer: 'Es una variación del formato JPEG utilizada por ciertos navegadores web.' }],
    relatedTools: ['jpg-to-png', 'webp-to-png', 'image-converter'],
    sitemap: { include: true, priority: 0.8, changeFrequency: 'weekly' }
  },

  'png-to-svg': {
    id: 'png-to-svg',
    slug: 'png-to-svg',
    routePath: '/convert/png-to-svg',
    category: 'image',
    type: 'convert',
    name: 'PNG a SVG',
    shortName: 'PNG a SVG',
    title: 'Convertir PNG a SVG Online — Vectorizar Imágenes | MediaConvert',
    h1: 'Convertir PNG a SVG Vectorial',
    description: 'Transforma mapas de bits PNG en gráficos vectoriales escalables SVG sin pérdida de resolución.',
    contextualDescription: 'Vectoriza logotipos, iconos, ilustraciones y firmas en formato PNG a gráficos vectoriales SVG listos para diseño web, corte láser e imprenta.',
    badge: 'Vectorización Inteligente',
    inputFormats: ['PNG'],
    outputFormats: ['SVG'],
    defaultOutputFormat: 'SVG',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Escalabilidad infinita sin pixelado', 'Ideal para logotipos y firmas', 'Salida de código SVG limpio'],
    howToSteps: [
      { step: 1, title: 'Sube tu PNG', instruction: 'Elige un PNG de alto contraste para mejores resultados.' },
      { step: 2, title: 'Vectoriza la imagen', instruction: 'El algoritmo extrae contornos y curvas.' },
      { step: 3, title: 'Descarga el SVG', instruction: 'Guarda tu archivo vectorial .svg.' }
    ],
    seo: {
      title: 'Convertir PNG a SVG Online Gratis — Vectorizar Imágenes | MediaConvert',
      metaDescription: 'Convierte imágenes PNG a vectores SVG escalables. Ideal para logotipos, iconos y diseño gráfico.',
      canonical: 'https://mediaconvert.io/convert/png-to-svg',
      keywords: ['png a svg', 'convertir png a svg', 'vectorizar png', 'png to svg converter']
    },
    faq: [{ question: '¿Se puede escalar el SVG resultante?', answer: 'Sí, el formato SVG es vectorial y no pierde nitidez a ningún tamaño.' }],
    relatedTools: ['svg-converter', 'jpg-to-png', 'image-converter'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'heic-to-jpg': {
    id: 'heic-to-jpg',
    slug: 'heic-to-jpg',
    routePath: '/convert/heic-to-jpg',
    category: 'image',
    type: 'convert',
    name: 'HEIC a JPG',
    shortName: 'HEIC a JPG',
    title: 'Convertir HEIC a JPG Online — Fotos de iPhone a JPEG | MediaConvert',
    h1: 'Convertir HEIC a JPG',
    description: 'Convierte fotos de iPhone y iPad en formato HEIC/HEIF a JPG estándar compatible con Windows y Android.',
    contextualDescription: 'Las fotos tomadas en dispositivos Apple utilizan el contenedor HEIC. Conviértelas a formato JPG universal para visualizarlas y compartirlas en cualquier dispositivo.',
    badge: 'Fotos Apple iPhone',
    inputFormats: ['HEIC', 'HEIF'],
    outputFormats: ['JPG', 'JPEG'],
    defaultOutputFormat: 'JPG',
    processingType: 'local',
    maxFileSize: 2147483648,
    features: ['Conversión rápida de fotos de iPhone', 'Preserva datos de color EXIF', 'Conversión por lotes'],
    howToSteps: [
      { step: 1, title: 'Sube tus fotos HEIC', instruction: 'Selecciona las fotos .heic desde tu iPhone o PC.' },
      { step: 2, title: 'Convierte a JPG', instruction: 'Procesa las imágenes en segundos.' },
      { step: 3, title: 'Descarga tus JPGs', instruction: 'Descarga individual o en archivo .ZIP.' }
    ],
    seo: {
      title: 'Convertir HEIC a JPG Online Gratis — Fotos de iPhone | MediaConvert',
      metaDescription: 'Convierte fotos HEIC de Apple a JPG en alta calidad sin perder resolución. Rápido y 100% seguro.',
      canonical: 'https://mediaconvert.io/convert/heic-to-jpg',
      keywords: ['heic a jpg', 'convertir heic a jpg', 'fotos iphone a jpg', 'heif to jpg']
    },
    faq: [{ question: '¿Qué es un archivo HEIC?', answer: 'Es el formato de alta eficiencia usado por defecto en cámaras de iPhone desde iOS 11.' }],
    relatedTools: ['heic-to-png', 'heic-to-pdf', 'jpg-to-png'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'heic-to-png': {
    id: 'heic-to-png',
    slug: 'heic-to-png',
    routePath: '/convert/heic-to-png',
    category: 'image',
    type: 'convert',
    name: 'HEIC a PNG',
    shortName: 'HEIC a PNG',
    title: 'Convertir HEIC a PNG Online — Fotos de Apple a PNG | MediaConvert',
    h1: 'Convertir HEIC a PNG',
    description: 'Transforma fotos HEIC de dispositivos iOS a formato PNG con máxima nitidez y sin compresión con pérdidas.',
    contextualDescription: 'Convierte archivos HEIC a PNG para edición profesional, diseño y conservación de calidad absoluta en computadoras Windows y Linux.',
    badge: 'Sin Pérdidas',
    inputFormats: ['HEIC', 'HEIF'],
    outputFormats: ['PNG'],
    defaultOutputFormat: 'PNG',
    processingType: 'local',
    maxFileSize: 2147483648,
    features: ['Conversión sin pérdidas', 'Compatibilidad universal', 'Procesamiento en memoria'],
    howToSteps: [
      { step: 1, title: 'Selecciona tus archivos HEIC', instruction: 'Arrastra tus fotos .heic.' },
      { step: 2, title: 'Convierte a PNG', instruction: 'Inicia el procesamiento.' },
      { step: 3, title: 'Descarga el PNG', instruction: 'Guarda tus archivos en PNG.' }
    ],
    seo: {
      title: 'Convertir HEIC a PNG Online Gratis | MediaConvert',
      metaDescription: 'Convierte fotos HEIC a PNG en alta calidad sin pérdida de detalles. 100% privado.',
      canonical: 'https://mediaconvert.io/convert/heic-to-png',
      keywords: ['heic a png', 'convertir heic a png', 'heif to png']
    },
    faq: [{ question: '¿Se preserva la calidad original?', answer: 'Sí, la decodificación HEIC se guarda en PNG sin compresión destructiva.' }],
    relatedTools: ['heic-to-jpg', 'jpg-to-png', 'image-converter'],
    sitemap: { include: true, priority: 0.8, changeFrequency: 'weekly' }
  },

  'webp-to-jpg': {
    id: 'webp-to-jpg',
    slug: 'webp-to-jpg',
    routePath: '/convert/webp-to-jpg',
    category: 'image',
    type: 'convert',
    name: 'WEBP a JPG',
    shortName: 'WEBP a JPG',
    title: 'Convertir WEBP a JPG Online Gratis — Rápido y Ligero | MediaConvert',
    h1: 'Convertir WEBP a JPG',
    description: 'Convierte imágenes WebP a JPG tradicional con compatibilidad total en visores y aplicaciones.',
    contextualDescription: 'Transforma archivos WebP descargados de internet en fotos JPG compatibles con editores antiguos, televisores y marcos digitales.',
    badge: 'Alta Compatibilidad',
    inputFormats: ['WEBP'],
    outputFormats: ['JPG', 'JPEG'],
    defaultOutputFormat: 'JPG',
    processingType: 'local',
    maxFileSize: 2147483648,
    features: ['Compatible con cualquier dispositivo', 'Procesamiento en milisegundos', 'Control de calidad de salida'],
    howToSteps: [
      { step: 1, title: 'Carga tus imágenes WebP', instruction: 'Arrastra tus archivos WebP.' },
      { step: 2, title: 'Convierte a JPG', instruction: 'Haz clic en Convertir.' },
      { step: 3, title: 'Descarga tus JPGs', instruction: 'Descarga individual o en .ZIP.' }
    ],
    seo: {
      title: 'Convertir WEBP a JPG Online Gratis | MediaConvert',
      metaDescription: 'Convierte imágenes WebP a JPG en segundos. Gratuito, rápido y sin marcas de agua.',
      canonical: 'https://mediaconvert.io/convert/webp-to-jpg',
      keywords: ['webp a jpg', 'convertir webp a jpg', 'webp to jpeg']
    },
    faq: [{ question: '¿Por qué convertir WebP a JPG?', answer: 'Para poder abrir las imágenes en programas antiguos que aún no soportan WebP.' }],
    relatedTools: ['webp-to-png', 'jpg-to-png', 'image-converter'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'svg-converter': {
    id: 'svg-converter',
    slug: 'svg-converter',
    routePath: '/convert/svg-converter',
    category: 'image',
    type: 'convert',
    name: 'SVG Convertidor',
    shortName: 'SVG Convertidor',
    title: 'Convertidor SVG Online — Vectorizar y Exportar SVG | MediaConvert',
    h1: 'Convertidor de Archivos SVG',
    description: 'Convierte archivos SVG a PNG, JPG o convierte mapas de bits a gráficos vectoriales SVG.',
    contextualDescription: 'Herramienta bidireccional para exportar vectores SVG a imágenes rasterizadas de alta resolución o rasterizados a vectores escalables.',
    badge: 'Gráficos Vectoriales',
    inputFormats: ['SVG', 'PNG', 'JPG', 'WEBP'],
    outputFormats: ['SVG', 'PNG', 'JPG', 'PDF'],
    defaultOutputFormat: 'PNG',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Renderizado de vectores en ultra alta resolución', 'Exportación a PNG transparente', 'Edición de código SVG'],
    howToSteps: [
      { step: 1, title: 'Sube tu archivo', instruction: 'Arrastra tu SVG o imagen.' },
      { step: 2, title: 'Selecciona el formato de salida', instruction: 'Elige PNG, SVG o PDF.' },
      { step: 3, title: 'Descarga el resultado', instruction: 'Guarda tu archivo convertido.' }
    ],
    seo: {
      title: 'Convertidor SVG Online — Exportar y Convertir SVG | MediaConvert',
      metaDescription: 'Convierte archivos SVG a PNG, JPG, PDF o vectoriza imágenes a SVG online. Gratis y rápido.',
      canonical: 'https://mediaconvert.io/convert/svg-converter',
      keywords: ['svg converter', 'convertir svg', 'svg a png', 'conversor vectorial']
    },
    faq: [{ question: '¿Puedo convertir SVG a PNG con alta resolución?', answer: 'Sí, puedes renderizar el SVG a cualquier escala sin pérdida de nitidez.' }],
    relatedTools: ['png-to-svg', 'image-converter', 'jpg-to-png'],
    sitemap: { include: true, priority: 0.8, changeFrequency: 'weekly' }
  },

  // ==========================================
  // 2. 🎵 VIDEO & AUDIO
  // ==========================================
  'video-converter': {
    id: 'video-converter',
    slug: 'video-converter',
    routePath: '/convert/video-converter',
    category: 'video-audio',
    type: 'convert',
    name: 'Convertidor de Vídeo',
    shortName: 'Convertidor de Vídeo',
    title: 'Convertidor de Vídeo Online Gratis — MP4, MOV, WEBM, AVI, MKV | MediaConvert',
    h1: 'Convertidor de Vídeo Universal',
    description: 'Convierte tus vídeos a MP4, WebM, MOV, AVI o extrae el audio en MP3 de forma rápida.',
    contextualDescription: 'Convierte clips de vídeo entre diferentes contenedores y codecs para reproducirlos en cualquier pantalla, smartphone o plataforma de streaming.',
    badge: 'Vídeo Multiformato',
    inputFormats: ['MP4', 'MOV', 'WEBM', 'AVI', 'MKV', 'FLV', '3GP'],
    outputFormats: ['MP4', 'WEBM', 'MOV', 'MP3', 'GIF'],
    defaultOutputFormat: 'MP4',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Soporte para múltiples resoluciones (1080p, 4K, 720p)', 'Aceleración por hardware', 'Conversión por lotes'],
    howToSteps: [
      { step: 1, title: 'Carga tu vídeo', instruction: 'Arrastra tu archivo de vídeo.' },
      { step: 2, title: 'Selecciona el formato', instruction: 'Elige MP4, WebM o MOV.' },
      { step: 3, title: 'Descarga tu vídeo convertido', instruction: 'Guarda tu vídeo optimizado.' }
    ],
    seo: {
      title: 'Convertidor de Vídeo Online Gratis — MP4, MOV, WEBM | MediaConvert',
      metaDescription: 'Convierte vídeos online a MP4, MOV, WebM y más formatos de alta calidad sin marcas de agua.',
      canonical: 'https://mediaconvert.io/convert/video-converter',
      keywords: ['convertidor de video', 'video converter online', 'convertir mp4', 'convertir video a mp3']
    },
    faq: [{ question: '¿Se mantiene la calidad de audio y vídeo?', answer: 'Sí, los perfiles de codificación preservan la tasa de bits y resolución original.' }],
    relatedTools: ['mp4-to-mp3', 'video-to-mp3', 'mov-to-mp4', 'video-to-gif'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'audio-converter': {
    id: 'audio-converter',
    slug: 'audio-converter',
    routePath: '/convert/audio-converter',
    category: 'video-audio',
    type: 'convert',
    name: 'Convertidor de Audio',
    shortName: 'Convertidor de Audio',
    title: 'Convertidor de Audio Online — MP3, WAV, OGG, AAC, FLAC, M4A | MediaConvert',
    h1: 'Convertidor de Audio Universal',
    description: 'Transforma pistas de audio a MP3, WAV, OGG, FLAC o AAC con control de bitrate y calidad de estudio.',
    contextualDescription: 'Herramienta de conversión acústica para archivos de sonido, podcasts, grabaciones de voz y pistas musicales sin pérdida de fidelidad.',
    badge: 'Audio de Alta Fidelidad',
    inputFormats: ['MP3', 'WAV', 'OGG', 'AAC', 'FLAC', 'M4A', 'WMA', 'AIFF'],
    outputFormats: ['MP3', 'WAV', 'OGG', 'AAC', 'M4A'],
    defaultOutputFormat: 'MP3',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Ajuste de bitrate hasta 320 kbps', 'Conversión a WAV sin compresión', 'Extracción de audio en lote'],
    howToSteps: [
      { step: 1, title: 'Carga tus audios', instruction: 'Arrastra tus pistas de audio.' },
      { step: 2, title: 'Elige el formato de salida', instruction: 'Selecciona MP3, WAV u OGG.' },
      { step: 3, title: 'Descarga tus pistas', instruction: 'Descarga individual o en .ZIP.' }
    ],
    seo: {
      title: 'Convertidor de Audio Online — MP3, WAV, OGG, FLAC | MediaConvert',
      metaDescription: 'Convierte pistas de audio entre formatos MP3, WAV, OGG, AAC y FLAC con máxima calidad sonora.',
      canonical: 'https://mediaconvert.io/convert/audio-converter',
      keywords: ['convertidor de audio', 'audio converter', 'convertir mp3', 'wav a mp3']
    },
    faq: [{ question: '¿Cuál es el mejor formato de audio?', answer: 'MP3 ofrece la mejor compatibilidad; WAV y FLAC ofrecen la mayor calidad sin pérdidas.' }],
    relatedTools: ['mp3-converter', 'mp4-to-mp3', 'mp3-to-ogg'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'mp3-converter': {
    id: 'mp3-converter',
    slug: 'mp3-converter',
    routePath: '/convert/mp3-converter',
    category: 'video-audio',
    type: 'convert',
    name: 'MP3 Convertidor',
    shortName: 'MP3 Convertidor',
    title: 'Convertidor a MP3 Online Gratis — Alta Calidad 320 kbps | MediaConvert',
    h1: 'Convertidor a MP3 Online',
    description: 'Convierte cualquier archivo de audio o vídeo a formato MP3 estándar compatible con todos los reproductores.',
    contextualDescription: 'Transforma grabaciones WAV, OGG, M4A, FLAC o vídeos MP4 a MP3 con codificación nítida a 320 kbps.',
    badge: 'MP3 320 kbps',
    inputFormats: ['WAV', 'OGG', 'M4A', 'FLAC', 'AAC', 'MP4', 'MOV', 'WEBM'],
    outputFormats: ['MP3'],
    defaultOutputFormat: 'MP3',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Codificación MP3 hasta 320 kbps', 'Compatibilidad universal', 'Procesamiento rápido'],
    howToSteps: [
      { step: 1, title: 'Sube tu archivo', instruction: 'Arrastra pistas de audio o vídeos.' },
      { step: 2, title: 'Inicia la conversión', instruction: 'El motor codifica a MP3.' },
      { step: 3, title: 'Descarga tu MP3', instruction: 'Guarda tu pista de audio MP3.' }
    ],
    seo: {
      title: 'Convertidor MP3 Online Gratis — Convertir a MP3 | MediaConvert',
      metaDescription: 'Convierte audios y vídeos a MP3 online en alta calidad (320 kbps). Fácil, rápido y gratis.',
      canonical: 'https://mediaconvert.io/convert/mp3-converter',
      keywords: ['mp3 converter', 'convertir a mp3', 'conversor mp3 gratis']
    },
    faq: [{ question: '¿Puedo convertir vídeos a MP3?', answer: 'Sí, la herramienta extrae la pista sonora directamente en formato MP3.' }],
    relatedTools: ['mp4-to-mp3', 'audio-converter', 'video-to-mp3'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'mp4-converter': {
    id: 'mp4-converter',
    slug: 'mp4-converter',
    routePath: '/convert/mp4-converter',
    category: 'video-audio',
    type: 'convert',
    name: 'MP4 Convertidor',
    shortName: 'MP4 Convertidor',
    title: 'Convertidor a MP4 Online — Alta Definición H.264 | MediaConvert',
    h1: 'Convertidor a MP4 Online',
    description: 'Transforma cualquier archivo de vídeo (MOV, WebM, AVI, MKV) al formato universal MP4.',
    contextualDescription: 'MP4 con codificación H.264/AAC es el estándar por excelencia en internet y dispositivos móviles. Convierte cualquier vídeo para garantizar su reproducción.',
    badge: 'H.264 Universal',
    inputFormats: ['MOV', 'WEBM', 'AVI', 'MKV', 'FLV', 'WMV', 'M4V'],
    outputFormats: ['MP4'],
    defaultOutputFormat: 'MP4',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Compatible con Smart TVs, iOS y Android', 'Compresión de vídeo eficiente', 'Preserva resolución Full HD / 4K'],
    howToSteps: [
      { step: 1, title: 'Sube tus vídeos', instruction: 'Arrastra vídeos en cualquier formato.' },
      { step: 2, title: 'Convierte a MP4', instruction: 'El conversor procesa el archivo.' },
      { step: 3, title: 'Descarga tu MP4', instruction: 'Guarda tu vídeo listo para compartir.' }
    ],
    seo: {
      title: 'Convertidor MP4 Online — Convertir Vídeos a MP4 | MediaConvert',
      metaDescription: 'Convierte vídeos a MP4 online gratis. Soporta MOV, AVI, MKV, WebM a MP4 en alta calidad.',
      canonical: 'https://mediaconvert.io/convert/mp4-converter',
      keywords: ['mp4 converter', 'convertir a mp4', 'conversor mp4 online', 'mov a mp4']
    },
    faq: [{ question: '¿Por qué MP4 es el formato más recomendado?', answer: 'Porque funciona en el 100% de navegadores, teléfonos, consolas y reproductores de televisión.' }],
    relatedTools: ['video-converter', 'mov-to-mp4', 'mp4-to-mp3'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'mp4-to-mp3': {
    id: 'mp4-to-mp3',
    slug: 'mp4-to-mp3',
    routePath: '/convert/mp4-to-mp3',
    category: 'video-audio',
    type: 'convert',
    name: 'MP4 a MP3',
    shortName: 'MP4 a MP3',
    title: 'Convertir MP4 a MP3 Online — Extraer Audio de Vídeo | MediaConvert',
    h1: 'Convertir MP4 a MP3',
    description: 'Extrae la pista de audio de vídeos MP4 y guárdala como archivo MP3 en alta calidad.',
    contextualDescription: 'Convierte vídeos musicales, conferencias, podcasts y grabaciones MP4 en archivos de audio MP3 ligeros para escuchar en cualquier lugar.',
    badge: 'Extracción Rápida de Audio',
    inputFormats: ['MP4'],
    outputFormats: ['MP3'],
    defaultOutputFormat: 'MP3',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Extracción de audio sin recodificación innecesaria', 'Bitrate de hasta 320 kbps', 'Conversión en lote'],
    howToSteps: [
      { step: 1, title: 'Sube tu vídeo MP4', instruction: 'Arrastra tu archivo MP4.' },
      { step: 2, title: 'Extrae el audio', instruction: 'El motor aísla la pista acústica.' },
      { step: 3, title: 'Descarga tu MP3', instruction: 'Guarda tu archivo MP3.' }
    ],
    seo: {
      title: 'Convertir MP4 a MP3 Online Gratis — Extraer Audio | MediaConvert',
      metaDescription: 'Convierte MP4 a MP3 online en segundos. Extrae pistas de audio de vídeos en alta calidad sin descargas.',
      canonical: 'https://mediaconvert.io/convert/mp4-to-mp3',
      keywords: ['mp4 a mp3', 'convertir mp4 a mp3', 'extraer audio de video', 'mp4 to mp3 converter']
    },
    faq: [{ question: '¿Pierde calidad el sonido?', answer: 'No, el audio se extrae conservando la frecuencia de muestreo y fidelidad de la pista original.' }],
    relatedTools: ['video-to-mp3', 'mp3-converter', 'audio-converter'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'video-to-mp3': {
    id: 'video-to-mp3',
    slug: 'video-to-mp3',
    routePath: '/convert/video-to-mp3',
    category: 'video-audio',
    type: 'convert',
    name: 'Video a MP3',
    shortName: 'Video a MP3',
    title: 'Convertir Video a MP3 Online — Extraer Música y Audio | MediaConvert',
    h1: 'Convertir Cualquier Video a MP3',
    description: 'Extrae el sonido de cualquier formato de vídeo (MP4, MOV, MKV, AVI, WebM) a MP3.',
    contextualDescription: 'Convierte grabaciones de cámara, vídeos descargados o transmisiones a pistas de audio MP3 compatibles con cualquier smartphone y reproductor.',
    badge: 'Extracción Universal',
    inputFormats: ['MP4', 'MOV', 'MKV', 'AVI', 'WEBM', 'FLV', '3GP', 'WMV'],
    outputFormats: ['MP3'],
    defaultOutputFormat: 'MP3',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Compatible con todos los formatos de vídeo', 'Descarga rápida de audio', '100% privado'],
    howToSteps: [
      { step: 1, title: 'Sube tus vídeos', instruction: 'Arrastra cualquier archivo de vídeo.' },
      { step: 2, title: 'Convierte a MP3', instruction: 'Inicia la extracción de audio.' },
      { step: 3, title: 'Descarga tus audios', instruction: 'Guarda tus archivos MP3.' }
    ],
    seo: {
      title: 'Convertir Video a MP3 Online Gratis | MediaConvert',
      metaDescription: 'Convierte vídeos de cualquier formato a MP3 online. Rápido, gratis y sin programas.',
      canonical: 'https://mediaconvert.io/convert/video-to-mp3',
      keywords: ['video a mp3', 'convertir video a mp3', 'extraer musica de video']
    },
    faq: [{ question: '¿Puedo convertir varios vídeos a la vez?', answer: 'Sí, puedes cargar múltiples vídeos y descargarlos todos juntos.' }],
    relatedTools: ['mp4-to-mp3', 'mp3-converter', 'video-converter'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'mov-to-mp4': {
    id: 'mov-to-mp4',
    slug: 'mov-to-mp4',
    routePath: '/convert/mov-to-mp4',
    category: 'video-audio',
    type: 'convert',
    name: 'MOV a MP4',
    shortName: 'MOV a MP4',
    title: 'Convertir MOV a MP4 Online — QuickTime a MP4 Universal | MediaConvert',
    h1: 'Convertir MOV a MP4',
    description: 'Transforma vídeos QuickTime MOV grabados con iPhone o Mac en archivos MP4 estándar.',
    contextualDescription: 'Los vídeos en formato MOV suelen ser pesados y dar problemas de reproducción en Windows o Android. Conviértelos a MP4 para máxima compatibilidad.',
    badge: 'Apple QuickTime',
    inputFormats: ['MOV'],
    outputFormats: ['MP4'],
    defaultOutputFormat: 'MP4',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Compatible con grabaciones de iPhone', 'Reducción de peso sin perder calidad', 'Audio sincronizado'],
    howToSteps: [
      { step: 1, title: 'Carga tus vídeos MOV', instruction: 'Arrastra tus archivos .mov.' },
      { step: 2, title: 'Convierte a MP4', instruction: 'Haz clic en Convertir a MP4.' },
      { step: 3, title: 'Descarga tu MP4', instruction: 'Guarda tu vídeo compatible.' }
    ],
    seo: {
      title: 'Convertir MOV a MP4 Online Gratis — QuickTime a MP4 | MediaConvert',
      metaDescription: 'Convierte vídeos MOV de iPhone y Mac a formato MP4 online. Alta calidad y rápida conversión.',
      canonical: 'https://mediaconvert.io/convert/mov-to-mp4',
      keywords: ['mov a mp4', 'convertir mov a mp4', 'quicktime a mp4', 'mov to mp4 converter']
    },
    faq: [{ question: '¿Se reduce el tamaño del archivo?', answer: 'Sí, la compresión H.264 en contenedor MP4 reduce sustancialmente el peso respecto al archivo MOV original.' }],
    relatedTools: ['mp4-converter', 'video-converter', 'mp4-to-mp3'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'mp3-to-ogg': {
    id: 'mp3-to-ogg',
    slug: 'mp3-to-ogg',
    routePath: '/convert/mp3-to-ogg',
    category: 'video-audio',
    type: 'convert',
    name: 'MP3 a OGG',
    shortName: 'MP3 a OGG',
    title: 'Convertir MP3 a OGG Online Gratis — Audio Vorbis | MediaConvert',
    h1: 'Convertir MP3 a OGG Vorbis',
    description: 'Convierte pistas de audio MP3 a formato abierto OGG Vorbis para videojuegos y desarrollo web.',
    contextualDescription: 'El contenedor OGG con codec Vorbis u Opus es el estándar libre utilizado en motores de videojuegos (Unity, Godot) y plataformas web de streaming.',
    badge: 'OGG Vorbis',
    inputFormats: ['MP3'],
    outputFormats: ['OGG'],
    defaultOutputFormat: 'OGG',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Formato abierto sin patentes', 'Excelente compresión acústica', 'Ideal para desarrollo de videojuegos'],
    howToSteps: [
      { step: 1, title: 'Sube tus archivos MP3', instruction: 'Arrastra tus pistas .mp3.' },
      { step: 2, title: 'Convierte a OGG', instruction: 'Inicia la codificación Vorbis.' },
      { step: 3, title: 'Descarga tu OGG', instruction: 'Guarda tu archivo de audio OGG.' }
    ],
    seo: {
      title: 'Convertir MP3 a OGG Online Gratis | MediaConvert',
      metaDescription: 'Convierte archivos MP3 a OGG Vorbis online en alta calidad. Rápido, seguro y gratuito.',
      canonical: 'https://mediaconvert.io/convert/mp3-to-ogg',
      keywords: ['mp3 a ogg', 'convertir mp3 a ogg', 'mp3 to ogg vorbis']
    },
    faq: [{ question: '¿Qué ventaja tiene el formato OGG?', answer: 'Es un estándar abierto sin costes de licencia que ofrece excelente relación calidad-tamaño.' }],
    relatedTools: ['audio-converter', 'mp3-converter'],
    sitemap: { include: true, priority: 0.8, changeFrequency: 'weekly' }
  },

  // ==========================================
  // 3. 📄 PDF & DOCUMENTOS
  // ==========================================
  'pdf-converter': {
    id: 'pdf-converter',
    slug: 'pdf-converter',
    routePath: '/convert/pdf-converter',
    category: 'pdf-document',
    type: 'convert',
    name: 'PDF Convertidor',
    shortName: 'PDF Convertidor',
    title: 'Convertidor de PDF Online — Word, JPG, EPUB, Excel | MediaConvert',
    h1: 'Convertidor de PDF Universal',
    description: 'Convierte archivos PDF a Word, imágenes JPG, libros EPUB o transforma documentos a PDF.',
    contextualDescription: 'Herramienta integral de gestión de documentos PDF. Exporta páginas a imágenes, convierte contratos a Word editable o compila imágenes en un único archivo PDF.',
    badge: 'Documentos Pro',
    inputFormats: ['PDF', 'DOCX', 'DOC', 'EPUB', 'JPG', 'PNG', 'TXT'],
    outputFormats: ['PDF', 'DOCX', 'JPG', 'PNG', 'EPUB', 'TXT'],
    defaultOutputFormat: 'DOCX',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Conservación de tipografías y maquetación', 'Extracción de páginas como JPG', 'Creación de PDF a partir de imágenes'],
    howToSteps: [
      { step: 1, title: 'Sube tu documento', instruction: 'Arrastra tu archivo PDF o documento.' },
      { step: 2, title: 'Selecciona el formato de salida', instruction: 'Elige Word, JPG, EPUB o PDF.' },
      { step: 3, title: 'Descarga el documento', instruction: 'Guarda tu archivo convertido.' }
    ],
    seo: {
      title: 'Convertidor de PDF Online Gratis — Convertir PDF | MediaConvert',
      metaDescription: 'Convierte archivos PDF a Word, JPG, EPUB y más. Herramienta online gratuita sin registros.',
      canonical: 'https://mediaconvert.io/convert/pdf-converter',
      keywords: ['pdf converter', 'convertir pdf', 'conversor pdf online', 'pdf a word']
    },
    faq: [{ question: '¿Se mantiene el formato del documento?', answer: 'Sí, las fuentes, tablas y alineaciones se preservan con máxima fidelidad.' }],
    relatedTools: ['pdf-to-word', 'pdf-to-jpg', 'docx-to-pdf', 'jpg-to-pdf'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'document-converter': {
    id: 'document-converter',
    slug: 'document-converter',
    routePath: '/convert/document-converter',
    category: 'pdf-document',
    type: 'convert',
    name: 'Documento Convertidor',
    shortName: 'Documento Convertidor',
    title: 'Convertidor de Documentos Online — DOCX, PDF, TXT, CSV | MediaConvert',
    h1: 'Convertidor de Documentos',
    description: 'Convierte documentos entre DOCX, PDF, RTF, TXT, CSV, JSON y Markdown de forma segura.',
    contextualDescription: 'Transforma archivos de texto y ofimática entre formatos editables y contenedores de lectura universales.',
    badge: 'Ofimática & Datos',
    inputFormats: ['DOCX', 'DOC', 'PDF', 'TXT', 'MD', 'CSV', 'JSON', 'RTF'],
    outputFormats: ['PDF', 'DOCX', 'TXT', 'MD', 'CSV', 'JSON'],
    defaultOutputFormat: 'PDF',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Soporte para documentos de Word y texto plano', 'Conversión rápida', 'Máxima confidencialidad'],
    howToSteps: [
      { step: 1, title: 'Sube tus documentos', instruction: 'Arrastra tus archivos de ofimática.' },
      { step: 2, title: 'Elige el formato de destino', instruction: 'Selecciona PDF, DOCX o TXT.' },
      { step: 3, title: 'Descarga el archivo', instruction: 'Descarga individual o en .ZIP.' }
    ],
    seo: {
      title: 'Convertidor de Documentos Online Gratis | MediaConvert',
      metaDescription: 'Convierte documentos DOCX, PDF, TXT, Markdown y hojas de cálculo online con total privacidad.',
      canonical: 'https://mediaconvert.io/convert/document-converter',
      keywords: ['convertidor de documentos', 'document converter', 'convertir docx a pdf', 'conversor documentos']
    },
    faq: [{ question: '¿Mis documentos están protegidos?', answer: 'Sí, la privacidad es absoluta y los archivos se procesan bajo protocolos seguros sin almacenamiento permanente.' }],
    relatedTools: ['pdf-converter', 'docx-to-pdf', 'pdf-to-word'],
    sitemap: { include: true, priority: 0.8, changeFrequency: 'weekly' }
  },

  'ebook-converter': {
    id: 'ebook-converter',
    slug: 'ebook-converter',
    routePath: '/convert/ebook-converter',
    category: 'pdf-document',
    type: 'convert',
    name: 'Convertidor de Libros Electrónicos',
    shortName: 'Convertidor Ebook',
    title: 'Convertidor de Libros Electrónicos — EPUB, PDF, MOBI, AZW3 | MediaConvert',
    h1: 'Convertidor de Libros Electrónicos (Ebooks)',
    description: 'Convierte libros digitales entre EPUB, PDF, MOBI, AZW3 y TXT para Kindle, Kobo o iPad.',
    contextualDescription: 'Adapta tus lecturas a cualquier dispositivo de tinta electrónica o lector de libros electrónicos ajustando paginación y estructura de capítulos.',
    badge: 'Kindle & E-Readers',
    inputFormats: ['EPUB', 'PDF', 'MOBI', 'AZW3', 'FB2', 'TXT'],
    outputFormats: ['EPUB', 'PDF', 'MOBI', 'TXT'],
    defaultOutputFormat: 'EPUB',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Optimización para Kindle y Kobo', 'Preserva tabla de contenidos e índices', 'Adaptación tipográfica'],
    howToSteps: [
      { step: 1, title: 'Carga tu libro digital', instruction: 'Arrastra tu archivo EPUB, MOBI o PDF.' },
      { step: 2, title: 'Elige el formato de tu lector', instruction: 'Selecciona EPUB o PDF.' },
      { step: 3, title: 'Descarga tu libro adaptado', instruction: 'Listo para transferir a tu e-reader.' }
    ],
    seo: {
      title: 'Convertidor de Ebooks Online Gratis — EPUB, PDF, MOBI | MediaConvert',
      metaDescription: 'Convierte libros electrónicos entre EPUB, PDF y MOBI online. Compatible con Kindle y Kobo.',
      canonical: 'https://mediaconvert.io/convert/ebook-converter',
      keywords: ['ebook converter', 'convertidor libros electronicos', 'epub a pdf', 'pdf a epub']
    },
    faq: [{ question: '¿Qué formato es mejor para Kindle?', answer: 'EPUB o MOBI son ideales para lectura cómoda y ajuste dinámico de tamaño de letra.' }],
    relatedTools: ['pdf-to-epub', 'epub-to-pdf', 'pdf-converter'],
    sitemap: { include: true, priority: 0.8, changeFrequency: 'weekly' }
  },

  'pdf-to-word': {
    id: 'pdf-to-word',
    slug: 'pdf-to-word',
    routePath: '/convert/pdf-to-word',
    category: 'pdf-document',
    type: 'convert',
    name: 'PDF a Word',
    shortName: 'PDF a Word',
    title: 'Convertir PDF a Word Online Gratis — DOCX Editable | MediaConvert',
    h1: 'Convertir PDF a Word Editable (DOCX)',
    description: 'Transforma documentos PDF en archivos Microsoft Word (.docx) 100% editables conservando el formato original.',
    contextualDescription: 'Convierte contratos, informes y facturas PDF en documentos de Word con párrafos, tablas e imágenes totalmente editables.',
    badge: 'DOCX Editable',
    inputFormats: ['PDF'],
    outputFormats: ['DOCX'],
    defaultOutputFormat: 'DOCX',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Texto y tablas 100% editables', 'Conserva diseño y maquetación', 'Sin límites de páginas'],
    howToSteps: [
      { step: 1, title: 'Sube tu archivo PDF', instruction: 'Arrastra tu documento .pdf.' },
      { step: 2, title: 'Convierte a DOCX', instruction: 'El motor reconstruye la estructura editable.' },
      { step: 3, title: 'Descarga en Word', instruction: 'Abre y edita en Microsoft Word o Google Docs.' }
    ],
    seo: {
      title: 'Convertir PDF a Word Online Gratis — DOCX Editable | MediaConvert',
      metaDescription: 'Convierte PDF a Word (DOCX) online gratis y editable. Conserva tipografía, tablas e imágenes.',
      canonical: 'https://mediaconvert.io/convert/pdf-to-word',
      keywords: ['pdf a word', 'convertir pdf a word', 'pdf to word editable', 'pdf a docx']
    },
    faq: [{ question: '¿Se puede editar el texto tras la conversión?', answer: 'Sí, obtienes un archivo .docx estándar completamente modificable.' }],
    relatedTools: ['docx-to-pdf', 'pdf-converter', 'pdf-to-jpg'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'pdf-to-jpg': {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg',
    routePath: '/convert/pdf-to-jpg',
    category: 'pdf-document',
    type: 'convert',
    name: 'PDF a JPG',
    shortName: 'PDF a JPG',
    title: 'Convertir PDF a JPG Online — Extraer Páginas a Imágenes | MediaConvert',
    h1: 'Convertir PDF a JPG',
    description: 'Convierte cada página de tu documento PDF en una imagen JPG de alta resolución o extrae las fotos incrustadas.',
    contextualDescription: 'Transforma páginas de documentos PDF en imágenes JPG nítidas para compartirlas en redes sociales o insertarlas en presentaciones.',
    badge: 'Imágenes en Alta Resolución',
    inputFormats: ['PDF'],
    outputFormats: ['JPG', 'JPEG', 'PNG'],
    defaultOutputFormat: 'JPG',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Renderizado en 300 DPI', 'Descarga de todas las páginas en un archivo .ZIP', 'Sin pérdida de texto'],
    howToSteps: [
      { step: 1, title: 'Sube tu documento PDF', instruction: 'Arrastra tu archivo PDF.' },
      { step: 2, title: 'Convierte a imágenes', instruction: 'Procesa las páginas a JPG.' },
      { step: 3, title: 'Descarga tus fotos', instruction: 'Guarda las páginas individuales o el paquete .ZIP.' }
    ],
    seo: {
      title: 'Convertir PDF a JPG Online Gratis — Extraer Páginas | MediaConvert',
      metaDescription: 'Convierte documentos PDF a imágenes JPG en alta definición online. Fácil y gratis.',
      canonical: 'https://mediaconvert.io/convert/pdf-to-jpg',
      keywords: ['pdf a jpg', 'convertir pdf a jpg', 'extraer imagenes pdf', 'pdf to jpg']
    },
    faq: [{ question: '¿Puedo descargar todas las páginas a la vez?', answer: 'Sí, se genera automáticamente un archivo ZIP con todas las páginas numeradas.' }],
    relatedTools: ['jpg-to-pdf', 'pdf-converter', 'pdf-to-word'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'pdf-to-epub': {
    id: 'pdf-to-epub',
    slug: 'pdf-to-epub',
    routePath: '/convert/pdf-to-epub',
    category: 'pdf-document',
    type: 'convert',
    name: 'PDF a EPUB',
    shortName: 'PDF a EPUB',
    title: 'Convertir PDF a EPUB Online — Formato Ebook para Lectores | MediaConvert',
    h1: 'Convertir PDF a EPUB',
    description: 'Convierte documentos y libros en PDF al formato de libro electrónico fluido EPUB para leer cómodamente.',
    contextualDescription: 'Los PDFs tienen formato rígido que dificulta la lectura en pantallas pequeñas. Al convertir a EPUB, el texto se ajusta automáticamente al tamaño de tu pantalla.',
    badge: 'Lectura Fluida',
    inputFormats: ['PDF'],
    outputFormats: ['EPUB'],
    defaultOutputFormat: 'EPUB',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Reflujo de texto adaptativo', 'Lectura cómoda en móviles y lectores', 'Conserva títulos y capítulos'],
    howToSteps: [
      { step: 1, title: 'Sube tu archivo PDF', instruction: 'Arrastra tu documento o libro.' },
      { step: 2, title: 'Convierte a EPUB', instruction: 'Procesa el archivo.' },
      { step: 3, title: 'Descarga tu EPUB', instruction: 'Léelo en tu aplicación de libros favorita.' }
    ],
    seo: {
      title: 'Convertir PDF a EPUB Online Gratis | MediaConvert',
      metaDescription: 'Convierte archivos PDF a formato EPUB online para leer en Kindle, Kobo o iPad.',
      canonical: 'https://mediaconvert.io/convert/pdf-to-epub',
      keywords: ['pdf a epub', 'convertir pdf a epub', 'pdf to epub converter']
    },
    faq: [{ question: '¿Por qué convertir PDF a EPUB?', answer: 'Para poder aumentar el tamaño de letra sin tener que hacer zoom horizontal en cada página.' }],
    relatedTools: ['epub-to-pdf', 'ebook-converter', 'pdf-converter'],
    sitemap: { include: true, priority: 0.8, changeFrequency: 'weekly' }
  },

  'epub-to-pdf': {
    id: 'epub-to-pdf',
    slug: 'epub-to-pdf',
    routePath: '/convert/epub-to-pdf',
    category: 'pdf-document',
    type: 'convert',
    name: 'EPUB a PDF',
    shortName: 'EPUB a PDF',
    title: 'Convertir EPUB a PDF Online — Imprimir Libros Digitales | MediaConvert',
    h1: 'Convertir EPUB a PDF',
    description: 'Convierte libros electrónicos EPUB en documentos PDF listos para imprimir o leer en cualquier computadora.',
    contextualDescription: 'Transforma tus libros digitales EPUB en archivos PDF con páginas numeradas y maquetación fija apta para imprimir.',
    badge: 'Listo para Imprimir',
    inputFormats: ['EPUB'],
    outputFormats: ['PDF'],
    defaultOutputFormat: 'PDF',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Paginación automática', 'Índice navegable en PDF', 'Apto para impresión en papel'],
    howToSteps: [
      { step: 1, title: 'Carga tu libro EPUB', instruction: 'Arrastra tu archivo .epub.' },
      { step: 2, title: 'Genera el PDF', instruction: 'El motor maqueta las páginas.' },
      { step: 3, title: 'Descarga tu PDF', instruction: 'Guarda tu documento PDF listo.' }
    ],
    seo: {
      title: 'Convertir EPUB a PDF Online Gratis | MediaConvert',
      metaDescription: 'Convierte libros EPUB a formato PDF online para imprimir o leer en PC.',
      canonical: 'https://mediaconvert.io/convert/epub-to-pdf',
      keywords: ['epub a pdf', 'convertir epub a pdf', 'epub to pdf converter']
    },
    faq: [{ question: '¿Se pueden imprimir los PDFs resultantes?', answer: 'Sí, se generan en formato estándar A4 o Carta listos para impresión.' }],
    relatedTools: ['pdf-to-epub', 'ebook-converter', 'pdf-converter'],
    sitemap: { include: true, priority: 0.8, changeFrequency: 'weekly' }
  },

  'heic-to-pdf': {
    id: 'heic-to-pdf',
    slug: 'heic-to-pdf',
    routePath: '/convert/heic-to-pdf',
    category: 'pdf-document',
    type: 'convert',
    name: 'HEIC a PDF',
    shortName: 'HEIC a PDF',
    title: 'Convertir HEIC a PDF Online — Fotos de iPhone a Documento | MediaConvert',
    h1: 'Convertir Fotos HEIC a PDF',
    description: 'Une y convierte fotos de iPhone en formato HEIC en un único documento PDF organizado.',
    contextualDescription: 'Convierte fotos de recibos, documentos o imágenes HEIC de tu iPhone directamente a un archivo PDF consolidado para trámites y envíos.',
    badge: 'Fotos iPhone a Documento',
    inputFormats: ['HEIC', 'HEIF'],
    outputFormats: ['PDF'],
    defaultOutputFormat: 'PDF',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Une múltiples fotos en un solo PDF', 'Orientación automática de páginas', 'Compresión optimizada'],
    howToSteps: [
      { step: 1, title: 'Sube tus fotos HEIC', instruction: 'Arrastra las imágenes de tu iPhone.' },
      { step: 2, title: 'Genera el PDF', instruction: 'Combina las fotos en un documento.' },
      { step: 3, title: 'Descarga tu PDF', instruction: 'Guarda tu archivo PDF listo.' }
    ],
    seo: {
      title: 'Convertir HEIC a PDF Online Gratis — Fotos iPhone a PDF | MediaConvert',
      metaDescription: 'Convierte fotos HEIC de iPhone a documento PDF online. Une múltiples imágenes en un archivo.',
      canonical: 'https://mediaconvert.io/convert/heic-to-pdf',
      keywords: ['heic a pdf', 'convertir heic a pdf', 'fotos iphone a pdf']
    },
    faq: [{ question: '¿Puedo unir varias fotos en un solo PDF?', answer: 'Sí, todas las fotos seleccionadas se compilan ordenadamente en un único archivo PDF.' }],
    relatedTools: ['heic-to-jpg', 'jpg-to-pdf', 'pdf-converter'],
    sitemap: { include: true, priority: 0.8, changeFrequency: 'weekly' }
  },

  'docx-to-pdf': {
    id: 'docx-to-pdf',
    slug: 'docx-to-pdf',
    routePath: '/convert/docx-to-pdf',
    category: 'pdf-document',
    type: 'convert',
    name: 'DOCX a PDF',
    shortName: 'DOCX a PDF',
    title: 'Convertir DOCX a PDF Online Gratis — Word a PDF | MediaConvert',
    h1: 'Convertir Word DOCX a PDF',
    description: 'Convierte documentos de Word (.docx, .doc) a formato PDF bloqueado con maquetación exacta.',
    contextualDescription: 'Guarda tus documentos de Word como archivos PDF para asegurar que nadie modifique el contenido y que se visualice idéntico en cualquier dispositivo.',
    badge: 'Word a PDF',
    inputFormats: ['DOCX', 'DOC'],
    outputFormats: ['PDF'],
    defaultOutputFormat: 'PDF',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Tipografías y márgenes preservados', 'Sin marcas de agua', 'Conversión rápida'],
    howToSteps: [
      { step: 1, title: 'Sube tu documento Word', instruction: 'Arrastra tu archivo .docx o .doc.' },
      { step: 2, title: 'Convierte a PDF', instruction: 'El motor compila el documento.' },
      { step: 3, title: 'Descarga tu PDF', instruction: 'Guarda tu PDF listo para enviar.' }
    ],
    seo: {
      title: 'Convertir Word DOCX a PDF Online Gratis | MediaConvert',
      metaDescription: 'Convierte documentos Word DOCX a PDF online en alta calidad. Rápido, seguro y gratuito.',
      canonical: 'https://mediaconvert.io/convert/docx-to-pdf',
      keywords: ['docx a pdf', 'convertir word a pdf', 'doc a pdf', 'word to pdf']
    },
    faq: [{ question: '¿Se mantienen las fuentes del documento?', answer: 'Sí, todas las fuentes tipográficas se incrustan en el PDF resultante.' }],
    relatedTools: ['pdf-to-word', 'pdf-converter', 'compress-pdf'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'jpg-to-pdf': {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    routePath: '/convert/jpg-to-pdf',
    category: 'pdf-document',
    type: 'convert',
    name: 'JPG a PDF',
    shortName: 'JPG a PDF',
    title: 'Convertir JPG a PDF Online — Unir Fotos en un Documento | MediaConvert',
    h1: 'Convertir Imágenes JPG a PDF',
    description: 'Combina imágenes JPG, JPEG y PNG en un único archivo PDF ordenado y fácil de compartir.',
    contextualDescription: 'Une fotografías de documentos, facturas escaneadas o catálogos en un archivo PDF con orientación de página ajustable.',
    badge: 'Compilar Imágenes en PDF',
    inputFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    outputFormats: ['PDF'],
    defaultOutputFormat: 'PDF',
    processingType: 'local',
    maxFileSize: 2147483648,
    features: ['Combina decenas de fotos en un solo PDF', 'Ajuste de márgenes y orientación', 'Procesamiento en memoria'],
    howToSteps: [
      { step: 1, title: 'Sube tus imágenes JPG', instruction: 'Arrastra una o varias fotos.' },
      { step: 2, title: 'Organiza el orden', instruction: 'Ajusta la posición de las páginas.' },
      { step: 3, title: 'Descarga tu PDF', instruction: 'Guarda tu documento compilado.' }
    ],
    seo: {
      title: 'Convertir JPG a PDF Online Gratis — Unir Imágenes | MediaConvert',
      metaDescription: 'Convierte imágenes JPG a PDF online. Une fotos en un solo documento de forma rápida y gratuita.',
      canonical: 'https://mediaconvert.io/convert/jpg-to-pdf',
      keywords: ['jpg a pdf', 'convertir jpg a pdf', 'unir fotos en pdf', 'imagenes a pdf']
    },
    faq: [{ question: '¿Puedo cambiar el orden de las páginas?', answer: 'Sí, puedes reordenar las imágenes antes de compilar el PDF.' }],
    relatedTools: ['pdf-to-jpg', 'heic-to-pdf', 'pdf-converter'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  // ==========================================
  // 4. 🎞️ GIF
  // ==========================================
  'video-to-gif': {
    id: 'video-to-gif',
    slug: 'video-to-gif',
    routePath: '/convert/video-to-gif',
    category: 'gif',
    type: 'convert',
    name: 'Video a GIF',
    shortName: 'Video a GIF',
    title: 'Convertir Video a GIF Online — Crear Animaciones GIF | MediaConvert',
    h1: 'Convertir Cualquier Video a GIF Animado',
    description: 'Transforma vídeos (MP4, MOV, WebM, AVI) en animaciones GIF ligeras para compartir en redes sociales y chats.',
    contextualDescription: 'Crea GIFs animados a partir de tus mejores momentos de vídeo con control de velocidad de fotogramas (FPS) y resolución optimizada.',
    badge: 'Animaciones Ligeras',
    inputFormats: ['MP4', 'MOV', 'WEBM', 'AVI', 'MKV', 'FLV'],
    outputFormats: ['GIF'],
    defaultOutputFormat: 'GIF',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Control de FPS (10, 15, 24 fps)', 'Optimización de paleta de colores', 'Bucle continuo infinito'],
    howToSteps: [
      { step: 1, title: 'Carga tu vídeo', instruction: 'Arrastra cualquier archivo de vídeo.' },
      { step: 2, title: 'Ajusta el fragmento', instruction: 'Selecciona la duración deseada.' },
      { step: 3, title: 'Descarga tu GIF', instruction: 'Guarda tu animación GIF lista.' }
    ],
    seo: {
      title: 'Convertir Video a GIF Online Gratis | MediaConvert',
      metaDescription: 'Convierte vídeos a GIF animados online. Rápido, fácil y sin marcas de agua.',
      canonical: 'https://mediaconvert.io/convert/video-to-gif',
      keywords: ['video a gif', 'convertir video a gif', 'crear gif de video', 'video to gif converter']
    },
    faq: [{ question: '¿El GIF se reproduce en bucle infinito?', answer: 'Sí, las animaciones generadas incluyen el flag de repetición continua.' }],
    relatedTools: ['mp4-to-gif', 'gif-to-mp4', 'image-to-gif'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'mp4-to-gif': {
    id: 'mp4-to-gif',
    slug: 'mp4-to-gif',
    routePath: '/convert/mp4-to-gif',
    category: 'gif',
    type: 'convert',
    name: 'MP4 a GIF',
    shortName: 'MP4 a GIF',
    title: 'Convertir MP4 a GIF Online Gratis — Animaciones de Vídeo | MediaConvert',
    h1: 'Convertir MP4 a GIF Animado',
    description: 'Convierte clips de vídeo MP4 en GIFs animados de alta calidad y bajo peso.',
    contextualDescription: 'Transforma grabaciones MP4 en animaciones GIF listas para insertar en mensajes de WhatsApp, Discord, Slack o sitios web.',
    badge: 'MP4 a Animación',
    inputFormats: ['MP4'],
    outputFormats: ['GIF'],
    defaultOutputFormat: 'GIF',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Conversión rápida de MP4', 'Paleta de 256 colores optimizada', 'Reducción de tamaño'],
    howToSteps: [
      { step: 1, title: 'Sube tu vídeo MP4', instruction: 'Arrastra tu archivo MP4.' },
      { step: 2, title: 'Convierte a GIF', instruction: 'Inicia el renderizado.' },
      { step: 3, title: 'Descarga tu GIF', instruction: 'Guarda tu animación GIF.' }
    ],
    seo: {
      title: 'Convertir MP4 a GIF Online Gratis | MediaConvert',
      metaDescription: 'Convierte vídeos MP4 a GIF animados online en alta calidad. Gratis y sin límites.',
      canonical: 'https://mediaconvert.io/convert/mp4-to-gif',
      keywords: ['mp4 a gif', 'convertir mp4 a gif', 'mp4 to gif online']
    },
    faq: [{ question: '¿Cómo reducir el peso del GIF?', answer: 'Disminuyendo la resolución o la tasa de cuadros por segundo (FPS).' }],
    relatedTools: ['video-to-gif', 'gif-to-mp4', 'webm-to-gif'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'webm-to-gif': {
    id: 'webm-to-gif',
    slug: 'webm-to-gif',
    routePath: '/convert/webm-to-gif',
    category: 'gif',
    type: 'convert',
    name: 'WEBM a GIF',
    shortName: 'WEBM a GIF',
    title: 'Convertir WEBM a GIF Online Gratis | MediaConvert',
    h1: 'Convertir WEBM a GIF Animado',
    description: 'Transforma vídeos en formato WebM en animaciones GIF compatibles con todas las plataformas.',
    contextualDescription: 'Convierte clips WebM de internet en archivos GIF universales que se reproducen automáticamente en cualquier navegador o aplicación.',
    badge: 'WebM a GIF',
    inputFormats: ['WEBM'],
    outputFormats: ['GIF'],
    defaultOutputFormat: 'GIF',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Conversión fluida de WebM', 'Bucle infinito integrado', 'Procesamiento rápido'],
    howToSteps: [
      { step: 1, title: 'Carga tu archivo WebM', instruction: 'Arrastra tu vídeo .webm.' },
      { step: 2, title: 'Genera el GIF', instruction: 'El motor procesa los fotogramas.' },
      { step: 3, title: 'Descarga tu GIF', instruction: 'Guarda tu animación.' }
    ],
    seo: {
      title: 'Convertir WEBM a GIF Online Gratis | MediaConvert',
      metaDescription: 'Convierte archivos WebM a GIF animados online de forma rápida y gratuita.',
      canonical: 'https://mediaconvert.io/convert/webm-to-gif',
      keywords: ['webm a gif', 'convertir webm a gif', 'webm to gif']
    },
    faq: [{ question: '¿Mantiene la fluidez del vídeo?', answer: 'Sí, ajustando los FPS se conserva la suavidad visual del movimiento.' }],
    relatedTools: ['mp4-to-gif', 'video-to-gif', 'gif-to-mp4'],
    sitemap: { include: true, priority: 0.8, changeFrequency: 'weekly' }
  },

  'apng-to-gif': {
    id: 'apng-to-gif',
    slug: 'apng-to-gif',
    routePath: '/convert/apng-to-gif',
    category: 'gif',
    type: 'convert',
    name: 'APNG a GIF',
    shortName: 'APNG a GIF',
    title: 'Convertir APNG a GIF Online — PNG Animado a GIF | MediaConvert',
    h1: 'Convertir APNG a GIF',
    description: 'Convierte imágenes PNG animadas (APNG) a formato GIF estándar con compatibilidad universal.',
    contextualDescription: 'Muchas plataformas no soportan el formato PNG animado (APNG). Conviértelas a GIF tradicional para compartirlas en cualquier red social.',
    badge: 'PNG Animado a GIF',
    inputFormats: ['PNG', 'APNG'],
    outputFormats: ['GIF'],
    defaultOutputFormat: 'GIF',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Conversión cuadro a cuadro', 'Preserva tiempos de retraso entre frames', 'Compatibilidad universal'],
    howToSteps: [
      { step: 1, title: 'Sube tu imagen APNG', instruction: 'Arrastra tu archivo PNG animado.' },
      { step: 2, title: 'Convierte a GIF', instruction: 'El conversor adapta los fotogramas.' },
      { step: 3, title: 'Descarga tu GIF', instruction: 'Guarda tu archivo GIF.' }
    ],
    seo: {
      title: 'Convertir APNG a GIF Online Gratis | MediaConvert',
      metaDescription: 'Transforma imágenes APNG animadas a formato GIF online. Rápido y gratuito.',
      canonical: 'https://mediaconvert.io/convert/apng-to-gif',
      keywords: ['apng a gif', 'convertir apng a gif', 'png animado a gif']
    },
    faq: [{ question: '¿Qué es un APNG?', answer: 'Es una extensión del formato PNG que permite almacenar animaciones con soporte de transparencia de 24 bits.' }],
    relatedTools: ['gif-to-apng', 'video-to-gif', 'image-to-gif'],
    sitemap: { include: true, priority: 0.8, changeFrequency: 'weekly' }
  },

  'gif-to-mp4': {
    id: 'gif-to-mp4',
    slug: 'gif-to-mp4',
    routePath: '/convert/gif-to-mp4',
    category: 'gif',
    type: 'convert',
    name: 'GIF a MP4',
    shortName: 'GIF a MP4',
    title: 'Convertir GIF a MP4 Online — Reducir Peso de Animaciones | MediaConvert',
    h1: 'Convertir GIF Animado a Video MP4',
    description: 'Transforma animaciones GIF pesadas en vídeos MP4 ultraligeros (hasta un 90% más pequeños).',
    contextualDescription: 'Los archivos GIF utilizan tecnología antigua muy ineficiente en tamaño. Al convertirlos a vídeo MP4 con H.264 reduces drásticamente el peso manteniendo la misma animación.',
    badge: 'Reducción hasta 90%',
    inputFormats: ['GIF'],
    outputFormats: ['MP4'],
    defaultOutputFormat: 'MP4',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Reducción extrema de tamaño de archivo', 'Carga instantánea en sitios web', 'Reproducción fluida'],
    howToSteps: [
      { step: 1, title: 'Sube tu archivo GIF', instruction: 'Arrastra tu animación .gif.' },
      { step: 2, title: 'Convierte a MP4', instruction: 'El compresor de vídeo procesa los frames.' },
      { step: 3, title: 'Descarga tu vídeo MP4', instruction: 'Guarda tu vídeo optimizado.' }
    ],
    seo: {
      title: 'Convertir GIF a MP4 Online Gratis — Reducir Peso | MediaConvert',
      metaDescription: 'Convierte archivos GIF a vídeos MP4 online y reduce su peso hasta un 90%. Gratis y rápido.',
      canonical: 'https://mediaconvert.io/convert/gif-to-mp4',
      keywords: ['gif a mp4', 'convertir gif a mp4', 'gif to mp4 converter', 'reducir peso gif']
    },
    faq: [{ question: '¿Por qué convertir GIF a MP4?', answer: 'Un MP4 suele pesar entre 5 y 10 veces menos que un GIF equivalente y se reproduce más suavemente.' }],
    relatedTools: ['mp4-to-gif', 'video-to-gif'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'gif-to-apng': {
    id: 'gif-to-apng',
    slug: 'gif-to-apng',
    routePath: '/convert/gif-to-apng',
    category: 'gif',
    type: 'convert',
    name: 'GIF a APNG',
    shortName: 'GIF a APNG',
    title: 'Convertir GIF a APNG Online — Mayor Calidad y Color | MediaConvert',
    h1: 'Convertir GIF a PNG Animado (APNG)',
    description: 'Convierte animaciones GIF a formato APNG para mejorar la nitidez y soporte de color.',
    contextualDescription: 'Transforma GIFs limitados a 256 colores en imágenes PNG animadas con colores verdaderos y mejor fidelidad de bordes.',
    badge: 'APNG 24-bit',
    inputFormats: ['GIF'],
    outputFormats: ['APNG', 'PNG'],
    defaultOutputFormat: 'PNG',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Mayor fidelidad cromática', 'Sin artefactos de compresión GIF', 'Animación continua'],
    howToSteps: [
      { step: 1, title: 'Carga tu GIF', instruction: 'Arrastra tu animación.' },
      { step: 2, title: 'Convierte a APNG', instruction: 'Inicia el procesamiento.' },
      { step: 3, title: 'Descarga tu APNG', instruction: 'Guarda tu archivo PNG animado.' }
    ],
    seo: {
      title: 'Convertir GIF a APNG Online Gratis | MediaConvert',
      metaDescription: 'Convierte GIFs a PNG animados (APNG) online con mejor calidad gráfica y sin pérdidas.',
      canonical: 'https://mediaconvert.io/convert/gif-to-apng',
      keywords: ['gif a apng', 'convertir gif a apng', 'gif to apng']
    },
    faq: [{ question: '¿Qué navegadores soportan APNG?', answer: 'Todos los navegadores modernos (Chrome, Safari, Firefox, Edge) soportan APNG de forma nativa.' }],
    relatedTools: ['apng-to-gif', 'gif-to-mp4'],
    sitemap: { include: true, priority: 0.8, changeFrequency: 'weekly' }
  },

  'image-to-gif': {
    id: 'image-to-gif',
    slug: 'image-to-gif',
    routePath: '/convert/image-to-gif',
    category: 'gif',
    type: 'convert',
    name: 'Imagen a GIF',
    shortName: 'Imagen a GIF',
    title: 'Convertir Imágenes a GIF Online — Crear Secuencias GIF | MediaConvert',
    h1: 'Crear GIF Animado a partir de Imágenes',
    description: 'Combina varias fotos (JPG, PNG, WebP) para crear una animación GIF con intervalo de tiempo personalizado.',
    contextualDescription: 'Une una secuencia de fotografías o diapositivas para generar un GIF animado en bucle con velocidad ajustable.',
    badge: 'Creador de GIF',
    inputFormats: ['JPG', 'JPEG', 'PNG', 'WEBP', 'BMP'],
    outputFormats: ['GIF'],
    defaultOutputFormat: 'GIF',
    processingType: 'local',
    maxFileSize: 2147483648,
    features: ['Combina múltiples fotos en animación', 'Control de retraso entre fotogramas', 'Generación 100% en memoria'],
    howToSteps: [
      { step: 1, title: 'Sube tus fotos', instruction: 'Selecciona las imágenes que compondrán la animación.' },
      { step: 2, title: 'Ajusta la velocidad', instruction: 'Configura los milisegundos por fotograma.' },
      { step: 3, title: 'Descarga tu GIF', instruction: 'Guarda tu nueva animación.' }
    ],
    seo: {
      title: 'Crear GIF a partir de Fotos Online Gratis | MediaConvert',
      metaDescription: 'Une imágenes JPG o PNG para crear animaciones GIF online. Fácil, rápido y gratis.',
      canonical: 'https://mediaconvert.io/convert/image-to-gif',
      keywords: ['imagen a gif', 'fotos a gif', 'crear gif de fotos', 'images to gif']
    },
    faq: [{ question: '¿Puedo elegir el orden de las fotos?', answer: 'Sí, puedes organizar la secuencia de fotogramas antes de exportar el GIF.' }],
    relatedTools: ['video-to-gif', 'mp4-to-gif'],
    sitemap: { include: true, priority: 0.8, changeFrequency: 'weekly' }
  },

  'mov-to-gif': {
    id: 'mov-to-gif',
    slug: 'mov-to-gif',
    routePath: '/convert/mov-to-gif',
    category: 'gif',
    type: 'convert',
    name: 'MOV a GIF',
    shortName: 'MOV a GIF',
    title: 'Convertir MOV a GIF Online — Vídeos de iPhone a GIF | MediaConvert',
    h1: 'Convertir QuickTime MOV a GIF Animado',
    description: 'Transforma vídeos MOV grabados en iPhone y Mac en animaciones GIF listas para compartir.',
    contextualDescription: 'Convierte tus Live Photos o vídeos de QuickTime MOV en animaciones GIF compatibles con cualquier chat y red social.',
    badge: 'Apple MOV a GIF',
    inputFormats: ['MOV'],
    outputFormats: ['GIF'],
    defaultOutputFormat: 'GIF',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Soporte para vídeos de iPhone', 'Animación en bucle', 'Control de tamaño'],
    howToSteps: [
      { step: 1, title: 'Carga tu vídeo MOV', instruction: 'Arrastra tu archivo .mov.' },
      { step: 2, title: 'Convierte a GIF', instruction: 'Procesa la animación.' },
      { step: 3, title: 'Descarga tu GIF', instruction: 'Guarda tu archivo GIF.' }
    ],
    seo: {
      title: 'Convertir MOV a GIF Online Gratis — iPhone a GIF | MediaConvert',
      metaDescription: 'Convierte vídeos MOV de Apple a formato GIF animado online. Rápido y sin marcas de agua.',
      canonical: 'https://mediaconvert.io/convert/mov-to-gif',
      keywords: ['mov a gif', 'convertir mov a gif', 'iphone video a gif', 'mov to gif']
    },
    faq: [{ question: '¿Funciona con Live Photos exportadas?', answer: 'Sí, los vídeos MOV generados por Live Photos se convierten perfectamente a GIF.' }],
    relatedTools: ['video-to-gif', 'mp4-to-gif', 'mov-to-mp4'],
    sitemap: { include: true, priority: 0.8, changeFrequency: 'weekly' }
  },

  'avi-to-gif': {
    id: 'avi-to-gif',
    slug: 'avi-to-gif',
    routePath: '/convert/avi-to-gif',
    category: 'gif',
    type: 'convert',
    name: 'AVI a GIF',
    shortName: 'AVI a GIF',
    title: 'Convertir AVI a GIF Online Gratis | MediaConvert',
    h1: 'Convertir Vídeo AVI a GIF',
    description: 'Convierte archivos de vídeo AVI en animaciones GIF ligeras para web y mensajería.',
    contextualDescription: 'Transforma vídeos clásicos AVI en GIFs animados modernos con compresión de paleta optimizada.',
    badge: 'AVI a GIF',
    inputFormats: ['AVI'],
    outputFormats: ['GIF'],
    defaultOutputFormat: 'GIF',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Compatibilidad con vídeos AVI', 'Optimización de fotogramas', 'Descarga rápida'],
    howToSteps: [
      { step: 1, title: 'Sube tu vídeo AVI', instruction: 'Arrastra tu archivo .avi.' },
      { step: 2, title: 'Convierte a GIF', instruction: 'Inicia el renderizado.' },
      { step: 3, title: 'Descarga tu GIF', instruction: 'Guarda tu animación GIF.' }
    ],
    seo: {
      title: 'Convertir AVI a GIF Online Gratis | MediaConvert',
      metaDescription: 'Convierte vídeos AVI a GIF animados online en segundos. Gratis y sin registros.',
      canonical: 'https://mediaconvert.io/convert/avi-to-gif',
      keywords: ['avi a gif', 'convertir avi a gif', 'avi to gif converter']
    },
    faq: [{ question: '¿Se puede limitar la duración?', answer: 'Sí, se extrae el fragmento seleccionado para mantener un archivo GIF ligero.' }],
    relatedTools: ['video-to-gif', 'mp4-to-gif'],
    sitemap: { include: true, priority: 0.8, changeFrequency: 'weekly' }
  },

  // ==========================================
  // 5. HERRAMIENTAS DE COMPRESIÓN Y UTILIDADES
  // ==========================================
  'compress-jpg': {
    id: 'compress-jpg',
    slug: 'compress-jpg',
    routePath: '/compress/compress-jpg',
    category: 'image',
    type: 'compress',
    name: 'Comprimir JPG',
    shortName: 'Comprimir JPG',
    title: 'Comprimir JPG Online Gratis — Reducir Tamaño de Fotos | MediaConvert',
    h1: 'Comprimir Imágenes JPG Online',
    description: 'Reduce el peso de tus imágenes JPG hasta un 80% manteniendo una nitidez visual prácticamente idéntica.',
    contextualDescription: 'Algoritmo inteligente de compresión DCT y eliminación de metadatos innecesarios para optimizar tus fotos sin pérdidas perceptibles.',
    badge: 'Acelerado por GPU Local',
    inputFormats: ['JPG', 'JPEG'],
    outputFormats: ['JPG'],
    defaultOutputFormat: 'JPG',
    processingType: 'local',
    maxFileSize: 2147483648,
    features: [
      'Reducción de hasta un 80% del peso en MB',
      'Preservación de nitidez y contraste en bordes',
      'Procesamiento en memoria sin enviar datos a servidores',
      'Descarga individual o archivo ZIP consolidado'
    ],
    howToSteps: [
      { step: 1, title: 'Arrastra tus imágenes JPG', instruction: 'Sube una o varias fotos JPG pesadas.' },
      { step: 2, title: 'Elige el nivel de compresión', instruction: 'Equilibrio automático o ajuste manual de calidad.' },
      { step: 3, title: 'Descarga tus fotos ligeras', instruction: 'Guarda tus fotos optimizadas al instante.' }
    ],
    seo: {
      title: 'Comprimir JPG Online Gratis — Reducir Tamaño de Fotos | MediaConvert',
      metaDescription: 'Comprime imágenes JPG online gratis sin perder calidad. Reduce el peso de tus fotos para web o correo.',
      canonical: 'https://mediaconvert.io/compress/compress-jpg',
      keywords: ['comprimir jpg', 'reducir tamaño jpg', 'optimizar fotos jpeg', 'compress jpg online']
    },
    faq: [
      { question: '¿Se nota la pérdida de calidad?', answer: 'En niveles estándar (calidad 85-90%), la diferencia es imperceptible para el ojo humano.' }
    ],
    relatedTools: ['jpg-to-png', 'compress-png', 'compress-pdf'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'compress-png': {
    id: 'compress-png',
    slug: 'compress-png',
    routePath: '/compress/compress-png',
    category: 'image',
    type: 'compress',
    name: 'Comprimir PNG',
    shortName: 'Comprimir PNG',
    title: 'Comprimir PNG Online — Optimizar PNG sin Perder Transparencia | MediaConvert',
    h1: 'Comprimir Imágenes PNG Online',
    description: 'Reduce el tamaño de archivos PNG manteniendo al 100% el canal de transparencia y los bordes nítidos.',
    contextualDescription: 'Optimización de compresión DEFLATE y cuantización inteligente de colores para gráficos web, logotipos y capturas de pantalla.',
    badge: 'Conserva Transparencia',
    inputFormats: ['PNG'],
    outputFormats: ['PNG'],
    defaultOutputFormat: 'PNG',
    processingType: 'local',
    maxFileSize: 2147483648,
    features: ['Conserva canal alfa transparente', 'Optimización de filtros PNG', 'Procesamiento en memoria RAM'],
    howToSteps: [
      { step: 1, title: 'Sube tus imágenes PNG', instruction: 'Arrastra tus archivos PNG pesados.' },
      { step: 2, title: 'Aplica la optimización', instruction: 'El motor reduce el tamaño de los datos.' },
      { step: 3, title: 'Descarga tus PNGs reducidos', instruction: 'Guarda tus imágenes optimizadas.' }
    ],
    seo: {
      title: 'Comprimir PNG Online Gratis — Reducir Peso de PNG | MediaConvert',
      metaDescription: 'Comprime imágenes PNG sin perder calidad ni fondos transparentes. 100% privado en tu navegador.',
      canonical: 'https://mediaconvert.io/compress/compress-png',
      keywords: ['comprimir png', 'reducir tamaño png', 'optimizar imagenes png']
    },
    faq: [{ question: '¿Se mantiene el fondo transparente?', answer: 'Sí, la compresión de MediaConvert no altera el canal alfa de tus PNGs.' }],
    relatedTools: ['png-to-jpg', 'compress-jpg', 'jpg-to-png'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'compress-webp': {
    id: 'compress-webp',
    slug: 'compress-webp',
    routePath: '/compress/compress-webp',
    category: 'image',
    type: 'compress',
    name: 'Comprimir WebP',
    shortName: 'Comprimir WebP',
    title: 'Comprimir WebP Online — Reducir Peso de Imágenes WebP | MediaConvert',
    h1: 'Comprimir Imágenes WebP Online',
    description: 'Reduce el tamaño de imágenes WebP para conseguir máxima velocidad de carga web manteniendo alta nitidez.',
    contextualDescription: 'Optimiza archivos WebP mediante compresión visual inteligente para acelerar páginas web y apps móviles.',
    badge: 'Ultra Ligero',
    inputFormats: ['WEBP'],
    outputFormats: ['WEBP'],
    defaultOutputFormat: 'WEBP',
    processingType: 'local',
    maxFileSize: 2147483648,
    features: ['Compresión adaptativa en tu navegador', 'Preserva canal alfa transparente', 'Carga ultrarrápida'],
    howToSteps: [
      { step: 1, title: 'Sube tus imágenes WebP', instruction: 'Arrastra tus archivos WebP.' },
      { step: 2, title: 'Ajusta la compresión', instruction: 'Selecciona el nivel de compresión deseado.' },
      { step: 3, title: 'Descarga tus WebP', instruction: 'Guarda tus imágenes WebP reducidas.' }
    ],
    seo: {
      title: 'Comprimir WebP Online Gratis | MediaConvert',
      metaDescription: 'Comprime imágenes WebP gratis y reduce su peso para páginas web sin perder calidad visual.',
      canonical: 'https://mediaconvert.io/compress/compress-webp',
      keywords: ['comprimir webp', 'reducir tamaño webp', 'optimizar webp']
    },
    faq: [{ question: '¿Por qué comprimir WebP?', answer: 'Permite reducir aún más el tiempo de carga de páginas web y optimizar el consumo de datos móviles.' }],
    relatedTools: ['compress-jpg', 'compress-png', 'webp-to-jpg'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'compress-mp3': {
    id: 'compress-mp3',
    slug: 'compress-mp3',
    routePath: '/compress/compress-mp3',
    category: 'video-audio',
    type: 'compress',
    name: 'Comprimir Audio MP3',
    shortName: 'Comprimir MP3',
    title: 'Comprimir Audio MP3 Online — Reducir Tamaño de Pistas de Audio | MediaConvert',
    h1: 'Comprimir Archivos de Audio MP3 Online',
    description: 'Reduce la tasa de bits y el peso de tus audios MP3 para podcasts y envíos rápidos.',
    contextualDescription: 'Optimiza archivos de audio MP3 ajustando el bitrate para ahorrar espacio y facilitar envíos por mensajería.',
    badge: 'Audio Optimizado',
    inputFormats: ['MP3', 'WAV', 'OGG', 'M4A', 'AAC'],
    outputFormats: ['MP3'],
    defaultOutputFormat: 'MP3',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Ajuste inteligente de bitrate', 'Preserva claridad vocal y de sonido', 'Ideal para podcasts y notas de voz'],
    howToSteps: [
      { step: 1, title: 'Sube tu archivo de audio', instruction: 'Arrastra tu archivo MP3.' },
      { step: 2, title: 'Selecciona la compresión', instruction: 'Elige la tasa de bits.' },
      { step: 3, title: 'Descarga tu MP3', instruction: 'Obtén tu audio ligero.' }
    ],
    seo: {
      title: 'Comprimir MP3 Online Gratis — Reducir Peso de Audio | MediaConvert',
      metaDescription: 'Comprime audios MP3 de forma rápida y gratuita para enviar por correo o WhatsApp.',
      canonical: 'https://mediaconvert.io/compress/compress-mp3',
      keywords: ['comprimir mp3', 'reducir peso audio', 'optimizar mp3 online']
    },
    faq: [{ question: '¿Se escucha bien después de comprimir?', answer: 'Sí, conservamos las frecuencias de rango medio y vocal para mantener gran claridad.' }],
    relatedTools: ['mp4-to-mp3', 'audio-converter', 'compress-pdf'],
    sitemap: { include: true, priority: 0.8, changeFrequency: 'weekly' }
  },

  'compress-mp4': {
    id: 'compress-mp4',
    slug: 'compress-mp4',
    routePath: '/compress/compress-mp4',
    category: 'video-audio',
    type: 'compress',
    name: 'Comprimir Vídeo MP4',
    shortName: 'Comprimir MP4',
    title: 'Comprimir Vídeo MP4 Online — Reducir Peso de Vídeos sin Perder Calidad | MediaConvert',
    h1: 'Comprimir Vídeos MP4 Online',
    description: 'Reduce drásticamente el peso de vídeos MP4 manteniendo resolución HD y sincronización de audio.',
    contextualDescription: 'Comprime clips de vídeo grabados con móvil o cámara para subirlos más rápido a redes o enviarlos por correo.',
    badge: 'Vídeo Ultra Ligero',
    inputFormats: ['MP4', 'MOV', 'WEBM', 'AVI', 'MKV'],
    outputFormats: ['MP4'],
    defaultOutputFormat: 'MP4',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: ['Reducción de tamaño hasta un 70%', 'Conserva resolución HD 1080p/720p', 'Audio estéreo sincronizado'],
    howToSteps: [
      { step: 1, title: 'Sube tu vídeo MP4', instruction: 'Arrastra tu vídeo pesado.' },
      { step: 2, title: 'Elige el nivel de reducción', instruction: 'Selecciona calidad balanceada o máxima compresión.' },
      { step: 3, title: 'Descarga tu vídeo optimizado', instruction: 'Guarda tu vídeo reducido y listo para compartir.' }
    ],
    seo: {
      title: 'Comprimir MP4 Online Gratis — Reducir Peso de Vídeo | MediaConvert',
      metaDescription: 'Comprime vídeos MP4 online gratis sin perder calidad. Reduce el tamaño de vídeos pesados en segundos.',
      canonical: 'https://mediaconvert.io/compress/compress-mp4',
      keywords: ['comprimir mp4', 'reducir peso video', 'comprimir video online', 'hacer video mas liviano']
    },
    faq: [{ question: '¿Puedo enviar el vídeo por WhatsApp o correo tras comprimirlo?', answer: 'Sí, queda perfectamente adaptado a los límites habituales de 25 MB y 64 MB.' }],
    relatedTools: ['mov-to-mp4', 'video-converter', 'mp4-to-gif'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'compress-pdf': {
    id: 'compress-pdf',
    slug: 'compress-pdf',
    routePath: '/compress/compress-pdf',
    category: 'pdf-document',
    type: 'compress',
    name: 'Comprimir PDF',
    shortName: 'Comprimir PDF',
    title: 'Comprimir Archivos PDF Online — Reducir Peso de Documentos | MediaConvert',
    h1: 'Comprimir Archivos PDF Online',
    description: 'Reduce el peso de documentos PDF pesados para enviarlos fácilmente por correo electrónico sin perder legibilidad.',
    contextualDescription: 'Comprime documentos PDF escaneados, contratos y presentaciones para cumplir con los límites de tamaño en correos y plataformas gubernamentales.',
    badge: 'Documentos Pro',
    inputFormats: ['PDF'],
    outputFormats: ['PDF'],
    defaultOutputFormat: 'PDF',
    processingType: 'hybrid',
    maxFileSize: 2147483648,
    features: [
      'Optimización de imágenes y vectores internos incrustados',
      'Conserva texto seleccionable y estructura de páginas',
      'Cumple los límites de envío por email (menor a 25 MB)',
      'Máxima privacidad con borrado automático de temporales'
    ],
    howToSteps: [
      { step: 1, title: 'Sube tu documento PDF', instruction: 'Arrastra tu archivo PDF pesado.' },
      { step: 2, title: 'Selecciona la compresión', instruction: 'Elige el nivel de optimización deseado.' },
      { step: 3, title: 'Descarga tu PDF optimizado', instruction: 'Obtén tu documento reducido y listo para enviar.' }
    ],
    seo: {
      title: 'Comprimir PDF Online Gratis — Reducir Tamaño de PDF | MediaConvert',
      metaDescription: 'Comprime archivos PDF sin perder calidad de texto ni legibilidad. Seguro, rápido y sin marcas de agua.',
      canonical: 'https://mediaconvert.io/compress/compress-pdf',
      keywords: ['comprimir pdf', 'reducir peso pdf', 'optimizar documento pdf', 'hacer pdf mas pequeño']
    },
    faq: [
      { question: '¿El texto sigue siendo legible y seleccionable?', answer: 'Sí. Los caracteres vectoriales y fuentes tipográficas conservan su claridad total.' }
    ],
    relatedTools: ['docx-to-pdf', 'jpg-to-pdf', 'pdf-converter'],
    sitemap: { include: true, priority: 0.9, changeFrequency: 'weekly' }
  },

  'files-to-zip': {
    id: 'files-to-zip',
    slug: 'files-to-zip',
    routePath: '/convert/files-to-zip',
    category: 'archive',
    type: 'utility',
    name: 'Empaquetar Archivos en .ZIP',
    shortName: 'Crear .ZIP',
    title: 'Crear Archivo ZIP Online — Empaquetar y Comprimir Archivos | MediaConvert',
    h1: 'Crear Archivo ZIP Comprimido Online',
    description: 'Empaqueta y comprime múltiples archivos o carpetas en un único contenedor .ZIP listo para compartir.',
    contextualDescription: 'Agrupa decenas de documentos, fotos o audios en un archivo comprimido .ZIP con compresión DEFLATE. Todo generado instantáneamente en la memoria de tu navegador.',
    badge: '100% Nativo en Navegador',
    inputFormats: ['*'],
    outputFormats: ['ZIP'],
    defaultOutputFormat: 'ZIP',
    processingType: 'local',
    maxFileSize: 2147483648,
    features: [
      'Empaquetado de cualquier tipo de archivo sin restricciones',
      'Algoritmo de compresión DEFLATE sin pérdida de datos',
      'Generación en memoria sin subir ningún byte a la red',
      'Ideal para enviar paquetes de trabajo consolidados'
    ],
    howToSteps: [
      { step: 1, title: 'Selecciona tus archivos', instruction: 'Arrastra todos los archivos que quieras incluir en el paquete.' },
      { step: 2, title: 'Revisa la lista', instruction: 'Verifica los elementos y nombres de archivo.' },
      { step: 3, title: 'Descarga tu archivo .ZIP', instruction: 'Haz clic para generar y descargar tu archivo comprimido.' }
    ],
    seo: {
      title: 'Crear Archivo ZIP Online Gratis — Empaquetar Archivos | MediaConvert',
      metaDescription: 'Crea archivos comprimidos .ZIP en segundos sin instalar programas. 100% privado en tu navegador.',
      canonical: 'https://mediaconvert.io/convert/files-to-zip',
      keywords: ['crear archivo zip online', 'comprimir en zip', 'empaquetar archivos zip gratis', 'generar zip']
    },
    faq: [
      { question: '¿Se pueden comprimir diferentes tipos de archivo juntos?', answer: 'Sí. Puedes combinar imágenes, PDFs, hojas de cálculo y audios dentro del mismo archivo .ZIP.' }
    ],
    relatedTools: ['compress-jpg', 'compress-png', 'compress-pdf'],
    sitemap: { include: true, priority: 0.8, changeFrequency: 'weekly' }
  }
};

// ==========================================
// HELPERS DE CONSULTA Y ROUTING SEGURO (ANTI-DUPLICADOS)
// ==========================================

export function getToolBySlug(slug: string): ToolConfig | undefined {
  if (!slug) return undefined;
  const normalized = slug
    .toLowerCase()
    .replace(/^\/?(convert|compress|comprimir|convertir|tools|image|video|audio|document|gif)\//, '')
    .replace(/^\//, '')
    .replace(/\/$/, '');

  if (TOOLS_CONFIG[normalized]) return TOOLS_CONFIG[normalized];

  // Alias maps for compress tools (e.g., comprimir-png -> compress-png)
  const mappedSlug = normalized
    .replace(/^comprimir-/, 'compress-')
    .replace(/^compresser-/, 'compress-')
    .replace(/^convertir-a-/, 'convert-')
    .replace(/^convertir-/, '');

  if (TOOLS_CONFIG[mappedSlug]) return TOOLS_CONFIG[mappedSlug];

  return Object.values(TOOLS_CONFIG).find(
    t => t.slug === normalized || 
         t.slug === mappedSlug ||
         t.id === normalized ||
         t.id === mappedSlug ||
         t.routePath === `/${normalized}` ||
         t.routePath === `/convert/${normalized}` ||
         t.routePath === `/compress/${normalized}` ||
         t.routePath === `/compress/${mappedSlug}`
  );
}

export function getToolByPath(pathname: string): ToolConfig | undefined {
  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/';
  
  // 1. Coincidencia exacta con la ruta canónica principal
  const exact = Object.values(TOOLS_CONFIG).find(t => t.routePath === cleanPath);
  if (exact) return exact;

  // 2. Normalización de rutas secundarias o variantes para evitar páginas duplicadas
  const segments = cleanPath.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  if (lastSegment) {
    return getToolBySlug(lastSegment);
  }
  return undefined;
}

export function getAllToolConfigs(): ToolConfig[] {
  return Object.values(TOOLS_CONFIG);
}

export function getToolsByCategory(category: FileCategory): ToolConfig[] {
  return Object.values(TOOLS_CONFIG).filter(t => {
    if (category === 'video-audio') {
      return t.category === 'video-audio' || t.category === 'video' || t.category === 'audio';
    }
    if (category === 'pdf-document') {
      return t.category === 'pdf-document' || t.category === 'document';
    }
    return t.category === category;
  });
}

export function getRelatedToolConfigs(slugs: string[]): ToolConfig[] {
  return slugs
    .map(s => getToolBySlug(s))
    .filter((t): t is ToolConfig => t !== undefined);
}

// ==========================================
// GENERACIÓN AUTOMÁTICA DEL SITEMAP XML
// ==========================================
export function generateSitemapXml(domain: string = 'https://mediaconvert.io'): string {
  const today = new Date().toISOString().split('T')[0];
  
  // Filtrar estrictamente herramientas con sitemap.include = true
  const tools = getAllToolConfigs().filter(t => t.sitemap && t.sitemap.include !== false);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Rutas estáticas raíz
  xml += `  <url>\n    <loc>${domain}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  xml += `  <url>\n    <loc>${domain}/tools</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  xml += `  <url>\n    <loc>${domain}/sitemap</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;

  // URLs individuales de herramientas registradas automáticamente
  tools.forEach(tool => {
    xml += `  <url>\n    <loc>${domain}${tool.routePath}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${tool.sitemap.changeFrequency || 'weekly'}</changefreq>\n    <priority>${(tool.sitemap.priority ?? 0.8).toFixed(1)}</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${domain}/guide/${tool.slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

// ==========================================
// GENERADOR Y OBTENCIÓN DE GUÍAS / BLOGS SEO
// ==========================================
export function getToolGuideArticle(tool: ToolConfig): ToolGuideArticle {
  if (tool.guideArticle) {
    return tool.guideArticle;
  }

  const inFmt = tool.inputFormats.join(', ');
  const outFmt = tool.defaultOutputFormat;
  const isConvert = tool.type !== 'compress';

  // Generación de artículo conciso (máximo ~900 caracteres) hiperenfocado en la herramienta
  let summary = '';
  if (tool.slug === 'mp4-to-mp3') {
    summary = `Aprende a convertir vídeos MP4 a pistas de audio MP3 de forma instantánea. Esta guía te explica cómo extraer la pista de sonido de tus vídeos musicales, grabaciones y conferencias sin perder fidelidad sonora. El proceso se ejecuta en la memoria de tu dispositivo mediante aceleración local, manteniendo un bitrate de alta fidelidad (hasta 320 kbps) y sin enviar tus archivos a servidores externos. Sube tu archivo .mp4, pulsa convertir y obtén tu MP3 listo para escuchar en cualquier reproductor o smartphone.`;
  } else if (tool.slug === 'jpg-to-png') {
    summary = `Descubre cómo transformar imágenes JPG en archivos PNG con máxima nitidez cromática y soporte de transparencia. A diferencia del formato JPG que utiliza compresión con pérdida, el estándar PNG preserva cada píxel intacto mediante el algoritmo sin pérdidas DEFLATE. Es la solución ideal para preparar logotipos, capturas y gráficos antes de recortar fondos o exportar a plataformas de diseño. Todo el procesamiento se realiza en tu navegador con aceleración por GPU.`;
  } else if (tool.slug === 'mov-to-mp4') {
    summary = `Convierte vídeos MOV de Apple QuickTime (iPhone, iPad y Mac) a formato universal MP4 con códec H.264. Los archivos .mov suelen ser muy pesados y presentan incompatibilidades al compartirlos en Windows o Android. Al convertirlos a MP4 reduces el tamaño del archivo conservando la resolución original Full HD o 4K y la sincronización de audio estéreo perfecta.`;
  } else if (tool.slug === 'webp-to-jpg') {
    summary = `Transforma imágenes WebP descargadas de internet al estándar JPG para abrirlas en cualquier editor tradicional o visor de imágenes. WebP es excelente para la web pero genera problemas de compatibilidad en software antiguo. Con esta herramienta gratuita puedes pasar cualquier imagen .webp a .jpg en milisegundos y con calidad fotográfica ajustable.`;
  } else if (tool.slug === 'webp-to-png') {
    summary = `Pasa tus imágenes WebP a formato PNG conservando intacto el canal alfa de transparencia gradual. Es el método más rápido para recuperar gráficos con fondo transparente y utilizarlos en Photoshop, Word, Canva o cualquier plataforma sin sufrir distorsiones en los bordes.`;
  } else if (tool.slug === 'heic-to-jpg') {
    summary = `Convierte las fotos HEIC tomadas con la cámara de tu iPhone a formato JPG estándar compatible con ordenadores Windows, televisores y redes sociales. El formato de alta eficiencia de Apple se transforma en imágenes JPEG nítidas sin necesidad de instalar códecs externos ni programas pesados.`;
  } else if (tool.slug === 'pdf-to-word') {
    summary = `Transforma documentos PDF en archivos Microsoft Word (.docx) 100% editables. Esta guía te muestra cómo recuperar textos, tablas, listas y diseño estructural de tus contratos o facturas PDF para editarlos libremente en Word o Google Docs con total privacidad y sin marcas de agua.`;
  } else if (tool.slug === 'jpg-to-pdf') {
    summary = `Compila una o múltiples imágenes JPG en un documento PDF ordenado y fácil de imprimir o enviar por correo electrónico. Ajusta márgenes, reordena las páginas y genera un archivo PDF ligero y profesional directamente desde tu navegador en pocos segundos.`;
  } else {
    summary = isConvert
      ? `Guía práctica para transformar archivos ${inFmt} a formato ${outFmt} de forma rápida, segura y gratuita. MediaConvert procesa tus documentos y archivos multimedia directamente en la memoria de tu navegador mediante aceleración local, garantizando privacidad absoluta y fidelidad 1:1 en el resultado.`
      : `Tutorial para optimizar y reducir el peso de archivos ${inFmt} sin perder calidad visual. Consigue transferencias más rápidas y ahorra espacio de almacenamiento con nuestro motor de compresión inteligente.`;
  }

  return {
    title: `¿Cómo usar ${tool.name}? — Tutorial y Guía Paso a Paso`,
    h1: `¿Cómo usar ${tool.name}?`,
    summary,
    readingTime: '2 min de lectura',
    whyUseThis: [
      `Conversión directa y especializada de ${inFmt} a ${outFmt}`,
      '100% privado: procesamiento en memoria RAM local sin subir datos a la nube',
      'Sin registros, marcas de agua ni límites de uso',
      'Descarga inmediata individual o en paquete .ZIP consolidado'
    ],
    stepByStep: tool.howToSteps.map(s => ({
      step: s.step,
      title: s.title,
      desc: s.instruction
    })),
    expertTip: `Para obtener el mejor resultado al convertir ${tool.name}, asegúrate de que el archivo original no esté dañado. Una vez procesado, puedes descargarlo de inmediato o guardarlo en "Mis Archivos" para acceder a él más tarde.`
  };
}

