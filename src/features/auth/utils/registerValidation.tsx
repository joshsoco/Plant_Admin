// src/features/auth/utils/registerValidation.ts

import type { RegisterFormData, RegisterValidationErrors, PasswordStrength } from '../models/register.types';
import { EMAIL_REGEX } from './validation';

export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
export const NAME_REGEX = /^[a-zA-Z\s]{2,30}$/;
export const MIN_PASSWORD_LENGTH = 8;

// Password strength checker
export const checkPasswordStrength = (password: string): PasswordStrength => {
  const hasMinLength = password.length >= MIN_PASSWORD_LENGTH;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  const criteria = [hasMinLength, hasUppercase, hasLowercase, hasNumbers, hasSpecialChars];
  const score = criteria.reduce((acc, curr) => acc + (curr ? 1 : 0), 0);
  
  const feedback: string[] = [];
  if (!hasMinLength) feedback.push(`At least ${MIN_PASSWORD_LENGTH} characters`);
  if (!hasUppercase) feedback.push('One uppercase letter');
  if (!hasLowercase) feedback.push('One lowercase letter');
  if (!hasNumbers) feedback.push('One number');
  if (!hasSpecialChars) feedback.push('One special character');
  
  let label: PasswordStrength['label'];
  let color: string;
  
  switch (score) {
    case 0:
    case 1:
      label = 'Weak';
      color = 'bg-red-500';
      break;
    case 2:
      label = 'Fair';
      color = 'bg-orange-500';
      break;
    case 3:
      label = 'Good';
      color = 'bg-yellow-500';
      break;
    case 4:
      label = 'Strong';
      color = 'bg-blue-500';
      break;
    case 5:
      label = 'Very Strong';
      color = 'bg-green-500';
      break;
    default:
      label = 'Weak';
      color = 'bg-red-500';
  }
  
  return {
    score,
    label,
    color,
    feedback: feedback.length > 0 ? feedback : ['Password meets all requirements'],
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSpecialChars,
  };
};

export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Email is required';
  }
  
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return undefined;
};

export const validateUsername = (username: string): string | undefined => {
  if (!username.trim()) {
    return 'Username is required';
  }
  
  if (!USERNAME_REGEX.test(username)) {
    return 'Username must be 3-20 characters long and contain only letters, numbers, and underscores';
  }
  
  return undefined;
};

export const validateFirstName = (firstName: string): string | undefined => {
  if (!firstName.trim()) {
    return 'First name is required';
  }
  
  if (!NAME_REGEX.test(firstName)) {
    return 'First name must be 2-30 characters and contain only letters';
  }
  
  return undefined;
};

export const validateLastName = (lastName: string): string | undefined => {
  if (!lastName.trim()) {
    return 'Last name is required';
  }
  
  if (!NAME_REGEX.test(lastName)) {
    return 'Last name must be 2-30 characters and contain only letters';
  }
  
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }
  
  const strength = checkPasswordStrength(password);
  
  if (strength.score < 3) {
    return 'Password is too weak. Please choose a stronger password.';
  }
  
  return undefined;
};

export const validatePasswordConfirm = (password: string, passwordConfirm: string): string | undefined => {
  if (!passwordConfirm) {
    return 'Please confirm your password';
  }
  
  if (password !== passwordConfirm) {
    return 'Passwords do not match';
  }
  
  return undefined;
};

export const validateAgreeToTerms = (agreeToTerms: boolean): string | undefined => {
  if (!agreeToTerms) {
    return 'You must agree to the terms and conditions';
  }
  
  return undefined;
};

export const validateRegisterForm = (formData: RegisterFormData): RegisterValidationErrors => {
  const errors: RegisterValidationErrors = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) {
    errors.email = emailError;
  }
  
  const usernameError = validateUsername(formData.username);
  if (usernameError) {
    errors.username = usernameError;
  }
  
  const firstNameError = validateFirstName(formData.firstName);
  if (firstNameError) {
    errors.firstName = firstNameError;
  }
  
  const lastNameError = validateLastName(formData.lastName);
  if (lastNameError) {
    errors.lastName = lastNameError;
  }
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) {
    errors.password = passwordError;
  }
  
  const passwordConfirmError = validatePasswordConfirm(formData.password, formData.passwordConfirm);
  if (passwordConfirmError) {
    errors.passwordConfirm = passwordConfirmError;
  }
  
  const agreeToTermsError = validateAgreeToTerms(formData.agreeToTerms);
  if (agreeToTermsError) {
    errors.agreeToTerms = agreeToTermsError;
  }
  
  return errors;
};

export const hasValidationErrors = (errors: RegisterValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

export const isStepValid = (formData: RegisterFormData, step: string): boolean => {
  const errors = validateRegisterForm(formData);
  
  switch (step) {
    case 'personal':
      return !errors.firstName && !errors.lastName;
    case 'account':
      return !errors.email && !errors.username;
    case 'password':
      return !errors.password && !errors.passwordConfirm;
    case 'terms':
      return !errors.agreeToTerms;
    default:
      return false;
  }
};