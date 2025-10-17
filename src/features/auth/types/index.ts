export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export type ButtonState = 'idle' | 'loading' | 'success' | 'error';
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