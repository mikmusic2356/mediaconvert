import { AdminAuthCredentials, AdminSession } from '../types';

const ADMIN_SESSION_KEY = 'mediaconvert_admin_session_v1';
const FAILED_ATTEMPTS_KEY = 'mediaconvert_admin_failed_attempts';

// Credenciales oficiales de administración del sistema
const DEFAULT_CREDENTIALS: AdminAuthCredentials = {
  username: 'admin',
  password: 'MediaConvert2026!Pro',
  accessKey: 'MC-SEC-9842-KEY'
};

export class AdminAuthService {
  private getStoredCredentials(): AdminAuthCredentials {
    try {
      const stored = localStorage.getItem('mediaconvert_admin_custom_creds');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_CREDENTIALS;
  }

  validateCredentials(creds: AdminAuthCredentials): { success: boolean; message?: string } {
    const failedAttempts = this.getFailedAttempts();
    if (failedAttempts >= 5) {
      return {
        success: false,
        message: 'Demasiados intentos fallidos. Por seguridad, el acceso está bloqueado temporalmente (15 min).'
      };
    }

    const currentCreds = this.getStoredCredentials();

    const isUserValid = creds.username.trim() === currentCreds.username;
    const isPassValid = creds.password === currentCreds.password;
    const isKeyValid = creds.accessKey.trim() === currentCreds.accessKey;

    if (!isUserValid || !isPassValid || !isKeyValid) {
      this.incrementFailedAttempts();
      const reasons: string[] = [];
      if (!isUserValid) reasons.push('Usuario incorrecto');
      if (!isPassValid) reasons.push('Contraseña incorrecta');
      if (!isKeyValid) reasons.push('Llave de acceso no válida');

      return {
        success: false,
        message: 'Acceso denegado: ' + reasons.join(', ') + '. Los 3 datos son estrictamente requeridos.'
      };
    }

    this.resetFailedAttempts();

    const session: AdminSession = {
      isAuthenticated: true,
      username: creds.username,
      loginTimestamp: Date.now(),
      token: 'adm_tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    };

    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    } catch (e) {}

    return { success: true };
  }

  getSession(): AdminSession | null {
    try {
      const rawSession = sessionStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem(ADMIN_SESSION_KEY);
      if (!rawSession) return null;
      const parsed: AdminSession = JSON.parse(rawSession);
      const MAX_AGE = 12 * 60 * 60 * 1000;
      if (Date.now() - parsed.loginTimestamp > MAX_AGE) {
        this.logout();
        return null;
      }
      return parsed;
    } catch (e) {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const session = this.getSession();
    return !!session?.isAuthenticated;
  }

  logout(): void {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (e) {}
  }

  getDefaultCredentialsInfo(): AdminAuthCredentials {
    return { ...DEFAULT_CREDENTIALS };
  }

  private getFailedAttempts(): number {
    try {
      const raw = localStorage.getItem(FAILED_ATTEMPTS_KEY);
      if (!raw) return 0;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp > 15 * 60 * 1000) {
        this.resetFailedAttempts();
        return 0;
      }
      return parsed.count || 0;
    } catch (e) {
      return 0;
    }
  }

  private incrementFailedAttempts(): void {
    try {
      const current = this.getFailedAttempts();
      localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify({ count: current + 1, timestamp: Date.now() }));
    } catch (e) {}
  }

  private resetFailedAttempts(): void {
    try {
      localStorage.removeItem(FAILED_ATTEMPTS_KEY);
    } catch (e) {}
  }
}

export const adminAuthService = new AdminAuthService();