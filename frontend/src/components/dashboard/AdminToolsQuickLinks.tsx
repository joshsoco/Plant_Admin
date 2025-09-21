 import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Flag, 
  FileText, 
  Bot, 
  Database, 
  Settings, 
  Download,
  AlertTriangle,
  Eye,
  Trash2,
  RefreshCw
} from 'lucide-react';

export function AdminToolsQuickLinks() {
  const quickActions = [
    {
      title: 'Flagged Plants',
      description: 'Review and manage flagged plant identifications',
      icon: Flag,
      count: 23,
      variant: 'destructive' as const,
      actions: [
        { label: 'Review Flags', icon: Eye },
        { label: 'Clear Resolved', icon: Trash2 }
      ]
    },
    {
      title: 'System Logs',
      description: 'View application logs and error reports',
      icon: FileText,
      count: 156,
      variant: 'secondary' as const,
      actions: [
        { label: 'View Logs', icon: Eye },
        { label: 'Download', icon: Download }
      ]
    },
    {
      title: 'LLM Outputs',
      description: 'Monitor and approve AI-generated content',
      icon: Bot,
      count: 45,
      variant: 'default' as const,
      actions: [
        { label: 'Review Queue', icon: Eye },
        { label: 'Bulk Approve', icon: Settings }
      ]
    },
    {
      title: 'Cache Management',
      description: 'Manage cached plant data and results',
      icon: Database,
      count: 12,
      variant: 'outline' as const,
      actions: [
        { label: 'Clear Cache', icon: Trash2 },
        { label: 'Refresh', icon: RefreshCw }
      ]
    }
  ];

  const systemActions = [
    {
      title: 'System Health',
      description: 'Check system status and performance',
      icon: AlertTriangle,
      status: 'healthy',
      action: 'Monitor'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: Settings,
      status: 'active',
      action: 'Manage'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <Card className="bg-card dark:bg-card border-border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-foreground dark:text-white">
            Admin Quick Actions
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-gray-300">
            Manage critical system components and review pending items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {quickActions.map((action, index) => (
              <div 
                key={index}
                className="border border-border dark:border-gray-700 rounded-lg p-4 bg-background dark:bg-gray-800/50 hover:bg-muted/50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted dark:bg-gray-700">
                      <action.icon className="h-4 w-4 text-foreground dark:text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground dark:text-white text-sm">
                        {action.title}
                      </h3>
                      <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant={action.variant} className="text-xs">
                    {action.count}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  {action.actions.map((btn, btnIndex) => (
                    <Button
                      key={btnIndex}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-xs h-8"
                    >
                      <btn.icon className="h-3 w-3" />
                      {btn.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Management */}
      <Card className="bg-card dark:bg-card border-border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-foreground dark:text-white">
            System Management
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-gray-300">
            Core system administration and monitoring tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {systemActions.map((system, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 border border-border dark:border-gray-700 rounded-lg bg-background dark:bg-gray-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted dark:bg-gray-700">
                    <system.icon className="h-4 w-4 text-foreground dark:text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground dark:text-white text-sm">
                      {system.title}
                    </h3>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                      {system.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={system.status === 'healthy' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {system.status}
                  </Badge>
                  <Button variant="outline" size="sm" className="text-xs">
                    {system.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Actions */}
      <Card className="bg-card dark:bg-card border-border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-foreground dark:text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Emergency Actions
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-gray-300">
            Critical system controls - use with caution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Button variant="destructive" size="sm" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              System Maintenance Mode
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Restart Services
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export System Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}