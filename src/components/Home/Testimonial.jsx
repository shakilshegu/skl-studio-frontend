'use client'
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote, Star, Play, Pause } from "lucide-react";

const testimonialsData = [
  {
    rating: 5,
    text: "Aloka transformed our creative vision into reality! The studio quality exceeded our expectations, and the booking process was seamless. The professional equipment and lighting setup made our photoshoot absolutely perfect.",
    name: "Arlene McCoy",
    company: "Creative Director, Golio",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    project: "Fashion Photography"
  },
  {
    rating: 5,
    text: "Outstanding service and incredible attention to detail. The team went above and beyond to ensure our music video production was flawless. The acoustic quality of the recording studio is world-class!",
    name: "John Rodriguez",
    company: "Music Producer, SoundWave Studios",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    project: "Music Video Production"
  },
  {
    rating: 5,
    text: "Absolutely wonderful experience from start to finish. The studio space was immaculate, well-equipped, and the staff was incredibly helpful. Our corporate shoot went smoothly and the results were phenomenal.",
    name: "Sarah Williams",
    company: "Marketing Manager, TechCorp",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    project: "Corporate Photography"
  },
  {
    rating: 4,
    text: "Professional setup with top-notch equipment. The booking system made it easy to schedule our podcast recording sessions. Great value for money and excellent customer support throughout.",
    name: "Michael Chen",
    company: "Podcast Host, TechTalk",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    project: "Podcast Recording"
  },
  {
    rating: 5,
    text: "The wedding photography session at SKL was magical! The studio's ambiance and professional lighting created the perfect romantic atmosphere. Highly recommend for special occasions.",
    name: "Emma Thompson",
    company: "Wedding Planner, Blissful Events",
    image: "https://randomuser.me/api/portraits/women/55.jpg",
    project: "Wedding Photography"
  }
];

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState('next');

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isPlaying]);

  const handlePrev = () => {
    setDirection('prev');
    setCurrentIndex((prev) =>
      prev === 0 ? testimonialsData.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setDirection('next');
    setCurrentIndex((prev) =>
      prev === testimonialsData.length - 1 ? 0 : prev + 1
    );
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 'next' : 'prev');
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  const currentTestimonial = testimonialsData[currentIndex];

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
            Discover why creative professionals choose Aloka for their studio needs
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
                  <div className="text-2xl font-bold text-[#892580]">500+</div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#892580]">4.9</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#892580]">1000+</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
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

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonialsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-[#892580] w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
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

              {/* Project Badge */}
              <div className="inline-block mb-4">
                <span className="bg-[#892580]/10 text-[#892580] text-xs font-medium px-3 py-1 rounded-full">
                  {currentTestimonial.project}
                </span>
              </div>

              {/* Rating */}
              <div className="flex mb-6 gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      index < currentTestimonial.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600 font-medium">
                  {currentTestimonial.rating}.0
                </span>
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 mb-8 text-base leading-relaxed italic">
                "{currentTestimonial.text}"
              </blockquote>

              {/* Client Info */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    {currentTestimonial.name}
                  </div>
                  <p className="text-[#892580] text-sm font-medium">
                    {currentTestimonial.company}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
                <div 
                  className="h-full bg-[#892580] transition-all duration-100 ease-linear"
                  style={{
                    width: isPlaying ? '100%' : '0%',
                    animation: isPlaying ? 'progress 5s linear infinite' : 'none'
                  }}
                />
              </div>
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