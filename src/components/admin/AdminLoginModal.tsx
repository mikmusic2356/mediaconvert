import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Key, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight
} from 'lucide-react';
import { adminAuthService } from '../../services/adminAuthService';

interface AdminLoginModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessKey, setAccessKey] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password || !accessKey.trim()) {
      setErrorMessage('Los 3 campos (Usuario, Contraseña y Llave de Acceso) son estrictamente obligatorios.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = adminAuthService.validateCredentials({
        username: username.trim(),
        password,
        accessKey: accessKey.trim()
      });

      setIsLoading(false);

      if (result.success) {
        onSuccess();
      } else {
        setErrorMessage(result.message || 'Credenciales no autorizadas.');
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-indigo-600 to-blue-600" />

        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-orange-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-slate-950/20 border border-slate-800">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-orange-50 text-orange-700 border border-orange-200 mb-1.5">
            <Lock className="w-3 h-3" />
            Autenticación de 3 Factores (3FA)
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Panel Administrativo Blog & CMS
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            Para acceder debes proporcionar usuario, contraseña y la llave de seguridad criptográfica asignada.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <div className="leading-relaxed font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Factor 1: Usuario */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Nombre de Usuario
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Factor 2: Contraseña */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              2. Contraseña del Sistema
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Factor 3: Llave de Acceso (Security Access Key) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>3. Llave de Acceso de Seguridad (PIN / Key)</span>
              <span className="text-[10px] text-orange-600 font-black tracking-normal">REQUERIDO</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-500">
                <Key className="w-4 h-4" />
              </div>
              <input
                type={showAccessKey ? 'text' : 'password'}
                required
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Ingresa tu llave de acceso"
                className="w-full pl-10 pr-10 py-2.5 bg-orange-50/40 border border-orange-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-orange-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowAccessKey(!showAccessKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                {showAccessKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 space-y-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 hover:from-orange-600 hover:to-red-700 active:scale-98 text-white rounded-xl text-xs font-black shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Verificando 3 factores...' : 'Verificar y Acceder al Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar y volver al sitio
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};