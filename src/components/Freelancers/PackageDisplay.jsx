'use client';
import React, { useState, useRef } from "react";
import { Package, ChevronLeft, ChevronRight, Play, Pause, Heart } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { fetchPackages } from '@/services/Home/home.service';
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import '../../Styles/Slicker.css'
import PackageCard from "./PackageCard";

// Import CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom Arrow Components
const CustomPrevArrow = ({ onClick, className }) => (
  <button
    className={`${className} !flex !items-center !justify-center !w-12 !h-12 !bg-white !border !border-gray-300 hover:!border-[#892580] hover:!text-[#892580] !rounded-full !shadow-lg !transition-all !duration-300 !z-10 before:!hidden`}
    onClick={onClick}
    style={{
      left: '-25px',
      transform: 'translateY(-50%)',
    }}
  >
    <ChevronLeft className="w-5 h-5" />
  </button>
);

const CustomNextArrow = ({ onClick, className }) => (
  <button
    className={`${className} !flex !items-center !justify-center !w-12 !h-12 !bg-white !border !border-gray-300 hover:!border-[#892580] hover:!text-[#892580] !rounded-full !shadow-lg !transition-all !duration-300 !z-10 before:!hidden`}
    onClick={onClick}
    style={{
      right: '-25px',
      transform: 'translateY(-50%)',
    }}
  >
    <ChevronRight className="w-5 h-5" />
  </button>
);

const PackageDisplay = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['packages'],
    queryFn: fetchPackages,
  });
  
  const router = useRouter();
  const [favoritePackages, setFavoritePackages] = useState(new Set());
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  const packages = Array.isArray(data?.data) ? data.data : [];
  const hasMultiplePackages = packages.length > 1;

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    const newFavorites = new Set(favoritePackages);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavoritePackages(newFavorites);
  };

  // Dynamic slider settings based on package count
  const getSliderSettings = () => {
    const baseSettings = {
      dots: hasMultiplePackages,
      infinite: hasMultiplePackages,
      speed: 500,
      slidesToShow: Math.min(3, packages.length), 
      slidesToScroll: 1,
      autoplay: hasMultiplePackages && isAutoPlaying, 
      autoplaySpeed: 3000,
      pauseOnHover: true,
      pauseOnFocus: true,
      pauseOnDotsHover: true,
      swipeToSlide: hasMultiplePackages,
      touchThreshold: 10,
      arrows: hasMultiplePackages, // Hide arrows if only one package
      prevArrow: hasMultiplePackages ? <CustomPrevArrow /> : null,
      nextArrow: hasMultiplePackages ? <CustomNextArrow /> : null,
      beforeChange: (current, next) => setCurrentSlide(next),
      responsive: [
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: Math.min(2, packages.length),
            slidesToScroll: 1,
            dots: hasMultiplePackages,
            arrows: hasMultiplePackages,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false, // Always hide arrows on mobile
            dots: hasMultiplePackages,
          }
        }
      ],
    };

    // Add custom paging only if we have multiple packages
    if (hasMultiplePackages) {
      baseSettings.customPaging = (i) => (
        <button
          className={`w-3 h-3 rounded-full transition-all duration-300 border-0 ${
            i === Math.floor(currentSlide / baseSettings.slidesToShow) 
              ? 'bg-[#892580] scale-125 shadow-md' 
              : 'bg-gray-300 hover:bg-[#892580]/50'
          }`}
          style={{
            width: '12px',
            height: '12px',
            padding: '0',
            margin: '0 4px',
          }}
        />
      );
      baseSettings.dotsClass = "slick-dots custom-dots";
    }

    return baseSettings;
  };

  // Enhanced Loading Component
  const LoadingSlider = () => (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Error Component
  const ErrorDisplay = () => (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="w-10 h-10 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Packages</h3>
      <p className="text-gray-600 mb-6">We couldn't load the packages. Please try again.</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-[#892580] text-white rounded-lg hover:bg-[#7a1f70] transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  // Control functions
  const toggleAutoPlay = () => {
    if (!hasMultiplePackages) return; // Don't allow autoplay toggle if only one package
    
    setIsAutoPlaying(!isAutoPlaying);
    if (sliderRef.current) {
      if (isAutoPlaying) {
        sliderRef.current.slickPause();
      } else {
        sliderRef.current.slickPlay();
      }
    }
  };

  const goNext = () => {
    if (sliderRef.current && hasMultiplePackages) {
      sliderRef.current.slickNext();
    }
  };

  const goPrev = () => {
    if (sliderRef.current && hasMultiplePackages) {
      sliderRef.current.slickPrev();
    }
  };

  // Single Package Display Component
  const SinglePackageDisplay = () => (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <PackageCard 
          router={router} 
          pkg={packages[0]} 
          index={0} 
          favoritePackages={favoritePackages} 
          toggleFavorite={toggleFavorite} 
        />
      </div>
    </div>
  );

  return (
    <div className="mx-auto lg:px-8 py-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#892580]/10 text-[#892580] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Package className="w-4 h-4" />
            SKL Packages
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Choose Your Perfect
            <span className="text-[#892580]"> Package</span>
          </h2>
          
          <p className="text-gray-600 max-w-2xl">
            {packages.length === 1 
              ? "Discover our premium package designed to make your events extraordinary."
              : "Discover our curated collection of premium packages designed to make your events extraordinary."
            }
          </p>
        </div>

        {/* Controls - Only show if multiple packages */}
        {hasMultiplePackages && (
          <div className="flex items-center gap-4 mt-6 lg:mt-0">
            {/* Package Counter */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-[#892580]">{currentSlide + 1}</span>
                {" of "}
                <span className="font-semibold">{packages.length}</span>
              </span>
            </div>

            {/* Auto-play Toggle */}
            <button
              onClick={toggleAutoPlay}
              className={`p-3 rounded-lg border transition-colors ${
                isAutoPlaying 
                  ? 'bg-[#892580] text-white border-[#892580]' 
                  : 'bg-white text-gray-600 border-gray-300 hover:border-[#892580]'
              }`}
              title={isAutoPlaying ? "Pause auto-play" : "Start auto-play"}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Manual Navigation */}
            <div className="hidden md:flex gap-2">
              <button
                onClick={goPrev}
                className="p-3 rounded-lg bg-white border border-gray-300 hover:border-[#892580] hover:text-[#892580] transition-colors"
                title="Previous package"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goNext}
                className="p-3 rounded-lg bg-white border border-gray-300 hover:border-[#892580] hover:text-[#892580] transition-colors"
                title="Next package"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSlider />}

      {/* Error State */}
      {isError && <ErrorDisplay />}

      {/* Packages Display */}
      {!isLoading && !isError && packages.length > 0 && (
        <div className="relative">
          {/* Progress Bar - Only show for multiple packages with autoplay */}
          {hasMultiplePackages && isAutoPlaying && (
            <div className="mb-6 h-1 bg-gray-200 rounded-full overflow-hidden px-8">
              <div 
                className="h-full bg-[#892580] rounded-full transition-all duration-4000 ease-linear"
                style={{
                  width: `${((currentSlide + 1) / packages.length) * 100}%`
                }}
              />
            </div>
          )}

          {/* Single Package Display */}
          {packages.length === 1 ? (
            <SinglePackageDisplay />
          ) : (
            /* Multiple Packages Slider */
            <div className="px-8">
              <Slider ref={sliderRef} {...getSliderSettings()}>
                {packages.map((pkg, index) => (
                  <div key={pkg._id} className="px-0 md:px-3">
                    <PackageCard 
                      router={router} 
                      pkg={pkg} 
                      index={index} 
                      favoritePackages={favoritePackages} 
                      toggleFavorite={toggleFavorite} 
                    />
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && packages.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Packages Available</h3>
          <p className="text-gray-600 mb-6">We're working on adding new packages. Check back soon!</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#892580] text-white rounded-lg hover:bg-[#7a1f70] transition-colors"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default PackageDisplay;