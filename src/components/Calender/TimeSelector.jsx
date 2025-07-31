
"use client"
import React, { useState, useEffect } from "react";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getPartnerAvailability } from "@/services/Booking/availabilit.service";

const TimeSelector = ({ 
  entityId,
  entityType,
  selectedDate,
  selectedDateFullyBooked,
  selectedStartTime,
  setSelectedStartTime,
  selectedEndTime,
  setSelectedEndTime,
  isAdminPackage = false // NEW: Flag for admin packages
}) => {
  const [showStartTimeSelector, setShowStartTimeSelector] = useState(false);
  const [showEndTimeSelector, setShowEndTimeSelector] = useState(false);
  
  // Effect to close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.start-time-container') && showStartTimeSelector) {
        setShowStartTimeSelector(false);
      }
      
      if (!event.target.closest('.end-time-container') && showEndTimeSelector) {
        setShowEndTimeSelector(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStartTimeSelector, showEndTimeSelector]);

  // Query for daily availability data - SKIP for admin packages
  const { data: availabilityData, isLoading } = useQuery({
    queryKey: ['availability', entityId, selectedDate.format('YYYY-MM-DD')],
    queryFn: () => getPartnerAvailability(entityId, entityType, selectedDate),
    enabled: !!entityId && !!selectedDate && !isAdminPackage, // Don't fetch for admin packages
  });

  // Generate time slots from 8am to 8pm
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      slots.push({
        display: `${hour > 12 ? hour - 12 : hour}${hour >= 12 ? 'PM' : 'AM'}`,
        value: hour
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Format the availableSlots data from the API response for easier consumption
  const getFormattedAvailableSlots = () => {
    if (isAdminPackage) {
      // For admin packages, return all slots as available
      return timeSlots.map(slot => ({
        hourValue: slot.value,
        isAvailable: true,
        _id: `admin-slot-${slot.value}` // Mock ID for admin packages
      }));
    }
    
    if (!availabilityData || !availabilityData.data || !availabilityData.data.timeSlots) {
      return [];
    }
    
    return availabilityData.data.timeSlots.map(slot => ({
      ...slot,
      hourValue: parseInt(slot.startTime.split(':')[0], 10) // Extract hour as integer
    }));
  };

  const availableSlots = getFormattedAvailableSlots();

  // Check if a specific time slot is available
  const checkTimeSlotAvailable = (hour) => {
    if (isAdminPackage) {
      // For admin packages, all slots are available
      return true;
    }
    
    if (!availableSlots.length) return false;
    
    const slot = availableSlots.find(slot => slot.hourValue === hour);
    return slot && slot.isAvailable;
  };

  // Determine whether to show hours availability section
  const shouldShowHoursAvailability = !selectedStartTime && !selectedEndTime && !isLoading;

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-lg text-center mb-4">Select Your Hours</h3>
      
      {/* Show loading only for non-admin packages */}
      {isLoading && !isAdminPackage ? (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#892580]"></div>
          <span className="ml-3 text-gray-600">Loading availability...</span>
        </div>
      ) : (
        <>
          {/* Start Time Selector */}
          <div className="relative mb-6 start-time-container">
            <div 
              className={`
                flex justify-between items-center bg-white p-4 rounded-lg border 
                ${showStartTimeSelector ? 'border-[#892580] shadow-md' : 'border-gray-200'} 
                mb-1 transition-all duration-200
              `}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#892580] flex items-center justify-center mr-3 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-800">Start Time</span>
              </div>
              
              <div 
                className={`
                  flex items-center px-3 py-1.5 rounded-lg transition-colors duration-200 
                  ${(selectedDateFullyBooked && !isAdminPackage)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : selectedStartTime !== null 
                      ? 'bg-purple-50 text-[#892580] cursor-pointer hover:bg-purple-100'
                      : 'bg-gray-50 hover:bg-gray-100 text-[#892580] cursor-pointer'
                  }
                `}
                onClick={() => {
                  if (!(selectedDateFullyBooked && !isAdminPackage)) {
                    setShowStartTimeSelector(!showStartTimeSelector);
                    setShowEndTimeSelector(false);
                  }
                }}
              >
                <span className="font-semibold text-lg mr-1">
                  {selectedStartTime !== null ? 
                    `${selectedStartTime > 12 ? selectedStartTime - 12 : selectedStartTime}${selectedStartTime >= 12 ? 'PM' : 'AM'}` : 
                    'Select'
                  }
                </span>
                {!(selectedDateFullyBooked && !isAdminPackage) && (
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${showStartTimeSelector ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>
            
            {/* Start Time Dropdown */}
            {showStartTimeSelector && (
              <div className="border border-gray-200 rounded-lg py-2 bg-white mb-4 max-h-64 overflow-y-auto">
                {timeSlots.map((slot) => {
                  const isAvailable = checkTimeSlotAvailable(slot.value);
                  const isSelected = selectedStartTime === slot.value;
                  
                  return (
                    <div
                      key={`start-${slot.value}`}
                      className={`
                        px-4 py-2.5 cursor-pointer hover:bg-gray-50 flex justify-between items-center
                        ${isSelected ? 'bg-purple-50' : ''}
                        ${!isAvailable ? 'opacity-50 hover:bg-white cursor-not-allowed' : ''}
                      `}
                      onClick={() => {
                        if (isAvailable) {
                          setSelectedStartTime(slot.value);
                          // Reset end time if it's now before start time
                          if (selectedEndTime !== null && slot.value >= selectedEndTime) {
                            setSelectedEndTime(null);
                          }
                          setShowStartTimeSelector(false);
                        }
                      }}
                    >
                      <span className={`${isSelected ? 'text-[#892580] font-semibold' : 'text-gray-700'}`}>
                        {slot.display}
                      </span>
                      
                      {!isAvailable && !isAdminPackage ? (
                        <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">Booked</span>
                      ) : isSelected ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#892580]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-xs bg-green-50 text-green-500 px-2 py-0.5 rounded-full">
                          {isAdminPackage ? 'Available' : 'Available'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* End Time Selector */}
          <div className="relative end-time-container">
            <div 
              className={`
                flex justify-between items-center bg-white p-4 rounded-lg border 
                ${showEndTimeSelector ? 'border-[#892580] shadow-md' : 'border-gray-200'} 
                mb-1 transition-all duration-200
              `}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#892580] flex items-center justify-center mr-3 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-800">End Time</span>
              </div>
              
              <div 
                className={`
                  flex items-center px-3 py-1.5 rounded-lg transition-colors duration-200
                  ${(selectedStartTime !== null && !(selectedDateFullyBooked && !isAdminPackage))
                    ? selectedEndTime !== null 
                      ? 'bg-purple-50 text-[#892580] cursor-pointer hover:bg-purple-100' 
                      : 'bg-gray-50 hover:bg-gray-100 text-[#892580] cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
                onClick={() => {
                  if (selectedStartTime !== null && !(selectedDateFullyBooked && !isAdminPackage)) {
                    setShowEndTimeSelector(!showEndTimeSelector);
                    setShowStartTimeSelector(false);
                  }
                }}
              >
                <span className="font-semibold text-lg mr-1">
                  {selectedEndTime !== null ? 
                    `${selectedEndTime > 12 ? selectedEndTime - 12 : selectedEndTime}${selectedEndTime >= 12 ? 'PM' : 'AM'}` : 
                    'Select'
                  }
                </span>
                {selectedStartTime !== null && !(selectedDateFullyBooked && !isAdminPackage) && (
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${showEndTimeSelector ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>
            
            {/* End Time Dropdown */}
            {showEndTimeSelector && (
              <div className="border border-gray-200 rounded-lg py-2 bg-white mb-4 max-h-64 overflow-y-auto">
                {[...timeSlots, {display: '8PM', value: 20}].map((slot) => {
                  // For end time, we need to check if all slots between start and this end time are available
                  let allSlotsAvailable = true;
                  if (!isAdminPackage && selectedStartTime !== null && slot.value > selectedStartTime) {
                    for (let h = selectedStartTime; h < slot.value; h++) {
                      if (!checkTimeSlotAvailable(h)) {
                        allSlotsAvailable = false;
                        break;
                      }
                    }
                  }
                  
                  const isValidEndTime = selectedStartTime !== null && slot.value > selectedStartTime && (isAdminPackage || allSlotsAvailable);
                  const isSelected = selectedEndTime === slot.value;
                  
                  return (
                    <div
                      key={`end-${slot.value}`}
                      className={`
                        px-4 py-2.5 cursor-pointer hover:bg-gray-50 flex justify-between items-center
                        ${isSelected ? 'bg-purple-50' : ''}
                        ${!isValidEndTime ? 'opacity-50 hover:bg-white cursor-not-allowed' : ''}
                      `}
                      onClick={() => {
                        if (isValidEndTime) {
                          setSelectedEndTime(slot.value);
                          setShowEndTimeSelector(false);
                        }
                      }}
                    >
                      <span className={`${isSelected ? 'text-[#892580] font-semibold' : 'text-gray-700'}`}>
                        {slot.display}
                      </span>
                      
                      {selectedStartTime !== null && slot.value <= selectedStartTime ? (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Too Early</span>
                      ) : (!allSlotsAvailable && !isAdminPackage) ? (
                        <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">Unavailable</span>
                      ) : isSelected ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#892580]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-xs bg-green-50 text-green-500 px-2 py-0.5 rounded-full">Available</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Display booking availability hours - only if no times are selected and NOT admin package */}
          {shouldShowHoursAvailability && !isAdminPackage && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold mb-3 text-[#300B29]">Hours availability on {selectedDate.format('MMMM D, YYYY')}</h4>
              {selectedDateFullyBooked ? (
                <div className="p-4 bg-red-50 text-red-600 text-center rounded-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  No slots available for this date
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <div 
                      key={slot._id}
                      className={`
                        text-center p-2 rounded-lg shadow-sm transition-colors duration-200
                        ${slot.isAvailable 
                          ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' 
                          : 'bg-red-50 text-red-600 border border-red-200'
                        }
                      `}
                    >
                      <div className="font-medium">
                        {`${slot.hourValue > 12 ? slot.hourValue - 12 : slot.hourValue}${slot.hourValue >= 12 ? 'PM' : 'AM'}`}
                      </div>
                      <div className="text-xs mt-1">
                        {slot.isAvailable ? (
                          <span className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Available
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Booked
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">No availability data</div>
              )}
            </div>
          )}

          {/* Show simple message for admin packages when no times selected */}
          {shouldShowHoursAvailability && isAdminPackage && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="text-sm font-semibold mb-2 text-purple-800">Admin Package Booking</h4>
              <p className="text-sm text-purple-700">All time slots (8 AM - 8 PM) are available for selection.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TimeSelector;