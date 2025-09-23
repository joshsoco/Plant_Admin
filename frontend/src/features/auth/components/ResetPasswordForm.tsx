// src/features/auth/components/ResetPasswordForm.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '../services/authService';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import type { PasswordStrength } from '../models/register.types';

interface ResetPasswordFormProps {
  email: string;
  code: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  email,
  code,
  onSuccess,
  onBack,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Password strength calculation matching the PasswordStrength interface
  const getPasswordStrength = (pwd: string): PasswordStrength => {
    const hasMinLength = pwd.length >= 8;
    const hasLowercase = /[a-z]/.test(pwd);
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasNumbers = /\d/.test(pwd);
    const hasSpecialChars = /[^a-zA-Z\d]/.test(pwd);
    
    let score = 0;
    const feedback: string[] = [];
    
    if (hasMinLength) score++;
    else feedback.push('At least 8 characters');
    
    if (hasLowercase) score++;
    else feedback.push('Include lowercase letters');
    
    if (hasUppercase) score++;
    else feedback.push('Include uppercase letters');
    
    if (hasNumbers) score++;
    else feedback.push('Include numbers');
    
    if (hasSpecialChars) score++;
    else feedback.push('Include special characters');
    
    const labels: PasswordStrength['label'][] = ['Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const label = labels[score] || 'Weak';
    
    const colors = ['#ef4444', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
    const color = colors[score] || '#ef4444';
    
    return {
      score,
      label,
      color,
      feedback,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSpecialChars
    };
  };

  const passwordStrength = getPasswordStrength(password);
  const isPasswordValid = password.length >= 8 && passwordStrength.score >= 3;
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError('Please enter a stronger password');
      return;
    }

    if (!doPasswordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword(email, code, password);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="bg-white dark:bg-gray-900">
          <CardContent className="pt-8 pb-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </motion.div>
            <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">
              Password Reset Successful
            </h3>
            <p className="text-muted-foreground dark:text-gray-400 text-sm">
              Your password has been successfully reset. You will be redirected to the login page.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="bg-white dark:bg-gray-900">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
            </div>
            <div>
              <CardTitle className="text-xl text-foreground dark:text-white">Reset Password</CardTitle>
              <CardDescription className="text-sm text-muted-foreground dark:text-gray-400">
                Create a new secure password for your account
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground dark:text-white">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 h-11"
                  placeholder="Enter your new password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute inset-y-0 right-0 px-3 py-5 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  )}
                </Button>
              </div>
              
              {/* Password Strength Indicator */}
              <PasswordStrengthIndicator 
                strength={passwordStrength} 
                password={password}
                className="mt-3"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground dark:text-white">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10 h-11"
                  placeholder="Confirm your new password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute inset-y-0 right-0 px-3 py-5 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  )}
                </Button>
              </div>
              
              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className={`flex items-center text-xs font-medium mt-2 ${
                  doPasswordsMatch ? 'text-green-600 dark:text-green-400' : 'text-destructive dark:text-red-400'
                }`}>
                  {doPasswordsMatch ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1.5" />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 mr-1.5" />
                      Passwords do not match
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 h-11 cursor-pointer"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 cursor-pointer"
                disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResetPasswordForm;