"use client";
import { Camera, Play, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import "react-datepicker/dist/react-datepicker.css";
import HomeSearch from "./HomeSearch";
import { fetchActiveBanners} from "../../services/banner.service";

const ModernHeroSection = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  // Fetch active hero banners
  const { data: bannerResponse, isLoading: bannersLoading } = useQuery({
    queryKey: ['hero-banners'],
    queryFn: () => fetchActiveBanners({ position: 'hero', targetPage: 'home' }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });



  // Default banner when no banners are available
  const defaultBanner = {
    _id: 'default',
    title: 'Capture your creativity',
    subtitle: 'at Aloka',
    description: 'Find the perfect studio space for your next creative project, photoshoot, or recording session with our premium booking platform.',
    imageUrl: '/Assets/wall.jpg',
    buttonText: null,
    buttonLink: null,
    isDefault: true
  };
  const banners = bannerResponse?.data || [];
  const activeBanners = banners.length > 0 ? banners : [defaultBanner];
  // Auto-rotate banners if multiple exist
  useEffect(() => {
    if (activeBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % activeBanners.length);
      }, 6000); // Change every 6 seconds

      return () => clearInterval(interval);
    }
  }, [activeBanners.length]);


  const handleBannerClick = async (banner) => {
    if (banner.buttonLink && !banner.isDefault) {
      // Navigate to link
      if (banner.buttonLink.startsWith('http')) {
        window.open(banner.buttonLink, '_blank');
      } else {
        window.location.href = banner.buttonLink;
      }
    }
  };

  const handlePrevBanner = () => {
    setCurrentBanner((prev) => 
      prev === 0 ? activeBanners.length - 1 : prev - 1
    );
  };

  const handleNextBanner = () => {
    setCurrentBanner((prev) => 
      (prev + 1) % activeBanners.length
    );
  };

  const currentBannerData = activeBanners[currentBanner];

  if (bannersLoading) {
    return (
      <div className="relative min-h-screen bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="max-w-7xl mx-auto py-14 text-center">
            <div className="h-8 bg-white/20 rounded-full w-64 mb-8 mx-auto"></div>
            <div className="h-16 bg-white/20 rounded w-96 mb-4 mx-auto"></div>
            <div className="h-16 bg-white/20 rounded w-80 mb-6 mx-auto"></div>
            <div className="h-6 bg-white/20 rounded w-3/4 mb-12 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-cover bg-center overflow-hidden">
      {/* Dynamic Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url('${currentBannerData?.imageUrl || '/Assets/wall.jpg'}')`,
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Banner Navigation - Only show if multiple banners */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrevBanner}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={handleNextBanner}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Banner Indicators */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentBanner 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-14 text-center">
          {/* Badge - Only show for default banner or if no custom badge */}
          {(currentBannerData?.isDefault || !currentBannerData?.subtitle) && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#892580] text-sm font-medium mb-8 animate-fade-in">
              <Star className="w-4 h-4 text-[#892580]" />
              Over 2 million studios available
            </div>
          )}

          {/* Dynamic Banner Content */}
          <div className="animate-fade-in" key={currentBanner}>
            {currentBannerData?.isDefault ? (
              // Default Layout
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                <span className="block">Capture your</span>
                <span className="block text-[#892580]">creativity</span>
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white mt-2">
                  at Aloka
                </span>
              </h1>
            ) : (
              // Dynamic Banner Layout
              <>
                {currentBannerData?.subtitle && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#892580] text-white text-sm font-medium mb-6">
                    <Star className="w-4 h-4" />
                    {currentBannerData.subtitle}
                  </div>
                )}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                  {currentBannerData?.title?.split(' ').map((word, index) => (
                    <span 
                      key={index} 
                      className={index % 2 === 1 ? "text-[#892580]" : "text-white"}
                    >
                      {word}{' '}
                    </span>
                  ))}
                </h1>
              </>
            )}

            {/* Description */}
            <p className="text-lg sm:text-xl text-white max-w-3xl mx-auto leading-relaxed mb-8">
              {currentBannerData?.description}
            </p>

            {/* Call-to-Action Button */}
            {currentBannerData?.buttonText && currentBannerData?.buttonLink && (
              <div className="mb-8">
                <button
                  onClick={() => handleBannerClick(currentBannerData)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#892580] hover:bg-[#7a1f73] text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {currentBannerData.buttonText}
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Home Search - Always Present */}
          <div className="mt-8">
            <HomeSearch />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ModernHeroSection;