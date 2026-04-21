import axios from 'axios';

const API_BASE_URL = 'http://localhost:8089/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = 'API Error occurred';
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout - please try again';
    } else if (error.response) {
      errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`;
    } else if (error.request) {
      errorMessage = 'Network error - please check your connection';
    } else {
      errorMessage = error.message;
    }
    
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

// Facility API endpoints
export const facilityAPI = {
  // Get all facilities
  getAllFacilities: () => api.get('/facilities'),
  
  // Get facility by ID
  getFacilityById: (id) => api.get(`/facilities/${id}`),
  
  // Create new facility
  createFacility: (facilityData) => {
    if (facilityData instanceof FormData) {
      return api.post('/facilities', facilityData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/facilities', facilityData);
  },
  
  // Update facility
  updateFacility: (id, facilityData) => {
    if (facilityData instanceof FormData) {
      return api.put(`/facilities/${id}`, facilityData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.put(`/facilities/${id}`, facilityData);
  },
  
  // Delete facility
  deleteFacility: (id) => api.delete(`/facilities/${id}`),
  
  // Search facilities with filters
  searchFacilities: (params) => api.get('/facilities/search', { params }),
  
  // Get facilities by type
  getFacilitiesByType: (type) => api.get(`/facilities/type/${type}`),
  
  // Get facilities by status
  getFacilitiesByStatus: (status) => api.get(`/facilities/status/${status}`),
  
  // Get facility statistics
  getFacilityStatistics: () => api.get('/facilities/statistics', { timeout: 10000 }),
  
  // Get facility types
  getFacilityTypes: () => api.get('/facilities/types'),
  
  // Get facility statuses
  getFacilityStatuses: () => api.get('/facilities/statuses'),
};

// Authentication API endpoints
export const authAPI = {
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Register user
  register: (userData) => api.post('/auth/register', userData),
  
  // Validate token
  validateToken: (token) => api.post('/auth/validate', { token }),
  
  // Health check
  health: () => api.get('/auth/health'),
};

export default api;
