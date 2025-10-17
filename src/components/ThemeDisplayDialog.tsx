import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { useMotion } from '@/contexts/MotionContext';
import { Separator } from '@/components/ui/separator';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Zap, 
  ZapOff, 
  Palette,
  Accessibility,
  Info
} from 'lucide-react';

interface ThemeDisplayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThemeDisplayDialog({ open, onOpenChange }: ThemeDisplayDialogProps) {
  const { theme, setTheme } = useTheme();
  const { reduceMotion, setReduceMotion, shouldReduceMotion } = useMotion();

  const themeOptions = [
    {
      value: 'light',
      label: 'Light',
      description: 'Clean bright interface',
      icon: Sun,
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Easy on the eyes',
      icon: Moon,
    },
    {
      value: 'system',
      label: 'System',
      description: 'Follow device setting',
      icon: Monitor,
    },
  ];

  const currentThemeOption = themeOptions.find(option => option.value === theme);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Theme & Display
          </DialogTitle>
          <DialogDescription>
            Customize your visual experience and accessibility preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Appearance</Label>
            </div>
            
            <div className="grid gap-2">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.value;
                
                return (
                  <Button
                    key={option.value}
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full justify-start h-auto p-3 ${
                      isSelected 
                        ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" 
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setTheme(option.value as "light" | "dark" | "system")}
                  >
                    <Icon className={`h-4 w-4 mr-3 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                    <div className="text-left">
                      <div className={`font-medium ${isSelected ? "text-white" : "text-foreground"}`}>
                        {option.label}
                      </div>
                      <div className={`text-xs ${isSelected ? "text-blue-100" : "text-muted-foreground"}`}>
                        {option.description}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Motion Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Accessibility className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Motion & Accessibility</Label>
            </div>

            {/* Reduce Motion Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {reduceMotion ? (
                    <ZapOff className="h-4 w-4 text-orange-500" />
                  ) : (
                    <Zap className="h-4 w-4 text-green-500" />
                  )}
                  <div>
                    <Label className="text-sm font-medium cursor-pointer">
                      Reduce Motion
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Turns off animations and transitions for accessibility and performance
                    </p>
                  </div>
                </div>
                <Button
                  variant={reduceMotion ? "default" : "outline"}
                  size="sm"
                  onClick={() => setReduceMotion(!reduceMotion)}
                  className={`min-w-[30px] ${
                    reduceMotion 
                      ? "bg-orange-500 hover:bg-orange-600 text-white" 
                      : "hover:bg-muted"
                  }`}
                >
                  {reduceMotion ? "ON" : "OFF"}
                </Button>
              </div>

              {/* OS Setting Info */}
              {shouldReduceMotion && !reduceMotion && (
                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Your system preferences indicate you prefer reduced motion. 
                    This setting will still respect that preference.
                  </p>
                </div>
              )}

              {/* Current Status */}
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Status:</span> {
                  shouldReduceMotion 
                    ? "Animations disabled" 
                    : "Animations enabled"
                } • {
                  reduceMotion 
                    ? "User preference" 
                    : window.matchMedia('(prefers-reduced-motion: reduce)').matches 
                      ? "System preference" 
                      : "Default"
                }
              </div>
            </div>
          </div>

          <Separator />

          {/* Preview Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Preview</Label>
            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  currentThemeOption?.value === 'light' ? 'bg-yellow-400' :
                  currentThemeOption?.value === 'dark' ? 'bg-slate-600' :
                  'bg-gradient-to-r from-yellow-400 to-slate-600'
                }`} />
                <span className="text-sm">
                  {currentThemeOption?.label} theme • {shouldReduceMotion ? 'Motion reduced' : 'Motion enabled'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}