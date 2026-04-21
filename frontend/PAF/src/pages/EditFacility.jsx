import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const EditFacility = () => {
  const { id } = useParams();
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
    status: 'ACTIVE',
    availableStartTime: '08:00',
    availableEndTime: '22:00',
    availableWeekends: false,
    imageFile: null
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchFacilityData();
    fetchFilterOptions();
  }, [id]);

  const fetchFacilityData = async () => {
    try {
      const response = await facilityAPI.getFacilityById(id);
      const facility = response.data;
      setFormData({
        name: facility.name || '',
        type: facility.type || '',
        capacity: facility.capacity?.toString() || '',
        location: facility.location || '',
        description: facility.description || '',
        status: facility.status || 'ACTIVE',
        availableStartTime: facility.availableStartTime || '08:00',
        availableEndTime: facility.availableEndTime || '22:00',
        availableWeekends: facility.availableWeekends || false,
        imageFile: null
      });
      
      // Set image preview if facility has images
      if (facility.images && facility.images.length > 0) {
        setImagePreview(facility.images[0]);
      }
    } catch (err) {
      setError('Failed to load facility data');
      console.error('Error fetching facility:', err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageFile: null }));
    setImagePreview(null);
  };

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
    setError(null);

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields except imageFile
      Object.keys(formData).forEach(key => {
        if (key !== 'imageFile') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Convert capacity to number
      formDataToSend.set('capacity', parseInt(formData.capacity));
      
      // Add image if selected
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }

      await facilityAPI.updateFacility(id, formDataToSend);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/facilities/${id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update facility');
      console.error('Error updating facility:', err);
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
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700 shadow-lg">
                  <CheckCircleIcon className="h-10 w-10 text-white animate-pulse" />
                </div>
              </div>

              {/* Success Message with Animation */}
              <div className="text-center space-y-3 animate-slide-in" style={{ animationDelay: '0.5s' }}>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 bg-clip-text text-transparent mb-4 animate-fade-in">
                  🎉 Facility Updated Successfully!
                </h3>
                
                <div className="bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 rounded-xl p-6 border border-pink-200 shadow-lg">
                  <div className="flex items-center space-x-3 text-pink-800 dark:text-pink-200">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8 8 0 018 8 0 01-4.37 4.37z"></path>
                    </svg>
                    <span className="text-sm font-medium">Processing changes...</span>
                  </div>
                </div>

                <div className="space-y-2 text-pink-300 dark:text-pink-400 animate-fade-in" style={{ animationDelay: '1s' }}>
                  <p className="text-lg font-medium">✨ Your facility has been successfully updated!</p>
                  <p className="text-sm">🔄 Redirecting to facility details page...</p>
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <span className="inline-flex items-center px-3 py-1 bg-pink-600/20 rounded-full">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-6 6 100-6 6 018-1.5 1.5 018-1.5 018-6 6 018-1.5 1.5 018-6 6z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Changes saved to database</span>
                    <span className="inline-flex items-center px-3 py-1 bg-pink-600/20 rounded-full">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-6 6 100-6 6 018-1.5 1.5 018-1.5 018-6 6 018-1.5 1.5 018-6 6z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>UI updated</span>
                  </div>
                </div>

                {/* Progress Bar Animation */}
                <div className="w-full bg-pink-600/20 rounded-full h-2 overflow-hidden animate-slide-in" style={{ animationDelay: '1.5s' }}>
                  <div className="h-full bg-gradient-to-r from-pink-500 via-pink-600 to-rose-500 rounded-full animate-progress-fill"></div>
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

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-400 bg-clip-text text-transparent">
              Edit Facility
            </span>
          </h1>
          <p className="text-xl text-gray-300 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            Update facility information
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate(`/facilities/${id}`)}
              className="inline-flex items-center px-4 py-2 border border-orange-600/50 text-sm font-medium rounded-lg text-orange-300 bg-black/50 hover:bg-orange-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Facility
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-gradient-to-br from-red-900/80 via-red-800/60 to-red-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-red-600/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-200">Error</h3>
                  <div className="mt-2 text-sm text-red-300">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gradient-to-br from-black/80 via-orange-900/40 to-black/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-orange-600/30">
              <div className="space-y-6">
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
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-orange-300 mb-1">
                    Description
                  </label>
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

                {/* Image Upload */}
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
                            className="mx-auto h-32 w-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <PhotoIcon className="mx-auto h-12 w-12 text-orange-400" />
                          <div className="flex text-sm text-orange-300">
                            <label
                              htmlFor="image-upload"
                              className="relative cursor-pointer rounded-md font-medium text-orange-300 hover:text-orange-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="image-upload"
                                name="image-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-orange-400">PNG, JPG, GIF up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Availability Settings */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Availability Settings
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="availableStartTime" className="block text-sm font-medium text-orange-300 mb-1">
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
                          className="block w-full pl-10 pr-3 py-2 border border-orange-600/50 rounded-md bg-black/50 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-400"
                          value={formData.availableStartTime}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="availableEndTime" className="block text-sm font-medium text-orange-300 mb-1">
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
                          className="block w-full pl-10 pr-3 py-2 border border-orange-600/50 rounded-md bg-black/50 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-400"
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
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-orange-300 rounded"
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
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/facilities/${id}`)}
                className="px-4 py-2 border border-orange-600/50 text-sm font-medium rounded-lg text-orange-300 bg-black/50 hover:bg-orange-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
              >
                Update Facility
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFacility;
