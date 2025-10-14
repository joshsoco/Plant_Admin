export interface RegisterCredentials {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm: string;
  agreeToTerms: boolean;
  subscribeNewsletter?: boolean;
}

export interface RegisterFormData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm: string;
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

export interface RegisterValidationErrors {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  passwordConfirm?: string;
  agreeToTerms?: string;
  general?: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
  };
  message: string;
}

export interface EmailAvailabilityResponse {
  email: string;
  isAvailable: boolean;
}

export interface RegisterViewModel {
  formData: RegisterFormData;
  validationErrors: RegisterValidationErrors;
  status: 'idle' | 'loading' | 'success' | 'error';
  emailStatus: 'idle' | 'checking' | 'available' | 'taken' | 'error';
  passwordStrength: PasswordStrength;
  isFormValid: boolean;
  canSubmit: boolean;
}

export interface PasswordStrength {
  score: number; // 0-4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  color: string;
  feedback: string[];
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecialChars: boolean;
}

export type RegisterStep = 'personal' | 'account' | 'password' | 'terms';

export interface RegisterStepData {
  step: RegisterStep;
  title: string;
  description: string;
  fields: (keyof RegisterFormData)[];
  isValid: boolean;
}