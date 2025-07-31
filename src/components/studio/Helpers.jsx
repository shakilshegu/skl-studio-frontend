import React from "react";
import Group from "../../../public/Assets/svg/Group";
import { getStudioHelpers} from "@/services/studio/studio.service";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { updateHelper } from "@/stores/bookingSlice";
import { getFreelancerHelpers } from "@/services/Freelancer/freelancer.service";

const HelpersSection = ({ partnerId, partnerType = "studio" }) => {
  const dispatch = useDispatch();
  
  const cartHelpers = useSelector(state => state.booking.helpers || {});

  // Fetch helpers data based on partner type
  const { 
    data: helperData, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ["helpers", partnerId, partnerType],
    queryFn: () => {
      // Use the appropriate service fetch method based on partner type
      return partnerType === "studio" 
        ? getStudioHelpers(partnerId) 
        : getFreelancerHelpers(partnerId);
    },
    select: (data) => data?.helpers || [],
  });

  const handleAddToCart = (helperId) => {
    dispatch(updateHelper({id: helperId, change: 1}));
  };

  const handleIncrease = (helperId) => {
    dispatch(updateHelper({id: helperId, change: 1}));
  };

  const handleDecrease = (helperId) => {
    dispatch(updateHelper({id: helperId, change: -1}));
  };

  const getHelperCount = (helperId) => {
    return cartHelpers[helperId]?.count || 0;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 mb-3">Helpers</h2>
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#892580]"></div>
          <p className="mt-2 text-gray-600">Loading helpers...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="mt-8">
        <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 mb-3">Helpers</h2>
        <div className="text-center py-4 text-red-500">
          Failed to load helpers. Please try again later.
        </div>
      </div>
    );
  }

  // Empty state
  if (!helperData || helperData.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 mb-3">Helpers</h2>
        <p className="text-gray-600 py-4">
          No helpers available for this {partnerType} yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div>
        <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 mb-3">Helpers</h2>
        <p className="text-sm text-gray-600 mb-4">Please select the helper required</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {helperData.map((helper) => {
          const helperCount = getHelperCount(helper._id);
          
          return (
            <div key={helper._id} className="border border-gray-300 rounded-lg p-4 h-full flex flex-col">
              {/* Title */}
              <h3 className="font-bold text-lg text-[#892580]">{helper.name}</h3>
              
              {/* Price */}
              <div className="text-lg font-semibold mt-1">₹{helper.price.toLocaleString('en-IN')}</div>
              
              {/* Description with proper height and ellipsis */}
              <div className="mt-2 flex-grow">
                <p className="text-sm text-gray-600 line-clamp-3 min-h-[3em]">{helper.description}</p>
              </div>

              {/* Add to cart button or quantity controls */}
              {helperCount > 0 ? (
                <div className="flex items-center justify-center border-t border-gray-200 gap-4 mt-3 pt-3">
                  <button
                    onClick={() => handleDecrease(helper._id)}
                    className="w-8 h-8 flex items-center justify-center text-lg text-blue-800 bg-blue-50 rounded-full hover:bg-blue-100"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 text-lg text-blue-600 font-medium">{helperCount}</span>
                  <button
                    onClick={() => handleIncrease(helper._id)}
                    className="w-8 h-8 flex items-center justify-center text-lg text-blue-800 bg-blue-50 rounded-full hover:bg-blue-100"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(helper._id)}
                  className="w-full py-2 border-t border-gray-200 text-[#892580] font-semibold flex items-center justify-center mt-3 pt-2"
                >
                  <span className="mr-2">
                    <Group />
                  </span>
                  Add To Cart
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HelpersSection;