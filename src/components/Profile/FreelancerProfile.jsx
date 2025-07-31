import React from "react";
import {
  FaUser,
  FaMapMarkerAlt,
  FaBriefcase,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaInfoCircle,
  FaTags
} from "react-icons/fa";

const defaultImage = "/Assets/partner/default-profile.png";

const FreelancerProfile = ({setIsEditing, isEditing, profileData }) => {
   
  const freelancerData = profileData.freelancer;

  // Function to render categories properly
  const renderCategories = () => {
    if (!freelancerData?.categories || freelancerData.categories.length === 0) {
      return "No categories specified";
    }
    
    // If categories are populated (with name property available)
    if (Array.isArray(freelancerData.categories) && freelancerData.categories[0]?.name) {
      return (
        <div className="flex flex-wrap gap-1">
          {freelancerData.categories.map((category, index) => (
            <span key={category._id || index} className="px-2 py-1 bg-[#f0e6ef] text-[#892580] rounded-full text-xs">
              {category.name}
            </span>
          ))}
        </div>
      );
    }
    
    // If categories are not populated and just IDs
    return "Categories not loaded";
  };
  
  return (
    <div className="bg-white p-10 border border-[#E1E6EF] shadow-md w-full rounded-[10px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-mulish font-bold text-[24px] leading-[24px] tracking-[0px] text-[#892580]">
          Profile
        </h1>
        <button className="px-4 py-2 rounded-full bg-[#892580] text-white text-sm font-medium">
          Freelancer
        </button>
      </div>

      {/* Freelancer Info Section */}
      <div>
        <h3 className="text-[#892580] font-semibold text-lg mb-4">
          FREELANCER INFO
        </h3> 
        <div className="relative w-16 h-16 mb-6">
          <img
            src={freelancerData?.profileImage || defaultImage}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-[#892580]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoItem
            icon={<FaUser className="text-gray-500" />}
            label="Name"
            value={freelancerData?.name}
          />
          <InfoItem
            icon={<FaCalendarAlt className="text-gray-500" />}
            label="Age"
            value={`${freelancerData?.age} years`}
          />
          <InfoItem
            icon={<FaMapMarkerAlt className="text-gray-500" />}
            label="Location"
            value={freelancerData?.location}
          />
          <InfoItem
            icon={<FaBriefcase className="text-gray-500" />}
            label="Experience"
            value={`${freelancerData?.experience} years`}
          />
          <InfoItem
            icon={<FaMoneyBillWave className="text-gray-500" />}
            label="Price Per Hour"
            value={`₹${freelancerData?.pricePerHour}`}
          />
        </div>

        {/* Description */}
        <div className="mt-6">
          <div className="flex gap-2 items-start mb-2">
            <FaInfoCircle className="text-gray-500 mt-1" />
            <strong className="text-[14px] font-medium leading-[18px] text-gray-500">
              Description
            </strong>
          </div>
          <p className="text-gray-700 text-[14px] leading-[20px] ml-6">
            {freelancerData?.description || "No description available."}
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mt-8">
        <h3 className="text-md font-semibold text-[#892580] mb-4 flex items-center">
          <FaTags className="mr-2" /> CATEGORIES
        </h3>
        <div className="flex flex-wrap gap-2 ml-6">
          {renderCategories()}
        </div>
      </div>

      {/* Portfolio Section - If you have portfolio data */}
      {freelancerData?.portfolio && freelancerData.portfolio.length > 0 && (
        <div className="mt-8">
          <h3 className="text-md font-semibold text-[#892580] mb-4">
            PORTFOLIO
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {freelancerData.portfolio.map((item, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={item.image}
                  alt={`Portfolio Item ${index + 1}`}
                  className="rounded-md shadow-md w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Button */}
      <div className="text-center mt-8">
        <button
          className="w-[150px] px-5 py-2 bg-[#892580] text-white font-semibold rounded-md shadow-md hover:bg-[#6e1e66] focus:outline-none focus:ring-2 focus:ring-[#892580] focus:ring-offset-2 transition duration-300"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

// Helper component for info items
const InfoItem = ({ icon, label, value }) => (
  <div className="flex flex-col">
    <div className="flex gap-2 items-center mb-1">
      {icon}
      <strong className="text-[14px] font-medium leading-[18px] text-gray-500">
        {label}
      </strong>
    </div>
    <div className="text-[14px] font-normal leading-[20px] ml-6">
      {value || "N/A"}
    </div>
  </div>
);

export default FreelancerProfile;