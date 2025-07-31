// services/bookingApi.js

import axiosInstance from "@/config/axios";

export const getUserBookings = async () => {
  try {
    const response = await axiosInstance.get("/user/bookings");
  return response.data;
  }
 catch (error) {
  console.error(`Error fetching bookings`, error);
  throw error;
}
}
;

export const getBookingDetails = async (bookingId) => {
    try {        
        const response = await axiosInstance.get(`/user/bookings/${bookingId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching bookings`, error);
        throw error; 
    }

};

export const cancelBookingService = async (bookingId) => {
  try {
    const response = await axiosInstance.patch(`/user/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};