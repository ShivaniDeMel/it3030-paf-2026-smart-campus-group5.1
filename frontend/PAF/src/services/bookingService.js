import api from '../utils/api';

const BOOKING_URL = '/bookings';

const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post(BOOKING_URL, bookingData);
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

  getBookingsByStatus: async (status) => {
    const response = await api.get(`${BOOKING_URL}/status/${status}`);
    return response.data;
  },

  updateBooking: async (id, bookingData) => {
    const response = await api.put(`${BOOKING_URL}/${id}`, bookingData);
    return response.data;
  },

  updateBookingStatus: async (id, status) => {
    const response = await api.patch(`${BOOKING_URL}/${id}/status`, { status });
    return response.data;
  },

  deleteBooking: async (id) => {
    await api.delete(`${BOOKING_URL}/${id}`);
  },
};

export default bookingService;
