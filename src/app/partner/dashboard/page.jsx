"use client";
import React from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchStudioById } from "@/services/PartnerService/studio.service";
import { fetchFreelancerById } from "@/services/Freelancer/freelancer.service";
import { Building, Camera, ClipboardList, Clock, LayoutDashboard } from "lucide-react";
import DashboardPage from "@/components/partner/Dashboard/Dashboard";

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

  // Get role-specific content for profile required state
  const getRoleInfo = () => {
    if (role === 'studio') {
      return {
        icon: <Building className="w-16 h-16 text-[#892580]" />,
        title: "Studio Profile Required",
        description: "Complete your studio profile to access your dashboard and manage your photography business effectively.",
        buttonText: "Create Studio Profile",
        dashboardContext: "Set up your studio profile to access business analytics, manage bookings, and view your performance metrics."
      };
    } else if (role === 'freelancer') {
      return {
        icon: <Camera className="w-16 h-16 text-[#892580]" />,
        title: "Freelancer Profile Required", 
        description: "Complete your freelancer profile to access your dashboard and manage your photography services.",
        buttonText: "Create Freelancer Profile",
        dashboardContext: "Establish your freelance presence to track your bookings, earnings, and client interactions."
      };
    }
    return {
      icon: <ClipboardList className="w-16 h-16 text-gray-400" />,
      title: "Profile Required",
      description: "Please select a valid role and create a profile to access your dashboard.",
      buttonText: "Create Profile",
      dashboardContext: "Manage your business and track your performance."
    };
  };

  const roleInfo = getRoleInfo();

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full min-h-screen border border-gray-300 rounded-xl bg-white">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#892580]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen border border-gray-300 rounded-xl bg-white">
      <ToastContainer />

      {/* Content */}
      {!hasProfile ? (
        <div className="p-8">
          {/* Welcome Message for Profile Required */}
          <div className="mb-8 bg-gradient-to-r from-[#892580] to-[#a32d96] rounded-xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-full">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  Welcome to Aloka, {user?.name || 'Partner'}! 👋
                </h1>
                <p className="text-white text-opacity-90">
                  {role === 'studio' 
                    ? "Get started by creating your studio profile to unlock all dashboard features and manage your photography business."
                    : "Get started by creating your freelancer profile to access your dashboard and manage your photography services."
                  }
                </p>
              </div>
            </div>
          </div>

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
                <LayoutDashboard className="w-5 h-5" />
                {roleInfo.buttonText}
              </button>

              {/* Additional Info */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {roleInfo.dashboardContext}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
      <DashboardPage/>
      )}
    </div>
  );
};

export default page;