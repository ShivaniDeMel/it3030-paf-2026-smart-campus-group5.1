import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { facilityAPI } from '../services/api';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusCircleIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  XCircleIcon,
  ArrowRightIcon,
  StarIcon,
  MapPinIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const FacilitiesCatalogue = () => {
  const [facilities, setFacilities] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    minCapacity: '',
    maxCapacity: '',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [facilityTypes, setFacilityTypes] = useState([]);
  const [facilityStatuses, setFacilityStatuses] = useState([]);

  useEffect(() => {
    fetchFacilities();
    fetchFilterOptions();
  }, []);

  const fetchFacilities = async (retryCount = 0) => {
    try {
      setError(null);
      const response = await facilityAPI.getAllFacilities();
      setFacilities(response.data || []);
    } catch (err) {
      const shouldRetry = retryCount < 2 && (err.code === 'ECONNABORTED' || err.message?.includes('timeout') || !err.response);
      if (shouldRetry) {
        setTimeout(() => fetchFacilities(retryCount + 1), 1000);
        return;
      }

      setError('Unable to reach the campus services right now. Please try again.');
      console.error('Error fetching facilities:', err);
    }
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'from-green-500 to-green-600';
      case 'OUT_OF_SERVICE':
        return 'from-red-500 to-red-600';
      case 'MAINTENANCE':
        return 'from-yellow-500 to-yellow-600';
      case 'RESERVED':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500/10 border-green-500/30';
      case 'OUT_OF_SERVICE':
        return 'bg-red-500/10 border-red-500/30';
      case 'MAINTENANCE':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'RESERVED':
        return 'bg-blue-500/10 border-blue-500/30';
      default:
        return 'bg-gray-500/10 border-gray-500/30';
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
      case 'RESERVED':
        return StarIcon;
      default:
        return CheckCircleIcon;
    }
  };

  const getCardGradient = (index) => {
    const gradients = [
      'from-purple-500/20 to-pink-500/20',
      'from-blue-500/20 to-cyan-500/20',
      'from-orange-500/20 to-red-500/20',
      'from-green-500/20 to-teal-500/20',
      'from-indigo-500/20 to-purple-500/20',
      'from-yellow-500/20 to-orange-500/20'
    ];
    return gradients[index % gradients.length];
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      minCapacity: '',
      maxCapacity: '',
      location: ''
    });
    setSearchTerm('');
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchTerm !== '';

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-red-900 flex items-center justify-center">
        <div className="bg-red-950/90 border border-red-500/30 rounded-2xl p-8 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-8 w-8 text-red-400 animate-pulse" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-red-300">Connection Error</h3>
              <div className="mt-2 text-red-400">{error}</div>
              <button
                onClick={fetchFacilities}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
              >
                Retry
              </button>
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
              Facilities Catalogue
            </span>
          </h1>
          <p className="text-xl text-gray-300 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            Discover amazing campus facilities
          </p>
        </div>
        
        {/* Add Facility Button - Better Location */}
        <div className="flex justify-center mb-8">
          <Link
            to="/facilities/add"
            className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 rounded-2xl font-bold text-white shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 border-2 border-orange-400/50 hover:border-orange-400"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/20 to-orange-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10 flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg animate-pulse">
                <PlusCircleIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-lg">Add New Facility</span>
              <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      
        {/* Search and Filters */}
        <div className="bg-gradient-to-br from-black via-orange-900/50 to-black backdrop-blur-md rounded-2xl shadow-2xl border border-orange-700/50 p-6 mb-8 animate-slide-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-orange-400 group-hover:text-orange-300 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-3 border border-orange-700/50 rounded-xl bg-black/50 text-white placeholder-orange-300/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-300"
                  placeholder="Search amazing facilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex gap-3">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="group relative px-6 py-3 border border-orange-700/50 text-sm font-medium rounded-xl text-orange-300 bg-black/50 hover:bg-orange-900/50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
                <div className="relative flex items-center">
                  <FunnelIcon className="h-4 w-4 mr-2" />
                  <span>Filters</span>
                </div>
              </button>
              
              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="group relative px-6 py-3 border border-orange-700/50 text-sm font-medium rounded-xl text-orange-300 bg-black/50 hover:bg-orange-900/50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    <span>Clear Filters</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="w-full px-3 py-2 border border-blue-500/30 rounded-lg bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300"
                >
                  <option value="">All Types</option>
                  {facilityTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 border border-blue-500/30 rounded-lg bg-gray-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300"
                >
                  <option value="">All Statuses</option>
                  {facilityStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Min Capacity</label>
                <input
                  type="number"
                  value={filters.minCapacity}
                  onChange={(e) => setFilters({...filters, minCapacity: e.target.value})}
                  className="w-full px-3 py-2 border border-blue-500/30 rounded-lg bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300"
                  placeholder="Min capacity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Capacity</label>
                <input
                  type="number"
                  value={filters.maxCapacity}
                  onChange={(e) => setFilters({...filters, maxCapacity: e.target.value})}
                  className="w-full px-3 py-2 border border-blue-500/30 rounded-lg bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300"
                  placeholder="Max capacity"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="w-full px-3 py-2 border border-blue-500/30 rounded-lg bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300"
                  placeholder="Search by location"
                />
              </div>
            </div>
          )}
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {facilities.map((facility, index) => {
            // Define gradient colors array
            const gradients = [
              'from-black via-green-500/50 to-black',      // Green 50%
              'from-black via-purple-500/50 to-black',    // Purple 50%  
              'from-black via-orange-500/50 to-black',     // Orange 50%
              'from-black via-red-500/50 to-black',           // Red 50%
              'from-black via-yellow-500/50 to-black',      // Yellow 50%
              'from-black via-pink-500/50 to-black'           // Pink 50%
            ];
            const gradient = gradients[index % gradients.length];
            
            return (
              <Link
                key={facility.id}
                to={`/facilities/${facility.id}`}
                className={`group relative overflow-hidden bg-gradient-to-br ${gradient} backdrop-blur-md border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 animate-bounce-in hover:border-white/40`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  minHeight: '480px'
                }}
              >
              <div className="relative z-10 p-6 h-full flex flex-col">
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusBgColor(facility.status)}`}>
                    {(() => {
                      const StatusIcon = getStatusIcon(facility.status);
                      return <StatusIcon className="h-3 w-3" />;
                    })()}
                    <span className="text-white font-semibold">{facility.status}</span>
                  </div>
                </div>

                {/* Facility Image */}
                <div className="relative mb-4 overflow-hidden rounded-xl h-48">
                  <img
                    src={facility.images && facility.images.length > 0 ? facility.images[0] : 'https://via.placeholder.com/400x300/ea580c/ffffff?text=No+Image'}
                    alt={facility.name}
                    className="w-full h-full object-cover rounded-xl transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300/ea580c/ffffff?text=Image+Error';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                </div>

                {/* Facility Content */}
                <div className="space-y-3 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg group-hover:text-yellow-300 transition-colors line-clamp-1">
                    {facility.name}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-white font-medium">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4 text-yellow-400 drop-shadow" />
                      <span className="line-clamp-1 drop-shadow">{facility.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserGroupIcon className="h-4 w-4 text-cyan-400 drop-shadow" />
                      <span className="drop-shadow">{facility.capacity} people</span>
                    </div>
                  </div>

                  <p className="text-white/90 line-clamp-2 text-sm leading-relaxed flex-1 drop-shadow">
                    {facility.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/30 mt-auto">
                    <div className="flex items-center gap-2">
                      <StarIcon className="h-4 w-4 text-yellow-400 drop-shadow" />
                      <span className="text-sm text-white font-medium drop-shadow">{facility.bookingCount} bookings</span>
                    </div>
                    <div className="flex items-center gap-1 text-white group-hover:text-yellow-300 transition-colors">
                      <span className="text-sm font-bold drop-shadow">View Details</span>
                      <ArrowRightIcon className="h-5 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FacilitiesCatalogue;
