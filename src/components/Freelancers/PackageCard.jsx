import { ArrowRight, CheckCircle, Eye, Heart, Info, ShoppingCart, Sparkles, Star, Users } from "lucide-react";
import { useRouter } from "next/router";
import React, { useState } from "react";

const PackageCard = ({ pkg, index ,toggleFavorite,favoritePackages,router}) => {

  const [hoveredPackage, setHoveredPackage] = useState(null);
  const isHovered = hoveredPackage === pkg._id;
  const isFavorite = favoritePackages.has(pkg._id);
  const handleCardClick = (id) => {
    router.push(`/user/admin-packages/${id}?bookingType=admin-package&packageId=${id}`);
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden h-full ${
        isHovered
          ? "border-[#892580] shadow-2xl transform -translate-y-2"
          : "border-gray-200 hover:border-gray-300 hover:shadow-xl"
      }`}
      onMouseEnter={() => setHoveredPackage(pkg._id)}
      onMouseLeave={() => setHoveredPackage(null)}
      onClick={() => handleCardClick(pkg._id)}
    >
      {/* Featured Badge for First Package */}
      {index === 0 && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          FEATURED
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={(e) => toggleFavorite(pkg._id, e)}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
          isFavorite
            ? "bg-red-500 text-white"
            : "bg-white/80 text-gray-600 hover:text-red-500"
        }`}
      >
        <Heart
          className="w-4 h-4"
          fill={isFavorite ? "currentColor" : "none"}
        />
      </button>

      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={pkg.photo || "/api/placeholder/400/192"}
          alt={pkg.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          onError={(e) => {
            e.target.src = "/api/placeholder/400/192";
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Price Badge */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="text-2xl font-bold text-[#892580]">
            ₹{pkg.price?.toLocaleString("en-IN")}
            <span className="text-sm text-gray-600 font-normal">/hr</span>
          </div>
        </div>

        {/* Category Badge */}
        {pkg.eventCategory && (
          <div className="absolute bottom-4 right-4 bg-[#892580] text-white px-3 py-1 rounded-full text-xs font-medium">
            {pkg.eventCategory.name}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#892580] transition-colors line-clamp-1 flex-1">
            {pkg.name}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Add info modal logic here
            }}
            className="p-1 text-gray-400 hover:text-[#892580] transition-colors ml-2"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
          {pkg.description ||
            "Premium package with comprehensive services for your event needs."}
        </p>

        {/* Features */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>Professional equipment included</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>24/7 customer support</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mb-6 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>89 bookings</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span>4.8 rating</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick(pkg._id);
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              isHovered
                ? "bg-[#892580] text-white shadow-lg transform scale-105"
                : "bg-[#892580]/10 text-[#892580] hover:bg-[#892580] hover:text-white"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Book Now
            <ArrowRight
              className={`w-4 h-4 transition-transform ${
                isHovered ? "translate-x-1" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
