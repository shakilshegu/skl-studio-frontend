"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell,
  MapPin,
  LogOut,
  User,
  HelpCircle,
  BookOpen,
  Menu,
  X,
  ChevronDown,
  Search,
  Star,
  Camera,
  Building2,
  UserPlus,
  Navigation,
  Sparkles,
  Home
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/stores/authSlice";
import { setLocation, detectCurrentLocation } from "@/stores/locationSlice";
import { useLocation } from "@/hooks/useLocation";
import ProfileModal from "@/components/Auth/ProfileModal";
import Link from "next/link";
import { persistor } from "@/stores/store";

const cat8 = "/Assets/cat8.svg";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  
  // Use location hook
  const { currentLocation, updateLocation, detectCurrentLocation: detectLocation } = useLocation();

  // Get auth state from Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Navigation items configuration
  const navigationItems = [
    { 
      name: "Home", 
      path: "/", 
      exact: true,
      icon: <Home className="w-4 h-4" />
    },
    { 
      name: "Photographers", 
      path: "/user/photographers",
      icon: <Camera className="w-4 h-4" />
    },
    { 
      name: "Studios", 
      path: "/user/studios",
      icon: <Building2 className="w-4 h-4" />
    },
    { 
      name: "Become Partner", 
      path: "/user/become-partner",
      icon: <UserPlus className="w-4 h-4" />,
      // highlight: true
    }
  ];

  // Popular cities for location selection
  const popularCities = [
    { name: "Hyderabad", coordinates: { lat: 17.3850, lng: 78.4867 } },
    { name: "Bangalore", coordinates: { lat: 12.9716, lng: 77.5946 } },
    { name: "Chennai", coordinates: { lat: 13.0827, lng: 80.2707 } },
    { name: "Mumbai", coordinates: { lat: 19.0760, lng: 72.8777 } },
    { name: "Delhi", coordinates: { lat: 28.7041, lng: 77.1025 } },
    { name: "Pune", coordinates: { lat: 18.5204, lng: 73.8567 } },
    { name: "Kolkata", coordinates: { lat: 22.5726, lng: 88.3639 } },
    { name: "Ahmedabad", coordinates: { lat: 23.0225, lng: 72.5714 } }
  ];

  // Check if a path is active
  const isPathActive = useCallback(
    (path, exact = false) => {
      if (exact) {
        return pathname === path;
      }
      return pathname.startsWith(path);
    },
    [pathname]
  );

  // Navigation handler
  const handleNavigation = useCallback(
    async (path) => {
      if (pathname === path) return;
      setMobileMenuOpen(false);
      await router.push(path);
    },
    [router, pathname]
  );

  // Logout handler
  const handleLogout = useCallback(async () => {
    setShowDropdown(false);
    dispatch(clearUser());
    await persistor.purge();
    await router.push("/");
  }, [dispatch, router]);

  // Toggle functions
  const toggleModal = useCallback(() => {
    setIsOpen(!isOpen);
    setShowDropdown(false);
  }, [isOpen]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(!mobileMenuOpen);
  }, [mobileMenuOpen]);

  // Refs for click outside detection
  const containerRef = useRef(null);
  const locationRef = useRef(null);

  // Handle clicks outside dropdowns
  const handleClickOutside = useCallback((event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
    if (locationRef.current && !locationRef.current.contains(event.target)) {
      setShowLocationModal(false);
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Event listeners
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close dropdowns when pathname changes
  useEffect(() => {
    setShowDropdown(false);
    setShowLocationModal(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLocationSelect = (city, coordinates) => {
    updateLocation(city, coordinates);
    setShowLocationModal(false);
  };

  const handleDetectLocation = () => {
    detectLocation();
    setShowLocationModal(false);
  };

  return (
    <>
     <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md border-b border-gray-200' 
          : 'bg-white shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#2563EB] rounded flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-xl font-bold text-gray-900">SKL</h1>
                    <p className="text-xs text-gray-600 -mt-1">Photography</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navigationItems.map((item) => {
                  const isActive = isPathActive(item.path, item.exact);
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                          : 'text-gray-700 hover:text-[#2563EB] hover:border-b-2 hover:border-blue-300'
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              
              {/* Location Selector */}
              <div ref={locationRef} className="relative hidden sm:block">
                <button
                  onClick={() => setShowLocationModal(!showLocationModal)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  disabled={currentLocation.isDetecting}
                >
                  <MapPin className="w-4 h-4" />
                  <span className="max-w-20 truncate">{currentLocation.city}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Location Dropdown */}
                {showLocationModal && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">Select Location</h3>
                        <button
                          onClick={handleDetectLocation}
                          className="text-sm text-blue-600 hover:text-blue-800"
                          disabled={currentLocation.isDetecting}
                        >
                          <Navigation className="w-4 h-4 inline mr-1" />
                          {currentLocation.isDetecting ? 'Detecting...' : 'Detect'}
                        </button>
                      </div>
                      {currentLocation.error && (
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded mb-2">
                          {currentLocation.error}
                        </div>
                      )}
                    </div>
                    
                    <div className="max-h-48 overflow-y-auto">
                      <div className="p-2">
                        {popularCities.map((city) => (
                          <button
                            key={city.name}
                            onClick={() => handleLocationSelect(city.name, city.coordinates)}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                              currentLocation.city === city.name ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                            }`}
                          >
                            {city.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Auth Section */}
              {!isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                <div ref={containerRef} className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                      <img
                        src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${user?.firstName || 'U'}&background=3b82f6&color=fff`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user?.firstName || 'User'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
                  </button>

                  {/* User Dropdown */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      {/* Profile Header */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                            <img
                              src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${user?.firstName || 'U'}&background=3b82f6&color=fff`}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {user?.firstName && user?.lastName 
                                ? `${user.firstName} ${user.lastName}`
                                : user?.name || user?.email?.split('@')[0] || "User"}
                            </h4>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            handleNavigation("/user/my-bookings");
                            setShowDropdown(false);
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <BookOpen className="w-4 h-4 mr-3" />
                          My Bookings
                        </button>

                        <button
                          onClick={() => {
                            handleNavigation("/user/support");
                            setShowDropdown(false);
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <HelpCircle className="w-4 h-4 mr-3" />
                          Help & Support
                        </button>

                        <hr className="my-1" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              
              {/* Mobile Location */}
              <div className="pb-4 border-b border-gray-200">
                <button
                  onClick={handleDetectLocation}
                  className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded"
                  disabled={currentLocation.isDetecting}
                >
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{currentLocation.city}</p>
                    <p className="text-sm text-gray-600">
                      {currentLocation.isDetecting ? 'Detecting...' : 'Tap to detect'}
                    </p>
                  </div>
                </button>
              </div>

              {/* Mobile Navigation */}
              {navigationItems.map((item) => {
                const isActive = isPathActive(item.path, item.exact);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 text-left transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}

              {/* Mobile Auth */}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="w-full py-3 text-center border border-gray-300 text-gray-700 rounded font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="w-full py-3 bg-blue-600 text-white text-center rounded font-medium"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-20"></div>

      {/* Profile Modal */}
      {isOpen && (
        <ProfileModal isOpen={isOpen} onClose={toggleModal} />
      )}
    </>
  );
};

export default Navbar;