// src/features/auth/components/RegisterForm.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  UserPlus, 
  Check, 
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { useRegisterViewModel } from '../hooks/useRegisterViewModel';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

interface RegisterFormProps {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onError,
  className = '',
}) => {
  const { viewModel, actions } = useRegisterViewModel();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);
  const [isValidEmail, setIsValidEmail] = React.useState(false);

  React.useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(viewModel.formData.email));
  }, [viewModel.formData.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await actions.handleRegister();
    
    if (result.success) {
      onSuccess?.(result.data);
    } else {
      onError?.(result.error ?? 'An unknown error occurred.');
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    loading: { scale: 0.95 },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 }
  };

  const getEmailStatusIcon = () => {
    switch (viewModel.emailStatus) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;
      case 'available':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'taken':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full max-w-md space-y-6 ${className}`}
    >
      <div className="text-center space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-gray-900 dark:text-white"
        >
          Create Account
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-gray-600 dark:text-gray-400"
        >
          Join us and let's Plant-identifier!
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-2"
          >
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name
            </Label>
            <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
              <Input
                id="firstName"
                type="text"
                placeholder="firstname"
                value={viewModel.formData.firstName}
                onChange={(e) => actions.updateField('firstName', e.target.value)}
                className={`${
                  viewModel.validationErrors.firstName
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : ''
                }`}
                disabled={viewModel.status === 'loading'}
              />
            </motion.div>
            {viewModel.validationErrors.firstName && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="text-sm text-red-600"
              >
                {viewModel.validationErrors.firstName}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-2"
          >
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </Label>
            <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
              <Input
                id="lastName"
                type="text"
                placeholder="lastname"
                value={viewModel.formData.lastName}
                onChange={(e) => actions.updateField('lastName', e.target.value)}
                className={`${
                  viewModel.validationErrors.lastName
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : ''
                }`}
                disabled={viewModel.status === 'loading'}
              />
            </motion.div>
            {viewModel.validationErrors.lastName && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="text-sm text-red-600"
              >
                {viewModel.validationErrors.lastName}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Username Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-2"
        >
          <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Username
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
              <Input
                id="username"
                type="text"
                placeholder="Joshdoe"
                value={viewModel.formData.username}
                onChange={(e) => actions.updateField('username', e.target.value)}
                className={`pl-10 ${
                  viewModel.validationErrors.username
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : ''
                }`}
                disabled={viewModel.status === 'loading'}
              />
            </motion.div>
          </div>
          {viewModel.validationErrors.username && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="text-sm text-red-600"
            >
              {viewModel.validationErrors.username}
            </motion.p>
          )}
        </motion.div>

        {/* Email Field with Real-time Validation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-2"
        >
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </Label>
          <div className="relative">
            <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
              viewModel.formData.email && !isValidEmail 
                ? 'text-red-400' 
                : isValidEmail 
                  ? 'text-green-400'
                  : 'text-gray-400'
            }`} />
            <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={viewModel.formData.email}
                onChange={(e) => actions.updateField('email', e.target.value)}
                className={`pl-10 pr-10 transition-all duration-200 ${
                  viewModel.validationErrors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : viewModel.formData.email && !isValidEmail
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : isValidEmail
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
                disabled={viewModel.status === 'loading'}
              />
            </motion.div>
            
            {/* Success Check Icon */}
            <AnimatePresence>
              {isValidEmail && !viewModel.validationErrors.email && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Real-time Email Validation Error */}
          <AnimatePresence>
            {viewModel.formData.email && !isValidEmail && !viewModel.validationErrors.email && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-red-600 dark:text-red-400"
              >
                Please enter a valid email address
              </motion.p>
            )}
          </AnimatePresence>
          
          {/* Server-side Validation Error */}
          {viewModel.validationErrors.email && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="text-sm text-red-600 dark:text-red-400"
            >
              {viewModel.validationErrors.email}
            </motion.p>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="space-y-2"
        >
          <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={viewModel.formData.password}
                onChange={(e) => actions.updateField('password', e.target.value)}
                className={`pl-10 pr-10 ${
                  viewModel.validationErrors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : viewModel.passwordStrength.score >= 3 && viewModel.formData.password
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : ''
                }`}
                disabled={viewModel.status === 'loading'}
              />
            </motion.div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {viewModel.validationErrors.password && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="text-sm text-red-600"
            >
              {viewModel.validationErrors.password}
            </motion.p>
          )}
          <PasswordStrengthIndicator 
            strength={viewModel.passwordStrength}
            password={viewModel.formData.password}
          />
        </motion.div>

        {/* Password Confirm Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="space-y-2"
        >
          <Label htmlFor="passwordConfirm" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <motion.div variants={inputVariants} whileFocus="focus" initial="blur">
              <Input
                id="passwordConfirm"
                type={showPasswordConfirm ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={viewModel.formData.passwordConfirm}
                onChange={(e) => actions.updateField('passwordConfirm', e.target.value)}
                className={`pl-10 pr-10 ${
                  viewModel.validationErrors.passwordConfirm
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : viewModel.formData.passwordConfirm && 
                      viewModel.formData.password === viewModel.formData.passwordConfirm
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : ''
                }`}
                disabled={viewModel.status === 'loading'}
              />
            </motion.div>
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {viewModel.validationErrors.passwordConfirm && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="text-sm text-red-600"
            >
              {viewModel.validationErrors.passwordConfirm}
            </motion.p>
          )}
          {viewModel.formData.passwordConfirm && 
           viewModel.formData.password === viewModel.formData.passwordConfirm &&
           !viewModel.validationErrors.passwordConfirm && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="text-sm text-green-600 flex items-center"
            >
              <Check className="h-3 w-3 mr-1" />
              Passwords match
            </motion.p>
          )}
        </motion.div>

        {/* Terms and Newsletter */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreeToTerms"
              checked={viewModel.formData.agreeToTerms}
              onCheckedChange={(checked) => actions.updateField('agreeToTerms', !!checked)}
              disabled={viewModel.status === 'loading'}
              className="mt-0.5"
            />
            <Label
              htmlFor="agreeToTerms"
              className={`text-sm cursor-pointer ${
                viewModel.validationErrors.agreeToTerms ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              I agree to the{' '}
              <Link
                to="/tos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                to="/Privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Privacy Policy
              </Link>
            </Label>
          </div>
          {viewModel.validationErrors.agreeToTerms && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="text-sm text-red-600 ml-6"
            >
              {viewModel.validationErrors.agreeToTerms}
            </motion.p>
          )}

          <div className="flex items-start space-x-2">
            <Checkbox
              id="subscribeNewsletter"
              checked={viewModel.formData.subscribeNewsletter}
              onCheckedChange={(checked) => actions.updateField('subscribeNewsletter', !!checked)}
              disabled={viewModel.status === 'loading'}
              className="mt-0.5"
            />
            <Label
              htmlFor="subscribeNewsletter"
              className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              Subscribe to our newsletter for updates and tips
            </Label>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.div
            variants={buttonVariants}
            initial="idle"
            animate={viewModel.status === 'loading' ? 'loading' : 'idle'}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              type="submit"
              disabled={!viewModel.canSubmit || !isValidEmail}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition-colors"
            >
              {viewModel.status === 'loading' ? (
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Create Account</span>
                </div>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </form>

      {/* Error Display */}
      {(viewModel.status === 'error' || viewModel.validationErrors.general) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700 dark:text-red-400">
              {viewModel.validationErrors.general || 'Registration failed. Please try again.'}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Success Message */}
      {viewModel.status === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <Check className="h-4 w-4" />
            <AlertDescription className="text-green-700 dark:text-green-400">
              Registration successful! Please check your email to verify your account.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </motion.div>
  );
};