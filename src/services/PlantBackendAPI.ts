// API Configuration for Plant Identification Backend
// Add this to your frontend services
import { authService } from '@/features/auth/services/authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'; // Your Django backend URL

function buildHeaders(json = true, token?: string) {
  const access = token ?? authService?.getAccessToken?.();
  const headers: Record<string, string> = {};
  if (json) headers['Content-Type'] = 'application/json';
  if (access) headers['Authorization'] = `Bearer ${access}`;
  return headers;
}

async function handleResponse(response: Response) {
  const text = await response.text();
  let payload: any = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch (e) {
    // not JSON
    payload = text;
  }
  if (!response.ok) {
    const message = (payload && payload.detail) || (typeof payload === 'string' ? payload : JSON.stringify(payload)) || response.statusText;
    const err = new Error(`${response.status}: ${message}`);
    // attach original payload for callers who want structured error info
    (err as any).payload = payload;
    throw err;
  }
  return payload;
}

export class PlantAPI {
  // Authentication endpoints
  static async login(credentials: { username: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: buildHeaders(true),
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
  static async getPlantIdentifications(token?: string) {
    const response = await fetch(`${API_BASE_URL}/api/plants/admin/identifications/`, {
      method: 'GET',
      headers: buildHeaders(true, token),
      credentials: 'include',
    });
    return handleResponse(response);
  }

  static async getDashboardStats(token?: string) {
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
  static async getAnalyticsData(timeRange: string = 'month', search: string = '', token?: string) {
    const params = new URLSearchParams({ time_range: timeRange, search });
    const response = await fetch(`${API_BASE_URL}/analytics/?${params.toString()}`, {
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
}
