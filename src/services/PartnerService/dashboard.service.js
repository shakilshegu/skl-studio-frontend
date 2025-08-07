// services/partner/dashboardService.js
import axiosInstance from "../../config/axios.js";

// Get dashboard statistics (cards data)
export const getDashboardStats = async () => {
  try {
    const response = await axiosInstance.get(`/partner/dashboard/stats`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching dashboard statistics');
  }
};

// Get revenue analytics data for charts
export const getRevenueAnalytics = async (params = {}) => {
  try {
    const { timeRange = 'monthly', year, month } = params;
    const queryParams = new URLSearchParams();
    
    queryParams.append('timeRange', timeRange);
    if (year) queryParams.append('year', year);
    if (month) queryParams.append('month', month);

    const response = await axiosInstance.get(`/partner/dashboard/revenue-analytics?${queryParams}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching revenue analytics');
  }
};

// Get bookings data for table
export const getBookingsData = async (params = {}) => {
  try {
    const { type = 'current', page = 1, limit = 10 } = params;
    const queryParams = new URLSearchParams({
      type,
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await axiosInstance.get(`/partner/dashboard/bookings?${queryParams}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching bookings data');
  }
};

// Get current bookings
export const getCurrentBookings = async (params = {}) => {
  try {
    const { page = 1, limit = 5 } = params;
    return await getBookingsData({ type: 'current', page, limit });
  } catch (error) {
    throw new Error('Error fetching current bookings');
  }
};

// Get upcoming bookings
export const getUpcomingBookings = async (params = {}) => {
  try {
    const { page = 1, limit = 5 } = params;
    return await getBookingsData({ type: 'upcoming', page, limit });
  } catch (error) {
    throw new Error('Error fetching upcoming bookings');
  }
};

// Get complete dashboard data (all data in one call)
export const getDashboardData = async () => {
  try {
    const response = await axiosInstance.get(`/partner/dashboard/complete-data`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching complete dashboard data');
  }
};

// Get revenue analytics with specific time range
export const getWeeklyRevenue = async (year, month) => {
  try {
    return await getRevenueAnalytics({ timeRange: 'weekly', year, month });
  } catch (error) {
    throw new Error('Error fetching weekly revenue');
  }
};

export const getMonthlyRevenue = async (year, month) => {
  try {
    return await getRevenueAnalytics({ timeRange: 'monthly', year, month });
  } catch (error) {
    throw new Error('Error fetching monthly revenue');
  }
};

export const getYearlyRevenue = async (year) => {
  try {
    return await getRevenueAnalytics({ timeRange: 'yearly', year });
  } catch (error) {
    throw new Error('Error fetching yearly revenue');
  }
};

