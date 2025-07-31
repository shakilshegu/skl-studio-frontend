// pages/StudiosPage.jsx (Main Component)
'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useStudiosData } from "@/hooks/useStudiosData";
import StudiosHeader from "./StudioHeader";
import FilterSidebar from "./FilterSidebar";
import MobileFilterControls from "./FilterControlls";
import DesktopFilterBar from "./DesktopFilter";
import MobileFilterModal from "./MobileFilter";
import StudiosContent from "./StudiosContent";
import Carousel from "../Carousel/Carousel";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchStudioCategories } from "@/services/PartnerService/studio.service";

const StudiosPage = () => {
  const {
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
  } = useStudiosData();


    const [location, setLocation] = useState("");
  const [locationString, setLocationString] = useState("");
  
  // Track if this is the initial load
  const isInitialLoad = useRef(true);
  const hasInitializedFromParams = useRef(false);

  const params = useSearchParams();
  const router = useRouter();
  
  const selectedTypeId = params.get("selectedCategoryId");
  const rawLocation = params.get("location");
  const newLocationString = params.get("locationString");

  const searchLocation = useMemo(() => {
    try {
      return rawLocation ? JSON.parse(rawLocation) : null;
    } catch (e) {
      console.error("Failed to parse location:", e);
      return null;
    }
  }, [rawLocation]);

  // Initialize from URL params only once on component mount
  useEffect(() => {
    if (isInitialLoad.current && searchLocation && newLocationString) {
      setSelectedLocation(searchLocation);
      setLocationString(newLocationString);
      setLocation(searchLocation);
      setSelectedCategory(selectedTypeId)
      hasInitializedFromParams.current = true;
      isInitialLoad.current = false;
      
      // Trigger initial search with URL params
      console.log("Initial search triggered with URL params");
    } else if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, [searchLocation, newLocationString, setSelectedLocation]);

  // Function to update URL parameters
  const updateURLParams = (newParams) => {
    if (!isInitialLoad.current) {
      const currentParams = new URLSearchParams(window.location.search);
      
      // Update or remove parameters
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          currentParams.delete(key);
        } else {
          currentParams.set(key, typeof value === 'object' ? JSON.stringify(value) : value);
        }
      });
      
      // Update URL without triggering page reload
      const newURL = `${window.location.pathname}?${currentParams.toString()}`;
        // ✅ force update the browser URL without reload
  window.history.replaceState(null, "", newURL);
      router.replace(newURL, { shallow: true });
    }
  };

  const handleLocationChange = (str) => {
    console.log("handleLocationChange =======333");

    // Always update the state immediately
    setLocationString(str || "");
    
    // Only trigger user-based search and URL update if not during initial load
    if (!isInitialLoad.current && hasInitializedFromParams.current) {


      updateURLParams({
        locationString: str || null
      });
      console.log("User changed location input - trigger search");
    }
  };
  
  const handleCoordinates = (coordinates, displayName) => {    
console.log("handleLocationChange =======44");

    // Always update both states immediately
    setLocation(coordinates || "");
    setSelectedLocation(coordinates || "");
    
    // Update locationString with the display name if provided
    // This ensures the input shows the selected location name
    if (displayName) {
      setLocationString(displayName);
    }
    
    // Only trigger user-based search and URL update if not during initial load
    if (!isInitialLoad.current && hasInitializedFromParams.current) {
      updateURLParams({
        location: coordinates || null,
        locationString: displayName || locationString || null
      });
      console.log("User selected coordinates - trigger search");
    }
  };

  // Fetch studio categories
  const { data: categories, isLoading: isLoadingStudioCategories } =
    useQuery({
      queryKey: ["studio-categories"],
      queryFn: fetchStudioCategories,
      select: (data) => data?.data?.categories,
    });
    

  return (
    <div className="min-h-screen bg-gray-50">
      <Carousel/>
      {/* Header */}
      <StudiosHeader 
        studiosCount={filteredStudios.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Desktop Sidebar Filters */}
          <FilterSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleLocationChange={handleLocationChange}
            handleCoordinates={handleCoordinates}
            locationString={locationString}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            locationRadius={locationRadius}
            setLocationRadius={setLocationRadius}
            hasActiveFilters={hasActiveFilters}
            clearFilters={clearFilters}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Button + Sort */}
            <MobileFilterControls
              setShowMobileFilters={setShowMobileFilters}
              hasActiveFilters={hasActiveFilters}
              sortBy={sortBy}
              setSortBy={setSortBy}
              userLocation={userLocation}
            />

            {/* Desktop Sort */}
            <DesktopFilterBar
              studiosCount={filteredStudios.length}
              hasActiveFilters={hasActiveFilters}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedLocation={selectedLocation}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              setSelectedLocation={setSelectedLocation}
              sortBy={sortBy}
              setSortBy={setSortBy}
              userLocation={userLocation}
            />

            {/* Content */}
            <StudiosContent
              isLoading={isLoading}
              error={error}
              filteredStudios={filteredStudios}
              viewMode={viewMode}
              userLocation={userLocation}
              clearFilters={clearFilters}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        showMobileFilters={showMobileFilters}
        setShowMobileFilters={setShowMobileFilters}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        locationRadius={locationRadius}
        setLocationRadius={setLocationRadius}
        uniqueLocations={uniqueLocations}
        userLocation={userLocation}
        clearFilters={clearFilters}
      />
    </div>
  );
};

export default StudiosPage;