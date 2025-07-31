import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import Equipment from '@/components/Equipment/Equipment';
import { getStudioEquipments} from "@/services/studio/studio.service";
import { getFreelancerEquipments } from '@/services/Freelancer/freelancer.service';

const EquipmentSection = ({ partnerId, partnerType = "studio" }) => {
  const [selectedItems, setSelectedItems] = useState({});
  // Equipment query based on partner type
  const { 
    data: equipmentData = [],
    isLoading,
    isError 
  } = useQuery({
    queryKey: ["equipment", partnerId, partnerType],
    queryFn: async () => {
      // Use the appropriate service fetch method based on partner type
      return partnerType === "studio" 
        ? getStudioEquipments(partnerId) 
        : getFreelancerEquipments(partnerId);
    },
    select: (data) => data?.equipments || [],
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 tracking-normal mb-3">
          Equipment Available
        </h2>
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#892580]"></div>
          <p className="mt-2 text-gray-600">Loading equipment...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="mt-8">
        <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 tracking-normal mb-3">
          Equipment Available
        </h2>
        <div className="text-center py-4 text-red-500">
          Failed to load equipment. Please try again later.
        </div>
      </div>
    );
  }

  // Empty state
  if (!equipmentData || equipmentData.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 tracking-normal mb-3">
          Equipment Available
        </h2>
        <p className="text-gray-600 py-4">
          No equipment available for this {partnerType} yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 tracking-normal mb-3">
        Equipment Available
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Please select the equipment required
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {equipmentData.map((equipment) => (
          <Equipment 
            key={equipment._id} 
            equipment={equipment} 
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        ))}
      </div>
    </div>
  );
};

export default EquipmentSection;