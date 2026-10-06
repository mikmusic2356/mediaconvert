import React, { useEffect } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Users, 
  Globe, 
  Lock, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  FileCheck, 
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

interface AboutUsPageProps {
  onNavigate: (view: any, catFilter?: any, toolSlug?: string, categorySlug?: string) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate }) => {
  const { t, language } = useI18n();

  useEffect(() => {
    document.title = 'Sobre Nosotros — Quiénes Somos y Nuestra Misión | MediaConvert';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Conoce al equipo detrás de MediaConvert, nuestra arquitectura de procesamiento 100% privado en navegador y nuestro compromiso con la seguridad digital.'
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-12">
      {/* Hero Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 shadow-xs">
          <HeartHandshake className="w-4 h-4 text-blue-600" />
          <span>Transparencia & Privacidad Digital</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Sobre <span className="text-blue-600">MediaConvert</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Nacimos con una misión clara: ofrecer una suite de conversión y optimización multimedia rápida, moderna y 100% respetuosa con la privacidad del usuario.
        </p>
      </section>

      {/* Main Mission Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Nuestra Misión y Filosofía</h2>
            <p className="text-xs text-slate-500">¿Por qué creamos una alternativa a los conversores tradicionales?</p>
          </div>
        </div>

        <div className="prose prose-slate text-sm text-slate-600 leading-relaxed space-y-4">
          <p>
            Durante años, convertir una imagen o extraer el audio de un vídeo en internet implicaba un riesgo importante de privacidad: subir fotos personales, documentos sensibles o archivos de trabajo a servidores desconocidos en la nube, donde podían ser almacenados, analizados o expuestos a filtraciones.
          </p>
          <p>
            En <strong>MediaConvert</strong> cambiamos ese paradigma. Diseñamos un motor híbrido avanzado que ejecuta la inmensa mayoría de las conversiones <strong>directamente en la memoria RAM de tu propio navegador</strong>, utilizando tecnologías de última generación como WebAssembly, Canvas API, Web Workers y aceleración por GPU.
          </p>
          <p className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 text-blue-900 font-medium text-xs">
            🔒 <strong>Principio Zero-Knowledge:</strong> Tus archivos nunca se envían a servidores de terceros para procesamiento estándar. La transformación ocurre en tu dispositivo y desaparece de la memoria en cuanto cierras la pestaña.
          </p>
        </div>
      </section>

      {/* 3 Pilares Tecnológicos */}
      <section className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
            Arquitectura de Vanguardia
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Nuestros 3 Pilares Fundamentales
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Privacidad Absoluta</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cumplimiento estricto de los estándares RGPD / GDPR. Sin registros obligatorios, sin rastreo invasivo y sin retención de archivos personales.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Velocidad Sin Esperas</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Al procesar localmente, no tienes que esperar a que tus archivos suban a internet ni a que se descarguen de una cola remota. La conversión es prácticamente instantánea.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Calidad Editorial y Técnica</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Acompañamos cada conversor de guías técnicas detalladas, análisis de códecs y soporte continuo para mantener compatibilidad con los estándares web más recientes.
            </p>
          </div>
        </div>
      </section>

      {/* Equipo Editorial y Técnico */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Equipo & Estándares Editoriales</h2>
            <p className="text-xs text-slate-500">Profesionales dedicados a la ingeniería de software y optimización multimedia</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          MediaConvert está impulsado por un equipo multidisciplinar de ingenieros de software, diseñadores de interfaz y especialistas en optimización de rendimiento web. Nuestros redactores investigan rigurosamente cada estándar de compresión (WebP, AVIF, HEIC, H.264, Opus, MP3) para redactar tutoriales precisos y actualizados.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
              CM
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Carlos Mendoza</h4>
              <p className="text-[11px] text-blue-600 font-semibold">Diseñador UI & Optimización Visual</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Especialista en flujos gráficos y estándares WebP/PNG.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
              VR
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Valeria Ramos</h4>
              <p className="text-[11px] text-orange-600 font-semibold">Productora Multimedia & Códecs</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Investigadora en compresión de vídeo MP4, MOV y audio digital.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Navigation */}
      <section className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold">¿Tienes preguntas o sugerencias para mejorar?</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Nos encanta recibir feedback de la comunidad para añadir nuevos formatos y mejorar el rendimiento de la plataforma.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-600/20"
          >
            Contactar con el Equipo
          </button>
          <button
            onClick={() => onNavigate('tools')}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold transition-all border border-slate-700"
          >
            Explorar Herramientas
          </button>
        </div>
      </section>
    </div>
  );
};
