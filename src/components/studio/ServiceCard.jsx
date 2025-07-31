import React from 'react';
import { useStudioContext } from './CartContext';

const ServiceCard = ({ image, title, description, buttonText,serviceId }) => {
  const { selectedServices,SetSelectedServices} = useStudioContext()
  const isSelected = selectedServices.some(service => service.id === serviceId);
  const toggleServiceSelection = (serviceId) => {
    SetSelectedServices(prev => {
      const isSelected = prev.some(service => service.id === serviceId);
      if (isSelected) {
        // Remove if already selected
        return prev.filter(service => service.id !== serviceId);
      } else {
        // Add if not selected
        return [...prev, { id: serviceId }];
      }
    });
  }

  return (
    <div
      className="flex items-center border rounded-2xl  bg-white shadow-sm"
    >
      <img
        src={image}
        alt={title}
         className="w-20 h-full rounded-l-xl mr-1 "
      />
      <div className="flex-1">
        <h3 className="mt-1 text-gray-900 text-sm font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
      </div>
      <button
        onClick={() => toggleServiceSelection(serviceId)}
        className={`font-medium text-sm px-3 py-2 rounded-full mx-2 focus:outline-none focus:ring-opacity-50
          ${isSelected 
            ? 'bg-blue-600 text-white' 
            : 'bg-[#07070726] text-[#070707A6]'
          }`}
      >
        {isSelected ? 'Selected' : buttonText}
      </button>
    </div>
  );
};

export default ServiceCard;
