"use client";

import { fetchEventCategories } from "@/services/Home/home.service";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Camera, MapPin, Search, Palette, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GooglePlacesAutocomplete from "../GooglePlacesAutocomplete/GooglePlacesAutocomplete";

const HomeSearch = () => {
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [location, setLocation] = useState("");
  const [locationString, setLocationString] = useState("");

  const router = useRouter();

  // Fetch studio categories
  const { data:categories, isLoading, isError } = useQuery({
    queryKey: ["event-categories"],
    queryFn: fetchEventCategories,
    select: (data) => data?.data?.categories,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedTypeId) params.set("selectedCategoryId", selectedTypeId);
     if (location && location.lat && location.lng)  params.set("location", JSON.stringify(location));
    if(locationString) params.set("locationString",locationString)
    router.push(`/user/photographers?${params}`);
  };

  const handleTypeChange = (e) => {
    const val = e.target.value;
    setSelectedTypeId(val === 'null' ? null : val);
  };
  const handleLocationChange = (str) => {
    setLocationString(str || "")
  };

  const handleCoordinates = (coordinates) => {
    setLocation(coordinates || ""); 
  };

  useEffect(() => {
    console.log("Location String:", locationString);
  }, [locationString,location]);

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-sm rounded-3xl p-4 shadow-2xl border border-white/50 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/5 via-transparent to-[#0284C7]/5 rounded-3xl"></div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          
          {/* Activity Selection */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-hover:text-[#2563EB] transition-colors duration-200">
              <div className="p-2 bg-gradient-to-br from-[#2563EB]/20 to-[#0284C7]/10 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200">
                <Palette className="w-4 h-4 text-[#2563EB]" />
              </div>
              Activity
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-700 font-medium focus:outline-none focus:ring-4 focus:ring-[#2563EB]/25 focus:border-[#2563EB] transition-all duration-300 hover:border-gray-300 hover:shadow-lg appearance-none cursor-pointer"
                value={selectedTypeId||"null"}
                onChange={handleTypeChange}
              >
                <option value="null">Choose your activity</option>
                {categories?.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-hover:text-[#0284C7] transition-colors duration-200">
              <div className="p-2 bg-gradient-to-br from-[#0284C7]/20 to-[#2563EB]/10 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200">
                <Target className="w-4 h-4 text-[#0284C7]" />
              </div>
              Location
            </label>
            <GooglePlacesAutocomplete
              value={locationString || ""} // Fixed: Ensure value is never undefined
              onChange={handleLocationChange}
              onCoordinates={handleCoordinates}
              placeholder="Search for a city"
              debounceTime={300}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-700 font-medium focus:outline-none focus:ring-4 focus:ring-[#0284C7]/25 focus:border-[#0284C7] transition-all duration-300 hover:border-gray-300 hover:shadow-lg"
            />
          </div>

          {/* Search Button */}
          <div>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="group relative w-full h-12 bg-gradient-to-r from-[#2563EB] via-[#0284C7] to-[#EC4899] text-white font-bold rounded-2xl hover:from-[#1D4ED8] hover:via-[#0369A1] hover:to-[#DB2777] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isLoading ? (
                <div className="relative z-10 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="relative z-10 flex items-center gap-2">
                  <Search className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Search</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSearch;