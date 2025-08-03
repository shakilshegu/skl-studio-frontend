// components/studios/MobileFilterModal.jsx
import { X, Search } from "lucide-react";

const MobileFilterModal = ({
  showMobileFilters,
  setShowMobileFilters,
  searchTerm,
  setSearchTerm,
  selectedLocation,
  setSelectedLocation,
  priceRange,
  setPriceRange,
  locationRadius,
  setLocationRadius,
  uniqueLocations,
  userLocation,
  clearFilters
}) => {
  if (!showMobileFilters) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={() => setShowMobileFilters(false)} 
      />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <button
            onClick={() => setShowMobileFilters(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile filter content */}
        <div className="space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Studio name or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
            >
              <option value="">All locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per hour: ₹{priceRange[1].toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Distance */}
          {userLocation && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance: {locationRadius}km
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={locationRadius}
                onChange={(e) => setLocationRadius(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Mobile filter actions */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={clearFilters}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Clear All
          </button>
          <button
            onClick={() => setShowMobileFilters(false)}
            className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-md hover:bg-[#2563EB]"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterModal;