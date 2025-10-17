import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlantAPI } from '@/services/PlantBackendAPI';
import { 
  Users, 
  Leaf, 
  Database, 
  CheckCircle,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { authService } from '@/features/auth/services/authService';

export function DashboardMetrics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const tokenData = authService.getTokenData();
        if (!tokenData?.accessToken) {
          console.error("[DashboardMetrics] No access token found");
          setError("Not authenticated. Please log in again.");
          // Optionally redirect to login
          // window.location.href = '/login';
          return;
        }
        
        console.log("[DashboardMetrics] Fetching with token:", tokenData.accessToken.substring(0, 20) + "...");
        
        const response = await PlantAPI.getDashboardStats(tokenData.accessToken);
        console.log("[DashboardMetrics] Response:", response);
        
        if (response.success && response.stats) {
          setStats(response.stats);
        } else {
          const errorMsg = response.error || "Failed to load data";
          console.error("[DashboardMetrics] API returned error:", errorMsg);
          
          // If user not found, clear auth and redirect
          if (response.code === 'user_not_found' || response.code === 'authentication_required') {
            authService.logout();
            window.location.href = '/login';
          }
          
          setError(errorMsg);
        }
      } catch (error: any) {
        console.error('[DashboardMetrics] Request failed:', error);
        
        // Check if it's an authentication error
        if (error.message?.includes('401')) {
          authService.logout();
          window.location.href = '/login';
        }
        
        setError(error.message || "Network error");
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-card dark:bg-card">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">Failed to load dashboard metrics: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Users",
      value: stats.total_users?.toLocaleString() || "0",
      change: "+12.3%",
      trend: "up",
      description: "Registered users",
      subtitle: "All platforms combined",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30"
    },
    {
      title: "Plant Identifications", 
      value: stats.total_identifications?.toLocaleString() || "0",
      change: "+18.7%",
      trend: "up",
      description: `${stats.recent_identifications || 0} this week`,
      subtitle: "Mobile & Web uploads",
      icon: Leaf,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/30"
    },
    {
      title: "Saved Plants",
      value: stats.total_saved_plants?.toLocaleString() || "0",
      change: "+5.2%",
      trend: "up",
      description: "User collections",
      subtitle: "Personal plant libraries",
      icon: Database,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/30"
    },
    {
      title: "Popular Species",
      value: stats.popular_plants?.length?.toString() || "0",
      change: "+8.1%",
      trend: "up",
      description: "Most identified",
      subtitle: stats.popular_plants?.[0]?.predicted_name || "No data",
      icon: CheckCircle,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/30"
    },
  ];

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} metric={metric} />
      ))}
    </div>
  );
}

function MetricCard({ metric }: { metric: any }) {
  const Icon = metric.icon;
  const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
  
  return (
    <Card className="bg-card dark:bg-card border-border dark:border-gray-700 hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground dark:text-white">
          {metric.title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${metric.bgColor}`}>
          <Icon className={`h-4 w-4 ${metric.color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold text-foreground dark:text-white">
            {metric.value}
          </div>
          <div className={`flex items-center text-xs font-medium ${
            metric.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}>
            <TrendIcon className="h-3 w-3 mr-1" />
            {metric.change}
          </div>
        </div>
        <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
          {metric.description}
        </p>
        <p className="text-xs text-muted-foreground dark:text-gray-500 mt-0.5 italic">
          {metric.subtitle}
        </p>
      </CardContent>
    </Card>
  );
}
