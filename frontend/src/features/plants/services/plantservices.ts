import type { Plant, PlantFormData, PlantFilters } from '../types/PlantTypes';

// Mock data
const mockPlants: Plant[] = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    tags: ['houseplant', 'tropical', 'easy-care'],
    description: 'Popular houseplant with large, glossy leaves featuring distinctive holes.',
    careInstructions: 'Bright, indirect light. Water when top soil is dry.',
    dateAdded: new Date('2024-01-15'),
    lastModified: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    thumbnail: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de4?w=300&h=200&fit=crop',
    tags: ['houseplant', 'low-light', 'succulent'],
    description: 'Hardy succulent with upright, sword-like leaves.',
    careInstructions: 'Low to bright light. Water sparingly.',
    dateAdded: new Date('2024-01-10'),
    lastModified: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    thumbnail: 'https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=300&h=200&fit=crop',
    tags: ['houseplant', 'statement', 'finicky'],
    description: 'Trendy plant with large, violin-shaped leaves.',
    careInstructions: 'Bright, indirect light. Consistent watering schedule.',
    dateAdded: new Date('2024-01-05'),
    lastModified: new Date('2024-01-05'),
  },
];

class PlantService {
  private plants: Plant[] = [...mockPlants];

  async getAllPlants(): Promise<Plant[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.plants]), 100);
    });
  }

  async createPlant(data: PlantFormData): Promise<Plant> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPlant: Plant = {
          ...data,
          id: Date.now().toString(),
          dateAdded: new Date(),
          lastModified: new Date(),
        };
        this.plants.push(newPlant);
        resolve(newPlant);
      }, 200);
    });
  }

  async updatePlant(id: string, data: Partial<PlantFormData>): Promise<Plant | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.plants.findIndex(p => p.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }
        
        this.plants[index] = {
          ...this.plants[index],
          ...data,
          lastModified: new Date(),
        };
        resolve(this.plants[index]);
      }, 200);
    });
  }

  async deletePlant(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.plants.findIndex(p => p.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        
        this.plants.splice(index, 1);
        resolve(true);
      }, 200);
    });
  }

  async getAvailableTags(): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allTags = this.plants.flatMap(plant => plant.tags);
        const uniqueTags = Array.from(new Set(allTags)).sort();
        resolve(uniqueTags);
      }, 100);
    });
  }

  filterAndSortPlants(plants: Plant[], filters: PlantFilters): Plant[] {
    let filtered = [...plants];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(plant =>
        plant.name.toLowerCase().includes(searchLower) ||
        plant.scientificName.toLowerCase().includes(searchLower) ||
        plant.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(plant =>
        filters.tags.every(tag => plant.tags.includes(tag))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (filters.sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'scientificName':
          aValue = a.scientificName;
          bValue = b.scientificName;
          break;
        case 'dateAdded':
          aValue = a.dateAdded;
          bValue = b.dateAdded;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }
}

export const plantService = new PlantService();