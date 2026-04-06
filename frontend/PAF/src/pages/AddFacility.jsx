import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { facilityAPI } from '../services/api';
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const AddFacility = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [facilityTypes, setFacilityTypes] = useState([]);
  const [facilityStatuses, setFacilityStatuses] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    location: '',
    description: '',
    status: 'ACTIVE',
    availableStartTime: '08:00',
    availableEndTime: '22:00',
    availableWeekends: false,
    imageUrl: ''
  });

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const [typesResponse, statusesResponse] = await Promise.all([
        facilityAPI.getFacilityTypes(),
        facilityAPI.getFacilityStatuses()
      ]);
      setFacilityTypes(typesResponse.data);
      setFacilityStatuses(statusesResponse.data);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const facilityData = {
        ...formData,
        capacity: parseInt(formData.capacity)
      };

      await facilityAPI.createFacility(facilityData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/facilities');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create facility');
      console.error('Error creating facility:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Success</h3>
            <div className="mt-2 text-sm text-green-700">
              Facility created successfully! Redirecting to facilities list...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-700/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center mb-8 pt-4">
          <button
            onClick={() => navigate('/facilities')}
            className="mr-4 p-2 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-950/50 transition-all duration-300 transform hover:scale-110"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Add New Facility
            </h1>
            <p className="mt-1 text-gray-400">
              Create a new facility for campus catalogue
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-950/90 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-semibold text-red-300">Error</h3>
                  <div className="mt-2 text-sm text-red-400">{error}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 flex-grow pb-24">
          <div className="bg-gradient-to-br from-gray-900/80 to-black/90 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-500/20">
            <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Facility Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BuildingOfficeIcon className="h-5 w-5 text-orange-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-700/50 rounded-md bg-gray-900/50 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-400 placeholder-gray-500"
                      placeholder="Enter facility name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
                    Facility Type *
                  </label>
                  <select
                    name="type"
                    id="type"
                    required
                    className="block w-full px-3 py-2 border border-gray-700/50 rounded-md bg-gray-900/50 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-400"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="">Select a type</option>
                    {facilityTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-300 mb-1">
                    Capacity *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserGroupIcon className="h-5 w-5 text-orange-400" />
                    </div>
                    <input
                      type="number"
                      name="capacity"
                      id="capacity"
                      required
                      min="1"
                      max="1000"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-700/50 rounded-md bg-gray-900/50 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-400 placeholder-gray-500"
                      placeholder="Enter capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                    Location *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPinIcon className="h-5 w-5 text-orange-400" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-700/50 rounded-md bg-gray-900/50 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-400 placeholder-gray-500"
                      placeholder="Enter location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                    Status *
                  </label>
                  <select
                    name="status"
                    id="status"
                    required
                    className="block w-full px-3 py-2 border border-gray-700/50 rounded-md bg-gray-900/50 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-400"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    {facilityStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    id="imageUrl"
                    className="block w-full px-3 py-2 border border-gray-700/50 rounded-md bg-gray-900/50 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-400 placeholder-gray-500"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                Description
              </h3>
              <textarea
                name="description"
                id="description"
                rows={4}
                className="block w-full px-3 py-2 border border-gray-700/50 rounded-md bg-gray-900/50 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-400 placeholder-gray-500"
                placeholder="Enter facility description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Availability Settings */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                Availability Settings
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="availableStartTime" className="block text-sm font-medium text-gray-300 mb-1">
                    Available Start Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClockIcon className="h-5 w-5 text-orange-400" />
                    </div>
                    <input
                      type="time"
                      name="availableStartTime"
                      id="availableStartTime"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-700/50 rounded-md bg-gray-900/50 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-400"
                      value={formData.availableStartTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="availableEndTime" className="block text-sm font-medium text-gray-300 mb-1">
                    Available End Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClockIcon className="h-5 w-5 text-orange-400" />
                    </div>
                    <input
                      type="time"
                      name="availableEndTime"
                      id="availableEndTime"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-700/50 rounded-md bg-gray-900/50 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-400"
                      value={formData.availableEndTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="availableWeekends"
                    id="availableWeekends"
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-700/50 rounded bg-gray-900/50"
                    checked={formData.availableWeekends}
                    onChange={handleChange}
                  />
                  <label htmlFor="availableWeekends" className="ml-2 block text-sm text-white">
                    Available on weekends
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
            <div className="flex justify-center space-x-4 mt-8 mb-8">
              <button
                type="button"
                onClick={() => navigate('/facilities')}
                className="group relative px-8 py-3 text-sm font-medium rounded-xl transition-all duration-500 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-300">Cancel</span>
                </div>
                <div className="absolute inset-0 rounded-xl border border-gray-700/50 group-hover:border-gray-600/70 transition-colors duration-300"></div>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="group relative px-8 py-3 text-sm font-medium rounded-xl transition-all duration-500 transform hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                  <span className="text-white font-medium">
                    {loading ? 'Creating...' : 'Create Facility'}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-xl border border-orange-500/50 group-hover:border-orange-400/70 transition-colors duration-300"></div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default AddFacility;
