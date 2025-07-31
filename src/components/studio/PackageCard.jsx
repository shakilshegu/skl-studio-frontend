// PackageCard.js
import React, { useState } from "react";
import Group from "../../../public/Assets/svg/Group";
import { FaInfoCircle, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updatePackage } from "@/stores/bookingSlice";

const PackageCard = ({ 
  id, 
  price, 
  title, 
  description, 
  photo,
  services = [],
  equipments = []
}) => {
  const dispatch = useDispatch();
  
  // Get packages from Redux state
  const cartPackages = useSelector(state => state.booking.packages || {});
  
  const defaultImage = "/Assets/bok1.png"; // Fallback image
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = (packageId) => {
    dispatch(updatePackage({ id: packageId, change: 1 }));
  };

  const handleIncrease = (packageId) => {
    dispatch(updatePackage({ id: packageId, change: 1 }));
  };

  const handleDecrease = (packageId) => {
    dispatch(updatePackage({ id: packageId, change: -1 }));
  };

  const getPackageCount = (packageId) => {
    return cartPackages[packageId]?.count || 0;
  };

  // Format the price with comma separators
  const formattedPrice = `₹${price.toLocaleString('en-IN')}`;
  
  // Get package count for this specific package
  const packageCount = getPackageCount(id);

  return (
    <>
      <div className="border rounded-2xl border-gray-300 p-4 h-full flex flex-col">
        {/* Package Image */}
        {photo && (
          <div className="mb-3 rounded-lg overflow-hidden h-48">
            <img 
              src={photo} 
              alt={title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = defaultImage; // Fallback image on error
              }}
            />
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <h3 className="text-[#892580] text-lg font-medium">{formattedPrice}</h3>
        </div>
        
        <h4 className="text-gray-800 font-medium mt-2">{title}</h4>
        
        <p className="text-gray-600 text-sm mt-1 line-clamp-3 flex-grow">{description}</p>
        
        {/* Package Details Summary - Clickable button */}
        <div className="mt-3 mb-2">
          <button 
            className="flex items-center justify-center w-full text-sm text-[#892580] font-medium py-1 border border-[#892580] rounded-lg px-3 hover:bg-[#892580] hover:text-white transition-colors"
            onClick={() => setShowModal(true)}
          >
            <FaInfoCircle className="mr-2" />
            <span>View Package Details</span>
          </button>
          
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-500">
            {equipments.length > 0 && (
              <span>{equipments.length} Equipment{equipments.length > 1 ? 's' : ''}</span>
            )}
            {equipments.length > 0 && services.length > 0 && <span>•</span>}
            {services.length > 0 && (
              <span>{services.length} Service{services.length > 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        {/* Cart Controls */}
        {packageCount > 0 ? (
          <div className="flex items-center justify-center border-t-2 border-gray-200 gap-4 mt-2 pt-2">
            <button
              onClick={() => handleDecrease(id)}
              className="w-6 h-6 flex items-center justify-center text-lg text-blue-800 bg-blue-50 rounded-full hover:bg-blue-100"
            >
              -
            </button>
            <span className="px-6 py-2 text-lg text-blue-600 font-medium">{packageCount}</span>
            <button
              onClick={() => handleIncrease(id)}
              className="w-6 h-6 flex items-center justify-center text-lg text-blue-800 bg-blue-50 rounded-full hover:bg-blue-100"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleAddToCart(id)}
            className="w-full py-2 px-4 border-t-2 border-gray-200 text-[#892580] text-600 flex items-center justify-center mt-2"
          >
            <span className="mr-2">
              <Group />
            </span>
            Add To Cart
          </button>
        )}
      </div>

      {/* Modal for Package Details */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-[#892580]">{title} Details</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-4">
              {/* Modal Content */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                {/* Left side - image */}
                <div className="md:w-1/3">
                  <img 
                    src={photo || defaultImage} 
                    alt={title} 
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                  <div className="mt-3">
                    <div className="text-xl font-bold text-[#892580]">{formattedPrice}</div>
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                  </div>
                </div>
                
                {/* Right side - details */}
                <div className="md:w-2/3">
                  {equipments.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-lg text-[#892580] mb-2 pb-2 border-b">
                        Equipment Included ({equipments.length})
                      </h4>
                      <ul className="space-y-3">
                        {equipments.map(equipment => (
                          <li key={equipment._id} className="flex">
                            <div className="flex-shrink-0 mr-3 mt-1">
                              <img 
                                src={equipment.photo || defaultImage} 
                                alt={equipment.name} 
                                className="w-10 h-10 object-cover rounded-md"
                                onError={(e) => {
                                  e.target.src = defaultImage;
                                }}
                              />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium">{equipment.name}</span>
                                <span className="ml-2 text-[#892580] font-semibold">
                                  ₹{equipment.price.toLocaleString('en-IN')}
                                </span>
                              </div>
                              {equipment.description && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {equipment.description}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {services.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-lg text-[#892580] mb-2 pb-2 border-b">
                        Services Included ({services.length})
                      </h4>
                      <ul className="space-y-3">
                        {services.map(service => (
                          <li key={service._id} className="flex">
                            <div className="flex-shrink-0 mr-3 mt-1">
                              <img 
                                src={service.photo || defaultImage} 
                                alt={service.name} 
                                className="w-10 h-10 object-cover rounded-md"
                                onError={(e) => {
                                  e.target.src = defaultImage;
                                }}
                              />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium">{service.name}</span>
                                <span className="ml-2 text-[#892580] font-semibold">
                                  ₹{service.price.toLocaleString('en-IN')}
                                </span>
                              </div>
                              {service.description && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {service.description}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Value calculation */}
              <div className="bg-gray-50 p-3 rounded-lg mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Individual Value:</span>
                  <span className="font-medium">
                    ₹{(
                      equipments.reduce((sum, eq) => sum + eq.price, 0) + 
                      services.reduce((sum, sv) => sum + sv.price, 0)
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">Package Price:</span>
                  <span className="font-medium">{formattedPrice}</span>
                </div>
                <div className="flex justify-between items-center mt-1 text-green-600 font-semibold border-t border-gray-200 pt-2 mt-2">
                  <span>Your Savings:</span>
                  <span>
                    ₹{(
                      equipments.reduce((sum, eq) => sum + eq.price, 0) + 
                      services.reduce((sum, sv) => sum + sv.price, 0) - 
                      price
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              
              {/* Cart controls in modal */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="text-lg font-bold text-[#892580]">{formattedPrice}</div>
                {packageCount > 0 ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDecrease(id)}
                      className="w-8 h-8 flex items-center justify-center text-lg text-[#892580] bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium">{packageCount}</span>
                    <button
                      onClick={() => handleIncrease(id)}
                      className="w-8 h-8 flex items-center justify-center text-lg text-[#892580] bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(id)}
                    className="py-2 px-4 bg-[#892580] text-white rounded-lg hover:bg-[#7a1f71] transition-colors flex items-center"
                  >
                    <Group className="mr-2" />
                    Add To Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PackageCard;