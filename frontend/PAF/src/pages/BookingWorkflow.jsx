import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const BookingWorkflow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
  ];

  const buildDateTimeString = (dateValue, timeValue) => `${dateValue}T${timeValue}:00`;

  const canProceed =
    (currentStep === 1 && selectedDate && selectedTime) ||
    (currentStep === 2 && purpose.trim() && attendees > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    if (!id) {
      setErrorMessage('Missing facility ID. Please return and select a facility again.');
      return;
    }

    if (!isAuthenticated || !user) {
      setErrorMessage('Please sign in before submitting a booking.');
      return;
    }

    const userId = user.id || user.userId || user.email;
    if (!userId) {
      setErrorMessage('Unable to resolve your user ID. Please sign in again.');
      return;
    }

    const startTime = buildDateTimeString(selectedDate, selectedTime);
    const startDateObject = new Date(startTime);
    const endDateObject = new Date(startDateObject.getTime() + duration * 60 * 60 * 1000);
    const endTime = `${endDateObject.getFullYear()}-${String(endDateObject.getMonth() + 1).padStart(2, '0')}-${String(endDateObject.getDate()).padStart(2, '0')}T${String(endDateObject.getHours()).padStart(2, '0')}:${String(endDateObject.getMinutes()).padStart(2, '0')}:00`;

    try {
      setSubmitting(true);

      const availabilityResponse = await bookingAPI.checkAvailability(id, startTime, endTime);
      if (!availabilityResponse.data?.available) {
        setErrorMessage('Selected time slot is no longer available. Please choose another slot.');
        return;
      }

      await bookingAPI.createBooking({
        facilityId: id,
        userId,
        startTime,
        endTime,
        purpose: purpose.trim(),
        attendeeCount: attendees
      });

      setSuccessMessage('Booking submitted successfully.');
      setTimeout(() => navigate(`/facilities/${id}`), 1000);
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      setErrorMessage(backendMessage || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-800 to-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-black/80 via-orange-900/40 to-black/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-orange-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to={`/facilities/${id}`}
                className="p-2 rounded-xl text-orange-300 hover:text-white hover:bg-orange-700/30 transition-all duration-200"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">Book Facility</h1>
                <p className="text-orange-200/80">Complete the steps below to reserve this facility</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-gradient-to-br from-black/80 via-orange-900/40 to-black/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-orange-600/30">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-black/40 border-orange-700/50 text-orange-200'
                }`}>
                  {step}
                </div>
                <span className={`ml-3 text-sm font-medium ${
                  currentStep >= step ? 'text-orange-300' : 'text-orange-200/70'
                }`}>
                  {step === 1 ? 'Date & Time' : step === 2 ? 'Details' : 'Confirmation'}
                </span>
                {step < 3 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step ? 'bg-primary-600' : 'bg-orange-800/70'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-gradient-to-br from-black/80 via-orange-900/40 to-black/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-orange-600/30">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Date & Time */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <CalendarIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Select Date & Time</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-200 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2 border border-orange-700/50 rounded-lg bg-black/50 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-200 mb-2">
                    Start Time
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                          selectedTime === time
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-black/40 text-orange-100 border-orange-700/50 hover:bg-orange-800/30'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-200 mb-2">
                    Duration (hours)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-orange-700/50 rounded-lg bg-black/50 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
                      <option key={hour} value={hour}>
                        {hour} hour{hour > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <InformationCircleIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Booking Details</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-200 mb-2">
                    Purpose of Booking
                  </label>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-orange-700/50 rounded-lg bg-black/50 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Describe the purpose of this booking..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-200 mb-2">
                    Number of Attendees
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max="200"
                      value={attendees}
                      onChange={(e) => setAttendees(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="h-5 w-5 text-orange-300" />
                      <span className="text-lg font-medium text-white">{attendees}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="bg-black/40 border border-orange-700/40 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-orange-200/80">Date:</span>
                      <span className="text-white">{selectedDate || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-200/80">Time:</span>
                      <span className="text-white">{selectedTime || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-200/80">Duration:</span>
                      <span className="text-white">{duration} hour{duration > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-200/80">Attendees:</span>
                      <span className="text-white">{attendees} people</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <CheckCircleIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <h2 className="text-2xl font-bold text-white">Confirm Booking</h2>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <h3 className="font-medium text-green-900 dark:text-green-300 mb-4">Review Your Booking</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-green-200 dark:border-green-800">
                      <span className="text-gray-600 dark:text-gray-400">Date:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-green-200 dark:border-green-800">
                      <span className="text-gray-600 dark:text-gray-400">Time:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-green-200 dark:border-green-800">
                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-green-200 dark:border-green-800">
                      <span className="text-gray-600 dark:text-gray-400">Attendees:</span>
                      <span className="text-gray-900 dark:text-white font-medium">{attendees} people</span>
                    </div>
                    <div className="py-2">
                      <span className="text-gray-600 dark:text-gray-400">Purpose:</span>
                      <p className="text-gray-900 dark:text-white mt-1">{purpose}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <strong>Note:</strong> Your booking will be validated for conflicts before it is saved.
                  </p>
                </div>
              </div>
            )}

            {(errorMessage || successMessage) && (
              <div className={`rounded-lg p-4 text-sm border ${
                errorMessage
                  ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
                  : 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
              }`}>
                {errorMessage || successMessage}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className={`px-6 py-3 border border-orange-700/50 text-orange-100 rounded-lg hover:bg-orange-800/30 transition-all duration-200 ${
                  currentStep === 1 ? 'invisible' : ''
                }`}
              >
                Previous
              </button>

              <div className="flex space-x-3">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceed}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Confirm Booking'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingWorkflow;
