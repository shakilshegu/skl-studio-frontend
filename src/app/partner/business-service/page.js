"use client";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchStudioById } from "@/services/PartnerService/studio.service";
import { fetchFreelancerById } from "@/services/Freelancer/freelancer.service";
import AddService from "@/partner-pages/add-service/AddService";
import AddPackages from "@/partner-pages/add-package/AddPackage";
import AddHelpers from "@/partner-pages/add-helpers/AddHelpers";
import AddEquipment from "@/partner-pages/add-equipment/AddEquipment";
import {
  Building,
  Camera,
  Settings,
  Package,
  Users,
  Wrench,
  Star,
  Zap,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

function BusinessService() {
  const router = useRouter();
  const { role, user } = useSelector((state) => state.auth);

  // Determine which API to call based on user role
  const fetchProfileData = async () => {
    if (role === "studio") {
      return await fetchStudioById();
    } else if (role === "freelancer") {
      return await fetchFreelancerById();
    }
    throw new Error("Invalid user role");
  };

  // Using React Query for data fetching
  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", role],
    queryFn: fetchProfileData,
    enabled: !!role && (role === "studio" || role === "freelancer"),
    retry: 1,
  });

  // Check if profile exists based on user role
  const hasProfile =
    role === "studio"
      ? !!profileData?.studio
      : role === "freelancer"
      ? !!profileData?.freelancer
      : false;

  // Determine profile route
  const getProfileRoute = () => {
    if (role === "studio") {
      return "/partner/profile";
    } else if (role === "freelancer") {
      return "/partner/profile";
    }
    return "/partner/profile";
  };

  // Get role-specific content
  const getRoleInfo = () => {
    if (role === "studio") {
      return {
        icon: <Building className="w-16 h-16 text-[#892580]" />,
        title: "Studio Profile Required",
        description:
          "Complete your studio profile to unlock all business management features and start offering services to clients.",
        buttonText: "Create Studio Profile",
      };
    } else if (role === "freelancer") {
      return {
        icon: <Camera className="w-16 h-16 text-[#892580]" />,
        title: "Freelancer Profile Required",
        description:
          "Complete your freelancer profile to start offering professional services and grow your independent business.",
        buttonText: "Create Freelancer Profile",
      };
    }
    return {
      icon: <Settings className="w-16 h-16 text-gray-400" />,
      title: "Profile Required",
      description:
        "Please select a valid role and create a profile to continue.",
      buttonText: "Create Profile",
      features: [],
      benefits: [],
    };
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="w-full border border-[#E1E6EF] bg-white min-h-screen rounded-lg">
      <ToastContainer />

      {/* Enhanced Header */}
      <div className=" border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Settings className="text-[#892580]" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#892580]">
                Business Service Details
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage your services, packages, equipment, and Helpers
              </p>
            </div>
          </div>

          {hasProfile && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <CheckCircle size={16} />
              Profile Active
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!hasProfile ? (
          /* Profile Required State */
          <div className="max-w-4xl mx-auto py-8">
            <div className="text-center mb-12">
              {/* Icon */}
              <div className="flex justify-center mb-6">{roleInfo.icon}</div>

              {/* Main Content */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {roleInfo.title}
              </h2>

              <p className="text-gray-600 text-sm mb-8 max-w-2xl mx-auto leading-relaxed">
                {roleInfo.description}
              </p>

              {/* CTA Button */}
              <button
                type="button"
                onClick={() => router.push(getProfileRoute())}
                className="inline-flex items-center gap-3 px-8 py-3 border border-transparent text-lg font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-[#892580] to-[#a32d96] hover:from-[#711f68] hover:to-[#892580] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#892580] transition-all duration-300 transform hover:scale-105"
              >
                {roleInfo.buttonText}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <AddService />

            <AddEquipment />
            <AddPackages />

            <AddHelpers />
          </>
        )}
      </div>
    </div>
  );
}

export default BusinessService;
