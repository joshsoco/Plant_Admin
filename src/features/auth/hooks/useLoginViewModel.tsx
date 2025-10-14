// src/features/auth/hooks/useLoginViewModel.ts

import { useState, useCallback, useMemo } from 'react';
import type { LoginFormData, LoginViewModel, AuthStatus, ValidationErrors } from '../models/auth.types';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm, hasValidationErrors } from '../utils/validation';

const initialFormData: LoginFormData = {
  email: '',
  password: '',
  rememberMe: false,
};

export const useLoginViewModel = () => {
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<AuthStatus>('idle');
  const { login } = useAuth();

  const isFormValid = useMemo(() => {
    const errors = validateLoginForm(formData);
    return !hasValidationErrors(errors) && formData.email.length > 0 && formData.password.length > 0;
  }, [formData]);

  // Add email validation to your canSubmit logic
  const canSubmit = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(formData.email);
    
    return (
      isEmailValid &&
      formData.password.trim() !== '' &&
      status !== 'loading'
    );
  }, [formData, status]);

  const updateField = useCallback((field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation errors when user starts typing
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }
    
    // Reset status from error state when user starts typing
    if (status === 'error') {
      setStatus('idle');
    }
  }, [validationErrors, status]);

  const validateForm = useCallback(() => {
    const errors = validateLoginForm(formData);
    setValidationErrors(errors);
    return !hasValidationErrors(errors);
  }, [formData]);

  const handleLogin = useCallback(async () => {
    console.log('useLoginViewModel: handleLogin called');
    
    // Validate form first
    if (!validateForm()) {
      return { success: false, error: 'Please fix validation errors' };
    }

    console.log('useLoginViewModel: Setting status to loading');
    setStatus('loading');

    try {
      const success = await login(
        formData.email,
        formData.password,
        formData.rememberMe
      );

      if (success) {
        console.log('useLoginViewModel: Login successful, setting status to success');
        setStatus('success');
        
        // Reset form
        setFormData(initialFormData);
        setValidationErrors({});

        return { 
          success: true, 
          data: { user: { email: formData.email } }, // Mock data for compatibility
          message: 'Login successful!' 
        };
      } else {
        console.log('useLoginViewModel: Login failed, setting status to error');
        setStatus('error');
        setValidationErrors({ email: 'Invalid credentials' });
        return { 
          success: false, 
          error: 'Invalid credentials' 
        };
      }
    } catch (error) {
      console.log('useLoginViewModel: Login error caught, setting status to error');
      setStatus('error');
      
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      
      // Set general error or field-specific error
      if (errorMessage.toLowerCase().includes('email')) {
        setValidationErrors({ email: errorMessage });
      } else if (errorMessage.toLowerCase().includes('password')) {
        setValidationErrors({ password: errorMessage });
      } else {
        setValidationErrors({ email: errorMessage });
      }

      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, [formData, validateForm, login]);

  const clearErrors = useCallback(() => {
    setValidationErrors({});
    setStatus('idle');
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setValidationErrors({});
    setStatus('idle');
  }, []);

  const viewModel: LoginViewModel = {
    formData,
    validationErrors,
    status,
    isFormValid,
    canSubmit,
  };

  return {
    viewModel,
    actions: {
      updateField,
      handleLogin,
      validateForm,
      clearErrors,
      resetForm,
    },
  };
};