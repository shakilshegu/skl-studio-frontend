import React from 'react';
import { FaStar } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";
import { IoSettings } from 'react-icons/io5';
import { useRouter } from "next/navigation";
import { useEntityReview } from '@/hooks/useMediaQueries';

const StudioCard = ({ studio, showDistance, userLocation, viewMode = "grid" }) => {
  const router = useRouter();


  const handleViewDetails = () => {
    router.push(`studios/${studio._id}?entityType=studio&entityId=${studio._id}`);
  };

  // Calculate distance if user location and studio location are available
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const distance = showDistance && studio.location?.lat && studio.location?.lng && userLocation
    ? calculateDistance(userLocation.lat, userLocation.lng, studio.location.lat, studio.location.lng)
    : null;

  // Format average rating
  const rating = studio.averageRating || 0;
  const reviewCount = studio.reviewCount || studio.reviews?.length || 0;


  
  

  if (viewMode === "list") {
    return (
      <div 
        className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg cursor-pointer overflow-hidden group"
        onClick={handleViewDetails}
      >
        <div className="flex">
          {/* Image */}
          <div className="w-80 h-48 flex-shrink-0 relative overflow-hidden">
            <img
              src={studio.images?.[0] || "/api/placeholder/320/192"}
              alt={studio.studioName || "Studio"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {studio.category?.name && (
              <div className="absolute top-3 left-3 bg-[#892580] text-white px-2 py-1 rounded-md text-xs font-medium">
                {studio.category.name}
              </div>
            )}
            {distance && (
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                {distance.toFixed(1)} km
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#892580] transition-colors">
                {studio.studioName || studio.name}
              </h3>
              <div className="flex items-center gap-1 text-sm">
                <FaStar className="text-yellow-400 w-4 h-4" />
                <span className="font-semibold text-gray-900">
                  {rating > 0 ? rating.toFixed(1) : "New"}
                </span>
                {reviewCount > 0 && (
                  <span className="text-gray-500">({reviewCount})</span>
                )}
              </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {studio?.studioDescription?.split(' ').length > 30
                ? `${studio.studioDescription.split(' ').slice(0, 30).join(' ')}...`
                : studio.studioDescription}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-gray-600">
                <FaLocationDot className="w-4 h-4 text-gray-400" />
                <span className="text-sm">
                  {studio?.address?.city || "Unknown City"}, {studio?.address?.state}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg cursor-pointer overflow-hidden group"
      onClick={handleViewDetails}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={studio.images?.[0] || "/api/placeholder/400/192"}
          alt={studio.studioName || "Studio"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Category Badge */}
        {studio.category?.name && (
          <div className="absolute top-3 left-3 bg-[#892580] text-white px-2 py-1 rounded-md text-xs font-medium">
            {studio.category.name}
          </div>
        )}

        {/* Distance Badge */}
        {distance && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
            {distance.toFixed(1)} km
          </div>
        )}

        {/* Verification Badge */}
        {studio.isVerified && (
          <div className="absolute bottom-3 right-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#892580] transition-colors line-clamp-1">
            {studio.studioName || studio.name}
          </h3>
          <div className="flex items-center gap-1 text-sm ml-2">
            <FaStar className="text-yellow-400 w-4 h-4 flex-shrink-0" />
            <span className="font-semibold text-gray-900">
              {rating > 0 ? rating.toFixed(1) : "New"}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {studio?.studioDescription?.split(' ').length > 20
            ? `${studio.studioDescription.split(' ').slice(0, 20).join(' ')}...`
            : studio.studioDescription}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-600 mb-4">
          <FaLocationDot className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm line-clamp-1">
            {studio?.address?.city || "Unknown City"}, {studio?.address?.state}
          </span>
        </div>

        {/* Reviews Count */}
        {reviewCount > 0 && (
          <div className="text-xs text-gray-500 mb-3">
            Based on {reviewCount} review{reviewCount !== 1 ? 's' : ''}
          </div>
        )}

        {/* Equipment Available */}
        <div className="flex items-center justify-between">
          <div className="">
          </div>
          
          {/* View Details Button */}
          <button className="text-[#892580] hover:text-[#892580] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudioCard;