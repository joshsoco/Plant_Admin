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

  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = authService.getTokenData()?.accessToken;
        if (!token) throw new Error("No access token found");

        const response = await PlantAPI.getDashboardStats(token); // Pass token
        if (response.success) {
          setStats(response.stats);
        } else {
          console.error("Failed to load stats:", response);
        }
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
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

  if (!stats) {
    return <div>Failed to load dashboard metrics</div>;
  }

  const metrics = [
    {
      title: "Total Users",
      value: stats.total_users?.toLocaleString() || "0",
      change: "+12.3%", // Example, replace with real calculation
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
      title: "Popular Plants",
      value: stats.popular_plants?.length || "0",
      change: "+5.2%",
      trend: "up",
      description: "Top identified species",
      subtitle: stats.popular_plants?.[0]?.predicted_name || "No data",
      icon: Database,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/30"
    },
    {
      title: "System Status",
      value: "Active",
      change: "99.9%",
      trend: "up",
      description: "API uptime",
      subtitle: "All services operational",
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

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow bg-card dark:bg-card border border-border dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground dark:text-gray-300">
          {metric.title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${metric.bgColor}`}>
          <Icon className={`h-4 w-4 ${metric.color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-2">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground dark:text-white">
            {metric.value}
          </div>
          <div className={`flex items-center text-xs sm:text-sm px-2 py-1 rounded-full ${
            metric.trend === "up" 
              ? "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30" 
              : "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30"
          }`}>
            {metric.trend === "up" ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {metric.change}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-medium text-foreground dark:text-gray-200">
            {metric.description}
          </p>
          <p className="text-xs text-muted-foreground dark:text-gray-400">
            {metric.subtitle}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
