import axiosInstance from "../../config/axios.js";

// Get calendar bookings with optional filters
export const getCalendarBookings = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add parameters if they exist
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.entityType) queryParams.append('entityType', params.entityType);
    if (params.entityId) queryParams.append('entityId', params.entityId);
    if (params.status) {
      if (Array.isArray(params.status)) {
        params.status.forEach(s => queryParams.append('status', s));
      } else {
        queryParams.append('status', params.status);
      }
    }
    if (params.paymentStatus) {
      if (Array.isArray(params.paymentStatus)) {
        params.paymentStatus.forEach(ps => queryParams.append('paymentStatus', ps));
      } else {
        queryParams.append('paymentStatus', params.paymentStatus);
      }
    }
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const url = `/partner/calender/bookings${queryString ? `?${queryString}` : ''}`;
    
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching calendar bookings:', error);
    throw new Error(error.response?.data?.message || 'Error fetching calendar bookings');
  }
};

// Get bookings for a specific date
export const getBookingsByDate = async (date, entityType = null, entityId = null) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('date', date);
    
    if (entityType) queryParams.append('entityType', entityType);
    if (entityId) queryParams.append('entityId', entityId);

    const response = await axiosInstance.get(`/partner/calender/bookings/date?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings by date:', error);
    throw new Error(error.response?.data?.message || 'Error fetching bookings by date');
  }
};

// Get booking details by ID
export const getBookingDetails = async (bookingId) => {
  try {
    const response = await axiosInstance.get(`/partner/calender/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw new Error(error.response?.data?.message || 'Error fetching booking details');
  }
};

// Fetch all team members
export const fetchTeamMembers = async () => {
  try {
    const response = await axiosInstance.get('/partner/team-member');
    return response.data;
  } catch (error) {
    console.error("Error fetching team members:", error);
    throw error;
  }
};