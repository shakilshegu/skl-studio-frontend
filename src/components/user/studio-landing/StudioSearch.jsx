"use client";

import GooglePlacesAutocomplete from "@/components/GooglePlacesAutocomplete/GooglePlacesAutocomplete";
import { fetchStudioCategories } from "@/services/PartnerService/studio.service";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Camera, MapPin, Search, ChevronDown, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const StudioSearch = () => {
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [selectedTypeName, setSelectedTypeName] = useState("All");
  const [location, setLocation] = useState("");
  const [locationString, setLocationString] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();

  // Enhanced query with better error handling
  const { 
    data: categories, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ["studio-categories"],
    queryFn: fetchStudioCategories,
    select: (data) => {
      // Handle multiple possible response structures
      return data?.data?.categories || data?.categories || [];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedTypeId) params.set("selectedCategoryId", selectedTypeId);
    if (location && location.lat && location.lng) {
      params.set("location", JSON.stringify(location));
    }
    if (locationString) params.set("locationString", locationString);

    router.push(`/user/studio-list?${params}`);
  };

  const handleCategorySelect = (category) => {
    setSelectedTypeId(category._id);
    setSelectedTypeName(category.name);
    setIsDropdownOpen(false);
  };

  const handleClearCategory = () => {
    setSelectedTypeId(null);
    setSelectedTypeName("All");
    setIsDropdownOpen(false);
  };

  const handleLocationChange = (str) => {
    setLocationString(str || "");
  };

  const handleCoordinates = (coordinates) => {
    setLocation(coordinates || "");
  };

  return (
    <div className="max-w-4xl mx-auto mb-12" style={{ zIndex: isDropdownOpen ? 9998 : 'auto' }}>
      <div className="bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-sm rounded-3xl p-4 shadow-2xl border border-white/50 relative" 
           style={{ overflow: isDropdownOpen ? 'visible' : 'hidden' }}>
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#892580]/5 via-transparent to-[#892580]/5 rounded-3xl"></div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          
          {/* Activity Selection */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-hover:text-[#892580] transition-colors duration-200">
              <div className="p-2 bg-gradient-to-br from-[#892580]/20 to-[#892580]/10 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200">
                <Camera className="w-4 h-4 text-[#892580]" />
              </div>
              Activity
            </label>
            
            <div className="relative" ref={dropdownRef} style={{ zIndex: isDropdownOpen ? 9999 : 'auto' }}>
              {/* Custom Dropdown Button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-left font-medium focus:outline-none focus:ring-4 focus:ring-[#892580]/25 focus:border-[#892580] transition-all duration-300 hover:border-gray-300 hover:shadow-lg flex items-center justify-between"
                disabled={isLoading}
              >
                <span className={`${selectedTypeId ? 'text-gray-900' : 'text-gray-500'}`}>
                  {isLoading ? 'Loading...' : selectedTypeName}
                </span>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                ) : (
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                )}
              </button>

              {/* Dropdown Menu - Fixed positioning */}
              {isDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto"
                       style={{ zIndex: 9999 }}>
                  
                  {/* Error State */}
                  {isError && (
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-red-600 mb-2">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">Failed to load categories</span>
                      </div>
                      <button
                        onClick={() => refetch()}
                        className="w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors duration-200 text-sm font-medium"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {/* Categories List */}
                  {!isError && categories && (
                    <>
                      {/* All Option */}
                      <button
                        onClick={handleClearCategory}
                        className={`w-full px-4 py-3 text-left hover:bg-[#892580]/5 transition-colors duration-200 font-medium border-b border-gray-100 ${
                          !selectedTypeId 
                            ? 'bg-[#892580]/10 text-[#892580] border-l-4 border-[#892580]' 
                            : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>All Categories</span>
                          {!selectedTypeId && (
                            <span className="text-[#892580] text-sm">✓</span>
                          )}
                        </div>
                      </button>

                      {/* Category Options */}
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <button
                            key={category._id}
                            onClick={() => handleCategorySelect(category)}
                            className={`w-full px-4 py-3 text-left hover:bg-[#892580]/5 transition-colors duration-200 font-medium ${
                              selectedTypeId === category._id 
                                ? 'bg-[#892580]/10 text-[#892580] border-l-4 border-[#892580]' 
                                : 'text-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{category.name}</span>
                              {selectedTypeId === category._id && (
                                <span className="text-[#892580] text-sm">✓</span>
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <Camera className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="font-medium">No categories available</p>
                          <p className="text-sm">Please try again later</p>
                        </div>
                      )}
                    </>
                  )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-hover:text-[#892580] transition-colors duration-200">
              <div className="p-2 bg-gradient-to-br from-[#892580]/20 to-[#892580]/10 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200">
                <MapPin className="w-4 h-4 text-[#892580]" />
              </div>
              Location
            </label>
            <GooglePlacesAutocomplete
              value={locationString || ""}
              onChange={handleLocationChange}
              onCoordinates={handleCoordinates}
              placeholder="Search for a city"
              debounceTime={300}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-700 font-medium focus:outline-none focus:ring-4 focus:ring-[#892580]/25 focus:border-[#892580] transition-all duration-300 hover:border-gray-300 hover:shadow-lg"
            />
          </div>

          {/* Search Button */}
          <div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="group relative w-full h-12 bg-gradient-to-r from-[#892580] via-[#9d2b91] to-[#b84397] text-white font-bold rounded-2xl hover:from-[#7a2073] hover:via-[#8a257f] hover:to-[#a63d88] focus:outline-none focus:ring-4 focus:ring-[#892580]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center gap-2">
                <Search className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Search</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioSearch;