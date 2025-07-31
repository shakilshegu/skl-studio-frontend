// hooks/useStudiosData.js
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStudioFilterDetails } from "@/services/studio/studio.service";

export const useStudiosData = () => {
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [sortBy, setSortBy] = useState("newest");
  const [userLocation, setUserLocation] = useState(null);
  const [locationRadius, setLocationRadius] = useState(10);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  
  
useEffect(() => {
  if (!selectedLocation && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(coords);
      },
      (error) => {
        console.log("Location access denied:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }
}, [selectedLocation]);


console.log(selectedCategory,"===============dddddddddddd==");
  // Use React Query to fetch studios data
  const { data: studioData, error, isLoading } = useQuery({
    queryKey: ["fetchStudios", searchTerm, selectedLocation, priceRange, sortBy,userLocation, locationRadius,selectedCategory],
    queryFn: () => getStudioFilterDetails({
      search: searchTerm || undefined,
      searchLat:selectedLocation?.lat,
      searchLng:selectedLocation?.lng,
      lat: userLocation?.lat,
      lng: userLocation?.lng,
      radius: locationRadius,
      sortBy: sortBy,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 20000 ? priceRange[1] : undefined,
      category :selectedCategory 
    }),

    select: (data) => data?.studios || [],
    onError: (error) => {
      console.error('Query error:', error);
    }
  });

  const filteredStudios = useMemo(() => {
    if (!studioData) return [];
    return studioData;
  }, [studioData]);

  // Get unique locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    if (!studioData) return [];
    const locations = new Set();
    studioData.forEach(studio => {
      if (studio.address?.city) locations.add(studio.address.city);
      if (studio.address?.state) locations.add(studio.address.state);
    });
    return Array.from(locations).sort();
  }, [studioData]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setPriceRange([0, 20000]);
    setSortBy("newest");
    setLocationRadius(10);
  };

  const hasActiveFilters = searchTerm || selectedLocation || priceRange[0] > 0 || priceRange[1] < 20000 || locationRadius < 50;

  return {
    // State
    searchTerm,
    setSearchTerm,
    selectedLocation,
    setSelectedLocation,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    userLocation,
    locationRadius,
    setLocationRadius,
    showMobileFilters,
    setShowMobileFilters,
    viewMode,
    setViewMode,
    
    // Computed
    filteredStudios,
    uniqueLocations,
    hasActiveFilters,
    
    // Actions
    clearFilters,
    
    // Query state
    isLoading,
    error
  };
};