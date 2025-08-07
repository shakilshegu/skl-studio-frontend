"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, MapPin, Star, Briefcase, UserRound } from "lucide-react";
import { fetchSimilarFreelancers } from "@/services/Freelancer/freelancer.service";
import { useRouter } from "next/navigation";

export default function SimilarFreelancer({ categoryId }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const cardsPerPage = 2;

  // TanStack Query hook
  const { 
    data, 
    isLoading, 
    error, 
    isError 
  } = useQuery({
    queryKey: ['similar-freelancers', categoryId],
    queryFn: () => fetchSimilarFreelancers(categoryId),
    enabled: !!categoryId, // Only run query if categoryId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  const freelancers = data?.similarFreelancers || [];
  const totalPages = Math.ceil(freelancers.length / cardsPerPage);

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentCards = freelancers.slice(
    currentPage * cardsPerPage,
    currentPage * cardsPerPage + cardsPerPage
  );

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };
  const router = useRouter()
  const handleView = (id) => {
    router.push(
      `/user/freelancer-details/${id}?entityType=freelancer&entityId=${id}`
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="px-4 py-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Similar Freelancers</h2>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {[1, 2].map((index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 bg-white rounded-2xl border border-[#1505131A] animate-pulse">
              <div className="w-full md:w-1/2 h-48 md:h-60 bg-gray-200 rounded-2xl md:rounded-l-2xl md:rounded-r-none"></div>
              <div className="flex flex-col p-4 justify-between w-full">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="px-4 py-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Similar Freelancers</h2>
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">Error loading similar freelancers</p>
          <p className="text-gray-500 text-sm">{error?.message}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!freelancers.length) {
    return (
      <div className="px-4 py-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Similar Freelancers</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No similar freelancers found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Similar Freelancers</h2>

      <div className="relative">
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {currentCards.map((freelancer, index) => (
            <div
              key={freelancer._id || index}
              className="flex flex-col md:flex-row gap-4 bg-white rounded-2xl cursor-pointer border border-[#1505131A]"
            >
              <div className="relative w-full md:w-1/2">
                <img
                  src={freelancer.profileImage}
                  alt={freelancer.name}
                  className="w-full h-30 sm:h-48 md:h-70 lg:h-60 object-cover rounded-2xl md:rounded-l-2xl md:rounded-r-none"
                />
              </div>
              <div className="flex flex-col p-4 justify-between w-full text-sm text-gray-600">
                <div className="flex flex-col gap-3">
                  {/* Header Section */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-base md:text-lg text-gray-800">{freelancer.name}</h3>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        Age {freelancer.age}
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs md:text-sm mt-1 line-clamp-2">
                      {freelancer.description}
                    </div>
                  </div>

                  {/* Categories Section */}
                  {freelancer.categories && freelancer.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {freelancer.categories.slice(0, 2).map((category, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                        >
                          {typeof category === 'object' ? category.name : category}
                        </span>
                      ))}
                      {freelancer.categories.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{freelancer.categories.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 gap-2">
                    {/* Location */}
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#892580] flex-shrink-0" />
                      <span className="text-xs md:text-sm truncate">{freelancer.location}</span>
                    </div>

                    {/* Rating and Reviews */}
                    {freelancer.averageRating && (
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-orange-500 flex-shrink-0" />
                        <span className="text-xs md:text-sm">
                          {freelancer.averageRating} 
                          {freelancer.totalReviews && (
                            <span className="text-gray-400"> ({freelancer.totalReviews} reviews)</span>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Experience */}
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-gray-500 flex-shrink-0" />
                      <span className="text-xs md:text-sm">{freelancer.experience} years experience</span>
                    </div>

                    {/* Availability Status */}
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${freelancer.isAvailable !== false ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-xs md:text-sm">
                        {freelancer.isAvailable !== false ? 'Available' : 'Busy'}
                      </span>
                    </div>
                  </div>

                  {/* Pricing and Action Section */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <div className="text-[#892580] font-bold text-base md:text-lg">
                        ₹ {freelancer.pricePerHour?.toLocaleString()}
                        <span className="text-gray-500 font-normal text-xs md:text-sm"> /hr</span>
                      </div>
                      {freelancer.minBookingHours && (
                        <div className="text-xs text-gray-400">
                          Min. {freelancer.minBookingHours}hrs booking
                        </div>
                      )}
                    </div>
                    
                    {/* Quick Action Buttons */}
                    <div className="flex gap-2">
                      <button onClick={()=>handleView(freelancer._id)} className="px-3 py-1 text-xs border border-[#892580] text-[#892580] rounded hover:bg-[#892580] hover:text-white transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Only show if more than one page */}
        {totalPages > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-0 -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100 z-10"
            >
              <ArrowLeft size={18} className="text-[#892580]" />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-0 -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100 z-10"
            >
              <ArrowRight size={18} className="text-[#892580]" />
            </button>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }).map((_, index) => (
                <span
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-3 h-3 rounded-full cursor-pointer ${
                    index === currentPage ? "bg-[#892580]" : "bg-gray-300"
                  }`}
                ></span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}