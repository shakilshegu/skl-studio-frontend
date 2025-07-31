 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getCalendarBookings, 
  getBookingsByDate, 
  getBookingDetails, 
} from "../services/PartnerService/calender.service";
import { fetchTeamMembers } from "../services/TeamMembers/teamMember.service";

// Hook for fetching calendar bookings
export const useCalendarBookings = (params = {}) => {
  return useQuery({
    queryKey: ['calendarBookings', params],
    queryFn: () => getCalendarBookings(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for fetching bookings by specific date
export const useBookingsByDate = (date, entityType = null, entityId = null, enabled = true) => {
  return useQuery({
    queryKey: ['bookingsByDate', date, entityType, entityId],
    queryFn: () => getBookingsByDate(date, entityType, entityId),
    enabled: enabled && !!date,
    staleTime: 1000 * 60 * 2, // 2 minutes
    cacheTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for fetching specific booking details
export const useBookingDetails = (bookingId, enabled = true) => {
  return useQuery({
    queryKey: ['bookingDetails', bookingId],
    queryFn: () => getBookingDetails(bookingId),
    enabled: enabled && !!bookingId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook for fetching team members
export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['teamMembers'],
    queryFn: fetchTeamMembers,
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });
};

// Hook for calendar bookings with date range
export const useCalendarBookingsForMonth = (currentDate, searchTerm = '') => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const params = {
    startDate: firstDay.toISOString().split('T')[0],
    endDate: lastDay.toISOString().split('T')[0],
    limit: 100,
  };

  if (searchTerm) {
    params.search = searchTerm;
  }

  return useCalendarBookings(params);
};

// Hook for prefetching next/previous month data
export const usePrefetchCalendarData = () => {
  const queryClient = useQueryClient();

  const prefetchMonth = (date, searchTerm = '') => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const params = {
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0],
      limit: 100,
    };

    if (searchTerm) {
      params.search = searchTerm;
    }

    queryClient.prefetchQuery({
      queryKey: ['calendarBookings', params],
      queryFn: () => getCalendarBookings(params),
      staleTime: 1000 * 60 * 5,
    });
  };

  return { prefetchMonth };
};

// Helper hook to invalidate booking-related queries
export const useInvalidateBookingQueries = () => {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['calendarBookings'] });
    queryClient.invalidateQueries({ queryKey: ['bookingsByDate'] });
    queryClient.invalidateQueries({ queryKey: ['bookingDetails'] });
  };

  const invalidateCalendar = () => {
    queryClient.invalidateQueries({ queryKey: ['calendarBookings'] });
  };

  const invalidateBookingDetails = (bookingId) => {
    queryClient.invalidateQueries({ queryKey: ['bookingDetails', bookingId] });
  };

  const invalidateDate = (date) => {
    queryClient.invalidateQueries({ queryKey: ['bookingsByDate', date] });
  };

  return {
    invalidateAll,
    invalidateCalendar,
    invalidateBookingDetails,
    invalidateDate,
  };
};