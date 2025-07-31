"use client";
import { Camera, Play, Star } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import HomeSearch from "./HomeSearch";

const ModernHeroSection = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url('/Assets/wall.jpg')`,
      }}
    >
      {/* Simple overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-14 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#892580] text-sm font-medium mb-8">
            <Star className="w-4 h-4 text-[#892580]" />
            Over 2 million studios available
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            <span className="block">Capture your</span>
            <span className="block text-[#892580]">creativity</span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white mt-2">
              at Aloka
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white max-w-3xl mx-auto leading-relaxed mb-12">
            Find the perfect studio space for your next creative project,
            photoshoot, or recording session with our premium booking platform.
          </p>

          {/* Search Card */}
          <HomeSearch />
          {/* Features Grid */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-[#892580]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Premium Studios
              </h3>
              <p className="text-white">
                Access to high-end photography and video studios
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4">
                <Play className="w-8 h-8 text-[#892580]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Recording Spaces
              </h3>
              <p className="text-white">
                Professional audio and music recording facilities
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-[#892580]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Easy Booking
              </h3>
              <p className="text-white">Simple and secure booking process</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ModernHeroSection;
