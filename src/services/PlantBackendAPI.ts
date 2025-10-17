// API Configuration for Plant Identification Backend
// Add this to your frontend services
import { authService } from '@/features/auth/services/authService';

const API_BASE_URL = 'http://127.0.0.1:8000';

function buildHeaders(includeAuth = false, token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

async function handleResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', response.status, errorText);
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text();
}

export class PlantAPI {
  // Authentication endpoints
  static async login(credentials: { username: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: buildHeaders(false),
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  }

  // Plant identification endpoints for mobile app
  static async identifyPlant(imageFile: File, location: string = '', token?: string) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('location', location);

    const response = await fetch(`${API_BASE_URL}/api/plants/predict/`, {
      method: 'POST',
      // Do NOT set Content-Type for FormData; browser will set boundary
      headers: buildHeaders(false, token),
      credentials: 'include',
      body: formData,
    });
    return handleResponse(response);
  }

  // Admin dashboard endpoints
  static async getPlantIdentifications(token: string) {
    console.log('[PlantAPI] Fetching plant identifications with token:', token.substring(0, 20) + '...');
    const response = await fetch(`${API_BASE_URL}/api/plants/admin/identifications/`, {
      method: 'GET',
      headers: buildHeaders(true, token),
      credentials: 'include',
    });
    return handleResponse(response);
  }

  static async getDashboardStats(token: string) {
    console.log('[PlantAPI] Fetching dashboard stats with token:', token.substring(0, 20) + '...');
    const response = await fetch(`${API_BASE_URL}/api/plants/admin/stats/`, {
      method: 'GET',
      headers: buildHeaders(true, token),
      credentials: 'include',
    });
    return handleResponse(response);
  }

  static async getPlantSpecies(token?: string) {
    const response = await fetch(`${API_BASE_URL}/api/plants/species/`, {
      method: 'GET',
      headers: buildHeaders(true, token),
      credentials: 'include',
    });
    return handleResponse(response);
  }

  static async getRandomPlants(token?: string) {
    const response = await fetch(`${API_BASE_URL}/api/plants/random/`, {
      method: 'GET',
      headers: buildHeaders(true, token),
      credentials: 'include',
    });
    return handleResponse(response);
  }

  // Analytics endpoints
  static async getAnalyticsData(timeRange: string = 'month', search: string = '', token: string) {
    const params = new URLSearchParams({ time_range: timeRange, search });
    const response = await fetch(`${API_BASE_URL}/api/plants/analytics/?${params.toString()}`, {
      method: 'GET',
      headers: buildHeaders(true, token),
      credentials: 'include',
    });
    return handleResponse(response);
  }

  static async getTopSearched(timeRange: string = 'month', search: string = '', token?: string) {
    const params = new URLSearchParams({ time_range: timeRange, search });
    const response = await fetch(`${API_BASE_URL}/analytics/plants/top-searched/?${params.toString()}`, {
      method: 'GET',
      headers: buildHeaders(true, token),
      credentials: 'include',
    });
    return handleResponse(response);
  }

  static async getTimeSeries(timeRange: string = 'month', token?: string) {
    const params = new URLSearchParams({ time_range: timeRange });
    const response = await fetch(`${API_BASE_URL}/analytics/identifications/time-series/?${params.toString()}`, {
      method: 'GET',
      headers: buildHeaders(true, token),
      credentials: 'include',
    });
    return handleResponse(response);
  }

  static async getFlaggedCases(token?: string) {
    const response = await fetch(`${API_BASE_URL}/analytics/plants/flagged/`, {
      method: 'GET',
      headers: buildHeaders(true, token),
      credentials: 'include',
    });
    return handleResponse(response);
  }

  static async getSummary(timeRange: string = 'month', token?: string) {
    const params = new URLSearchParams({ time_range: timeRange });
    const response = await fetch(`${API_BASE_URL}/analytics/summary/?${params.toString()}`, {
      method: 'GET',
      headers: buildHeaders(true, token),
      credentials: 'include',
    });
    return handleResponse(response);
  }

  // New: Fetch identification history for a specific plant identification
  static async getPlantHistory(identificationId: number, token?: string) {
    const response = await fetch(`${API_BASE_URL}/admin/identifications/${identificationId}/history/`, {
      method: 'GET',
      headers: buildHeaders(true, token),
      credentials: 'include',
    });
    return handleResponse(response);
  }

  // Reports endpoint
  static async getReport(period: string = '30', reportType: string = 'summary', token?: string) {
    const params = new URLSearchParams({ period, type: reportType });
    const response = await fetch(`${API_BASE_URL}/api/plants/reports/?${params.toString()}`, {
      method: 'GET',
      headers: buildHeaders(true, token),
      credentials: 'include',
    });
    return handleResponse(response);
  }

  static async downloadReportCSV(period: string = '30', reportType: string = 'summary', token?: string) {
    const params = new URLSearchParams({ period, type: reportType, format: 'csv' });
    const response = await fetch(`${API_BASE_URL}/api/plants/reports/?${params.toString()}`, {
      method: 'GET',
      headers: buildHeaders(true, token),
      credentials: 'include',
    });
    return response.blob();
  }

  // Admin Saved Plants endpoint
  static async getAdminSavedPlants(search: string = '', userFilter: string = '', token: string) {
    const params = new URLSearchParams({ search, user: userFilter });
    const response = await fetch(`${API_BASE_URL}/api/plants/admin/saved-plants/?${params.toString()}`, {
      method: 'GET',
      headers: buildHeaders(true, token),
      credentials: 'include',
    });
    return handleResponse(response);
  }
}
