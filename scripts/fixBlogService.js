import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/services/blogService.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace truncated titles and SEO titles
const replacements = [
  {
    from: "title: 'tus vídeos pesan MÁS: Cómo REDUCIRLOS GR'",
    to: "title: 'Por qué tus vídeos pesan más y cómo reducirlos gratis'"
  },
  {
    from: "seoTitle: 'En  tus Vídeos Pesan MÁS:  Reducirlos GRAT | MediaConvert'",
    to: "seoTitle: 'Cómo Reducir y Comprimir Vídeos en 2026 Gratis | MediaConvert'"
  },
  {
    from: "title: 'El AUDIO está cambiando: Cómo CONVERTIRL'",
    to: "title: 'El formato de audio está cambiando: cómo convertirlo gratis'"
  },
  {
    from: "seoTitle: 'El AUDIO está Cambiando en : Cómo Converti | MediaConvert'",
    to: "seoTitle: 'Cómo Convertir Formatos de Audio Digital en 2026 | MediaConvert'"
  },
  {
    from: "seoTitle: '¿El MP3 Sigue Siendo Útil en ? Convierte t | MediaConvert'",
    to: "seoTitle: '¿El MP3 Sigue Siendo Útil en 2026? Guía y Conversión | MediaConvert'"
  },
  {
    from: "title: 'puedes SACAR MÁS de tus vídeos: conviert'",
    to: "title: 'Cómo sacar más provecho de tus vídeos convirtiendo su audio'"
  },
  {
    from: "seoTitle: 'Este  Saca MÁS de tus Vídeos: Convierte su | MediaConvert'",
    to: "seoTitle: 'Saca Más de tus Vídeos: Extrae Audio a MP3 Gratis | MediaConvert'"
  },
  {
    from: "seoTitle: 'MP3 vs OGG en : Cómo Cambiar de Formato GR | MediaConvert'",
    to: "seoTitle: 'MP3 vs OGG Vorbis: Guía Técnica y Conversión Gratis | MediaConvert'"
  },
  {
    from: "seoTitle: 'Cómo Convertir MP4 a MP3 Online Gratis (32 | MediaConvert'",
    to: "seoTitle: 'Cómo Convertir MP4 a MP3 Online en 320 kbps | MediaConvert'"
  },
  {
    from: "seoTitle: 'Cómo Convertir PDF a Word DOCX Editable Gr | MediaConvert'",
    to: "seoTitle: 'Cómo Convertir PDF a Word DOCX Editable Gratis | MediaConvert'"
  },
  {
    from: 'title: "Tus imágenes pesan MÁS: Cómo CAMBIAR su"',
    to: 'title: "Por qué tus imágenes pesan más y cómo cambiar su formato gratis"'
  },
  {
    from: 'seoTitle: "Tus imágenes pesan MÁS: Cómo CAMBIAR su | MediaConvert"',
    to: 'seoTitle: "Tus imágenes pesan más: cómo cambiar formato gratis | MediaConvert"'
  }
];

replacements.forEach(r => {
  content = content.replace(r.from, r.to);
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed blogService titles successfully!');
