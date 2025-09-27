import { plantService } from '../services/plant.service';
import { PlantFormData } from '../types/plant.types';

describe('PlantService', () => {
  beforeEach(() => {
    // Reset service state if needed
  });

  test('should get all plants', async () => {
    const plants = await plantService.getAllPlants();
    expect(plants).toBeInstanceOf(Array);
    expect(plants.length).toBeGreaterThan(0);
  });

  test('should create a new plant', async () => {
    const newPlantData: PlantFormData = {
      name: 'Test Plant',
      scientificName: 'Testus plantus',
      thumbnail: 'https://example.com/test.jpg',
      tags: ['test', 'houseplant'],
      description: 'A test plant',
      careInstructions: 'Water weekly',
    };

    const createdPlant = await plantService.createPlant(newPlantData);
    
    expect(createdPlant.id).toBeDefined();
    expect(createdPlant.name).toBe(newPlantData.name);
    expect(createdPlant.scientificName).toBe(newPlantData.scientificName);
    expect(createdPlant.dateAdded).toBeInstanceOf(Date);
  });

  test('should update an existing plant', async () => {
    const plants = await plantService.getAllPlants();
    const firstPlant = plants[0];
    
    const updatedData = {
      name: 'Updated Plant Name',
      description: 'Updated description',
    };

    const updatedPlant = await plantService.updatePlant(firstPlant.id, updatedData);
    
    expect(updatedPlant).not.toBeNull();
    expect(updatedPlant?.name).toBe(updatedData.name);
    expect(updatedPlant?.description).toBe(updatedData.description);
    expect(updatedPlant?.lastModified).toBeInstanceOf(Date);
  });

  test('should delete a plant', async () => {
    const plants = await plantService.getAllPlants();
    const initialCount = plants.length;
    const plantToDelete = plants[0];

    const deleted = await plantService.deletePlant(plantToDelete.id);
    
    expect(deleted).toBe(true);
    
    const plantsAfterDeletion = await plantService.getAllPlants();
    expect(plantsAfterDeletion.length).toBe(initialCount - 1);
  });

  test('should filter plants by search term', async () => {
    const plants = await plantService.getAllPlants();
    
    const filtered = plantService.filterAndSortPlants(plants, {
      search: 'monstera',
      tags: [],
      sortField: 'name',
      sortOrder: 'asc',
    });

    expect(filtered.length).toBeGreaterThan(0);
    expect(
      filtered.every(plant => 
        plant.name.toLowerCase().includes('monstera') ||
        plant.scientificName.toLowerCase().includes('monstera') ||
        plant.tags.some(tag => tag.toLowerCase().includes('monstera'))
      )
    ).toBe(true);
  });

  test('should filter plants by tags', async () => {
    const plants = await plantService.getAllPlants();
    
    const filtered = plantService.filterAndSortPlants(plants, {
      search: '',
      tags: ['houseplant'],
      sortField: 'name',
      sortOrder: 'asc',
    });

    expect(
      filtered.every(plant => plant.tags.includes('houseplant'))
    ).toBe(true);
  });

  test('should sort plants correctly', async () => {
    const plants = await plantService.getAllPlants();
    
    const sortedAsc = plantService.filterAndSortPlants(plants, {
      search: '',
      tags: [],
      sortField: 'name',
      sortOrder: 'asc',
    });

    const sortedDesc = plantService.filterAndSortPlants(plants, {
      search: '',
      tags: [],
      sortField: 'name',
      sortOrder: 'desc',
    });

    expect(sortedAsc[0].name <= sortedAsc[1].name).toBe(true);
    expect(sortedDesc[0].name >= sortedDesc[1].name).toBe(true);
  });
});