"use client";
import React from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchStudioById } from "@/services/PartnerService/studio.service";
import { fetchFreelancerById } from "@/services/Freelancer/freelancer.service";
import CalendarPage from '@/components/partner/Calender/CalenderPage';
import { Calendar, Building, Camera, ClipboardList, Clock } from "lucide-react";

const page = () => {
  const router = useRouter();
  const { role, user } = useSelector((state) => state.auth);
  
  // Determine which API to call based on user role
  const fetchProfileData = async () => {
    if (role === 'studio') {
      return await fetchStudioById();
    } else if (role === 'freelancer') {
      return await fetchFreelancerById();
    }
    throw new Error('Invalid user role');
  };
  
  // Using React Query for data fetching
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['profile', role],
    queryFn: fetchProfileData,
    enabled: !!role && (role === 'studio' || role === 'freelancer'),
    retry: 1
  });
      
  // Check if profile exists based on user role
  const hasProfile = role === 'studio'
    ? !!profileData?.studio
    : role === 'freelancer'
      ? !!profileData?.freelancer
      : false;
  
  // Determine profile route
  const getProfileRoute = () => {
    if (role === 'studio') {
      return '/partner/profile';
    } else if (role === 'freelancer') {
      return '/partner/profile';
    }
    return '/partner/profile';
  };

  // Get role-specific content
  const getRoleInfo = () => {
    if (role === 'studio') {
      return {
        icon: <Building className="w-16 h-16 text-[#892580]" />,
        title: "Studio Profile Required",
        description: "Complete your studio profile to access your calendar and schedule appointments with clients.",
        buttonText: "Create Studio Profile",
        calendarContext: "Set up your studio profile to manage your schedule and availability for client bookings."
      };
    } else if (role === 'freelancer') {
      return {
        icon: <Camera className="w-16 h-16 text-[#892580]" />,
        title: "Freelancer Profile Required", 
        description: "Complete your freelancer profile to access your calendar and manage your photography schedule.",
        buttonText: "Create Freelancer Profile",
        calendarContext: "Establish your freelance presence to manage your availability and schedule client sessions."
      };
    }
    return {
      icon: <ClipboardList className="w-16 h-16 text-gray-400" />,
      title: "Profile Required",
      description: "Please select a valid role and create a profile to access your calendar.",
      buttonText: "Create Profile",
      calendarContext: "Manage your schedule and appointments."
    };
  };

  const roleInfo = getRoleInfo();

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full min-h-screen border border-gray-300 rounded-xl bg-white">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Calendar className="text-[#892580]" size={24} />
            <h1 className="text-xl font-semibold text-[#892580]">Calendar</h1>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            Manage your schedule and availability
          </p>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#892580]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen border border-gray-300 rounded-xl bg-white">
      <ToastContainer />
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Calendar className="text-[#892580]" size={24} />
          <h1 className="text-xl font-semibold text-[#892580]">Calendar</h1>
        </div>
        <p className="text-gray-600 text-sm mt-1">
          Manage your schedule and availability
        </p>
      </div>

      {/* Content */}
      {!hasProfile ? (
        <div className="p-8">
          {/* Profile Required State */}
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="text-center max-w-md mx-auto">
              
              {/* Icon */}
              <div className="flex justify-center mb-6">
                {roleInfo.icon}
              </div>

              {/* Main Content */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {roleInfo.title}
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {roleInfo.description}
              </p>

              {/* CTA Button */}
              <button
                type="button"
                onClick={() => router.push(getProfileRoute())}
                className="inline-flex items-center gap-2 px-8 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-[#892580] to-[#a32d96] hover:from-[#711f68] hover:to-[#892580] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#892580] transition-all duration-300 transform hover:scale-105"
              >
                <Clock className="w-5 h-5" />
                {roleInfo.buttonText}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Calendar Component */
        <div className="p-6">
          <CalendarPage />
        </div>
      )}
    </div>
  );
};

export default page;