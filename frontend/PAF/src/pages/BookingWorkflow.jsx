import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import bookingService from '../services/bookingService';
import { facilityAPI } from '../services/api';
import BookingQRCode from '../components/BookingQRCode';
import {
  ArrowLeftIcon,
  CalendarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const BookingWorkflow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const facilityPath = id ? `/facilities/${id}` : '/facilities';
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);

  const [facility, setFacility] = useState(null);
  const [facilityLoading, setFacilityLoading] = useState(false);

  const [facilityBookings, setFacilityBookings] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [createdBooking, setCreatedBooking] = useState(null);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
  ];

  const pad2 = (value) => String(value).padStart(2, '0');

  const todayLocal = useMemo(() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  }, []);

  const toLocalDateTimeString = (dateStr, timeStr) => `${dateStr}T${timeStr}:00`;

  const addHoursLocal = (dateStr, timeStr, hoursToAdd) => {
    const start = new Date(`${dateStr}T${timeStr}:00`);
    const end = new Date(start.getTime() + hoursToAdd * 60 * 60 * 1000);
    return `${end.getFullYear()}-${pad2(end.getMonth() + 1)}-${pad2(end.getDate())}T${pad2(end.getHours())}:${pad2(end.getMinutes())}:00`;
  };

  const selectedStartTime = useMemo(() => {
    if (!selectedDate || !selectedTime) return null;
    return toLocalDateTimeString(selectedDate, selectedTime);
  }, [selectedDate, selectedTime]);

  const selectedEndTime = useMemo(() => {
    if (!selectedDate || !selectedTime) return null;
    return addHoursLocal(selectedDate, selectedTime, duration);
  }, [selectedDate, selectedTime, duration]);

  const isSelectedStartTimeInFuture = useMemo(() => {
    if (!selectedStartTime) return false;
    const timestamp = new Date(selectedStartTime).getTime();
    return Number.isFinite(timestamp) && timestamp > Date.now();
  }, [selectedStartTime]);

  const bookingsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return facilityBookings.filter((booking) => {
      if (!booking?.startTime) return false;
      if ((booking?.status || '').toLowerCase() === 'cancelled') return false;
      return String(booking.startTime).startsWith(`${selectedDate}T`);
    });
  }, [facilityBookings, selectedDate]);

  const confirmedFacilityBookings = useMemo(
    () => facilityBookings.filter((booking) => String(booking?.status || '').toLowerCase() === 'confirmed'),
    [facilityBookings]
  );

  const confirmedUserBookings = useMemo(
    () => userBookings.filter((booking) => String(booking?.status || '').toLowerCase() === 'confirmed'),
    [userBookings]
  );

  const hasConflictForRange = (startStr, endStr) => {
    if (!startStr || !endStr) return false;
    const slotStart = new Date(startStr);
    const slotEnd = new Date(endStr);

    return bookingsForSelectedDate.some((booking) => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      return slotStart < bookingEnd && slotEnd > bookingStart;
    });
  };

  const isSelectedSlotAvailable = useMemo(() => {
    if (!selectedStartTime || !selectedEndTime) return false;
    return !hasConflictForRange(selectedStartTime, selectedEndTime);
  }, [selectedStartTime, selectedEndTime, bookingsForSelectedDate]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const loadFacility = async () => {
      setFacilityLoading(true);
      try {
        const res = await facilityAPI.getFacilityById(id);
        if (!cancelled) setFacility(res.data);
      } catch {
        // Keep facility optional; booking can still proceed by id
      } finally {
        if (!cancelled) setFacilityLoading(false);
      }
    };

    loadFacility();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!id || !selectedDate) return;
    let cancelled = false;

    const loadBookings = async () => {
      setBookingsLoading(true);
      try {
        const data = await bookingService.getBookingsByFacilityId(id);
        if (!cancelled) setFacilityBookings(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setFacilityBookings([]);
      } finally {
        if (!cancelled) setBookingsLoading(false);
      }
    };

    loadBookings();
    return () => {
      cancelled = true;
    };
  }, [id, selectedDate]);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    const loadUserBookings = async () => {
      try {
        const data = await bookingService.getBookingsByUserId(user.id);
        if (!cancelled) setUserBookings(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setUserBookings([]);
      }
    };

    loadUserBookings();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    setSubmitError('');
  }, [selectedDate, selectedTime, duration, purpose, attendees, currentStep, id]);

  useEffect(() => {
    if (!selectedDate || !selectedTime) return;
    if (selectedStartTime && selectedEndTime && hasConflictForRange(selectedStartTime, selectedEndTime)) {
      setSelectedTime('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, bookingsForSelectedDate]);

  const step1Valid = Boolean(id && selectedDate && selectedTime && isSelectedSlotAvailable && isSelectedStartTimeInFuture);
  const step2Valid = Boolean(purpose.trim().length > 0 && attendees > 0);

  const handleNext = () => {
    if (currentStep === 1 && !step1Valid) return;
    if (currentStep === 2 && !step2Valid) return;
    setCurrentStep(Math.min(3, currentStep + 1));
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!step1Valid || !step2Valid || !selectedStartTime || !selectedEndTime) return;

    setSubmitLoading(true);
    setSubmitError('');
    try {
      const payload = {
        facilityId: id,
        userId: user?.id || 'anonymous',
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        purpose: purpose.trim(),
        attendeeCount: attendees,
      };

      const created = await bookingService.createBooking(payload);
      setCreatedBooking(created);
    } catch (err) {
      const data = err?.response?.data;
      const fields = data && typeof data === 'object' ? data.fields : null;
      const fieldMessage = fields && typeof fields === 'object'
        ? Object.entries(fields)
          .map(([field, message]) => `${field}: ${message}`)
          .join('\n')
        : '';

      const message =
        (fieldMessage ? `Validation failed\n${fieldMessage}` : '') ||
        (data && typeof data === 'object' ? data.error : '') ||
        err?.message ||
        'Failed to create booking';
      setSubmitError(message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-orange-800 to-black relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="bg-linear-to-br from-black/80 via-orange-900/40 to-black/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-orange-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to={facilityPath}
                className="p-2 rounded-xl text-orange-100/80 hover:text-white hover:bg-orange-500/20 transition-all duration-200"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Book Facility</h1>
                <p className="text-orange-100/70">
                  {facility?.name ? `Booking for: ${facility.name}` : 'Complete the steps below to reserve this facility'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {!id && (
          <div className="bg-linear-to-br from-black/80 via-orange-900/40 to-black/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-orange-600/30">
            <h2 className="text-xl font-bold text-white mb-2">Select a facility first</h2>
            <p className="text-orange-100/70 mb-6">Booking requires a facility. Please choose a facility and click “Book Now”.</p>
            <Link
              to="/facilities"
              className="inline-flex items-center px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-medium transition-all duration-200"
            >
              Go to Facilities
            </Link>
          </div>
        )}

        {id && (
          <>

        {(confirmedFacilityBookings.length > 0 || confirmedUserBookings.length > 0) && (
          <div className="bg-linear-to-br from-black/80 via-orange-900/40 to-black/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-orange-600/30">
            <h2 className="text-xl font-bold text-white mb-4">Confirmed bookings</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {confirmedFacilityBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="rounded-xl border border-orange-600/20 bg-black/30 p-4">
                  <p className="text-sm text-orange-100/60">Facility booking</p>
                  <p className="text-white font-semibold">{facility?.name || booking.facilityId}</p>
                  <p className="text-sm text-orange-100/80 mt-2">
                    {String(booking.startTime).replace('T', ' ')} - {String(booking.endTime).replace('T', ' ')}
                  </p>
                </div>
              ))}
              {confirmedUserBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="rounded-xl border border-orange-600/20 bg-black/30 p-4">
                  <p className="text-sm text-orange-100/60">Your confirmed booking</p>
                  <p className="text-white font-semibold">{booking.facilityDetails?.name || booking.facilityId}</p>
                  <p className="text-sm text-orange-100/80 mt-2">
                    {String(booking.startTime).replace('T', ' ')} - {String(booking.endTime).replace('T', ' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="bg-linear-to-br from-black/80 via-orange-900/40 to-black/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-orange-600/30">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-black/40 border-orange-600/40 text-orange-100/70'
                }`}>
                  {step}
                </div>
                <span className={`ml-3 text-sm font-medium ${
                  currentStep >= step ? 'text-primary-400' : 'text-orange-100/70'
                }`}>
                  {step === 1 ? 'Date & Time' : step === 2 ? 'Details' : 'Confirmation'}
                </span>
                {step < 3 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step ? 'bg-primary-600' : 'bg-orange-600/30'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-linear-to-br from-black/80 via-orange-900/40 to-black/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-orange-600/30">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Date & Time */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <CalendarIcon className="h-6 w-6 text-primary-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Select Date & Time</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-100/80 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={todayLocal}
                    className="w-full px-4 py-2 border border-orange-600/40 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-black/30 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-100/80 mb-2">
                    Start Time
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {timeSlots.map((time) => {
                      const startStr = selectedDate ? toLocalDateTimeString(selectedDate, time) : null;
                      const endStr = selectedDate ? addHoursLocal(selectedDate, time, duration) : null;
                      const available = selectedDate ? !hasConflictForRange(startStr, endStr) : true;
                      const inPast = Boolean(
                        selectedDate &&
                          selectedDate === todayLocal &&
                          startStr &&
                          Number.isFinite(new Date(startStr).getTime()) &&
                          new Date(startStr).getTime() <= Date.now()
                      );
                      const canSelect = selectedDate && available && !inPast;

                      return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        disabled={!canSelect}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                          selectedTime === time
                            ? 'bg-primary-600 text-white border-primary-600'
                            : !selectedDate
                              ? 'bg-black/20 text-orange-100/40 border-orange-600/20 cursor-not-allowed'
                              : canSelect
                                ? 'bg-black/30 text-orange-100 border-orange-600/40 hover:bg-orange-500/10'
                                : inPast
                                  ? 'bg-black/20 text-orange-100/40 border-orange-600/20 cursor-not-allowed'
                                  : 'bg-black/20 text-orange-100/40 border-orange-600/20 cursor-not-allowed line-through'
                        }`}
                      >
                        {time}
                      </button>
                      );
                    })}
                  </div>
                  {bookingsLoading && (
                    <p className="text-sm text-orange-100/60 mt-3">Checking existing bookings…</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-100/80 mb-2">
                    Duration (hours)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-orange-600/40 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-black/30 text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
                      <option key={hour} value={hour}>
                        {hour} hour{hour > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDate && selectedTime && !isSelectedSlotAvailable && (
                  <div className="border border-orange-500/40 bg-orange-500/10 rounded-lg p-4">
                    <p className="text-sm text-orange-100/80">
                      This time range is already booked. Please choose another time.
                    </p>
                  </div>
                )}

                {selectedDate && selectedTime && isSelectedSlotAvailable && !isSelectedStartTimeInFuture && (
                  <div className="border border-orange-500/40 bg-orange-500/10 rounded-lg p-4">
                    <p className="text-sm text-orange-100/80">
                      Start time must be in the future. Please select a later time.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <InformationCircleIcon className="h-6 w-6 text-primary-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Booking Details</h2>
                </div>

                {(facilityLoading || facility) && (
                  <div className="bg-black/30 rounded-lg p-4 border border-orange-600/30">
                    <h3 className="font-medium text-white mb-2">Facility Details</h3>
                    <div className="text-sm text-orange-100/70 space-y-1">
                      <div className="flex justify-between gap-4">
                        <span>Name:</span>
                        <span className="text-orange-100/90">{facilityLoading ? 'Loading…' : (facility?.name || id)}</span>
                      </div>
                      {facility?.location && (
                        <div className="flex justify-between gap-4">
                          <span>Location:</span>
                          <span className="text-orange-100/90">{facility.location}</span>
                        </div>
                      )}
                      {facility?.capacity != null && (
                        <div className="flex justify-between gap-4">
                          <span>Capacity:</span>
                          <span className="text-orange-100/90">{facility.capacity}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-orange-100/80 mb-2">
                    Purpose of Booking
                  </label>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-orange-600/40 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-black/30 text-white"
                    placeholder="Describe the purpose of this booking..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-100/80 mb-2">
                    Number of Attendees
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max={facility?.capacity ?? 200}
                      value={attendees}
                      onChange={(e) => setAttendees(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-lg font-medium text-white">{attendees}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="bg-black/30 rounded-lg p-4 border border-orange-600/30">
                  <h3 className="font-medium text-white mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-orange-100/70">Date:</span>
                      <span className="text-orange-100/90">{selectedDate || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-100/70">Time:</span>
                      <span className="text-orange-100/90">{selectedTime || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-100/70">Duration:</span>
                      <span className="text-orange-100/90">{duration} hour{duration > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-100/70">Attendees:</span>
                      <span className="text-orange-100/90">{attendees} people</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <CheckCircleIcon className="h-6 w-6 text-primary-400 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Confirm Booking</h2>
                </div>

                {createdBooking ? (
                  <div className="space-y-6">
                    <div className="border border-emerald-400/40 bg-emerald-500/10 rounded-lg p-6">
                      <h3 className="font-medium text-emerald-100 mb-2">Booking created</h3>
                      <p className="text-sm text-emerald-100/80 mb-4">
                        Your booking has been submitted successfully.
                      </p>
                      <div className="text-sm text-emerald-100/80 space-y-1">
                        {createdBooking?.status && (
                          <div className="flex justify-between gap-4">
                            <span>Status:</span>
                            <span className="text-emerald-100">{createdBooking.status}</span>
                          </div>
                        )}
                        {createdBooking?.id && (
                          <div className="flex justify-between gap-4">
                            <span>Booking ID:</span>
                            <span className="text-emerald-100 font-mono text-xs">{createdBooking.id}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* QR Code Section */}
                    <BookingQRCode 
                      booking={createdBooking} 
                      facilityName={facility?.name}
                    />

                    <div className="pt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => navigate(facilityPath)}
                        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200"
                      >
                        Back to Facility
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCreatedBooking(null);
                          setCurrentStep(1);
                          setSelectedDate('');
                          setSelectedTime('');
                          setDuration(1);
                          setPurpose('');
                          setAttendees(1);
                        }}
                        className="px-6 py-3 border border-orange-600/40 text-orange-100 rounded-lg hover:bg-orange-500/10 transition-all duration-200"
                      >
                        New Booking
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-black/30 border border-orange-600/30 rounded-lg p-6">
                    <h3 className="font-medium text-white mb-4">Review Your Booking</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-orange-600/20">
                      <span className="text-orange-100/70">Date:</span>
                      <span className="text-orange-100/90 font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-orange-600/20">
                      <span className="text-orange-100/70">Time:</span>
                      <span className="text-orange-100/90 font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-orange-600/20">
                      <span className="text-orange-100/70">Duration:</span>
                      <span className="text-orange-100/90 font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-orange-600/20">
                      <span className="text-orange-100/70">Attendees:</span>
                      <span className="text-orange-100/90 font-medium">{attendees} people</span>
                    </div>
                    <div className="py-2">
                      <span className="text-orange-100/70">Purpose:</span>
                      <p className="text-orange-100/90 mt-1">{purpose}</p>
                    </div>
                  </div>
                  </div>
                )}

                {submitError && (
                  <div className="border border-red-500/40 bg-red-500/10 rounded-lg p-4">
                    <p className="text-sm text-red-100 whitespace-pre-line break-words">{submitError}</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={handlePrevious}
                className={`px-6 py-3 border border-orange-600/40 text-orange-100 rounded-lg hover:bg-orange-500/10 transition-all duration-200 ${
                  currentStep === 1 ? 'invisible' : ''
                }`}
              >
                Previous
              </button>

              <div className="flex space-x-3">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={(currentStep === 1 && !step1Valid) || (currentStep === 2 && !step2Valid)}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!step1Valid || !step2Valid || submitLoading || Boolean(createdBooking)}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitLoading ? 'Submitting…' : 'Confirm Booking'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        </>
        )}

      </div>
    </div>
  );
};

export default BookingWorkflow;
