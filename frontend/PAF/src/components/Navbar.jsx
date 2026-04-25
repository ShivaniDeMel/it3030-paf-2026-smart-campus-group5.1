import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  BuildingOfficeIcon,
  ChartBarIcon,
  FireIcon,
  SparklesIcon,
  ChevronDownIcon,
  QrCodeIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const role = (user?.role || "USER").toString().toUpperCase();
  const isAdmin = role === "ADMIN";

  const navigation = [
    { name: "Home", href: "/", icon: SparklesIcon },
    { name: "Dashboard", href: "/dashboard", icon: ChartBarIcon },
    { name: "Facilities", href: "/facilities", icon: BuildingOfficeIcon },
    { name: "Ticketing", href: "/tickets", icon: WrenchScrewdriverIcon },
    ...(isAdmin ? [{ name: "Booking Workflow", href: "/booking-workflow", icon: QrCodeIcon }] : []),
    { name: "My Bookings", href: "/my-bookings", icon: ClipboardDocumentListIcon },
    ...(isAdmin
      ? [
          {
            name: "Role Management",
            href: "/role-management",
            icon: ShieldCheckIcon,
          },
        ]
      : []),
    { name: "Notifications", href: "/notifications", icon: BellIcon, iconOnly: true },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="relative z-[1000] overflow-visible border-b border-orange-700/40 shadow-[0_8px_30px_-12px_rgba(249,115,22,0.35)]">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-orange-900 to-black animate-gradient" />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

      <div className="relative z-10 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                <div className="relative p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <FireIcon className="h-8 w-8 text-white animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white drop-shadow-lg animate-pulse">
                  Smart Campus
                </h1>
                <p className="text-xs text-white font-semibold drop-shadow">
                  Operations Hub
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-2">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group relative rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      item.iconOnly ? "p-3" : "px-6 py-3"
                    } ${
                      isActive(item.href)
                        ? "bg-white/20 text-white shadow-lg"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    aria-label={item.name}
                    title={item.name}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5" />
                      {!item.iconOnly && <span>{item.name}</span>}
                    </div>

                    {isActive(item.href) && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white to-orange-200 animate-pulse" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center space-x-4">
              {!loading && isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="relative overflow-visible">
                    <button
                      type="button"
                      onClick={() =>
                        setShowProfileDropdown(!showProfileDropdown)
                      }
                      className="flex items-center space-x-3 hover:bg-white/10 rounded-xl p-2 transition-all duration-300"
                    >
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-white/80 capitalize">
                          {user?.role}
                        </p>
                      </div>
                      <div className="relative group">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {user?.firstName?.charAt(0)}
                          {user?.lastName?.charAt(0)}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <ChevronDownIcon className="h-4 w-4 text-white/80 transition-transform duration-300" />
                    </button>

                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden z-[1100] border border-orange-700/50 shadow-2xl bg-gradient-to-br from-black via-orange-950 to-black backdrop-blur-md">
                        <div className="p-4 border-b border-orange-700/40">
                          <p className="text-sm font-semibold text-white">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-orange-300 capitalize">
                            {user?.role}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => {
                            setShowProfileDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-orange-100 hover:bg-orange-500/20 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                        >
                          <UserCircleIcon className="h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setShowProfileDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-orange-100 hover:bg-orange-500/20 hover:text-white transition-colors duration-200 flex items-center space-x-2"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="hidden sm:block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Sign In
                  </Link>
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

        <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />
      </div>
    </nav>
  );
};

export default Navbar;
