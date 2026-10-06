import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Cookie, 
  FileText, 
  CheckCircle2, 
  Globe, 
  Database,
  ArrowRight
} from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

interface LegalPageProps {
  initialTab?: 'privacy' | 'terms' | 'cookies';
  onNavigate: (view: any, catFilter?: any, toolSlug?: string, categorySlug?: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'privacy', onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (activeTab === 'privacy') {
      document.title = 'Política de Privacidad — MediaConvert';
    } else if (activeTab === 'terms') {
      document.title = 'Términos de Servicio y Uso — MediaConvert';
    } else {
      document.title = 'Política de Cookies — MediaConvert';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-md mx-auto">
        <button
          onClick={() => {
            setActiveTab('privacy');
            window.history.pushState({}, '', '/privacy');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'privacy'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Privacidad
        </button>
        <button
          onClick={() => {
            setActiveTab('terms');
            window.history.pushState({}, '', '/terms');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'terms'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Términos de Uso
        </button>
        <button
          onClick={() => {
            setActiveTab('cookies');
            window.history.pushState({}, '', '/cookies');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cookies'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cookies
        </button>
      </div>

      {/* Main Document Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm leading-relaxed">
        {activeTab === 'privacy' && (
          <div className="space-y-6 text-xs sm:text-sm text-slate-700">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                Marco Legal y Protección de Datos
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Política de Privacidad
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Última actualización: 2026 — Compromiso de Procesamiento Local y Privacidad por Diseño
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                1. Principio Fundamental: Procesamiento Local en el Navegador
              </h2>
              <p>
                En <strong>MediaConvert</strong> (accesible en https://mediaconvert.online), la privacidad no es una opción secundaria, sino la base de nuestra arquitectura. La inmensa mayoría de las herramientas de conversión de imágenes, audio, metadatos y compresión se ejecutan <strong>directamente en la memoria de tu dispositivo</strong> mediante tecnologías cliente como WebAssembly, Canvas API y Web Audio API.
              </p>
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl font-medium text-xs">
                ✓ <strong>Tus archivos nunca se transfieren a la nube</strong> ni se almacenan en servidores remotos para operaciones locales estándar.
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                2. Datos Técnicos Recopilados
              </h2>
              <p>
                Solo recopilamos información técnica anónima indispensable para el funcionamiento de la web:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs">
                <li><strong>Métricas de rendimiento y errores:</strong> Datos técnicos agregados (tipo de navegador, sistema operativo y resolución de pantalla) para optimizar la interfaz responsive.</li>
                <li><strong>Almacenamiento Local (LocalStorage):</strong> Tu biblioteca de "Mis Archivos" se guarda únicamente en tu navegador y nunca sale de tu equipo.</li>
                <li><strong>Cookies analíticas y publicitarias:</strong> Empleamos servicios de terceros como Google AdSense para financiar el servicio de forma gratuita. Consulta la pestaña de Cookies para más detalles.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-600" />
                3. Enlaces Compartidos Temporales (/share/)
              </h2>
              <p>
                Si utilizas la función voluntaria de "Compartir Archivos", los archivos se alojan de forma cifrada con caducidad automática y se eliminan permanentemente del servidor tras finalizar su ciclo de retención.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                4. Derechos del Usuario (RGPD / GDPR / CCPA)
              </h2>
              <p>
                Tienes derecho a acceder, rectificar o eliminar cualquier dato relacionado con tu uso de la plataforma. Para cualquier solicitud formal o consulta sobre privacidad, puedes escribirnos a <strong>soporte@mediaconvert.online</strong>.
              </p>
            </section>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-6 text-xs sm:text-sm text-slate-700">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                Condiciones de Uso
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Términos de Servicio
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Última actualización: 2026 — Normas de Uso Aceptable
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">1. Aceptación de los Términos</h2>
              <p>
                Al acceder y utilizar MediaConvert, aceptas cumplir con estos Términos de Servicio y todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguna de estas condiciones, te solicitamos no utilizar la plataforma.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">2. Uso Permitido y Responsabilidad del Usuario</h2>
              <p>
                MediaConvert se proporciona como una herramienta para la conversión, compresión y optimización de archivos de los cuales posees los derechos legítimos de uso, modificación y distribución.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs">
                <li>Queda estrictamente prohibido utilizar el servicio para procesar material ilícito, virus, software malicioso o contenidos que infrinjan los derechos de autor de terceros.</li>
                <li>El usuario asume la total responsabilidad sobre el contenido de los archivos procesados.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">3. Disponibilidad y Garantías</h2>
              <p>
                El servicio se ofrece "tal cual" y "según disponibilidad". Aunque nos esforzamos por garantizar una disponibilidad del 99.9% y la máxima fidelidad en cada conversión, MediaConvert no se hace responsable de posibles pérdidas de datos derivadas del mal uso del software o fallos de conexión del usuario.
              </p>
            </section>
          </div>
        )}

        {activeTab === 'cookies' && (
          <div className="space-y-6 text-xs sm:text-sm text-slate-700">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                Transparencia de Rastreo
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Política de Cookies
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Información sobre cookies técnicas, analíticas y publicitarias
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Cookie className="w-4 h-4 text-amber-600" />
                1. ¿Qué son las cookies y cómo las usamos?
              </h2>
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo al visitar sitios web. En MediaConvert las utilizamos para recordar tus preferencias de idioma, mantener tu configuración y analizar el rendimiento del servicio.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">2. Tipos de cookies utilizadas</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="text-xs font-bold text-slate-900">Cookies Técnicas Necesarias</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Permiten la navegación fluida, la selección de idioma y el funcionamiento de la cola de procesamiento. No pueden desactivarse.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="text-xs font-bold text-slate-900">Cookies Publicitarias de Google (AdSense)</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Google utiliza cookies (como la cookie de DoubleClick) para publicar anuncios basados en las visitas previas de los usuarios a este u otros sitios web. Los usuarios pueden inhabilitar la publicidad personalizada en la Configuración de Anuncios de Google.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">3. Cómo gestionar o desactivar cookies</h2>
              <p>
                Puedes configurar tu navegador en cualquier momento para bloquear o alertar sobre la presencia de cookies. Ten en cuenta que si bloqueas las cookies técnicas necesarias, algunas funciones del conversor podrían no responder adecuadamente.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
