import moment from "moment/moment.js";
import axiosInstance from "../../config/axios.js";

export const getStudioFilterDetails = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Only add non-empty filters to query params
    if (filters.search?.trim()) params.set('search', filters.search.trim());
    // if (filters.location) params.set('location', filters.location);
     if (filters.searchLat) params.set('searchLat', filters.searchLat);
    if (filters.searchLng) params.set('searchLng', filters.searchLng);
    if (filters.lat) params.set('lat', filters.lat);
    if (filters.lng) params.set('lng', filters.lng);
    if (filters.radius && filters.radius < 50) params.set('radius', filters.radius);
    if (filters.minPrice && filters.minPrice > 0) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice && filters.maxPrice < 50000) params.set('maxPrice', filters.maxPrice);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.category) params.set('category', filters.category);
    if (filters.page) params.set('page', filters.page);
    if (filters.limit) params.set('limit', filters.limit);

    const queryString = params.toString();
    const url = `/user/studio${queryString ? `?${queryString}` : ''}`;

    
    const response = await axiosInstance.get(url);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching studio details", error);
    
    // Return empty result instead of throwing error
    return { 
      success: false,
      studios: [], 
      totalStudios: 0,
      message: error.response?.data?.message || error.message
    };
  }
};

export const getStudioById = async (id) => {
  try {
    
    const response = await axiosInstance(`/user/studio/${id}`)
    return response.data;
  } catch (error) {
    throw new Error('Error fetching studio details');
  }
}
export const  getStudioCategories = async () => {
  try {
    const response = await axiosInstance(`/user/studio/categories`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching studio details');
  }
}

export const getStudioServices = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/studio/${id}/services`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching studio details');
  }
}
export const getStudioEquipments = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/studio/${id}/equipments`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching studio details');
  }
}
export const getStudioPackages = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/studio/${id}/packages`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching studio details');
  }
}
export const getStudioHelpers = async (id) => {
  try {
    
    const response = await axiosInstance.get(`/user/studio/${id}/helpers`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching studio details');
  }
}
export const fetchSimilarStudios = async (id) => {
  try {
    
    const response = await axiosInstance.get(`/user/studio/similar-studio/${id}`);
    console.log("response response ",response );
    
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching studio details');
  }
}