import axios from 'axios';

const API_HOST = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_BASE_URL = `${API_HOST}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const adminApi = axios.create({
  baseURL: API_HOST,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const buildUserContextHeaders = (user) => {
  const userId = user?.id || user?.userId || user?.email || "anon";
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const userName = fullName || user?.email || "Anonymous";
  const role = (user?.role || "USER").toString().toUpperCase();

  return {
    "X-User-Id": userId,
    "X-User-Name": userName,
    "X-User-Role": role,
  };
};

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
  createFacility: (facilityData, user) => {
    const headers = buildUserContextHeaders(user);
    if (facilityData instanceof FormData) {
      return api.post('/facilities', facilityData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/facilities', facilityData, { headers });
  },
  
  // Update facility
  updateFacility: (id, facilityData, user) => {
    const headers = buildUserContextHeaders(user);
    if (facilityData instanceof FormData) {
      return api.put(`/facilities/${id}`, facilityData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.put(`/facilities/${id}`, facilityData, { headers });
  },
  
  // Delete facility
  deleteFacility: (id, user) => api.delete(`/facilities/${id}`, { headers: buildUserContextHeaders(user) }),
  
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

// Admin API endpoints
export const adminAPI = {
  getUsers: () => adminApi.get('/admin/users'),
  updateUserRole: (userId, role) =>
    adminApi.put(`/admin/users/${userId}/role`, { role }),
};

// Booking API endpoints
export const bookingAPI = {
  getAllBookings: () => api.get('/bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  updateBooking: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  cancelBooking: (id, reason) => api.post(`/bookings/${id}/cancel`, { reason }),
  approveBooking: (id, notes) => api.post(`/bookings/${id}/approve`, { notes }),
  getBookingsByUser: (userId) => api.get(`/bookings/user/${userId}`),
  getBookingsByFacility: (facilityId) => api.get(`/bookings/facility/${facilityId}`),
  checkAvailability: (facilityId, startTime, endTime) =>
    api.get('/bookings/availability', { params: { facilityId, startTime, endTime } }),
  getAllAdminBookings: (user) =>
    api.get('/bookings', { headers: buildUserContextHeaders(user) }),
  approveBookingAdmin: (id, notes, user) =>
    api.patch(`/bookings/${id}/approve`, { notes }, { headers: buildUserContextHeaders(user) }),
  rejectBookingAdmin: (id, reason, user) =>
    api.patch(`/bookings/${id}/reject`, { reason }, { headers: buildUserContextHeaders(user) }),
};

// Ticketing API endpoints
export const ticketAPI = {
  getTickets: (user) =>
    api.get('/tickets', { headers: buildUserContextHeaders(user) }),
  getAssignedTickets: (user) =>
    api.get('/tickets/assigned', { headers: buildUserContextHeaders(user) }),
  getTicketById: (id, user) =>
    api.get(`/tickets/${id}`, { headers: buildUserContextHeaders(user) }),
  createTicket: (formData, user) =>
    api.post('/tickets', formData, {
      headers: {
        ...buildUserContextHeaders(user),
        'Content-Type': 'multipart/form-data',
      },
      timeout: 10000,
    }),
  updateTicketStatus: (id, payload, user) =>
    api.put(`/tickets/${id}/status`, payload, {
      headers: buildUserContextHeaders(user),
    }),
  updateTicketStatusPatch: (id, payload, user) =>
    api.patch(`/tickets/${id}/status`, payload, {
      headers: buildUserContextHeaders(user),
    }),
  assignTechnician: (id, technicianId, technicianName, user) =>
    api.patch(`/tickets/${id}/assign`, { technicianId, technicianName }, {
      headers: buildUserContextHeaders(user),
    }),
  rejectTicket: (id, reason, user) =>
    api.patch(`/tickets/${id}/reject`, { reason }, {
      headers: buildUserContextHeaders(user),
    }),
  addResolution: (id, resolutionNotes, user) =>
    api.patch(`/tickets/${id}/resolution`, { resolutionNotes }, {
      headers: buildUserContextHeaders(user),
    }),
  addComment: (ticketId, payload, user) =>
    api.post(`/tickets/${ticketId}/comments`, payload, {
      headers: buildUserContextHeaders(user),
    }),
  editComment: (ticketId, commentId, payload, user) =>
    api.put(`/tickets/${ticketId}/comments/${commentId}`, payload, {
      headers: buildUserContextHeaders(user),
    }),
  deleteComment: (ticketId, commentId, user) =>
    api.delete(`/tickets/${ticketId}/comments/${commentId}`, {
      headers: buildUserContextHeaders(user),
    }),
};

export default api;
