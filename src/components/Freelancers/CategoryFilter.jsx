
"use client";
import { Slash } from 'lucide-react';
import React, { memo, useRef, useEffect } from 'react';

const CompactCategoryFilter = memo(({ 
  categories = [], 
  selectedCategory, 
  setSelectedCategory,
  isLoading = false
}) => {
  const scrollRef = useRef(null);
  const selectedCategoryId = selectedCategory?._id || selectedCategory;

  const handleCategoryClick = (categoryId) => {
    const newCategoryId = categoryId === selectedCategoryId ? null : categoryId;
    console.log('Category clicked:', categoryId, 'New selection:', newCategoryId);
    setSelectedCategory(newCategoryId);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="animate-pulse">
          {/* Desktop loading */}
          <div className="hidden sm:flex flex-wrap gap-2 mb-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-10 bg-gray-200 rounded-full w-24"></div>
            ))}
          </div>
          {/* Mobile loading */}
          <div className="sm:hidden flex gap-2 overflow-hidden">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-9 bg-gray-200 rounded-full w-20 flex-shrink-0"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ✅ Better validation and debugging
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    console.log('Categories debug:', { 
      categories, 
      length: categories?.length, 
      isArray: Array.isArray(categories),
      selectedCategory,
      selectedCategoryId,
      isLoading 
    });
    
    // Don't show error during loading
    if (isLoading) {
      return null;
    }
    
    return (
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-600 text-sm">
          {!categories ? 'Categories not loaded.' : 'No categories available.'}
        </p>
      </div>
    );
  }

  return (
    <div className="sm:mb-3 sm:flex sm:justify-center">
      {/* Desktop/Tablet - Horizontal Pills */}
      <div className="hidden sm:block">
        <div className="flex flex-wrap gap-3">
          {/* All Categories Button */}
          <button
            onClick={() => handleCategoryClick(null)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              !selectedCategoryId 
                ? 'bg-[#892580] text-white shadow-lg transform scale-105' 
                : 'bg-white text-gray-700 border border-gray-200 hover:border-[#892580] hover:text-[#892580] hover:shadow-md'
            }`}
          >
            All Categories
          </button>
          
          {/* Category Pills */}
          {categories.map((category) => {
            if (!category || !category._id) {
              console.warn('Invalid category:', category);
              return null;
            }
            
            return (
              <button
                key={category._id}
                onClick={() => handleCategoryClick(category._id)}
                className={`px-5 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategoryId === category._id 
                    ? 'bg-[#892580] text-white shadow-lg transform scale-105' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-[#892580] hover:text-[#892580] hover:shadow-md'
                }`}
              >
                {category.name || 'Unnamed Category'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile - Compact Horizontal Scroll */}
      <div className="sm:hidden">
        <div className="relative">
          {/* Scrollable Categories */}
          <div 
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* All Categories Chip */}
            <button
              onClick={() => handleCategoryClick(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                !selectedCategoryId 
                  ? 'bg-[#892580] text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              All
            </button>
            
            {/* Category Chips */}
            {categories.map((category) => {
              if (!category || !category._id) {
                console.warn('Invalid category:', category);
                return null;
              }
              
              return (
                <button
                  key={category._id}
                  onClick={() => handleCategoryClick(category._id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategoryId === category._id 
                      ? 'bg-[#892580] text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {category.name && category.name.length > 12 
                    ? `${category.name.substring(0, 12)}...` 
                    : (category.name || 'Unnamed')
                  }
                </button>
              );
            })}
          </div>

          {/* Fade indicators for scroll */}
          <div className="absolute top-0 right-0 w-4 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
});

CompactCategoryFilter.displayName = 'CompactCategoryFilter';

export default CompactCategoryFilter;