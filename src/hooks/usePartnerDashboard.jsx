// hooks/useDashboard.js
import { useQuery, useQueries } from '@tanstack/react-query';
import {
  getDashboardStats,
  getRevenueAnalytics,
  getBookingsData,
  getDashboardData,
  getCurrentBookings,
  getUpcomingBookings,
  getWeeklyRevenue,
  getMonthlyRevenue,
  getYearlyRevenue
} from '../services/PartnerService/dashboard.service';

// Query keys for caching
export const dashboardKeys = {
  all: ['dashboard'],
  stats: () => [...dashboardKeys.all, 'stats'],
  revenue: (params) => [...dashboardKeys.all, 'revenue', params],
  bookings: (params) => [...dashboardKeys.all, 'bookings', params],
  completeData: () => [...dashboardKeys.all, 'complete'],
};

// Main dashboard hook - gets all data in one call (most efficient)
export const useDashboard = (options = {}) => {
  return useQuery({
    queryKey: dashboardKeys.completeData(),
    queryFn: getDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    ...options
  });
};

// Individual hooks for specific data
export const useDashboardStats = (options = {}) => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    ...options
  });
};

export const useRevenueAnalytics = (params = {}, options = {}) => {
  const { timeRange = 'monthly', year, month } = params;
  
  return useQuery({
    queryKey: dashboardKeys.revenue({ timeRange, year, month }),
    queryFn: () => getRevenueAnalytics(params),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!timeRange, // Only run if timeRange is provided
    ...options
  });
};

export const useBookingsData = (params = {}, options = {}) => {
  const { type = 'current', page = 1, limit = 10 } = params;
  
  return useQuery({
    queryKey: dashboardKeys.bookings({ type, page, limit }),
    queryFn: () => getBookingsData(params),
    staleTime: 2 * 60 * 1000, // 2 minutes for bookings (more dynamic data)
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    keepPreviousData: true, // For pagination
    ...options
  });
};

export const useCurrentBookings = (params = {}, options = {}) => {
  return useBookingsData({ ...params, type: 'current' }, options);
};

export const useUpcomingBookings = (params = {}, options = {}) => {
  return useBookingsData({ ...params, type: 'upcoming' }, options);
};

// Hook for multiple time ranges at once
export const useMultipleRevenueData = (timeRanges = [], options = {}) => {
  return useQueries({
    queries: timeRanges.map(params => ({
      queryKey: dashboardKeys.revenue(params),
      queryFn: () => getRevenueAnalytics(params),
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 2,
      ...options
    }))
  });
};

// Specific time range hooks
export const useWeeklyRevenue = (year, month, options = {}) => {
  return useQuery({
    queryKey: dashboardKeys.revenue({ timeRange: 'weekly', year, month }),
    queryFn: () => getWeeklyRevenue(year, month),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!(year && month),
    ...options
  });
};

export const useMonthlyRevenue = (year, month, options = {}) => {
  return useQuery({
    queryKey: dashboardKeys.revenue({ timeRange: 'monthly', year, month }),
    queryFn: () => getMonthlyRevenue(year, month),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!(year && month),
    ...options
  });
};

export const useYearlyRevenue = (year, options = {}) => {
  return useQuery({
    queryKey: dashboardKeys.revenue({ timeRange: 'yearly', year }),
    queryFn: () => getYearlyRevenue(year),
    staleTime: 10 * 60 * 1000, // Yearly data changes less frequently
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!year,
    ...options
  });
};

// Combined hook for dashboard with real-time updates
export const useDashboardWithRealTime = (refreshInterval = 0, options = {}) => {
  return useQuery({
    queryKey: dashboardKeys.completeData(),
    queryFn: getDashboardData,
    staleTime: 1 * 60 * 1000, // 1 minute for real-time
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: refreshInterval, // Pass interval for real-time updates
    retry: 2,
    ...options
  });
};

// Hook for dashboard with optimistic updates
export const useDashboardOptimistic = (options = {}) => {
  const query = useQuery({
    queryKey: dashboardKeys.completeData(),
    queryFn: getDashboardData,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    ...options
  });

  // Helper function to manually update cache
  const updateStats = (updater) => {
    query.queryClient.setQueryData(dashboardKeys.completeData(), (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        data: {
          ...oldData.data,
          stats: updater(oldData.data.stats)
        }
      };
    });
  };

  const updateBookings = (type, updater) => {
    query.queryClient.setQueryData(dashboardKeys.completeData(), (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        data: {
          ...oldData.data,
          [`${type}Bookings`]: updater(oldData.data[`${type}Bookings`])
        }
      };
    });
  };

  return {
    ...query,
    updateStats,
    updateBookings,
    invalidate: () => query.queryClient.invalidateQueries(dashboardKeys.all)
  };
};

// Default export with all hooks
const useDashboardHooks = {
  useDashboard,
  useDashboardStats,
  useRevenueAnalytics,
  useBookingsData,
  useCurrentBookings,
  useUpcomingBookings,
  useMultipleRevenueData,
  useWeeklyRevenue,
  useMonthlyRevenue,
  useYearlyRevenue,
  useDashboardWithRealTime,
  useDashboardOptimistic,
  dashboardKeys
};

export default useDashboardHooks;