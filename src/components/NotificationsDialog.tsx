import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  Settings, 
  Check, 
  Trash2, 
  Eye, 
  EyeOff,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
} from 'lucide-react';

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  systemAlerts: boolean;
  flaggedContentAlerts: boolean;
  llmQualityAlerts: boolean;
  cacheStatusAlerts: boolean;
  analyticsReports: boolean;
}

export function NotificationDialog({ open, onOpenChange }: NotificationsDialogProps) {
  const [activeTab, setActiveTab] = useState('notifications');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: false,
    systemAlerts: true,
    flaggedContentAlerts: true,
    llmQualityAlerts: false,
    cacheStatusAlerts: true,
    analyticsReports: false,
  });

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    // API call to save notification preferences would go here
    console.log('Saving notification settings:', notificationSettings);
  };

  const handleMarkAllAsRead = () => {
    // API call to mark all notifications as read would go here
    console.log('Marking all notifications as read');
  };

  const handleClearAll = () => {
    // API call to clear all notifications would go here
    console.log('Clearing all notifications');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Notifications
          </DialogTitle>
          <DialogDescription>
            Manage your notification preferences and view recent alerts
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Preferences
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 mt-4 overflow-hidden">
              {/* Recent Notifications Tab */}
              <TabsContent value="notifications" className="h-full overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pr-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">Recent Notifications</h3>
                        <Badge variant="secondary" className="text-xs">
                          Empty
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Mark All Read
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAll}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear All
                    </Button>
                  </div>
                </div>

                <Separator />

                    {/* Empty State */}
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6 mb-4">
                        <Bell className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No notifications yet
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                        When you receive notifications about system alerts, flagged content, or other important updates, they'll appear here.
                      </p>
                    </div>

                {/* Future notifications would be displayed here in this format: */}
                {/* 
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border rounded-lg bg-card">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <NotificationIcon type={notification.type} />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                */}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Notification Settings Tab */}
              <TabsContent value="settings" className="h-full overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-6 pr-4">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Choose how you want to be notified about different types of events and updates.
                      </p>
                    </div>

                    {/* Scrollable content wrapper */}
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-6 pr-2">
                        {/* General Notifications */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-3">General Notifications</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <label className="font-medium text-sm">Email Notifications</label>
                                  <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                                </div>
                                <Button
                                  variant={notificationSettings.emailNotifications ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => updateSetting('emailNotifications', !notificationSettings.emailNotifications)}
                                >
                                  {notificationSettings.emailNotifications ? "ON" : "OFF"}
                                </Button>
                              </div>

                              <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <label className="font-medium text-sm">Push Notifications</label>
                                  <p className="text-xs text-muted-foreground">Receive browser push notifications</p>
                                </div>
                                <Button
                                  variant={notificationSettings.pushNotifications ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => updateSetting('pushNotifications', !notificationSettings.pushNotifications)}
                                >
                                  {notificationSettings.pushNotifications ? "ON" : "OFF"}
                                </Button>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Content Moderation */}
                          <div>
                            <h4 className="font-medium mb-3">Content & Quality</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <label className="font-medium text-sm">Flagged Content Alerts</label>
                                  <p className="text-xs text-muted-foreground">Notifications when content is flagged for review</p>
                                </div>
                                <Button
                                  variant={notificationSettings.flaggedContentAlerts ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => updateSetting('flaggedContentAlerts', !notificationSettings.flaggedContentAlerts)}
                                >
                                  {notificationSettings.flaggedContentAlerts ? "ON" : "OFF"}
                                </Button>
                              </div>

                              <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <label className="font-medium text-sm">LLM Quality Alerts</label>
                                  <p className="text-xs text-muted-foreground">Notifications about AI model performance and quality issues</p>
                                </div>
                                <Button
                                  variant={notificationSettings.llmQualityAlerts ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => updateSetting('llmQualityAlerts', !notificationSettings.llmQualityAlerts)}
                                >
                                  {notificationSettings.llmQualityAlerts ? "ON" : "OFF"}
                                </Button>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Analytics & Reports */}
                          <div>
                            <h4 className="font-medium mb-3">Analytics & Reports</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <label className="font-medium text-sm">Analytics Reports</label>
                                  <p className="text-xs text-muted-foreground">Weekly and monthly analytics summaries</p>
                                </div>
                                <Button
                                  variant={notificationSettings.analyticsReports ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => updateSetting('analyticsReports', !notificationSettings.analyticsReports)}
                                >
                                  {notificationSettings.analyticsReports ? "ON" : "OFF"}
                                </Button>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Advanced Settings */}
                          <div>
                            <h4 className="font-medium mb-3">Advanced Settings</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <label className="font-medium text-sm">Security Alerts</label>
                                  <p className="text-xs text-muted-foreground">Notifications about security events and login attempts</p>
                                </div>
                                <Button variant="default" size="sm">
                                  ON
                                </Button>
                              </div>
                              
                              <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <label className="font-medium text-sm">Maintenance Notifications</label>
                                  <p className="text-xs text-muted-foreground">System maintenance and update notifications</p>
                                </div>
                                <Button variant="outline" size="sm">
                                  OFF
                                </Button>
                              </div>
                              
                              <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <label className="font-medium text-sm">User Activity Alerts</label>
                                  <p className="text-xs text-muted-foreground">Notifications about user registrations and activity</p>
                                </div>
                                <Button variant="default" size="sm">
                                  ON
                                </Button>
                              </div>
                              
                              <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <label className="font-medium text-sm">Performance Monitoring</label>
                                  <p className="text-xs text-muted-foreground">Server performance and response time alerts</p>
                                </div>
                                <Button variant="outline" size="sm">
                                  OFF
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>

                    {/* Save Button - Fixed at bottom */}
                    <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-background">
                      <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveSettings} className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}