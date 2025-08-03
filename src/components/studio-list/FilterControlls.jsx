// components/studios/MobileFilterControls.jsx
import { SlidersHorizontal } from "lucide-react";

const MobileFilterControls = ({
  setShowMobileFilters,
  hasActiveFilters,
  sortBy,
  setSortBy,
  userLocation
}) => {
  return (
    <div className="flex items-center justify-between mb-6 lg:hidden">
      <button
        onClick={() => setShowMobileFilters(true)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {hasActiveFilters && (
          <span className="bg-[#2563EB] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            !
          </span>
        )}
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Sort:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
          <option value="rating">Rating</option>
          <option value="name">Name</option>
          {userLocation && <option value="distance">Distance</option>}
        </select>
      </div>
    </div>
  );
};

export default MobileFilterControls;