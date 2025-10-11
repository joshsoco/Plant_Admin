import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import type { AuthUser } from '../models/auth.types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: AuthUser }
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: AuthUser) => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
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
      return { ...state, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Initializing auth...');
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const tokenData = authService.getTokenData();
        console.log('AuthContext: Token data found:', !!tokenData);
        
        if (tokenData && tokenData.user && authService.isAuthenticated()) {
          console.log('AuthContext: Valid token found, setting user:', tokenData.user);
          dispatch({ type: 'SET_USER', payload: tokenData.user });
        } else {
          console.log('AuthContext: No valid token found or expired, logging out');
          // Clear any invalid/expired tokens
          await authService.logout();
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('AuthContext: Error during auth initialization:', error);
        await authService.logout();
        dispatch({ type: 'LOGOUT' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe?: boolean): Promise<boolean> => {
    try {
      console.log('AuthContext: Login attempt for:', email);
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await authService.login({ email, password, rememberMe });
      
      console.log('AuthContext: Login successful:', response.user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      return true;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      const authError = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: authError });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('AuthContext: Logout initiated');
      dispatch({ type: 'SET_LOADING', payload: true });
      await authService.logout();
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // Force redirect to login page
      console.log('AuthContext: Redirecting to login');
      window.location.href = '/login';
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateUser = (userData: AuthUser): void => {
    dispatch({ type: 'SET_USER', payload: userData });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
    updateUser,
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