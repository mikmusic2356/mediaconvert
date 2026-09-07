import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = 'mediaconvert.online';
const KEY = 'bdad9c2d9197485ebd55da199d97309c';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

async function main() {
  const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.error(`❌ No se encontró sitemap.xml en ${sitemapPath}`);
    process.exit(1);
  }

  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  const locRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
  const urls: string[] = [];
  let match;

  while ((match = locRegex.exec(sitemapContent)) !== null) {
    const url = match[1].trim();
    if (url.startsWith(`https://${HOST}`) || url.startsWith(`http://${HOST}`)) {
      urls.push(url);
    }
  }

  const uniqueUrls = Array.from(new Set(urls));
  console.log(`🚀 Preparando envío de ${uniqueUrls.length} URLs de ${HOST} a IndexNow (Bing / MSN)...`);

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: uniqueUrls
  };

  try {
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    console.log(`📡 Respuesta de IndexNow: HTTP ${response.status} (${response.statusText})`);

    if (response.status === 200 || response.status === 202) {
      console.log('✅ ¡Éxito! URLs enviadas correctamente a los motores de búsqueda (Bing, MSN, etc.).');
    } else {
      const text = await response.text();
      console.warn(`⚠️ Respuesta recibida: ${text || 'Sin cuerpo de respuesta'}`);
      if (response.status === 403) {
        console.warn('ℹ️ Asegúrate de que el archivo bdad9c2d9197485ebd55da199d97309c.txt esté desplegado en tu servidor.');
      }
    }
  } catch (err) {
    console.error('❌ Error al enviar a IndexNow:', err);
  }
}

main();
