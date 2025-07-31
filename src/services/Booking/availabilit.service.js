

//using entity

import axiosInstance from "@/config/axios";
import moment from "moment";

// API function to get partner availability month range (dynamic for studio or freelancer) // slot timings avai/unavai are shown with this
export const getPartnerAvailabilityRange = async (entityId, entityType, startDate, endDate) => {
  try {    

    const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(endDate).toISOString().split('T')[0];
    
    const response = await axiosInstance.get(
      `/user/availability/${entityType}/${entityId}/range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );

    
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${entityType} availability range:`, error);
    throw error;
  }
};

// API function to get partner availability for specific date - slots (dynamic for studio or freelancer)
export const getPartnerAvailability = async (entityId, entityType, date) => {
  try {
    
    // Format date using moment for consistency
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const response = await axiosInstance.get(
      `/user/availability/${entityType}/${entityId}?date=${formattedDate}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${entityType} availability:`, error);
    throw error;
  }
};

// API function to add to cart (no changes needed here)
// export const addToCartAPI = async (data) => {
  //   try {
    //     const response = await axiosInstance.post('/studio-slots/addToCart', data);
//     return response.data;
//   } catch (error) {
//     throw new Error('Error adding to cart');
//   }
// };
