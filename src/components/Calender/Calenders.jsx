"use client"
import React from "react";
import moment from "moment";
import LeftArrowIcon from "../../../public/Assets/studio/LeftArrowIcon";
import RightArrowIcon from "../../../public/Assets/studio/RightArrowIcon";
import { showToast } from "../Toast/Toast";

const Calendar = ({ 
  selectedDate, 
  setSelectedDate, 
  monthAvailability, 
  isLoadingDates, 
  setSelectedDateFullyBooked,
  selectedDates, // NEW: Track all selected dates
  isDateSelected // NEW: Function to check if a date is selected
}) => {
  // Get today's date for comparison
  const today = moment().startOf('day');

  // Generate dates for calendar view (current month)
  const getDatesForMonth = (date) => {
    const currentMoment = moment(date);
    const firstDayOfMonth = currentMoment.clone().startOf('month');
    const firstDayOfCalendar = firstDayOfMonth.clone().startOf('week');
    
    const calendarDays = [];
    const day = firstDayOfCalendar.clone();
    
    // Generate 42 days (6 weeks) for the calendar view
    while (calendarDays.length < 42) {
      const currentMonth = currentMoment.month();
      const dateKey = day.format('YYYY-MM-DD');
      const isCurrentMonth = day.month() === currentMonth;
      
      calendarDays.push({
        day: day.date(),
        month: day.month(),
        year: day.year(),
        isCurrentMonth,
        dateKey,
        // Only check availability for current month dates
        ...(isCurrentMonth && monthAvailability[dateKey] ? monthAvailability[dateKey] : {})
      });
      
      day.add(1, 'days');
    }
    
    return calendarDays;
  };

  // Format date for display
  const formatDateHeader = (date) => {
    return moment(date).format('MMMM YYYY');
  };

  // Handle month navigation
  const handleMonthChange = (direction) => {
    setSelectedDate(moment(selectedDate).add(direction, 'months'));
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    if (!date.isCurrentMonth) return;
    
    // Check if the date is fully booked
    if (date.fullyBooked) {
      showToast('This date is fully booked', 'info');
      setSelectedDateFullyBooked(true);
      
      const newDate = moment([date.year, date.month, date.day]);
      setSelectedDate(newDate);
      return;
    }
    
    // Don't allow selection of dates with no availability
    if (!date.hasAvailability && date.hasAvailability !== undefined) {
      showToast('No availability on this date', 'info');
      return;
    }
    
    // Set selected date and reset flags
    const newDate = moment([date.year, date.month, date.day]);
    setSelectedDate(newDate);
    setSelectedDateFullyBooked(false);
  };

  const calendarDates = getDatesForMonth(selectedDate);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <button 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#892580]"
          onClick={() => handleMonthChange(-1)}
          disabled={isLoadingDates}
        >
          <LeftArrowIcon />
        </button>
        <span className="font-bold text-lg text-[#300B29]">
          {formatDateHeader(selectedDate)}
        </span>
        <button 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#892580]"
          onClick={() => handleMonthChange(1)}
          disabled={isLoadingDates}
        >
          <RightArrowIcon />
        </button>
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-xs font-bold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {isLoadingDates ? (
        <div className="py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#892580]"></div>
          <p className="mt-2 text-gray-600">Loading availability...</p>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {calendarDates.map((date, index) => {
            const dateObj = moment([date.year, date.month, date.day]);
            const dateKey = dateObj.format('YYYY-MM-DD');
            
            const isPastDate = dateObj.isBefore(today);
            const isToday = dateObj.isSame(today, 'day');
            const isSelected = date.isCurrentMonth && selectedDate.date() === date.day && 
                             selectedDate.month() === date.month && selectedDate.year() === date.year;
            
            // NEW: Check if this date is in the selectedDates
            const isDateInSelection = isDateSelected(dateKey);
            
            // Cell styling based on date state
            let cellClasses = "relative flex items-center justify-center rounded-full w-10 h-10 mx-auto transition-all duration-200";
            
            // Base styling for all dates
            if (!date.isCurrentMonth) {
              cellClasses += " text-gray-300 cursor-default";
            } else if (isPastDate) {
              cellClasses += " text-gray-400 cursor-not-allowed";
            } else if (date.fullyBooked) {
              cellClasses += " text-red-500 hover:bg-red-50 cursor-not-allowed";
            } else if (date.hasAvailability === false) {
              cellClasses += " text-gray-500 hover:bg-gray-50 cursor-not-allowed";
            } else if (date.hasAvailability) {
              cellClasses += " text-[#300B29] hover:bg-[#892580] hover:text-white cursor-pointer";
            } else {
              cellClasses += " text-[#300B29] hover:bg-gray-100 cursor-pointer";
            }
            
            // Additional styling for special states
            if (isToday) {
              cellClasses += " border-2 border-blue-400";
            }
            
            if (isSelected) {
              cellClasses += " bg-[#892580] text-white font-bold shadow-md scale-110";
            } 
            // NEW: Style for dates in multi-selection
            else if (isDateInSelection) {
              cellClasses += " bg-purple-200 border-2 border-[#892580] text-[#892580] font-bold";
            }
            
            // Availability indicators - small dots under the date
            let availabilityIndicator = null;
            if (date.isCurrentMonth && !isPastDate) {
              if (date.fullyBooked) {
                availabilityIndicator = <div className="absolute w-1.5 h-1.5 rounded-full bg-red-500"></div>;
              }
            }
            
            return (
              <div 
                key={index}
                className="text-center py-1 relative"
              >
                <div 
                  className={cellClasses}
                  onClick={() => handleDateSelect(date)}
                >
                  {date.day}
                </div>
                <div className="flex justify-center">
                  {availabilityIndicator}
                  {/* NEW: Indicator for selected dates */}
                  {isDateInSelection && !isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#892580]"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Calendar;