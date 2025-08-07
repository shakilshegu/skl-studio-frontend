import axiosInstance from "@/config/axios";

// NEW BANNER SERVICES
export const fetchActiveBanners = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                queryParams.append(key, value);
            }
        });
        
        const queryString = queryParams.toString();
        const url = `/admin/banner/active${queryString ? `?${queryString}` : ''}`;
        
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching active banners:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error fetching active banners');
    }
};

export const fetchHeroBanners = async (targetPage = 'home') => {
    try {
        return await fetchActiveBanners({ position: 'hero', targetPage });
    } catch (error) {
        console.error("Error fetching hero banners:", error.message);
        throw error;
    }
};

export const fetchSecondaryBanners = async (targetPage = 'home') => {
    try {
        return await fetchActiveBanners({ position: 'secondary', targetPage });
    } catch (error) {
        console.error("Error fetching secondary banners:", error.message);
        throw error;
    }
};

export const fetchPopupBanners = async (targetPage = 'home') => {
    try {
        return await fetchActiveBanners({ position: 'popup', targetPage });
    } catch (error) {
        console.error("Error fetching popup banners:", error.message);
        throw error;
    }
};

