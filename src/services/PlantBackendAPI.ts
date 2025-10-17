// API Configuration for Plant Identification Backend
// Add this to your frontend services
import { authService } from '@/features/auth/services/authService';


const API_BASE_URL = 'http://127.0.0.1:8000'; // Your Django backend URL

export class PlantAPI {
  
  // Authentication endpoints
  static async login(credentials: { username: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    return response.json();
  }

  // Plant identification endpoints for mobile app
  static async identifyPlant(imageFile: File, location: string = '', token: string) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('location', location);

    const response = await fetch(`${API_BASE_URL}/api/plants/predict/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
      body: formData,
    });
    return response.json();
  }

  // Admin dashboard endpoints
  static async getPlantIdentifications(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/plants/admin/identifications/`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // <-- add token here
    },
  });
  return response.json();
}


  static async getDashboardStats(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/plants/admin/stats/`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // <-- add token here
    },
  });
  return response.json();
}

  static async getPlantSpecies() {
    const response = await fetch(`${API_BASE_URL}/api/plants/species/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return response.json();
  }

  static async getRandomPlants() {
    const response = await fetch(`${API_BASE_URL}/api/plants/random/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return response.json();
  }

  // Example for analytics data
static async getAnalyticsData(timeRange: string, search: string) {
    const token = authService.getAccessToken(); // get current access token

    const response = await fetch(
      `${API_BASE_URL}/api/plants/analytics/?time_range=${timeRange}&search=${search}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${response.status}: ${errorText}`);
    }

    return response.json();
  }


  static async getTopSearched(timeRange: string = 'month', search: string = '') {
    const params = new URLSearchParams({ time_range: timeRange, search });
    const response = await fetch(`${API_BASE_URL}/api/plants/analytics/plants/top-searched/?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return response.json();
  }

  static async getTimeSeries(timeRange: string = 'month') {
    const params = new URLSearchParams({ time_range: timeRange });
    const response = await fetch(`${API_BASE_URL}/api/plants/analytics/identifications/time-series/?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return response.json();
  }

  static async getFlaggedCases() {
    const response = await fetch(`${API_BASE_URL}/api/plants/analytics/plants/flagged/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return response.json();
  }

  static async getSummary(timeRange: string = 'month') {
    const params = new URLSearchParams({ time_range: timeRange });
    const response = await fetch(`${API_BASE_URL}/api/plants/analytics/summary/?${params}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return response.json();
  }

  // New: Fetch identification history for a specific plant identification
  static async getPlantHistory(identificationId: number) {
    const response = await fetch(`${API_BASE_URL}/api/plants/admin/identifications/${identificationId}/history/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return response.json();
  }
}
