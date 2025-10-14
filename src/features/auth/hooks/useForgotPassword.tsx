import { useState } from 'react';
import { authService } from '../services/authService';
import type{ ForgotPasswordRequest, ButtonState } from '../types';

export const useForgotPassword = () => {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [error, setError] = useState<string>('');

  const forgotPassword = async (data: ForgotPasswordRequest) => {
    setButtonState('loading');
    setError('');

    try {
      const response = await authService.forgotPassword(data);
      
      if (response.success) {
        setButtonState('success');
        return { success: true, message: response.message };
      } else {
        setButtonState('error');
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      setButtonState('error');
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const resetState = () => {
    setButtonState('idle');
    setError('');
  };

  return {
    buttonState,
    error,
    forgotPassword,
    resetState,
  };
};
