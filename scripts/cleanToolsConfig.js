import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/toolsConfig.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Fix "Online Online Gratis"
content = content.replace(/Online Online Gratis/g, 'Online Gratis');

// 2. Fix inner section titles in whatIsFrom and whatIsTo
// e.g. title: 'Convertir ¿Qué es el formato JPG? Gratis | MediaConvert' -> title: '¿Qué es el formato JPG?'
content = content.replace(/title:\s*['"]Convertir\s+¿Qué es el formato ([^?]+)\?\s*Gratis\s*\|\s*MediaConvert['"]/g, "title: '¿Qué es el formato $1?'");
content = content.replace(/title:\s*['"]Comprimir\s+¿Qué es el formato ([^?]+)\?\s*Gratis\s*\|\s*MediaConvert['"]/g, "title: '¿Qué es el formato $1?'");

// 3. Fix inner points titles: 'Convertir Some Title | MediaConvert' -> 'Some Title'
content = content.replace(/title:\s*['"]Convertir\s+(.+?)\s*\|\s*MediaConvert['"]/g, (match, p1) => {
  // If p1 already starts with '¿Qué', keep it clean
  return `title: '${p1.trim()}'`;
});

// 4. Fix any other stray ' | MediaConvert' inside whatIsFrom/whatIsTo
content = content.replace(/title:\s*['"]¿Qué es el formato (.+?)\?\s*Gratis\s*\|\s*MediaConvert['"]/g, "title: '¿Qué es el formato $1?'");

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully cleaned toolsConfig.ts!');
