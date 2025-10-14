import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { PlantAPI } from '@/services/PlantBackendAPI';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Camera, ChevronLeft, ChevronRight, Eye, Filter, MapPin, Search } from 'lucide-react';

// Backend type
interface BackendIdentification {
  id: number;
  user?: {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  } | null;
  species_id?: number;
  common_name?: string;
  scientific_name?: string;
  confidence?: number | null;
  location?: string | null;
  image_url?: string | null;
  identified_at: string | number;
  notes?: string | null;
  is_correct?: boolean | null;
}

const PlantIdentifications: React.FC = () => {
  const [identifications, setIdentifications] = useState<BackendIdentification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<BackendIdentification | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Load identifications
  useEffect(() => {
    const loadIdentifications = async () => {
      try {
        setLoading(true);
        const data = await PlantAPI.getPlantHistory();
        setIdentifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setIdentifications([]);
      } finally {
        setLoading(false);
      }
    };
    loadIdentifications();
  }, []);

  // Filter & search
  const filteredIdentifications = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return identifications.filter(record => {
      const username = record.user
        ? record.user.username || `${record.user.first_name || ''} ${record.user.last_name || ''}`.trim()
        : '';
      const species = record.common_name || record.scientific_name || '';
      const email = record.user?.email || '';

      const matchesSearch =
        !q ||
        username.toLowerCase().includes(q) ||
        species.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q);

      const status = record.is_correct === true ? 'confirmed' :
                     record.is_correct === false ? 'flagged' : 'pending';
      const matchesStatus = statusFilter === 'all' || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [identifications, statusFilter, debouncedSearch]);

  useEffect(() => setCurrentPage(1), [statusFilter, debouncedSearch]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredIdentifications.length / itemsPerPage));
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (filteredIdentifications.length === 0) setCurrentPage(1);
  }, [filteredIdentifications, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredIdentifications.length / itemsPerPage));
  const paginatedIdentifications = filteredIdentifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (isCorrect?: boolean | null) => {
    const status = isCorrect === true ? 'confirmed' : isCorrect === false ? 'flagged' : 'pending';
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      flagged: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return <Badge className={colors[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const getConfidenceColor = (confidence?: number | null) => {
    if (confidence == null) return 'text-gray-400';
    if (confidence >= 90) return 'text-green-600 dark:text-green-400';
    if (confidence >= 70) return 'text-yellow-600 dark:text-yellow-400';
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
          <h1 className="text-2xl font-bold text-foreground dark:text-white">Plant Identifications</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Manage user-uploaded plant photos and identification results ({identifications.length} total)
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5"/> Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by user, email, species, or location..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
            <div className="flex-shrink-0 w-28 sm:w-32">
              <select
                className="w-full rounded border px-2 py-2 bg-white dark:bg-slate-900 text-sm"
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Identification Records ({filteredIdentifications.length} results)</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredIdentifications.length === 0 ? (
            <div className="text-center py-8">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No plant identifications found</p>
              <p className="text-sm text-gray-400">
                {identifications.length === 0 ? "No users have uploaded plant photos yet" : "Try adjusting your search or filters"}
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
                  {paginatedIdentifications.map(record => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="h-12 w-12 overflow-hidden rounded border">
                          {record.image_url ? (
                            <img
                              src={record.image_url}
                              alt={`Plant photo by ${record.user?.username || 'user'}`}
                              className="h-full w-full object-cover"
                              onError={e => { (e.currentTarget as HTMLImageElement).src = '/placeholder-plant.jpg'; }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                              <Camera className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{record.user?.first_name && record.user?.last_name ? `${record.user.first_name} ${record.user.last_name}` : record.user?.username || 'Unknown User'}</div>
                          <div className="text-xs text-muted-foreground">{record.user?.email || ''}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{record.common_name || record.scientific_name || 'Unknown'}</div>
                        {record.location && <div className="text-xs text-muted-foreground">📍 {record.location}</div>}
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getConfidenceColor(record.confidence)}`}>{record.confidence != null ? Math.round(record.confidence) : '-'}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(record.is_correct)}</TableCell>
                      <TableCell>
                        <div className="text-sm">{(() => { const d = new Date(record.identified_at); return isNaN(d.getTime()) ? 'Invalid date' : format(d, 'MMM dd, yyyy'); })()}</div>
                        <div className="text-xs text-muted-foreground">{(() => { const d = new Date(record.identified_at); return isNaN(d.getTime()) ? '' : format(d, 'HH:mm'); })()}</div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(record)}>
                          <Eye className="h-4 w-4"/>
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
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredIdentifications.length)} of {filteredIdentifications.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                      <ChevronLeft className="h-4 w-4"/> Previous
                    </Button>
                    <span className="text-sm">Page {currentPage} of {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                      Next <ChevronRight className="h-4 w-4"/>
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
        <DialogContent className="w-full max-w-[1400px] min-w-[1000px] max-h-[90vh] h-[85vh] overflow-auto">
          {selectedRecord && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Camera className="h-5 w-5"/> Plant Identification Details</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Photo */}
                <div className="space-y-4">
                  <div className="aspect-square overflow-hidden rounded-lg border bg-gray-100 dark:bg-gray-800">
                    {selectedRecord.image_url ? (
                      <img src={selectedRecord.image_url} alt={`${selectedRecord.common_name || selectedRecord.scientific_name} by ${selectedRecord.user?.username || 'user'}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4 overflow-auto">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">Identification Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div><span className="text-muted-foreground">Confidence:</span><span className={`ml-2 font-medium ${getConfidenceColor(selectedRecord.confidence)}`}>{selectedRecord.confidence != null ? Math.round(selectedRecord.confidence) : '-'}</span></div>
                        <div><span className="text-muted-foreground">Status:</span><span className="ml-2">{getStatusBadge(selectedRecord.is_correct)}</span></div>
                      </div>

                      <div>
                        <span className="text-muted-foreground">Uploaded by:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{selectedRecord.user?.username?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback></Avatar>
                          <div>
                            <div className="font-medium">{selectedRecord.user?.first_name && selectedRecord.user?.last_name ? `${selectedRecord.user.first_name} ${selectedRecord.user.last_name}` : selectedRecord.user?.username || 'Unknown'}</div>
                            <div className="text-xs text-muted-foreground">{selectedRecord.user?.email || ''}</div>
                          </div>
                        </div>
                      </div>

                      {selectedRecord.location && (
                        <div>
                          <span className="text-muted-foreground">Location:</span>
                          <div className="mt-1 font-medium flex items-center gap-1"><MapPin className="h-3 w-3"/> {selectedRecord.location}</div>
                        </div>
                      )}

                      {selectedRecord.notes && (
                        <div>
                          <span className="text-muted-foreground">Notes:</span>
                          <div className="mt-1 text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">{selectedRecord.notes}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlantIdentifications;
