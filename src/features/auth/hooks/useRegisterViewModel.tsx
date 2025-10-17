// src/features/auth/hooks/useRegisterViewModel.ts

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { 
  RegisterFormData, 
  RegisterViewModel, 
  RegisterValidationErrors,
  PasswordStrength 
} from '../models/register.types';
import { registerService } from '../services/register.service';
import { 
  validateRegisterForm, 
  hasValidationErrors, 
  checkPasswordStrength,
  isStepValid
} from '../utils/registerValidation';

const initialFormData: RegisterFormData = {
  email: '',
  username: '',
  firstName: '',
  lastName: '',
  password: '',
  passwordConfirm: '',
  agreeToTerms: false,
  subscribeNewsletter: false,
};

export const useRegisterViewModel = () => {
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<RegisterValidationErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle');

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    return checkPasswordStrength(formData.password);
  }, [formData.password]);

  // Form validation
  const isFormValid = useMemo(() => {
    const errors = validateRegisterForm(formData);
    return !hasValidationErrors(errors) && 
           Object.values(formData).every(value => 
             typeof value === 'boolean' ? true : value.length > 0
           ) &&
           formData.agreeToTerms;
  }, [formData]);

  // Add email validation to your canSubmit logic
  const canSubmit = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(formData.email);
    
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.username.trim() !== '' &&
      isEmailValid && // Add this line
      formData.password !== '' &&
      formData.passwordConfirm !== '' &&
      formData.password === formData.passwordConfirm &&
      formData.agreeToTerms &&
      status !== 'loading' &&
      Object.keys(validationErrors).length === 0
    );
  }, [formData, validationErrors, status]);

  // Debounced email availability check
  useEffect(() => {
    const checkEmailAvailability = async () => {
      if (formData.email && registerService.isValidEmail(formData.email)) {
        setEmailStatus('checking');
        
        try {
          const isAvailable = await registerService.checkEmailAvailability(formData.email);
          setEmailStatus(isAvailable ? 'available' : 'taken');
          
          if (!isAvailable) {
            setValidationErrors(prev => ({
              ...prev,
              email: 'This email is already registered'
            }));
          } else {
            setValidationErrors(prev => {
              const newErrors = { ...prev };
              if (newErrors.email === 'This email is already registered') {
                delete newErrors.email;
              }
              return newErrors;
            });
          }
        } catch (error) {
          setEmailStatus('error');
        }
      } else {
        setEmailStatus('idle');
      }
    };

    const timeoutId = setTimeout(checkEmailAvailability, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  const updateField = useCallback((field: keyof RegisterFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[field as keyof RegisterValidationErrors]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof RegisterValidationErrors];
        return newErrors;
      });
    }

    // Reset email status when email changes
    if (field === 'email') {
      setEmailStatus('idle');
    }
  }, [validationErrors]);

  const validateForm = useCallback(() => {
    const errors = validateRegisterForm(formData);
    setValidationErrors(errors);
    return !hasValidationErrors(errors);
  }, [formData]);

  const handleRegister = useCallback(async () => {
    if (!validateForm()) {
      return { success: false, error: 'Please fix validation errors' };
    }

    if (emailStatus === 'taken') {
      return { success: false, error: 'Email is already registered' };
    }

    setStatus('loading');

    try {
      const response = await registerService.register({
        email: formData.email,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        agreeToTerms: formData.agreeToTerms,
        subscribeNewsletter: formData.subscribeNewsletter,
      });

      setStatus('success');
      
      // Reset form
      setFormData(initialFormData);
      setValidationErrors({});
      setEmailStatus('idle');

      return { 
        success: true, 
        data: response,
        message: 'Registration successful! Please check your email to verify your account.' 
      };
    } catch (error) {
      setStatus('error');
      
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      
      // Parse field-specific errors
      if (errorMessage.includes('Email:')) {
        setValidationErrors(prev => ({ ...prev, email: errorMessage.split('Email: ')[1]?.split('.')[0] }));
      } else if (errorMessage.includes('Username:')) {
        setValidationErrors(prev => ({ ...prev, username: errorMessage.split('Username: ')[1]?.split('.')[0] }));
      } else if (errorMessage.includes('Password:')) {
        setValidationErrors(prev => ({ ...prev, password: errorMessage.split('Password: ')[1]?.split('.')[0] }));
      } else {
        setValidationErrors(prev => ({ ...prev, general: errorMessage }));
      }

      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, [formData, validateForm, emailStatus]);

  const clearErrors = useCallback(() => {
    setValidationErrors({});
    setStatus('idle');
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setValidationErrors({});
    setStatus('idle');
    setEmailStatus('idle');
  }, []);

  // Step validation for multi-step forms
  const isStepValidFn = useCallback((step: string) => {
    return isStepValid(formData, step);
  }, [formData]);

  const viewModel: RegisterViewModel = {
    formData,
    validationErrors,
    status,
    emailStatus,
    passwordStrength,
    isFormValid,
    canSubmit,
  };

  return {
    viewModel,
    actions: {
      updateField,
      handleRegister,
      validateForm,
      clearErrors,
      resetForm,
      isStepValid: isStepValidFn,
    },
  };
};