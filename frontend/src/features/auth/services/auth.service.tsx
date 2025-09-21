// src/features/auth/services/auth.service.ts

import type { LoginCredentials, AuthResponse } from '../models/auth.types';
import { AuthError } from '../models/auth.types';

interface TokenData {
  accessToken: string;
  refreshToken: string;
  rememberMe: boolean;
  expiresIn: number;
  issuedAt: number;
}

class AuthService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  private tokenRefreshTimer: NodeJS.Timeout | null = null;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          rememberMe: credentials.rememberMe || false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new AuthError(errorData.error || 'Login failed');
      }

      const data: AuthResponse = await response.json();
      
      // Store tokens with metadata
      const tokenData: TokenData = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        rememberMe: credentials.rememberMe || false,
        expiresIn: data.expiresIn || 3600,
        issuedAt: Date.now()
      };

      this.storeTokens(tokenData);
      this.scheduleTokenRefresh(tokenData);

      return data;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Network error. Please try again.');
    }
  }

  private storeTokens(tokenData: TokenData): void {
    const tokenString = JSON.stringify(tokenData);
    
    if (tokenData.rememberMe) {
      // Store in localStorage for persistence across browser sessions
      localStorage.setItem('tokenData', tokenString);
      sessionStorage.removeItem('tokenData');
    } else {
      // Store in sessionStorage (cleared when browser closes)
      sessionStorage.setItem('tokenData', tokenString);
      localStorage.removeItem('tokenData');
    }
  }

  private getTokenData(): TokenData | null {
    try {
      const tokenString = localStorage.getItem('tokenData') || sessionStorage.getItem('tokenData');
      if (!tokenString) return null;
      
      const tokenData: TokenData = JSON.parse(tokenString);
      
      // Check if token has expired based on stored metadata
      const now = Date.now();
      const tokenAge = (now - tokenData.issuedAt) / 1000; // in seconds
      
      if (tokenAge > tokenData.expiresIn) {
        this.clearTokens();
        return null;
      }
      
      return tokenData;
    } catch {
      this.clearTokens();
      return null;
    }
  }

  getAccessToken(): string | null {
    const tokenData = this.getTokenData();
    return tokenData?.accessToken || null;
  }

  getRefreshToken(): string | null {
    const tokenData = this.getTokenData();
    return tokenData?.refreshToken || null;
  }

  async refreshToken(): Promise<string | null> {
    const tokenData = this.getTokenData();
    
    if (!tokenData?.refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: tokenData.refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const data = await response.json();
      
      // Update stored token data
      const newTokenData: TokenData = {
        ...tokenData,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || tokenData.refreshToken,
        issuedAt: Date.now()
      };

      this.storeTokens(newTokenData);
      this.scheduleTokenRefresh(newTokenData);

      return data.accessToken;
    } catch (error) {
      this.clearTokens();
      return null;
    }
  }

  private scheduleTokenRefresh(tokenData: TokenData): void {
    // Clear existing timer
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }

    // Schedule refresh 5 minutes before expiration
    const refreshTime = (tokenData.expiresIn - 300) * 1000; // 5 minutes before expiry
    
    if (refreshTime > 0) {
      this.tokenRefreshTimer = setTimeout(async () => {
        await this.refreshToken();
      }, refreshTime);
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
      this.clearTokens();
      if (this.tokenRefreshTimer) {
        clearTimeout(this.tokenRefreshTimer);
        this.tokenRefreshTimer = null;
      }
    }
  }

  private clearTokens(): void {
    localStorage.removeItem('tokenData');
    sessionStorage.removeItem('tokenData');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('userData');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getRememberMeStatus(): boolean {
    const tokenData = this.getTokenData();
    return tokenData?.rememberMe || false;
  }

  // Password Reset Methods
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

  async verifyOtp(data: { email: string; otp: string }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/verify-reset-code/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: data.email, 
          code: data.otp 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Invalid or expired code');
      }

      return {
        success: true,
        message: result.message || 'Code verified successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to verify code',
      };
    }
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          code, 
          password: newPassword 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset password');
      }

      return {
        success: true,
        message: result.message || 'Password reset successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reset password',
      };
    }
  }
}

export const authService = new AuthService();