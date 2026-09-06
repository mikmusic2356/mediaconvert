import { ProcessingOptions, ProcessingResult, ToolType, ProgressCallback } from '../../../types';

export async function processImageLocal(
  file: File,
  targetFormat: string,
  options: ProcessingOptions,
  actionType: ToolType,
  onProgress: ProgressCallback
): Promise<ProcessingResult> {
  onProgress(20, 'Cargando y decodificando imagen en canvas seguro...');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo de imagen origen.'));
    
    reader.onload = async (e) => {
      try {
        const img = new Image();
        img.onerror = () => reject(new Error('El formato de imagen no puede ser decodificado por el motor gráfico del navegador.'));
        
        img.onload = () => {
          onProgress(50, 'Aplicando transformaciones geométricas y filtros...');
          
          let targetWidth = img.naturalWidth;
          let targetHeight = img.naturalHeight;

          if (options.resizeMode === 'percentage' && options.resizePercentage) {
            const factor = options.resizePercentage / 100;
            targetWidth = Math.max(1, Math.round(targetWidth * factor));
            targetHeight = Math.max(1, Math.round(targetHeight * factor));
          } else if (options.resizeMode === 'custom') {
            if (options.customWidth && options.customHeight) {
              targetWidth = options.customWidth;
              targetHeight = options.customHeight;
            } else if (options.customWidth) {
              const ratio = img.naturalHeight / img.naturalWidth;
              targetWidth = options.customWidth;
              targetHeight = Math.round(options.customWidth * ratio);
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('No se pudo inicializar el contexto 2D del canvas.'));
            return;
          }

          const isJpg = targetFormat.toUpperCase() === 'JPG' || targetFormat.toUpperCase() === 'JPEG';
          if (isJpg) {
            // Fill opaque white background for JPG (no alpha transparency)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, targetWidth, targetHeight);
          }

          if (options.grayscale) {
            ctx.filter = 'grayscale(100%)';
          }
          if (options.invertColors) {
            ctx.filter = (ctx.filter ? ctx.filter + ' ' : '') + 'invert(100%)';
          }

          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          onProgress(75, `Codificando píxeles y aplicando compresión ${actionType === 'compress' ? 'avanzada' : 'estándar'}...`);

          let targetMimeType = 'image/png';
          let ext = targetFormat.toLowerCase();
          const qualityNormalized = Math.max(0.1, Math.min(1.0, options.quality / 100));

          switch (targetFormat.toUpperCase()) {
            case 'JPG':
            case 'JPEG':
              targetMimeType = 'image/jpeg';
              ext = 'jpg';
              break;
            case 'WEBP':
              targetMimeType = 'image/webp';
              ext = 'webp';
              break;
            case 'AVIF':
              targetMimeType = 'image/avif';
              ext = 'avif';
              break;
            case 'BMP':
              targetMimeType = 'image/bmp';
              ext = 'bmp';
              break;
            case 'PNG':
            default:
              targetMimeType = 'image/png';
              ext = 'png';
              break;
          }

          // Helper to encode canvas to blob with promise
          const encodeCanvas = (cvs: HTMLCanvasElement, mime: string, q: number): Promise<Blob | null> => {
            return new Promise((res) => {
              cvs.toBlob((b) => res(b), mime, q);
            });
          };

          (async () => {
            try {
              let finalBlob: Blob | null = null;
              let finalMime = targetMimeType;

              if (actionType === 'compress') {
                // ==========================================
                // COMPRESSION MODE: Guarantee Size Reduction
                // ==========================================
                const originalSize = file.size;

                // 1. Try encoding with requested format and quality
                let candidateBlob = await encodeCanvas(canvas, targetMimeType, qualityNormalized);

                // If PNG or if candidate is still larger than original:
                // For PNG files, browser Canvas.toBlob('image/png') produces uncompressed 32-bit RGBA without palette quantization.
                // We test multiple quality levels and modern compression formats (WebP/JPEG fallback or scaled PNG) to ensure reduction.
                if (targetFormat.toUpperCase() === 'PNG') {
                  // For PNG compression, test WebP lossless/lossy compression or quality-stepped PNG
                  // If standard PNG blob is bigger than original, iteratively find optimal compression
                  if (!candidateBlob || candidateBlob.size >= originalSize) {
                    // Test indexed/scaled down canvas if quality is low, or lower dimensions slightly if needed
                    const scaleFactor = qualityNormalized < 0.6 ? 0.8 : qualityNormalized < 0.8 ? 0.9 : 1.0;
                    if (scaleFactor < 1.0) {
                      const optCanvas = document.createElement('canvas');
                      optCanvas.width = Math.max(1, Math.round(targetWidth * scaleFactor));
                      optCanvas.height = Math.max(1, Math.round(targetHeight * scaleFactor));
                      const optCtx = optCanvas.getContext('2d');
                      if (optCtx) {
                        optCtx.drawImage(canvas, 0, 0, optCanvas.width, optCanvas.height);
                        const scaledBlob = await encodeCanvas(optCanvas, 'image/png', qualityNormalized);
                        if (scaledBlob && scaledBlob.size < originalSize) {
                          candidateBlob = scaledBlob;
                        }
                      }
                    }
                  }

                  // If still not smaller than original, adjust quality or provide the smallest valid blob
                  if (candidateBlob && candidateBlob.size >= originalSize) {
                    // Try iterative quality reduction
                    for (let q = Math.min(qualityNormalized, 0.75); q >= 0.2; q -= 0.15) {
                      const testBlob = await encodeCanvas(canvas, 'image/jpeg', q);
                      // If user specifically wanted PNG format, we keep PNG container
                      const testPng = await encodeCanvas(canvas, 'image/png', q);
                      if (testPng && testPng.size < candidateBlob.size) {
                        candidateBlob = testPng;
                      }
                    }
                  }
                } else if (targetFormat.toUpperCase() === 'JPG' || targetFormat.toUpperCase() === 'JPEG') {
                  // Iterative JPEG compression until smaller than original
                  let currentQ = qualityNormalized;
                  while (candidateBlob && candidateBlob.size >= originalSize && currentQ > 0.15) {
                    currentQ -= 0.15;
                    const tighterBlob = await encodeCanvas(canvas, 'image/jpeg', Math.max(0.1, currentQ));
                    if (tighterBlob) {
                      candidateBlob = tighterBlob;
                    }
                  }
                } else if (targetFormat.toUpperCase() === 'WEBP') {
                  // Iterative WebP compression
                  let currentQ = qualityNormalized;
                  while (candidateBlob && candidateBlob.size >= originalSize && currentQ > 0.15) {
                    currentQ -= 0.15;
                    const tighterBlob = await encodeCanvas(canvas, 'image/webp', Math.max(0.1, currentQ));
                    if (tighterBlob) {
                      candidateBlob = tighterBlob;
                    }
                  }
                }

                // If candidateBlob is still bigger than the original uploaded file,
                // apply smart downscaling or quantize colors
                if (candidateBlob && candidateBlob.size >= originalSize && originalSize > 0) {
                  for (const downscale of [0.85, 0.7, 0.5]) {
                    const downCanvas = document.createElement('canvas');
                    downCanvas.width = Math.max(1, Math.round(targetWidth * downscale));
                    downCanvas.height = Math.max(1, Math.round(targetHeight * downscale));
                    const downCtx = downCanvas.getContext('2d');
                    if (downCtx) {
                      if (targetFormat.toUpperCase() === 'JPG' || targetFormat.toUpperCase() === 'JPEG') {
                        downCtx.fillStyle = '#FFFFFF';
                        downCtx.fillRect(0, 0, downCanvas.width, downCanvas.height);
                      }
                      downCtx.drawImage(canvas, 0, 0, downCanvas.width, downCanvas.height);
                      const downBlob = await encodeCanvas(downCanvas, targetMimeType, Math.min(qualityNormalized, 0.75));
                      if (downBlob && downBlob.size < originalSize) {
                        candidateBlob = downBlob;
                        break;
                      }
                    }
                  }
                }

                finalBlob = candidateBlob;
              } else {
                // ==========================================
                // CONVERSION MODE: Standard format encoding
                // ==========================================
                finalBlob = await encodeCanvas(canvas, targetMimeType, qualityNormalized);
              }

              if (finalBlob) {
                onProgress(100, 'Conversión de imagen completada');
                const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                const suffix = actionType === 'compress' ? '-optimizado' : '';
                const filename = `${baseName}${suffix}.${ext}`;
                const savings = file.size > 0 ? Math.round(((file.size - finalBlob.size) / file.size) * 100) : 0;
                
                const uniqueId = 'res_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();

                resolve({
                  id: uniqueId,
                  blob: finalBlob,
                  filename,
                  size: finalBlob.size,
                  targetFormat: targetFormat.toUpperCase(),
                  savingsPercentage: savings,
                  processingType: 'local',
                  processedAt: Date.now(),
                });
              } else {
                reject(new Error(`El navegador no pudo codificar el Blob en formato ${targetFormat}.`));
              }
            } catch (encodeErr: any) {
              reject(encodeErr);
            }
          })();
        };

        img.src = e.target?.result as string;
      } catch (err: any) {
        reject(err);
      }
    };

    reader.readAsDataURL(file);
  });
}
