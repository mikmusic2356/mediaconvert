import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

interface ContactPageProps {
  onNavigate: (view: any, catFilter?: any, toolSlug?: string, categorySlug?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    document.title = 'Contacto y Soporte — MediaConvert';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Ponte en contacto con el equipo técnico de MediaConvert. Envía tus consultas, reportes de error o sugerencias para nuevas herramientas.'
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setIsSent(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-12">
      {/* Hero Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 shadow-xs">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span>Atención al Usuario & Soporte Técnico</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Ponte en <span className="text-blue-600">Contacto</span> con Nosotros
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          ¿Tienes dudas sobre una conversión, necesitas asistencia técnica o quieres sugerir un nuevo formato? Estamos aquí para ayudarte.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Canales Directos</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Correo Principal</p>
                  <a href="mailto:soporte@mediaconvert.online" className="text-blue-600 hover:underline">
                    soporte@mediaconvert.online
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Tiempo de Respuesta</p>
                  <p className="text-slate-500">Menos de 24-48 horas laborables.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Privacidad en Consultas</p>
                  <p className="text-slate-500">Tus datos nunca se comparten con terceros.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">¿Preguntas Rápidas?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consulta nuestras guías y preguntas frecuentes para resolver problemas comunes con descargas, formatos y calidades.
            </p>
            <button
              onClick={() => onNavigate('news-list')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors pt-1"
            >
              <span>Ver Guías y Artículos</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            {isSent ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">¡Mensaje Enviado con Éxito!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Gracias por escribirnos. Nuestro equipo revisará tu mensaje y te responderá a <strong>{email}</strong> lo antes posible.
                </p>
                <button
                  onClick={() => {
                    setIsSent(false);
                    setName('');
                    setEmail('');
                    setSubject('');
                    setMessage('');
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Formulario de Contacto</h3>
                  <p className="text-xs text-slate-500">Completa los campos a continuación para comunicarte con nosotros.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tu Nombre</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Juan Pérez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-slate-50/50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      placeholder="tu-email@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Asunto / Motivo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sugerencia de formato, consulta sobre compresión..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mensaje Detallado</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Explica tu duda o solicitud con el mayor detalle posible..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-slate-50/50 focus:bg-white resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <p className="text-[11px] text-slate-400">
                    Al enviar este formulario aceptas nuestra política de privacidad.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Mensaje</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
