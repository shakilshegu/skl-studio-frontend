import axiosInstance from "../../config/axios.js";


export const fetchStudioCategories = async () => {
    try {
      const response = await axiosInstance.get(`/admin/studio-category`)
      return response.data
    } catch (error) {
      throw new Error('Error fetching studio details');
    }
  }


export const fetchStudioById = async () => {
  try {
    const response = await axiosInstance.get(`/partner/studio`);
    return response.data;
  } catch (error) {
    // If studio not found, backend still returns 200 with studio: null
    throw new Error(error.response?.data?.message || 'Error fetching studio details');
  }
};


  export const addPartnerStudio = async (data) => {
    try {
      const response = await axiosInstance.post('/partner/studio', data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error fetching studio details');
    }
  };

  export const updatePartnerStudio = async (studioId, data) => {
  try {
    const response = await axiosInstance.put(`/partner/studio/${studioId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


  export const fetchPartnerServices = async () => {
    try {
      const response = await axiosInstance.get(`/partner/service/services-by-partner`);
      
      return response.data;
    } catch (error) {

    throw error
    }
  };


  export const addService = async (data) => {
    try {

      const response = await axiosInstance.post('/partner/service', data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error
    }
  };
  export const updateService = async ({ id, data }) => {
    try {
      
      const response = await axiosInstance.patch(`/partner/service/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const deleteService = async (id) => {
    try {
      const response = await axiosInstance.delete(`/partner/service/${id}`,);
      return response.data;
    } catch (error) {
      throw error
    }
  };
  
