import React, { useState, useMemo } from 'react';
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
  ResponsiveContainer,
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
} from 'lucide-react';

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
  successRate: number; // percentage of successful identifications
  averageConfidence: number;
}

interface FlaggedPlantCase {
  id: string;
  plantName: string;
  scientificName: string;
  flagCount: number;
  lastFlagged: Date;
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

// Mock analytics data - replace with API calls
const generateMockTimeSeriesData = (days: number): IdentificationTimeSeriesData[] => {
  const data: IdentificationTimeSeriesData[] = [];
  const baseCount = 150;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const variance = Math.random() * 100 - 50; // Random variance ±50
    const weekendFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1;
    
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      identifications: Math.round((baseCount + variance) * weekendFactor),
      uniqueUsers: Math.round(((baseCount + variance) * weekendFactor) * 0.3),
    });
  }
  
  return data;
};

const mockAnalyticsData: AnalyticsData = {
  timeSeries: generateMockTimeSeriesData(30),
  topSearched: [
    {
      id: '1',
      commonName: 'Monstera Deliciosa',
      scientificName: 'Monstera deliciosa',
      searchCount: 3247,
      successRate: 94.2,
      averageConfidence: 89.5,
    },
    {
      id: '2',
      commonName: 'Snake Plant',
      scientificName: 'Sansevieria trifasciata',
      searchCount: 2891,
      successRate: 96.8,
      averageConfidence: 92.1,
    },
    {
      id: '3',
      commonName: 'Fiddle Leaf Fig',
      scientificName: 'Ficus lyrata',
      searchCount: 2456,
      successRate: 87.3,
      averageConfidence: 81.7,
    },
    {
      id: '4',
      commonName: 'Pothos',
      scientificName: 'Epipremnum aureum',
      searchCount: 2234,
      successRate: 91.5,
      averageConfidence: 88.9,
    },
    {
      id: '5',
      commonName: 'Rubber Plant',
      scientificName: 'Ficus elastica',
      searchCount: 1987,
      successRate: 89.7,
      averageConfidence: 85.4,
    },
    {
      id: '6',
      commonName: 'Peace Lily',
      scientificName: 'Spathiphyllum wallisii',
      searchCount: 1743,
      successRate: 88.2,
      averageConfidence: 83.6,
    },
    {
      id: '7',
      commonName: 'Aloe Vera',
      scientificName: 'Aloe vera',
      searchCount: 1654,
      successRate: 93.4,
      averageConfidence: 91.8,
    },
    {
      id: '8',
      commonName: 'Boston Fern',
      scientificName: 'Nephrolepis exaltata',
      searchCount: 1432,
      successRate: 82.1,
      averageConfidence: 78.3,
    },
  ],
  flaggedCases: [
    {
      id: '1',
      plantName: 'Unknown Succulent',
      scientificName: 'Unidentified species',
      flagCount: 23,
      lastFlagged: new Date(2024, 11, 15, 10, 30),
      flagReasons: ['Low confidence', 'Conflicting IDs', 'Poor image quality'],
      status: 'pending',
    },
    {
      id: '2',
      plantName: 'Fiddle Leaf Fig Variant',
      scientificName: 'Ficus lyrata var.',
      flagCount: 18,
      lastFlagged: new Date(2024, 11, 14, 15, 45),
      flagReasons: ['Subspecies confusion', 'Regional variant'],
      status: 'reviewed',
    },
    {
      id: '3',
      plantName: 'Hybrid Orchid',
      scientificName: 'Orchidaceae hybrid',
      flagCount: 15,
      lastFlagged: new Date(2024, 11, 13, 9, 20),
      flagReasons: ['Hybrid identification', 'Multiple possible matches'],
      status: 'pending',
    },
    {
      id: '4',
      plantName: 'Cactus Species',
      scientificName: 'Cactaceae sp.',
      flagCount: 12,
      lastFlagged: new Date(2024, 11, 12, 14, 10),
      flagReasons: ['Similar species', 'Lighting issues'],
      status: 'resolved',
    },
    {
      id: '5',
      plantName: 'Wild Mushroom',
      scientificName: 'Fungi unknown',
      flagCount: 11,
      lastFlagged: new Date(2024, 11, 11, 11, 15),
      flagReasons: ['Not a plant', 'Category error'],
      status: 'resolved',
    },
  ],
  totalIdentifications: 47892,
  totalUniqueUsers: 8247,
  averageSuccessRate: 91.3,
};

type TimeRange = 'today' | 'week' | 'month' | 'custom';

const AnalyticsPlant: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [searchFilter, setSearchFilter] = useState('');

  // Filter data based on time range
  const filteredTimeSeriesData = useMemo(() => {
    const now = new Date();
    let cutoffDate: Date;

    switch (timeRange) {
      case 'today':
        cutoffDate = subDays(now, 1);
        break;
      case 'week':
        cutoffDate = subWeeks(now, 1);
        break;
      case 'month':
        cutoffDate = subMonths(now, 1);
        break;
      default:
        return mockAnalyticsData.timeSeries;
    }

    return mockAnalyticsData.timeSeries.filter(item => 
      isAfter(new Date(item.date), cutoffDate)
    );
  }, [timeRange]);

  // Filter top searched plants based on search
  const filteredTopSearched = useMemo(() => {
    if (!searchFilter) return mockAnalyticsData.topSearched;
    
    return mockAnalyticsData.topSearched.filter(plant =>
      plant.commonName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [searchFilter]);

  // Filter flagged cases based on search
  const filteredFlaggedCases = useMemo(() => {
    if (!searchFilter) return mockAnalyticsData.flaggedCases;
    
    return mockAnalyticsData.flaggedCases.filter(case_ =>
      case_.plantName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      case_.scientificName.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [searchFilter]);

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600 dark:text-green-400';
    if (rate >= 90) return 'text-blue-600 dark:text-blue-400';
    if (rate >= 85) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusBadge = (status: FlaggedPlantCase['status']) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    };

    return (
      <Badge className={variants[status]}>
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

  const topSearchedChartData = filteredTopSearched.slice(0, 8).map(plant => ({
    name: plant.commonName,
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
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Identifications</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground dark:text-white">
              {mockAnalyticsData.totalIdentifications.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +18.2% from last month
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
              {mockAnalyticsData.totalUniqueUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {mockAnalyticsData.averageSuccessRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
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
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredTimeSeriesData}>
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
                    tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
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
              </ResponsiveContainer>
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
              Most popular plants by search volume
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
              <ResponsiveContainer width="100%" height="100%">
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
              </ResponsiveContainer>
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
                  {filteredTopSearched.slice(0, 6).map((plant) => (
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
            Plants with identification issues requiring review
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                {filteredFlaggedCases.map((case_) => (
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
                      {format(case_.lastFlagged, 'MMM dd, HH:mm')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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