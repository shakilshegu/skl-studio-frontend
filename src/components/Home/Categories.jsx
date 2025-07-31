"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchEventCategories } from "@/services/Home/home.service";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const Categories = () => {
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const router = useRouter();
  const sliderRef = useRef(null);

  // ✅ Fixed: Consistent data structure handling
  const {
    data: categories,
    isLoading,
    isError,
    error,
    refetch
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

  // Debug logging
  console.log('Categories state:', { categories, isLoading, isError, length: categories?.length });

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition(); // Initial check
      
      return () => slider.removeEventListener('scroll', checkScrollPosition);
    }
  }, [categories]);

  const handleCategoryClick = (category) => {
    if (!isDragging) {
      router.push(`/user/photographers?selectedCategoryId=${category._id}`);
    }
  };

  const slideLeft = () => {
    if (sliderRef.current) {
      const slideWidth = 160; // Fixed slide width
      sliderRef.current.scrollBy({
        left: -slideWidth * 2,
        behavior: 'smooth'
      });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      const slideWidth = 160; // Fixed slide width
      sliderRef.current.scrollBy({
        left: slideWidth * 2,
        behavior: 'smooth'
      });
    }
  };

  // Touch/Mouse drag functionality
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
    sliderRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Browse Categories
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore our wide range of photography and studio services
        </p>
      </div>

      {/* Categories Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-[#892580] animate-spin mb-4" />
          <p className="text-gray-500">Loading categories...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
            <p className="text-red-600 font-medium">Failed to load categories</p>
            <p className="text-red-500 text-sm mt-1">{error?.message || 'Please try refreshing the page'}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : !categories || !Array.isArray(categories) || categories.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-md mx-auto">
            <p className="text-gray-600 font-medium">No categories available</p>
            <p className="text-gray-500 text-sm mt-1">Check back later for updates</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="relative group">
          {/* Navigation Buttons */}
          {showLeftArrow && (
            <button
              onClick={slideLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:bg-[#892580] hover:text-white hover:border-[#892580] opacity-0 group-hover:opacity-100 -translate-x-5 group-hover:translate-x-0"
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {showRightArrow && (
            <button
              onClick={slideRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:bg-[#892580] hover:text-white hover:border-[#892580] opacity-0 group-hover:opacity-100 translate-x-5 group-hover:translate-x-0"
              aria-label="Next categories"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Slider Container - Fixed centering and hover issues */}
          <div className="overflow-hidden py-8 px-4">
            <div
              ref={sliderRef}
              className={`flex gap-8 overflow-x-auto scrollbar-hide cursor-grab select-none transition-all duration-300 ${
                categories.length <= 3 
                  ? 'justify-center' 
                  : categories.length <= 5 
                    ? 'justify-center md:justify-start' 
                    : 'justify-start'
              }`}
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitScrollbar: { display: 'none' }
              }}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {categories.map((category, index) => (
                <div
                  key={category._id}
                  className="flex-none w-36 cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="group/item relative flex flex-col items-center transition-all duration-300 hover:transform hover:-translate-y-3 p-4">
                    {/* Image Container */}
                    <div className="relative mb-4">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-lg border-4 border-white group-hover/item:border-[#892580] transition-all duration-300 group-hover/item:shadow-xl group-hover/item:scale-105">
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                          loading="lazy"
                          draggable={false}
                          onError={(e) => {
                            e.target.src = '/Assets/placeholder-category.svg';
                          }}
                        />
                      </div>
                      
                      {/* Hover indicator */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#892580] rounded-full flex items-center justify-center opacity-0 scale-0 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:scale-100 shadow-lg">
                        <ChevronRight className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    {/* Category Name */}
                    <div className="text-center w-full px-1">
                      <p className="text-sm font-semibold text-gray-700 group-hover/item:text-[#892580] transition-colors duration-300 line-clamp-2 leading-tight">
                        {category.name}
                      </p>
                      
                      {/* Underline animation */}
                      <div className="w-0 h-0.5 bg-[#892580] mx-auto mt-2 transition-all duration-300 group-hover/item:w-full rounded-full"></div>
                    </div>

                    {/* Background hover effect - increased padding for no cut-off */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#892580]/5 to-[#892580]/10 rounded-2xl opacity-0 scale-95 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:scale-100 -z-10 -m-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicators */}
          {categories.length > 5 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: Math.ceil(categories.length / 5) }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === Math.floor(currentSlide / 5) 
                      ? 'bg-[#892580] w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Categories;