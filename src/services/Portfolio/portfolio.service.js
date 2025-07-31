import axiosInstance from "@/config/axios";

// Fetch all portfolio
export const getPortfolios = async () => {
  try {
    const response = await axiosInstance.get('/partner/portfolio');
    return response.data;
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    throw error;
  }
};

// Fetch  portfolio by id
export const getPortfolioById = async (id) => {
  try {
    const response = await axiosInstance.get(`/partner/portfolio/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    throw error;
  }
};

// Add a new team member
export const addPortfolio = async (formData) => {
  try {
    const response = await axiosInstance.post("/partner/portfolio", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding team member:", error);
    throw error;
  }
};

export const updatePortfolio = async (id, formData) => {
    try {
      
      const response = await axiosInstance.put(`/partner/portfolio/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating portfolio with ID ${id}:`, error);
      throw error;
    }
  };

// Delete a team member
export const deletePortfolio = async (id) => {
  try {
    
    
    const response = await axiosInstance.delete(`/partner/portfolio/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting team member with ID ${id}:`, error);
    throw error;
  }
};
