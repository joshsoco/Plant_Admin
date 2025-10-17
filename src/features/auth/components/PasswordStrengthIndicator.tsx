// src/features/auth/components/PasswordStrengthIndicator.tsx

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { PasswordStrength } from '../models/register.types';

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
  password: string;
  className?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  strength,
  password,
  className = '',
}) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const hasShownSuccess = useRef(false);

  // Timer effect for success message
  useEffect(() => {
    if (strength.score === 5 && !hasShownSuccess.current) {
      hasShownSuccess.current = true;
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000); // Disappear after 3 seconds

      return () => clearTimeout(timer);
    } else if (strength.score < 5) {
      hasShownSuccess.current = false;
      setShowSuccessMessage(false);
    }
  }, [strength.score]);

  if (!password) return null;

  const requirements = [
    { met: strength.hasMinLength, text: 'At least 8 characters' },
    { met: strength.hasUppercase, text: 'One uppercase letter' },
    { met: strength.hasLowercase, text: 'One lowercase letter' },
    { met: strength.hasNumbers, text: 'One number' },
    { met: strength.hasSpecialChars, text: 'One special character' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className={`space-y-3 ${className}`}
    >
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password Strength
          </span>
          <span className={`text-sm font-semibold ${
            strength.score >= 4 ? 'text-green-600' :
            strength.score >= 3 ? 'text-blue-600' :
            strength.score >= 2 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {strength.label}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(strength.score / 5) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-2 rounded-full transition-colors duration-300 ${strength.color}`}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password Requirements:
        </p>
        {requirements.map((requirement, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex items-center space-x-2"
          >
            <motion.div
              animate={{ 
                scale: requirement.met ? [1, 1.2, 1] : 1,
                rotate: requirement.met ? [0, 10, -10, 0] : 0
              }}
              transition={{ duration: 0.3 }}
              className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                requirement.met 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}
            >
              {requirement.met ? (
                <Check className="w-3 h-3" />
              ) : (
                <X className="w-3 h-3" />
              )}
            </motion.div>
            <span className={`text-sm ${
              requirement.met 
                ? 'text-green-600 dark:text-green-400 font-medium' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {requirement.text}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Additional Feedback */}
      {strength.feedback.length > 0 && strength.score < 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
            Improve your password:
          </p>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            {strength.feedback.slice(0, 3).map((tip, index) => (
              <li key={index}>• {tip}</li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
          >
            <p className="text-sm text-green-800 dark:text-green-200 font-medium flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Excellent! Your password is very strong.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};