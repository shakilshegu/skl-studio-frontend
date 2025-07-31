"use client"

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, X, Check, CalendarDays, RefreshCw, Users } from 'lucide-react';
import moment from 'moment';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { getAvailabilityByDate, getAvailableSlots, getPartnerAvailability, setAvailability, updateAvailability } from '@/services/Availabilty/availability.service';

export default function AvailabilityCalendar() {
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]); // These are UNAVAILABLE slots
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showAvailableSlots, setShowAvailableSlots] = useState(false);
  const [saveError, setSaveError] = useState(null);
  
  const queryClient = useQueryClient();
  
  // Check if a date is in the past
  const isPastDate = (date) => {
    return date.isBefore(moment().startOf('day'));
  };
  
  // Check if a time slot is in the past
  const isPastTimeSlot = (slot, date) => {
    if (isPastDate(date)) return true;
    
    if (date.isSame(moment(), 'day')) {
      const currentHour = moment().hour();
      const slotHour = parseInt(slot.split(':')[0]);
      return slotHour <= currentHour;
    }
    
    return false;
  };
  
  // Generate time slots (1-hour intervals)
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const startHour = 8 + i;
    const endHour = startHour + 1;
    const startTime = `${startHour < 10 ? '0' + startHour : startHour}:00`;
    const endTime = `${endHour < 10 ? '0' + endHour : endHour}:00`;
    
    return {
      id: startTime,
      startTime: startTime,
      endTime: endTime,
      display: `${moment(startTime, 'HH:mm').format('h:mm A')} - ${moment(endTime, 'HH:mm').format('h:mm A')}`
    };
  });

  // Query key for the current month's availability
  const monthKey = [
    'availability', 
    'month', 
    moment(currentDate).startOf('month').format('YYYY-MM-DD'),
    moment(currentDate).endOf('month').format('YYYY-MM-DD')
  ];

  // Query for monthly availability
  const { data: monthlyAvailability, isLoading: isLoadingMonth, refetch: refetchMonth } = useQuery({
    queryKey: monthKey,
    queryFn: async () => {
      const startDate = moment(currentDate).startOf('month').format('YYYY-MM-DD');
      const endDate = moment(currentDate).endOf('month').format('YYYY-MM-DD');
      
      try {
        const response = await getPartnerAvailability(startDate, endDate);
        if (response.success) {
          console.log('Monthly availability API response:', response.data);
          
          // Transform the data to ensure consistency
          const transformedData = {};
          Object.keys(response.data).forEach(dateKey => {
            const dayData = response.data[dateKey];
            
            // Log the raw data for debugging
            console.log(`Raw data for ${dateKey}:`, dayData);
            
            transformedData[dateKey] = {
              ...dayData,
              // Ensure unavailableSlots is an array of strings
              unavailableSlots: Array.isArray(dayData.unavailableSlots) ? dayData.unavailableSlots : [],
              availableSlots: Array.isArray(dayData.availableSlots) ? dayData.availableSlots : []
            };
            
            // Log the transformed data
            console.log(`Transformed data for ${dateKey}:`, transformedData[dateKey]);
          });
          
          console.log('Transformed monthly data:', transformedData);
          return transformedData;
        }
        throw new Error('Failed to fetch availability');
      } catch (error) {
        if (error.response?.status === 401) {
          throw new Error('Authentication required');
        } else if (error.response?.status === 403) {
          throw new Error('You do not have permission to view this data');
        } else {
          throw new Error('Failed to fetch availability');
        }
      }
    },
    retry: 2,
    staleTime: 30 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Query key for selected date's availability
  const dateKey = selectedDate ? ['availability', 'date', selectedDate.format('YYYY-MM-DD')] : null;

  // Query for specific date availability
  const { data: dateAvailability, isLoading: isLoadingDate, refetch: refetchDateAvailability } = useQuery({
    queryKey: dateKey,
    queryFn: async () => {
      if (!selectedDate) return null;
      
      const dateFormatted = selectedDate.format('YYYY-MM-DD');
      
      // ALWAYS check monthly data first - if it exists, use it
      if (monthlyAvailability && monthlyAvailability[dateFormatted]) {
        console.log(`[${selectedDate.format('MM-DD')}] Using monthly data instead of individual query`);
        return monthlyAvailability[dateFormatted];
      }
      
      // Only query individual date if we don't have monthly data
      try {
        const response = await getAvailabilityByDate(dateFormatted);
        if (response.success) {
          return {
            ...response.data,
            unavailableSlots: response.data.unavailableSlots || [],
            availableSlots: response.data.availableSlots || []
          };
        }
        throw new Error('Failed to fetch date availability');
      } catch (error) {
        if (error.response?.status === 404) {
          return { unavailableSlots: [], availableSlots: [], isFullyBooked: false };
        }
        throw error;
      }
    },
    enabled: !!selectedDate,
    // ALWAYS use monthly data as initial data if available
    initialData: () => {
      if (!selectedDate) return undefined;
      const dateStr = selectedDate.format('YYYY-MM-DD');
      const monthlyData = monthlyAvailability?.[dateStr];
      
      if (monthlyData) {
        console.log(`[${selectedDate.format('MM-DD')}] Using monthly data as initial data`);
        return monthlyData;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  
  // Query for available slots (for bookings) for the selected date
  const availableSlotsKey = selectedDate && showAvailableSlots ? 
    ['availability', 'available-slots', selectedDate.format('YYYY-MM-DD')] : null;
    
  const { data: availableSlots, isLoading: isLoadingAvailableSlots } = useQuery({
    queryKey: availableSlotsKey,
    queryFn: async () => {
      if (!selectedDate) return null;
      
      const dateFormatted = selectedDate.format('YYYY-MM-DD');
      try {
        const response = await getAvailableSlots(dateFormatted);
        if (response.success) {
          // Transform available slots to match the format expected by frontend
          const slots = response.data.availableSlots || [];
          
          // Handle different response formats
          const formattedSlots = slots.map(slot => {
            // If slot is just a string (like "08:00"), convert to object
            if (typeof slot === 'string') {
              const startHour = parseInt(slot.split(':')[0]);
              const endHour = startHour + 1;
              const endTime = `${endHour < 10 ? '0' + endHour : endHour}:00`;
              return {
                id: slot,
                startTime: slot,
                endTime: endTime,
                display: `${moment(slot, 'HH:mm').format('h:mm A')} - ${moment(endTime, 'HH:mm').format('h:mm A')}`
              };
            }
            return slot;
          });
          
          return {
            ...response.data,
            availableSlots: formattedSlots
          };
        }
        throw new Error('Failed to fetch available slots');
      } catch (error) {
        if (error.response?.status === 404) {
          return { availableSlots: [] };
        }
        throw error;
      }
    },
    enabled: !!selectedDate && showAvailableSlots,
    staleTime: 60 * 1000,
  });

  // Mutation for saving availability
  const { mutate: saveAvailability, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      if (!selectedDate) throw new Error('No date selected');
      
      setSaveError(null);
      const dateKey = selectedDate.format('YYYY-MM-DD');
      
      const dateExists = dateAvailability !== null && dateAvailability !== undefined;
      
      try {
        console.log('Saving unavailable slots:', selectedTimeSlots);
        
        let response;
        if (dateExists) {
          response = await updateAvailability(dateKey, selectedTimeSlots);
        } else {
          response = await setAvailability(dateKey, selectedTimeSlots);
        }
        
        if (response.success) {
          // Transform the response to ensure consistency
          return {
            ...response.data,
            unavailableSlots: response.data.unavailableSlots || [],
            availableSlots: response.data.availableSlots || []
          };
        }
        throw new Error('Failed to save availability');
      } catch (error) {
        if (error.response?.status === 403) {
          throw new Error('You do not have permission to update this data');
        } else if (error.response?.status === 409) {
          throw new Error('Another update was made to this date. Please refresh and try again.');
        } else {
          throw new Error('Failed to save availability: ' + (error.response?.data?.message || error.message));
        }
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries(dateKey);
      const previousData = queryClient.getQueryData(dateKey);
      
      if (selectedDate) {
        const dateStr = selectedDate.format('YYYY-MM-DD');
        const optimisticData = {
          date: dateStr,
          unavailableSlots: selectedTimeSlots,
          availableSlots: timeSlots
            .filter(slot => !selectedTimeSlots.includes(slot.id))
            .map(slot => slot.id),
          isFullyBooked: selectedTimeSlots.length === timeSlots.length,
          version: dateAvailability?.version || 1
        };
        
        queryClient.setQueryData(dateKey, optimisticData);
        queryClient.setQueryData(monthKey, (oldData) => ({
          ...oldData,
          [dateStr]: optimisticData
        }));
      }
      
      return { previousData };
    },
    onSuccess: (data) => {
      if (selectedDate) {
        const dateStr = selectedDate.format('YYYY-MM-DD');
        
        queryClient.setQueryData(monthKey, (oldData) => ({
          ...oldData,
          [dateStr]: data
        }));
        
        queryClient.setQueryData(dateKey, data);
        
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
        
        refetchMonth();
      }
    },
    onError: (error, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(dateKey, context.previousData);
      }
      
      setSaveError(error.message || 'An error occurred while saving');
      setTimeout(() => setSaveError(null), 4000);
    }
  });
  
  // Create a debounced save function
  const debouncedSave = debounce(() => {
    if (selectedDate && !isPastDate(selectedDate)) {
      saveAvailability();
    }
  }, 800);
  
  // Update selected time slots when dateAvailability changes
  useEffect(() => {
    if (!selectedDate) return;
    
    console.log(`[${selectedDate.format('MM-DD')}] DateAvailability:`, dateAvailability);
    console.log(`[${selectedDate.format('MM-DD')}] Unavailable slots from dateAvailability:`, dateAvailability?.unavailableSlots || []);
    
    // Only update if we have actual data
    if (dateAvailability?.unavailableSlots !== undefined) {
      setSelectedTimeSlots(dateAvailability.unavailableSlots || []);
    } else if (dateAvailability?.timeSlots) {
      // If we have timeSlots data directly, extract unavailable ones
      const unavailableFromTimeSlots = dateAvailability.timeSlots
        .filter(slot => !slot.isAvailable)
        .map(slot => slot.startTime);
      
      console.log(`[${selectedDate.format('MM-DD')}] Extracted from timeSlots:`, unavailableFromTimeSlots);
      setSelectedTimeSlots(unavailableFromTimeSlots);
    }
  }, [dateAvailability, selectedDate]);
  
  // Effect to update data when month changes
  useEffect(() => {
    setSelectedDate(null);
    refetchMonth();
  }, [currentDate, refetchMonth]);
  
  // Generate calendar data
  const generateCalendarData = () => {
    const startOfMonth = moment(currentDate).startOf('month');
    const endOfMonth = moment(currentDate).endOf('month');
    const startDate = moment(startOfMonth).startOf('week');
    const endDate = moment(endOfMonth).endOf('week');
    
    const calendarDays = [];
    let day = startDate.clone();
    
    while (day.isSameOrBefore(endDate, 'day')) {
      calendarDays.push({
        date: day.clone(),
        isCurrentMonth: day.month() === currentDate.month(),
        isToday: day.isSame(moment(), 'day'),
        isSelected: selectedDate && day.isSame(selectedDate, 'day'),
        isPast: isPastDate(day)
      });
      day.add(1, 'day');
    }
    
    return calendarDays;
  };
  
  // Enhanced handleDateSelect with proper cache invalidation
  const handleDateSelect = (date) => {
    const dateKey = date.format('YYYY-MM-DD');
    
    console.log('Selecting date:', dateKey);
    
    setSelectedDate(date);
    setSaveError(null);
    setShowAvailableSlots(false);
    
    // Clear any cached data for this date to force fresh fetch
    const newDateKey = ['availability', 'date', dateKey];
    queryClient.removeQueries(newDateKey);
    
    // Set slots from monthly data immediately if available
    if (monthlyAvailability && monthlyAvailability[dateKey]) {
      const monthlyDataForDate = monthlyAvailability[dateKey];
      console.log('Using monthly data for date:', monthlyDataForDate);
      console.log('Monthly data unavailableSlots:', monthlyDataForDate.unavailableSlots);
      
      // Check if unavailableSlots exists and is an array
      if (monthlyDataForDate.unavailableSlots && Array.isArray(monthlyDataForDate.unavailableSlots)) {
        setSelectedTimeSlots(monthlyDataForDate.unavailableSlots);
      } else {
        // Fallback: don't set any slots, let the dateAvailability query handle it
        console.log('Monthly data missing unavailableSlots, waiting for fresh fetch');
        // setSelectedTimeSlots([]);
      }
    } else {
      console.log('No monthly data for date, starting with empty');
      setSelectedTimeSlots([]);
    }
  };
  
  const toggleTimeSlot = (slotId) => {
    console.log('Toggling slot:', slotId);
    
    if (selectedDate) {
      const slot = timeSlots.find(s => s.id === slotId);
      if (slot && isPastTimeSlot(slot, selectedDate)) {
        return;
      }
    }
    
    setSelectedTimeSlots(prev => {
      const newSlots = prev.includes(slotId)
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId];
      
      console.log('New unavailable slots:', newSlots);
      return newSlots;
    });
  };
  
  const blockEntireDay = () => {
    if (!selectedDate || isPastDate(selectedDate)) return;
    
    if (selectedDate.isSame(moment(), 'day')) {
      const futureSlots = timeSlots
        .filter(slot => !isPastTimeSlot(slot, selectedDate))
        .map(slot => slot.id);
      
      setSelectedTimeSlots(futureSlots);
    } else {
      setSelectedTimeSlots(timeSlots.map(slot => slot.id));
    }
  };
  
  const clearAllSlots = () => {
    if (!selectedDate || isPastDate(selectedDate)) return;
    
    if (selectedDate.isSame(moment(), 'day')) {
      const pastSlots = timeSlots
        .filter(slot => isPastTimeSlot(slot, selectedDate))
        .map(slot => slot.id);
      
      setSelectedTimeSlots(pastSlots);
    } else {
      setSelectedTimeSlots([]);
    }
  };
  
  const navigateMonth = (direction) => {
    setCurrentDate(prev => moment(prev).add(direction, 'month'));
  };
  
  const calendarDays = generateCalendarData();
  
  // Check if a date has any unavailable slots
  const getDateAvailability = (date) => {
    if (!monthlyAvailability) return 'unknown';
    
    const dateKey = date.format('YYYY-MM-DD');
    const dateData = monthlyAvailability[dateKey];
    
    if (!dateData) return 'unknown';
    
    // Check if isFullyBooked is explicitly set
    if (dateData.isFullyBooked === true) return 'fully-booked';
    
    // Fallback to checking unavailableSlots length
    if (dateData.unavailableSlots && dateData.unavailableSlots.length === timeSlots.length) return 'fully-booked';
    if (dateData.unavailableSlots && dateData.unavailableSlots.length > 0) return 'partially-booked';
    return 'available';
  };

  const isDateEditable = selectedDate && !isPastDate(selectedDate);
  const todayWithPastSlots = selectedDate && selectedDate.isSame(moment(), 'day');

  // Debug logging
  useEffect(() => {
    if (selectedDate) {
      console.log(`[${selectedDate.format('MM-DD')}] UI State - Blocked:`, selectedTimeSlots);
    }
  }, [selectedTimeSlots, selectedDate]);

  return (
    <div className="max-w-6xl w-full mx-auto overflow-hidden rounded-2xl shadow-xl bg-white">
      {/* Header */}
      <div className="bg-[#892580] text-white p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Availability Manager</h2>
          <div className="bg-[#c135b5] rounded-full px-4 py-1 text-sm font-medium">
            Partner Portal
          </div>
        </div>
        <p className="text-purple-200 mt-1">
          Block or unblock time slots for your availability
        </p>
      </div>
      
      {/* Calendar and Time Slots Container */}
      <div className="flex flex-col lg:flex-row">
        {/* Calendar Section */}
        <div className="w-full lg:w-3/5 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-xl font-medium text-gray-800">
              {currentDate.format('MMMM YYYY')}
            </div>
            <div className="flex space-x-1">
              <button 
                onClick={() => navigateMonth(-1)}
                className="p-2 rounded-full hover:bg-purple-100 text-[#892580] transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => refetchMonth()}
                className="p-2 rounded-full hover:bg-purple-100 text-[#892580] transition-all"
              >
                <RefreshCw size={18} className={isLoadingMonth ? "animate-spin" : ""} />
              </button>
              <button 
                onClick={() => navigateMonth(1)}
                className="p-2 rounded-full hover:bg-purple-100 text-[#892580] transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            
            {calendarDays.map((day, idx) => {
              const availability = day.isCurrentMonth ? getDateAvailability(day.date) : null;
              
              return (
                <div
                  key={idx}
                  onClick={() => day.isCurrentMonth && handleDateSelect(day.date)}
                  className={`
                    relative h-16 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all
                    ${!day.isCurrentMonth ? 'text-gray-300' : 'hover:bg-purple-50'} 
                    ${day.isPast ? 'bg-gray-50 text-gray-400' : ''}
                    ${day.isToday ? 'border border-purple-500' : ''}
                    ${day.isSelected ? 'bg-purple-100 text-[#c135b5]' : ''}
                  `}
                >
                  <span className={`
                    flex items-center justify-center w-8 h-8 rounded-full
                    ${day.isSelected ? 'bg-[#892580] text-white' : ''}
                  `}>
                    {day.date.date()}
                  </span>
                  
                  {day.isCurrentMonth && availability !== 'unknown' && (
                    <div className={`
                      absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1.5 w-1.5 rounded-full
                      ${availability === 'fully-booked' ? 'bg-red-500' : ''}
                      ${availability === 'partially-booked' ? 'bg-amber-400' : ''}
                      ${availability === 'available' ? 'bg-green-500' : ''}
                    `}></div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="mt-6 flex items-center justify-center space-x-6 text-xs">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-amber-400 mr-2"></div>
              <span className="text-gray-600">Partially Blocked</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-gray-600">Fully Blocked</span>
            </div>
          </div>
        </div>
        
        {/* Time Slots Section */}
        <div className="w-full lg:w-2/5 p-6 bg-gray-50">
          {selectedDate ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {selectedDate.format('dddd')}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedDate.format('MMMM D, YYYY')}</p>
                </div>
                {isDateEditable && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={blockEntireDay}
                      className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition-colors"
                    >
                      Block All
                    </button>
                    <button 
                      onClick={clearAllSlots}
                      className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition-colors"
                    >
                      Unblock All
                    </button>
                    {/* <button 
                      onClick={() => setShowAvailableSlots(prev => !prev)}
                      className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors flex items-center"
                    >
                      <Users size={14} className="mr-1" />
                      {showAvailableSlots ? "Hide Bookings" : "Show Bookings"}
                    </button> */}
                  </div>
                )}
              </div>
              
              {isPastDate(selectedDate) && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-md mb-4">
                  <p className="text-sm">This date is in the past. Availability can only be viewed.</p>
                </div>
              )}
              
              {todayWithPastSlots && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md mb-4">
                  <p className="text-sm">Past time slots from today cannot be modified.</p>
                </div>
              )}
              
              {saveError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                  <p className="text-sm">{saveError}</p>
                </div>
              )}
              
              <div className="text-sm text-gray-500 mb-4">
                {isDateEditable 
                  ? "Toggle each slot to mark as blocked (unavailable) or unblocked (available):"
                  : "Availability for this date:"}
              </div>
              
              {/* Debug info */}
              {/* {process.env.NODE_ENV === 'development' && selectedDate && (
                <div className="bg-gray-100 p-2 mb-4 text-xs">
                  <p>Debug: Unavailable slots: [{selectedTimeSlots.join(', ')}]</p>
                  <p>Debug: Date availability: {JSON.stringify(dateAvailability?.unavailableSlots)}</p>
                </div>
              )} */}
              
              {isLoadingDate || (showAvailableSlots && isLoadingAvailableSlots) ? (
                <div className="flex justify-center py-10">
                  <RefreshCw size={24} className="animate-spin text-purple-500" />
                </div>
              ) : showAvailableSlots ? (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md mb-2">
                    <p className="text-sm font-medium">Showing available slots for client bookings</p>
                  </div>
                  
                  {availableSlots && availableSlots.availableSlots && availableSlots.availableSlots.length > 0 ? (
                    availableSlots.availableSlots.map((slot, index) => (
                      <div 
                        key={slot.id || slot.startTime || index}
                        className="flex items-center p-3 rounded-lg transition-all bg-blue-50 border border-blue-200 text-blue-800"
                      >
                        <Users size={16} className="mr-2 text-blue-500" />
                        <span>{slot.display || `${slot.startTime || slot} - ${slot.endTime || ''}`}</span>
                        <div className="ml-auto flex items-center text-blue-600 text-xs font-medium">
                          <Check size={16} className="mr-1" />
                          Available for Booking
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No available slots for bookings on this day
                    </div>
                  )}
                  
                  <button 
                    onClick={() => setShowAvailableSlots(false)}
                    className="mt-4 w-full py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
                  >
                    Return to Availability Management
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {timeSlots.map(slot => {
                    const isPast = isPastTimeSlot(slot, selectedDate);
                    const isUnavailable = selectedTimeSlots.includes(slot.id);
                    
                    return (
                      <div 
                        key={slot.id}
                        onClick={() => !isPast && toggleTimeSlot(slot.id)}
                        className={`
                          flex items-center p-3 rounded-lg transition-all
                          ${isPast ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'cursor-pointer'}
                          ${isUnavailable 
                            ? 'bg-red-50 border border-red-200 text-red-800' 
                            : 'bg-white border border-green-200 hover:bg-purple-50 text-gray-700'}
                        `}
                      >
                        <Clock size={16} className={`mr-2 ${
                          isPast 
                            ? 'text-gray-400' 
                            : (isUnavailable ? 'text-red-500' : 'text-green-500')
                        }`} />
                        <span>{slot.display}</span>
                        {isUnavailable ? (
                          <div className="ml-auto flex items-center text-red-600 text-xs font-medium">
                            <X size={16} className="mr-1" />
                            Blocked
                          </div>
                        ) : (
                          <div className="ml-auto flex items-center text-green-600 text-xs font-medium">
                            <Check size={16} className="mr-1" />
                            Available
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {isDateEditable && !showAvailableSlots && (
                <button 
                  onClick={() => saveAvailability()}
                  disabled={isSaving || isPastDate(selectedDate)}
                  className={`
                    mt-6 w-full py-2.5 rounded-lg font-medium flex items-center justify-center transition-all
                    ${saveSuccess ? 'bg-green-500 text-white' : 'bg-[#892580] text-white hover:bg-purple-700'}
                    ${isSaving || isPastDate(selectedDate) ? 'opacity-75 cursor-not-allowed' : ''}
                  `}
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : saveSuccess ? (
                    <span className="flex items-center">
                      <Check size={16} className="mr-2" />
                      Availability Updated
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <CalendarDays size={16} className="mr-2" />
                      Update Availability
                    </span>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Calendar size={48} className="mb-3 text-purple-300" />
              <p className="text-center">
                Select a date from the calendar<br />to manage your availability
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}