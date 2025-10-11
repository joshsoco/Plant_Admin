import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Users, 
  Leaf, 
  Activity, 
  Target, 
  Download, 
  FileSpreadsheet,
  FileJson,
  Calendar,
  Eye,
  Camera
} from 'lucide-react';
import { format } from 'date-fns';
import { PlantAPI } from '@/services/PlantBackendAPI';

interface ReportSummary {
  totalIdentifications: number;
  uniqueUsers: number;
  uniqueSpecies: number;
  successRate: number;
  confidenceDistribution: {
    high: number;
    medium: number;
    low: number;
  };
}

interface RecentIdentification {
  id: number;
  user: {
    username: string;
    email: string;
  };
  predicted_name: string;
  confidence_score: number;
  location: string;
  created_at: string;
  is_correct: boolean | null;
}

const ReportsSimple: React.FC = () => {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [recentIdentifications, setRecentIdentifications] = useState<RecentIdentification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('30');
  const [exporting, setExporting] = useState(false);

  // Load report data
  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load summary report
        const summaryResponse = await PlantAPI.getReportsData(dateRange, 'summary');
        if (summaryResponse.success) {
          setSummary(summaryResponse.report.summary);
        }
        
        // Load recent identifications
        const identificationsResponse = await PlantAPI.getPlantIdentifications();
        if (identificationsResponse.success) {
          setRecentIdentifications(identificationsResponse.identifications.slice(0, 10));
        }
        
      } catch (error) {
        console.error('Failed to load report data:', error);
        setError('Failed to load reports. Make sure backend is running.');
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [dateRange]);

  // Export data
  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setExporting(true);
      
      if (format === 'csv') {
        const blob = await PlantAPI.exportIdentificationData(dateRange, 'csv');
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plant_reports_${dateRange}days.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await PlantAPI.exportIdentificationData(dateRange, 'json');
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plant_reports_${dateRange}days.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  // Helper functions
  const getStatusBadge = (isCorrect: boolean | null) => {
    if (isCorrect === true) {
      return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
    } else if (isCorrect === false) {
      return <Badge className="bg-red-100 text-red-800">Reported Issue</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    const percentage = Math.round(confidence * 100);
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="w-full space-y-6 p-4 sm:p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Loading plant identification reports...</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full space-y-6 p-4 sm:p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Plant identification reports from mobile app</p>
        </div>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">⚠️ {error}</div>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Plant identification data from mobile app users
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={(value: string) => setDateRange(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button
              onClick={() => handleExport('csv')}
              disabled={exporting}
              variant="outline"
              size="sm"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              onClick={() => handleExport('json')}
              disabled={exporting}
              variant="outline"
              size="sm"
            >
              <FileJson className="h-4 w-4 mr-2" />
              JSON
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Photos</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalIdentifications}</div>
              <p className="text-xs text-muted-foreground">
                Last {dateRange} days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.uniqueUsers}</div>
              <p className="text-xs text-muted-foreground">
                Users uploaded photos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plant Species</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.uniqueSpecies}</div>
              <p className="text-xs text-muted-foreground">
                Different plants identified
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summary.successRate}%</div>
              <p className="text-xs text-muted-foreground">
                User confirmed correct
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Confidence Distribution */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>AI Confidence Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {summary.confidenceDistribution.high}
                </div>
                <div className="text-sm text-green-700">High Confidence (80%+)</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {summary.confidenceDistribution.medium}
                </div>
                <div className="text-sm text-yellow-700">Medium (50-80%)</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {summary.confidenceDistribution.low}
                </div>
                <div className="text-sm text-red-700">Low Confidence (&lt;50%)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Identifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Plant Photos from Mobile App
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentIdentifications.length === 0 ? (
            <div className="text-center py-8">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No plant photos uploaded yet</p>
              <p className="text-sm text-gray-400">
                Plant photos from mobile app users will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plant Identified</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentIdentifications.map((identification) => (
                    <TableRow key={identification.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{identification.user.username}</div>
                          <div className="text-xs text-muted-foreground">
                            {identification.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{identification.predicted_name}</div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getConfidenceColor(identification.confidence_score)}`}>
                          {Math.round(identification.confidence_score * 100)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        {identification.location || 'Not specified'}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(identification.is_correct)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(identification.created_at), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(identification.created_at), 'HH:mm')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Report Period: Last {dateRange} days</span>
            <span>•</span>
            <Eye className="h-4 w-4" />
            <span>Generated: {format(new Date(), 'MMM dd, yyyy HH:mm')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsSimple;