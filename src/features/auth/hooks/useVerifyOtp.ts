// src/features/auth/hooks/useVerifyOtp.ts
import { useState } from 'react';
import { authService } from '../services/authService';
import type{ VerifyOtpRequest, ButtonState } from '../types';

export const useVerifyOtp = () => {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [error, setError] = useState<string>('');

  const verifyOtp = async (data: VerifyOtpRequest) => {
    setButtonState('loading');
    setError('');

    try {
      const response = await authService.verifyOtp(data);
      
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
    verifyOtp,
    resetState,
  };
};
