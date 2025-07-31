// src/components/Equipment/Equipment.js
import React from "react";
// import "./Equipment.css";
import Group from "@/assets/svg/Group";
import Minus from "@/assets/studio/Minus";
import Positive from "@/assets/studio/Positive";
import { useDispatch, useSelector } from "react-redux";
import { updateEquipment } from "@/stores/bookingSlice";

const Equipment = ({ equipment }) => {
  const defaultImage = "/Assets/bok1.png"; // Fallback image

  const dispatch = useDispatch();
  
  // Get equipment from Redux state
  const cartEquipments = useSelector(state => state.booking.equipments || {});
  
  // Get the count for this specific equipment
  const getEquipmentCount = (equipmentId) => {
    return cartEquipments[equipmentId]?.count || 0;
  };
  
  const equipmentCount = getEquipmentCount(equipment?._id);
  const isSelected = equipmentCount > 0;

  // Add equipment to cart
  const handleAddToCart = (equipmentId) => {
    dispatch(updateEquipment({ id: equipmentId, change: 1 }));
  };

  // Increase equipment count
  const handleIncrease = (equipmentId) => {
    dispatch(updateEquipment({ id: equipmentId, change: 1 }));
  };

  // Decrease equipment count
  const handleDecrease = (equipmentId) => {
    dispatch(updateEquipment({ id: equipmentId, change: -1 }));
  };

  return (
    <div className="flex flex-col h-[345px] items-start flex-1 border border-neutral-200 rounded-lg bg-white shadow-sm">
      {/* Image */}
      <img
        src={equipment?.photo || defaultImage}
        alt={equipment?.name}
        className="w-full h-[200px] object-cover rounded-md mb-2"
        onError={(e) => {
          e.target.src = defaultImage; // Fallback image on error
        }}
      />

      {/* Title and Description */}
      <div className="ml-2 text-600 font-md text-[#150512] mb-2 line-clamp-2">
        {equipment?.name}
      </div>
      
      <div className="ml-2 text-sm text-gray-600 mb-2 line-clamp-2">
        {equipment?.description}
      </div>

      {/* Price */}
      <div className="ml-2 text-700 text-[#150513] mb-2 font-satoshi font-semibold text-[18px] leading-none">
        ₹ {equipment?.price.toLocaleString('en-IN')}
      </div>

      {/* Horizontal Line */}
      <hr className="w-[90%] border-t border-gray-300 my-1 mx-2" />

      {/* Add to Cart Button */}
      <div className="flex justify-center w-full">
        {!isSelected ? (
          <button
            onClick={() => handleAddToCart(equipment?._id)}
            className="mt-2 font-base text-700 flex items-center space-x-2 text-[#070707A6]"
          >
            <span className="material-icons">
              <Group />
            </span>
            <span className="text-[#892580] text-700">Add to cart</span>
          </button>
        ) : (
          <div className="flex justify-between items-center space-x-4 mt-2 gap-6 mx-1">
            <button
              onClick={() => handleDecrease(equipment?._id)}
              className="w-4 h-4 flex items-center justify-center text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100"
            >
              <Minus />
            </button>
            <span className="text-blue-600 font-medium">{equipmentCount}</span>
            <button
              onClick={() => handleIncrease(equipment?._id)}
              className="w-4 h-4 flex items-center justify-center text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100"
            >
              <Positive />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Equipment;