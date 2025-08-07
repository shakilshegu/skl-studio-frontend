"use client";

import React, { useState } from "react";
import { Star, ChevronLeft, Check, Zap } from "lucide-react";
import CalendarAvailability from "../Calender/CalendarAvailability";
import { useQuery } from "@tanstack/react-query";
import { getAdminPackageById } from "@/services/AdminPackage/admin.package.service";
import Carousel from "../Carousel/Carousel";
import { useRouter } from "next/navigation";

const PackageDetailsPage = ({ adminPackageId }) => {
  const router = useRouter()
  // Use provided data or fallback to default
  const packageId = adminPackageId;

  const {
    data: packageData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [packageId, "adminPackageDetails"],
    queryFn: () => getAdminPackageById(packageId),
    select: (data) => data.data,
  });

  const data = packageData || [];

  // Essential photography package info
  const packageInfo = {
    ...data,
    rating: 0,
    reviews: 0,
    features: [
      "Professional photographer with 8+ years experience",
      "High-end DSLR cameras and lenses",
      "Professional lighting equipment",
    ],
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleBack = () => {
    router.push("/user/photographers");
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Carousel */}
      <Carousel />

      {/* Enhanced Header with Gradient Background */}
      <div className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 shadow-sm">
        <div className=" mx-auto px-4 py-6">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#892580] mb-4 transition-colors group"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Back to Packages</span>
          </button>

          {/* Header Content */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Left Side - Package Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="px-3 py-1 bg-[#892580]/10 text-[#892580] rounded-full text-sm font-medium">
                  Aloka Package
                </div>
                {packageInfo.eventCategory && (
                  <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                    {packageInfo.eventCategory.name}
                  </div>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {packageInfo.name}
              </h1>

              {/* Rating and Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    {packageInfo.rating}
                  </span>
                  <span className="text-gray-500">
                    ({packageInfo.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Price and Actions */}
            <div className="lg:text-right">
              <div className="flex lg:flex-col items-center lg:items-end gap-4">
                {/* Price Display */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="text-right">
                    <div className="text-4xl font-bold text-[#892580] mb-1">
                      {formatPrice(packageInfo.price)}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      Package Price
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Inclusive of all taxes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Side - Package Details */}
          <div className="xl:col-span-2 space-y-8">
            {/* Package Image with Enhanced Styling */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="aspect-video relative group">
                <img
                  src={packageInfo.photo}
                  alt={packageInfo.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=400&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Package Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#892580]/10 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#892580]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    About This Package
                  </h2>
                  <p className="text-gray-600">Everything you need to know</p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {packageInfo.description}
                </p>
              </div>
            </div>

            {/* What's Included - Enhanced */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    What's Included
                  </h3>
                  <p className="text-gray-600">Premium features and services</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {packageInfo.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-800 text-lg font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Enhanced Booking Section */}
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              {/* Calendar */}
              <div className="p-6">
                <CalendarAvailability
                  bookingType="adminPackage"
                  adminPackageId={packageId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsPage;
