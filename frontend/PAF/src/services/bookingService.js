import api from '../utils/api';

const BOOKING_URL = '/bookings';

const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const response = await api.post(BOOKING_URL, bookingData);
      return response.data;
    } catch (error) {
      console.error('Booking creation error - Status:', error.response?.status, 'Data:', error.response?.data);
      throw error;
    }
  },

  checkAvailability: async ({ facilityId, startTime, endTime }) => {
    const response = await api.get(`${BOOKING_URL}/availability`, {
      params: { facilityId, startTime, endTime },
    });
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await api.get(`${BOOKING_URL}/${id}`);
    return response.data;
  },

  getAllBookings: async () => {
    const response = await api.get(BOOKING_URL);
    return response.data;
  },

  getBookingsByUserId: async (userId) => {
    const response = await api.get(`${BOOKING_URL}/user/${userId}`);
    return response.data;
  },

  getBookingsByFacilityId: async (facilityId) => {
    const response = await api.get(`${BOOKING_URL}/facility/${facilityId}`);
    return response.data;
  },

  getBookingsByStatus: async (status) => {
    const response = await api.get(`${BOOKING_URL}/status/${status}`);
    return response.data;
  },

  updateBooking: async (id, bookingData) => {
    const response = await api.put(`${BOOKING_URL}/${id}`, bookingData);
    return response.data;
  },

  updateBookingStatus: async (id, status) => {
    const response = await api.post(`${BOOKING_URL}/${id}/approve`, { notes: status === 'APPROVED' ? '' : undefined });
    return response.data;
  },

  approveBooking: async (id, notes = '') => {
    const response = await api.post(`${BOOKING_URL}/${id}/approve`, { notes });
    return response.data;
  },

  cancelBooking: async (id, reason = '') => {
    const response = await api.post(`${BOOKING_URL}/${id}/cancel`, { reason });
    return response.data;
  },

  deleteBooking: async (id) => {
    await api.delete(`${BOOKING_URL}/${id}`);
  },
};

export default bookingService;
