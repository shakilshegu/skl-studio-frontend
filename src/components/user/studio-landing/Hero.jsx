import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Camera, Video, Music } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import StudioSearch from './StudioSearch';
import { fetchActiveBanners} from '../../../services/banner.service';

const StudioHeroSection = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  // Fetch active hero banners for studio page
  const { data: bannerResponse, isLoading: bannersLoading } = useQuery({
    queryKey: ['studio-hero-banners'],
    queryFn: () => fetchActiveBanners({ position: 'hero', targetPage: 'studios' }),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });



  // Default banner when no banners are available
  const defaultBanner = {
    _id: 'default-studio',
    title: 'Find Your Perfect Creative Space',
    subtitle: 'Premium Studios Available',
    description: 'Discover and book premium studios for photography, videography, music production, and more',
    imageUrl: '/Assets/wall.jpg',
    isDefault: true
  };
  const banners = bannerResponse?.data || [];
  const activeBanners = banners.length > 0 ? banners : [defaultBanner];
  // Auto-rotate banners if multiple exist
  useEffect(() => {
    if (activeBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % activeBanners.length);
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [activeBanners.length]);


  const handleBannerClick = async (banner) => {
    if (banner.buttonLink && !banner.isDefault) {
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
      <section className="relative bg-gradient-to-br from-brand-primary via-purple-900 to-brand-800 text-white overflow-hidden min-h-[600px] animate-pulse">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            <div className="h-16 bg-white/20 rounded w-3/4 mx-auto mb-6"></div>
            <div className="h-8 bg-white/20 rounded w-2/3 mx-auto mb-8"></div>
            <div className="h-16 bg-white/20 rounded max-w-3xl mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative text-white overflow-hidden min-h-[600px]">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: currentBannerData?.imageUrl && !currentBannerData?.isDefault
            ? `url('${currentBannerData.imageUrl}')`
            : 'linear-gradient(135deg, #892580 0%, #7c3aed 50%, #6366f1 100%)'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Pattern Overlay (only for default/gradient) */}
      {(currentBannerData?.isDefault || !currentBannerData?.imageUrl) && (
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJtMzYgMzQgNiA2LTYgNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
      )}

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
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 sm:py-32">
        <div className="text-center">
          {/* Dynamic Banner Content */}
          <div className="animate-fade-in" key={currentBanner}>
            {/* Subtitle Badge */}
            {currentBannerData?.subtitle && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
                <Camera className="w-4 h-4" />
                {currentBannerData.subtitle}
              </div>
            )}

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              {currentBannerData?.isDefault ? (
                <>
                  <span className="block bg-gradient-to-r from-white to-brand-200 bg-clip-text text-transparent">
                    Find Your Perfect
                  </span>
                  <span className="block text-brand-300">Creative Space</span>
                </>
              ) : (
                <span className="bg-gradient-to-r from-white to-brand-200 bg-clip-text text-transparent">
                  {currentBannerData.title}
                </span>
              )}
            </h1>

            {/* Description */}
            <p className="text-xl sm:text-2xl text-brand-100 mb-8 max-w-3xl mx-auto">
              {currentBannerData?.description}
            </p>

            {/* CTA Button */}
            {currentBannerData?.buttonText && currentBannerData?.buttonLink && !currentBannerData?.isDefault && (
              <div className="mb-8">
                <button
                  onClick={() => handleBannerClick(currentBannerData)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary hover:bg-brand-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-xl"
                >
                  {currentBannerData.buttonText}
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Studio Search - Always Present */}
          <div className="max-w-3xl mx-auto mb-8">
            <StudioSearch />
          </div>

          {/* Studio Type Icons */}
          {currentBannerData?.isDefault && (
            <div className="flex justify-center gap-8 mt-8">
              <div className="flex flex-col items-center text-brand-200">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                  <Camera className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium">Photography</span>
              </div>
              <div className="flex flex-col items-center text-brand-200">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                  <Video className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium">Videography</span>
              </div>
              <div className="flex flex-col items-center text-brand-200">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                  <Music className="w-8 h-8" />
                </div>
                <span className="text-sm font-medium">Music</span>
              </div>
            </div>
          )}
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
    </section>
  );
};

export default StudioHeroSection;