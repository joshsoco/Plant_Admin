import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  SortAsc,
  SortDesc,
  Download,
  Leaf,
  X,
} from 'lucide-react';
import type { Plant, PlantFilters, SortField } from '../types/PlantTypes';
import { plantService } from '../services/plantservices';
import { PlantForm } from './PlantForm';

interface PlantDatabaseSidebarProps {
  className?: string;
}

export const PlantDatabaseSidebar: React.FC<PlantDatabaseSidebarProps> = ({
  className = '',
}) => {
  // State
  const [plants, setPlants] = useState<Plant[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [plantToDelete, setPlantToDelete] = useState<Plant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<PlantFilters>({
    search: '',
    tags: [],
    sortField: 'name',
    sortOrder: 'asc',
  });

  // Load data
  useEffect(() => {
    loadPlants();
    loadTags();
  }, []);

  const loadPlants = async () => {
    try {
      setIsLoading(true);
      const data = await plantService.getAllPlants();
      setPlants(data);
    } catch (error) {
      console.error('Failed to load plants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const tags = await plantService.getAvailableTags();
      setAvailableTags(tags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  // Filtered and sorted plants
  const filteredPlants = useMemo(() => {
    return plantService.filterAndSortPlants(plants, filters);
  }, [plants, filters]);

  // Handlers
  const handleAddPlant = () => {
    setSelectedPlant(null);
    setIsDialogOpen(true);
  };

  const handleEditPlant = (plant: Plant) => {
    setSelectedPlant(plant);
    setIsDialogOpen(true);
  };

  const handleDeletePlant = (plant: Plant) => {
    setPlantToDelete(plant);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      if (selectedPlant) {
        await plantService.updatePlant(selectedPlant.id, formData);
      } else {
        await plantService.createPlant(formData);
      }
      
      await loadPlants();
      await loadTags();
      setIsDialogOpen(false);
      setSelectedPlant(null);
    } catch (error) {
      console.error('Failed to save plant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!plantToDelete) return;

    try {
      setIsSubmitting(true);
      await plantService.deletePlant(plantToDelete.id);
      await loadPlants();
      await loadTags();
      setIsDeleteDialogOpen(false);
      setPlantToDelete(null);
    } catch (error) {
      console.error('Failed to delete plant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleTagFilter = (tag: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      tags: checked
        ? [...prev.tags, tag]
        : prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSortChange = (field: SortField) => {
    setFilters(prev => ({
      ...prev,
      sortField: field,
      sortOrder: prev.sortField === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      tags: [],
      sortField: 'name',
      sortOrder: 'asc',
    });
  };

  const exportPlants = () => {
    const dataStr = JSON.stringify(filteredPlants, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'plant-database.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className={`flex flex-col h-full bg-background border-r overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold">Plant Database</h2>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={exportPlants}
              disabled={filteredPlants.length === 0}
              title="Export plants"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleAddPlant}>
              <Plus className="h-4 w-4 mr-1" />
              Add Plant
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plants..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 mb-3">
          <Select
            value={filters.sortField}
            onChange={(e) => handleSortChange(e.target.value as SortField)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="scientificName">Scientific Name</SelectItem>
              <SelectItem value="dateAdded">Date Added</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setFilters(prev => ({
              ...prev,
              sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
            }))}
          >
            {filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>

        {/* Tag Filters */}
        {availableTags.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Filter by Tags
            </Label>
            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
              {availableTags.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-1 text-xs cursor-pointer"
                >
                  <Checkbox
                    checked={filters.tags.includes(tag)}
                    onCheckedChange={(checked) => handleTagFilter(tag, checked as boolean)}
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(filters.search || filters.tags.length > 0) && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Filters:</span>
              <Button size="sm" variant="ghost" onClick={clearFilters}>
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {filters.search && (
                <Badge variant="secondary">
                  Search: {filters.search}
                </Badge>
              )}
              {filters.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  Tag: {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="px-4 py-2 text-sm text-muted-foreground bg-muted/50">
        Showing {filteredPlants.length} of {plants.length} plants
      </div>

      {/* Plant List */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading plants...
            </div>
          ) : filteredPlants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {filters.search || filters.tags.length > 0 
                ? 'No plants match your filters'
                : 'No plants added yet'
              }
            </div>
          ) : (
            filteredPlants.map((plant) => (
              <Card key={plant.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <img
                      src={plant.thumbnail}
                      alt={plant.name}
                      className="w-16 h-16 rounded object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNmM2Y0ZjYiIHJ4PSI4Ii8+PHBhdGggZD0iTTI4IDI0aDh2NGgtOHptMCA4aDh2NGgtOHoiIGZpbGw9IiM5Y2EzYWYiLz48L3N2Zz4=';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm leading-tight mb-1">
                        {plant.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground italic mb-2">
                        {plant.scientificName}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {plant.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {plant.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{plant.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditPlant(plant)}
                        className="h-6 w-6 p-0"
                        title="Edit plant"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeletePlant(plant)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        title="Delete plant"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {plant.description && (
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {plant.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
          </div>
        </ScrollArea>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPlant ? 'Edit Plant' : 'Add New Plant'}
            </DialogTitle>
          </DialogHeader>
          <PlantForm
            plant={selectedPlant}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Plant</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete "{plantToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};