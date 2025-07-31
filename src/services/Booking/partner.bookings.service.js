// services/Booking/entity.bookings.service.js

import axiosInstance from "@/config/axios";


// Get bookings for authenticated entity
export const getMyBookings = async () => {
  try {
    const response = await axiosInstance.get('/partner/bookings');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
  }
};

// Update booking status
export const updateBookingStatus = async (bookingId, status, notes = '') => {
  try {
    const response = await axiosInstance.patch(`/bookings/${bookingId}/status`, {
      status,
      notes
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update booking status');
  }
};

// Get single booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const response = await axiosInstance.get(`/partner/bookings/${bookingId}`);
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch booking');
  }
};


export const assignWorkOrder = async (bookingId, assignedTo, notes)=>{

  try {
    const response = await axiosInstance.post(`/partner/bookings/assign/${bookingId}`,{assignedTo,notes})
    return response.data
  } catch (error) {
    throw error
    
  }
}






// Get booking statistics for dashboard
export const getBookingStats = async () => {
  try {
    const response = await axiosInstance.get('/partner/bookings/statistics');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch booking statistics');
  }
};
// request booking cancellation to admin
export const requestCancellation = async (bookingId,status= 'requested') => {
  try {
    const response = await axiosInstance.patch(`/partner/bookings/${bookingId}/cancel-request`,{status});
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch booking statistics');
  }
};

