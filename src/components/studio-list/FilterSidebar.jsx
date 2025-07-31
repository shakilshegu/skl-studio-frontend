import { Search, MapPin, X, ChevronDown } from "lucide-react";
import GooglePlacesAutocomplete from "../GooglePlacesAutocomplete/GooglePlacesAutocomplete";

const FilterSidebar = ({
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  locationRadius,
  setLocationRadius,
  locationString,
  hasActiveFilters,
  clearFilters,
  handleLocationChange,
  handleCoordinates,
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="hidden lg:block lg:col-span-1">
      <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-[#892580] hover:text-[#892580] font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Name or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#892580] focus:border-[#892580]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <GooglePlacesAutocomplete
            value={locationString || ""}
            onChange={handleLocationChange}
            onCoordinates={handleCoordinates}
            // onChangePlacenCordinate={handleCoordinates}
            placeholder="Search for a city"
            debounceTime={300}
            className="w-full pl-2 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#892580] focus:border-[#892580] appearance-none"
          />
        </div>
        {/* Catetgory */}
        <div className="group mb-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 group-hover:text-[#892580] transition-colors duration-200">
            Activity
          </label>
          <div className="relative">
            <select
              className="w-full pl-2 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#892580] focus:border-[#892580] appearance-none"
              value={selectedCategory ?? "null"}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedCategory(value === "null" ? null : value);
              }}
            >
              <option value="null">All</option>
              {categories?.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>

            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price per hour
          </label>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>₹0</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Distance */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distance ({locationRadius}km)
          </label>
          <div className="px-2">
            <input
              type="range"
              min="1"
              max="50"
              value={locationRadius}
              onChange={(e) => setLocationRadius(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>1km</span>
              <span>50km+</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default FilterSidebar;
