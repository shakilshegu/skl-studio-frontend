"use client";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LogOut, User, ChevronDown, Menu, Bell, Search, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { clearUser } from "@/stores/authSlice";

const PartnerNavbar = ({ onMenuClick, showMenuButton = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get partner data from Redux store
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Extract freelancer/partner details with fallbacks
  const businessName = user?.businessProfile?.vendorName || "";
  const userEmail = user?.email || "";
  const userMobile = user?.mobile || "";
  const profileImage = user?.profileImage || null;
  const userRole = user?.roles?.[user?.roles?.length - 1] || "user"; // Get the last role (highest privilege)
  const freelancerCategory = user?.businessProfile?.freelancerCategory || "";
  const vendorType = user?.businessProfile?.vendorType || "";
  const city = user?.businessProfile?.city || "";
  const state = user?.businessProfile?.state || "";
  const teamSize = user?.businessProfile?.teamSize || "";
  
  // Create display name
  const displayName = businessName || "Freelancer";
  const roleDisplay = vendorType === 'freelancer' 
    ? `${freelancerCategory?.charAt(0)?.toUpperCase() + freelancerCategory?.slice(1) || 'Freelancer'}`
    : userRole?.charAt(0)?.toUpperCase() + userRole?.slice(1) || 'Account';
  
  const locationDisplay = city && state ? `${city}, ${state}` : city || state || "";
  
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const handleLogout = async () => {
    setLoading(true);
    try {
      dispatch(clearUser());
      
      // Clear cookies
      Cookies.remove("Token");
      Cookies.remove("UserId");
      Cookies.remove("Role");
      
      // Clear localStorage
      localStorage.clear();
      
      // Navigate
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) {
      if (freelancerCategory) {
        return freelancerCategory.charAt(0).toUpperCase() + (vendorType?.charAt(0)?.toUpperCase() || 'F');
      }
      return "FA"; // Freelancer Account
    }
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* Logo */}
            <div 
              className="text-2xl font-bold text-[#892580] cursor-pointer hover:text-[#a12d8a] transition-colors" 
              onClick={() => router.push("/partner/dashboard")}
            >
              SKL
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search - Hidden on mobile */}
            <div className="hidden md:flex">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bookings, clients..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#892580] focus:border-transparent w-64"
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {/* Dynamic notification badge - you can connect this to actual notifications */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50 max-h-96 overflow-y-auto scrollbar-hide">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="p-4">
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No new notifications</p>
                      <p className="text-xs text-gray-400 mt-1">We'll notify you when something important happens</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                className="flex items-center space-x-2 sm:space-x-3 p-1 rounded-lg hover:bg-gray-100 transition-colors" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {/* Dynamic User avatar */}
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#892580] flex items-center justify-center text-white text-sm font-medium">
                    {getInitials(displayName)}
                  </div>
                )}
                
                {/* Name and chevron - Hidden on small screens */}
                <div className="hidden sm:flex items-center space-x-2">
                  <span className="font-medium text-gray-700 text-sm truncate max-w-32">
                    {displayName}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Dropdown menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg border border-gray-200 z-50 overflow-hidden">
                  {/* User info */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#892580] flex items-center justify-center text-white font-semibold">
                          {getInitials(displayName)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{displayName}</p>
                        <p className="text-sm text-gray-600 truncate">{roleDisplay}</p>
                        {userEmail && (
                          <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                        )}
                        {locationDisplay && (
                          <p className="text-xs text-gray-400 truncate">{locationDisplay}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    <button 
                      onClick={() => {
                        router.push("/partner/profile");
                        setShowDropdown(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-[#892580]" /> 
                      <span className="text-sm text-gray-700">View Profile</span>
                    </button>

                    <button 
                      onClick={() => {
                        router.push("/partner/settings");
                        setShowDropdown(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-[#892580]" /> 
                      <span className="text-sm text-gray-700">Account Settings</span>
                    </button>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button 
                      onClick={handleLogout}
                      disabled={loading}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors disabled:opacity-50 text-red-600"
                    >
                      <LogOut className="w-4 h-4" /> 
                      <span className="text-sm">
                        {loading ? "Logging out..." : "Log out"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PartnerNavbar;