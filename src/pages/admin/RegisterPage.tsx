// src/pages/RegisterPage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import type { RegisterResponse } from '@/features/auth/models/register.types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = (data: RegisterResponse) => {
    console.log('Registration successful:', data);
    setTimeout(() => {
      navigate('/login', { 
        replace: true,
        state: { 
          message: 'Registration successful! Please log in with your new account.',
          email: data.user.email 
        }
      });
    }, 2000);
  };

  const handleRegisterError = (error: string) => {
    console.error('Registration error:', error);
  };

  

  const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants: Variants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut' 
      }
    }
  };

  const decorativeVariants: Variants = {
    initial: { scale: 0, rotate: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      rotate: 360,
      opacity: 0.7,
      transition: {
        duration: 1.5,
        ease: 'easeOut'
      }
    }
  };

  const floatingVariants: Variants = {
    animate: {
      y: [-20, 20, -20],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <motion.div
        variants={decorativeVariants}
        initial="initial"
        animate="animate"
        className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"
      />
      <motion.div
        variants={decorativeVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2 }}
        className="absolute top-1/4 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"
      />
      <motion.div
        variants={decorativeVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.4 }}
        className="absolute bottom-10 left-1/4 w-28 h-28 bg-white/8 rounded-full blur-xl"
      />
      <motion.div
        variants={decorativeVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.6 }}
        className="absolute top-1/2 left-20 w-16 h-16 bg-white/12 rounded-full blur-lg"
      />
      <motion.div
        variants={decorativeVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.8 }}
        className="absolute bottom-1/4 right-20 w-20 h-20 bg-white/6 rounded-full blur-xl"
      />

      {/* Floating Particles */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 right-1/4 w-4 h-4 bg-white/20 rounded-full"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
        className="absolute bottom-20 left-1/3 w-3 h-3 bg-white/15 rounded-full"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
        className="absolute top-1/3 right-10 w-5 h-5 bg-white/25 rounded-full"
      />

      {/* Main container for form */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="w-full max-w-lg relative z-10"
      >
        <motion.div
          variants={cardVariants}
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20"
        >
          <RegisterForm onSuccess={handleRegisterSuccess} onError={handleRegisterError} />
        </motion.div>

        {/* Sign-in link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-center mt-2"
        >
          <p className="text-black/80 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue font-semibold hover:text-blue/90 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Log in
            </button>
          </p>
        </motion.div>
      </motion.div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
              x: [0, Math.random() * 50 - 25, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`geo-${i}`}
            className={`absolute border border-white/10 ${
              i % 2 === 0 ? 'rounded-full' : 'rotate-45'
            } ${
              i % 3 === 0 ? 'w-20 h-20' : 
              i % 3 === 1 ? 'w-16 h-16' : 'w-12 h-12'
            }`}
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default RegisterPage;