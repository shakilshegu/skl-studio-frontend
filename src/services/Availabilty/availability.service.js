



import axiosInstance from "@/config/axios";

/**
 * Get partner availability for a date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Object>} Response containing availability data
 */
export const getPartnerAvailability = async (startDate, endDate) => {
  try {
    const response = await axiosInstance.get('/partner/availability', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching availability:', error);
    throw error;
  }
};

/**
 * Get availability for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Response containing date availability data
 */
export const getAvailabilityByDate = async (date) => {
  try {
    const response = await axiosInstance.get(`/partner/availability/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching date availability:', error);
    throw error;
  }
};

/**
 * Set availability for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Array<string>} unavailableSlots - Array of unavailable time slot IDs
 * @returns {Promise<Object>} Response containing updated availability data
 */
export const setAvailability = async (date, unavailableSlots) => {
  try {
    const response = await axiosInstance.post('/partner/availability', {
      date,
      unavailableSlots
    });
    return response.data;
  } catch (error) {
    console.error('Error setting availability:', error);
    throw error;
  }
};

/**
 * Update availability for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Array<string>} unavailableSlots - Array of unavailable time slot IDs
 * @returns {Promise<Object>} Response containing updated availability data
 */
export const updateAvailability = async (date, unavailableSlots) => {
  try {
    
    const response = await axiosInstance.patch(`/partner/availability/${date}`, {
      unavailableSlots
    });
    return response.data;
  } catch (error) {
    console.error('Error updating availability:', error);
    throw error;
  }
};

/**
 * Get available time slots for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Response containing available slots data
 */
export const getAvailableSlots = async (date) => {
  try {
    const params = { date };
    const response = await axiosInstance.get('/partner/availability/available-slots', {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching available slots:', error);
    throw error;
  }
};