import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  HardDrive, 
  Zap, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface AuthModalProps {
  user: UserProfile;
  onLogin: (name: string, email: string) => void;
  onLogout: () => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  user,
  onLogin,
  onLogout,
  onClose,
}) => {
  const { language } = useI18n();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const defaultUserLabel = language === 'us' ? 'MediaConvert User' : language === 'fr' ? 'Utilisateur MediaConvert' : 'Usuario MediaConvert';
  const planActiveLabel = language === 'us' ? 'Active Free Plan (5 GB)' : language === 'fr' ? 'Plan Gratuit Actif (5 Go)' : 'Plan Gratuito Activo (5 GB)';
  const storageInUseLabel = language === 'us' ? 'Storage in use' : language === 'fr' ? 'Stockage utilisé' : 'Almacenamiento en uso';
  const fileSizeLimitLabel = language === 'us' ? 'Limit per file' : language === 'fr' ? 'Limite par fichier' : 'Límite por archivo';
  const upTo2gbLabel = language === 'us' ? 'Up to 2 GB' : language === 'fr' ? 'Jusqu\'à 2 Go' : 'Hasta 2 GB';
  const permanentHistoryLabel = language === 'us' ? 'Permanent history' : language === 'fr' ? 'Historique permanent' : 'Historial permanente';
  const enabledLabel = language === 'us' ? 'Enabled' : language === 'fr' ? 'Activé' : 'Activado';
  const logoutLabel = language === 'us' ? 'Sign Out' : language === 'fr' ? 'Se déconnecter' : 'Cerrar sesión';
  
  const createAccountTitle = language === 'us' ? 'Create MediaConvert Account' : language === 'fr' ? 'Créer un compte MediaConvert' : 'Crear cuenta en MediaConvert';
  const signInTitle = language === 'us' ? 'Sign In' : language === 'fr' ? 'Connexion' : 'Iniciar sesión';
  const modalSubtitle = language === 'us' ? 'Save your processed files and share them anytime.' : language === 'fr' ? 'Enregistrez vos fichiers et partagez-les à tout moment.' : 'Guarda tus archivos procesados y compártelos en cualquier momento.';
  const nameLabel = language === 'us' ? 'Name' : language === 'fr' ? 'Nom' : 'Nombre';
  const namePlaceholder = language === 'us' ? 'Your name' : language === 'fr' ? 'Votre nom' : 'Tu nombre';
  const emailLabel = language === 'us' ? 'Email address' : language === 'fr' ? 'Adresse e-mail' : 'Correo electrónico';
  const passwordLabel = language === 'us' ? 'Password' : language === 'fr' ? 'Mot de passe' : 'Contraseña';
  const registerSubmitBtn = language === 'us' ? 'Sign up for free' : language === 'fr' ? 'S\'inscrire gratuitement' : 'Registrarme gratis';
  const loginSubmitBtn = language === 'us' ? 'Access my account' : language === 'fr' ? 'Accéder à mon compte' : 'Acceder a mi cuenta';
  const switchAlreadyHaveAccount = language === 'us' ? 'Already have an account? Sign in' : language === 'fr' ? 'Vous avez déjà un compte ? Se connecter' : '¿Ya tienes cuenta? Inicia sesión';
  const switchNoAccount = language === 'us' ? 'Don\'t have an account? Sign up free (5 GB space)' : language === 'fr' ? 'Pas encore de compte ? Inscrivez-vous gratuitement (5 Go)' : '¿No tienes cuenta? Regístrate gratis (5 GB de espacio)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const finalName = name.trim() || email.split('@')[0] || defaultUserLabel;
    onLogin(finalName, email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150 border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {user.isLoggedIn ? (
          /* Profile & Account Details View */
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                <p className="text-xs text-slate-500">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {planActiveLabel}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{storageInUseLabel}</span>
                <span className="font-bold text-slate-900">18.4 MB / 5 GB</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{fileSizeLimitLabel}</span>
                <span className="font-bold text-slate-900">{upTo2gbLabel}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{permanentHistoryLabel}</span>
                <span className="font-bold text-emerald-600">{enabledLabel}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={onLogout}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {logoutLabel}
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up View */
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {isRegisterMode ? createAccountTitle : signInTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {modalSubtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isRegisterMode && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{nameLabel}</label>
                  <input
                    type="text"
                    required
                    placeholder={namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:border-blue-500 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{emailLabel}</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{passwordLabel}</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:border-blue-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>{isRegisterMode ? registerSubmitBtn : loginSubmitBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <button
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                {isRegisterMode
                  ? switchAlreadyHaveAccount
                  : switchNoAccount}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

