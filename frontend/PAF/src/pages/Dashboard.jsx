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
  const [statistics, setStatistics] = useState({
    total: 0,
    status_active: 0,
    status_maintenance: 0,
    status_out_of_service: 0,
    status_under_review: 0,
    utilization_rate: 0,
    booking_trends: { daily: [], weekly: [] }
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await facilityAPI.getFacilityStatistics();
      setStatistics(prev => ({ ...prev, ...response.data }));
    } catch (err) {
      setError('Failed to load statistics. Please try again.');
    }
  };

  const handleRetry = () => {
    fetchStatistics();
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
    { type: 'lecture_hall', count: statistics.type_lecture_hall || 0, color: 'from-blue-500 to-blue-600' },
    { type: 'laboratory', count: statistics.type_laboratory || 0, color: 'from-green-500 to-green-600' },
    { type: 'meeting_room', count: statistics.type_meeting_room || 0, color: 'from-purple-500 to-purple-600' },
    { type: 'auditorium', count: statistics.type_auditorium || 0, color: 'from-orange-500 to-orange-600' },
    { type: 'sports_facility', count: statistics.type_sports_facility || 0, color: 'from-red-500 to-red-600' },
    { type: 'study_area', count: statistics.type_study_area || 0, color: 'from-yellow-500 to-yellow-600' },
    { type: 'equipment', count: statistics.type_equipment || 0, color: 'from-pink-500 to-pink-600' }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-orange-800 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4">
            <XCircleIcon className="h-12 w-12 text-red-400 mx-auto" />
          </div>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-800 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '6s' }}></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8 animate-fade-in">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg animate-pulse-glow">
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
          <div className="bg-gradient-to-r from-black via-orange-900 to-black rounded-2xl shadow-xl p-6 mb-8 animate-slide-in border border-orange-700">
            <h2 className="text-2xl font-bold text-orange-100 dark:text-orange-100 mb-6 flex items-center gap-2">
              <SparklesIcon className="h-6 w-6 text-orange-400" />
              Facility Types Distribution
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {facilityTypes.map((facilityType, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-black/50 hover:bg-black/70 transition-colors duration-300 border border-orange-800/50">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${facilityType.color}`}></div>
                  <span className="text-sm text-orange-200 capitalize">
                    {facilityType.type.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-bold text-orange-100">
                    {facilityType.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-black via-orange-900 to-black rounded-2xl shadow-xl p-6 animate-slide-in border border-orange-700">
            <h2 className="text-2xl font-bold text-orange-100 dark:text-orange-100 mb-6 flex items-center gap-2">
              <FireIcon className="h-6 w-6 text-orange-400" />
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
                className="button-primary flex items-center justify-center gap-2"
              >
                <PlusCircleIcon className="h-5 w-5" />
                Add New Facility
              </Link>
              <button
                onClick={fetchStatistics}
                className="button-primary flex items-center justify-center gap-2"
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
