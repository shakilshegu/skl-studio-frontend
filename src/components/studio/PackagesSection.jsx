import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getStudioPackages
} from "@/services/studio/studio.service";
import PackageCard from "./PackageCard";
import { getFreelancerPackages } from "@/services/Freelancer/freelancer.service";

// Main PackagesSection Component
const PackagesSection = ({ partnerId, partnerType = "studio" }) => {
  const [cart,setCart] = useState([])
  // Fetch packages data based on partner type
  const {
    data: packageData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["packages", partnerId, partnerType],
    queryFn: () => {
      // Use the appropriate service fetch method based on partner type
      return partnerType === "studio"
        ? getStudioPackages(partnerId)
        : getFreelancerPackages(partnerId);
    },
    select: (data) => data?.packages || [],
  });


  // Loading state
  if (isLoading) {
    return (
      <div className="py-8">
        <p className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 tracking-normal mb-3">
          Packages
        </p>
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#892580]"></div>
          <p className="mt-2 text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="py-8">
        <p className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 tracking-normal mb-3">
          Packages
        </p>
        <div className="text-center py-4 text-red-500">
          Failed to load packages. Please try again later.
        </div>
      </div>
    );
  }

  // Empty state
  if (!packageData || packageData.length === 0) {
    return (
      <div className="py-8">
        <p className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 tracking-normal mb-3">
          Packages
        </p>
        <p className="text-gray-600 py-4">
          No packages available for this {partnerType} yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <p className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 tracking-normal mb-3">
          Packages
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Please select the packages required
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {packageData.map((pkg) => (
          <PackageCard
            key={pkg._id}
            id={pkg._id}
            price={pkg.price}
            title={pkg.name}
            description={pkg.description}
            photo={pkg.photo}
            services={pkg.services}
            equipments={pkg.equipments}
            cart={cart}
            setCart={setCart}
          />
        ))}
      </div>
    </div>
  );
};

export default PackagesSection;
