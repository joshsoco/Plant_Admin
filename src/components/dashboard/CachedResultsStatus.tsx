import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Database, TrendingUp, Eye, RefreshCw } from 'lucide-react';

interface CachedPlant {
  id: string;
  plantName: string;
  scientificName: string;
  hitCount: number;
  cacheSize: string;
  lastAccessed: string;
  popularity: number; // percentage
  cacheEfficiency: number; // percentage
}

export function CachedResultsStatus() {
  const cachedPlants: CachedPlant[] = [
    {
      id: "cache-001",
      plantName: "Monstera Deliciosa",
      scientificName: "Monstera deliciosa",
      hitCount: 1247,
      cacheSize: "2.8 MB",
      lastAccessed: "2 minutes ago",
      popularity: 95,
      cacheEfficiency: 98
    },
    {
      id: "cache-002",
      plantName: "Snake Plant",
      scientificName: "Sansevieria trifasciata",
      hitCount: 1089,
      cacheSize: "2.1 MB",
      lastAccessed: "5 minutes ago",
      popularity: 87,
      cacheEfficiency: 94
    },
    {
      id: "cache-003",
      plantName: "Pothos",
      scientificName: "Epipremnum aureum",
      hitCount: 956,
      cacheSize: "1.9 MB",
      lastAccessed: "8 minutes ago",
      popularity: 79,
      cacheEfficiency: 91
    },
    {
      id: "cache-004",
      plantName: "Fiddle Leaf Fig",
      scientificName: "Ficus lyrata",
      hitCount: 834,
      cacheSize: "3.2 MB",
      lastAccessed: "12 minutes ago",
      popularity: 71,
      cacheEfficiency: 88
    },
    {
      id: "cache-005",
      plantName: "Rubber Plant",
      scientificName: "Ficus elastica",
      hitCount: 721,
      cacheSize: "2.5 MB",
      lastAccessed: "18 minutes ago",
      popularity: 65,
      cacheEfficiency: 85
    }
  ];

  const totalCacheSize = cachedPlants.reduce((acc, plant) => {
    return acc + parseFloat(plant.cacheSize.replace(' MB', ''));
  }, 0);

  const totalHits = cachedPlants.reduce((acc, plant) => acc + plant.hitCount, 0);
  const averageEfficiency = cachedPlants.reduce((acc, plant) => acc + plant.cacheEfficiency, 0) / cachedPlants.length;

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return "bg-green-500 dark:bg-green-600";
    if (popularity >= 70) return "bg-blue-500 dark:bg-blue-600";
    if (popularity >= 50) return "bg-yellow-500 dark:bg-yellow-600";
    return "bg-gray-500 dark:bg-gray-600";
  };

  return (
    <Card className="bg-card dark:bg-card border-border dark:border-gray-700">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
          <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Cached Results Status
        </CardTitle>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground dark:text-gray-400">Total Size:</span>
            <span className="font-medium text-foreground dark:text-white">{totalCacheSize.toFixed(1)} MB</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground dark:text-gray-400">Total Hits:</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">{totalHits.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground dark:text-gray-400">Avg Efficiency:</span>
            <span className="font-medium text-green-600 dark:text-green-400">{averageEfficiency.toFixed(1)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cachedPlants.map((plant, index) => (
            <div 
              key={plant.id} 
              className="border border-border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <h4 className="font-medium text-foreground dark:text-white truncate">
                      {plant.plantName}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-gray-400 italic mb-2">
                    {plant.scientificName}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {plant.hitCount.toLocaleString()} hits
                    </span>
                    <span>{plant.cacheSize}</span>
                    <span>Last: {plant.lastAccessed}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {plant.cacheEfficiency}% efficient
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground dark:text-gray-400">Popularity</span>
                  <span className="font-medium text-foreground dark:text-white">{plant.popularity}%</span>
                </div>
                <Progress 
                  value={plant.popularity} 
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {cachedPlants.filter(p => p.cacheEfficiency >= 90).length}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">High Efficiency</div>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {cachedPlants.filter(p => p.hitCount > 1000).length}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">1K+ Hits</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {totalCacheSize.toFixed(0)} MB
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Total Cached</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground dark:text-gray-400">
              Top 5 most cached plants
            </span>
            <div className="flex gap-2">
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                Refresh Cache
              </button>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
                Manage All →
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}