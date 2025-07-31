import axiosInstance from "../../config/axios.js";

// Fetch all helpers
export const fetchHelpers = async () => {
  try {
    const response = await axiosInstance.get('/partner/helper');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch helpers');
  }
};

// Create a new helper
export const addHelper= async (helperData) => {
  try {

    
    const response = await axiosInstance.post('/partner/helper', helperData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create helper');
  }
};

// Update an existing helper
export const updateHelper = async ({ id, data }) => {
  try {
    const response = await axiosInstance.put(`/partner/helper/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update helper');
  }
};

// Delete a helper
export const deleteHelper = async (id) => {
  try {
    await axiosInstance.delete(`/partner/helper/${id}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete helper');
  }
};