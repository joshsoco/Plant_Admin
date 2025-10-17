import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { PlantAPI } from '@/services/PlantBackendAPI';
import { authService } from '@/features/auth/services/authService';
import { useAuth } from '@/features/auth/context/AuthContext';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { ChevronLeft, ChevronRight, Filter, Search, Eye } from 'lucide-react';

interface BackendIdentification {
  id: number;
  user: {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  } | null;
  common_name?: string;
  scientific_name?: string;
  confidence?: number | null;
  image_url?: string | null;
  created_at?: string;
  identified_at?: string;
  is_correct?: boolean | null;
  location?: string;
  notes?: string;
}

const PlantIdentifications: React.FC = () => {
  const [identifications, setIdentifications] = useState<BackendIdentification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<BackendIdentification | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { user, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 'N/A' : format(date, 'MMM dd, yyyy');
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 'N/A' : format(date, 'HH:mm');
  };

  useEffect(() => {
    const loadIdentifications = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);

      try {
        const token = authService.getTokenData()?.accessToken;
        if (!token) {
          setError('No authentication token found');
          return;
        }

        console.log('[PlantIdentifications] Fetching with token:', token.substring(0, 20) + '...');
        const response = await PlantAPI.getPlantIdentifications(token);
        console.log('[PlantIdentifications] API Response:', response);

        if (response?.success && Array.isArray(response.identifications)) {
          setIdentifications(response.identifications);
          console.log('[PlantIdentifications] Loaded', response.identifications.length, 'identifications');
        } else {
          setError('Invalid response format from server');
          setIdentifications([]);
        }
      } catch (err: any) {
        console.error('[PlantIdentifications] Error:', err);
        setError(err.message || 'Failed to load identifications');
        setIdentifications([]);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading) {
      loadIdentifications();
    }
  }, [user, isLoading]);

  const filteredIdentifications = useMemo(() => {
    return identifications.filter((record) => {
      const username = record.user?.username ?? '';
      const email = record.user?.email ?? '';
      const commonName = record.common_name ?? '';

      const matchesSearch =
        username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase());

      const status = record.is_correct === true
        ? 'confirmed'
        : record.is_correct === false
        ? 'flagged'
        : 'pending';
      const matchesStatus = statusFilter === 'all' || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [identifications, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredIdentifications.length / itemsPerPage);
  const paginatedIdentifications = filteredIdentifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (isCorrect: boolean | null) => {
    const status = isCorrect === true ? 'confirmed' :
                   isCorrect === false ? 'flagged' : 'pending';
    
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      flagged: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };

    return (
      <Badge className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getConfidenceColor = (confidence?: number) => {
    if (confidence == null) return 'text-gray-500';
    if (confidence >= 0.9) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.7) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading plant identifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground dark:text-white">
            Plant Identifications
          </h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Manage user-uploaded plant photos and identification results ({identifications.length} total)
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Filter className="h-5 w-5" />
      Filters & Search
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
      {/* Search Input takes most of the space */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by user or species name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Status Select smaller */}
      <div className="w-48 sm:w-40">
        <Select
          value={statusFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setStatusFilter(e.target.value)
          }
          className="w-full"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="flagged">Flagged</option>
        </Select>
      </div>
    </div>
  </CardContent>
</Card>



      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Identification Records ({filteredIdentifications.length} results)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredIdentifications.length === 0 ? (
            <div className="text-center py-8">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No plant identifications found</p>
              <p className="text-sm text-gray-400">
                {identifications.length === 0 
                  ? "No users have uploaded plant photos yet" 
                  : "Try adjusting your search or filters"
                }
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Photo</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Species</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedIdentifications.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="h-12 w-12 overflow-hidden rounded border">
                          <img
                            src={record.image_url ?? '/placeholder-plant.jpg'}
                            alt={`Plant photo by ${record.user?.username ?? 'Unknown'}`}
                            className="h-full w-full object-cover"
                            onError={(e) => { e.currentTarget.src = '/placeholder-plant.jpg'; }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{record.user?.first_name && record.user?.last_name ? `${record.user.first_name} ${record.user.last_name}` : record.user?.username || 'Unknown User'}</div>
                          <div className="text-xs text-muted-foreground">{record.user?.email || ''}</div>
                        </div>
                      </TableCell>
                      <TableCell>{record.common_name ?? 'N/A'}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getConfidenceColor(record.confidence ?? undefined)}`}>
                          {record.confidence != null ? record.confidence.toFixed(2) + '%' : 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(record.is_correct ?? null)}</TableCell>
                      <TableCell>
  <div className="text-sm">{formatDate(record.identified_at)}</div>
  <div className="text-xs text-muted-foreground">{formatTime(record.identified_at)}</div>
</TableCell>

                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRecord(record)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredIdentifications.length)} of{' '}
                    {filteredIdentifications.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
  <DialogContent className="w-[95vw] lg:w-[90vw] max-w-none max-h-[95vh] overflow-auto p-6">
    {selectedRecord && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
        {/* Plant Image */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border bg-gray-100 dark:bg-gray-800">
            <img
              src={selectedRecord.image_url ?? '/placeholder-plant.jpg'}
              alt={`${selectedRecord.common_name ?? 'N/A'} by ${selectedRecord.user?.username ?? 'Unknown'}`}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Identification Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Species Name */}
              <div>
                <div className="text-lg font-semibold">
                  {selectedRecord.common_name ?? 'N/A'}
                </div>
              </div>

              {/* Confidence & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div>
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className={`ml-2 font-medium ${getConfidenceColor(selectedRecord.confidence ?? undefined)}`}>
                    {selectedRecord.confidence != null
                      ? Math.round(selectedRecord.confidence * 100) + '%'
                      : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className="ml-2">{getStatusBadge(selectedRecord.is_correct ?? null)}</span>
                </div>
              </div>

              {/* Uploaded By */}
              <div>
                <span className="text-muted-foreground">Uploaded by:</span>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {selectedRecord.user
                        ? ((selectedRecord.user.first_name?.[0] || '') + (selectedRecord.user.last_name?.[0] || '')).toUpperCase() ||
                          selectedRecord.user.username?.charAt(0).toUpperCase() ||
                          'U'
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {selectedRecord.user
                        ? (selectedRecord.user.first_name || selectedRecord.user.last_name
                            ? `${selectedRecord.user.first_name ?? ''} ${selectedRecord.user.last_name ?? ''}`.trim()
                            : selectedRecord.user.username ?? 'Unknown')
                        : 'Unknown'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {selectedRecord.user?.email ?? ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div>
                <span className="text-muted-foreground">Identified at:</span>
                <div className="mt-1 text-sm">
                  <span>{formatDate(selectedRecord.identified_at)}</span>{' '}
                  <span className="text-xs text-muted-foreground">{formatTime(selectedRecord.identified_at)}</span>
                </div>
              </div>

              {/* Location */}
              {selectedRecord.location && (
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <div className="mt-1 font-medium">{selectedRecord.location}</div>
                </div>
              )}

              {/* Notes */}
              {selectedRecord.notes && (
                <div>
                  <span className="text-muted-foreground">Notes:</span>
                  <div className="mt-1 text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    {selectedRecord.notes}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>


    </div>
  );
};

export default PlantIdentifications;
