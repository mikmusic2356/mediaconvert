export interface AdminAuthCredentials {
  username: string;
  password: string;
  accessKey: string;
}

export interface AdminSession {
  isAuthenticated: boolean;
  username: string;
  loginTimestamp: number;
  token: string;
}

export type ConsentType = 'all' | 'essential' | 'custom' | 'rejected';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export interface CookieConsentRecord {
  id: string;
  timestamp: string;
  consentType: ConsentType;
  preferences: CookiePreferences;
  userAgent: string;
  language: string;
  ipMasked?: string;
  referer?: string;
}
