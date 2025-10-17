import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Search,
  Heart,
  Users,
  Leaf,
  TrendingUp,
  Eye,
  User,
  Calendar,
  Database,
} from 'lucide-react';
import { PlantAPI } from '@/services/PlantBackendAPI';
import { authService } from '@/features/auth/services/authService';

interface SavedPlant {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    full_name: string;
  } | null;
  species_id: number;
  common_name: string;
  scientific_name: string;
  confidence: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Statistics {
  total_saved: number;
  unique_users: number;
  unique_species: number;
  top_plants: Array<{
    common_name: string;
    scientific_name: string;
    count: number;
  }>;
}

const SavedPlants: React.FC = () => {
  const [savedPlants, setSavedPlants] = useState<SavedPlant[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [selectedPlant, setSelectedPlant] = useState<SavedPlant | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    loadSavedPlants();
  }, [searchQuery, userFilter]);

  const loadSavedPlants = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = authService.getTokenData()?.accessToken;
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const response = await PlantAPI.getAdminSavedPlants(searchQuery, userFilter, token);
      console.log('[SavedPlants] Response:', response);

      if (response.success) {
        setSavedPlants(response.saved_plants);
        setStatistics(response.statistics);
      } else {
        setError('Failed to load saved plants');
      }
    } catch (err: any) {
      console.error('[SavedPlants] Error:', err);
      setError(err.message || 'Failed to load saved plants');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (plant: SavedPlant) => {
    setSelectedPlant(plant);
    setIsDetailOpen(true);
  };

  if (loading) {
    return (
      <div className="w-full p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Loading saved plants...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 space-y-6">
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-red-600 dark:text-red-400">Failed to load saved plants: {error}</p>
          <button
            onClick={() => loadSavedPlants()}
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
            <Heart className="h-6 w-6 text-red-500" />
            Saved Plants
          </h1>
          <p className="text-muted-foreground dark:text-gray-400">
            User collections and favorite plants
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Total Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.total_saved.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Plants saved by users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.unique_users.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Users with saved plants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-500" />
              Unique Species
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics?.unique_species.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Different plant species
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search plants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter by user..."
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Saved Plants */}
      {statistics && statistics.top_plants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Most Saved Plants
            </CardTitle>
            <CardDescription>Top 5 plants in user collections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statistics.top_plants.map((plant, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-900' :
                      index === 2 ? 'bg-orange-400 text-orange-900' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{plant.common_name}</div>
                      <div className="text-sm text-muted-foreground italic">
                        {plant.scientific_name}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {plant.count} saves
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Plants Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Saved Plants</CardTitle>
          <CardDescription>
            {savedPlants.length} plants across all users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plant</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Saved Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedPlants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No saved plants found
                  </TableCell>
                </TableRow>
              ) : (
                savedPlants.map((plant) => (
                  <TableRow key={plant.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {plant.user?.username?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {plant.user?.full_name || 'Unknown'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {plant.user?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{plant.common_name}</div>
                        <div className="text-sm text-muted-foreground italic">
                          {plant.scientific_name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {plant.confidence ? (
                        <Badge
                          variant={
                            plant.confidence >= 80 ? 'default' :
                            plant.confidence >= 50 ? 'secondary' : 'outline'
                          }
                        >
                          {plant.confidence.toFixed(1)}%
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(plant.created_at), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => handleViewDetails(plant)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Saved Plant Details</DialogTitle>
          </DialogHeader>
          {selectedPlant && (
            <div className="space-y-4">
              {selectedPlant.image_url && (
                <img
                  src={selectedPlant.image_url}
                  alt={selectedPlant.common_name}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-plant.png';
                  }}
                />
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Common Name</label>
                  <div className="text-lg font-semibold">{selectedPlant.common_name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Scientific Name</label>
                  <div className="text-lg font-semibold italic">{selectedPlant.scientific_name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Species ID</label>
                  <div className="text-lg">{selectedPlant.species_id}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Confidence</label>
                  <div className="text-lg">
                    {selectedPlant.confidence ? `${selectedPlant.confidence.toFixed(1)}%` : 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Saved By</label>
                  <div className="text-lg">{selectedPlant.user?.full_name || 'Unknown'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Saved Date</label>
                  <div className="text-lg">
                    {format(new Date(selectedPlant.created_at), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedPlants;