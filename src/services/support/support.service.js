// services/supportService.js
import axiosInstance from "../../config/axios.js";

export const getMyTickets = async () => {
  try {
    const response = await axiosInstance.get(`/support/tickets-by-user`);
    console.log("My Tickets Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching my tickets:", error);
    throw error;
  }
};

export const getTicketById = async (ticketId) => {
  try {
    const response = await axiosInstance.get(`/support/tickets/${ticketId}`);
    console.log("Ticket Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw error;
  }
};

export const createTicket = async (ticketData) => {
  try {
    console.log("Creating ticket with data:", ticketData);
    
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add basic ticket data
    formData.append('title', ticketData.subject);
    formData.append('description', ticketData.description);
    formData.append('category', ticketData.category);
    formData.append('priority', ticketData.priority);
    
    // Add booking ID if provided
    if (ticketData.bookingId) {
      formData.append('bookingId', ticketData.bookingId);
    }
    
    // Add attachments if any
    if (ticketData.attachments && ticketData.attachments.length > 0) {
      ticketData.attachments.forEach((file, index) => {
        formData.append(`attachments`, file);
      });
    }
    
    const response = await axiosInstance.post("/support/tickets", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log("Ticket created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

export const addComment = async (ticketId, commentData) => {
  try {
    console.log("Adding comment to ticket:", ticketId, commentData);
    const response = await axiosInstance.post(
      `/support/tickets/${ticketId}/comments`,
      commentData
    );
    console.log("Comment added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const updateTicketPriority = async (ticketId, priority) => {
  try {
    console.log("Updating ticket priority:", ticketId, priority);
    const response = await axiosInstance.patch(
      `/support/tickets/${ticketId}/priority`,
      { priority }
    );
    console.log("Priority updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating ticket priority:", error);
    throw error;
  }
};

export const updateTicketStatus = async (ticketId, status) => {
  try {
    console.log("Updating ticket status:", ticketId, status);
    const response = await axiosInstance.patch(
      `/support/tickets/${ticketId}/status`,
      { status }
    );
    console.log("Status updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw error;
  }
};

export const resolveTicket = async (ticketId, resolutionData) => {
  try {
    console.log("Resolving ticket:", ticketId, resolutionData);
    const response = await axiosInstance.patch(
      `/support/tickets/${ticketId}/resolve`,
      resolutionData
    );
    console.log("Ticket resolved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error resolving ticket:", error);
    throw error;
  }
};