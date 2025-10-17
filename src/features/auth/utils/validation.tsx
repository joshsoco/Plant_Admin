// src/features/auth/utils/validation.ts

import type { LoginFormData, ValidationErrors } from '../models/auth.types';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 8;

export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Email is required';
  }
  
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  
  return undefined;
};

export const validateLoginForm = (formData: LoginFormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) {
    errors.email = emailError;
  }
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) {
    errors.password = passwordError;
  }
  
  return errors;
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};