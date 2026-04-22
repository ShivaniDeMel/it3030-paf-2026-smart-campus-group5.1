import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import bookingService from '../services/bookingService';
import BookingQRCode from '../components/BookingQRCode';
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  QrCodeIcon,
  TrashIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, confirmed, pending, cancelled
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    fetchUserBookings();
  }, [user?.id]);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        setBookings([]);
        return;
      }

      const data = await bookingService.getBookingsByUserId(user.id);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const status = String(booking.status).toLowerCase();
    if (filter === 'all') return true;
    return status === filter;
  });

  const getStatusColor = (status) => {
    const s = String(status).toLowerCase();
    switch (s) {
      case 'confirmed':
        return 'bg-emerald-500/20 text-emerald-100 border-emerald-500/40';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-100 border-yellow-500/40';
      case 'cancelled':
        return 'bg-red-500/20 text-red-100 border-red-500/40';
      case 'completed':
        return 'bg-blue-500/20 text-blue-100 border-blue-500/40';
      default:
        return 'bg-gray-500/20 text-gray-100 border-gray-500/40';
    }
  };

  const getStatusIcon = (status) => {
    const s = String(status).toLowerCase();
    switch (s) {
      case 'confirmed':
        return CheckCircleIcon;
      case 'cancelled':
        return XCircleIcon;
      default:
        return ClockIcon;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await bookingService.cancelBooking(bookingId);
      fetchUserBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking');
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowQRModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-orange-900/20 to-black pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-orange-100/60">Loading your bookings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-900/20 to-black pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-orange-100 mb-2">My Bookings</h1>
              <p className="text-orange-100/60">Manage your facility reservations</p>
            </div>
            <Link
              to="/booking-workflow"
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              <CalendarIcon className="h-5 w-5" />
              New Booking
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['all', 'confirmed', 'pending', 'cancelled', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                filter === f
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-600/20 text-orange-100 hover:bg-orange-600/40'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-4 mb-8">
            <p className="text-red-100">{error}</p>
          </div>
        )}

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-orange-600/30 rounded-lg p-12 text-center">
            <CalendarIcon className="h-16 w-16 text-orange-100/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-orange-100 mb-2">No bookings found</h3>
            <p className="text-orange-100/60 mb-6">
              {filter === 'all'
                ? "You haven't made any bookings yet"
                : `No ${filter} bookings at the moment`}
            </p>
            <Link
              to="/booking-workflow"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all"
            >
              <CalendarIcon className="h-5 w-5" />
              Create Your First Booking
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.map((booking) => {
              const StatusIcon = getStatusIcon(booking.status);
              return (
                <div
                  key={booking.id}
                  className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-orange-600/30 rounded-lg overflow-hidden hover:border-orange-600/60 transition-all duration-300 hover:shadow-xl hover:shadow-orange-600/20"
                >
                  {/* Status Header */}
                  <div className={`px-6 py-3 border-b border-orange-600/30 flex items-center justify-between ${getStatusColor(booking.status)}`}>
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-5 w-5" />
                      <span className="font-semibold capitalize">{booking.status}</span>
                    </div>
                    <span className="text-xs font-mono text-orange-100/60">{booking.id.slice(0, 8)}</span>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Date & Time */}
                    <div className="space-y-2">
                      <div className="flex gap-3 text-sm">
                        <CalendarIcon className="h-5 w-5 text-orange-500 flex-shrink-0" />
                        <div>
                          <p className="text-orange-100/60">Date & Time</p>
                          <p className="text-orange-100 font-medium">{formatDateTime(booking.startTime)}</p>
                          <p className="text-orange-100/80 text-xs">to {formatDateTime(booking.endTime)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Attendees */}
                    {booking.attendeeCount && (
                      <div className="flex gap-3 text-sm">
                        <UserGroupIcon className="h-5 w-5 text-orange-500 flex-shrink-0" />
                        <div>
                          <p className="text-orange-100/60">Attendees</p>
                          <p className="text-orange-100 font-medium">{booking.attendeeCount} person{booking.attendeeCount !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    )}

                    {/* Purpose */}
                    {booking.purpose && (
                      <div>
                        <p className="text-sm text-orange-100/60 mb-1">Purpose</p>
                        <p className="text-sm text-orange-100 line-clamp-2">{booking.purpose}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-orange-600/20">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-600/20 hover:bg-orange-600/40 text-orange-100 rounded-lg transition-all duration-200 text-sm font-medium"
                        title="View QR Code and Details"
                      >
                        <QrCodeIcon className="h-4 w-4" />
                        QR Code
                      </button>
                      <button
                        onClick={() => navigate(`/booking-details?id=${booking.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-100 rounded-lg transition-all duration-200 text-sm font-medium"
                        title="View full details"
                      >
                        <EyeIcon className="h-4 w-4" />
                        Details
                      </button>
                      {String(booking.status).toLowerCase() !== 'cancelled' && (
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-100 rounded-lg transition-all duration-200 text-sm font-medium"
                          title="Cancel booking"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 border border-orange-600/40 rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-orange-100">Booking QR Code</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-orange-100/60 hover:text-orange-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <BookingQRCode booking={selectedBooking} facilityName="" />
              
              <div className="bg-black/30 rounded-lg p-4 space-y-2">
                <div className="text-sm">
                  <p className="text-orange-100/60">Booking ID</p>
                  <p className="text-orange-100 font-mono text-xs">{selectedBooking.id}</p>
                </div>
                <div className="text-sm">
                  <p className="text-orange-100/60">Status</p>
                  <p className="text-orange-100 font-medium capitalize">{selectedBooking.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
