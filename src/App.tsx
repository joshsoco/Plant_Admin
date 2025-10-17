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
import PlantDatabasePage from '@/pages/admin/PlantDatabase';
import PlantIdentificationPage from '@/pages/admin/PlantIdentification';
import AnalyticsPage from '@/pages/admin/AnalyticsPlant';
import HelpPage from '@/pages/admin/help';
import AboutPage from '@/pages/admin/AboutUs';
import PrivacyPolicyPage from '@/pages/admin/legal/PrivacyPolicy';
import TermsOfServicePage from '@/pages/admin/legal/TermsOfServices';
import ReportsPage from '@/pages/admin/Reports';
import SavedPlants from '@/pages/admin/SavedPlants';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading while checking auth status
if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner variant="bars" size={40} className="text-blue-600" />
    </div>
  );
}
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirects authenticated users)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading while checking auth status
 if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner variant="bars" size={40} className="text-blue-600" />
    </div>
  );
}
  
  // Only redirect to dashboard if truly authenticated
  if (isAuthenticated) {
    console.log('PublicRoute: User authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Routes Component
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes - redirect authenticated users to dashboard */}
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

      {/* Legal pages - accessible to everyone */}
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/tos" element={<TermsOfServicePage />} />

      {/* Protected routes - require authentication */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      >
        {/* Nested routes that will render inside DashboardPage's <Outlet /> */}
        <Route path="database" element={<PlantDatabasePage />} />
        <Route path="identifications" element={<PlantIdentificationPage />} />
        <Route path="analytics-plants" element={<AnalyticsPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="saved-plants" element={<SavedPlants />} />
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