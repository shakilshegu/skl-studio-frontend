// components/studios/StudiosContent.jsx
import { Camera } from "lucide-react";
import StudioCard from "@/components/studio/studioCard";

const StudiosContent = ({
  isLoading,
  error,
  filteredStudios,
  viewMode,
  userLocation,
  clearFilters
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#892580] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading studios...</p>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Studios</h3>
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

  if (filteredStudios.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No studios found</h3>
        <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
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
      <div className={`grid gap-6 ${
        viewMode === "grid" 
          ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" 
          : "grid-cols-1"
      }`}>
        {filteredStudios.map((studio) => (
          <div key={studio._id} className="group">
            <StudioCard 
              studio={studio} 
              showDistance={userLocation && studio.location?.lat}
              userLocation={userLocation}
              viewMode={viewMode}
            />
          </div>
        ))}
      </div>

      {/* Load More */}
      {filteredStudios.length >= 12 && (
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium">
            Load More Studios
          </button>
        </div>
      )}
    </>
  );
};

export default StudiosContent;