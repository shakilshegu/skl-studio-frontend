import axiosInstance from "../../config/axios.js";

export const getCategoryWiseStudio = async () => {
    try {
        const response = await axiosInstance.get(`/user/studio/studiosOnAllCategory`)
        return response.data;
    } catch (error) {
        throw new Error('Error fetching studio details');
    }
}


export const fetchEventCategories = async (params = {}) => {
    try {
        const { page = 1, limit = 10, search = '' } = params;
        const queryParams = new URLSearchParams();
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        if (search) {
            queryParams.append('search', search);
        }

        const response = await axiosInstance.get(`/user/home?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching event categories:", error.response?.data || error.message);
        throw error;
    }
};


export const fetchPackages = async () => {
    try {
        const response = await axiosInstance.get(`/user/home/packages`);
        return response.data;
    } catch (error) {
        console.error("[Fetch Packages] Error:", error.response?.data || error.message);
        throw error;
    }
};

export const fetchTopRatedStudios = async ({ categoryId }) => {

    console.log(categoryId);
    
  try {
    const response = await axiosInstance.get(`/user/home/top-studio`, {
      params: {
        categoryId: categoryId || undefined, 
      },
    });
    return response.data;
  } catch (error) {
    console.error("[Fetch Studios] Error:", error.response?.data || error.message);
    throw error;
  }
};


export const fetchTestimonials = async () => {
  try {
    const response = await axiosInstance.get(`/admin/testimonial`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching testimonials');
  }
};