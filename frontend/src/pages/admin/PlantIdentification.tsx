import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
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
  const [identifications] = useState<PlantIdentificationRecord[]>(mockIdentifications);
  const [selectedRecord, setSelectedRecord] = useState<PlantIdentificationRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and search logic
  const filteredIdentifications = useMemo(() => {
    return identifications.filter((record) => {
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      const matchesSearch = 
        record.uploaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.identifiedSpecies.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.identifiedSpecies.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [identifications, statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredIdentifications.length / itemsPerPage);
  const paginatedIdentifications = filteredIdentifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: PlantIdentificationRecord['status']) => {
    const variants = {
      pending: 'default',
      confirmed: 'default',
      flagged: 'destructive',
    } as const;

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

  const handleAction = (action: string, recordId: string) => {
    console.log(`${action} action for record ${recordId}`);
    // In real implementation, make API calls here
    // Example API endpoints:
    // PUT /api/identifications/${recordId}/confirm
    // PUT /api/identifications/${recordId}/flag
    // DELETE /api/identifications/${recordId}
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground dark:text-white">
            Plant Identifications
          </h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Manage user-uploaded plant photos and identification results
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
                  placeholder="Search by uploader or species name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  aria-label="Search identifications"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40" aria-label="Filter by status">
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Uploader</TableHead>
                  <TableHead>Species</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedIdentifications.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 overflow-hidden rounded border bg-gray-100 dark:bg-gray-800">
                          <img
                            src={record.photoThumbnail}
                            alt={`Plant photo by ${record.uploaderName}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0OCA0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjQgNGMxMS4wNSAwIDIwITguOTUgMjAgMjBzLTguOTUgMjAtMjAgMjBTNCAzNS4wNSA0IDI0IDEyLjk1IDQgMjQgNHptMCAzNmM4LjgzNyAwIDE2LTcuMTYzIDE2LTE2UzMyLjgzNyA4IDI0IDggOCAxNS4xNjMgOCAyNHM3LjE2MyAxNiAxNiAxNnoiIGZpbGw9IiNjY2MiLz48L3N2Zz4=';
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {record.uploaderName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{record.uploaderName}</div>
                          <div className="text-xs text-muted-foreground">
                            ID: {record.uploaderId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">
                          {record.identifiedSpecies.commonName}
                        </div>
                        <div className="text-xs text-muted-foreground italic">
                          {record.identifiedSpecies.scientificName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${getConfidenceColor(record.confidenceScore)}`}>
                        {Math.round(record.confidenceScore * 100)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(record.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(record.uploadedAt, 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(record.uploadedAt, 'HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRecord(record)}
                          aria-label={`View details for ${record.identifiedSpecies.commonName}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {record.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction('confirm', record.id)}
                            aria-label={`Confirm ${record.identifiedSpecies.commonName}`}
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction('flag', record.id)}
                          aria-label={`Flag ${record.identifiedSpecies.commonName}`}
                        >
                          <Flag className="h-4 w-4 text-yellow-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAction('delete', record.id)}
                          aria-label={`Delete ${record.identifiedSpecies.commonName}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredIdentifications.length)} of{' '}
                {filteredIdentifications.length} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
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
                    <img
                      src={selectedRecord.photoUrl}
                      alt={`${selectedRecord.identifiedSpecies.commonName} by ${selectedRecord.uploaderName}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = selectedRecord.photoThumbnail;
                      }}
                    />
                  </div>
                  
                  {/* Photo Metadata */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileImage className="h-4 w-4" />
                        Photo Metadata
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Size:</span>
                          <div className="font-medium">
                            {formatFileSize(selectedRecord.metadata.fileSize)}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Dimensions:</span>
                          <div className="font-medium">
                            {selectedRecord.metadata.dimensions.width} × {selectedRecord.metadata.dimensions.height}
                          </div>
                        </div>
                        {selectedRecord.metadata.deviceInfo && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Device:</span>
                            <div className="font-medium">{selectedRecord.metadata.deviceInfo}</div>
                          </div>
                        )}
                        {selectedRecord.metadata.location && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Location:</span>
                            <div className="font-medium flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {selectedRecord.metadata.location.address || 
                               `${selectedRecord.metadata.location.lat.toFixed(4)}, ${selectedRecord.metadata.location.lng.toFixed(4)}`}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
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
                          {selectedRecord.identifiedSpecies.commonName}
                        </div>
                        <div className="text-muted-foreground italic">
                          {selectedRecord.identifiedSpecies.scientificName}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-muted-foreground">Confidence:</span>
                          <span className={`ml-2 font-medium ${getConfidenceColor(selectedRecord.confidenceScore)}`}>
                            {Math.round(selectedRecord.confidenceScore * 100)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Status:</span>
                          <span className="ml-2">
                            {getStatusBadge(selectedRecord.status)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-muted-foreground">Uploader:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {selectedRecord.uploaderName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{selectedRecord.uploaderName}</div>
                            <div className="text-xs text-muted-foreground">
                              {selectedRecord.uploaderEmail}
                            </div>
                          </div>
                        </div>
                      </div>

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

                  {/* Identification History */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-40">
                        <div className="space-y-3">
                          {selectedRecord.identificationHistory.map((entry, index) => (
                            <div key={index} className="flex items-start gap-3 text-sm">
                              <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{entry.action}</span>
                                  <span className="text-muted-foreground">
                                    {format(entry.timestamp, 'MMM dd, HH:mm')}
                                  </span>
                                </div>
                                {entry.adminUser && (
                                  <div className="text-muted-foreground text-xs">
                                    by {entry.adminUser}
                                  </div>
                                )}
                                {entry.notes && (
                                  <div className="text-muted-foreground text-xs mt-1">
                                    {entry.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {selectedRecord.status === 'pending' && (
                      <Button
                        onClick={() => {
                          handleAction('confirm', selectedRecord.id);
                          setSelectedRecord(null);
                        }}
                        className="flex-1"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Confirm
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleAction('flag', selectedRecord.id);
                        setSelectedRecord(null);
                      }}
                      className="flex-1"
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Flag
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleAction('delete', selectedRecord.id);
                        setSelectedRecord(null);
                      }}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
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