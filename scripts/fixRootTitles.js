import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/toolsConfig.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Fix tool root title properties
content = content.replace(/title:\s*'(JPG a PNG|PNG a JPG|PNG a SVG|HEIC a JPG|HEIC a PNG|PDF a JPG|PDF a EPUB|EPUB a PDF|HEIC a PDF|JPG a PDF|Video a GIF|APNG a GIF|GIF a MP4|GIF a APNG|MOV a GIF|PNG|WebP|Audio MP3|Vídeo MP4|Archivos PDF|Archivo ZIP)\s+Online Gratis'/g, (m, p1) => {
  if (p1.startsWith('PNG') || p1.startsWith('WebP') || p1.startsWith('Audio') || p1.startsWith('Vídeo') || p1.startsWith('Archivos')) {
    return `title: 'Comprimir ${p1} Online Gratis | MediaConvert'`;
  }
  if (p1.startsWith('Archivo ZIP')) {
    return `title: 'Crear ${p1} Online Gratis | MediaConvert'`;
  }
  return `title: 'Convertir ${p1} Online Gratis | MediaConvert'`;
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed root titles cleanly!');
