import { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Image, 
  Video, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Download,
  Loader2,
  Check,
  X,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Send,
  Edit3,
  Timer,
  Folder,
  ChevronRight as ChevronRightIcon,
  Play
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useEditingQueueByFolder,
  useCompletedEditsByFolder,
  useMediaFileUrl,
  useApproveFiles,
  useUploadEditedFile,
  useFileComments,
  useAddComment,
  mediaKeys
} from '@/hooks/useMediaQueries';
import useFullScreenKeyHandler from '@/hooks/useFullScreenKeyHandler';
import useFullScreenViewer from '@/hooks/useFullScreenViewer';
import { showToast } from '@/components/Toast/Toast';
import { showConfirm } from '@/components/Toast/Confirmation';
import CommentPopup from '@/components/work-flow/commentPopUp';

export default function FinalEditingPageV28({ bookingData, setActiveStep, role }) {
  const bookingId = bookingData?._id;
  
  // State management
  const [activeTab, setActiveTab] = useState('queue');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [commentFileId, setCommentFileId] = useState(null);
  const [uploadingFileId, setUploadingFileId] = useState(null);
  const [selectedFolderFiles, setSelectedFolderFiles] = useState(null);

  const fileInputRefs = useRef({});
  const queryClient = useQueryClient();
  
  // API hooks
  const { data: editingQueueFolders = [], isLoading: queueLoading } = useEditingQueueByFolder(bookingId);
  const { data: completedEditsFolders = [], isLoading: completedLoading } = useCompletedEditsByFolder(bookingId);
  const { data: fileComments = [], isLoading: commentsLoading } = useFileComments(commentFileId);
  const approveFilesMutation = useApproveFiles();
  const uploadEditedFileMutation = useUploadEditedFile();
  const addCommentMutation = useAddComment();

  // Get current folders and calculate totals
  const currentFolders = activeTab === 'queue' ? editingQueueFolders : completedEditsFolders;
  const allImagesForFullscreen = selectedFolderFiles || currentFolders.flatMap(folderData => folderData.files || []);
  const totalQueueFiles = editingQueueFolders.reduce((total, folder) => total + (folder.files?.length || 0), 0);
  const totalCompletedFiles = completedEditsFolders.reduce((total, folder) => total + (folder.files?.length || 0), 0);

  // Toggle file selection
  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  // Handle approve files
  const handleApproveFiles = async () => {
    if (!selectedFiles.length) return;

    const userConfirmed = await showConfirm(
      `Approve ${selectedFiles.length} file(s)? This will move them to the approved files for printing.`, "green"
    );

    if (!userConfirmed) return;

    try {
      await approveFilesMutation.mutateAsync(
        { 
          fileIds: selectedFiles,
          bookingId 
        },
        {
          context: { bookingId }
        }
      );
      
      setSelectedFiles([]);
      showToast(`${selectedFiles.length} file(s) approved successfully!`, "success");
      
    } catch (error) {
      console.error('Error approving files:', error);
      showToast('Error approving files. Please try again.', "error");
    }
  };

  // Handle file replacement - FIXED VERSION
  const handleReplaceFile = async (e, fileId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFileId(fileId);

    try {
     let res = await uploadEditedFileMutation.mutateAsync(
        { fileId, editedFile: file, bookingId },
      );

      // Clear the file input
      if (fileInputRefs.current[fileId]) {
        fileInputRefs.current[fileId].value = '';
      }
      
      // Remove from selected files
      setSelectedFiles(prev => prev.filter(id => id !== fileId));
      
      // Update selectedFolderFiles - remove old file and add new one if it exists
      if (selectedFolderFiles) {
        setSelectedFolderFiles(prev => {
          // Remove the old file
          const filteredFiles = prev.filter(f => f._id !== fileId);
          
          return filteredFiles;
        });
      }

      showToast('File replaced and moved to completed folder successfully!', "success");

      // Properly invalidate BOTH queue and completed queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: mediaKeys.editingQueueByFolder(bookingId) }),
        queryClient.invalidateQueries({ queryKey: mediaKeys.completedEditsByFolder(bookingId) }),
        // Also invalidate any individual file queries that might be cached
        queryClient.invalidateQueries({ 
          queryKey: ['media', 'file', fileId],
          exact: false 
        }),
        // Invalidate the new file if it exists
        res?.file?._id && queryClient.invalidateQueries({ 
          queryKey: ['media', 'file', res.file._id],
          exact: false 
        })
      ]);

    } catch (error) {
      console.error('Error replacing file:', error);
      showToast('Error replacing file. Please try again.', "error");
    } finally {
      setUploadingFileId(null);
    }
  };

  // Open folder files view
  const viewFolderFiles = (folderFiles) => {
    setSelectedFolderFiles(folderFiles);
    setSelectedFiles([]);
  };

  // Close folder files view
  const closeFolderView = () => {
    setSelectedFolderFiles(null);
    setSelectedFiles([]);
  };

  // Comment functions
  const openCommentPopup = (fileId) => {
    setCommentFileId(fileId);
    setShowCommentPopup(true);
  };

  const closeCommentPopup = () => {
    setShowCommentPopup(false);
    setCommentFileId(null);
  };

  // Updated handleAddComment to match CommentPopup interface
  const handleAddComment = async ({ fileId, commentText, isEditRequest }) => {
    if (!commentText.trim() || !fileId) return;

    try {
      await addCommentMutation.mutateAsync({
        fileId,
        commentText,
        isEditRequest
      });
      
      if (isEditRequest && activeTab === 'completed') {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: mediaKeys.editingQueueByFolder(bookingId) }),
          queryClient.invalidateQueries({ queryKey: mediaKeys.completedEditsByFolder(bookingId) }),
          queryClient.invalidateQueries({ 
            queryKey: ['media', 'file', fileId],
            exact: false 
          }),
        ]);
        
        if (selectedFolderFiles) {
          setSelectedFolderFiles(prev => {
            // Remove the old file
            const filteredFiles = prev.filter(f => f._id !== fileId);
            
            return filteredFiles;
          });
        }

        setSelectedFiles(prev => prev.filter(id => id !== fileId));
        showToast('File moved back to editing queue for re-editing', "success");
        // closeCommentPopup();
      } else {
        // closeCommentPopup();
      }
      
    } catch (error) {
      console.error('Error adding comment:', error);
      showToast('Error adding comment. Please try again.', "error");
      throw error; // Re-throw to let CommentPopup handle the error
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedFiles([]);
    setSelectedFolderFiles(null);
  };

  // Full screen functionality
  const {
    showFullScreen,
    zoomLevel,
    rotation,
    imageLoadError,
    currentFullScreenImage,
    openFullScreen,
    closeFullScreen,
    navigateFullScreen,
    handleZoom,
    handleRotate,
    setImageLoadError
  } = useFullScreenViewer(allImagesForFullscreen);

  useFullScreenKeyHandler({
    showFullScreen,
    closeFullScreen,
    allImagesForFullscreen,
    currentFullScreenImage,
    navigateFullScreen,
    handleZoom,
    handleRotate,
  });

  const { data: fullResolutionData } = useMediaFileUrl(
    showFullScreen ? currentFullScreenImage?._id : null
  );

  if (queueLoading && completedLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-[#892580]" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading editing workspace...</h3>
              <p className="text-gray-500">Please wait while we gather your files</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If viewing specific folder files
  if (selectedFolderFiles) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto space-y-6">
          
          {/* Back button */}
          <div className="flex items-center justify-between">
            <button
              onClick={closeFolderView}
              className="flex items-center space-x-2 text-[#892580] hover:text-[#a32d96] font-semibold transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Folders</span>
            </button>
            
            {selectedFiles.length > 0 && activeTab === 'completed' && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                  {selectedFiles.length} selected
                </span>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleApproveFiles}
                  disabled={approveFilesMutation.isPending}
                  className="px-6 py-2 bg-[#892580] text-white rounded-lg hover:bg-[#a32d96] transition-colors disabled:bg-gray-300"
                >
                  {approveFilesMutation.isPending ? 'Approving...' : 'Approve Selected'}
                </button>
              </div>
            )}
          </div>

          {/* Files Grid */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
           {
            selectedFolderFiles?.length===0&& <div className="h-32 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No files</p>
                        </div>
                      </div>
           }
            <div 
              className="gap-3 mb-8"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                width: '100%'
              }}
            >
              {selectedFolderFiles.map((file, index) => (
                <div
                  key={file._id}
                  onClick={(e) => {
                    // Only handle selection if not clicking on action buttons
                    if (activeTab === 'completed' && !e.target.closest('.action-button')) {
                      toggleFileSelection(file._id);
                    }
                  }}
                  className={`group relative bg-gray-50 rounded-xl overflow-hidden transition-all duration-300 border cursor-pointer ${
                    activeTab === 'completed' 
                      ? selectedFiles.includes(file._id)
                        ? 'ring-2 ring-[#892580] border-[#892580] bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                      : 'border-gray-200'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="aspect-square relative">
                    {file.fileType === 'image' ? (
                      <img
                        src={file.s3Thumbnails?.medium?.url || file.s3Thumbnails?.small?.url}
                        alt={file.originalFilename}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                        {file.s3Thumbnails?.poster?.url ? (
                          <img
                            src={file.s3Thumbnails.poster.url}
                            alt={file.originalFilename}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Video className="h-8 w-8 text-gray-400" />
                        )}
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded flex items-center">
                          <Play size={8} className="mr-1" />
                          Video
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
                      activeTab === 'queue' 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-green-500 text-white'
                    }`}>
                      {activeTab === 'queue' ? 'EDIT' : 'DONE'}
                    </div>

                    {/* Selection indicator */}
                    {activeTab === 'completed' && selectedFiles.includes(file._id) && (
                      <div className="absolute top-2 left-2 bg-[#892580] rounded-full p-1">
                        <Check size={12} className="text-white" />
                      </div>
                    )}

                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openFullScreen(index);
                        }}
                        className="action-button bg-white/90 hover:bg-white text-gray-800 p-2 rounded-lg shadow-lg transition-all"
                        title="View full screen"
                      >
                        <Maximize size={14} />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openCommentPopup(file._id);
                        }}
                        className="action-button bg-white/90 hover:bg-white text-[#892580] p-2 rounded-lg shadow-lg transition-all"
                        title="Comments"
                      >
                        <MessageSquare size={14} />
                      </button>

                      {activeTab === 'queue' && role === "partner" && (
                        <label className="action-button bg-white/90 hover:bg-white text-blue-600 p-2 rounded-lg shadow-lg transition-all cursor-pointer">
                          <RefreshCw size={14} />
                          <input
                            ref={el => fileInputRefs.current[file._id] = el}
                            type="file"
                            onChange={(e) => handleReplaceFile(e, file._id)}
                            className="hidden"
                            accept={file.fileType === 'image' ? "image/*" : "video/*"}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </label>
                      )}
                    </div>

                    {/* Upload overlay */}
                    {uploadingFileId === file._id && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                          <Loader2 className="h-6 w-6 animate-spin text-white mx-auto mb-1" />
                          <p className="text-white text-xs">Uploading...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* File info */}
                  <div className="p-3">
                    <div className="text-xs font-medium text-gray-800 truncate mb-1">
                      {file.originalFilename}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock size={10} className="mr-1" />
                      {formatDate(file.updatedAt || file.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center space-x-4">
            <button 
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium" 
              onClick={() => setActiveStep(prev => prev - 1)}
            >
              Back
            </button>
            <button 
              className="px-8 py-3 bg-[#892580] text-white rounded-xl hover:bg-[#a32d96] transition-all font-medium shadow-lg" 
              onClick={() => setActiveStep(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>

        {/* Reusable Comment Popup */}
        <CommentPopup
          isOpen={showCommentPopup}
          onClose={closeCommentPopup}
          file={allImagesForFullscreen.find(file => file._id === commentFileId)}
          fileComments={fileComments}
          commentsLoading={commentsLoading}
          role={role}
          onAddComment={handleAddComment}
          isAddingComment={addCommentMutation.isPending}
          activeTab={activeTab} // Pass activeTab to conditionally show edit request option
        />

        {/* Full Screen Modal */}
        {showFullScreen && currentFullScreenImage && (
          <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="text-white">
                <h3 className="text-xl font-bold">{currentFullScreenImage.originalFilename}</h3>
                <p className="text-sm opacity-75">
                  {allImagesForFullscreen.findIndex(f => f._id === currentFullScreenImage._id) + 1} of {allImagesForFullscreen.length}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {currentFullScreenImage.fileType === 'image' && (
                  <>
                    <button
                      onClick={() => handleZoom('out')}
                      className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                    >
                      <ZoomOut size={20} />
                    </button>
                    <span className="text-white text-sm px-2">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => handleZoom('in')}
                      className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                    >
                      <ZoomIn size={20} />
                    </button>
                    <button
                      onClick={handleRotate}
                      className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                    >
                      <RotateCw size={20} />
                    </button>
                  </>
                )}
                <button
                  onClick={closeFullScreen}
                  className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {allImagesForFullscreen.length > 1 && (
              <>
                <button
                  onClick={() => navigateFullScreen('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-xl transition-all z-10"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => navigateFullScreen('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-xl transition-all z-10"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <div className="flex items-center justify-center w-full h-full p-16">
              {currentFullScreenImage.fileType === 'image' ? (
                <img
                  src={
                    !imageLoadError && fullResolutionData?.url 
                      ? fullResolutionData.url 
                      : currentFullScreenImage.s3?.url || 
                        currentFullScreenImage.s3Thumbnails?.medium?.url
                  }
                  alt={currentFullScreenImage.originalFilename}
                  className="max-w-full max-h-full object-contain transition-transform duration-200"
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    cursor: zoomLevel > 1 ? 'move' : 'default'
                  }}
                  onLoad={() => setImageLoadError(false)}
                  onError={() => setImageLoadError(true)}
                />
              ) : (
                fullResolutionData?.url ? (
                  <video
                    src={fullResolutionData.url}
                    controls
                    className="max-w-full max-h-full"
                    autoPlay
                  />
                ) : (
                  <div className="text-white text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Loading video...</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto space-y-6">

        {/* Header with tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex bg-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => handleTabChange('queue')}
                  className={`px-6 py-3 text-sm font-medium transition-all flex items-center space-x-2 ${
                    activeTab === 'queue'
                      ? 'bg-[#892580] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Timer size={16} />
                  <span>Editing Queue</span>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                    activeTab === 'queue' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {totalQueueFiles}
                  </div>
                </button>
                <button
                  onClick={() => handleTabChange('completed')}
                  className={`px-6 py-3 text-sm font-medium transition-all flex items-center space-x-2 ${
                    activeTab === 'completed'
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <CheckCircle size={16} />
                  <span>Completed</span>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                    activeTab === 'completed' 
                      ? 'bg-white/20 text-white' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {totalCompletedFiles}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content - CLICKABLE Folder cards */}
        {currentFolders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm py-16 px-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {activeTab === 'queue' ? (
                  <Timer className="h-12 w-12 text-gray-400" />
                ) : (
                  <CheckCircle className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {activeTab === 'queue' ? 'No files in editing queue' : 'No completed edits yet'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {activeTab === 'queue' 
                  ? 'Files with edit requests will appear here organized by their original folders.'
                  : 'Completed edited files will appear here organized by their original folders.'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentFolders.map((folderData) => {
              const folder = folderData.folder;
              const files = folderData.files || [];
              const displayFiles = files.slice(0, 6); // Show max 6 thumbnails
              const hasMore = files.length > 6;

              return (
                <div 
                  key={folder._id} 
                  className="cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  onClick={() => viewFolderFiles(files)}
                >
                  
                  {/* Folder header */}
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-[#892580] rounded-lg">
                        <Folder className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {folder.displayName || folder.customName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {files.length} {activeTab === 'queue' ? 'files to edit' : 'edited files'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* File thumbnails grid */}
                  <div className="p-6">
                    {files.length === 0 ? (
                      <div className="h-32 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No files</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {displayFiles.map((file, index) => (
                          <div key={file._id} className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden hover:scale-[1.02] transition-transform">
                            {file.fileType === 'image' ? (
                              <img
                                src={file.s3Thumbnails?.small?.url}
                                alt={file.originalFilename}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                {file.s3Thumbnails?.poster?.url ? (
                                  <img
                                    src={file.s3Thumbnails.poster.url}
                                    alt={file.originalFilename}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Video className="h-4 w-4 text-gray-400" />
                                )}
                                <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                                  <Play size={6} />
                                </div>
                              </div>
                            )}
                            
                            {/* Show overlay with count if more files */}
                            {index === 5 && hasMore && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">
                                  +{files.length - 6}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Created {formatDate(folder.createdAt)}
                      </span>
                      
                      {files.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            viewFolderFiles(files);
                          }}
                          className="flex items-center space-x-1 text-[#892580] hover:text-[#a32d96] text-sm font-medium transition-colors"
                        >
                          <span>View Files</span>
                          <ChevronRightIcon size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <button 
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium" 
            onClick={() => setActiveStep(prev => prev - 1)}
          >
            Back
          </button>
          <button 
            className="px-8 py-3 bg-[#892580] text-white rounded-xl hover:bg-[#a32d96] transition-all font-medium shadow-lg" 
            onClick={() => setActiveStep(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Reusable Comment Popup */}
      <CommentPopup
        isOpen={showCommentPopup}
        onClose={closeCommentPopup}
        file={allImagesForFullscreen.find(file => file._id === commentFileId)}
        fileComments={fileComments}
        commentsLoading={commentsLoading}
        role={role}
        onAddComment={handleAddComment}
        isAddingComment={addCommentMutation.isPending}
        activeTab={activeTab} // Pass activeTab to conditionally show edit request option
      />

      {/* Full Screen Modal */}
      {showFullScreen && currentFullScreenImage && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="text-white">
              <h3 className="text-xl font-bold">{currentFullScreenImage.originalFilename}</h3>
              <p className="text-sm opacity-75">
                {allImagesForFullscreen.findIndex(f => f._id === currentFullScreenImage._id) + 1} of {allImagesForFullscreen.length}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {currentFullScreenImage.fileType === 'image' && (
                <>
                  <button
                    onClick={() => handleZoom('out')}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                  >
                    <ZoomOut size={20} />
                  </button>
                  <span className="text-white text-sm px-2">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => handleZoom('in')}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                  >
                    <ZoomIn size={20} />
                  </button>
                  <button
                    onClick={handleRotate}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                  >
                    <RotateCw size={20} />
                  </button>
                </>
              )}
              <button
                onClick={closeFullScreen}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {allImagesForFullscreen.length > 1 && (
            <>
              <button
                onClick={() => navigateFullScreen('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-xl transition-all z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => navigateFullScreen('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-xl transition-all z-10"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="flex items-center justify-center w-full h-full p-16">
            {currentFullScreenImage.fileType === 'image' ? (
              <img
                src={
                  !imageLoadError && fullResolutionData?.url 
                    ? fullResolutionData.url 
                    : currentFullScreenImage.s3?.url || 
                      currentFullScreenImage.s3Thumbnails?.medium?.url
                }
                alt={currentFullScreenImage.originalFilename}
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  cursor: zoomLevel > 1 ? 'move' : 'default'
                }}
                onLoad={() => setImageLoadError(false)}
                onError={() => setImageLoadError(true)}
              />
            ) : (
              fullResolutionData?.url ? (
                <video
                  src={fullResolutionData.url}
                  controls
                  className="max-w-full max-h-full"
                  autoPlay
                />
              ) : (
                <div className="text-white text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p>Loading video...</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for downloading files
function DownloadButton({ file }) {
  const { data: fileUrl, isLoading } = useMediaFileUrl(file._id);
  
  if (isLoading) {
    return (
      <button disabled className="text-gray-400 p-1">
        <Loader2 size={12} className="animate-spin" />
      </button>
    );
  }
  
  return (
    <a
      href={fileUrl?.url}
      download={file.originalFilename}
      onClick={(e) => e.stopPropagation()}
      className="text-[#892580] hover:text-[#a32d96] transition-colors p-1 rounded hover:bg-purple-50"
      title="Download file"
    >
      <Download size={12} />
    </a>
  );
}

