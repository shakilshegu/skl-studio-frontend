import axiosInstance from "../../config/axios.js";


//need to check ===============>>>>>>>>>>>>>>>>
export const fetchFreelancerById = async () => {
    try {
      const response = await axiosInstance.get(`/partner/freelancer`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching freelancer details');
    }
  }
export const fetchEventCategories = async () => {
    try {
      const response = await axiosInstance.get(`/partner/freelancer/event-categories`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching freelancer details');
    }
  }


// Add a new freelancer
export const addFreelancer = async (formData) => {
  try {
    const response = await axiosInstance.post('/partner/freelancer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding freelancer:', error);
    throw error;
  }
};

// Update an existing freelancer
export const updateFreelancer = async ( data ) => {
  try {
    const response = await axiosInstance.put(`/partner/freelancer`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating freelancer:', error);
    throw error;
  }
};


export const getFreelancerFilterDetails = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    console.log(filters,"===========FFFFFFFFFFFFF");
    
    // Only add non-empty filters to query params
    if (filters.search?.trim()) params.set('search', filters.search.trim());

    if (filters.searchLat) params.set('searchLat', filters.searchLat);
    if (filters.searchLng) params.set('searchLng', filters.searchLng);
    if (filters.lat) params.set('lat', filters.lat);
    if (filters.lng) params.set('lng', filters.lng);
    if (filters.radius && filters.radius < 50) params.set('radius', filters.radius);
    if (filters.minPrice && filters.minPrice > 0) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice && filters.maxPrice < 50000) params.set('maxPrice', filters.maxPrice);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    
    // Updated to use categoryId instead of category
    if (filters.category) params.set('categoryId', filters.category);
    
    if (filters.page) params.set('page', filters.page);
    if (filters.limit) params.set('limit', filters.limit);

    const queryString = params.toString();
    const url = `/user/freelancers${queryString ? `?${queryString}` : ''}`;

    
    const response = await axiosInstance.get(url);
    console.log(response.data,"======={{{{{{{{{{{{{{{{{{{{{{");
    
    return response.data;
  } catch (error) {
    console.error("Error fetching freelancer details", error);
    
    // Return empty result instead of throwing error
    return { 
      success: false,
      freelancers: [], 
      totalfreelancers: 0,
      message: error.response?.data?.message || error.message
    };
  }
};
// Get a single freelancer by ID
export const getFreelancerById = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/freelancers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching freelancer:', error);
    throw error;
  }
};

// Delete a freelancer
export const deleteFreelancer = async (id) => {
  try {
    const response = await axiosInstance.delete(`/partner/freelancer/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting freelancer:', error);
    throw error;
  }
};


//-----------------------------------------------------------------------------

export const getFreelancerServices = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/freelancers/${id}/services`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching Freelancer details');
  }
}
export const getFreelancerEquipments = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/freelancers/${id}/equipments`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching Freelancer details');
  }
}
export const getFreelancerPackages = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/freelancers/${id}/packages`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching Freelancer details');
  }
}
export const getFreelancerHelpers = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/freelancers/${id}/helpers`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching Freelancer details');
  }
}

export const fetchSimilarFreelancers = async (categoryId) => {
  if (!categoryId) return { similarFreelancers: [] };

  try {  
    const response = await axiosInstance.get(`/user/freelancers/similar-freelancers/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching similar freelancers');
  }
}