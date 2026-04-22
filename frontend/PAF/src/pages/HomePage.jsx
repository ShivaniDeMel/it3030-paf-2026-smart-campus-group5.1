import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FireIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  BoltIcon,
  UsersIcon,
  BookOpenIcon,
  PencilIcon,
  DocumentTextIcon,
  CalculatorIcon,
  LightBulbIcon,
  GlobeAltIcon,
  TrophyIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const [activeUsers, setActiveUsers] = useState(1); // Start with 1 (current user)
  const [sessionStartTime] = useState(new Date());

  // Simulate real-time user tracking
  useEffect(() => {
    // Track current session
    const currentUser = sessionStorage.getItem('currentUser') || 'user_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('currentUser', currentUser);
    
    // Simulate other users coming and going
    const interval = setInterval(() => {
      const minUsers = 1;
      const maxUsers = 8;
      const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
      setActiveUsers(prev => {
        const newCount = prev + change;
        return Math.max(minUsers, Math.min(maxUsers, newCount));
      });
    }, 5000 + Math.random() * 5000); // Random interval between 5-10 seconds

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: BuildingOfficeIcon,
      title: 'Facility Management',
      description: 'Comprehensive management of campus facilities with real-time tracking and scheduling.',
      color: 'from-orange-500 to-gray-900',
      iconColor: 'from-blue-400 to-blue-600'
    },
    {
      icon: AcademicCapIcon,
      title: 'Smart Booking',
      description: 'Intelligent booking system for classrooms, labs, and other campus resources.',
      color: 'from-orange-500 to-gray-800',
      iconColor: 'from-green-400 to-green-600'
    },
    {
      icon: UserGroupIcon,
      title: 'User Management',
      description: 'Efficient management of students, staff, and faculty with role-based access.',
      color: 'from-orange-600 to-black',
      iconColor: 'from-purple-400 to-purple-600'
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics Dashboard',
      description: 'Real-time analytics and insights for data-driven decision making.',
      color: 'from-orange-500 to-gray-900',
      iconColor: 'from-red-400 to-red-600'
    },
    {
      icon: ClockIcon,
      title: '24/7 Support',
      description: 'Round-the-clock technical support and maintenance services.',
      color: 'from-orange-600 to-gray-800',
      iconColor: 'from-yellow-400 to-yellow-600'
    },
    {
      icon: Cog6ToothIcon,
      title: 'Automation Tools',
      description: 'Automated workflows and smart notifications for seamless operations.',
      color: 'from-orange-500 to-black',
      iconColor: 'from-pink-400 to-pink-600'
    }
  ];

  const stats = [
    { number: '50+', label: 'Facilities Managed' },
    { number: `${activeUsers}`, label: 'Current Users Online', icon: UsersIcon, realTime: true },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support Available' }
  ];

  const testimonials = [
    {
      name: 'Prof. Chandana Perera',
      role: 'Dean of Computing',
      content: 'The Smart Campus Operations Hub has significantly improved our facility utilization and scheduling efficiency. It\'s become an essential tool for our daily operations.',
      rating: 5
    },
    {
      name: 'Ms. Nimali Fernando',
      role: 'Head of Administration',
      content: 'Managing campus facilities has never been easier. The system provides real-time insights and automation that save us countless hours each week.',
      rating: 5
    },
    {
      name: 'Ruhan Perera',
      role: 'Student Union President',
      content: 'Students love the ease of booking facilities and checking availability. The mobile-friendly interface makes it accessible to everyone on campus.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-secondary-900 dark:to-secondary-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background - Orange & Black */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-black to-orange-800 animate-gradient"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full blur-3xl animate-float opacity-40"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-black to-orange-800 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Enhanced Glitter Icons - Educational & Smart Campus Theme */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Educational Icons - Books & Learning */}
          <div className="absolute top-0 left-5 animate-pulse" style={{ animationDelay: '0s', animationDuration: '8s' }}>
            <BookOpenIcon className="h-4 w-4 text-amber-600/70 animate-spin" />
          </div>
          <div className="absolute top-0 left-15 animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '10s' }}>
            <AcademicCapIcon className="h-3 w-3 text-blue-600/60 animate-pulse" />
          </div>
          <div className="absolute top-0 left-25 animate-pulse" style={{ animationDelay: '1s', animationDuration: '7s' }}>
            <AcademicCapIcon className="h-5 w-5 text-purple-600/50 animate-spin" />
          </div>
          <div className="absolute top-0 left-35 animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '9s' }}>
            <PencilIcon className="h-3 w-3 text-gray-600/60 animate-pulse" />
          </div>
          <div className="absolute top-0 right-35 animate-pulse" style={{ animationDelay: '2s', animationDuration: '11s' }}>
            <DocumentTextIcon className="h-4 w-4 text-indigo-600/70 animate-spin" />
          </div>
          
          {/* Smart Campus Icons - Technology & Innovation */}
          <div className="absolute top-0 right-25 animate-pulse" style={{ animationDelay: '2.5s', animationDuration: '8s' }}>
            <LightBulbIcon className="h-3 w-3 text-yellow-500/60 animate-pulse" />
          </div>
          <div className="absolute top-0 right-15 animate-pulse" style={{ animationDelay: '3s', animationDuration: '10s' }}>
            <Cog6ToothIcon className="h-4 w-4 text-cyan-600/50 animate-pulse" />
          </div>
          <div className="absolute top-0 right-5 animate-pulse" style={{ animationDelay: '3.5s', animationDuration: '12s' }}>
            <CalculatorIcon className="h-3 w-3 text-green-600/70 animate-pulse" />
          </div>
          
          {/* Achievement & Success Icons */}
          <div className="absolute bottom-0 left-10 animate-pulse" style={{ animationDelay: '4s', animationDuration: '9s' }}>
            <TrophyIcon className="h-3 w-3 text-yellow-500/60 animate-bounce" />
          </div>
          <div className="absolute bottom-0 left-30 animate-pulse" style={{ animationDelay: '5s', animationDuration: '7s' }}>
            <CalculatorIcon className="h-4 w-4 text-blue-600/50 animate-pulse" />
          </div>
          <div className="absolute bottom-0 right-30 animate-pulse" style={{ animationDelay: '6s', animationDuration: '11s' }}>
            <StarIcon className="h-3 w-3 text-amber-600/60 animate-spin" />
          </div>
          <div className="absolute bottom-0 right-10 animate-pulse" style={{ animationDelay: '7s', animationDuration: '8s' }}>
            <GlobeAltIcon className="h-2 w-2 text-green-600/70 animate-spin" />
          </div>
          
          {/* Dynamic Learning Elements */}
          <div className="absolute top-1/4 left-0 animate-pulse" style={{ animationDelay: '3s', animationDuration: '10s' }}>
            <BookOpenIcon className="h-4 w-4 text-amber-700/50 animate-pulse" />
          </div>
          <div className="absolute top-1/3 left-0 animate-pulse" style={{ animationDelay: '5.5s', animationDuration: '8s' }}>
            <PencilIcon className="h-3 w-3 text-gray-700/60 animate-pulse" />
          </div>
          <div className="absolute top-1/2 right-0 animate-pulse" style={{ animationDelay: '8s', animationDuration: '12s' }}>
            <AcademicCapIcon className="h-3 w-3 text-purple-700/50 animate-pulse" />
          </div>
          
          {/* Innovation Elements */}
          <div className="absolute top-0 left-1/4 animate-pulse" style={{ animationDelay: '4.5s', animationDuration: '10s' }}>
            <LightBulbIcon className="h-3 w-3 text-yellow-600/60 animate-pulse" />
          </div>
          <div className="absolute top-0 right-1/4 animate-pulse" style={{ animationDelay: '6.5s', animationDuration: '9s' }}>
            <Cog6ToothIcon className="h-4 w-4 text-cyan-700/50 animate-pulse" />
          </div>
          
          {/* Circular Learning Motion */}
          <div className="absolute top-1/4 left-1/4 animate-pulse" style={{ animationDelay: '7s', animationDuration: '15s' }}>
            <AcademicCapIcon className="h-2 w-2 text-purple-700/60 animate-pulse" />
          </div>
          <div className="absolute top-1/3 right-1/3 animate-pulse" style={{ animationDelay: '9s', animationDuration: '12s' }}>
            <TrophyIcon className="h-2 w-2 text-yellow-700/60 animate-spin" />
          </div>
          
          {/* Floating Educational Particles */}
          <div className="absolute top-15 left-1/4 w-2 h-2 bg-amber-600/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-25 right-1/3 w-3 h-3 bg-blue-600/40 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-35 left-1/3 w-1 h-1 bg-purple-600/60 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>
          <div className="absolute top-45 right-1/4 w-2 h-2 bg-indigo-600/50 rounded-full animate-pulse" style={{ animationDelay: '8s' }}></div>
          <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-green-600/40 rounded-full animate-pulse" style={{ animationDelay: '10s' }}></div>
          <div className="absolute bottom-35 left-1/4 w-2 h-2 bg-yellow-600/50 rounded-full animate-pulse" style={{ animationDelay: '12s' }}></div>
          <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-red-600/60 rounded-full animate-pulse" style={{ animationDelay: '14s' }}></div>
          
          {/* Zoom Educational Elements */}
          <div className="absolute top-1/2 left-1/2 animate-pulse" style={{ animationDelay: '11s', animationDuration: '6s' }}>
            <BookOpenIcon className="h-3 w-3 text-amber-800/80 animate-pulse" />
          </div>
          <div className="absolute top-2/3 right-1/2 animate-pulse" style={{ animationDelay: '13s', animationDuration: '8s' }}>
            <AcademicCapIcon className="h-2 w-2 text-purple-800/80 animate-pulse" />
          </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-pulse">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <FireIcon className="h-12 w-12 text-white animate-pulse" />
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-red-400 bg-clip-text text-transparent animate-gradient-shift animate-pulse relative">
                <span className="absolute inset-0 animate-glitter"></span>
                Smart Campus
              </span>
              <span className="block text-5xl md:text-6xl mt-2 bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 bg-clip-text text-transparent animate-gradient-shift-reverse animate-bounce relative">
                <span className="absolute inset-0 animate-glitter"></span>
                Operations Hub
              </span>
            </h1>
            
            <div className="mb-12 max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed animate-slide-up">
                <span className="inline-block animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  Transforming
                </span>
                <span className="inline-block font-bold text-cyan-400 mx-2 animate-pulse" style={{ animationDelay: '0.4s' }}>
                  campus management
                </span>
                <span className="inline-block animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  with
                </span>
                <span className="inline-block font-bold text-blue-400 mx-2 animate-pulse" style={{ animationDelay: '0.8s' }}>
                  cutting-edge technology
                </span>
                <span className="inline-block animate-fade-in" style={{ animationDelay: '1s' }}>
                  .
                </span>
                <span className="inline-block animate-fade-in" style={{ animationDelay: '1.2s' }}>
                  Experience
                </span>
                <span className="inline-block font-bold text-cyan-300 mx-2 animate-pulse" style={{ animationDelay: '1.4s' }}>
                  seamless facility booking
                </span>
                <span className="inline-block animate-fade-in" style={{ animationDelay: '1.6s' }}>
                  ,
                </span>
                <span className="inline-block font-bold text-blue-300 mx-2 animate-pulse" style={{ animationDelay: '1.8s' }}>
                  real-time analytics
                </span>
                <span className="inline-block animate-fade-in" style={{ animationDelay: '2s' }}>
                  , and
                </span>
                <span className="inline-block font-bold text-cyan-200 mx-2 animate-pulse" style={{ animationDelay: '2.2s' }}>
                  intelligent automation
                </span>
                <span className="inline-block animate-fade-in" style={{ animationDelay: '2.4s' }}>
                  .
                </span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in" style={{ animationDelay: '1s' }}>
              <Link
                to="/dashboard"
                className="button-primary text-lg px-8 py-4 shadow-2xl hover:shadow-3xl transform hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  <BoltIcon className="h-5 w-5" />
                  Get Started
                  <ArrowRightIcon className="h-5 w-5" />
                </span>
              </Link>
              
              <Link
                to="/facilities"
                className="button-secondary text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  <BuildingOfficeIcon className="h-5 w-5" />
                  View Facilities
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 bg-gradient-to-br from-orange-900 via-black to-orange-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 animate-slide-in">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Campus Analytics
              </span>
            </h2>
            <p className="text-gray-300 text-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Real-time insights into facility utilization and performance metrics
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: UsersIcon,
                number: activeUsers,
                label: 'Active Users',
                color: 'from-green-400 to-emerald-500',
                realTime: true
              },
              {
                icon: BuildingOfficeIcon,
                number: '50+',
                label: 'Facilities Managed',
                color: 'from-blue-400 to-cyan-500',
                realTime: false
              },
              {
                icon: ChartBarIcon,
                number: '99.9%',
                label: 'System Uptime',
                color: 'from-purple-400 to-pink-500',
                realTime: false
              },
              {
                icon: ClockIcon,
                number: '24/7',
                label: 'Support Available',
                color: 'from-orange-400 to-red-500',
                realTime: true
              }
            ].map((stat, index) => (
              <div key={index} className="group relative overflow-hidden bg-gradient-to-br from-orange-900 via-black to-orange-800 backdrop-blur-md border border-orange-500/30 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 animate-bounce-in" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-90`}></div>
                <div className="relative p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 bg-white/20 backdrop-blur-sm rounded-xl`}>
                        <stat.icon className="h-8 w-8 text-white mb-2" />
                        <div className="text-3xl font-bold">{stat.number}</div>
                        {stat.realTime && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-green-400 font-medium">Live</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-300 uppercase tracking-wide mb-1">{stat.label}</div>
                      {stat.realTime && (
                        <div className="text-xs text-green-400 font-medium animate-pulse">● LIVE</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Icon Background Effect */}
                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-orange-900 via-black to-orange-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-in">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage campus operations efficiently and effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BuildingOfficeIcon,
                title: 'Facility Management',
                description: 'Comprehensive management of campus facilities with real-time tracking and scheduling.',
                color: 'from-orange-600 to-red-600'
              },
              {
                icon: ClockIcon,
                title: 'Smart Booking',
                description: 'Intelligent booking system for classrooms, labs, and other campus resources.',
                color: 'from-red-600 to-orange-600'
              },
              {
                icon: UserGroupIcon,
                title: 'User Management',
                description: 'Efficient management of students, staff, and faculty with role-based access control.',
                color: 'from-orange-600 to-yellow-600'
              },
              {
                icon: ChartBarIcon,
                title: 'Analytics Dashboard',
                description: 'Real-time analytics and insights for data-driven decision making.',
                color: 'from-yellow-600 to-orange-600'
              },
              {
                icon: Cog6ToothIcon,
                title: 'Automation Tools',
                description: 'Automated workflows and smart notifications for seamless operations.',
                color: 'from-orange-600 to-red-600'
              },
              {
                icon: ShieldCheckIcon,
                title: '24/7 Support',
                description: 'Round-the-clock technical support and maintenance services.',
                color: 'from-red-600 to-pink-600'
              }
            ].map((feature, index) => (
              <Link
                key={index}
                to={feature.title === 'Facility Management' ? '/facilities' : '#'}
                className="block"
              >
                <div
                  className="group relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-orange-500/30 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 animate-bounce-in h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-90`}></div>
                  <div className="relative p-8 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                          <feature.icon className="h-6 w-6 text-white mb-2" />
                          <div className="text-lg font-semibold">{feature.title}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-300 uppercase tracking-wide mb-1">{feature.title}</div>
                      </div>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-orange-900 via-black to-orange-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Why Choose Smart Campus Hub?
              </span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Discover the advantages that transform campus management
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              {[
                {
                  icon: CheckCircleIcon,
                  title: 'Streamlined facility management',
                  description: 'Intelligent automation for seamless operations',
                  color: 'from-green-400 to-emerald-500'
                },
                {
                  icon: ChartBarIcon,
                  title: 'Real-time analytics',
                  description: 'Data-driven insights for better decisions',
                  color: 'from-blue-400 to-cyan-500'
                },
                {
                  icon: UsersIcon,
                  title: 'Mobile-friendly interface',
                  description: 'Access campus services on any device',
                  color: 'from-purple-400 to-pink-500'
                },
                {
                  icon: ShieldCheckIcon,
                  title: 'Robust security',
                  description: 'Role-based access control and protection',
                  color: 'from-orange-400 to-red-500'
                },
                {
                  icon: ClockIcon,
                  title: '24/7 technical support',
                  description: 'Round-the-clock assistance and maintenance',
                  color: 'from-yellow-400 to-orange-500'
                },
                {
                  icon: Cog6ToothIcon,
                  title: 'Seamless integration',
                  description: 'Connects with existing campus systems',
                  color: 'from-indigo-400 to-purple-500'
                }
              ].map((benefit, index) => (
                <div key={index} className="group relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-orange-500/30 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 animate-bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${benefit.color} opacity-90`}></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        <benefit.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
            
            {/* Enterprise Grade Card - Enhanced */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-8 rounded-2xl shadow-2xl animate-bounce-in" style={{ animationDelay: '0.8s' }}>
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                  <div className="relative z-10 text-center">
                    <div className="mb-4">
                      <div className="inline-flex items-center gap-2 p-2 bg-white/20 backdrop-blur-sm rounded-full">
                        <StarIcon className="h-6 w-6 text-yellow-400 animate-pulse" />
                        <StarIcon className="h-6 w-6 text-yellow-400 animate-pulse" />
                        <StarIcon className="h-6 w-6 text-yellow-400 animate-pulse" />
                        <StarIcon className="h-6 w-6 text-yellow-400 animate-pulse" />
                        <StarIcon className="h-6 w-6 text-yellow-400 animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Enterprise Grade</h3>
                    <p className="text-orange-100 text-lg leading-relaxed mb-4">
                      Built for scale, security, and reliability
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-green-400 text-sm font-medium">Advanced Security</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <span className="text-blue-400 text-sm font-medium">99.9% Uptime</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-purple-400 text-sm font-medium">24/7 Support</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-orange-900 via-black to-orange-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-in">
            <h2 className="text-4xl font-bold text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-300">
              Trusted by leading educational institutions worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-orange-500/30 rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 animate-bounce-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative z-10">
                  <div className="flex mb-4">
                    <div className="flex-shrink-0">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="text-white text-lg leading-relaxed">
                      <p className="mb-2 italic">"{testimonial.content}"</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">{testimonial.name}</p>
                          <p className="text-orange-200 text-sm">{testimonial.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-orange-300 font-medium animate-pulse">● LIVE</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-in">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Campus?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join thousands of educational institutions already using Smart Campus Operations Hub.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/features"
                className="group relative overflow-hidden bg-white text-black px-12 py-6 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 border-2 border-orange-500/50 hover:border-orange-500"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center gap-3">
                  <div className="p-2 bg-orange-500 rounded-lg animate-pulse">
                    <SparklesIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg">View Features</span>
                  <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
