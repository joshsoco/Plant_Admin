// API Configuration for Plant Identification Backend
// Add this to your frontend services

const API_BASE_URL = 'http://127.0.0.1:8000'; // Your Django backend URL

export class PlantAPI {
  
  // Authentication endpoints (existing)
  static async login(credentials: { username: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData,
    });
    return response.json();
  }

  // Admin dashboard endpoints
  static async getPlantIdentifications() {
    const response = await fetch(`${API_BASE_URL}/api/plants/admin/identifications/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return response.json();
  }

  static async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/api/plants/admin/stats/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return response.json();
  }

  static async getRandomPlants() {
    const response = await fetch(`${API_BASE_URL}/api/plants/random/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return response.json();
  }

  static async getAnalyticsData(timeRange: string = 'month', search: string = '') {
    const params = new URLSearchParams({
      timeRange,
      search
    });

    const response = await fetch(`${API_BASE_URL}/api/plants/admin/analytics/?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return response.json();
  }

  static async getReportsData(dateRange: string = '30', reportType: string = 'summary') {
    const params = new URLSearchParams({
      dateRange,
      reportType
    });

    const response = await fetch(`${API_BASE_URL}/api/plants/admin/reports/?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return response.json();
  }

  static async exportIdentificationData(dateRange: string = '30', format: string = 'csv') {
    const params = new URLSearchParams({
      dateRange,
      format
    });

    const response = await fetch(`${API_BASE_URL}/api/plants/admin/export/?${params}`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (format === 'csv') {
      return response.blob();
    } else {
      return response.json();
    }
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