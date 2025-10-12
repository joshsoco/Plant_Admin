import React, { useState, useMemo, useEffect } from 'react';
import { format, subDays, subWeeks, subMonths, isAfter } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Search,
  Flag,
  Leaf,
  Calendar,
  Filter,
  AlertTriangle,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { PlantAPI } from '@/services/PlantBackendAPI';

// TypeScript interfaces for analytics data
interface IdentificationTimeSeriesData {
  date: string;
  identifications: number;
  uniqueUsers: number;
}

interface TopSearchedPlant {
  id: string;
  commonName: string;
  scientificName: string;
  searchCount: number;
  successRate: number;
  averageConfidence: number;
}

interface FlaggedPlantCase {
  id: string;
  plantName: string;
  scientificName: string;
  flagCount: number;
  lastFlagged: string;
  flagReasons: string[];
  status: 'pending' | 'reviewed' | 'resolved';
}

interface AnalyticsData {
  timeSeries: IdentificationTimeSeriesData[];
  topSearched: TopSearchedPlant[];
  flaggedCases: FlaggedPlantCase[];
  totalIdentifications: number;
  totalUniqueUsers: number;
  averageSuccessRate: number;
}

type TimeRange = 'today' | 'week' | 'month' | 'custom';

const AnalyticsPlant: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [searchFilter, setSearchFilter] = useState('');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load analytics data from backend
  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await PlantAPI.getAnalyticsData(timeRange, searchFilter);
        if (response.timeSeries || response.topSearched) {
          setAnalyticsData(response);
        } else if (response.data) {
          setAnalyticsData(response.data);
        } else {
          setError('Failed to load analytics data');
        }
      } catch (err) {
        console.error('Analytics loading error:', err);
        setError('Failed to connect to analytics API');
      } finally {
        setLoading(false);
      }
    };
    loadAnalyticsData();
  }, [timeRange, searchFilter]);

  // Helper functions
  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600 dark:text-green-400';
    if (rate >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    };

    const icons = {
      pending: Clock,
      reviewed: Eye,
      resolved: CheckCircle,
    };

    const Icon = icons[status as keyof typeof icons];

    return (
      <Badge className={`flex items-center gap-1 ${colors[status as keyof typeof colors]}`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const chartConfig = {
    identifications: {
      label: "Identifications",
      color: "hsl(var(--chart-1))",
    },
    uniqueUsers: {
      label: "Unique Users",
      color: "hsl(var(--chart-2))",
    },
  };

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-foreground dark:text-white">
              Analytics – Plants
            </h1>
            <p className="text-muted-foreground dark:text-gray-400">
              Loading plant identification insights...
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="w-full space-y-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-foreground dark:text-white">
              Analytics – Plants
            </h1>
            <p className="text-muted-foreground dark:text-gray-400">
              Plant identification insights and performance metrics
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Analytics</h3>
            <p className="text-muted-foreground">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const topSearchedChartData = analyticsData.topSearched.slice(0, 8).map(plant => ({
    name: plant.commonName.length > 15 ? plant.commonName.substring(0, 15) + '...' : plant.commonName,
    count: plant.searchCount,
    successRate: plant.successRate,
  }));

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground dark:text-white">
            Analytics – Plants
          </h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Plant identification insights and performance metrics
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Time Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search plants..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {/* Only one Select component, no nesting */}
            <Select value={timeRange} onValueChange={value => setTimeRange(value as TimeRange)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Identifications</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground dark:text-white">
              {analyticsData?.totalIdentifications?.toLocaleString() ?? '—'}
            </div>
            <p className="text-xs text-muted-foreground">
              All time identifications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground dark:text-white">
              {analyticsData.totalUniqueUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Users who uploaded photos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getSuccessRateColor(analyticsData.averageSuccessRate)}`}>
              {analyticsData.averageSuccessRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              Correct identifications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Identifications Over Time */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Plant Identifications Over Time
            </CardTitle>
            <CardDescription>
              Daily identification volume and unique users ({timeRange} view)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={analyticsData.timeSeries}>
                <defs>
                  <linearGradient id="fillIdentifications" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-identifications)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-identifications)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-uniqueUsers)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-uniqueUsers)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                />
                <Area
                  type="monotone"
                  dataKey="identifications"
                  stroke="var(--color-identifications)"
                  fill="url(#fillIdentifications)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="uniqueUsers"
                  stroke="var(--color-uniqueUsers)"
                  fill="url(#fillUsers)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Searched Plants Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-green-600 dark:text-green-400" />
              Top Searched Plants
            </CardTitle>
            <CardDescription>
              Most popular plants by identification volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                count: {
                  label: "Search Count",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px] w-full"
            >
              <BarChart data={topSearchedChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 10 }}
                  width={80}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="count" 
                  fill="var(--color-count)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Searched Plants Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
              Plant Search Details
            </CardTitle>
            <CardDescription>
              Success rates and confidence scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plant</TableHead>
                    <TableHead className="text-right">Searches</TableHead>
                    <TableHead className="text-right">Success Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.topSearched.slice(0, 6).map((plant) => (
                    <TableRow key={plant.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{plant.commonName}</div>
                          <div className="text-xs text-muted-foreground italic">
                            {plant.scientificName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {plant.searchCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-medium text-sm ${getSuccessRateColor(plant.successRate)}`}>
                          {plant.successRate}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flagged Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            Most Flagged Plant Cases
          </CardTitle>
          <CardDescription>
            Plants with identification issues requiring review ({analyticsData.flaggedCases.length} cases)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsData.flaggedCases.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-gray-500">No flagged cases found</p>
              <p className="text-sm text-gray-400">All plant identifications are performing well!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plant</TableHead>
                    <TableHead>Flag Count</TableHead>
                    <TableHead>Reasons</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Flagged</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.flaggedCases.map((case_) => (
                    <TableRow key={case_.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{case_.plantName}</div>
                          <div className="text-xs text-muted-foreground italic">
                            {case_.scientificName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="font-medium">{case_.flagCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {case_.flagReasons.slice(0, 2).map((reason, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                          {case_.flagReasons.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{case_.flagReasons.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(case_.status)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(case_.lastFlagged), 'MMM dd, HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPlant;

/*
API Integration Notes:

To replace mock data with real API calls:

1. Analytics Data Endpoint:
   GET /api/analytics/plants?timeRange={timeRange}&search={searchFilter}
   
   Response shape:
   {
     timeSeries: IdentificationTimeSeriesData[],
     topSearched: TopSearchedPlant[],
     flaggedCases: FlaggedPlantCase[],
     totalIdentifications: number,
     totalUniqueUsers: number,
     averageSuccessRate: number
   }

2. Time Series Endpoint:
   GET /api/analytics/identifications/time-series?range={timeRange}
   
3. Top Plants Endpoint:
   GET /api/analytics/plants/top-searched?limit=20&search={searchFilter}

4. Flagged Cases Endpoint:
   GET /api/analytics/plants/flagged?search={searchFilter}

5. Summary Stats Endpoint:
   GET /api/analytics/summary?timeRange={timeRange}

6. Error Handling:
   Add try-catch blocks around API calls and show loading states
   with skeleton components for better UX.

7. Real-time Updates:
   Consider WebSocket connections for live analytics updates
   or implement periodic refresh every 5-10 minutes.

8. Performance:
   Implement data caching and pagination for large datasets.
   Consider using React Query or SWR for data fetching.
*/