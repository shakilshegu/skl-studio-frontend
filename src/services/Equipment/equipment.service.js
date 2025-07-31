import axiosInstance from "../../config/axios.js";

export const getEquipmentFilterDetails = async (filterQuery) => {
    try {
        const response = await axiosInstance.get(`/partner/equipment/filter`, { params: filterQuery });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error
    }
}

  export const fetchEquipments = async () => {
    try {
      const response = await axiosInstance.get('/partner/equipment/equipments-by-partner');
      return response.data;
    } catch (error) {
      throw error
    }
  };
  export const addEquipment = async (data) => {
    try {
  
      const response = await axiosInstance.post('/partner/equipment', data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error
    }
  };
  export const updateEquipment = async ({ id, data }) => {
    
    try {
      const response = await axiosInstance.put(`/partner/equipment/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error
    }
  };
  export const deleteEquipment = async (id) => {
    try {
      const response = await axiosInstance.delete(`/partner/equipment/${id}`,);
      return response.data;
    } catch (error) {
      throw error
    }
  };
  
