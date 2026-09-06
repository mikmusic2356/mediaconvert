import React, { useState, useEffect } from 'react';
import { 
  Cookie, 
  ShieldCheck, 
  Sliders, 
  Check, 
  X, 
  ChevronRight,
  Info,
  Lock,
  Sparkles
} from 'lucide-react';
import { cookieConsentService } from '../services/cookieConsentService';
import { CookiePreferences } from '../types';

interface CookieBannerProps {
  onOpenPrivacyPolicy: () => void;
  onOpenCookiePolicy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  onOpenPrivacyPolicy,
  onOpenCookiePolicy
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: true,
    marketing: false,
    preferences: true
  });

  useEffect(() => {
    const consent = cookieConsentService.getUserConsent();
    if (!consent.hasAnswered) {
      // Small delay for smooth entry
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    cookieConsentService.saveConsent('all');
    setIsOpen(false);
  };

  const handleEssentialOnly = () => {
    cookieConsentService.saveConsent('essential');
    setIsOpen(false);
  };

  const handleSaveCustom = () => {
    cookieConsentService.saveConsent('custom', preferences);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-5 pointer-events-none animate-in slide-in-from-bottom-6 duration-300">
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200 pointer-events-auto ring-1 ring-slate-900/5">
        
        {!showConfig ? (
          /* Main Consent View */
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center shrink-0 shadow-xs">
                <Cookie className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Tu Privacidad & Uso de Cookies en MediaConvert
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Zero-Cloud Storage
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  Utilizamos cookies técnicas necesarias para el funcionamiento del conversor, almacenamiento local en tu navegador y análisis para mejorar la velocidad. No vendemos tus datos a intermediarios publicitarios. Puedes gestionar tus preferencias o consultar nuestra{' '}
                  <button
                    onClick={onOpenPrivacyPolicy}
                    className="text-blue-600 font-semibold underline hover:text-blue-700"
                  >
                    Política de Privacidad
                  </button>{' '}
                  y{' '}
                  <button
                    onClick={onOpenCookiePolicy}
                    className="text-blue-600 font-semibold underline hover:text-blue-700"
                  >
                    Política de Cookies
                  </button>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => setShowConfig(true)}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Configurar</span>
              </button>

              <button
                onClick={handleEssentialOnly}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Solo Necesarias
              </button>

              <button
                onClick={handleAcceptAll}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl text-xs font-black shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Aceptar Todas</span>
              </button>
            </div>
          </div>
        ) : (
          /* Detailed Category Configuration View */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Panel de Preferencias de Cookies
                </h3>
              </div>
              <button
                onClick={() => setShowConfig(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Category 1: Necesarias */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cookies Técnicas Necesarias</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Imprescindibles para procesar archivos, recordar el idioma seleccionado y mantener la seguridad local.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                  Obligatorias
                </span>
              </div>

              {/* Category 2: Analíticas */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">
                    Métricas & Rendimiento Anónimo
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Nos ayudan a conocer qué formatos son más utilizados para optimizar los algoritmos de compresión.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded mt-1 cursor-pointer"
                />
              </div>

              {/* Category 3: Preferencias */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">
                    Preferencias de Usuario
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Recuerda la calidad preferida de compresión y las configuraciones de formato predeterminado.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.preferences}
                  onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded mt-1 cursor-pointer"
                />
              </div>

              {/* Category 4: Marketing / Publicidad */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900">
                    Publicidad Contextual No Invasiva
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Permite mostrar anuncios no intrusivos que financian el mantenimiento de los servidores de forma gratuita.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded mt-1 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setShowConfig(false)}
                className="text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
              >
                ← Volver al resumen
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleEssentialOnly}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Rechazar No Esenciales
                </button>
                <button
                  onClick={handleSaveCustom}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar Mi Selección</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};