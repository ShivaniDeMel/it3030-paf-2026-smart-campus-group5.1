import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { facilityAPI } from '../services/api';
import { 
  BuildingOfficeIcon, 
  ChartBarIcon, 
  PlusCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Temporarily disabled - uncomment when backend is running
      // const response = await Promise.race([
      //   facilityAPI.getFacilityStatistics(),
      //   timeoutPromise
      // ]);
      
      // Mock data for development
      const mockData = {
        total: 25,
        status_active: 18,
        status_maintenance: 4,
        status_out_of_service: 3,
        utilization_rate: 72,
        booking_trends: {
          daily: [12, 15, 18, 14, 20],
          weekly: [85, 92, 78, 95, 88]
        }
      };
      
      setStatistics(mockData);
    } catch (err) {
      setError('Failed to load statistics. Please try again.');
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Facilities',
      value: statistics.total || 0,
      icon: BuildingOfficeIcon,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-gradient-orange',
      link: '/facilities'
    },
    {
      title: 'Active Facilities',
      value: statistics.status_active || 0,
      icon: CheckCircleIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
      link: '/facilities?status=ACTIVE'
    },
    {
      title: 'Under Maintenance',
      value: statistics.status_maintenance || 0,
      icon: WrenchScrewdriverIcon,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      link: '/facilities?status=MAINTENANCE'
    },
    {
      title: 'Out of Service',
      value: statistics.status_out_of_service || 0,
      icon: XCircleIcon,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
      link: '/facilities?status=OUT_OF_SERVICE'
    }
  ];

  const facilityTypes = [
    { type: 'lecture_hall', count: statistics.type_lecture_hall || 0, color: 'from-purple-500 to-purple-600' },
    { type: 'laboratory', count: statistics.type_laboratory || 0, color: 'from-indigo-500 to-indigo-600' },
    { type: 'meeting_room', count: statistics.type_meeting_room || 0, color: 'from-pink-500 to-pink-600' },
    { type: 'auditorium', count: statistics.type_auditorium || 0, color: 'from-teal-500 to-teal-600' },
    { type: 'sports_facility', count: statistics.type_sports_facility || 0, color: 'from-orange-500 to-orange-600' },
    { type: 'study_area', count: statistics.type_study_area || 0, color: 'from-cyan-500 to-cyan-600' },
    { type: 'equipment', count: statistics.type_equipment || 0, color: 'from-lime-500 to-lime-600' }
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4 animate-fade-in">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 bg-gradient-to-r from-blue-500 to-blue-600 opacity-20 animate-pulse"></div>
        </div>
        <p className="text-secondary-600 dark:text-secondary-400 font-medium animate-float">Loading dashboard statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-blue-50 dark:from-red-900/20 dark:to-blue-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 animate-slide-in">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-6 w-6 text-red-500 animate-pulse" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">Connection Error</h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</div>
            <div className="mt-4">
              <button
                onClick={fetchStatistics}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-700/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '6s' }}></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8 animate-slide-in">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg animate-pulse-glow">
                <FireIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">
                  Smart Campus Dashboard
                </h1>
                <p className="mt-2 text-secondary-600 dark:text-secondary-400">
                  Overview of campus facilities and their status
                </p>
              </div>
              <button
                onClick={fetchStatistics}
                className="button-primary flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <ClockIcon className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={index}
                  to={stat.link}
                  className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-bounce-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-90`}></div>
                  <div className="relative p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-3xl font-bold animate-pulse">
                        {stat.value}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold">{stat.title}</h3>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              );
            })}
          </div>

          {/* Facility Types */}
          <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl p-6 mb-8 animate-slide-in">
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6 flex items-center gap-2">
              <SparklesIcon className="h-6 w-6 text-blue-500" />
              Facility Types Distribution
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {facilityTypes.map((facilityType, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-secondary-50 dark:bg-secondary-700 hover:bg-secondary-100 dark:hover:bg-secondary-600 transition-colors duration-300">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${facilityType.color}`}></div>
                  <span className="text-sm text-secondary-600 dark:text-secondary-400 capitalize">
                    {facilityType.type.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-bold text-secondary-900 dark:text-white">
                    {facilityType.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-secondary-800 dark:to-secondary-700 rounded-2xl shadow-xl p-6 animate-slide-in">
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6 flex items-center gap-2">
              <FireIcon className="h-6 w-6 text-blue-500" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/facilities"
                className="button-primary flex items-center justify-center gap-2"
              >
                <BuildingOfficeIcon className="h-5 w-5" />
                View All Facilities
              </Link>
              <Link
                to="/facilities/add"
                className="button-secondary flex items-center justify-center gap-2"
              >
                <PlusCircleIcon className="h-5 w-5" />
                Add New Facility
              </Link>
              <button
                onClick={fetchStatistics}
                className="button-secondary flex items-center justify-center gap-2"
              >
                <ClockIcon className="h-5 w-5" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
