

import axiosInstance from "@/config/axios";

// Fetch all team members
export const fetchTeamMembers = async () => {
  try {
    const response = await axiosInstance.get('/partner/team-member');
    return response.data;
  } catch (error) {
    // console.error("Error fetching team members:", error);
    throw error;
  }
};

// Add a new team member
export const addTeamMember = async (formData) => {
  try {
    const response = await axiosInstance.post("/partner/team-member", formData, {
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

// Update a team member
export const updateTeamMember = async (id, formData) => {
  try {
    const response = await axiosInstance.put(`/partner/team-member/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating team member with ID ${id}:`, error);
    throw error;
  }
};

// Delete a team member
export const deleteTeamMember = async (id) => {
  try {
    
    const response = await axiosInstance.delete(`/partner/team-member/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting team member with ID ${id}:`, error);
    throw error;
  }
};
