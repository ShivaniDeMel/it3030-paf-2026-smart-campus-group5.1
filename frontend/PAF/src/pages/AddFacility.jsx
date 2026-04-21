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
  XCircleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const AddFacility = () => {
  const navigate = useNavigate();
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
    status: '', // Changed from 'ACTIVE' to empty string
    availableStartTime: '08:00',
    availableEndTime: '22:00',
    availableWeekends: false,
    imageFile: null
  });
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({
          ...prev,
          imageFile: file
        }));
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please select a valid image file');
        e.target.value = ''; // Clear the input
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      imageFile: null
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'imageFile') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add capacity as number
      formDataToSend.set('capacity', parseInt(formData.capacity));
      
      // Add image file if exists
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }

      await facilityAPI.createFacility(formDataToSend);
      setSuccess(true);
      setTimeout(() => {
        navigate('/facilities');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create facility');
      console.error('Error creating facility:', err);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-orange-800 to-black relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-700/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '6s' }}></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="bg-gradient-to-br from-pink-900/80 via-pink-800/60 to-pink-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-pink-600/30 animate-fade-in">
            <div className="flex flex-col items-center space-y-4">
              {/* Success Icon with Animation */}
              <div className="flex-shrink-0 animate-bounce-in">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-green-500 via-green-600 to-green-700 shadow-lg">
                  <CheckCircleIcon className="h-10 w-10 text-white animate-pulse" />
                </div>
              </div>

              {/* Success Message with Animation */}
              <div className="text-center space-y-3 animate-slide-in" style={{ animationDelay: '0.5s' }}>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-emerald-400 bg-clip-text text-transparent mb-4 animate-fade-in">
                  🎉 Facility Created Successfully!
                </h3>
                
                <div className="bg-gradient-to-r from-green-100 via-emerald-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-lg">
                  <div className="flex items-center space-x-3 text-green-800 dark:text-green-200">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8 8 0 018 8 0 01-4.37 4.37z"></path>
                    </svg>
                    <span className="text-sm font-medium">Processing changes...</span>
                  </div>
                </div>

                <div className="space-y-2 text-green-300 dark:text-green-400 animate-fade-in" style={{ animationDelay: '1s' }}>
                  <p className="text-lg font-medium">✨ Your facility has been successfully created!</p>
                  <p className="text-sm">🔄 Redirecting to facilities list...</p>
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <span className="inline-flex items-center px-3 py-1 bg-green-600/20 rounded-full">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-6 6 100-6 6 018-1.5 1.5 018-1.5 018-6 6 018-1.5 1.5 018-6 6z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Changes saved to database</span>
                    <span className="inline-flex items-center px-3 py-1 bg-green-600/20 rounded-full">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-6 6 100-6 6 018-1.5 1.5 018-1.5 018-6 6 018-1.5 1.5 018-6 6z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>UI updated</span>
                  </div>
                </div>

                {/* Progress Bar Animation */}
                <div className="w-full bg-green-600/20 rounded-full h-2 overflow-hidden animate-slide-in" style={{ animationDelay: '1.5s' }}>
                  <div className="h-full bg-gradient-to-r from-green-500 via-green-600 to-emerald-500 rounded-full animate-progress-fill"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-800 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-700/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '6s' }}></div>
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
            <h1 className="text-3xl font-bold text-orange-400">
              Add New Facility
            </h1>
            <p className="mt-1 text-orange-300">
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
          <div className="bg-gradient-to-br from-black via-orange-900/30 to-black backdrop-blur-md rounded-2xl shadow-2xl border border-orange-600/30">
            <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-orange-300 mb-1">
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
                      className="block w-full pl-10 pr-3 py-2 border border-orange-600/50 rounded-md bg-black/50 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-400 placeholder-orange-300/50"
                      placeholder="Enter facility name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-orange-300 mb-1">
                    Facility Type *
                  </label>
                  <select
                    name="type"
                    id="type"
                    required
                    className="block w-full px-3 py-2 border border-orange-600/50 rounded-md bg-black/50 text-orange-300 focus:outline-none focus:ring-orange-500 focus:border-orange-400"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="" className="bg-black/50 text-orange-300">
                      Select a type
                    </option>
                    {[
                      'lecture_hall',
                      'laboratory',
                      'meeting_room',
                      'auditorium',
                      'sports_facility',
                      'study_area',
                      'equipment'
                    ].map((type) => (
                      <option key={type} value={type} className="bg-black/50 text-orange-300">
                        {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-orange-300 mb-1">
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
                      className="block w-full pl-10 pr-3 py-2 border border-orange-600/50 rounded-md bg-black/50 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-400 placeholder-orange-300/50"
                      placeholder="Enter capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-orange-300 mb-1">
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
                      className="block w-full pl-10 pr-3 py-2 border border-orange-600/50 rounded-md bg-black/50 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-400 placeholder-orange-300/50"
                      placeholder="Enter location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-orange-300 mb-1">
                    Status *
                  </label>
                  <select
                    name="status"
                    id="status"
                    required
                    className="block w-full px-3 py-2 border border-orange-600/50 rounded-md bg-black/50 text-orange-300 focus:outline-none focus:ring-orange-500 focus:border-orange-400"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="" className="bg-black/50 text-orange-300">
                      Select a status
                    </option>
                    <option value="ACTIVE" className="bg-black/50 text-orange-300">
                      Active
                    </option>
                    <option value="MAINTENANCE" className="bg-black/50 text-orange-300">
                      Maintenance
                    </option>
                    <option value="OUT_OF_SERVICE" className="bg-black/50 text-orange-300">
                      Out of Service
                    </option>
                    <option value="UNDER_REVIEW" className="bg-black/50 text-orange-300">
                      Under Review
                    </option>
                  </select>
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-orange-300 mb-1">
                    Facility Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-orange-600/50 border-dashed rounded-md hover:border-orange-500 transition-colors">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Facility preview"
                            className="mx-auto h-32 w-32 object-cover rounded-lg shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <PhotoIcon className="mx-auto h-12 w-12 text-orange-400" />
                      )}
                      <div className="flex text-sm text-orange-300">
                        <label
                          htmlFor="image"
                          className="relative cursor-pointer rounded-md bg-orange-600/20 font-medium text-orange-300 hover:bg-orange-600/30 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-orange-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
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
                className="block w-full px-3 py-2 border border-orange-600/50 rounded-md bg-black/50 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-400 placeholder-orange-300/50"
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
                className="group relative px-8 py-3 text-sm font-medium rounded-xl transition-all duration-500 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-white font-medium">
                    Create Facility
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
