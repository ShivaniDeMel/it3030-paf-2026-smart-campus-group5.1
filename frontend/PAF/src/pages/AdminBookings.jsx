import { useState, useEffect } from 'react';
import BookingList from '../components/BookingList';
import bookingService from '../services/bookingService';
import {
  ShieldCheckIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleApprove = async (id) => {
    try {
      await bookingService.updateBookingStatus(id, 'APPROVED');
      fetchBookings();
    } catch (error) {
      console.error('Failed to approve booking:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await bookingService.updateBookingStatus(id, 'REJECTED');
      fetchBookings();
    } catch (error) {
      console.error('Failed to reject booking:', error);
    }
  };

  const filteredBookings =
    filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter);

  const statusCounts = {
    ALL: bookings.length,
    PENDING: bookings.filter((b) => b.status === 'PENDING').length,
    APPROVED: bookings.filter((b) => b.status === 'APPROVED').length,
    REJECTED: bookings.filter((b) => b.status === 'REJECTED').length,
    CANCELLED: bookings.filter((b) => b.status === 'CANCELLED').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheckIcon className="h-8 w-8 text-orange-500" />
              Admin Bookings
            </h1>
            <p className="text-gray-500 mt-1">Review and manage all facility bookings</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FunnelIcon className="h-4 w-4" />
            <span>{filteredBookings.length} bookings shown</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total', count: statusCounts.ALL, color: 'bg-orange-500' },
            { label: 'Pending', count: statusCounts.PENDING, color: 'bg-yellow-500' },
            { label: 'Approved', count: statusCounts.APPROVED, color: 'bg-green-500' },
            { label: 'Rejected', count: statusCounts.REJECTED, color: 'bg-red-500' },
            { label: 'Cancelled', count: statusCounts.CANCELLED, color: 'bg-gray-500' },
          ].map(({ label, count, color }) => (
            <div key={label} className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
              <div className={`inline-block w-3 h-3 rounded-full ${color} mb-2`}></div>
              <p className="text-2xl font-bold text-gray-800">{count}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>

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
          onApprove={handleApprove}
          onReject={handleReject}
          isAdmin={true}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AdminBookings;
