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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Eye,
  Check,
  Flag,
  Trash2,
  Search,
  Filter,
  MapPin,
  Camera,
  Calendar,
  User,
  FileImage,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Types for plant identification data
interface PlantIdentificationRecord {
  id: string;
  photoUrl: string;
  photoThumbnail: string;
  uploadedAt: Date;
  uploaderName: string;
  uploaderEmail: string;
  uploaderId: string;
  identifiedSpecies: {
    commonName: string;
    scientificName: string;
  };
  confidenceScore: number; // 0-1
  status: 'pending' | 'confirmed' | 'flagged';
  metadata: {
    fileSize: number; // bytes
    dimensions: { width: number; height: number };
    location?: { lat: number; lng: number; address?: string };
    deviceInfo?: string;
    capturedAt?: Date;
  };
  identificationHistory: Array<{
    timestamp: Date;
    action: string;
    adminUser?: string;
    notes?: string;
  }>;
  notes?: string;
}

interface BackendIdentification {
  id: number;
  user: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  predicted_name: string;
  confidence_score: number;
  confidence_percentage: string;
  location: string;
  image_url: string | null;
  created_at: string;
  notes: string;
  is_correct: boolean | null;
}

// Mock data - replace with API calls
const mockIdentifications: PlantIdentificationRecord[] = [
  {
    id: '1',
    photoUrl: '/api/photos/monstera-full.jpg',
    photoThumbnail: '/api/photos/monstera-thumb.jpg',
    uploadedAt: new Date(2024, 11, 15, 14, 30),
    uploaderName: 'Sarah Johnson',
    uploaderEmail: 'sarah.j@email.com',
    uploaderId: 'user_001',
    identifiedSpecies: {
      commonName: 'Monstera Deliciosa',
      scientificName: 'Monstera deliciosa',
    },
    confidenceScore: 0.973,
    status: 'confirmed',
    metadata: {
      fileSize: 2048576,
      dimensions: { width: 1920, height: 1080 },
      location: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' },
      deviceInfo: 'iPhone 14 Pro',
      capturedAt: new Date(2024, 11, 15, 14, 25),
    },
    identificationHistory: [
      {
        timestamp: new Date(2024, 11, 15, 14, 30),
        action: 'Uploaded',
      },
      {
        timestamp: new Date(2024, 11, 15, 14, 45),
        action: 'Confirmed',
        adminUser: 'admin@plantid.com',
        notes: 'Clear fenestrations visible, high confidence',
      },
    ],
    notes: 'Excellent photo quality with clear leaf features',
  },
  {
    id: '2',
    photoUrl: '/api/photos/fiddle-full.jpg',
    photoThumbnail: '/api/photos/fiddle-thumb.jpg',
    uploadedAt: new Date(2024, 11, 15, 12, 15),
    uploaderName: 'Dr. Michael Chen',
    uploaderEmail: 'mchen@university.edu',
    uploaderId: 'user_002',
    identifiedSpecies: {
      commonName: 'Fiddle Leaf Fig',
      scientificName: 'Ficus lyrata',
    },
    confidenceScore: 0.848,
    status: 'pending',
    metadata: {
      fileSize: 1524288,
      dimensions: { width: 1440, height: 1800 },
      deviceInfo: 'Samsung Galaxy S23',
    },
    identificationHistory: [
      {
        timestamp: new Date(2024, 11, 15, 12, 15),
        action: 'Uploaded',
      },
    ],
  },
  {
    id: '3',
    photoUrl: '/api/photos/snake-full.jpg',
    photoThumbnail: '/api/photos/snake-thumb.jpg',
    uploadedAt: new Date(2024, 11, 15, 10, 45),
    uploaderName: 'Emma Rodriguez',
    uploaderEmail: 'emma.r@gmail.com',
    uploaderId: 'user_003',
    identifiedSpecies: {
      commonName: 'Snake Plant',
      scientificName: 'Sansevieria trifasciata',
    },
    confidenceScore: 0.681,
    status: 'flagged',
    metadata: {
      fileSize: 892456,
      dimensions: { width: 1200, height: 900 },
      location: { lat: 34.0522, lng: -118.2437, address: 'Los Angeles, CA' },
    },
    identificationHistory: [
      {
        timestamp: new Date(2024, 11, 15, 10, 45),
        action: 'Uploaded',
      },
      {
        timestamp: new Date(2024, 11, 15, 11, 20),
        action: 'Flagged',
        adminUser: 'admin@plantid.com',
        notes: 'Low confidence score, unclear leaf patterns',
      },
    ],
    notes: 'Poor lighting conditions, recommend re-upload',
  },
];

const PlantIdentifications: React.FC = () => {
  const [identifications, setIdentifications] = useState<BackendIdentification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<BackendIdentification | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadIdentifications = async () => {
      try {
        const response = await PlantAPI.getPlantIdentifications();
        if (response.success) {
          setIdentifications(response.identifications);
        }
      } catch (error) {
        console.error('Failed to load identifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIdentifications();
  }, []);

  // Filter logic using real backend data
  const filteredIdentifications = useMemo(() => {
    return identifications.filter((record) => {
      const matchesSearch = 
        record.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.predicted_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Map backend is_correct field to frontend status
      const status = record.is_correct === true ? 'confirmed' : 
                   record.is_correct === false ? 'flagged' : 'pending';
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [identifications, statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredIdentifications.length / itemsPerPage);
  const paginatedIdentifications = filteredIdentifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper function to convert backend is_correct to status badge
  const getStatusBadge = (isCorrect: boolean | null) => {
    const status = isCorrect === true ? 'confirmed' : 
                 isCorrect === false ? 'flagged' : 'pending';
    
    const colors = {
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

  const getConfidenceColor = (confidence: number) => {
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
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by user or species name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
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
                    <TableHead>Identified Species</TableHead>
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
                          {record.image_url ? (
                            <img
                              src={record.image_url}
                              alt={`Plant photo by ${record.user.username}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-plant.jpg'; // Add a placeholder image
                              }}
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
                          <div className="font-medium">
                            {record.user.first_name && record.user.last_name 
                              ? `${record.user.first_name} ${record.user.last_name}`
                              : record.user.username
                            }
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {record.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{record.predicted_name}</div>
                        {record.location && (
                          <div className="text-xs text-muted-foreground">
                            📍 {record.location}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getConfidenceColor(record.confidence_score)}`}>
                          {Math.round(record.confidence_score * 100)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(record.is_correct)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(record.created_at), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(record.created_at), 'HH:mm')}
                        </div>
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

      {/* Detail Modal - Keep existing modal but use BackendIdentification data */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          {selectedRecord && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Plant Identification Details
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
                {/* Photo Section */}
                <div className="space-y-4">
                  <div className="aspect-square overflow-hidden rounded-lg border bg-gray-100 dark:bg-gray-800">
                    {selectedRecord.image_url ? (
                      <img
                        src={selectedRecord.image_url}
                        alt={`${selectedRecord.predicted_name} by ${selectedRecord.user.username}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                  {/* Identification Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Identification Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-lg font-semibold">
                          {selectedRecord.predicted_name}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-muted-foreground">Confidence:</span>
                          <span className={`ml-2 font-medium ${getConfidenceColor(selectedRecord.confidence_score)}`}>
                            {Math.round(selectedRecord.confidence_score * 100)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Status:</span>
                          <span className="ml-2">
                            {getStatusBadge(selectedRecord.is_correct)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-muted-foreground">Uploaded by:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {selectedRecord.user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {selectedRecord.user.first_name && selectedRecord.user.last_name 
                                ? `${selectedRecord.user.first_name} ${selectedRecord.user.last_name}`
                                : selectedRecord.user.username
                              }
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {selectedRecord.user.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      {selectedRecord.location && (
                        <div>
                          <span className="text-muted-foreground">Location:</span>
                          <div className="mt-1 font-medium flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {selectedRecord.location}
                          </div>
                        </div>
                      )}

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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlantIdentifications;

/*
API Integration Notes:

To replace mock data with real API calls:

1. Data fetching endpoint:
   GET /api/identifications?page=1&limit=10&status=all&search=""
   
   Response shape:
   {
     data: PlantIdentificationRecord[],
     pagination: {
       total: number,
       page: number,
       limit: number,
       totalPages: number
     }
   }

2. Action endpoints:
   PUT /api/identifications/${id}/confirm
   PUT /api/identifications/${id}/flag
   DELETE /api/identifications/${id}
   
   Request body for flag action:
   {
     notes?: string,
     reason?: string
   }

3. Photo serving:
   Replace photoUrl/photoThumbnail with:
   - photoUrl: `/api/photos/${id}/full`
   - photoThumbnail: `/api/photos/${id}/thumbnail`

4. Error handling:
   Add try-catch blocks around API calls and show toast notifications
   for errors using your preferred notification system.

5. Real-time updates:
   Consider adding WebSocket connections or periodic polling to update
   the list when other admins make changes.
*/