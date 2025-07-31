
"use client";
import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaCreditCard,
  FaVenusMars,
  FaRegCalendarAlt,
  FaRupeeSign,
  FaCreativeCommonsSampling,
} from "react-icons/fa";

// Import the FreelancerProfile component - update the path as needed
import FreelancerProfile from "./FreelancerProfile";

const card1 = "/Assets/card1.svg";
const card = "/Assets/card2.svg";
const st5 = "/Assets/st5.png";

const Profile = ({setIsEditing, isEditing, role, profileData }) => {
  

  return role === "studio" ? (
    <div className="bg-white p-10 border border-[#E1E6EF] shadow-md w-full rounded-[10px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-mulish font-bold text-[24px] leading-[24px] tracking-[0px] text-[#892580]">
          Profile
        </h1>
        <button className="px-4 py-2 rounded-full bg-[#892580] text-white text-sm font-medium">
          Studio Owner
        </button>
      </div>

      {/* Studio Info Section */}
      <div>
        <h3 className="text-[#892580] font-semibold text-lg mb-4">
          STUDIO INFO
        </h3>
        <div className="relative w-16 h-16 mb-6">
          <img
            src={profileData?.studio?.studioLogo || st5}
            alt="Studio Logo"
            className="w-16 h-16 rounded-full object-cover border-2 border-[#892580]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoItem
            icon={<FaUser className="text-gray-500" />}
            label="Studio Name"
            value={profileData?.studio?.studioName}
          />
          <InfoItem
            icon={<FaEnvelope className="text-gray-500" />}
            label="Studio Email Address"
            value={profileData?.studio?.studioEmail}
          />
          <InfoItem
            icon={<FaPhone className="text-gray-500" />}
            label="Studio Mobile Number"
            value={profileData?.studio?.studioMobileNumber}
          />
          <InfoItem
            icon={<FaBuilding className="text-gray-500" />}
            label="How old is your studio?"
            value={
              profileData?.studio?.studioStartedDate
                ? new Date(
                    profileData?.studio?.studioStartedDate
                  ).toLocaleDateString()
                : "N/A"
            }
          />
          <InfoItem
            icon={<FaCreditCard className="text-gray-500" />}
            label="GST Number"
            value={profileData?.studio?.gstNumber || "N/A"}
          />

          <InfoItem
            icon={<FaCreativeCommonsSampling className="text-gray-500" />}
            label="Category"
            value={profileData?.studio?.category?.name || "N/A"}
          />

          <InfoItem
            icon={<FaRupeeSign className="text-gray-500" />}
            label="Price / Hour"
            value={profileData?.studio?.pricePerHour || "N/A"}
          />
        <div className="">
          <div className="flex gap-2 items-start mb-2">
            <FaMapMarkerAlt className="text-gray-500 mt-1" />
            <strong className="text-[14px] font-medium leading-[18px] text-gray-500">
              Address
            </strong>
          </div>
          <p className="text-[14px] leading-[20px] ml-6">
            {`${profileData?.studio?.address?.addressLineOne || ""} ${
              profileData?.studio?.address?.addressLineTwo || ""
            }, ${profileData?.studio?.address?.city || ""}, ${
              profileData?.studio?.address?.state || ""
            }, ${profileData?.studio?.address?.country || ""} - ${
              profileData?.studio?.address?.pinCode || ""
            }`}
          </p>
        </div>
        </div>

        

        {/* Address Section */}

        {/* Description */}
        <div className="mt-6">
          <p className="text-gray-700 text-[14px] leading-[20px]">
            {profileData?.studio?.studioDescription ||
              "No description available."}
          </p>
        </div>
      </div>

      {/* Studio Images Section */}
      <div className="mt-8">
        <h3 className="text-md font-semibold text-[#892580] mb-4">
          STUDIO IMAGES
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(profileData?.studio?.images?.map((image, index) => (
            <div key={index} className="relative aspect-video">
              <img
                src={image}
                alt={`Studio Image ${index + 1}`}
                className="rounded-md shadow-md w-full h-full object-cover"
              />
            </div>
          ))) || (
            <div className="text-gray-500 text-center col-span-2">
              No images available
            </div>
          )}
        </div>
      </div>

      {/* Owner Info Section */}
      <div className="mt-8">
        <h3 className="text-md font-semibold text-[#892580] mb-4">
          OWNER INFO
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoItem
            icon={<FaUser className="text-gray-500" />}
            label="Owner Name"
            value={profileData?.studio?.owner?.name}
          />
          <InfoItem
            icon={<FaEnvelope className="text-gray-500" />}
            label="Owner Email"
            value={profileData?.studio?.owner?.email}
          />
          <InfoItem
            icon={<FaPhone className="text-gray-500" />}
            label="Owner Mobile Number"
            value={profileData?.studio?.owner?.mobileNumber}
          />
          <InfoItem
            icon={<FaVenusMars className="text-gray-500" />}
            label="Gender"
            value={profileData?.studio?.owner?.gender}
          />
          <InfoItem
            icon={<FaRegCalendarAlt className="text-gray-500" />}
            label="Date of Birth"
            value={
              profileData?.studio?.owner?.dateOfBirth
                ? new Date(
                    profileData.studio.owner.dateOfBirth
                  ).toLocaleDateString()
                : "N/A"
            }
          />
        </div>
      </div>

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
  ) : (
    <FreelancerProfile setIsEditing={setIsEditing} isEditing={isEditing} profileData={profileData} />
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

export default Profile;