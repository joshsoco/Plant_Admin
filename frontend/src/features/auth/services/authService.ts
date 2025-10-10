import type { LoginCredentials, AuthResponse, TokenData } from '../models/auth.types';

class AuthService {
  private baseUrl: string;
  private tokenRefreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      
      // Store token data consistently
      const tokenData: TokenData = {
        accessToken: data.access,
        refreshToken: data.refresh,
        user: data.user,
        issuedAt: Date.now(),
        expiresIn: 3600 // 1 hour in seconds
      };

      this.setTokenData(tokenData);
      this.scheduleTokenRefresh(tokenData.expiresIn * 1000);

      return {
        user: data.user,
        accessToken: data.access,
        refreshToken: data.refresh,
        expiresIn: 3600
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const tokenData = this.getTokenData();
      
      if (tokenData?.accessToken && tokenData?.refreshToken) {
        await fetch(`${this.baseUrl}/api/auth/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenData.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: tokenData.refreshToken }),
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

  private clearAllTokens(): void {
    // Clear all possible token storage locations
    const storageKeys = [
      'auth_token_data',
      'tokenData', 
      'userData',
      'accessToken',
      'refreshToken'
    ];

    storageKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  private setTokenData(tokenData: TokenData): void {
    const dataToStore = JSON.stringify(tokenData);
    localStorage.setItem('auth_token_data', dataToStore);
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
    const tokenData = this.getTokenData();
    return tokenData?.accessToken || null;
  }

  isAuthenticated(): boolean {
    const tokenData = this.getTokenData();
    if (!tokenData || !tokenData.accessToken) {
      return false;
    }

    // Check if token is expired
    const now = Date.now();
    const tokenAge = (now - tokenData.issuedAt) / 1000; // Convert to seconds
    return tokenAge < tokenData.expiresIn;
  }

  private scheduleTokenRefresh(expiresInMs: number): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }

    // Refresh 5 minutes before expiry
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
    if (!tokenData?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseUrl}/api/auth/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: tokenData.refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    const newTokenData: TokenData = {
      ...tokenData,
      accessToken: data.access,
      issuedAt: Date.now()
    };

    this.setTokenData(newTokenData);
    this.scheduleTokenRefresh(newTokenData.expiresIn * 1000);
  }

  async forgotPassword(data: { email: string }) {
    const response = await fetch(`${this.baseUrl}/api/auth/forgot-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to send reset email');
    }

    return response.json();
  }
}

export const authService = new AuthService();