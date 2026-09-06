import { ProcessingResult, ProgressCallback } from '../../../types';

export async function processAudioToWavLocal(
  file: File,
  onProgress: ProgressCallback
): Promise<ProcessingResult> {
  onProgress(20, 'Decodificando señal digital de audio mediante Web Audio API...');
  const arrayBuffer = await file.arrayBuffer();

  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error('El navegador no cuenta con soporte nativo de Web Audio API.');
  }

  const audioCtx = new AudioContextClass();
  let audioBuffer: AudioBuffer;
  try {
    audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  } catch (err: any) {
    audioCtx.close();
    throw new Error('No se pudo decodificar el archivo de audio. Verifique que no esté dañado.');
  }

  onProgress(60, 'Codificando muestras PCM lineales a formato WAV 16-bit...');
  const wavBlob = audioBufferToWavBlob(audioBuffer);
  audioCtx.close();

  onProgress(100, 'Audio WAV sin pérdidas generado con éxito');
  const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
  const uniqueId = 'res_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();

  return {
    id: uniqueId,
    blob: wavBlob,
    filename: `${baseName}.wav`,
    size: wavBlob.size,
    targetFormat: 'WAV',
    processingType: 'local',
    processedAt: Date.now(),
  };
}

function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));
  const channels: Float32Array[] = [];
  const sampleRate = buffer.sampleRate;
  let offset = 0;
  let pos = 0;

  function writeString(str: string) {
    for (let i = 0; i < str.length; i++) {
      out.setUint8(pos++, str.charCodeAt(i));
    }
  }

  function set16(data: number) {
    out.setUint16(pos, data, true);
    pos += 2;
  }

  function set32(data: number) {
    out.setUint32(pos, data, true);
    pos += 4;
  }

  // RIFF identifier
  writeString('RIFF');
  set32(length - 8);
  writeString('WAVE');
  // format chunk identifier
  writeString('fmt ');
  set32(16); // subchunk1size (16 for PCM)
  set16(1); // PCM format
  set16(numOfChan);
  set32(sampleRate);
  set32(sampleRate * 2 * numOfChan); // byte rate
  set16(numOfChan * 2); // block align
  set16(16); // bits per sample
  // data chunk identifier
  writeString('data');
  set32(length - pos - 4);

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (offset < buffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      out.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([out], { type: 'audio/wav' });
}
