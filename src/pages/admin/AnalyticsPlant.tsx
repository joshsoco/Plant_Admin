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
  Leaf,
  Eye,
  AlertTriangle,
  BarChart3,
  Users,
  Clock,
  Image as ImageIcon,
  Calendar,
} from 'lucide-react';
import { authService } from '@/features/auth/services/authService';

interface AnalyticsData {
  success: boolean;
  timeSeries: Array<{
    date: string;
    identifications: number;
    uniqueUsers: number;
  }>;
  topSearched: Array<{
    id: string;
    commonName: string;
    scientificName: string;
    searchCount: number;
    successRate: number;
    averageConfidence: number;
  }>;
  flaggedCases: Array<{
    id: string;
    plantName: string;
    scientificName: string;
    flagCount: number;
    lastFlagged: string;
    flagReasons: string[];
    status: string;
  }>;
  recentUploads?: Array<{
    id: number;
    common_name: string;
    scientific_name: string;
    confidence: number;
    image_url: string;
    identified_at: string;
    user: {
      username: string;
      email: string;
    } | null;
  }>;
  totalIdentifications: number;
  totalUniqueUsers: number;
  averageSuccessRate: number;
}

const AnalyticsPlant: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('month');
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, searchFilter]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = authService.getTokenData()?.accessToken;
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const params = new URLSearchParams({
        time_range: timeRange,
        search: searchFilter,
      });

      const response = await fetch(
        `http://127.0.0.1:8000/api/plants/analytics/?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      console.log('[AnalyticsPlant] Response:', data);

      if (data.success) {
        setAnalyticsData(data);
      } else {
        setError('Failed to load analytics data');
      }
    } catch (err: any) {
      console.error('[AnalyticsPlant] Error:', err);
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="w-full p-6 space-y-6">
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">
            Failed to load analytics: {error}
          </p>
          <button
            onClick={() => loadAnalytics()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground dark:text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Real-Time Analytics
          </h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Live monitoring of plant identification performance and trends
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Active Identifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {analyticsData.totalIdentifications.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              In selected time range
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {analyticsData.totalUniqueUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique users contributing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Leaf className="h-4 w-4 text-purple-500" />
              Accuracy Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {analyticsData.averageSuccessRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successful identifications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time Series Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Activity Trend Over Time
          </CardTitle>
          <CardDescription>
            Real-time tracking of identifications and user engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              identifications: {
                label: 'Identifications',
                color: 'hsl(var(--chart-1))',
              },
              uniqueUsers: {
                label: 'Unique Users',
                color: 'hsl(var(--chart-2))',
              },
            }}
            className="h-[350px] w-full"
          >
            <AreaChart data={analyticsData.timeSeries}>
              <defs>
                <linearGradient id="colorId" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => format(new Date(value), 'MM/dd')}
                className="text-xs"
              />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="identifications"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorId)"
              />
              <Area
                type="monotone"
                dataKey="uniqueUsers"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Plants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Recent Plant Uploads
          </CardTitle>
          <CardDescription>Latest plant identifications with details</CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsData.recentUploads && analyticsData.recentUploads.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.recentUploads.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Plant Image */}
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {upload.image_url ? (
                      <img
                        src={upload.image_url}
                        alt={upload.common_name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23e5e7eb" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Plant Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate">
                          {upload.common_name || 'Unknown Plant'}
                        </h4>
                        <p className="text-sm text-muted-foreground italic truncate">
                          {upload.scientific_name || 'Not identified'}
                        </p>
                        {upload.user && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploaded by: <span className="font-medium">{upload.user.username}</span>
                          </p>
                        )}
                      </div>

                      {/* Confidence Badge */}
                      <div className="flex-shrink-0">
                        <Badge
                          variant={
                            upload.confidence >= 80 ? 'default' :
                            upload.confidence >= 50 ? 'secondary' : 'destructive'
                          }
                          className={
                            upload.confidence >= 80 ? 'bg-green-500' :
                            upload.confidence >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }
                        >
                          {upload.confidence.toFixed(1)}% confidence
                        </Badge>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(upload.identified_at), 'MMM dd, yyyy • HH:mm')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent uploads in the selected time range</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Flagged Cases */}
      {analyticsData.flaggedCases.length > 0 && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Issues Requiring Attention
            </CardTitle>
            <CardDescription>
              Low-confidence identifications ({analyticsData.flaggedCases.length} pending review)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plant</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Detected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData.flaggedCases.slice(0, 5).map((case_) => (
                  <TableRow key={case_.id} className="hover:bg-orange-50 dark:hover:bg-orange-900/10">
                    <TableCell>
                      <div>
                        <div className="font-medium">{case_.plantName}</div>
                        <div className="text-xs text-muted-foreground italic">
                          {case_.scientificName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {case_.flagReasons.map((reason, i) => (
                        <Badge key={i} variant="outline" className="mr-1 border-orange-300 text-orange-700">
                          {reason}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive" className="bg-orange-500">
                        {case_.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(case_.lastFlagged), 'MMM dd, HH:mm')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {analyticsData.flaggedCases.length > 5 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  +{analyticsData.flaggedCases.length - 5} more cases to review
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
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