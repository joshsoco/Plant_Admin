import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
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
import { TrendingUp, Search, Leaf, Filter, AlertTriangle, Eye } from 'lucide-react';
import { PlantAPI } from '@/services/PlantBackendAPI';
import { authService } from '@/features/auth/services/authService';

// Types
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

interface AnalyticsData {
  timeSeries: IdentificationTimeSeriesData[];
  topSearched: TopSearchedPlant[];
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

  // Load analytics with token refresh
  const loadAnalyticsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await PlantAPI.getAnalyticsData(timeRange, searchFilter);
      setAnalyticsData(response);
    } catch (err: any) {
      if (err.message.includes('401')) {
        try {
          await authService.ensureAccessToken(); // ✅ fixed
          const response = await PlantAPI.getAnalyticsData(timeRange, searchFilter);
          setAnalyticsData(response);
        } catch (refreshErr) {
          console.error('Unauthorized after refresh:', refreshErr);
          setError('Unauthorized. Please login again.');
        }
      } else {
        console.error('Analytics API error:', err);
        setError('Failed to load analytics data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, searchFilter]);

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600 dark:text-green-400';
    if (rate >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading) return <p className="text-muted-foreground">Loading plant analytics...</p>;
  if (error || !analyticsData)
    return (
      <div className="w-full space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Analytics</h3>
            <p className="text-muted-foreground">{error}</p>
            <button
              onClick={loadAnalyticsData}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );

  const topSearchedChartData = analyticsData.topSearched.slice(0, 8).map((plant) => ({
    name:
      plant.commonName.length > 15
        ? plant.commonName.substring(0, 15) + '...'
        : plant.commonName,
    count: plant.searchCount,
    successRate: plant.successRate,
  }));

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground dark:text-white">
          Analytics – Plants
        </h1>
        <p className="text-muted-foreground dark:text-gray-400">
          Plant identification insights and performance metrics
        </p>
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
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search plants..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            >
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

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Identifications</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.totalIdentifications.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time identifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.totalUniqueUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Users who uploaded photos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getSuccessRateColor(
                analyticsData.averageSuccessRate
              )}`}
            >
              {analyticsData.averageSuccessRate}%
            </div>
            <p className="text-xs text-muted-foreground">Correct identifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Area Chart */}
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
            <ChartContainer
              className="h-[300px] w-full"
              config={{ tooltip: {}, grid: {}, responsive: {} }}
            >
              <AreaChart data={analyticsData.timeSeries}>
                <defs>
                  <linearGradient id="fillIdentifications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
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
                  stroke="var(--chart-1)"
                  fill="url(#fillIdentifications)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="uniqueUsers"
                  stroke="var(--chart-2)"
                  fill="url(#fillUsers)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-green-600 dark:text-green-400" />
              Top Searched Plants
            </CardTitle>
            <CardDescription>Most popular plants by identification volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[300px] w-full"
              config={{ tooltip: {}, grid: {}, responsive: {} }}
            >
              <BarChart data={topSearchedChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPlant;
