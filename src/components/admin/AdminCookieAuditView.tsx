import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  Cookie, 
  Search, 
  Download, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  Clock, 
  Globe, 
  Laptop, 
  Smartphone,
  Lock,
  Filter,
  FileSpreadsheet
} from 'lucide-react';
import { CookieConsentRecord } from '../../types';
import { cookieConsentService } from '../../services/cookieConsentService';

export const AdminCookieAuditView: React.FC = () => {
  const [logs, setLogs] = useState<CookieConsentRecord[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    setLogs(cookieConsentService.getAuditLogs());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearLogs = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el registro de auditoría de cookies?')) {
      cookieConsentService.clearAuditLogs();
      loadLogs();
      showToast('Registro de auditoría vaciado.');
    }
  };

  const handleExportCSV = () => {
    if (logs.length === 0) {
      alert('No hay registros para exportar.');
      return;
    }

    const headers = ['ID', 'Fecha y Hora', 'Decisión', 'Necesarias', 'Analíticas', 'Marketing', 'Preferencias', 'Idioma', 'IP/Ubicación', 'User-Agent', 'Referencia'];
    const rows = logs.map(l => [
      l.id,
      l.timestamp,
      l.consentType,
      l.preferences.necessary ? 'SÍ' : 'NO',
      l.preferences.analytics ? 'SÍ' : 'NO',
      l.preferences.marketing ? 'SÍ' : 'NO',
      l.preferences.preferences ? 'SÍ' : 'NO',
      l.language,
      `"${l.ipMasked || 'N/A'}"`,
      `"${l.userAgent.replace(/"/g, '""')}"`,
      `"${l.referer || 'Directo'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mediaconvert_cookie_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Informe CSV de auditoría descargado.');
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(item => {
      const matchType = filterType === 'all' || item.consentType === filterType;
      const q = searchQuery.toLowerCase();
      const matchQuery = 
        item.id.toLowerCase().includes(q) ||
        item.language.toLowerCase().includes(q) ||
        (item.ipMasked && item.ipMasked.toLowerCase().includes(q)) ||
        item.userAgent.toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [logs, filterType, searchQuery]);

  // Statistics calculation
  const total = logs.length;
  const acceptedAll = logs.filter(l => l.consentType === 'all').length;
  const essentialOnly = logs.filter(l => l.consentType === 'essential' || l.consentType === 'rejected').length;
  const custom = logs.filter(l => l.consentType === 'custom').length;

  const pctAll = total > 0 ? Math.round((acceptedAll / total) * 100) : 0;
  const pctEssential = total > 0 ? Math.round((essentialOnly / total) * 100) : 0;
  const pctCustom = total > 0 ? Math.round((custom / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold mb-2 border border-orange-500/30">
              <Shield className="w-3.5 h-3.5 text-orange-400" />
              <span>RGPD / CCPA Compliance & Privacy Audit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Control de Seguridad y Registro de Cookies
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Monitoreo y trazabilidad en tiempo real de los consentimientos otorgados por los usuarios. Los datos se procesan con IP anonimizada bajo directivas de privacidad estricta.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={loadLogs}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              title="Recargar registros"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleClearLogs}
              className="p-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
              title="Vaciar registros"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Decisiones</span>
            <Cookie className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{total}</p>
          <span className="text-[10px] text-slate-400 font-medium">Registros capturados</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200/70 bg-emerald-50/20 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold">
            <span>Aceptadas Todas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-800 mt-2">{acceptedAll}</p>
          <span className="text-[10px] text-emerald-600 font-bold">{pctAll}% del total</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/70 bg-amber-50/20 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 text-xs font-bold">
            <span>Solo Esenciales</span>
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-800 mt-2">{essentialOnly}</p>
          <span className="text-[10px] text-amber-600 font-bold">{pctEssential}% del total</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200/70 bg-blue-50/20 shadow-xs">
          <div className="flex items-center justify-between text-blue-700 text-xs font-bold">
            <span>Personalizadas</span>
            <Sliders className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-800 mt-2">{custom}</p>
          <span className="text-[10px] text-blue-600 font-bold">{pctCustom}% del total</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por ID, idioma, IP o navegador..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrar:</span>
          </span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-orange-500"
          >
            <option value="all">Todas las decisiones</option>
            <option value="all">✅ Aceptadas completas (all)</option>
            <option value="essential">🔒 Solo necesarias (essential)</option>
            <option value="custom">⚙️ Personalizadas (custom)</option>
            <option value="rejected">❌ Rechazadas (rejected)</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Fecha & Hora</th>
                <th className="py-3.5 px-4">Decisión</th>
                <th className="py-3.5 px-4">Categorías Autorizadas</th>
                <th className="py-3.5 px-4">Ubicación / IP Anonimizada</th>
                <th className="py-3.5 px-4">Dispositivo & Navegador</th>
                <th className="py-3.5 px-4">Referencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No se encontraron registros de consentimiento de cookies con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isMobile = /mobile|iphone|android/i.test(log.userAgent);
                  const isChrome = /chrome/i.test(log.userAgent);
                  const isSafari = /safari/i.test(log.userAgent) && !isChrome;
                  const isFirefox = /firefox/i.test(log.userAgent);

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Timestamp */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">
                          {new Date(log.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString('es-ES')}
                        </div>
                      </td>

                      {/* Decision Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {log.consentType === 'all' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Aceptadas Todas
                          </span>
                        )}
                        {(log.consentType === 'essential' || log.consentType === 'rejected') && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Lock className="w-3 h-3" />
                            Solo Necesarias
                          </span>
                        )}
                        {log.consentType === 'custom' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Sliders className="w-3 h-3" />
                            Personalizado
                          </span>
                        )}
                      </td>

                      {/* Categories Enabled */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-semibold text-slate-700">
                            Necesarias: Sí
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            log.preferences.analytics ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                          }`}>
                            Analíticas: {log.preferences.analytics ? 'Sí' : 'No'}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            log.preferences.marketing ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-400'
                          }`}>
                            Marketing: {log.preferences.marketing ? 'Sí' : 'No'}
                          </span>
                        </div>
                      </td>

                      {/* IP Masked */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
                          <Globe className="w-3 h-3 text-slate-400" />
                          <span>{log.ipMasked || '192.168.1.xxx'}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Idioma: {log.language}</span>
                      </td>

                      {/* User Agent */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-800 truncate">
                          {isMobile ? <Smartphone className="w-3.5 h-3.5 text-orange-500 shrink-0" /> : <Laptop className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                          <span>{isChrome ? 'Google Chrome' : isSafari ? 'Apple Safari' : isFirefox ? 'Mozilla Firefox' : 'Navegador Web'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate font-mono" title={log.userAgent}>
                          {log.userAgent}
                        </div>
                      </td>

                      {/* Referrer */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                        {log.referer || 'Directo'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};