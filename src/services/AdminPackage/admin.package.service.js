import axiosInstance from "@/config/axios";

export const getAdminPackageById = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/admin-packages/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};
