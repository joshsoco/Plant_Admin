// src/features/auth/services/auth.service.ts

import type { LoginCredentials, AuthResponse, TokenData } from '../models/auth.types';

class AuthService {
  private baseUrl: string;
  private tokenRefreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('AuthService: Login attempt for:', credentials.email);
      
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
      console.log('AuthService: Login response received:', data);
      
      // Store token data consistently
      const tokenData: TokenData = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
        issuedAt: Date.now(),
        expiresIn: data.expiresIn || 3600 // 1 hour in seconds
      };

      this.setTokenData(tokenData);
      this.scheduleTokenRefresh(tokenData.expiresIn * 1000);
      
      console.log('AuthService: Token data stored successfully');

      return {
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn || 3600
      };
    } catch (error) {
      console.error('AuthService: Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('AuthService: Logout initiated');
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
      console.warn('AuthService: Logout API call failed:', error);
    } finally {
      this.clearAllTokens();
      if (this.tokenRefreshTimer) {
        clearTimeout(this.tokenRefreshTimer);
        this.tokenRefreshTimer = null;
      }
      console.log('AuthService: Logout completed');
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
    
    console.log('AuthService: All tokens cleared');
  }

  private setTokenData(tokenData: TokenData): void {
    const dataToStore = JSON.stringify(tokenData);
    localStorage.setItem('auth_token_data', dataToStore);
    console.log('AuthService: Token data set in localStorage');
  }

  getTokenData(): TokenData | null {
    try {
      const data = localStorage.getItem('auth_token_data') || sessionStorage.getItem('auth_token_data');
      if (!data) {
        console.log('AuthService: No token data found in storage');
        return null;
      }
      
      const tokenData = JSON.parse(data);
      console.log('AuthService: Token data retrieved from storage');
      return tokenData;
    } catch (error) {
      console.error('AuthService: Error parsing token data:', error);
      this.clearAllTokens();
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
      console.log('AuthService: No valid token data for authentication check');
      return false;
    }

    // Check if token is expired
    const now = Date.now();
    const tokenAge = (now - tokenData.issuedAt) / 1000; // Convert to seconds
    const isExpired = tokenAge >= tokenData.expiresIn;
    
    console.log('AuthService: Token age:', tokenAge, 'seconds, expires in:', tokenData.expiresIn, 'expired:', isExpired);
    
    if (isExpired) {
      this.clearAllTokens();
      return false;
    }
    
    return true;
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
        console.error('AuthService: Token refresh failed:', error);
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

  async forgotPassword(data: { email: string }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/forgot-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send reset code');
      }

      return {
        success: true,
        message: result.message || 'Reset code sent to your email',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send reset code',
      };
    }
  }
}

export const authService = new AuthService();