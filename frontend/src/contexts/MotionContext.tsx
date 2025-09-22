import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface MotionContextType {
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
  shouldReduceMotion: boolean; // Computed value that considers both user preference and OS setting
}

const MotionContext = createContext<MotionContextType | undefined>(undefined);

interface MotionProviderProps {
  children: React.ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  const [reduceMotion, setReduceMotionState] = useState<boolean>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('user-reduce-motion');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    
    // Default to OS preference if no user preference is saved
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [osReduceMotion, setOsReduceMotion] = useState<boolean>(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Listen for OS preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setOsReduceMotion(e.matches);
      
      // If user hasn't set a preference, update to match OS
      const userPreference = localStorage.getItem('user-reduce-motion');
      if (userPreference === null) {
        setReduceMotionState(e.matches);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const setReduceMotion = useCallback((reduce: boolean) => {
    setReduceMotionState(reduce);
    localStorage.setItem('user-reduce-motion', JSON.stringify(reduce));
    
    // Store in user profile if authenticated
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const updatedUser = { ...user, preferences: { ...user.preferences, reduceMotion: reduce } };
        
        // Update both storage locations to ensure persistence
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        if (sessionStorage.getItem('userData')) {
          sessionStorage.setItem('userData', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.warn('Failed to update user preferences:', error);
      }
    }
  }, []);

  // Initialize from user profile if available
  useEffect(() => {
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.preferences?.reduceMotion !== undefined) {
          setReduceMotionState(user.preferences.reduceMotion);
        }
      } catch (error) {
        console.warn('Failed to load user motion preferences:', error);
      }
    }
  }, []);

  const shouldReduceMotion = reduceMotion || osReduceMotion;

  const value: MotionContextType = {
    reduceMotion,
    setReduceMotion,
    shouldReduceMotion,
  };

  return (
    <MotionContext.Provider value={value}>
      {children}
    </MotionContext.Provider>
  );
}

export function useMotion() {
  const context = useContext(MotionContext);
  if (context === undefined) {
    throw new Error('useMotion must be used within a MotionProvider');
  }
  return context;
}

// Hook that can be used directly in Framer Motion components
export function useReducedMotion() {
  const { shouldReduceMotion } = useMotion();
  return shouldReduceMotion;
}