import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";

const FreelancersContent = ({
  isLoading,
  error,
  filteredFreelancers,
  viewMode,
  userLocation,
  clearFilters,
}) => {
  const router = useRouter();

  const handleCardClick = (id) => {
    router.push(
      `/user/freelancer-details/${id}?entityType=freelancer&entityId=${id}`
    );
  };


  // Format categories for display
  const getCategoryNames = (categories) => {
    if (!categories) return "";
    if (Array.isArray(categories)) {
      return categories.map((cat) => cat?.name).join(", ");
    }
    return categories;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#892580] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading freelancers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error Loading Freelancers
        </h3>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#892580] text-white rounded-md hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }
{console.log(filteredFreelancers,"00000000000000");
}
  if (filteredFreelancers?.length === 0) {
    return (
      <div className="text-center py-20">
        {/* <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-gray-400" />
        </div> */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No freelancers found
        </h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your filters or search terms
        </p>
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-[#892580] text-white rounded-md hover:bg-indigo-700"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        {filteredFreelancers.map((freelancer) => (
          <div
            key={freelancer?._id}
            className="bg-white shadow-md rounded-lg overflow-hidden border flex flex-col sm:flex-row cursor-pointer hover:shadow-lg transition-shadow sm:h-[240px]"
            onClick={() => handleCardClick(freelancer?._id)}
          >
            {/* Image container with fixed dimensions */}
            <div className="relative sm:w-1/2 h-[200px] sm:h-full flex-shrink-0">
              <img
                src={freelancer?.profileImage || defaultImage}
                alt={freelancer?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
              {/* <button
                className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-lg"
                onClick={(e) => toggleFavorite(freelancer?._id, e)}
              >
                {favorites.includes(freelancer?._id) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-500" />
                )}
              </button> */}
            </div>

            {/* Content section */}
            <div className="p-4 flex flex-col justify-between w-full sm:w-1/2 h-full">
              <div>
                <h2 className="font-semibold text-lg">{freelancer?.name}</h2>
                <div className="text-gray-500 text-sm mt-1 line-clamp-2 min-h-[40px]">
                  {freelancer?.description || "No description available"}
                </div>

                {freelancer?.categories && freelancer?.categories.length > 0 && (
                  <div className="text-[#892580] text-sm mt-2 line-clamp-2  min-h-[20px]">
                    {getCategoryNames(freelancer?.categories)}
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <div className="flex items-center text-gray-500 text-sm mt-2 gap-2">
                  <FaMapMarkerAlt />
                  <span>{freelancer?.location || "Location not specified"}</span>
                </div>

                <div className="flex items-center gap-4 text-sm mt-2 text-gray-700">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <span>{freelancer?.averageRating}</span>
                  </div>
                  <div>{freelancer?.experience} years</div>
                </div>

                <div className="font-semibold text-black mt-2">
                  ₹ {freelancer?.pricePerHour?.toLocaleString("en-IN") || 0}/hr
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {filteredFreelancers.length >= 12 && (
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium">
            Load More Freelancers
          </button>
        </div>
      )}
    </>
  );
};

export default FreelancersContent;
