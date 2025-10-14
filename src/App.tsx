// App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/features/auth/context/AuthContext';
import { ThemeProvider } from '@/components/theme-provider';
import { MotionProvider } from '@/contexts/MotionContext';

// Import pages
import { Spinner } from '@/components/ui/spinner';
import LoginPage from '@/pages/admin/Login';
import RegisterPage from '@/pages/admin/RegisterPage';
import { ForgotPasswordPage } from '@/pages/admin/ForgotPasswordPage';
import DashboardPage from '@/pages/admin/dashboard/Page';
import PlantIdentificationPage from '@/pages/admin/PlantIdentification';
import AnalyticsPage from '@/pages/admin/AnalyticsPlant';
import ReportsPage from '@/pages/admin/ReportsSimple';
import HelpPage from '@/pages/admin/help';
import AboutPage from '@/pages/admin/AboutUs';
import PrivacyPolicyPage from '@/pages/admin/legal/PrivacyPolicy';
import TermsOfServicePage from '@/pages/admin/legal/TermsOfServices';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner variant="bars" size={40} className="text-blue-600" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner variant="bars" size={40} className="text-blue-600" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        } 
      />
      
      {/* Legal pages */}
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/tos" element={<TermsOfServicePage />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      >
        <Route path="identifications" element={<PlantIdentificationPage />} />
        <Route path="analytics-plants" element={<AnalyticsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <MotionProvider>
        <AuthProvider>
          <div className="min-h-screen">
            <AppRoutes />
          </div>
        </AuthProvider>
      </MotionProvider>
    </ThemeProvider>
  );
};

export default App;