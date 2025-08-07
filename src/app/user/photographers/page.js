"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import Carousel from "../../../components/Carousel/Carousel";
import Freelancers from "../../../components/Freelancers/Freelancers";
import PackageDisplay from "@/components/Freelancers/PackageDisplay";
import { useQuery } from "@tanstack/react-query";
import { fetchEventCategories } from "@/services/Freelancer/freelancer.service";
import CategoryFilter from "@/components/Freelancers/CategoryFilter";
import { useRouter, useSearchParams } from "next/navigation";
import { useFreelancersData } from "@/hooks/useFreelancerData";

const FreelancersPage = () => {
  // ✅ FIXED: Call useFreelancersData() ONLY here, get ALL needed values
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
    filteredFreelancers,
    uniqueLocations,
    hasActiveFilters,
    
    // Actions
    clearFilters,
    
    // Query state
    isLoading,
    error
  } = useFreelancersData();

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
      setSelectedCategory(selectedTypeId);
      hasInitializedFromParams.current = true;
      isInitialLoad.current = false;

      // Trigger initial search with URL params
      console.log("Initial search triggered with URL params");
    } else if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, [searchLocation, newLocationString, setSelectedLocation, setSelectedCategory]);

  // Function to update URL parameters
  const updateURLParams = (newParams) => {
    if (!isInitialLoad.current) {
      const currentParams = new URLSearchParams(window.location.search);

      // Update or remove parameters
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          currentParams.delete(key);
        } else {
          currentParams.set(
            key,
            typeof value === "object" ? JSON.stringify(value) : value
          );
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
    // Always update the state immediately
    setLocationString(str || "");

    // Only trigger user-based search and URL update if not during initial load
    if (!isInitialLoad.current && hasInitializedFromParams.current) {
      updateURLParams({
        locationString: str || null,
      });
      console.log("User changed location input - trigger search");
    }
  };

  const handleCoordinates = (coordinates, displayName) => {
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
        locationString: displayName || locationString || null,
      });
      console.log("User selected coordinates - trigger search");
    }
  };

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesErrorDetails,
    refetch: refetchCategories
  } = useQuery({
    queryFn: fetchEventCategories,
    queryKey: ["event-categories"],
    select: (data) => {
      console.log("Raw API response:", data);
      // Handle multiple possible response structures
      const cats = data?.data?.categories || data?.categories || [];
      console.log("Processed categories:", cats);
      return cats;
    },
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <>
      <Carousel />
      <div className="p-3 lg:p-6">
        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isLoading={categoriesLoading}
        />

        {/* Error handling for categories */}
        {categoriesError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm mb-2">
              Failed to load categories: {categoriesErrorDetails?.message || "Please try again."}
            </p>
            <button
              onClick={() => refetchCategories()}
              className="text-red-600 underline text-sm hover:text-red-800"
            >
              Retry
            </button>
          </div>
        )}

        {/* Show loading state */}
        {categoriesLoading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-600 text-sm">Loading categories...</p>
          </div>
        )}

        {/* Package Display */}
        <PackageDisplay
          selectedCategory={selectedCategory}
        />
        <Freelancers
          // State props
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          userLocation={userLocation}
          locationRadius={locationRadius}
          setLocationRadius={setLocationRadius}
          showMobileFilters={showMobileFilters}
          setShowMobileFilters={setShowMobileFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          filteredFreelancers={filteredFreelancers}
          uniqueLocations={uniqueLocations}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          isLoading={isLoading}
          error={error}
          handleLocation={handleLocationChange}
          handleChangeCoordinates={handleCoordinates}
          locationString={locationString}
          categories={categories}
        />
      </div>
    </>
  );
};

export default FreelancersPage;