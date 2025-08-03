"use client";
import React, { useState } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { showToast } from "../Toast/Toast";
import { 
  setAllBookingData, 
  setEntityId, 
  setEntityType,
  setAdminPackageBooking 
} from "@/stores/bookingSlice";

const BookingSummary = ({ 
  entityId,
  entityType,
  selectedDates, // Object containing all selected dates with their time slots
  availableSlots,
  queryClient,
  isAdminPackage = false, // NEW: Flag for admin packages
  activeDate // NEW: Active date for Redux storage
}) => {


  const router = useRouter();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate total hours booked
  const calculateTotalHours = () => {
    return Object.values(selectedDates).reduce((total, dateData) => {
      return total + (dateData.endTime - dateData.startTime);
    }, 0);
  };
  
  // Generate hourly slot IDs for a specific date - SKIP for admin packages
  const generateSlotIdsForDate = async (dateKey, dateData) => {
    if (isAdminPackage) {
      // For admin packages, we don't need slot IDs or date document IDs
      // Just return empty arrays since admin handles availability separately
      return { 
        slots: [], // No real slot IDs needed for admin packages
        dateDocumentId: null // No date document ID for admin packages
      };
    }

    try {
      // Fetch availability data for this specific date if not available
      const dateAvailabilityQuery = queryClient.getQueryData([
        "availability",
        entityId,
        dateKey,
      ]);
      
      let slotsForDate = [];
      let dateDocumentId = null; // Store the date document ID
      
      if (dateAvailabilityQuery?.data?.timeSlots) {
        // Get the date document ID
        dateDocumentId = dateAvailabilityQuery.data._id; // Extract the date document ID
        
        const availableSlots = dateAvailabilityQuery.data.timeSlots.map(slot => ({
          ...slot,
          hourValue: parseInt(slot.startTime.split(':')[0], 10)
        }));
        
        // Loop through each hour in the selected range
        for (let hour = dateData.startTime; hour < dateData.endTime; hour++) {
          // Find the slot in the available slots
          const slot = availableSlots.find(s => s.hourValue === hour && s.isAvailable);
          
          // If the slot exists and is available, add its ID to the selected slots
          if (slot && slot._id) {
            slotsForDate.push(slot._id);
          }
        }
      }
      
      return { slots: slotsForDate, dateDocumentId }; // Return both slots and date ID
    } catch (error) {
      console.error("Error generating slot IDs for date:", dateKey, error);
      return { slots: [], dateDocumentId: null }; // Return consistent structure
    }
  };
  
  // Handle booking - Store all data in Redux when user clicks Book
  const handleBooking = async () => {
    if (Object.keys(selectedDates).length === 0) {
      showToast('Please select at least one date and time', 'error');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      if (isAdminPackage) {
        // For admin packages, use admin package Redux action
        dispatch(setAdminPackageBooking({
          packageId: entityId,
          selectedDates: selectedDates, // Use the simple selectedDates format for admin packages
          activeDate: activeDate || Object.keys(selectedDates)[0]
        }));
        
        console.log('Admin package booking data stored in Redux:', {
          packageId: entityId,
          selectedDates: selectedDates,
          activeDate: activeDate || Object.keys(selectedDates)[0]
        });
        
        // FIXED: Navigate to admin package checkout with correct URL format
        router.push(`/user/checkout?packageId=${entityId}`);
      } else {
        // Prepare the booking data for Redux (regular booking logic)
        const bookingsData = {};
        
        
        


        // Process each selected date and collect slot IDs
        for (const [dateKey, dateData] of Object.entries(selectedDates)) {
          const { slots: slotIds, dateDocumentId } = await generateSlotIdsForDate(dateKey, dateData);
          
          // Store data in the Redux-compatible format
          bookingsData[dateKey] = {
            startTime: dateData.startTime,
            endTime: dateData.endTime,
            isWholeDay: dateData.isWholeDay || false,
            slots: slotIds,
            dateDocumentId: dateDocumentId,
            isAdminPackage: false
          };
          
          // Log for debugging
          console.log(`Date: ${dateKey}`, {
            startTime: dateData.startTime,
            endTime: dateData.endTime,
            isWholeDay: dateData.isWholeDay,
            slots: slotIds,
            dateDocumentId: dateDocumentId
          });
        }
        
        // Get the first date as active date if not provided
        const finalActiveDate = activeDate || Object.keys(bookingsData)[0];
        
        // For regular bookings, set entity information in Redux first
        dispatch(setEntityId(entityId));
        dispatch(setEntityType(entityType));
        
        // Set all booking data in Redux
        dispatch(setAllBookingData({
          bookings: bookingsData,
          activeDate: finalActiveDate
        }));
        
        console.log('Regular booking data stored in Redux:', {
          bookings: bookingsData,
          activeDate: finalActiveDate,
          entityId,
          entityType
        });
        
        // Navigate to regular checkout
        router.push(`/user/checkout?entityId=${entityId}`);
      }
      
    } catch (error) {
      console.error('Error storing booking data:', error);
      showToast('Error preparing booking data', 'error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Total number of dates selected
  const totalDatesSelected = Object.keys(selectedDates).length;
  
  // Don't show the component if no dates are selected
  if (totalDatesSelected === 0) {
    return null;
  }
  
  return (
    <>
      {/* Selected dates summary display */}
      <div className={`mt-6 p-5 border rounded-lg shadow ${
        isAdminPackage 
          ? 'bg-purple-50 border-purple-300' 
          : 'bg-purple-50 border-[#2563EB]'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className={`font-bold text-lg text-[#2563EB]`}>
            {isAdminPackage ? 'Package Booking Summary' : 'Your Booking Summary'}
          </h4>
          {totalDatesSelected > 1 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`hover:underline flex items-center text-[#2563EB]`}
            >
              {isExpanded ? 'Show Less' : 'Show Details'}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              
            </button>
          )}
        </div>
        
        {/* Show admin package info */}
        {isAdminPackage && (
          <div className="mb-4 p-3 bg-purple-100 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-sm font-medium text-[#2563EB]">Admin Package Booking</span>
            </div>
            <p className="text-xs text-[#2563EB] mt-1">Package ID: #{entityId?.slice(-8) || 'ADMIN'}</p>
          </div>
        )}
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-700">
              <span className="font-medium">{totalDatesSelected}</span> {totalDatesSelected === 1 ? 'day' : 'days'} selected
            </div>
            <div className={`font-bold text-[#2563EB]`}>
              <span className={`text-white text-xs font-bold px-2 py-0.5 rounded-full bg-[#2563EB]`}>
                {calculateTotalHours()} total hours
              </span>
            </div>
          </div>
        </div>
        
        {/* Show detailed list of dates when expanded or when there is only one date */}
        {(isExpanded || totalDatesSelected === 1) && (
          <div className={`space-y-3 mt-3 border-t pt-3 ${
            isAdminPackage ? 'border-purple-200' : 'border-purple-200'
          }`}>
            {Object.entries(selectedDates).map(([dateKey, dateData]) => (
              <div key={dateKey} className="flex justify-between items-center p-2 rounded-lg bg-white">
                <div>
                  <div className="font-medium text-[#300B29]">
                    {moment(dateKey).format('ddd, MMM D, YYYY')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {dateData.startTime > 12 ? dateData.startTime - 12 : dateData.startTime}
                    {dateData.startTime >= 12 ? 'PM' : 'AM'} - {' '}
                    {dateData.endTime > 12 ? dateData.endTime - 12 : dateData.endTime}
                    {dateData.endTime >= 12 ? 'PM' : 'AM'}
                    {dateData.isWholeDay && " (Whole Day)"}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-[#2563EB]`}>
                    {dateData.endTime - dateData.startTime} hour{dateData.endTime - dateData.startTime !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Book Button - Saves to Redux when clicked */}
      <div className="p-4 bg-gray-50 border-t mt-6">
        <button
          onClick={handleBooking}
          disabled={isProcessing}
          className={`
            w-full px-6 py-4 rounded-lg text-white font-medium text-lg focus:outline-none 
            focus:ring-2 focus:ring-offset-2 shadow-md transition-all duration-200
            ${!isProcessing
              ? 'bg-[#2563EB] hover:bg-[#7D1F72] focus:ring-[#2563EB] transform hover:scale-[1.02]'
              : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `${isAdminPackage ? 'Book Package' : 'Book'} ${totalDatesSelected} ${totalDatesSelected === 1 ? 'day' : 'days'} (${calculateTotalHours()} hours)`
          )}
        </button>
      </div>
    </>
  );
};

export default BookingSummary;