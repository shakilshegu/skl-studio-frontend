import axiosInstance from "../../config/axios.js";


export const fetchProfileDetails = async (userId) => {
    try {
        const response = await axiosInstance.get(`/user/profile?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
};



export const createProfile = async (profileData) => {
    try {
        
        const response = await axiosInstance.post("/user/profile", profileData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating profile:", error);
        throw error;
    }
};

export const updateProfileDetails = async (formData) => {
    try {
        const response = await axiosInstance.put("/user/profile", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};

