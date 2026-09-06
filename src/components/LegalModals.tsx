import React from 'react';
import { X, ShieldCheck, Lock, Cookie, FileText, CheckCircle2, Globe, Database } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Política de Privacidad</h3>
              <p className="text-xs text-slate-400">Última actualización: 2026 — Compromiso Zero-Cloud</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              1. Principio Fundamental: Procesamiento Local en el Dispositivo
            </h4>
            <p>
              En <strong>MediaConvert</strong> creemos que tus archivos te pertenecen exclusivamente a ti. La gran mayoría de operaciones de conversión y compresión de imágenes, audio, metadatos y documentos se ejecutan directamente en la memoria RAM y el procesador (CPU/GPU) de tu navegador local utilizando tecnologías WebAssembly, Canvas API y Web Audio API.
            </p>
            <p className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium">
              ✓ Tus archivos no se transmiten, guardan ni analizan en servidores remotos salvo cuando solicitas expresamente un enlace de compartición temporal.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              2. Datos Recopilados y Finalidad
            </h4>
            <p>
              Solo procesamos la información estrictamente necesaria para garantizar la estabilidad técnica del servicio:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Datos técnicos anónimos:</strong> Tipo de navegador, idioma preferido y resolución de pantalla para adaptar la interfaz responsive.</li>
              <li><strong>Almacenamiento Local (LocalStorage):</strong> Registro de tus archivos guardados en "Mis Archivos" almacenados única y exclusivamente en tu dispositivo.</li>
              <li><strong>Métricas de uso agregado:</strong> Formatos seleccionados para optimizar los algoritmos de compresión sin asociarlos a identidades personales.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-orange-600" />
              3. Compartición Temporal de Archivos (/share/)
            </h4>
            <p>
              Cuando utilizas la función de "Compartir Archivo", se genera un identificador criptográfico único. Los paquetes compartidos tienen caducidad automática de 7 días y son eliminados de forma irrevocable tras su vencimiento.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              4. Cumplimiento RGPD (GDPR) y Derechos del Usuario
            </h4>
            <p>
              Tienes derecho a acceder, rectificar, suprimir o limitar el tratamiento de cualquier dato en cualquier momento. Al no retener perfiles personales en bases de datos externas, puedes eliminar todos los datos almacenados localmente con solo limpiar la memoria caché de tu navegador.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Entendido y Aceptar
          </button>
        </div>

      </div>
    </div>
  );
};

export const CookiePolicyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/30 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Política de Cookies</h3>
              <p className="text-xs text-slate-400">Guía de Cookies Técnicas & Preferencias de Usuario</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">
              ¿Qué son las Cookies y Tecnologías Similares?
            </h4>
            <p>
              Una cookie es un pequeño archivo de texto que un sitio web almacena en tu dispositivo para recordar información sobre tu visita, como tu idioma preferido (Español, Inglés, Francés), tu cola de conversión activa o tus configuraciones de compresión.
            </p>
          </section>

          <section className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900">
              Clasificación de Cookies Utilizadas en MediaConvert
            </h4>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-900 block text-xs">1. Cookies Técnicas y Estrictamente Necesarias</span>
                <p className="text-[11px] text-slate-600 mt-1">
                  Permiten la navegación fluida, la autenticación segura del panel administrativo de 3 factores (3FA), la gestión de colas de procesamiento y la selección de idioma en la URL. No requieren consentimiento previo ya que el sitio no puede funcionar sin ellas.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-900 block text-xs">2. Cookies de Preferencias y Estado</span>
                <p className="text-[11px] text-slate-600 mt-1">
                  Guardan en tu LocalStorage el historial de descargas realizadas en "Mis Archivos" y el nivel de compresión (calidad 80%, equilibrado, rápido).
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-900 block text-xs">3. Cookies Analíticas y de Rendimiento</span>
                <p className="text-[11px] text-slate-600 mt-1">
                  Miden de manera agregada y anónima la tasa de éxito de conversiones para corregir errores en tipos de archivo específicos.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">
              ¿Cómo Desactivar o Modificar las Cookies?
            </h4>
            <p>
              Puedes revocar tu consentimiento en cualquier momento abriendo el panel de cookies desde el pie de página o configurando tu navegador (Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge) para bloquear o eliminar cookies.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Cerrar y Continuar
          </button>
        </div>

      </div>
    </div>
  );
};