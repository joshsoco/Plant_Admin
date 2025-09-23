import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  User, 
  Lock, 
  Globe, 
  Info, 
  Eye, 
  EyeOff, 
  Check, 
  AlertTriangle,
  Save,
  X,
  Clock,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { motion } from 'framer-motion';

interface AdminSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

interface PreferencesData {
  locale: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  theme: string;
}

export function AdminSettingsDialog({ open, onOpenChange }: AdminSettingsDialogProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });
  
  // Password form state
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Profile form state
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });

  // Preferences form state
  const [preferencesData, setPreferencesData] = useState<PreferencesData>({
    locale: 'en-US',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'en-US',
    theme: 'system'
  });

  // Password validation
  const isPasswordValid = passwordData.newPassword.length >= 8;
  const doPasswordsMatch = passwordData.newPassword === passwordData.confirmPassword;
  const canSubmitPassword = passwordData.currentPassword && isPasswordValid && doPasswordsMatch;

  // Profile validation
  const isProfileValid = profileData.firstName.trim() && profileData.lastName.trim() && profileData.email.includes('@');

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitPassword) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProfileValid) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Preferences updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update preferences. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    });
    setMessage({ type: null, text: '' });
  };

  const handleClose = () => {
    resetForms();
    onOpenChange(false);
  };

  // App version and system info
  const systemInfo = {
    version: '2.1.0',
    buildDate: 'September 10, 2025',
    environment: 'Production',
    lastUpdate: 'September 23, 2025',
    uptime: '15 days, 8 hours',
    databaseVersion: 'SQLite 3.45.0'
  };

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ];

  const locales = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'es-ES', label: 'Español' },
    { value: 'fr-FR', label: 'Français' },
    { value: 'de-DE', label: 'Deutsch' },
    { value: 'ja-JP', label: '日本語' },
    { value: 'zh-CN', label: '中文 (简体)' }
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Admin Settings
          </DialogTitle>
          <DialogDescription>
            Manage your account settings, preferences, and system configuration
          </DialogDescription>
        </DialogHeader>

        {/* Success/Error Messages */}
        {message.type && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'}>
              {message.type === 'success' ? <Check className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />}
              <AlertDescription className={message.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                {message.text}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                System
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-4 m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                            placeholder="Enter first name"
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                            placeholder="Enter last name"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email address"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button 
                          type="submit" 
                          disabled={!isProfileValid || isLoading}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button type="button" variant="outline" onClick={resetForms}>
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-4 m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Change Password</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            placeholder="Enter current password"
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          >
                            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            placeholder="Enter new password"
                            disabled={isLoading}
                            className={passwordData.newPassword && !isPasswordValid ? 'border-red-500' : ''}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          >
                            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {passwordData.newPassword && !isPasswordValid && (
                          <p className="text-sm text-red-600">Password must be at least 8 characters long</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Confirm new password"
                            disabled={isLoading}
                            className={passwordData.confirmPassword && !doPasswordsMatch ? 'border-red-500' : ''}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          >
                            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {passwordData.confirmPassword && !doPasswordsMatch && (
                          <p className="text-sm text-red-600">Passwords do not match</p>
                        )}
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button 
                          type="submit" 
                          disabled={!canSubmitPassword || isLoading}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          {isLoading ? 'Updating...' : 'Update Password'}
                        </Button>
                        <Button type="button" variant="outline" onClick={resetForms}>
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-4 m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Regional Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePreferencesSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="locale">Language & Region</Label>
                          <Select value={preferencesData.locale} onValueChange={(value) => setPreferencesData(prev => ({ ...prev, locale: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select locale" />
                            </SelectTrigger>
                            <SelectContent>
                              {locales.map((locale) => (
                                <SelectItem key={locale.value} value={locale.value}>
                                  {locale.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select value={preferencesData.timezone} onValueChange={(value) => setPreferencesData(prev => ({ ...prev, timezone: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              {timezones.map((tz) => (
                                <SelectItem key={tz} value={tz}>
                                  {tz}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateFormat">Date Format</Label>
                          <Select value={preferencesData.dateFormat} onValueChange={(value) => setPreferencesData(prev => ({ ...prev, dateFormat: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select date format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                              <SelectItem value="DD MMM YYYY">DD MMM YYYY</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="numberFormat">Number Format</Label>
                          <Select value={preferencesData.numberFormat} onValueChange={(value) => setPreferencesData(prev => ({ ...prev, numberFormat: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select number format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en-US">1,234.56 (US)</SelectItem>
                              <SelectItem value="en-GB">1,234.56 (UK)</SelectItem>
                              <SelectItem value="de-DE">1.234,56 (DE)</SelectItem>
                              <SelectItem value="fr-FR">1 234,56 (FR)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date().toLocaleDateString(preferencesData.locale, {
                                year: 'numeric',
                                month: preferencesData.dateFormat.includes('MMM') ? 'short' : '2-digit',
                                day: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date().toLocaleTimeString(preferencesData.locale, {
                                timeZone: preferencesData.timezone,
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button 
                          type="submit" 
                          disabled={isLoading}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          {isLoading ? 'Saving...' : 'Save Preferences'}
                        </Button>
                        <Button type="button" variant="outline" onClick={resetForms}>
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* System Tab */}
              <TabsContent value="system" className="space-y-4 m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">System Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Application Version</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{systemInfo.version}</Badge>
                            <Badge variant="outline">Plant-Identifier</Badge>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Environment</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={systemInfo.environment === 'Production' ? 'default' : 'secondary'}>
                              {systemInfo.environment}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Build Date</Label>
                          <p className="text-sm mt-1">{systemInfo.buildDate}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Last Update</Label>
                          <p className="text-sm mt-1">{systemInfo.lastUpdate}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">System Uptime</Label>
                          <p className="text-sm mt-1">{systemInfo.uptime}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Database</Label>
                          <p className="text-sm mt-1">{systemInfo.databaseVersion}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-muted-foreground">Current User Session</Label>
                      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-xs text-muted-foreground">Logged in as</p>
                          <p className="text-sm font-medium">{user?.name || 'Admin User'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Role</p>
                          <Badge variant="outline" className="text-xs">Administrator</Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Session started</p>
                          <p className="text-sm">{new Date().toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">IP Address</p>
                          <p className="text-sm">192.168.1.100</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}