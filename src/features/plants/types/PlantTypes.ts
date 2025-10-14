export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  thumbnail: string;
  tags: string[];
  description?: string;
  careInstructions?: string;
  dateAdded: Date;
  lastModified: Date;
}

export interface PlantFormData {
  name: string;
  scientificName: string;
  thumbnail: string;
  tags: string[];
  description?: string;
  careInstructions?: string;
}

export type SortField = 'name' | 'scientificName' | 'dateAdded';
export type SortOrder = 'asc' | 'desc';

export interface PlantFilters {
  search: string;
  tags: string[];
  sortField: SortField;
  sortOrder: SortOrder;
}