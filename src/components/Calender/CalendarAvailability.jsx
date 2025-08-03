
"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { showToast } from "../Toast/Toast";
import TimeSelector from "./TimeSelector";
import BookingSummary from "./BookingSummary";
import Calendar from "./Calenders";
import { getPartnerAvailabilityRange } from "@/services/Booking/availabilit.service";
import { useSearchParams } from "next/navigation";
import { 
  selectAllBookings, 
  selectAdminPackageBooking,
  selectCurrentBookingData, 
  clearAdminPackageBooking,
  clearAllBookingData,
  removeAdminPackageDate
} from "@/stores/bookingSlice";

const CalendarAvailability = ({ bookingType, adminPackageId }) => {
  // Redux state - using selectors based on booking type
  const dispatch = useDispatch();
  
  // Get current booking data (works for both regular and admin package)
  const currentBookingData = useSelector(selectCurrentBookingData);
  
  // Get specific booking data based on type
  const regularBookings = useSelector(selectAllBookings);
  const adminPackageBooking = useSelector(selectAdminPackageBooking);
  const storedEntityId = useSelector(state => state.booking.entityId);
  const storedEntityType = useSelector(state => state.booking.entityType);
  const storedActiveDate = useSelector(state => state.booking.activeDate); // Move this outside useEffect
  
  // Get entity type and ID from the URL
  const searchParams = useSearchParams();
  const urlEntityType = searchParams.get("entityType");
  const urlEntityId = searchParams.get("entityId");


  // Check if this is admin package booking
  const isAdminPackage = bookingType === "adminPackage";
  
  // Use stored values if available, otherwise use URL params
  // For admin packages, we don't need real entity data
  const entityType = isAdminPackage ? "adminPackage" :  (urlEntityType === "studio" ? "studio" : "freelancer");
  // const entityType = isAdminPackage ? "adminPackage" : (storedEntityType || (urlEntityType === "studio" ? "studio" : "freelancer"));
  const entityId = isAdminPackage ? adminPackageId :  urlEntityId;
  // const entityId = isAdminPackage ? adminPackageId : (storedEntityId || urlEntityId);
  
  // Base states from original component
  const [selectedDate, setSelectedDate] = useState(moment());
  const [monthAvailability, setMonthAvailability] = useState({});
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [selectedDateFullyBooked, setSelectedDateFullyBooked] = useState(false);
  
  // State for multi-date booking - Initialize from Redux if available
  const [selectedDates, setSelectedDates] = useState({});
  const [activeDate, setActiveDate] = useState(moment().format("YYYY-MM-DD"));
  
  const queryClient = useQueryClient();

// Add this useEffect right after your existing useEffect that logs ID changes
useEffect(() => {

  
  if (urlEntityId && !isAdminPackage) {
    // Clear local state
    setSelectedDates({});
    setActiveDate(moment().format("YYYY-MM-DD"));
    setSelectedDate(moment());
    setSelectedDateFullyBooked(false);    


  }
}, [urlEntityId, urlEntityType, isAdminPackage]);  
  
  // Load stored bookings from Redux on component mount
  useEffect(() => {
    let storedBookings = {};
    let activeDate = null;
    
    if (isAdminPackage) {
      // For admin packages, use admin package booking data
      if (adminPackageBooking.isActive && Object.keys(adminPackageBooking.selectedDates).length > 0) {
        console.log("Loading stored admin package booking:", adminPackageBooking);
        storedBookings = adminPackageBooking.selectedDates;
        activeDate = adminPackageBooking.activeDate;
      }
    } else {
      // For regular bookings, use regular booking data
      if (regularBookings && Object.keys(regularBookings).length > 0) {
        console.log("Loading stored regular bookings:", regularBookings);
        storedBookings = regularBookings;
        // Use the stored active date from Redux
        activeDate = storedActiveDate;
      }
    }
    
    if (Object.keys(storedBookings).length > 0) {
      // Convert Redux bookings to local state format
      const formattedBookings = {};
      Object.entries(storedBookings).forEach(([dateKey, bookingData]) => {
        formattedBookings[dateKey] = {
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          isWholeDay: bookingData.isWholeDay || false
        };
      });
      
      setSelectedDates(formattedBookings);
      
      // Set the stored active date or first date as active
      const firstStoredDate = activeDate || Object.keys(storedBookings)[0];
      if (firstStoredDate) {
        setActiveDate(firstStoredDate);
        setSelectedDate(moment(firstStoredDate));
      }
    }
  }, [regularBookings, adminPackageBooking, isAdminPackage, storedActiveDate]); // Add storedActiveDate to dependencies
  
  // Format availableSlots data from the API response
  const getFormattedAvailableSlots = (availabilityData) => {
    if (!availabilityData || !availabilityData.data || !availabilityData.data.timeSlots) {
      return [];
    }
    return availabilityData.data.timeSlots.map(slot => ({
      ...slot,
      hourValue: parseInt(slot.startTime.split(":")[0], 10)
    }));
  };

  // Fetch month availability data - SKIP for admin packages
  useEffect(() => {
    if (isAdminPackage) {
      // For admin packages, skip availability checks
      setIsLoadingDates(false);
      setMonthAvailability({});
      return;
    }

    const fetchMonthAvailability = async () => {
      if (!entityId) return;

      setIsLoadingDates(true);
      try {
        const currentMonth = moment(selectedDate).startOf("month");
        const startDate = currentMonth.clone().startOf("month").format("YYYY-MM-DD");
        const endDate = currentMonth.clone().endOf("month").format("YYYY-MM-DD");

        // Call API with the dynamic ID
        const response = await getPartnerAvailabilityRange(entityId, entityType, startDate, endDate);

        const availabilityMap = {};
        if (response?.data) {
          response.data.forEach(day => {
            const dateKey = moment(day.date).format("YYYY-MM-DD");
            const hasAvailableSlot = day.timeSlots?.some(slot => slot.isAvailable);
            availabilityMap[dateKey] = {
              fullyBooked: day.isFullyBooked,
              hasAvailability: hasAvailableSlot,
            };
          });
        }
        setMonthAvailability(availabilityMap);
      } catch (error) {
        console.error("Error fetching month availability:", error);
        showToast("Failed to load availability data", "error");
      } finally {
        setIsLoadingDates(false);
      }
    };

    fetchMonthAvailability();
  }, [entityId, selectedDate.format("MM-YYYY"), isAdminPackage]);

  // Handle date selection for multi-date booking
  const handleDateSelect = (date) => {
    const dateKey = date.format("YYYY-MM-DD");
    
    // For admin packages, don't allow past dates
    if (isAdminPackage && date.isBefore(moment(), 'day')) {
      showToast("Cannot select past dates", "error");
      return;
    }
    
    setActiveDate(dateKey);
    setSelectedDate(date);
    
    // Initialize date in selectedDates if not already present
    if (!selectedDates[dateKey]) {
      setSelectedDates(prev => ({
        ...prev,
        [dateKey]: { startTime: null, endTime: null, isWholeDay: false }
      }));
    }
    
    // For admin packages, never set as fully booked
    if (isAdminPackage) {
      setSelectedDateFullyBooked(false);
    } else {
      // Update fully booked state for TimeSelector component
      const availabilityForDate = monthAvailability[dateKey];
      setSelectedDateFullyBooked(availabilityForDate?.fullyBooked || false);
    }
  };
  
  // Handle time selection for currently active date
  const handleTimeSelection = (startTime, endTime) => {
    setSelectedDates(prev => ({
      ...prev,
      [activeDate]: {
        ...prev[activeDate],
        startTime,
        endTime,
        isWholeDay: false
      }
    }));
  };
  
  // SIMPLIFIED handleSelectWholeDay function
  const handleSelectWholeDay = () => {
    if (isAdminPackage) {
      // For admin packages, simply book 8 AM to 8 PM (using your existing time logic)
      setSelectedDates(prev => ({
        ...prev,
        [activeDate]: {
          startTime: 8,
          endTime: 20,
          isWholeDay: true
        }
      }));
      showToast("Whole day booked successfully", "success");
      return;
    }
    
    // Original logic for regular bookings
    if (selectedDateFullyBooked) {
      showToast("This date is fully booked", "error");
      return;
    }
    
    // Get availability data for the date
    const availabilityData = queryClient.getQueryData([
      "availability",
      entityId,
      activeDate,
    ]);
    
    // If no data, show error and return
    if (!availabilityData || !availabilityData.data || !availabilityData.data.timeSlots) {
      showToast("No availability data for this date", "error");
      return;
    }
    
    // Get all slots
    const slots = availabilityData.data.timeSlots;
    
    // Check for unavailable slots
    const unavailableSlots = slots.filter(slot => !slot.isAvailable);
    if (unavailableSlots.length > 0) {
      // Format times for message
      const times = unavailableSlots
        .map(slot => {
          const hour = parseInt(slot.startTime.split(':')[0]);
          return `${hour > 12 ? hour - 12 : hour}${hour >= 12 ? 'PM' : 'AM'}`;
        })
        .join(', ');
      
      showToast(`Cannot book whole day - ${times} already booked`, "warning");
      return;
    }
    
    // Get available slots hours
    const hours = slots
      .filter(slot => slot.isAvailable)
      .map(slot => parseInt(slot.startTime.split(':')[0]));
    
    // Find first and last hour
    const firstHour = Math.min(...hours);
    const lastHour = Math.max(...hours);
    
    // Book whole day
    setSelectedDates(prev => ({
      ...prev,
      [activeDate]: {
        startTime: firstHour,
        endTime: lastHour + 1,
        isWholeDay: true
      }
    }));
    
    showToast("Whole day booked successfully", "success");
  };
  
  // Remove a date from selection
  const handleRemoveDate = (dateKey) => {

        if (bookingType === "regular") {
      dispatch(removeBookingDate({ dateKey }));
    } else if (bookingType === "adminPackage") {
      dispatch(removeAdminPackageDate({ dateKey }));
    }

    setSelectedDates(prev => {
      const newSelectedDates = { ...prev };
      delete newSelectedDates[dateKey];
      return newSelectedDates;
    });
    
    // If active date was removed, set another date as active or reset
    if (dateKey === activeDate) {
      const remainingDates = Object.keys(selectedDates).filter(d => d !== dateKey);
      if (remainingDates.length > 0) {
        setActiveDate(remainingDates[0]);
        setSelectedDate(moment(remainingDates[0]));
      } else {
        setActiveDate(moment().format("YYYY-MM-DD"));
        setSelectedDate(moment());
      }
    }
  };

  // Get active date's time selection
  const activeTimeSelection = selectedDates[activeDate] || { startTime: null, endTime: null, isWholeDay: false };
  
  // Get only completed date selections for display
  const completedDateSelections = Object.entries(selectedDates).filter(([dateKey, dateData]) => 
    dateData.startTime !== null && dateData.endTime !== null
  );
  


  // Check if a date is selected with complete time data
  const isDateSelected = (dateKey) => {
    const dateData = selectedDates[dateKey];
    return dateData && dateData.startTime !== null && dateData.endTime !== null;
  };
  
  // Get data from any cached query for daily availability - SKIP for admin packages
  const availabilityData = isAdminPackage ? null : queryClient.getQueryData([
    "availability",
    entityId,
    selectedDate.format("YYYY-MM-DD"),
  ]);

  const availableSlots = isAdminPackage ? [] : getFormattedAvailableSlots(availabilityData);

  // Determine which stored bookings to show message for
  const hasStoredBookings = isAdminPackage 
    ? (adminPackageBooking.isActive && Object.keys(adminPackageBooking.selectedDates).length > 0)
    : (Object.keys(regularBookings).length > 0);

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <div className="p-5">
          <h2 className="font-semibold text-xl text-center mb-4">
            {isAdminPackage ? "Select Your Dates" : "Book your slot"}
          </h2>
          
          {/* Show message for admin packages */}
          {isAdminPackage && (
            <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-700">
                📦 Booking admin package - all future dates available!
              </p>
            </div>
          )}
          
          {/* Show message if returning with stored bookings */}
          {hasStoredBookings && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                📅 Showing your previous selection. You can modify dates and times below.
              </p>
            </div>
          )}
          
          {/* Calendar Component - Modified to support multi-date */}
          <Calendar 
            selectedDate={selectedDate}
            setSelectedDate={(date) => handleDateSelect(date)}
            monthAvailability={isAdminPackage ? {} : monthAvailability} // Empty for admin packages
            isLoadingDates={isAdminPackage ? false : isLoadingDates} // Never loading for admin packages
            setSelectedDateFullyBooked={setSelectedDateFullyBooked}
            selectedDates={selectedDates} // Pass selected dates for highlighting
            isDateSelected={isDateSelected} // Function to check if a date is selected
            isAdminPackage={isAdminPackage} // Pass flag to calendar
          />
          
          <hr className="text-gray-300 h-2" />
          
          {/* Whole Day Button - Always green, validation in function */}
          <div className="mt-4 mb-4">
            <button
              onClick={handleSelectWholeDay}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
              </svg>
              Book Whole Day
            </button>
          </div>
          
          {/* Time Selector Component - Modified to work with active date */}
          <TimeSelector 
            entityType={entityType}
            entityId={entityId}
            selectedDate={selectedDate}
            selectedDateFullyBooked={selectedDateFullyBooked}
            selectedStartTime={activeTimeSelection.startTime}
            setSelectedStartTime={(time) => handleTimeSelection(time, activeTimeSelection.endTime)}
            selectedEndTime={activeTimeSelection.endTime}
            setSelectedEndTime={(time) => handleTimeSelection(activeTimeSelection.startTime, time)}
            isAdminPackage={isAdminPackage} // Pass flag to TimeSelector
          />
          
          {/* Selected Dates Summary - ONLY show completed selections */}
          {completedDateSelections.length > 0 && (
            <div className="mt-6 mb-4">
              <h3 className="font-semibold text-lg mb-3">Selected Dates</h3>
              <div className="space-y-3">
                {completedDateSelections.map(([dateKey, dateData]) => {
                  const isActive = dateKey === activeDate;
                  
                  return (
                    <div 
                      key={dateKey}
                      className={`
                        p-3 rounded-lg border flex justify-between items-center cursor-pointer
                        ${isActive ? 'border-[#892580] bg-purple-50' : 'border-gray-200'}
                      `}
                      onClick={() => {
                        setActiveDate(dateKey);
                        setSelectedDate(moment(dateKey));
                      }}
                    >
                      <div>
                        <div className="font-medium">
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
                      <div className="flex items-center">
                        {isActive && (
                          <div className="mr-2 text-xs bg-[#892580] text-white px-2 py-0.5 rounded-full">
                            Active
                          </div>
                        )}
                        <button 
                          className="text-red-500 hover:text-red-700 p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveDate(dateKey);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
       
          {/* Booking Summary Component - Pass only completed selections */}
          <BookingSummary 
            entityType={entityType}
            entityId={entityId}
            selectedDates={Object.fromEntries(completedDateSelections)} // Only pass completed selections
            availableSlots={availableSlots}
            queryClient={queryClient}
            isAdminPackage={isAdminPackage} // Pass flag to BookingSummary
            activeDate={activeDate} // Pass active date for Redux storage
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarAvailability;