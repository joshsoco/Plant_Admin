import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ForgotPassword } from '@/features/auth/components/ForgotPassword';
import { VerifyOtp } from '@/features/auth/components/VerifyOtp';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

type Step = 'forgot-password' | 'verify-otp' | 'reset-password' | 'success';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('forgot-password');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleEmailSubmitSuccess = (userEmail: string) => {
    console.log('Email submitted successfully:', userEmail);
    setEmail(userEmail);
    setCurrentStep('verify-otp');
  };

  const handleOtpSuccess = (verifiedCode: string) => {
    console.log('OTP verified successfully:', verifiedCode);
    setVerificationCode(verifiedCode);
    setCurrentStep('reset-password');
  };

  const handlePasswordResetSuccess = () => {
    setCurrentStep('success');
    // Navigate to login page after a short delay
    setTimeout(() => {
      navigate('/login', { 
        replace: true,
        state: { 
          message: 'Password reset successful! Please log in with your new password.' 
        }
      });
    }, 2000);
  };

  const handleBackToForgotPassword = () => {
    setCurrentStep('forgot-password');
  };

  const handleBackToOtp = () => {
    setCurrentStep('verify-otp');
  };

  const handleBackToLogin = () => {
    navigate('/login', { replace: true });
  };

  const handleResendOtp = () => {
    console.log('Resending OTP to:', email);
    // The OTP component will handle the actual resend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {currentStep === 'forgot-password' && (
            <ForgotPassword
              key="forgot-password"
              onSuccess={handleEmailSubmitSuccess}
              onBackToLogin={handleBackToLogin}
            />
          )}
          {currentStep === 'verify-otp' && (
            <VerifyOtp
              key="verify-otp"
              email={email}
              onSuccess={handleOtpSuccess}
              onBack={handleBackToForgotPassword}
              onResendOtp={handleResendOtp}
            />
          )}
          {currentStep === 'reset-password' && (
            <ResetPasswordForm
              key="reset-password"
              email={email}
              code={verificationCode}
              onSuccess={handlePasswordResetSuccess}
              onBack={handleBackToOtp}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};