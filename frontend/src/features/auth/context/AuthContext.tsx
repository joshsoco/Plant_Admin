// src/features/auth/context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, AuthUser, AuthError } from '../models/auth.types';
import { authService } from '../services/auth.service';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGIN_FAILURE'; payload: AuthError }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_USER'; payload: AuthUser | null };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getAccessToken();
      
      if (token) {
        try {
          // Try to refresh the token to verify it's still valid
          const newToken = await authService.refreshToken();
          if (newToken) {
            // Get storage type based on remember me preference
            const rememberMe = authService.getRememberMeStatus();
            const storage = rememberMe ? localStorage : sessionStorage;
            const storedUserData = storage.getItem('userData');
            
            if (storedUserData) {
              try {
                const userData = JSON.parse(storedUserData);
                dispatch({ type: 'SET_USER', payload: userData });
              } catch {
                await authService.logout();
                dispatch({ type: 'SET_USER', payload: null });
              }
            }
          } else {
            await authService.logout();
            dispatch({ type: 'SET_USER', payload: null });
          }
        } catch (error) {
          await authService.logout();
          dispatch({ type: 'SET_USER', payload: null });
        }
      }
    };

    initializeAuth();
  }, []);

  // Set up periodic token refresh check
  useEffect(() => {
    const checkTokenExpiry = () => {
      if (state.isAuthenticated && !authService.getAccessToken()) {
        // Token has expired and wasn't refreshed
        logout();
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000);
    
    return () => clearInterval(interval);
  }, [state.isAuthenticated]);

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authService.login({ email, password, rememberMe });
      
      // Store user data based on remember me preference
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('userData', JSON.stringify(response.user));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      return true;
    } catch (error) {
      const authError: AuthError = {
        name: "AuthError",
        message: error instanceof Error ? error.message : 'Login failed',
      };
      dispatch({ type: 'LOGIN_FAILURE', payload: authError });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};