import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BookingForm from '../components/BookingForm';
import BookingList from '../components/BookingList';
import bookingService from '../services/bookingService';
import {
  PlusCircleIcon,
  ListBulletIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const UserBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = user?.id
        ? await bookingService.getBookingsByUserId(user.id)
        : await bookingService.getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCreateBooking = async (formData) => {
    const bookingData = {
      ...formData,
      userId: user?.id || 'anonymous',
      userName: user ? `${user.firstName} ${user.lastName}` : 'Anonymous',
    };
    await bookingService.createBooking(bookingData);
    setShowForm(false);
    fetchBookings();
  };

  const handleCancelBooking = async (id) => {
    try {
      await bookingService.updateBookingStatus(id, 'CANCELLED');
      fetchBookings();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const filteredBookings =
    filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter);

  const statusCounts = {
    ALL: bookings.length,
    PENDING: bookings.filter((b) => b.status === 'PENDING').length,
    APPROVED: bookings.filter((b) => b.status === 'APPROVED').length,
    REJECTED: bookings.filter((b) => b.status === 'REJECTED').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
            <p className="text-gray-500 mt-1">Manage your facility bookings</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {showForm ? (
              <>
                <XMarkIcon className="h-5 w-5" />
                Close Form
              </>
            ) : (
              <>
                <PlusCircleIcon className="h-5 w-5" />
                New Booking
              </>
            )}
          </button>
        </div>

        {/* Booking Form Modal */}
        {showForm && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PlusCircleIcon className="h-6 w-6 text-orange-500" />
              Create New Booking
            </h2>
            <BookingForm onSubmit={handleCreateBooking} />
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === status
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
              }`}
            >
              {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()} ({count})
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <BookingList
          bookings={filteredBookings}
          onCancel={handleCancelBooking}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default UserBookings;
