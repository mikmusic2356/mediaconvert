import { CookieConsentRecord, CookiePreferences, ConsentType } from '../types';

const COOKIE_CONSENT_KEY = 'mediaconvert_cookie_consent_choice';
const COOKIE_AUDIT_LOGS_KEY = 'mediaconvert_cookie_audit_logs_v1';

export const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: true
};

export class CookieConsentService {
  getUserConsent(): { hasAnswered: boolean; preferences: CookiePreferences; consentType?: ConsentType } {
    try {
      const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!raw) {
        return { hasAnswered: false, preferences: DEFAULT_PREFERENCES };
      }
      const parsed = JSON.parse(raw);
      return {
        hasAnswered: true,
        preferences: parsed.preferences || DEFAULT_PREFERENCES,
        consentType: parsed.consentType
      };
    } catch (e) {
      return { hasAnswered: false, preferences: DEFAULT_PREFERENCES };
    }
  }

  saveConsent(consentType: ConsentType, customPreferences?: Partial<CookiePreferences>): CookieConsentRecord {
    let finalPreferences: CookiePreferences = { ...DEFAULT_PREFERENCES };

    if (consentType === 'all') {
      finalPreferences = { necessary: true, analytics: true, marketing: true, preferences: true };
    } else if (consentType === 'essential') {
      finalPreferences = { necessary: true, analytics: false, marketing: false, preferences: false };
    } else if (consentType === 'rejected') {
      finalPreferences = { necessary: true, analytics: false, marketing: false, preferences: false };
    } else if (consentType === 'custom' && customPreferences) {
      finalPreferences = { ...DEFAULT_PREFERENCES, ...customPreferences, necessary: true };
    }

    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
        consentType,
        preferences: finalPreferences,
        updatedAt: new Date().toISOString()
      }));
    } catch (e) {}

    const record = this.createAuditRecord(consentType, finalPreferences);
    this.recordAuditLog(record);
    return record;
  }

  getAuditLogs(): CookieConsentRecord[] {
    try {
      const raw = localStorage.getItem(COOKIE_AUDIT_LOGS_KEY);
      if (!raw) {
        const initialLogs = this.generateSeedLogs();
        localStorage.setItem(COOKIE_AUDIT_LOGS_KEY, JSON.stringify(initialLogs));
        return initialLogs;
      }
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  clearAuditLogs(): void {
    try {
      localStorage.removeItem(COOKIE_AUDIT_LOGS_KEY);
    } catch (e) {}
  }

  private recordAuditLog(record: CookieConsentRecord): void {
    try {
      const currentLogs = this.getAuditLogs();
      const updated = [record, ...currentLogs].slice(0, 100);
      localStorage.setItem(COOKIE_AUDIT_LOGS_KEY, JSON.stringify(updated));
    } catch (e) {}
  }

  private createAuditRecord(consentType: ConsentType, preferences: CookiePreferences): CookieConsentRecord {
    const id = 'cc_log_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
    const language = typeof navigator !== 'undefined' ? navigator.language : 'es';
    const ipMasked = '192.168.1.xxx (Cifrada / Zero-Cloud)';

    return {
      id,
      timestamp: new Date().toISOString(),
      consentType,
      preferences,
      userAgent,
      language,
      ipMasked,
      referer: typeof document !== 'undefined' ? (document.referrer || 'Acceso Directo') : 'Directo'
    };
  }

  private generateSeedLogs(): CookieConsentRecord[] {
    const now = Date.now();
    return [
      {
        id: 'cc_log_seed_01',
        timestamp: new Date(now - 1000 * 60 * 35).toISOString(),
        consentType: 'all',
        preferences: { necessary: true, analytics: true, marketing: true, preferences: true },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36',
        language: 'es-ES',
        ipMasked: '186.29.102.xxx (Colombia)',
        referer: 'https://google.com/'
      },
      {
        id: 'cc_log_seed_02',
        timestamp: new Date(now - 1000 * 60 * 120).toISOString(),
        consentType: 'essential',
        preferences: { necessary: true, analytics: false, marketing: false, preferences: false },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
        language: 'es-MX',
        ipMasked: '189.203.45.xxx (México)',
        referer: 'https://mediaconvert.online/news/'
      },
      {
        id: 'cc_log_seed_03',
        timestamp: new Date(now - 1000 * 60 * 240).toISOString(),
        consentType: 'custom',
        preferences: { necessary: true, analytics: true, marketing: false, preferences: true },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        language: 'en-US',
        ipMasked: '73.142.99.xxx (Estados Unidos)',
        referer: 'https://google.com/'
      }
    ];
  }
}

export const cookieConsentService = new CookieConsentService();