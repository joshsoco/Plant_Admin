import type { LoginCredentials, AuthResponse, TokenData } from '../models/auth.types';

class AuthService {
  private baseUrl: string;
  private tokenRefreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
  }

  // ✅ LOGIN
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      console.log('✅ Login response:', data);

      const tokenData: TokenData = {
        accessToken: data.access || data.token || '',
        refreshToken: data.refresh || '',
        user: data.user || null,
        issuedAt: Date.now(),
        expiresIn: 3600,
      };

      this.setTokenData(tokenData);
      this.scheduleTokenRefresh(tokenData.expiresIn * 1000);

      return {
        user: tokenData.user,
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expiresIn: tokenData.expiresIn,
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  // ✅ REGISTER
  async register(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Register error:', error);
      throw error;
    }
  }

  // ✅ LOGOUT
  async logout(): Promise<void> {
    try {
      const tokenData = this.getTokenData();
      if (tokenData?.accessToken) {
        await fetch(`${this.baseUrl}/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenData.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearAllTokens();
      if (this.tokenRefreshTimer) {
        clearTimeout(this.tokenRefreshTimer);
        this.tokenRefreshTimer = null;
      }
    }
  }

  // ✅ TOKEN HANDLING
  private clearAllTokens(): void {
    ['auth_token_data', 'tokenData', 'userData', 'accessToken', 'refreshToken'].forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  private setTokenData(tokenData: TokenData): void {
    localStorage.setItem('auth_token_data', JSON.stringify(tokenData));
  }

  getTokenData(): TokenData | null {
    try {
      const data = localStorage.getItem('auth_token_data') || sessionStorage.getItem('auth_token_data');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  getAccessToken(): string | null {
    return this.getTokenData()?.accessToken || null;
  }

  isAuthenticated(): boolean {
    const tokenData = this.getTokenData();
    if (!tokenData?.accessToken) return false;
    const now = Date.now();
    const tokenAge = (now - tokenData.issuedAt) / 1000;
    return tokenAge < tokenData.expiresIn;
  }

  private scheduleTokenRefresh(expiresInMs: number): void {
    if (this.tokenRefreshTimer) clearTimeout(this.tokenRefreshTimer);

    const refreshTime = Math.max(expiresInMs - 300000, 30000);
    this.tokenRefreshTimer = setTimeout(async () => {
      try {
        await this.refreshToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.clearAllTokens();
      }
    }, refreshTime);
  }

  private async refreshToken(): Promise<void> {
    const tokenData = this.getTokenData();
    if (!tokenData?.refreshToken) throw new Error('No refresh token available');

    const response = await fetch(`${this.baseUrl}/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: tokenData.refreshToken }),
    });

    if (!response.ok) throw new Error('Token refresh failed');

    const data = await response.json();
    const newTokenData: TokenData = {
      ...tokenData,
      accessToken: data.access,
      issuedAt: Date.now(),
    };

    this.setTokenData(newTokenData);
    this.scheduleTokenRefresh(newTokenData.expiresIn * 1000);
  }

  // ✅ Password reset features (if supported later)
  async forgotPassword(email: string) {
    return fetch(`${this.baseUrl}/forgot-password/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).then(res => res.json());
  }

  async verifyOtp(email: string, otp: string) {
    return fetch(`${this.baseUrl}/verify-reset-code/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: otp }),
    }).then(res => res.json());
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    return fetch(`${this.baseUrl}/reset-password/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, password: newPassword }),
    }).then(res => res.json());
  }
}

export const authService = new AuthService();
