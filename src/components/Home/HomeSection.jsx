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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#2563EB] text-sm font-medium mb-8">
            <Star className="w-4 h-4 text-[#2563EB]" />
            Over 2 million studios available
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            <span className="block">Capture your</span>
            <span className="block text-[#2563EB]">creativity</span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white mt-2">
              at SKL
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white max-w-3xl mx-auto leading-relaxed mb-12">
            Find the perfect studio space for your next creative project,
            photoshoot, or recording session with our premium booking platform.
          </p>

          {/* Search Card */}
          <HomeSearch />

        </div>
      </div>
    </div>
  );
};

export default ModernHeroSection;