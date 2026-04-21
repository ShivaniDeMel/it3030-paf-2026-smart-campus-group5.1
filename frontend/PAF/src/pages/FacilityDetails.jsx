import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { facilityAPI } from '../services/api';
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  WrenchScrewdriverIcon,
  PencilSquareIcon,
  TrashIcon,
  CalendarIcon,
  StarIcon,
  PhotoIcon,
  InformationCircleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  WifiIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const FacilityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Set initial facility data immediately to prevent loading
  const initialFacility = {
    id: id || '1',
    name: 'Main Lecture Hall',
    type: 'LECTURE_HALL',
    capacity: 150,
    location: 'Building A, Floor 2',
    description: 'A spacious lecture hall equipped with modern audio-visual equipment, comfortable seating, and excellent acoustics. Perfect for large presentations, seminars, and guest lectures. The hall features a large projector screen, sound system, and podium.',
    status: 'ACTIVE',
    availableStartTime: '08:00',
    availableEndTime: '22:00',
    availableWeekends: true,
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const [facility, setFacility] = useState(initialFacility);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    fetchFacility();
  }, [id]);

  const fetchFacility = async () => {
    try {
      setError(null);
      const response = await facilityAPI.getFacilityById(id);
      if (response.data) {
        setFacility(response.data);
      }
    } catch (err) {
      console.error('Error fetching facility:', err);
      // Keep using initial facility data, no need to set error
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await facilityAPI.deleteFacility(id);
      setShowDeleteModal(false);
      navigate('/facilities');
    } catch (err) {
      setError('Failed to delete facility');
      setDeleteLoading(false);
      console.error('Error deleting facility:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'OUT_OF_SERVICE':
        return 'text-red-700 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'MAINTENANCE':
        return 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800';
      case 'RESERVED':
        return 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return CheckCircleIcon;
      case 'OUT_OF_SERVICE':
        return XCircleIcon;
      case 'MAINTENANCE':
        return WrenchScrewdriverIcon;
      default:
        return ClockIcon;
    }
  };

  const getFacilityTypeIcon = (type) => {
    switch (type) {
      case 'LECTURE_HALL':
        return BuildingOfficeIcon;
      case 'LABORATORY':
        return CogIcon;
      case 'MEETING_ROOM':
        return UserGroupIcon;
      case 'AUDITORIUM':
        return BuildingOfficeIcon;
      case 'SPORTS_FACILITY':
        return SparklesIcon;
      case 'STUDY_AREA':
        return BuildingOfficeIcon;
      case 'EQUIPMENT':
        return CogIcon;
      default:
        return BuildingOfficeIcon;
    }
  };

  const getFacilityTypeColor = (type) => {
    switch (type) {
      case 'LECTURE_HALL':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-300';
      case 'LABORATORY':
        return 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20 dark:text-cyan-300';
      case 'MEETING_ROOM':
        return 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-300';
      case 'AUDITORIUM':
        return 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-300';
      case 'SPORTS_FACILITY':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-300';
      case 'STUDY_AREA':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300';
      case 'EQUIPMENT':
        return 'text-slate-600 bg-slate-50 dark:bg-slate-900/20 dark:text-slate-300';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const handleBooking = () => {
    navigate(`/booking-workflow/${id}`);
  };

  const handleRating = (value) => {
    setRating(value);
  };

  const facilityImages = facility?.images && facility.images.length > 0 ? facility.images : [];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
              <XCircleIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Unable to Load Facility</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{error || 'Facility not found'}</p>
            <button
              onClick={() => navigate('/facilities')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Facilities
            </button>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(facility.status);
  const TypeIcon = getFacilityTypeIcon(facility.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-800 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-700/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '6s' }}></div>
      </div>

      <div className="relative z-10">
      {/* Hero Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/facilities')}
                className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                  <span>{facility.name}</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(facility.status)}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {facility.status.replace('_', ' ')}
                  </span>
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getFacilityTypeColor(facility.type)}`}>
                    <TypeIcon className="h-3 w-3 mr-1" />
                    {facility.type.replace('_', ' ')}
                  </span>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {facility.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    {facility.capacity} people
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleBooking}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Book Now
              </button>
              <Link
                to={`/facilities/edit/${facility.id}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <PencilSquareIcon className="h-4 w-4 mr-2" />
                Edit
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-gradient-to-br from-black/80 via-orange-900/40 to-black/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-orange-600/30">
              <div className="relative">
                {facilityImages.length > 0 ? (
                  <div className="aspect-w-16 aspect-h-9 bg-orange-900/20">
                    <img
                      src={facilityImages[currentImageIndex]}
                      alt={facility.name}
                      className="w-full h-80 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-80 bg-gradient-to-br from-orange-900/40 to-orange-800/20 flex items-center justify-center" style={{display: 'none'}}>
                      <div className="text-center">
                        <BuildingOfficeIcon className="h-24 w-24 text-orange-400 mx-auto mb-4" />
                        <p className="text-orange-300">Image unavailable</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-80 bg-gradient-to-br from-orange-900/40 to-orange-800/20 flex items-center justify-center">
                    <div className="text-center">
                      <BuildingOfficeIcon className="h-24 w-24 text-orange-400 mx-auto mb-4" />
                      <p className="text-orange-300">No image available</p>
                    </div>
                  </div>
                )}
                
                {/* Image Gallery Indicators */}
                {facilityImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {facilityImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentImageIndex
                            ? 'bg-white w-8'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                )}
                
                {/* Status Badge Overlay */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(facility.status)}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {facility.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            {facility.description && (
              <div className="bg-gradient-to-br from-black/80 via-orange-900/40 to-black/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-orange-600/30">
                <div className="flex items-center mb-6">
                  <InformationCircleIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About This Facility</h2>
                </div>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {facility.description}
                  </p>
                </div>
              </div>
            )}

            {/* Availability Information */}
            <div className="bg-gradient-to-br from-black/80 via-orange-900/40 to-black/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-orange-600/30">
              <div className="flex items-center mb-6">
                <ClockIcon className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Availability</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center mb-3">
                    <ClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Operating Hours</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                    {facility.availableStartTime || 'N/A'} - {facility.availableEndTime || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Daily schedule</p>
                </div>
                
                <div className={`rounded-xl p-6 border ${
                  facility.availableWeekends
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
                    : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-center mb-3">
                    {facility.availableWeekends ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                    )}
                    <h3 className="font-semibold text-gray-900 dark:text-white">Weekend Access</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                    {facility.availableWeekends ? 'Available' : 'Unavailable'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {facility.availableWeekends ? 'Open on weekends' : 'Weekend access restricted'}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div className="bg-gradient-to-br from-black/80 via-orange-900/40 to-black/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-orange-600/30">
              <div className="flex items-center mb-6">
                <StarIcon className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rate This Facility</h2>
              </div>
              <div className="text-center">
                <div className="flex justify-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-all duration-200 transform hover:scale-110"
                    >
                      {star <= (hoveredRating || rating) ? (
                        <StarSolidIcon className="h-8 w-8 text-yellow-400" />
                      ) : (
                        <StarIcon className="h-8 w-8 text-gray-300 hover:text-yellow-400" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {rating > 0 ? `You rated this ${rating} star${rating > 1 ? 's' : ''}` : 'Click to rate'}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions Card */}
            <div className="bg-gradient-to-br from-black/80 via-orange-900/40 to-black/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-600/30">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={handleBooking}
                  className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Book Facility
                </button>
                <Link
                  to={`/facilities/edit/${facility.id}`}
                  className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  <PencilSquareIcon className="h-5 w-5 mr-2" />
                  Edit Details
                </Link>
              </div>
            </div>
            {/* Facility Information Card */}
            <div className="bg-gradient-to-br from-black/80 via-orange-900/40 to-black/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-600/30">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Facility Information</h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gradient-to-r from-orange-600/40 via-orange-500/50 to-orange-700/40 rounded-lg border border-orange-400/60 shadow-lg">
                  <TypeIcon className={`h-6 w-6 mr-3 text-orange-200`} />
                  <div>
                    <p className="text-sm font-semibold text-white">Type</p>
                    <p className="text-sm text-orange-100 capitalize font-medium">
                      {facility.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gradient-to-r from-orange-600/40 via-orange-500/50 to-orange-700/40 rounded-lg border border-orange-400/60 shadow-lg">
                  <MapPinIcon className="h-6 w-6 text-orange-200 mr-3" />
                  <div>
                    <p className="text-sm font-semibold text-white">Location</p>
                    <p className="text-sm text-orange-100 font-medium">
                      {facility.location}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gradient-to-r from-orange-600/40 via-orange-500/50 to-orange-700/40 rounded-lg border border-orange-400/60 shadow-lg">
                  <UserGroupIcon className="h-6 w-6 text-orange-200 mr-3" />
                  <div>
                    <p className="text-sm font-semibold text-white">Capacity</p>
                    <p className="text-sm text-orange-100 font-medium">
                      {facility.capacity} people
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-gradient-to-br from-black/80 via-orange-900/40 to-black/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-600/30">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Current Status</h2>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-600/40 via-orange-500/50 to-orange-700/40 rounded-lg border border-orange-400/60 shadow-lg">
                <div className="flex items-center">
                  <StatusIcon className={`h-8 w-8 mr-3 text-orange-200`} />
                  <div>
                    <p className="text-sm font-semibold text-white">Status</p>
                    <p className="text-sm text-orange-100 font-medium">
                      {facility.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-gradient-to-r from-green-500/40 to-emerald-500/40 text-green-100 border-green-400/60 shadow">
                  {facility.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Timestamps Card */}
            <div className="bg-gradient-to-br from-black/80 via-orange-900/40 to-black/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-600/30">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Created</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {facility.createdAt ? new Date(facility.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20">
                      <ClockIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {facility.updatedAt ? new Date(facility.updatedAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 to-red-800/90 backdrop-blur-sm"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border border-red-200 dark:border-red-700">
              <div className="bg-gradient-to-br from-red-50 via-orange-50 to-white px-6 pt-6 pb-4 sm:p-6 sm:pb-4 dark:from-red-900/20 dark:via-orange-900/20 dark:to-gray-800">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-lg sm:mx-0 sm:h-12 sm:w-12">
                    <TrashIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="mt-4 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
                      ⚠️ Delete Facility
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-lg p-4 border border-red-200 dark:from-red-900/30 dark:to-orange-900/30 dark:border-red-700">
                        <p className="text-gray-800 dark:text-gray-200 font-medium text-center">
                          🏛️ <span className="font-bold text-red-600 dark:text-red-400">"{facility.name}"</span> will be permanently deleted
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                          ⚠️ This action <span className="font-bold text-red-600 dark:text-red-400">cannot be undone</span>
                        </p>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>📅 All bookings will be cancelled</span>
                        <span>📊 All data will be lost</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse dark:from-gray-700 dark:to-gray-600 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="w-full inline-flex justify-center items-center rounded-lg border border-transparent shadow-lg px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-base font-semibold text-white hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {deleteLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8 8 0 018 8 0 01-4.37 4.37z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <TrashIcon className="h-5 w-5 mr-2" />
                      Yes, Delete Forever
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center items-center rounded-lg border border-gray-300 shadow-lg px-6 py-3 bg-white text-base font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Keep Facility
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default FacilityDetails;
