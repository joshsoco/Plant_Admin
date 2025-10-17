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
import { Button } from '@/components/ui/button';
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
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell, Pie, PieChart } from 'recharts';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Leaf,
  Award,
  Activity,
  Filter,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { PlantAPI } from '@/services/PlantBackendAPI';
import { authService } from '@/features/auth/services/authService';

interface ReportData {
  metadata: {
    report_period: string;
    generated: string;
    period_days: number;
    report_type: string;
  };
  summary: {
    total_identifications: number;
    active_users: number;
    plant_species_identified: number;
    success_rate: number;
    average_confidence: number;
  };
  confidence_breakdown: {
    high: number;
    medium: number;
    low: number;
  };
  top_species: Array<{
    scientific_name: string;
    common_name: string;
    count: number;
  }>;
  daily_trend: Array<{
    date: string;
    identifications: number;
  }>;
  top_users: Array<{
    user__username: string;
    user__email: string;
    count: number;
  }>;
  recent_identifications: Array<any>;
}

const ReportsPage: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [reportType, setReportType] = useState('summary');

  const fetchReport = async () => {
    setLoading(true);
    try {
      const token = authService.getTokenData()?.accessToken;
      const response = await fetch(
        `http://127.0.0.1:8000/api/plants/reports/?period=${period}&type=${reportType}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Failed to fetch report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [period, reportType]);

  const downloadCSV = async () => {
    try {
      const token = authService.getTokenData()?.accessToken;
      const response = await fetch(
        `http://127.0.0.1:8000/api/plants/reports/?period=${period}&type=${reportType}&format=csv`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plant_report_${format(new Date(), 'yyyyMMdd')}.csv`;
      a.click();
    } catch (error) {
      console.error('Failed to download CSV:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Generating report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return <div>No report data available</div>;
  }

  const confidenceChartData = [
    { name: 'High (≥80%)', value: reportData.confidence_breakdown.high, color: '#10b981' },
    { name: 'Medium (50-79%)', value: reportData.confidence_breakdown.medium, color: '#f59e0b' },
    { name: 'Low (<50%)', value: reportData.confidence_breakdown.low, color: '#ef4444' },
  ];

  return (
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground dark:text-white flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Plant Identification Reports
          </h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Comprehensive analytics and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchReport} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={downloadCSV} variant="default" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

     
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Identifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {reportData.summary.total_identifications.toLocaleString()}
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {reportData.summary.active_users.toLocaleString()}
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Species Identified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {reportData.summary.plant_species_identified.toLocaleString()}
              </div>
              <Leaf className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Top Species Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Identified Species</CardTitle>
          <CardDescription>Most frequently identified plants</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Scientific Name</TableHead>
                <TableHead>Common Name</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.top_species.map((species, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Badge variant={index < 3 ? 'default' : 'outline'}>
                      #{index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {species.scientific_name || 'N/A'}
                  </TableCell>
                  <TableCell>{species.common_name || 'N/A'}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {species.count}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Most Active Users</CardTitle>
          <CardDescription>Users with most identifications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Identifications</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.top_users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Badge variant={index < 3 ? 'default' : 'outline'}>
                      #{index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.user__username || 'N/A'}
                  </TableCell>
                  <TableCell>{user.user__email || 'N/A'}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {user.count}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;