import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Leaf, User, TrendingUp } from 'lucide-react';

interface PlantIdentification {
  id: string;
  userName: string;
  userAvatar?: string;
  plantName: string;
  confidence: number;
  timestamp: string;
  location?: string;
  platform: 'web' | 'mobile';
}

export function RecentActivity() {
  const recentIdentifications: PlantIdentification[] = [
    {
      id: "1",
      userName: "Sarah Johnson",
      userAvatar: "/avatars/sarah.jpg",
      plantName: "Monstera Deliciosa",
      confidence: 97.3,
      timestamp: "2 minutes ago",
      location: "New York, USA",
      platform: "mobile"
    },
    {
      id: "2",
      userName: "Dr. Michael Chen",
      plantName: "Fiddle Leaf Fig",
      confidence: 94.8,
      timestamp: "5 minutes ago",
      location: "California, USA",
      platform: "web"
    },
    {
      id: "3",
      userName: "Emma Rodriguez",
      plantName: "Snake Plant",
      confidence: 98.1,
      timestamp: "8 minutes ago",
      location: "Texas, USA",
      platform: "mobile"
    },
    {
      id: "4",
      userName: "James Wilson",
      plantName: "Pothos",
      confidence: 92.5,
      timestamp: "12 minutes ago",
      location: "Florida, USA",
      platform: "web"
    },
    {
      id: "5",
      userName: "Lisa Park",
      plantName: "Rubber Plant",
      confidence: 96.2,
      timestamp: "15 minutes ago",
      location: "Washington, USA",
      platform: "mobile"
    }
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (confidence >= 85) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'mobile' ? '📱' : '💻';
  };

  return (
    <Card className="bg-card dark:bg-card border-border dark:border-gray-700">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
          <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
          Recent Plant Identifications
        </CardTitle>
        <p className="text-sm text-muted-foreground dark:text-gray-300">
          Latest activity from users across all platforms
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentIdentifications.map((identification, index) => (
            <div 
              key={identification.id} 
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={identification.userAvatar} alt={identification.userName} />
                <AvatarFallback className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  {identification.userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-foreground dark:text-white truncate">
                    {identification.userName}
                  </span>
                  <span className="text-xs">
                    {getPlatformIcon(identification.platform)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Leaf className="h-3 w-3 text-green-600 dark:text-green-400" />
                  <span className="text-foreground dark:text-gray-200 font-medium">
                    {identification.plantName}
                  </span>
                </div>
                {identification.location && (
                  <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                    📍 {identification.location}
                  </p>
                )}
              </div>
              
              <div className="flex flex-col items-end space-y-1">
                <Badge className={getConfidenceColor(identification.confidence)}>
                  {identification.confidence}% confidence
                </Badge>
                <span className="text-xs text-muted-foreground dark:text-gray-400">
                  {identification.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground dark:text-gray-400">
              Showing latest 5 identifications
            </span>
            <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
              View all →
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}