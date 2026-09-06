import { ProcessingOptions, ProcessingResult, ToolType, ProgressCallback } from '../../../types';

export async function processDocumentLocal(
  file: File,
  targetFormat: string,
  options: ProcessingOptions,
  _actionType: ToolType,
  onProgress: ProgressCallback
): Promise<ProcessingResult> {
  onProgress(30, 'Leyendo datos del archivo estructurado...');
  const text = await file.text();
  const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const target = targetFormat.toUpperCase();
  const uniqueId = 'res_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();

  onProgress(60, `Procesando y transformando a formato ${target}...`);

  // 1. CSV to JSON
  if (target === 'JSON' && (file.name.toLowerCase().endsWith('.csv') || file.type.includes('csv'))) {
    const lines = text.split(/\r\n|\n/).filter((line) => line.trim().length > 0);
    if (lines.length === 0) throw new Error('El archivo CSV está vacío.');
    
    const delimiter = options.csvDelimiter || ',';
    const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ''));

    const jsonResult = lines.slice(1).map((line) => {
      const values = line.split(delimiter).map((v) => v.trim().replace(/^["']|["']$/g, ''));
      const obj: Record<string, string> = {};
      headers.forEach((header, i) => {
        obj[header || `col_${i + 1}`] = values[i] ?? '';
      });
      return obj;
    });

    const outputString =
      options.indentJson !== false ? JSON.stringify(jsonResult, null, 2) : JSON.stringify(jsonResult);
    const blob = new Blob([outputString], { type: 'application/json;charset=utf-8' });
    onProgress(100, 'JSON generado con éxito');
    
    return {
      id: uniqueId,
      blob,
      filename: `${baseName}.json`,
      size: blob.size,
      targetFormat: 'JSON',
      savingsPercentage: file.size > 0 ? Math.round(((file.size - blob.size) / file.size) * 100) : 0,
      processingType: 'local',
      processedAt: Date.now(),
    };
  }

  // 2. JSON to CSV
  if (target === 'CSV' && (file.name.toLowerCase().endsWith('.json') || file.type.includes('json'))) {
    try {
      const parsed = JSON.parse(text);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      if (items.length === 0) throw new Error('El archivo JSON no contiene registros a convertir.');

      const allKeys = Array.from(
        new Set(
          items.flatMap((item) =>
            typeof item === 'object' && item !== null ? Object.keys(item) : ['valor']
          )
        )
      );

      const csvRows = [
        allKeys.join(','),
        ...items.map((item) => {
          if (typeof item === 'object' && item !== null) {
            return allKeys
              .map((k) => {
                const val = item[k] ?? '';
                const strVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
                return `"${strVal.replace(/"/g, '""')}"`;
              })
              .join(',');
          }
          return `"${String(item).replace(/"/g, '""')}"`;
        }),
      ];

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8' });
      onProgress(100, 'CSV exportado');
      
      return {
        id: uniqueId,
        blob,
        filename: `${baseName}.csv`,
        size: blob.size,
        targetFormat: 'CSV',
        savingsPercentage: file.size > 0 ? Math.round(((file.size - blob.size) / file.size) * 100) : 0,
        processingType: 'local',
        processedAt: Date.now(),
      };
    } catch (e: any) {
      throw new Error('El archivo no contiene un JSON válido: ' + e.message);
    }
  }

  // 3. Markdown to HTML
  if (
    target === 'HTML' &&
    (file.name.toLowerCase().endsWith('.md') || file.name.toLowerCase().endsWith('.markdown'))
  ) {
    const html = text
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .replace(/\n$/gim, '<br />');

    const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${baseName}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.6; color: #1e293b; }
    h1, h2, h3 { color: #0f172a; margin-top: 1.5em; }
    code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
    blockquote { border-left: 4px solid #3b82f6; padding-left: 16px; margin: 16px 0; color: #475569; }
  </style>
</head>
<body>
${html}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    onProgress(100, 'HTML generado con estilos responsivos');

    return {
      id: uniqueId,
      blob,
      filename: `${baseName}.html`,
      size: blob.size,
      targetFormat: 'HTML',
      savingsPercentage: 0,
      processingType: 'local',
      processedAt: Date.now(),
    };
  }

  // 4. TXT to PDF / formatted text
  if (target === 'TXT' || target === 'MD') {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    onProgress(100, 'Texto estructurado generado');
    return {
      id: uniqueId,
      blob,
      filename: `${baseName}.${target.toLowerCase()}`,
      size: blob.size,
      targetFormat: target,
      processingType: 'local',
      processedAt: Date.now(),
    };
  }

  // If the document conversion is not supported locally (e.g. DOCX to PDF, PPTX, etc.)
  // Never fake the conversion! Throw explicit descriptive error so the platform remains honest.
  throw new Error(
    `La conversión de ${file.name} a ${targetFormat} requiere motor de servidor dedicado que no está habilitado para ejecución local.`
  );
}
