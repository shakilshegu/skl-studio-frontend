import { useState, useEffect } from 'react';
import { 
  Image as ImageIcon,
  Video, 
  MessageSquare, 
  Printer,
  FolderOpen,
  X,
  Send,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Loader2,
  CheckCircle,
  LayoutGrid,
  Search,
  Download,
  DownloadCloud
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  usePrintingFolders,
  useApprovedFiles,
  useMediaFileUrl,
  useFileComments,
  useAddComment,
  useCompleteBooking,
  useDownloadFile,
  useDownloadAllApprovedFiles,
  useDownloadFolderFiles,
  mediaKeys
} from '@/hooks/useMediaQueries';
import useFullScreenKeyHandler from '@/hooks/useFullScreenKeyHandler';
import useFullScreenViewer from '@/hooks/useFullScreenViewer';
import { showToast } from '@/components/Toast/Toast';
import { showConfirm } from '@/components/Toast/Confirmation';
import CommentPopup from '@/components/work-flow/commentPopUp';

export default function PrintingPage({ bookingData, setActiveStep, role }) {
  const bookingId = bookingData?._id;
  
  // State management
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [commentFileId, setCommentFileId] = useState(null);
  const [activeView, setActiveView] = useState('folders'); // 'folders' or 'all'
  const [allImagesForFullscreen, setAllImagesForFullscreen] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get query client
  const queryClient = useQueryClient();
  
  // API hooks
  const { data: printingFoldersData = [], isLoading: foldersLoading } = usePrintingFolders(bookingId);
  const { data: approvedFilesData, isLoading: filesLoading } = useApprovedFiles(bookingId);
  const { data: fileComments = [], isLoading: commentsLoading } = useFileComments(commentFileId);
  
  // Mutation hooks
  const addCommentMutation = useAddComment();
  const completeBookingMutation = useCompleteBooking();
  const downloadFileMutation = useDownloadFile();
  const downloadAllMutation = useDownloadAllApprovedFiles();
  const downloadFolderMutation = useDownloadFolderFiles();
    
  // Process approved files
  const approvedFiles = approvedFilesData?.files || [];
  const totalApprovedCount = approvedFiles.length;

  // Simplified download functions
  const downloadFile = async (fileId, filename) => {
    try {
      await downloadFileMutation.mutateAsync({ fileId, filename });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const downloadAllFiles = async () => {
    if (approvedFiles.length === 0) return;
    
    const confirmed = await showConfirm(
      `Download all ${approvedFiles.length} approved files as a ZIP archive? This may take a few moments.`,"green"
    );

    if (!confirmed) return;
    
    try {
      await downloadAllMutation.mutateAsync({ bookingId });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const downloadFolderFiles = async (folder) => {
    const approvedFiles = folder.files.filter(f => f.status === 'approved_for_print');
    
    if (approvedFiles.length === 0) {
      showToast('No approved files in this folder to download.',"error");
      return;
    }
    
    const confirmed = await showConfirm(
      `Download all ${approvedFiles.length} files from "${folder.displayName}" as a ZIP archive?`,"green"
    );

    if (!confirmed) return;
    
    try {
      await downloadFolderMutation.mutateAsync({ 
        folderId: folder._id, 
        folderName: folder.displayName 
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  // Comment handlers
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


      
      if (isEditRequest) {

                   // Update selectedFolderFiles - remove old file and add new one if it exists
      if (selectedFolder) {
setSelectedFolder(prev =>
  prev
    ? {
        ...prev,
        files: prev.files.filter(file => file._id !== fileId)
      }
    : null
);
      }

        // Refresh queries when file moves back to editing
        queryClient.invalidateQueries({ queryKey: mediaKeys.approvedFiles(bookingId) });
        queryClient.invalidateQueries({ queryKey: mediaKeys.printingFolders(bookingId) });
        queryClient.invalidateQueries({ queryKey: mediaKeys.editingQueue(bookingId) });
        
        showToast('File moved back to editing queue for re-editing',"success");
        closeCommentPopup();
      } else {
        closeCommentPopup();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      showToast('Error adding comment. Please try again.',"error");
      throw error; // Re-throw to let CommentPopup handle the error
    }
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
    downloadFile: (image) => downloadFile(image._id, image.originalFilename),
  });

  const { data: fullResolutionData } = useMediaFileUrl(
    showFullScreen ? currentFullScreenImage?._id : null
  );

  // Handle complete booking
  const handleCompleteBooking = async () => {
    const confirmed = await showConfirm(
      'Are you sure you want to complete this booking? This will move it to the closure stage.',"red"
    );

    
    if (!confirmed) return;
    
    try {
      await completeBookingMutation.mutateAsync({ bookingId });
      showToast('Booking completed successfully!',"success");
      setActiveStep(prev => prev + 1);
    } catch (error) {
      console.error('Error completing booking:', error);
      showToast('Error completing booking. Please try again.',"error");
    }
  };
  
  // Helper functions
  const getAllFilesFlat = () => {
    const allFiles = [];
    printingFoldersData.forEach(folderData => {
      folderData.files.forEach(file => {
        allFiles.push({
          ...file,
          folderName: folderData.folder.displayName
        });
      });
    });
    return allFiles;
  };

  const getFilteredFiles = (files) => {
    if (!searchTerm) return files;
    return files.filter(file => 
      file.originalFilename.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  if (foldersLoading || filesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-[#892580]" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading approved files...</h3>
              <p className="text-gray-500">Please wait while we gather your content</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto space-y-6">
        
        {/* Controls Bar */}
        <div className="py-4 bg-transparent">
          <div className="flex items-center justify-between">
            <div className="flex w-full justify-between items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                />
              </div>
              
              {/* Download All Button */}
              {totalApprovedCount > 0 && (
                <button
                  onClick={downloadAllFiles}
                  disabled={downloadAllMutation.isPending}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
                >
                  {downloadAllMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <DownloadCloud className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                    {downloadAllMutation.isPending ? 'Creating ZIP...' : `Download All (${totalApprovedCount})`}
                  </span>
                </button>
              )}
              
              {/* View Toggle */}
              <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveView('folders')}
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    activeView === 'folders'
                      ? 'bg-[#892580] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <FolderOpen className="h-4 w-4 inline mr-2" />
                  By Folders
                </button>
                <button
                  onClick={() => setActiveView('all')}
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    activeView === 'all'
                      ? 'bg-[#892580] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4 inline mr-2" />
                  All Files
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {totalApprovedCount === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Printer className="h-16 w-16 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No approved files yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Files need to be approved in the Content or Editing sections before they appear here for printing.
              </p>
            </div>
          </div>
        ) : activeView === 'folders' ? (
          /* Folder View */
          <div className="space-y-6">
            {selectedFolder ? (
              /* Single Folder View */
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setSelectedFolder(null)}
                        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                      </button>
                      <FolderOpen className="h-6 w-6 text-[#892580]" />
                      <h2 className="text-xl font-bold text-gray-800">
                        {selectedFolder.displayName}
                      </h2>
                      <div className="bg-purple-100 text-[#892580] px-3 py-1 rounded-full text-sm font-medium">
                        {selectedFolder.files.filter(f => f.status === 'approved_for_print').length} files
                      </div>
                    </div>
                    
                    {/* Download folder files button */}
                    <button
                      onClick={() => downloadFolderFiles(selectedFolder)}
                      disabled={downloadFolderMutation.isPending}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                    >
                      {downloadFolderMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      <span>{downloadFolderMutation.isPending ? 'Creating ZIP...' : 'Download Folder'}</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div 
                    className="gap-3 mb-8"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                      width: '100%'
                    }}
                  >
                    {getFilteredFiles(selectedFolder.files.filter(f => f.status === 'approved_for_print'))
                      .map((file, index) => (
                        <div
                          key={file._id}
                          className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                        > 
                          <div className="aspect-square relative">
                            {file.fileType === 'image' ? (
                              <img
                                src={file.s3Thumbnails?.medium?.url || file.s3Thumbnails?.small?.url}
                                alt={file.originalFilename}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                                {file.thumbnailUrls?.poster ? (
                                  <img
                                    src={file.thumbnailUrls.poster}
                                    alt={file.originalFilename}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <Video className="h-12 w-12 text-gray-400" />
                                )}
                                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                                  <Video size={10} className="mr-1" />
                                  Video
                                </div>
                              </div>
                            )}

                            {/* Approved Badge */}
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium flex items-center">
                              <CheckCircle size={10} className="mr-1" />
                              APPROVED
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                              <button
                                onClick={() => {
                                  const folderFiles = selectedFolder.files.filter(f => f.status === 'approved_for_print');
                                  const currentIndex = folderFiles.findIndex(f => f._id === file._id);
                                  openFullScreen(currentIndex, folderFiles);
                                  setAllImagesForFullscreen(folderFiles);
                                }}
                                className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-lg transition-colors"
                                title="View full screen"
                              >
                                <Maximize size={16} />
                              </button>
                              
                              <button
                                onClick={() => downloadFile(file._id, file.originalFilename)}
                                disabled={downloadFileMutation.isPending}
                                className="bg-white/90 hover:bg-white text-green-600 p-2 rounded-lg transition-colors disabled:opacity-50"
                                title="Download original"
                              >
                                {downloadFileMutation.isPending ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Download size={16} />
                                )}
                              </button>
                              
                              <button
                                onClick={() => openCommentPopup(file._id)}
                                className="bg-white/90 hover:bg-white text-[#892580] p-2 rounded-lg transition-colors"
                                title="View comments"
                              >
                                <MessageSquare size={16} />
                              </button>
                            </div>
                          </div>

                          <div className="p-3">
                            <div className="text-sm font-medium text-gray-800 truncate mb-1" title={file.originalFilename}>
                              {file.originalFilename}
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center">
                                {file.fileType === 'image' ? (
                                  <ImageIcon size={12} className="mr-1" />
                                ) : (
                                  <Video size={12} className="mr-1" />
                                )}
                                {file.fileType}
                              </span>
                              {(file.commentCount > 0 || file.editComments?.length > 0) && (
                                <span className="flex items-center bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                  <MessageSquare size={10} className="mr-1" />
                                  {(file.commentCount || 0) + (file.editComments?.length || 0)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            ) : (
              /* Folder Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {printingFoldersData.map((folderData) => {
                  const approvedFiles = folderData.files.filter(f => f.status === 'approved_for_print');
                  const filteredFiles = getFilteredFiles(approvedFiles);
                  
                  if (searchTerm && filteredFiles.length === 0) return null;
                  
                  return (
                    <div
                      key={folderData.folder._id}
                      onClick={() => setSelectedFolder({ ...folderData.folder, files: folderData.files })}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-purple-200"
                    >
                      {/* Folder Header */}
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b border-gray-100">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="bg-[#892580] p-3 rounded-xl">
                            <FolderOpen className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#892580] transition-colors">
                              {folderData.folder.displayName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {approvedFiles.length} approved files
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Preview Grid */}
                      <div className="p-4">
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {approvedFiles.slice(0, 6).map((file, index) => (
                            <div key={file._id} className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                             
                              {file.fileType === 'image' ? (
                                <img
                                  src={file.s3Thumbnails?.medium?.url || file.s3Thumbnails?.small?.url}
                                  alt={file.originalFilename}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <Video className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                              
                              {index === 5 && approvedFiles.length > 6 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">
                                    +{approvedFiles.length - 6}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {/* Empty slots */}
                          {Array.from({ length: Math.max(0, 6 - approvedFiles.length) }).map((_, index) => (
                            <div key={`empty-${index}`} className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"></div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            Created {new Date(folderData.folder.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex items-center text-[#892580] group-hover:text-purple-700">
                            <span className="font-medium">View Files</span>
                            <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* All Files View */
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">All Approved Files</h2>
              <p className="text-gray-500">Complete collection of files ready for printing</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {getFilteredFiles(getAllFilesFlat().filter(f => f.status === 'approved_for_print')).map((file, index) => (
                <div
                  key={file._id}
                  className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="aspect-square relative">
                    
                    {file.fileType === 'image' ? (
                      <img
                        src={file.s3Thumbnails?.medium?.url || file.s3Thumbnails?.small?.url}
                        alt={file.originalFilename}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                        {file.thumbnailUrls?.poster ? (
                          <img
                            src={file.thumbnailUrls.poster}
                            alt={file.originalFilename}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <Video className="h-12 w-12 text-gray-400" />
                        )}
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                          <Video size={10} className="mr-1" />
                          Video
                        </div>
                      </div>
                    )}

                    {/* Approved Badge */}
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium flex items-center">
                      <CheckCircle size={10} className="mr-1" />
                      APPROVED
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                      <button
                        onClick={() => {
                          openFullScreen(index, getAllFilesFlat());
                          setAllImagesForFullscreen(getAllFilesFlat());
                        }}
                        className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-lg transition-colors"
                        title="View full screen"
                      >
                        <Maximize size={16} />
                      </button>
                      
                      <button
                        onClick={() => downloadFile(file._id, file.originalFilename)}
                        disabled={downloadFileMutation.isPending}
                        className="bg-white/90 hover:bg-white text-green-600 p-2 rounded-lg transition-colors disabled:opacity-50"
                        title="Download original"
                      >
                        {downloadFileMutation.isPending ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Download size={16} />
                        )}
                      </button>
                      
                      <button
                        onClick={() => openCommentPopup(file._id)}
                        className="bg-white/90 hover:bg-white text-[#892580] p-2 rounded-lg transition-colors"
                        title="View comments"
                      >
                        <MessageSquare size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="text-sm font-medium text-gray-800 truncate mb-1" title={file.originalFilename}>
                      {file.originalFilename}
                    </div>
                    <div className="text-xs text-gray-500 truncate mb-1" title={file.folderName}>
                      From: {file.folderName}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        {file.fileType === 'image' ? (
                          <ImageIcon size={12} className="mr-1" />
                        ) : (
                          <Video size={12} className="mr-1" />
                        )}
                        {file.fileType}
                      </span>
                      {file.commentCount > 0 && (
                        <span className="flex items-center bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                          <MessageSquare size={10} className="mr-1" />
                          {file.commentCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complete Booking Section */}
        {totalApprovedCount > 0 && role === 'user' && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Ready to Complete?</h3>
            <p className="text-green-100 mb-6">
              {totalApprovedCount} files are approved and ready for printing
            </p>
            <button
              onClick={handleCompleteBooking}
              disabled={completeBookingMutation.isPending}
              className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors shadow-lg disabled:bg-green-300 disabled:cursor-not-allowed"
            >
              {completeBookingMutation.isPending ? 'Completing...' : 'Complete Booking & Send to Print'}
            </button>
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
            className="px-8 py-3 bg-[#892580] text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-medium shadow-lg" 
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
        file={(() => {
          const allFiles = getAllFilesFlat();
          return allFiles.find(f => f._id === commentFileId) || 
                 approvedFiles.find(f => f._id === commentFileId);
        })()}
        fileComments={fileComments}
        commentsLoading={commentsLoading}
        role={role}
        onAddComment={handleAddComment}
        isAddingComment={addCommentMutation.isPending}
        showEditRequest={true} // Always show edit request option for printing files
      />

      {/* Full Screen Modal */}
      {showFullScreen && currentFullScreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="text-white">
              <h3 className="text-xl font-bold">{currentFullScreenImage.originalFilename}</h3>
              <p className="text-sm opacity-75">
                {currentFullScreenImage.index + 1} of {allImagesForFullscreen.length} • Approved for Printing
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Download button in full screen */}
              <button
                onClick={() => downloadFile(currentFullScreenImage._id, currentFullScreenImage.originalFilename)}
                disabled={downloadFileMutation.isPending}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                title="Download original (D)"
              >
                {downloadFileMutation.isPending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Download size={20} />
                )}
              </button>
              
              {currentFullScreenImage.fileType === 'image' && (
                <>
                  <button
                    onClick={() => handleZoom('out')}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                    title="Zoom out (-)"
                  >
                    <ZoomOut size={20} />
                  </button>
                  <span className="text-white text-sm px-2">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => handleZoom('in')}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                    title="Zoom in (+)"
                  >
                    <ZoomIn size={20} />
                  </button>
                  
                  <button
                    onClick={handleRotate}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                    title="Rotate (R)"
                  >
                    <RotateCw size={20} />
                  </button>
                </>
              )}
              
              <button
                onClick={closeFullScreen}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                title="Close (ESC)"
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
                title="Previous (←)"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => navigateFullScreen('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-xl transition-all z-10"
                title="Next (→)"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="flex items-center justify-center w-full h-full p-16">
            {currentFullScreenImage?.fileType === 'image' ? (
              <img
                src={
                  !imageLoadError && fullResolutionData?.url
                    ? fullResolutionData?.url
                    : currentFullScreenImage?.s3?.url || currentFullScreenImage.s3Thumbnails?.medium?.url
                }
                alt={currentFullScreenImage.originalFilename || 'Image'}
                className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  cursor: zoomLevel > 1 ? 'move' : 'default'
                }}
                draggable={false}
                onLoad={() => setImageLoadError(false)}
                onError={() => setImageLoadError(true)}
              />
            ) : fullResolutionData?.url ? (
              <video
                src={fullResolutionData.url}
                controls
                className="max-w-full max-h-full rounded-lg"
                autoPlay
              >
                Your browser does not support video playback.
              </video>
            ) : (
              <div className="flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Loading video...</p>
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-4 text-white text-xs opacity-60">
            <p>ESC: Close • ← →: Navigate • +/-: Zoom • R: Rotate • D: Download</p>
          </div>
        </div>
      )}
    </div>
  );
}

