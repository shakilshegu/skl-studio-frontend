// components/studios/DesktopFilterBar.jsx
import { X } from "lucide-react";


const DesktopFilterBar = ({
  studiosCount,
  hasActiveFilters,
  searchTerm,
  setSearchTerm,
  selectedLocation,
  setSelectedLocation,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  userLocation
}) => {




  return (
    <div className="hidden lg:flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-500">
          Showing {studiosCount} {studiosCount !== 1 ? 's' : ''}
        </p>
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Active filters:</span>
            <div className="flex gap-1">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm("")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {/* {selectedLocation && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                  {selectedLocation}
                  <button onClick={() => setSelectedLocation("")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )} */}
              {/* {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                  {selectedCategory?.name}
                  <button onClick={() => setSelectedCategory(null)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )} */}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
          <option value="rating">Rating</option>
          <option value="name">Name A-Z</option>
          {userLocation && <option value="distance">Nearest</option>}
        </select>
      </div>
    </div>
  );
};

export default DesktopFilterBar;