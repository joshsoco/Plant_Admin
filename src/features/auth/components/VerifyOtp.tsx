import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, RefreshCw, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVerifyOtp } from '../hooks/useVerifyOtp';
import { authService } from '../services/authService';
import type { Variants } from 'framer-motion';

interface VerifyOtpProps {
  email: string;
  onSuccess: (verifiedCode: string) => void;
  onBack: () => void;
  onResendOtp: () => void;
}

export const VerifyOtp: React.FC<VerifyOtpProps> = ({ 
  email, 
  onSuccess, 
  onBack, 
  onResendOtp 
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verifiedCode, setVerifiedCode] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { buttonState, error, verifyOtp, resetState } = useVerifyOtp();

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    if (buttonState === 'success' && verifiedCode) {
      setTimeout(() => onSuccess(verifiedCode), 1500);
    }
  }, [buttonState, onSuccess, verifiedCode]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    if (newOtp.every(digit => digit !== '')) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    if (code.length === 6) {
      const result = await verifyOtp({ email, otp: code });
      if (result.success) {
        setVerifiedCode(code);
      }
    }
  };

  const handleResend = async () => {
    if (canResend) {
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      resetState();
      
      // Actually resend the OTP by calling the forgot password API again
      try {
        await authService.forgotPassword({ email });
      } catch (error) {
        console.error('Failed to resend OTP:', error);
      }
      
      onResendOtp();
      inputRefs.current[0]?.focus();
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isOtpComplete = otp.every(digit => digit !== '');

const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: 'easeInOut' // ✅ must match allowed strings
    }
  }
};

  const inputVariants = {
    idle: { scale: 1, borderColor: "#e5e7eb" },
    focus: { scale: 1.05, borderColor: "#3b82f6" },
    error: { scale: 1, borderColor: "#ef4444", backgroundColor: "#fef2f2" },
    success: { scale: 1, borderColor: "#10b981", backgroundColor: "#f0fdf4" }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20 dark:border-gray-700/20"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center w-16 h-16 bg-blue-600 dark:bg-blue-900/30 rounded-full mx-auto mb-4"
        >
          <KeyRound className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
        >
          Verify Your Email
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400 text-sm"
        >
          We've sent a 6-digit code to
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-blue-600 dark:text-blue-400 font-medium text-sm break-all"
        >
          {email || 'your email address'}
        </motion.p>
      </div>

      {/* OTP Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center gap-3 mb-6"
      >
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el: HTMLInputElement | null) => {
            inputRefs.current[index] = el;}}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            variants={inputVariants}
            animate={
              error ? 'error' : 
              buttonState === 'success' ? 'success' : 
              'idle'
            }
            whileFocus="focus"
            className="w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        ))}
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {buttonState === 'success' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm mb-4 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
          >
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Email verified successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verify Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-6"
      >
        <Button
          onClick={() => handleVerifyOtp()}
          disabled={!isOtpComplete || buttonState === 'loading' || buttonState === 'success'}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium py-3 rounded-lg transition-all duration-200 cursor-pointer"
        >
          {buttonState === 'loading' ? (
            <div className="flex items-center justify-center gap-2">
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Verifying...</span>
            </div>
          ) : buttonState === 'success' ? (
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Verified!</span>
            </div>
          ) : (
            'Verify Code'
          )}
        </Button>
      </motion.div>

      {/* Resend Timer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4"
      >
        {canResend ? (
          <button
            onClick={handleResend}
            className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors mx-auto cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Resend Code
          </button>
        ) : (
          <span>
            Resend code in <span className="font-medium text-blue-600 dark:text-blue-400">{formatTimer(timer)}</span>
          </span>
        )}
      </motion.div>

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center"
      >
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium transition-colors mx-auto cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
      </motion.div>
    </motion.div>
  );
};