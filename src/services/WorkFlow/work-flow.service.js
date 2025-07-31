// services/mediaService.js

import axiosInstance from "@/config/axios";

// Create media folder
export const createFolder = async ({ bookingId, customName }) => {
  try {

    const response = await axiosInstance.post('/media/folders', {
      bookingId,
      customName
    });
    return response.data;
  } catch (error) {
    throw  error;
  }
};

// Get booking folders
export const getBookingFolders = async ({ bookingId, workflowStage = 'content' }) => {
  try {
    const response = await axiosInstance.get(
      `/media/bookings/${bookingId}/folders`,
      {
        params: { workflowStage }
      }
    );
    return response.data;
  } catch (error) {
    throw error 
  }
};

// Get folder media files
export const getFolderMedia = async ({ folderId, page = 1,  fileType }) => {
  try {
    const response = await axiosInstance.get(
      `/media/folders/${folderId}/files`,
      {
        params: { page,  fileType }
      }
    );
    return response.data;
  } catch (error) {
    throw error 
  }
};

// Upload files to folder
export const uploadFiles = async ({ files, bookingId, folderId, onUploadProgress }) => {
  try {
    const formData = new FormData();
    
    // Add files to FormData
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    
    formData.append('bookingId', bookingId);
    formData.append('folderId', folderId);

    const response = await axiosInstance.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
    
    return response.data;
  } catch (error) {
    throw error 
  }
};

// Remove files
export const removeFiles = async ({ fileIds }) => {
  try {
    const response = await axiosInstance.post('/media/files/remove', {
      fileIds
    });
    return response.data;
  } catch (error) {
    throw error
  }
};

// Add to work-flow.service.js
export const restoreFiles = async ({ fileIds }) => {
// export const restoreFiles = async ({ fileIds, targetFolderId }) => {
  try {
    const response = await axiosInstance.post('/media/files/restore', {
      fileIds,
      // targetFolderId
    });
    return response.data;
  } catch (error) {
    
throw error
  }
};

// Get media file URL
export const getMediaFileUrl = async ({ fileId }) => {
  try {
    const response = await axiosInstance.get(`/media/files/${fileId}/url`);
    return response.data;
  } catch (error) {
    throw error
  }
};

// Add comment to media file
export const addComment = async ({ fileId, commentText, isEditRequest = false }) => {
  try {
    const response = await axiosInstance.post(`/media/files/${fileId}/comments`, {
      commentText,
      isEditRequest
    });
    return response.data;
  } catch (error) {
    throw error 
  }
};

// Get file comments
export const getFileComments = async ({ fileId }) => {
  try {
    const response = await axiosInstance.get(`/media/files/${fileId}/comments`);
    return response.data;
  } catch (error) {
    throw error 
  }
};

// Get booking storage
export const getBookingStorage = async ({ bookingId }) => {
  try {
    const response = await axiosInstance.get(`/media/bookings/${bookingId}/storage`);
    return response.data;
  } catch (error) {
    throw error
  }
};

// Get workflow progress
export const getWorkflowProgress = async ({ bookingId }) => {
  try {
    const response = await axiosInstance.get(`/media/bookings/${bookingId}/progress`);
    return response.data;
  } catch (error) {
    throw error 
  }
};

// Approve files for printing
export const approveFiles = async ({ fileIds }) => {
  try {
    const response = await axiosInstance.post('/media/files/approve', {
      fileIds
    });
    return response.data;
  } catch (error) {
    throw error 
  }
};

// Get editing queue======================not req
export const getEditingQueue = async ({ bookingId }) => {
  try {
    const response = await axiosInstance.get(`/media/bookings/${bookingId}/editing/queue`);
    
    return response.data;
  } catch (error) {
    throw error 
  }
};

//nnnnnnnnnnnn
export const getEditingQueueByFolder = async ({ bookingId }) => {
  try {
    const response = await axiosInstance.get(`/media/bookings/${bookingId}/editing/queue/folders`);
    
    return response.data;
  } catch (error) {
    throw error 
  }
};

// Upload edited file
export const uploadEditedFile = async ({ fileId, editedFile, onUploadProgress }) => {
  try {
    const formData = new FormData();
    formData.append('editedFile', editedFile);

    const response = await axiosInstance.post(`/media/files/${fileId}/edited`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
    
    return response.data;
  } catch (error) {
    throw error 
  }
};

// Get completed edits
export const getCompletedEdits = async ({ bookingId }) => {
  try {
    const response = await axiosInstance.get(`/media/bookings/${bookingId}/editing/completed`);
    return response.data;
  } catch (error) {
    throw error 
  }
};

// NEW: Get completed edits grouped by folders
export const getCompletedEditsByFolder = async ({ bookingId }) => {
  try {
    const response = await axiosInstance.get(`/media/bookings/${bookingId}/editing/completed/folders`);
    return response.data;
  } catch (error) {
    throw error 
  }
};

// Get approved files for printing
export const getApprovedFiles = async ({ bookingId }) => {
  try {
    const response = await axiosInstance.get(`/media/bookings/${bookingId}/printing/approved`);
    return response.data;
  } catch (error) {
    throw error 
  }
};

// Get files by original folder for printing
export const getFilesByOriginalFolder = async ({ bookingId }) => {
  try {
    const response = await axiosInstance.get(`/media/bookings/${bookingId}/printing/folders`);
    console.log(response.data,"dddddddddddddddddxxxxxxxxxxxxxxx");
    
    return response.data;
  } catch (error) {
    throw error 
  }
};

// Complete booking workflow
export const completeBooking = async ({ bookingId }) => {
  try {
    const response = await axiosInstance.post(`/media/bookings/${bookingId}/complete`);
    return response.data;
  } catch (error) {
    throw error 
  }
};

// Get booking comments
export const getBookingComments = async ({ bookingId, isEditRequest }) => {
  try {
    const params = {};
    if (isEditRequest !== undefined) {
      params.isEditRequest = isEditRequest;
    }

    const response = await axiosInstance.get(`/media/bookings/${bookingId}/comments`, {
      params
    });
    return response.data;
  } catch (error) {
    throw error 
  }
};

// Update workflow status (admin only)
export const updateWorkflowStatus = async ({ bookingId, newStatus }) => {
  try {
    const response = await axiosInstance.patch(`/media/bookings/${bookingId}/workflow`, {
      newStatus
    });
    return response.data;
  } catch (error) {
    throw error 
  }
};

// Run S3 cleanup (admin only)
export const runCleanup = async () => {
  try {
    const response = await axiosInstance.post('/media/admin/cleanup');
    return response.data;
  } catch (error) {
    throw error 
  }
};

// Add these functions to your existing work-flow.service.js

// Download single file
export const downloadSingleFile = async ({ fileId, filename }) => {
  try {
    const response = await axiosInstance.get(`/media/files/${fileId}/download`, {
      responseType: 'blob',
      timeout: 60000 // 60 second timeout for large files
    });
    
    // Create download from blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Download all approved files for a booking as ZIP
export const downloadAllApprovedFiles = async ({ bookingId }) => {
  try {
    const response = await axiosInstance.get(`/media/bookings/${bookingId}/download-all`, {
      responseType: 'blob',
      timeout: 300000 // 5 minute timeout for ZIP creation
    });
    
    // Create download from blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `booking-${bookingId}-approved-files.zip`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Download all files in a folder as ZIP
export const downloadFolderFiles = async ({ folderId, folderName }) => {
  try {
    const response = await axiosInstance.get(`/media/folders/${folderId}/download`, {
      responseType: 'blob',
      timeout: 300000 // 5 minute timeout for ZIP creation
    });
    
    // Create download from blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${folderName || 'folder'}-files.zip`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const updateBookingContentDetails = async (bookingId, contentData) => {
  try {
    const response = await axiosInstance.put(`/partner/bookings/${bookingId}/content-details`, contentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Submit review and close booking
export const submitReviewAndCloseBooking = async (bookingId, reviewData) => {
  try {
    const response = await axiosInstance.post(`/user/review/${bookingId}/review`, reviewData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get booking review
export const getBookingReview = async (bookingId) => {
  try {
    const response = await axiosInstance.get(`/user/review/${bookingId}/review`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// // Get entity reviews (for public display)
export const getEntityReviews = async ({ entityType, entityId, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' }) => {
  try {

    const response = await axiosInstance.get(`/user/review/${entityType}/${entityId}`, {
      params: { page, limit, sortBy, order }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const sendClosureRequest = async ({bookingId,action}) => {
  try {
    

    const response = await axiosInstance.post(`/media/bookings/${bookingId}/closure/request`,{action});
    return response.data;
  } catch (error) {
    throw error;
  }
};