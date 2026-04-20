import { useState } from 'react';
import {
  CalendarDaysIcon,
  ClockIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

const FACILITIES = [
  { id: 'lib-room-1', name: 'Library Study Room 1' },
  { id: 'lib-room-2', name: 'Library Study Room 2' },
  { id: 'lab-cs-1', name: 'CS Lab 1' },
  { id: 'lab-cs-2', name: 'CS Lab 2' },
  { id: 'auditorium', name: 'Main Auditorium' },
  { id: 'seminar-hall', name: 'Seminar Hall' },
  { id: 'sports-court', name: 'Sports Court' },
];

const BookingForm = ({ onSubmit, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState({
    facilityId: initialData?.facilityId || '',
    facilityName: initialData?.facilityName || '',
    bookingDate: initialData?.bookingDate || '',
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
    purpose: initialData?.purpose || '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'facilityId') {
      const facility = FACILITIES.find((f) => f.id === value);
      setFormData((prev) => ({
        ...prev,
        facilityId: value,
        facilityName: facility?.name || '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.facilityId) newErrors.facilityId = 'Select a facility';
    if (!formData.bookingDate) newErrors.bookingDate = 'Select a date';
    if (!formData.startTime) newErrors.startTime = 'Select start time';
    if (!formData.endTime) newErrors.endTime = 'Select end time';
    if (!formData.purpose.trim()) newErrors.purpose = 'Enter purpose';
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      if (!isEditing) {
        setFormData({
          facilityId: '',
          facilityName: '',
          bookingDate: '',
          startTime: '',
          endTime: '',
          purpose: '',
        });
      }
    } catch {
      setErrors({ general: 'Failed to submit booking. Try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm text-center">{errors.general}</p>
        </div>
      )}

      {/* Facility Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <BuildingOfficeIcon className="inline h-4 w-4 mr-1 text-orange-500" />
          Facility
        </label>
        <select
          name="facilityId"
          value={formData.facilityId}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
            errors.facilityId ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a facility</option>
          {FACILITIES.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        {errors.facilityId && <p className="mt-1 text-sm text-red-500">{errors.facilityId}</p>}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <CalendarDaysIcon className="inline h-4 w-4 mr-1 text-orange-500" />
          Booking Date
        </label>
        <input
          type="date"
          name="bookingDate"
          value={formData.bookingDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
            errors.bookingDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.bookingDate && <p className="mt-1 text-sm text-red-500">{errors.bookingDate}</p>}
      </div>

      {/* Time Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <ClockIcon className="inline h-4 w-4 mr-1 text-orange-500" />
            Start Time
          </label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
              errors.startTime ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.startTime && <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <ClockIcon className="inline h-4 w-4 mr-1 text-orange-500" />
            End Time
          </label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all ${
              errors.endTime ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.endTime && <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>}
        </div>
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DocumentTextIcon className="inline h-4 w-4 mr-1 text-orange-500" />
          Purpose
        </label>
        <textarea
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          rows={3}
          placeholder="Describe your booking purpose..."
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none ${
            errors.purpose ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.purpose && <p className="mt-1 text-sm text-red-500">{errors.purpose}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Submitting...
          </>
        ) : (
          <>
            <PaperAirplaneIcon className="h-5 w-5" />
            {isEditing ? 'Update Booking' : 'Submit Booking'}
          </>
        )}
      </button>
    </form>
  );
};

export default BookingForm;
