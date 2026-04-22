import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, PrinterIcon } from '@heroicons/react/24/outline';
import bookingService from '../services/bookingService';
import { facilityAPI } from '../services/api';

const BookingDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const decodeToken = (token) => {
    try {
      const binary = atob(token);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const bookingId = searchParams.get('id');
        const token = searchParams.get('token');
        const tokenBooking = token ? decodeToken(token) : null;
        let resolvedBooking = tokenBooking;
        
        if (!bookingId && !tokenBooking) {
          setError('Invalid booking link');
          return;
        }

        if (tokenBooking) {
          setBooking(tokenBooking);
        }

        if (bookingId) {
          try {
            const bookingData = await bookingService.getBookingById(bookingId);
            resolvedBooking = bookingData;
            setBooking(bookingData);
          } catch (err) {
            if (!tokenBooking) {
              throw err;
            }
          }
        }

        // Fetch facility details if available
        if (resolvedBooking?.facilityId) {
          try {
            const facilityResponse = await facilityAPI.getFacilityById(resolvedBooking.facilityId);
            setFacility(facilityResponse.data);
          } catch (err) {
            console.log('Could not fetch facility details:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Could not load booking details. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [searchParams]);

  const handlePrint = () => {
    window.print();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-orange-900/20 to-black pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-orange-100/60">Loading booking details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-orange-900/20 to-black pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 text-orange-100 hover:text-orange-50 transition-colors mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Home
          </button>
          <div className="border border-red-500/40 bg-red-500/10 rounded-lg p-6 text-center">
            <p className="text-red-100 mb-4">{error}</p>
            <p className="text-red-100/60 text-sm">
              If you believe this is a mistake, please check the booking ID and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-orange-900/20 to-black pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 text-orange-100 hover:text-orange-50 transition-colors mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Home
          </button>
          <div className="border border-orange-600/30 bg-orange-500/10 rounded-lg p-6 text-center">
            <p className="text-orange-100">Booking not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-950 via-black to-black pt-20 pb-12 print:bg-white">
      <div className="container mx-auto px-4 max-w-2xl print:max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 text-orange-100 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600/90 hover:bg-orange-500 text-white rounded-lg transition-all"
          >
            <PrinterIcon className="h-5 w-5" />
            Print
          </button>
        </div>

        {/* Booking Details Card */}
        <div className="bg-linear-to-br from-orange-950/20 via-black/80 to-black/90 border border-orange-500/30 rounded-3xl p-8 shadow-2xl shadow-orange-950/20 print:border-gray-400 print:bg-white print:text-black">
          {/* Title */}
          <div className="text-center mb-8 border-b border-orange-500/30 pb-6 print:border-gray-400">
            <h1 className="text-3xl font-bold text-orange-100 print:text-black mb-2">Booking Details</h1>
            <p className="text-orange-100/70 print:text-gray-600">Smart Campus Facility Booking System</p>
          </div>

          {/* Booking ID and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-black/40 rounded-3xl p-5 border border-orange-500/20 shadow-inner shadow-orange-950/10 print:border print:border-gray-400 print:bg-gray-50">
              <p className="text-orange-100/70 text-sm mb-1">Booking ID</p>
              <p className="text-orange-100 font-mono font-semibold">{booking.id}</p>
            </div>
            <div className={`rounded-3xl p-5 border ${getStatusColor(booking.status)}`}>
              <p className="text-sm mb-1 opacity-80">Status</p>
              <p className="font-semibold capitalize">{booking.status}</p>
            </div>
          </div>

          {/* Facility Information */}
          {facility && (
            <div className="bg-black/40 rounded-3xl p-5 mb-8 border border-orange-500/20 shadow-inner shadow-orange-950/10 print:border print:border-gray-400 print:bg-gray-50">
              <h2 className="text-lg font-semibold text-orange-100 mb-3">Facility</h2>
              <p className="text-orange-100/90 font-medium">{facility.name}</p>
              {facility.location && (
                <p className="text-orange-100/70 text-sm mt-1">{facility.location}</p>
              )}
            </div>
          )}

          {/* Date & Time Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-black/40 rounded-3xl p-5 border border-orange-500/20 shadow-inner shadow-orange-950/10 print:border print:border-gray-400 print:bg-gray-50">
              <p className="text-orange-100/70 text-sm mb-2">Start Time</p>
              <p className="text-orange-100 font-semibold">{formatDateTime(booking.startTime)}</p>
            </div>
            <div className="bg-black/40 rounded-3xl p-5 border border-orange-500/20 shadow-inner shadow-orange-950/10 print:border print:border-gray-400 print:bg-gray-50">
              <p className="text-orange-100/70 text-sm mb-2">End Time</p>
              <p className="text-orange-100 font-semibold">{formatDateTime(booking.endTime)}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4 mb-8 bg-black/40 rounded-3xl p-5 border border-orange-500/20 shadow-inner shadow-orange-950/10 print:border print:border-gray-400 print:bg-gray-50">
            <h2 className="text-lg font-semibold text-orange-100 mb-4">Booking Information</h2>
            
            {booking.purpose && (
              <div className="border-b border-orange-500/20 pb-3">
                <p className="text-orange-100/70 text-sm mb-1">Purpose</p>
                <p className="text-orange-100">{booking.purpose}</p>
              </div>
            )}

            {booking.attendeeCount && (
              <div className="border-b border-orange-500/20 pb-3">
                <p className="text-orange-100/70 text-sm mb-1">Attendees</p>
                <p className="text-orange-100">{booking.attendeeCount} person{booking.attendeeCount !== 1 ? 's' : ''}</p>
              </div>
            )}

            {booking.specialRequirements && booking.specialRequirements.length > 0 && (
              <div className="border-b border-orange-500/20 pb-3">
                <p className="text-orange-100/70 text-sm mb-1">Special Requirements</p>
                <ul className="text-orange-100 space-y-1">
                  {booking.specialRequirements.map((req, idx) => (
                    <li key={idx} className="text-sm">• {req}</li>
                  ))}
                </ul>
              </div>
            )}

            {booking.equipmentRequested && booking.equipmentRequested.length > 0 && (
              <div className="pb-3">
                <p className="text-orange-100/70 text-sm mb-1">Equipment Requested</p>
                <ul className="text-orange-100 space-y-1">
                  {booking.equipmentRequested.map((eq, idx) => (
                    <li key={idx} className="text-sm">• {eq}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="space-y-2 text-sm text-orange-100/70 border-t border-orange-500/20 pt-6">
            <p>Created: {formatDateTime(booking.createdAt)}</p>
            {booking.updatedAt && <p>Last Updated: {formatDateTime(booking.updatedAt)}</p>}
            <p className="mt-4 text-xs pt-4 border-t border-orange-500/20">
              Generated for Smart Campus Facility Booking System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
