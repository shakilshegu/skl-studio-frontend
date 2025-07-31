
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFreelancerFilterDetails } from "@/services/Freelancer/freelancer.service";

export const useFreelancersData = () => {
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


console.log(selectedLocation,"===========ssssssssseeee")
  // Use React Query to fetch freelancers data
  const { data: freelancerData, error, isLoading } = useQuery({
      queryKey: ["fetchFreelancers", searchTerm, selectedLocation,userLocation, priceRange, sortBy,selectedCategory, locationRadius],
    queryFn: () => getFreelancerFilterDetails({
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

    select: (data) => data?.freelancers || [],
    onError: (error) => {
      console.error('Query error:', error);
    },
    
  });

  const filteredFreelancers = useMemo(() => {
    if (!freelancerData) return [];
    return freelancerData;
  }, [freelancerData]);

  // Get unique locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    if (!freelancerData) return [];
    const locations = new Set();
    freelancerData.forEach(freelancer => {
      if (freelancer.location) locations.add(freelancer.location);
    });
    return Array.from(locations).sort();
  }, [freelancerData]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setPriceRange([0, 20000]);
    setSortBy("newest");
    setLocationRadius(10);
  };
  // Check for active filters (excluding category since it's managed by parent)
  const hasActiveFilters = searchTerm || selectedLocation ||   priceRange[0] > 0 ||  priceRange[1] < 20000 ||  locationRadius < 50;

  return {
    // State
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedLocation,
    setSelectedLocation,
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
    filteredFreelancers,
    uniqueLocations,
    hasActiveFilters,
    
    // Actions
    clearFilters,
    
    // Query state
    isLoading,
    error
  };
};
