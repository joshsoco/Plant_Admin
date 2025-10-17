export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  rememberMe?: boolean;
  expiresIn?: number;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  issuedAt: number;
  expiresIn: number;
}

export class AuthError extends Error {
  field?: keyof LoginCredentials;
  code?: string;

  constructor(message: string, field?: keyof LoginCredentials, code?: string) {
    super(message);
    this.name = 'AuthError';
    this.field = field;
    this.code = code;
  }
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
}

export type AuthStatus = 'idle' | 'loading' | 'success' | 'error';

export interface LoginViewModel {
  formData: LoginFormData;
  validationErrors: ValidationErrors;
  status: AuthStatus;
  isFormValid: boolean;
  canSubmit: boolean;
}