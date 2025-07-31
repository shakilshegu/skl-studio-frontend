// hooks/useMediaQueries.js
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  createFolder,
  getBookingFolders,
  getFolderMedia,
  uploadFiles,
  removeFiles,
  getMediaFileUrl,
  addComment,
  getFileComments,
  getBookingComments,
  getBookingStorage,
  getWorkflowProgress,
  approveFiles,
  getEditingQueue,
  uploadEditedFile,
  getCompletedEdits,
  getApprovedFiles,
  getFilesByOriginalFolder,
  completeBooking,
  updateWorkflowStatus,
  runCleanup,
  restoreFiles,
  downloadSingleFile,
  downloadAllApprovedFiles,
  downloadFolderFiles,
  getBookingReview,
  submitReviewAndCloseBooking,
  updateBookingContentDetails,
  getEntityReviews,
  getEditingQueueByFolder,
  getCompletedEditsByFolder,
  sendClosureRequest
 
} from '../services/WorkFlow/work-flow.service.js';
import { showToast } from '@/components/Toast/Toast.jsx';

// Query Keys
export const mediaKeys = {
  all: ['media'],
  folders: (bookingId) => [...mediaKeys.all, 'folders', bookingId],
  foldersByStage: (bookingId, stage) => [...mediaKeys.folders(bookingId), stage],
  folderMedia: (folderId) => [...mediaKeys.all, 'folderMedia', folderId],
  fileComments: (fileId) => [...mediaKeys.all, 'comments', fileId],
  storage: (bookingId) => [...mediaKeys.all, 'storage', bookingId],
  progress: (bookingId) => [...mediaKeys.all, 'progress', bookingId],
  editingQueue: (bookingId) => [...mediaKeys.all, 'editingQueue', bookingId],
    editingQueueByFolder: (bookingId) => [...mediaKeys.all, 'editingQueueByFolder', bookingId], // NEW
  completedEditsByFolder: (bookingId) => [...mediaKeys.all, 'completedEditsByFolder', bookingId], // NEW
  completedEdits: (bookingId) => [...mediaKeys.all, 'completedEdits', bookingId],
  approvedFiles: (bookingId) => [...mediaKeys.all, 'approvedFiles', bookingId],
  printingFolders: (bookingId) => [...mediaKeys.all, 'printingFolders', bookingId]
};

// ==========================================
// FOLDER QUERIES
// ==========================================

export const useBookingFolders = (bookingId, workflowStage = 'content', options = {}) => {
  return useQuery({
    queryKey: mediaKeys.foldersByStage(bookingId, workflowStage),
    queryFn: () => getBookingFolders({ bookingId, workflowStage }),
    enabled: !!bookingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createFolder,
    onSuccess: (data, variables) => {
      // Invalidate and refetch folders
      queryClient.invalidateQueries({ 
        queryKey: mediaKeys.foldersByStage(variables.bookingId, 'content') 
      });
    },
    onError: (error) => {
      console.error('Error creating folder:', error);
    }
  });
};

// ==========================================
// MEDIA QUERIES
// ==========================================

export const useFolderMedia = (folderId, options = {}) => {
  return useInfiniteQuery({
    queryKey: mediaKeys.folderMedia(folderId),
    queryFn: ({ pageParam = 1 }) => 
      getFolderMedia({ folderId, page: pageParam, limit: 50 }),
    enabled: !!folderId,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.hasMore) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options
  });
};

export const useUploadFiles = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: uploadFiles,
    onSuccess: (data, variables) => {
      // Invalidate folder media
      queryClient.invalidateQueries({ 
        queryKey: mediaKeys.folderMedia(variables.folderId) 
      });
      
      // Invalidate folders to update file counts
      queryClient.invalidateQueries({ 
        queryKey: mediaKeys.foldersByStage(variables.bookingId, 'content') 
      });
      
      // Invalidate workflow progress
      queryClient.invalidateQueries({ 
        queryKey: mediaKeys.progress(variables.bookingId) 
      });
    },
    onError: (error) => {
      console.error('Error uploading files:', error);
    }
  });
};

export const useRemoveFiles = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: removeFiles,
    onSuccess: (data, variables, context) => {
      // Invalidate relevant queries
      if (context?.folderId) {
        queryClient.invalidateQueries({ 
          queryKey: mediaKeys.folderMedia(context.folderId) 
        });
      }
      
      if (context?.bookingId) {
        queryClient.invalidateQueries({ 
          queryKey: mediaKeys.foldersByStage(context.bookingId, 'content') 
        });
      }
    },
    onError: (error) => {
      console.error('Error removing files:', error);
    }
  });
};

export const useRestoreFiles = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: restoreFiles,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: ['media', 'folders'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['media', 'folderMedia'] 
      });
    },
    onError: (error) => {
      console.error('Error restoring files:', error);
    }
  });
};

// ==========================================
// COMMENT QUERIES
// ==========================================

export const useFileComments = (fileId, options = {}) => {
  return useQuery({
    queryKey: mediaKeys.fileComments(fileId),
    queryFn: () => getFileComments({ fileId }),
    enabled: !!fileId,
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addComment,
    onSuccess: (data, variables) => {
      // Invalidate file comments
      queryClient.invalidateQueries({ 
        queryKey: mediaKeys.fileComments(variables.fileId) 
      });
      
      // If it's an edit request, invalidate editing queue
      if (variables.isEditRequest) {
        // We need bookingId for this, you might need to pass it
        queryClient.invalidateQueries({ 
          predicate: (query) => query.queryKey.includes('editingQueue')
        });
        
        // Invalidate workflow progress
        queryClient.invalidateQueries({ 
          predicate: (query) => query.queryKey.includes('progress')
        });
      }
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
    }
  });
};

// ==========================================
// STORAGE & PROGRESS QUERIES
// ==========================================

export const useBookingStorage = (bookingId, options = {}) => {
  return useQuery({
    queryKey: mediaKeys.storage(bookingId),
    queryFn: () => getBookingStorage({ bookingId }),
    enabled: !!bookingId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options
  });
};

export const useWorkflowProgress = (bookingId, options = {}) => {
  return useQuery({
    queryKey: mediaKeys.progress(bookingId),
    queryFn: () => getWorkflowProgress({ bookingId }),
    enabled: !!bookingId,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    ...options
  });
};

// ==========================================
// EDITING QUERIES
// ==========================================

export const useEditingQueue = (bookingId, options = {}) => {
  return useQuery({
    queryKey: mediaKeys.editingQueue(bookingId),
    queryFn: () => getEditingQueue({ bookingId }),
    enabled: !!bookingId,
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options
  });
};

// NEW: Editing queue grouped by folders
export const useEditingQueueByFolder = (bookingId, options = {}) => {
  return useQuery({
    queryKey: mediaKeys.editingQueueByFolder(bookingId),
    queryFn: () => getEditingQueueByFolder({ bookingId }),
    enabled: !!bookingId,
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options
  });
};


export const useUploadEditedFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: uploadEditedFile,
    onSuccess: (data, variables) => {
      
      // Get bookingId from variables instead of context
      const bookingId = variables?.bookingId;
      

      if (bookingId) {
        queryClient.invalidateQueries({ 
          queryKey: mediaKeys.editingQueue(bookingId) 
        });
        
        queryClient.invalidateQueries({ 
          queryKey: mediaKeys.editingQueueByFolder(bookingId)
        });
        
        queryClient.invalidateQueries({ 
          queryKey: mediaKeys.completedEdits(bookingId) 
        });
        
        queryClient.invalidateQueries({ 
          queryKey: mediaKeys.completedEditsByFolder(bookingId)
        });
        
        queryClient.invalidateQueries({ 
          queryKey: mediaKeys.progress(bookingId) 
        });
      }
    },
    onError: (error) => {
      console.error('Error uploading edited file:', error);
    }
  });
};

export const useCompletedEdits = (bookingId, options = {}) => {
  return useQuery({
    queryKey: mediaKeys.completedEdits(bookingId),
    queryFn: () => getCompletedEdits({ bookingId }),
    enabled: !!bookingId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options
  });
};

// NEW: Completed edits grouped by folders
export const useCompletedEditsByFolder = (bookingId, options = {}) => {
  return useQuery({
    queryKey: mediaKeys.completedEditsByFolder(bookingId),
    queryFn: () => getCompletedEditsByFolder({ bookingId }),
    enabled: !!bookingId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options
  });
};

// ==========================================
// PRINTING QUERIES
// ==========================================

export const useApproveFiles = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: approveFiles,
    onSuccess: (data, variables, context) => {
      // Invalidate printing related queries
      if (context?.bookingId) {
        queryClient.invalidateQueries({ 
          queryKey: mediaKeys.approvedFiles(context.bookingId) 
        });
        
        queryClient.invalidateQueries({ 
          queryKey: mediaKeys.printingFolders(context.bookingId) 
        });
        
        queryClient.invalidateQueries({ 
          queryKey: mediaKeys.progress(context.bookingId) 
        });
      }
    },
    onError: (error) => {
      console.error('Error approving files:', error);
    }
  });
};

export const useApprovedFiles = (bookingId, options = {}) => {
  return useQuery({
    queryKey: mediaKeys.approvedFiles(bookingId),
    queryFn: () => getApprovedFiles({ bookingId }),
    enabled: !!bookingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
};

export const usePrintingFolders = (bookingId, options = {}) => {
  return useQuery({
    queryKey: mediaKeys.printingFolders(bookingId),
    queryFn: () => getFilesByOriginalFolder({ bookingId }),
    enabled: !!bookingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
};

export const useCompleteBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: completeBooking,
    onSuccess: (data, variables) => {
      // Invalidate workflow progress
      queryClient.invalidateQueries({ 
        queryKey: mediaKeys.progress(variables.bookingId) 
      });
    },
    onError: (error) => {
      console.error('Error completing booking:', error);
    }
  });
};

// ==========================================
// ADDITIONAL HOOKS
// ==========================================

// Get booking comments
export const useBookingComments = (bookingId, isEditRequest, options = {}) => {
  return useQuery({
    queryKey: [...mediaKeys.all, 'bookingComments', bookingId, isEditRequest],
    queryFn: () => getBookingComments({ bookingId, isEditRequest }),
    enabled: !!bookingId,
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options
  });
};

// Get media file URL
export const useMediaFileUrl = (fileId, options = {}) => {
  return useQuery({
    queryKey: [...mediaKeys.all, 'fileUrl', fileId],
    queryFn: () => getMediaFileUrl({ fileId }),
    enabled: !!fileId,
    staleTime: 10 * 60 * 1000, // 10 minutes (URLs expire after 1 hour)
    ...options
  });
};

// Update workflow status (admin)
export const useUpdateWorkflowStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateWorkflowStatus,
    onSuccess: (data, variables) => {
      // Invalidate workflow progress
      queryClient.invalidateQueries({ 
        queryKey: mediaKeys.progress(variables.bookingId) 
      });
    },
    onError: (error) => {
      console.error('Error updating workflow status:', error);
    }
  });
};


// Simplified single file download hook
export const useDownloadFile = () => {
  return useMutation({
    mutationFn: downloadSingleFile,
    onSuccess: (data, variables) => {
      console.log(' Download completed:', variables.filename);
    },
    onError: (error) => {
      console.error(' Download failed:', error);
      
      let errorMessage = 'Download failed: ';
      
      if (error.response?.status === 404) {
        errorMessage += 'File not found or no longer available.';
      } else if (error.response?.status === 403) {
        errorMessage += 'Access denied. Please check permissions.';
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage += 'Download timed out. Please try again.';
      } else if (error.response?.status >= 500) {
        errorMessage += 'Server error. Please contact support.';
      } else {
        errorMessage += 'Please try again. If problem persists, contact support.';
      }
      
      showToast(errorMessage,"error");
    }
  });
};

// Download all approved files as ZIP
export const useDownloadAllApprovedFiles = () => {
  return useMutation({
    mutationFn: downloadAllApprovedFiles,
    onSuccess: (data, variables) => {
      console.log(' ZIP download completed for booking:', variables.bookingId);
    },
    onError: (error) => {
      console.error(' ZIP download failed:', error);
      
      let errorMessage = 'ZIP download failed: ';
      
      if (error.response?.status === 404) {
        errorMessage += 'No approved files found for download.';
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage += 'ZIP creation timed out. Please try downloading individual files.';
      } else {
        errorMessage += 'Please try again or contact support.';
      }
      
      showToast(errorMessage,"error");
    }
  });
};

// Download folder files as ZIP
export const useDownloadFolderFiles = () => {
  return useMutation({
    mutationFn: downloadFolderFiles,
    onSuccess: (data, variables) => {
      console.log(' Folder ZIP download completed:', variables.folderName);
    },
    onError: (error) => {
      console.error(' Folder ZIP download failed:', error);
      
      let errorMessage = 'Folder download failed: ';
      
      if (error.response?.status === 404) {
        errorMessage += 'Folder not found or contains no files.';
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage += 'ZIP creation timed out. Please try downloading individual files.';
      } else {
        errorMessage += 'Please try again or contact support.';
      }
      
      showToast(errorMessage,"error");
    }
  });
};

// React Query hook for updating content details
export const useUpdateContentDetails = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookingId, contentData }) => 
      updateBookingContentDetails(bookingId, contentData),
    onSuccess: (data, variables) => {
      // Update the booking cache with new content details
      queryClient.setQueryData(
        ['booking', variables.bookingId], 
        (oldData) => {
          if (oldData?.booking) {
            return {
              ...oldData,
              booking: {
                ...oldData.booking,
                contentTitle: data.booking.contentTitle,
                notes: data.booking.notes,
                workFlowStatus: data.booking.workFlowStatus,
                updatedAt: data.booking.updatedAt
              }
            };
          }
          return oldData;
        }
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: ['bookingById', variables.bookingId] 
       
      });
    },
    onError: (error) => {
      console.error('Error updating content details:', error);
    }
  });
};

export const useSubmitReviewAndClose = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookingId, reviewData }) => 
      submitReviewAndCloseBooking(bookingId, reviewData),
    onSuccess: (data, variables) => {
      // Update booking cache with new workflow status only
      queryClient.setQueryData(
        ['booking', variables.bookingId], 
        (oldData) => {
          if (oldData?.booking) {
            return {
              ...oldData,
              booking: {
                ...oldData.booking,
                workFlowStatus: data.booking.workFlowStatus,
                status: data.booking.status,
                actualEndTime: data.booking.actualEndTime,
                updatedAt: data.booking.updatedAt
              }
            };
          }
          return oldData;
        }
      );
      
      // Cache the review data separately
      queryClient.setQueryData(
        ['booking', 'review','bookingById', variables.bookingId],
        { review: data.review }
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: ['booking', variables.bookingId] 
      });
      
      // Invalidate entity reviews if we have the entity info
      if (variables.reviewData.entityType && variables.reviewData.entityId) {
        queryClient.invalidateQueries({ 
          queryKey: ['reviews', variables.reviewData.entityType, variables.reviewData.entityId] 
        });
      }
    },
    onError: (error) => {
      console.error('Error submitting review:', error);
    }
  });
};

// Hook for getting booking review
export const useBookingReview = (bookingId, options = {}) => {
  return useQuery({
    queryKey: ['booking','bookingById' ,'review', bookingId],
    queryFn: () => getBookingReview(bookingId),
    enabled: !!bookingId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry if review doesn't exist (404)
      if (error.response?.status === 404) return false;
      return failureCount < 3;
    },
    ...options
  });
};

export const useEntityReview = (entityType, entityId,page)=>{
  return useQuery({
    queryKey:['review',entityId,entityType,page],
    queryFn:()=>getEntityReviews({entityType,entityId,page}),
    enabled:!!entityId,
  })
}

// Send closure request hook
export const useSendClosureRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sendClosureRequest,
    onSuccess: (data, variables) => {

      // Invalidate closure status
      queryClient.invalidateQueries({ 
        queryKey: ['closure', 'status', variables.bookingId] 
      });
      
      // Invalidate workflow progress
      queryClient.invalidateQueries({ 
        queryKey: mediaKeys.progress(variables.bookingId) 
      });

      // FIXED: Use the correct query key that matches your parent component
      queryClient.invalidateQueries({ 
        queryKey: ['bookingById', variables.bookingId] // Removed 'booking' prefix
      });
      
      // FIXED: Force refetch with correct query key
      queryClient.refetchQueries({
        queryKey: ["bookingById", variables.bookingId], // Removed 'booking' prefix
      });
      
    },
    onError: (error) => {
      console.error('Error with closure request:', error);
    }
  });
};

// Run S3 cleanup (admin)
export const useRunCleanup = () => {
  return useMutation({
    mutationFn: runCleanup,
    onError: (error) => {
      console.error('Error running cleanup:', error);
    }
  });
};