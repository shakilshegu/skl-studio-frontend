// services/paymentRequestService.js

import axiosInstance from "@/config/axios";


  // Create new payment request
  export const createRequest = async (requestData) => {
    try {
        const response = await axiosInstance.post('/partner/payment-requests', requestData);
        return response.data;
    } catch (error) {
        throw error
    }
}

// Get payment requests for specific booking
export const getRequestsByBooking = async (bookingId) => {
    try {
        const response = await axiosInstance.get(`/partner/payment-requests/booking/${bookingId}`);
        return response.data;  
    } catch (error) {
        throw error
    }

  }

  // Cancel payment request
  export const cancelRequest = async (requestId, reason) => {
    try {
        const response = await axiosInstance.patch(`/partner/payment-requests/${requestId}/cancel`, {
            reason
          });
          return response.data;  
    } catch (error) {
        throw error
    }

  }
