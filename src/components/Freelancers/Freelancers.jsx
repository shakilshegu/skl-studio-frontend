"use client";

import FreelancerHeader from "./FreelancerHeader";
import MobileFilterModal from "../studio-list/MobileFilter";
import FilterSidebar from "../studio-list/FilterSidebar";
import MobileFilterControls from "../studio-list/FilterControlls";
import DesktopFilterBar from "../studio-list/DesktopFilter";
import FreelancersContent from "./FreelancersContent";
import { useFreelancersData } from "@/hooks/useFreelancerData";


// Default image for fallback
const defaultImage = "/Assets/Freelancer1.jpeg";

const Freelancers = ({  
       
           
            handleChangeCoordinates,
            handleLocation,
            locationString,
            categories,
                
}) => {

  const {
    // State
    searchTerm,
    setSearchTerm,
    selectedLocation,
    setSelectedLocation,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    userLocation,
    locationRadius,
    setLocationRadius,
    showMobileFilters,
    setShowMobileFilters,
    viewMode,
    setViewMode,
    
    // Computed
    filteredFreelancers,
    uniqueLocations,
    hasActiveFilters,
    
    // Actions
    clearFilters,
    
    // Query state
    isLoading,
    error
  } = useFreelancersData();

  

  return (
    <div className="mt-10 ">
      <div className="">
        <FreelancerHeader
          freelancersCount={filteredFreelancers.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedCategory={selectedCategory} // Pass selected category for display
        />

        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Desktop Sidebar Filters */}
            <FilterSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleLocationChange={handleLocation}
            handleCoordinates={handleChangeCoordinates}
            locationString={locationString}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            locationRadius={locationRadius}
            setLocationRadius={setLocationRadius}
            hasActiveFilters={hasActiveFilters}
            clearFilters={clearFilters}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            />

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Mobile Filter Button + Sort */}
              <MobileFilterControls
                setShowMobileFilters={setShowMobileFilters}
                hasActiveFilters={hasActiveFilters}
                sortBy={sortBy}
                setSortBy={setSortBy}
                userLocation={userLocation}
                selectedCategory={selectedCategory} // Pass for display
              />

              {/* Desktop Sort */}
              <DesktopFilterBar
                studiosCount={filteredFreelancers.length}
                hasActiveFilters={hasActiveFilters}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                userLocation={userLocation}
                selectedCategory={selectedCategory} // Pass for display
              />

              {/* Content */}
              <FreelancersContent
                isLoading={isLoading}
                error={error}
                filteredFreelancers={filteredFreelancers}
                viewMode={viewMode}
                userLocation={userLocation}
                clearFilters={clearFilters}
                selectedCategory={selectedCategory} // Pass for display
              />
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        <MobileFilterModal
          showMobileFilters={showMobileFilters}
          setShowMobileFilters={setShowMobileFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          locationRadius={locationRadius}
          setLocationRadius={setLocationRadius}
          uniqueLocations={uniqueLocations}
          userLocation={userLocation}
          clearFilters={clearFilters}
          selectedCategory={selectedCategory} // Pass for display
        />
      </div>
    </div>
  );
};

export default Freelancers;



// "use client";
// import { useFreelancersData } from "@/hooks/useFreelancerData";
// import FreelancerHeader from "./FreelancerHeader";
// import MobileFilterModal from "../studio-list/MobileFilter";
// import FilterSidebar from "../studio-list/FilterSidebar";
// import MobileFilterControls from "../studio-list/FilterControlls";
// import DesktopFilterBar from "../studio-list/DesktopFilter";
// import FreelancersContent from "./FreelancersContent";

// // Default image for fallback
// const defaultImage = "/Assets/Freelancer1.jpeg";

// const Freelancers = ({  
//   selectedCategoryId, 
//   setSelectedCategory,
//   selectedCategory ,
//   location
// }) => {
//   const {
//     // State
//     searchTerm,
//     setSearchTerm,
//     selectedLocation,
//     setSelectedLocation,
//     priceRange,
//     setPriceRange,
//     sortBy,
//     setSortBy,
//     userLocation,
//     locationRadius,
//     setLocationRadius,
//     showMobileFilters,
//     setShowMobileFilters,
//     viewMode,
//     setViewMode,

//     // Computed
//     filteredFreelancers,
//     uniqueLocations,
//     hasActiveFilters,

//     // Actions
//     clearFilters,

//     // Query state
//     isLoading,
//     error,
//   } = useFreelancersData(selectedCategoryId); // Pass selectedCategoryId to hook

//   return (
//     <div className="mt-10 ">
//       <div className="">
//         <FreelancerHeader
//           freelancersCount={filteredFreelancers.length}
//           viewMode={viewMode}
//           setViewMode={setViewMode}
//           selectedCategory={selectedCategory} // Pass selected category for display
//         />

//         <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="lg:grid lg:grid-cols-4 lg:gap-8">
//             {/* Desktop Sidebar Filters */}
//             <FilterSidebar
//               searchTerm={searchTerm}
//               setSearchTerm={setSearchTerm}
//               selectedLocation={selectedLocation}
//               setSelectedLocation={setSelectedLocation}
//               priceRange={priceRange}
//               setPriceRange={setPriceRange}
//               locationRadius={locationRadius}
//               setLocationRadius={setLocationRadius}
//               uniqueLocations={uniqueLocations}
//               hasActiveFilters={hasActiveFilters}
//               clearFilters={clearFilters}
//               userLocation={location||userLocation}
//               selectedCategory={selectedCategory} // Pass for display
//             />

//             {/* Main Content */}
//             <div className="lg:col-span-3">
//               {/* Mobile Filter Button + Sort */}
//               <MobileFilterControls
//                 setShowMobileFilters={setShowMobileFilters}
//                 hasActiveFilters={hasActiveFilters}
//                 sortBy={sortBy}
//                 setSortBy={setSortBy}
//                 userLocation={location||userLocation}
//                 selectedCategory={selectedCategory} // Pass for display
//               />

//               {/* Desktop Sort */}
//               <DesktopFilterBar
//                 studiosCount={filteredFreelancers.length}
//                 hasActiveFilters={hasActiveFilters}
//                 searchTerm={searchTerm}
//                 setSearchTerm={setSearchTerm}
//                 selectedLocation={selectedLocation}
//                 setSelectedLocation={setSelectedLocation}
//                 setSelectedCategory={setSelectedCategory}
//                 sortBy={sortBy}
//                 setSortBy={setSortBy}
//                 userLocation={location||userLocation}
//                 selectedCategory={selectedCategory} // Pass for display
//               />

//               {/* Content */}
//               <FreelancersContent
//                 isLoading={isLoading}
//                 error={error}
//                 filteredFreelancers={filteredFreelancers}
//                 viewMode={viewMode}
//                 userLocation={location|userLocation}
//                 clearFilters={clearFilters}
//                 selectedCategory={selectedCategory} // Pass for display
//               />
//             </div>
//           </div>
//         </div>

//         {/* Mobile Filter Modal */}
//         <MobileFilterModal
//           showMobileFilters={showMobileFilters}
//           setShowMobileFilters={setShowMobileFilters}
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           selectedLocation={selectedLocation}
//           setSelectedLocation={setSelectedLocation}
//           priceRange={priceRange}
//           setPriceRange={setPriceRange}
//           locationRadius={locationRadius}
//           setLocationRadius={setLocationRadius}
//           uniqueLocations={uniqueLocations}
//           userLocation={userLocation}
//           clearFilters={clearFilters}
//           selectedCategory={selectedCategory} // Pass for display
//         />
//       </div>
//     </div>
//   );
// };

// export default Freelancers;