import axiosInstance from "@/config/axios";

export const fetchFaqs = async () => {
    try {
        const response = await axiosInstance.get("/admin/faq/active");
        return response.data;
    } catch (error) {
        console.error("Error fetching FAQs:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error fetching FAQs');
    }
};

// Get FAQs by category
export const fetchFaqsByCategory = async (category) => {
    try {
        const params = category && category !== 'all' ? `?category=${category}` : '';
        const response = await axiosInstance.get(`/admin/faq/active${params}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching FAQs by category:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error fetching FAQs');
    }
};