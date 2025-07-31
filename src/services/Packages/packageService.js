import axiosInstance from "../../config/axios.js";

// Fetch all packages
export const getPackages = async () => {
  try {
    const response = await axiosInstance.get('/partner/package');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch packages');
  }
};

// Create a new package
export const createPackage = async (packageData) => {
  try {
    
    const response = await axiosInstance.post('/partner/package', packageData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for FormData
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create package');
  }
};

// Update an existing package
export const updatePackage = async ({ id, data }) => {
  try {
    const response = await axiosInstance.put(`/partner/package/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for FormData
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update package');
  }
};

// Delete a package
export const deletePackage = async (id) => {
  try {
    await axiosInstance.delete(`/partner/package/${id}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete package');
  }
};