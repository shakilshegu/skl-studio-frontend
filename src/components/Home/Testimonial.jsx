'use client'
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Quote, Play, Pause, Star, Crown } from "lucide-react";
import { fetchTestimonials } from "@/services/Home/home.service";

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // TanStack Query to fetch testimonials
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['active-testimonials'],
    queryFn: fetchTestimonials,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });

  // Extract testimonials from response and filter active ones
  const testimonials = data?.data || [];
  const activeTestimonials = testimonials
    .filter(testimonial => testimonial.isActive)
    .sort((a, b) => {
      // Sort by featured first, then by order, then by creation date
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      if (a.order !== b.order) return a.order - b.order;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || activeTestimonials.length === 0) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isPlaying, activeTestimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? activeTestimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === activeTestimonials.length - 1 ? 0 : prev + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {rating}.0
        </span>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Loading testimonials...
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="flex gap-4 mb-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="animate-pulse">
              <div className="bg-gray-200 rounded-3xl h-96"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <div className="text-red-500 mb-4">
            Failed to load testimonials: {error?.message}
          </div>
        </div>
      </section>
    );
  }

  // No testimonials state - don't render anything
  if (activeTestimonials.length === 0) {
    return null;
  }

  const currentTestimonial = activeTestimonials[currentIndex];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#892580]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#892580]/3 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover why creative professionals choose us for their needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Controls and Stats */}
          <div className="text-left space-y-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                Trusted by creative professionals worldwide
              </h3>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#892580]">{activeTestimonials.length}+</div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#892580]">
                    {activeTestimonials.length > 0 
                      ? (activeTestimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / activeTestimonials.length).toFixed(1)
                      : '5.0'
                    }
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#892580]">
                    {activeTestimonials.filter(t => t.isFeatured).length}
                  </div>
                  <div className="text-sm text-gray-600">Featured</div>
                </div>
              </div>
            </div>

            {/* Navigation Controls - Only show if multiple testimonials */}
            {activeTestimonials.length > 1 && (
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 flex items-center justify-center bg-white border-2 border-[#892580]/20 rounded-full hover:border-[#892580] hover:bg-[#892580] hover:text-white transition-all duration-300 shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleNext}
                  className="w-12 h-12 flex items-center justify-center bg-white border-2 border-[#892580]/20 rounded-full hover:border-[#892580] hover:bg-[#892580] hover:text-white transition-all duration-300 shadow-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  onClick={toggleAutoPlay}
                  className="w-12 h-12 flex items-center justify-center bg-[#892580] text-white rounded-full hover:bg-[#892580]/90 transition-all duration-300 shadow-md"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
              </div>
            )}

            {/* Dots Indicator - Only show if multiple testimonials */}
            {activeTestimonials.length > 1 && (
              <div className="flex gap-2">
                {activeTestimonials.map((testimonial, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-[#892580] w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  >
                    {testimonial.isFeatured && (
                      <Crown className="w-2 h-2 text-yellow-500 absolute -top-1 -right-1" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Testimonial Card */}
          <div className="relative">
            <div 
              key={currentIndex}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden transition-all duration-500 animate-in slide-in-from-right-2"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#892580]/10 to-transparent rounded-bl-3xl"></div>
              <Quote className="absolute top-6 right-6 text-[#892580]/20 w-12 h-12" />

              {/* Featured Badge */}
              {currentTestimonial.isFeatured && (
                <div className="absolute top-4 left-4">
                  <div className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                    <Crown className="w-3 h-3" />
                    Featured
                  </div>
                </div>
              )}

              {/* Rating */}
              {renderStars(currentTestimonial.rating || 5)}

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 mb-8 text-base leading-relaxed italic">
                "{currentTestimonial.description}"
              </blockquote>

              {/* Client Info */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={currentTestimonial.imageUrl !== "placeholder" 
                      ? currentTestimonial.imageUrl 
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentTestimonial.name)}&background=892580&color=ffffff&size=56`
                    }
                    alt={currentTestimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentTestimonial.name)}&background=892580&color=ffffff&size=56`;
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    {currentTestimonial.name}
                  </div>
                  {(currentTestimonial.designation || currentTestimonial.company) && (
                    <p className="text-[#892580] text-sm font-medium">
                      {currentTestimonial.designation}
                      {currentTestimonial.designation && currentTestimonial.company && ', '}
                      {currentTestimonial.company}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs">
                    {new Date(currentTestimonial.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Progress Bar - Only show if multiple testimonials and auto-playing */}
              {activeTestimonials.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
                  <div 
                    className="h-full bg-[#892580] transition-all duration-100 ease-linear"
                    style={{
                      width: isPlaying ? '100%' : '0%',
                      animation: isPlaying ? 'progress 5s linear infinite' : 'none'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#892580] rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-[#892580] rounded-full opacity-30"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        .animate-in {
          animation-duration: 0.5s;
          animation-fill-mode: both;
        }
        
        .slide-in-from-right-2 {
          animation-name: slideInFromRight;
        }
        
        @keyframes slideInFromRight {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonial;