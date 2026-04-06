import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BuildingOfficeIcon, 
  ChartBarIcon, 
  PlusCircleIcon,
  FireIcon,
  SparklesIcon,
  UserCircleIcon,
  ChevronDownIcon,
  QrCodeIcon,
  BellIcon,
  Cog6ToothIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const navigation = [
    { name: 'Home', href: '/', icon: SparklesIcon },
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Facilities', href: '/facilities', icon: BuildingOfficeIcon },
    { name: 'Booking Workflow', href: '/booking-workflow', icon: QrCodeIcon },
    { name: 'Role Management', href: '/role-management', icon: ShieldCheckIcon },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 animate-gradient"></div>
      
      {/* Glass Effect Overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                <div className="relative p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <FireIcon className="h-8 w-8 text-white animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white drop-shadow-lg animate-pulse">
                  Smart Campus
                </h1>
                <p className="text-xs text-white font-semibold drop-shadow">Operations Hub</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-2">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      isActive(item.href)
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                    
                    {/* Animated Underline */}
                    {isActive(item.href) && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white to-orange-200 animate-pulse"></div>
                    )}
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {!loading && isAuthenticated ? (
                // Authenticated user section
                <div className="flex items-center space-x-4">
                  {/* User Info with Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center space-x-3 hover:bg-white/10 rounded-xl p-2 transition-all duration-300"
                    >
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-white/80 capitalize">{user?.role}</p>
                      </div>
                      <div className="relative group">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <ChevronDownIcon className="h-4 w-4 text-white/80 transition-transform duration-300" />
                    </button>
                    
                    {/* Profile Dropdown */}
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-800 rounded-xl shadow-xl border border-gray-200 dark:border-secondary-600 overflow-hidden z-50">
                        <div className="p-4 border-b border-gray-200 dark:border-secondary-600">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setShowProfileDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors duration-200 flex items-center space-x-2"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Non-authenticated user section
                <div className="flex items-center space-x-4">
                  {/* Login Button */}
                  <Link
                    to="/login"
                    className="hidden sm:block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Sign In
                  </Link>
                  
                  {/* Register Button */}
                  <Link
                    to="/register"
                    className="hidden sm:block px-4 py-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-xl transition-all duration-300 transform hover:scale-110"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Animated Bottom Border */}
        <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
      </div>
    </nav>
  );
};

export default Navbar;
