// API Configuration for Plant Identification Backend
// src/services/PlantAPI.ts
const API_BASE_URL = 'http://127.0.0.1:8000';

export class PlantAPI {
  // -------------------------------
  // 🌿 DASHBOARD STATS
  // -------------------------------
  static async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/api/plants/admin/stats/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to load dashboard stats');
    }

    return response.json();
  }

  // -------------------------------
  // 🌿 PLANT IDENTIFICATIONS / HISTORY
  // -------------------------------
  static async getPlantHistory(userId: number = 1) {
    const response = await fetch(`${API_BASE_URL}/plant-history/?user_id=${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to load plant history');
    }
    return response.json();
  }

  static async addPlantHistory(data: { user_id: number; predicted_name: string; image_url?: string; location?: string; notes?: string }) {
    const response = await fetch(`${API_BASE_URL}/plant-history/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to add plant history');
    }
    return response.json();
  }

  static async deletePlantHistory(id: number, userId: number = 1) {
    const response = await fetch(`${API_BASE_URL}/plant-history/${id}/?user_id=${userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete plant history');
    }
    return response;
  }

  // -------------------------------
  // 🌿 PLANT PREDICTION (image upload)
  // -------------------------------
  static async identifyPlant(imageFile: File, location: string = '', userId: number = 1) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('location', location);
    formData.append('user_id', String(userId));

    const response = await fetch(`${API_BASE_URL}/predict/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to identify plant');
    return response.json();
  }

  // -------------------------------
  // 🌿 RANDOM PLANTS
  // -------------------------------
  static async getRandomPlants() {
    const response = await fetch(`${API_BASE_URL}/random-plants/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to load random plants');
    return response.json();
  }

  // -------------------------------
  // 🌿 ANALYTICS DATA
  // -------------------------------
  static async getAnalyticsData(range: string = "week") {
    const validRange = ["today", "week", "month"].includes(range) ? range : "month";

    const response = await fetch(`${API_BASE_URL}/api/plants/admin/analytics/?range=${validRange}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to load analytics data");
    }

    return response.json();
  }

  // -------------------------------
  // 🌿 REPORTS
  // -------------------------------
  static async getReportsData(dateRange: string, reportType: string) {
    const response = await fetch(`${API_BASE_URL}/api/plants/admin/reports/?range=${dateRange}&type=${reportType}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to load reports data");
    }

    return response.json();
  }

  // -------------------------------
  // 🌿 EXPORT IDENTIFICATION DATA
  // -------------------------------
  static async exportIdentificationData(dateRange: string, format: "csv" | "json") {
    const response = await fetch(`${API_BASE_URL}/api/plants/admin/export/?range=${dateRange}&format=${format}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to export data");
    }

    if (format === "csv") {
      return response.blob(); // CSV export as Blob
    }
    return response.json(); // JSON export
  }

  // -------------------------------
  // 🌿 GET ALL IDENTIFICATIONS
  // -------------------------------
  static async getPlantIdentifications() {
    const response = await fetch(`${API_BASE_URL}/api/plants/admin/identifications/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to load identifications");
    }

    return response.json(); // { success: true, identifications: [...] }
  }
}









// Usage Examples:

// For Mobile App (Plant Identification):
/*
const handlePlantIdentification = async (imageFile: File) => {
  try {
    const result = await PlantAPI.identifyPlant(imageFile, "Living Room", userToken);
    console.log('Plant identified:', result);
    // Result will be:
    // {
    //   success: true,
    //   predicted_name: "Monstera Deliciosa",
    //   confidence: 0.95,
    //   confidence_percentage: "95.0%",
    //   identification_id: 123
    // }
  } catch (error) {
    console.error('Error identifying plant:', error);
  }
};
*/

// For Admin Dashboard (View All Identifications):
/*
const loadIdentifications = async () => {
  try {
    const result = await PlantAPI.getPlantIdentifications();
    console.log('All identifications:', result);
    // Result will show all user photos and plant identifications
    // {
    //   success: true,
    //   identifications: [
    //     {
    //       id: 1,
    //       user: { username: "john_doe", email: "john@example.com" },
    //       predicted_name: "Barrel Cactus",
    //       confidence_percentage: 92.5,
    //       location: "Office",
    //       image_url: "/media/plant_identifications/2024/10/07/cactus.jpg",
    //       created_at: "2024-10-07T10:30:00Z"
    //     }
    //   ]
    // }
  } catch (error) {
    console.error('Error loading identifications:', error);
  }
};
*/

// For Admin Dashboard (Statistics):
/*
const loadDashboardStats = async () => {
  try {
    const result = await PlantAPI.getDashboardStats();
    console.log('Dashboard stats:', result);
    // Result will show:
    // {
    //   success: true,
    //   stats: {
    //     total_users: 150,
    //     total_identifications: 1250,
    //     recent_identifications: 45,
    //     popular_plants: [
    //       { predicted_name: "Monstera Deliciosa", count: 89 },
    //       { predicted_name: "Snake Plant", count: 67 }
    //     ],
    //     recent_activity: [...]
    //   }
    // }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
};
*/

// For Admin Dashboard (Analytics):
/*
const loadAnalyticsData = async (timeRange: string, search: string) => {
  try {
    const result = await PlantAPI.getAnalyticsData(timeRange, search);
    console.log('Analytics data:', result);
    // Result will show:
    // {
    //   success: true,
    //   analytics: {
    //     timeRange: "month",
    //     search: "",
    //     data: [
    //       { date: "2024-10-01", total_identifications: 40, new_users: 5 },
    //       { date: "2024-10-02", total_identifications: 35, new_users: 3 },
    //       ...
    //     ]
    //   }
    // }
  } catch (error) {
    console.error('Error loading analytics data:', error);
  }
};
*/

// For Admin Dashboard (Reports):
/*
const loadReportsData = async (dateRange: string, reportType: string) => {
  try {
    const result = await PlantAPI.getReportsData(dateRange, reportType);
    console.log('Reports data:', result);
    // Result will show:
    // {
    //   success: true,
    //   reports: [
    //     {
    //       id: 1,
    //       type: "summary",
    //       date_range: "2024-09-01 to 2024-09-30",
    //       total_identifications: 300,
    //       new_users: 25
    //     }
    //   ]
    // }
  } catch (error) {
    console.error('Error loading reports data:', error);
  }
};
*/

// For Admin Dashboard (Export Identification Data):
/*
const handleExportData = async (dateRange: string, format: string) => {
  try {
    const result = await PlantAPI.exportIdentificationData(dateRange, format);
    console.log('Exported data:', result);
    // For CSV format, result will be a Blob object
    // For JSON format, result will be a JSON object
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};
*/