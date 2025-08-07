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
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-tr from-[#892580] via-[#b84397] to-[#d946ef] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#892580] to-[#d946ef] bg-clip-text text-transparent">
                  ALOKA
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Capture Moments</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const isActive = isPathActive(item.path, item.exact);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`relative flex items-center gap-4 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      item.highlight
                        ? 'bg-gradient-to-r from-[#892580] to-[#b84397] text-white hover:from-[#7a2073] hover:to-[#a63d88] shadow-lg hover:shadow-xl transform hover:scale-105'
                        : isActive
                        ? 'bg-[#892580]/10 text-[#892580] shadow-sm'
                        : 'text-gray-600 hover:text-[#892580] hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              
              {/* Location Selector */}
              <div ref={locationRef} className="relative hidden sm:block">
                <button
                  onClick={() => setShowLocationModal(!showLocationModal)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md group"
                  disabled={currentLocation.isDetecting}
                >
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#892580]" />
                    {currentLocation.isDetecting && (
                      <div className="absolute inset-0 animate-ping">
                        <MapPin className="w-4 h-4 text-[#892580] opacity-30" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-24 truncate">
                    {currentLocation.city}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </button>

                {/* Location Dropdown */}
                {showLocationModal && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">Select Location</h3>
                        <button
                          onClick={handleDetectLocation}
                          className="flex items-center gap-1 text-sm text-[#892580] hover:text-[#7a2073] font-medium"
                          disabled={currentLocation.isDetecting}
                        >
                          <Navigation className="w-4 h-4" />
                          {currentLocation.isDetecting ? 'Detecting...' : 'Detect'}
                        </button>
                      </div>
                      {currentLocation.error && (
                        <div className="text-xs text-red-500 bg-red-50 p-2 rounded-lg mb-2">
                          {currentLocation.error}
                        </div>
                      )}
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      <div className="p-2">
                        <p className="text-xs font-medium text-gray-500 px-3 py-2">POPULAR CITIES</p>
                        {popularCities.map((city) => (
                          <button
                            key={city.name}
                            onClick={() => handleLocationSelect(city.name, city.coordinates)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors ${
                              currentLocation.city === city.name ? 'text-[#892580] bg-[#892580]/5' : 'text-gray-700'
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
              {/* <button className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors group">
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-[#892580]" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs text-white font-medium">3</span>
                </div>
              </button> */}

              {/* Auth Section */}
              {!isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="px-4 py-2 text-gray-600 hover:text-[#892580] font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="px-4 py-2 hidden sm:block bg-gradient-to-r from-[#892580] to-[#b84397] text-white font-medium rounded-xl hover:from-[#7a2073] hover:to-[#a63d88] shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                <div ref={containerRef} className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-3 p-1 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                  >
                    <div className="relative">
                      <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-[#892580]/20 group-hover:border-[#892580]/40 transition-colors">
                        <img
                          src={user?.profilePhoto || cat8}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName || user?.name || user?.email?.split('@')[0] || "User"}
                      </p>
                      <p className="text-xs text-gray-500">View Profile</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 hidden md:block" />
                  </button>

                  {/* User Dropdown */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                      {/* Profile Header */}
                      <div className="bg-gradient-to-r from-[#892580] to-[#b84397] p-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20">
                            <img
                              src={user?.profilePhoto || cat8}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">
                              {user?.firstName && user?.lastName 
                                ? `${user.firstName} ${user.lastName}`
                                : user?.name || user?.email?.split('@')[0] || "User"}
                            </h4>
                            <p className="text-white/80 text-sm">{user?.email}</p>
                            <button
                              onClick={toggleModal}
                              className="text-xs bg-white/20 px-3 py-1 rounded-full mt-2 hover:bg-white/30 transition-colors"
                            >
                              Edit Profile
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            handleNavigation("/user/my-bookings");
                            setShowDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">My Bookings</p>
                            <p className="text-xs text-gray-500">View your reservations</p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            handleNavigation("/user/support");
                            setShowDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                            <HelpCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Help & Support</p>
                            <p className="text-xs text-gray-500">Get assistance</p>
                          </div>
                        </button>

                        <hr className="my-2" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Sign Out</p>
                            <p className="text-xs text-red-400">Logout from account</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 hover:bg-gray-50 rounded-xl transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="px-4 py-6 space-y-4">
              
              {/* Mobile Location */}
              <div className="pb-4 border-b border-gray-100">
                <button
                  onClick={handleDetectLocation}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                  disabled={currentLocation.isDetecting}
                >
                  <MapPin className="w-5 h-5 text-[#892580]" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{currentLocation.city}</p>
                    <p className="text-sm text-gray-500">
                      {currentLocation.isDetecting ? 'Detecting location...' : 'Tap to detect location'}
                    </p>
                  </div>
                </button>
                
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {popularCities.slice(0, 4).map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleLocationSelect(city.name, city.coordinates)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        currentLocation.city === city.name
                          ? 'border-[#892580] text-[#892580] bg-[#892580]/5'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Navigation */}
              {navigationItems.map((item) => {
                const isActive = isPathActive(item.path, item.exact);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                      item.highlight
                        ? 'bg-gradient-to-r from-[#892580] to-[#b84397] text-white shadow-lg'
                        : isActive
                        ? 'bg-[#892580]/10 text-[#892580]'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}

              {/* Mobile Auth */}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="w-full hidden sm:block py-3 bg-gradient-to-r from-[#892580] to-[#b84397] text-white rounded-xl font-medium"
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