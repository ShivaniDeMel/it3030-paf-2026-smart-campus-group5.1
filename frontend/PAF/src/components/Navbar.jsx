import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
<<<<<<< HEAD
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
=======
  FireIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
>>>>>>> a5f16d40fa5997530e216669b1a1e63259a4d39a
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
<<<<<<< HEAD
  
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
=======
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const navigation = [
    { name: 'My Bookings', href: '/bookings', icon: CalendarDaysIcon },
    { name: 'Admin Panel', href: '/admin/bookings', icon: ShieldCheckIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600"></div>
>>>>>>> a5f16d40fa5997530e216669b1a1e63259a4d39a
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<<<<<<< HEAD
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
=======
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl shadow-lg">
                <FireIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Smart Campus</h1>
                <p className="text-xs text-white/80">Booking System</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => {
>>>>>>> a5f16d40fa5997530e216669b1a1e63259a4d39a
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
<<<<<<< HEAD
                    className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
=======
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
>>>>>>> a5f16d40fa5997530e216669b1a1e63259a4d39a
                      isActive(item.href)
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
<<<<<<< HEAD
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
=======
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
>>>>>>> a5f16d40fa5997530e216669b1a1e63259a4d39a
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {!loading && isAuthenticated ? (
<<<<<<< HEAD
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
=======
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-2 hover:bg-white/10 rounded-xl p-2 transition-all"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <span className="hidden sm:block text-sm text-white font-medium">{user?.firstName}</span>
                    <ChevronDownIcon className="h-4 w-4 text-white/80" />
                  </button>
                  
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                      <div className="p-4 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                      >
                        <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-white/20 text-white hover:bg-white/30 rounded-xl transition-all text-sm"
>>>>>>> a5f16d40fa5997530e216669b1a1e63259a4d39a
                  >
                    Register
                  </Link>
                </div>
              )}
<<<<<<< HEAD
            </div>
          </div>
        </div>
        
        {/* Animated Bottom Border */}
        <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
=======

              {/* Mobile toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-white hover:bg-white/10 rounded-xl"
              >
                {showMobileMenu ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-orange-600/95 backdrop-blur-sm border-t border-white/10">
            <div className="px-4 py-3 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.href) ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom border */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
>>>>>>> a5f16d40fa5997530e216669b1a1e63259a4d39a
      </div>
    </nav>
  );
};

export default Navbar;
