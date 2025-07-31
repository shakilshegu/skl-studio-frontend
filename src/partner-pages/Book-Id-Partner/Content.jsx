

import { useState, useRef, useEffect } from "react";
import {
  FolderPlus,
  Upload,
  ArrowLeft,
  Trash2,
  FolderOpen,
  Image,
  Video,
  FileText,
  MessageSquare,
  X,
  Send,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Maximize,
  CheckCircle,
  Loader2,
  RotateCcw,
  Eye,
  Plus,
  Grid3X3,
  Camera
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useBookingFolders,
  useCreateFolder,
  useFolderMedia,
  useUploadFiles,
  useRemoveFiles,
  useAddComment,
  useFileComments,
  useMediaFileUrl,
  useRestoreFiles,
  useApproveFiles,
  mediaKeys,
} from "@/hooks/useMediaQueries";
import useFullScreenKeyHandler from "@/hooks/useFullScreenKeyHandler";
import useFullScreenViewer from "@/hooks/useFullScreenViewer";
import { showToast } from "@/components/Toast/Toast";
import { showConfirm } from "@/components/Toast/Confirmation";
import CommentPopup from "@/components/work-flow/commentPopUp";


export default function Content({ role, bookingData, setActiveStep }) {
  const bookingId = bookingData?._id;

  

  // State management
  const [currentFolder, setCurrentFolder] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(null);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [commentImageId, setCommentImageId] = useState(null);
  const [showRemovedFiles, setShowRemovedFiles] = useState(false);
  const [selectedRemovedFiles, setSelectedRemovedFiles] = useState([]);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0);

  const fileInputRef = useRef(null);

  // Get query client for manual cache updates
  const queryClient = useQueryClient();

  

  // API hooks
  const { data: folders = [], isLoading: foldersLoading } = useBookingFolders(
    bookingId,
    "content"
  );
  const { data: folderMedia, isLoading: mediaLoading } = useFolderMedia(
    currentFolder?._id
  );
  const { data: fileComments = [], isLoading: commentsLoading } =
    useFileComments(commentImageId);

  // Get removed files (find the removed folder)
  const removedFolder = folders.find(
    (folder) => folder.folderType === "removed_folder"
  );
  const { data: removedMedia } = useFolderMedia(removedFolder?._id, {
    enabled: !!removedFolder,
  });
  const removedFiles = removedMedia?.pages?.flatMap((page) => page.files) || [];

  // Get full resolution URL for current full screen image
  const allImagesForFullscreen =
    folderMedia?.pages?.flatMap((page) => page.files) || [];

  const createFolderMutation = useCreateFolder();
  const uploadFilesMutation = useUploadFiles();
  const removeFilesMutation = useRemoveFiles();
  const addCommentMutation = useAddComment();
  const restoreFilesMutation = useRestoreFiles();
  const approveFilesMutation = useApproveFiles();

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await createFolderMutation.mutateAsync({
        bookingId,
        customName: newFolderName,
      });
      setNewFolderName("");
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  // Handle folder opening
  const handleOpenFolder = (folder) => {
    setCurrentFolder(folder);
    setSelectedImages([]);
    setSelectedRemovedFiles([]);
    setShowRemovedFiles(false);
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !currentFolder) return;

    try {
      await uploadFilesMutation.mutateAsync(
        {
          files,
          bookingId,
          folderId: currentFolder._id,
        },
        {
          context: {
            bookingId,
            folderId: currentFolder._id,
          },
        }
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  // Toggle image selection (for active files)
  const toggleImageSelection = (imageId) => {
    setSelectedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  // Toggle removed file selection - FIXED VERSION
  const toggleRemovedFileSelection = (fileId) => {
    // Use functional update to ensure we get the latest state
    setSelectedRemovedFiles((currentSelected) => {
      const isSelected = currentSelected.includes(fileId);

      let newSelection;
      if (isSelected) {
        newSelection = currentSelected.filter((id) => id !== fileId);
      } else {
        newSelection = [...currentSelected, fileId];
      }

      return newSelection;
    });
  };

  // Approve selected Images
  const handleApproveImages = async () => {
    if (!selectedImages.length) return;


    const userConfirmed = await showConfirm(`Approve ${selectedImages.length} file(s)? This will move them to the approved files for printing.`,"green");
if (!userConfirmed) return;

    try {
      await approveFilesMutation.mutateAsync(
        {
          fileIds: selectedImages,
          bookingId,
        },
        {
          context: {
            bookingId,
          },
        }
      );

      // Clear selection after successful approval
      setSelectedImages([]);

      // Optionally show success message
      // alert(`${selectedImages.length} file(s) approved successfully!`);
      showToast(`${selectedImages.length} file(s) approved successfully!`,"success")
    } catch (error) {
      console.error("Error approving files:", error);
      showToast("Error approving files. Please try again.","error")
      // alert("Error approving files. Please try again.");
    }
  };

  const handleRemoveImages = async () => {
    if (!selectedImages.length) return;

    try {
      const folderMediaKey = ["media", "folderMedia", currentFolder._id];
      const foldersKey = ["media", "folders", bookingId, "content"];

      queryClient.setQueryData(folderMediaKey, (oldData) => {
        if (!oldData?.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            files: page.files.filter(
              (file) => !selectedImages.includes(file._id)
            ),
          })),
        };
      });

      queryClient.setQueryData(foldersKey, (oldData) => {
        if (!Array.isArray(oldData)) return oldData;

        return oldData.map((folder) =>
          folder._id === currentFolder._id
            ? {
                ...folder,
                fileCount: Math.max(
                  (folder.fileCount || 0) - selectedImages.length,
                  0
                ),
              }
            : folder
        );
      });

      setSelectedImages([]);

      await removeFilesMutation.mutateAsync({
        fileIds: selectedImages,
      });

      queryClient.invalidateQueries({ queryKey: folderMediaKey });
      queryClient.invalidateQueries({ queryKey: foldersKey });
    } catch (error) {
      console.error("Error removing files:", error);

      queryClient.invalidateQueries({
        queryKey: ["media", "folderMedia", currentFolder._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["media", "folders", bookingId, "content"],
      });

      setSelectedImages([]);
    }
  };

  // Go back to folders view
  const handleBackToFolders = () => {
    setCurrentFolder(null);
    setSelectedImages([]);
    setSelectedRemovedFiles([]);
    setShowRemovedFiles(false);
  };

  // Handle comment popup
  const openCommentPopup = (imageId) => {
    setCommentImageId(imageId);
    setShowCommentPopup(true);
  };

  const closeCommentPopup = () => {
    setShowCommentPopup(false);
    setCommentImageId(null);
  };

  // Add comment
  const handleAddComment = async ({ fileId, commentText, isEditRequest }) => {
    if (!commentText.trim() || !fileId) return;

    try {
      await addCommentMutation.mutateAsync({
        fileId,
        commentText,
        isEditRequest,
      });

      // If it's an edit request, the file will be moved to editing queue
      // We need to refresh the folder media to reflect the change
      if (isEditRequest) {
        // File will be moved out of current folder, so refresh current folder
        queryClient.invalidateQueries({
          queryKey: mediaKeys.folderMedia(currentFolder._id),
        });

        // Also refresh folder counts
        queryClient.invalidateQueries({
          queryKey: mediaKeys.foldersByStage(bookingId, "content"),
        });

        // Refresh editing queue if user is on editing page
        queryClient.invalidateQueries({
          queryKey: mediaKeys.editingQueue(bookingId),
        });

        queryClient.invalidateQueries({
          queryKey: mediaKeys.editingQueueByFolder(bookingId),
        });

        // Clear selection since file might be moved
        setSelectedImages((prev) => prev.filter((id) => id !== fileId));
        closeCommentPopup();
      }

      // closeCommentPopup();
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error; // Re-throw to let CommentPopup handle the error
    }
  };

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
    setImageLoadError,
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

  const handleRestoreFiles = async () => {
    if (!selectedRemovedFiles.length) return;


const userConfirmed = await showConfirm(`Restore ${selectedRemovedFiles.length} file(s)?`,"red");


if (!userConfirmed) return;

    try {
      const folderMediaKey = ["media", "folderMedia"];
      const removedFolderKey = ["media", "folderMedia", removedFolder._id];
      const foldersKey = ["media", "folders", bookingId, "content"];

      const filesToRestore = removedFiles.filter((file) =>
        selectedRemovedFiles.includes(file._id)
      );

      queryClient.setQueryData(folderMediaKey, (oldData) => {
        if (!oldData?.pages) return oldData;

        const newFiles = filesToRestore.map((file) => ({
          ...file,
          status: "active",
        }));

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) =>
            index === 0
              ? { ...page, files: [...newFiles, ...page.files] }
              : page
          ),
        };
      });

      queryClient.setQueryData(removedFolderKey, (oldData) => {
        if (!oldData?.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            files: page.files.filter(
              (file) => !selectedRemovedFiles.includes(file._id)
            ),
          })),
        };
      });

      setSelectedRemovedFiles([]);

      await restoreFilesMutation.mutateAsync({
        fileIds: selectedRemovedFiles,
        // targetFolderId: targetFolder._id, 
      });

      queryClient.invalidateQueries({ queryKey: folderMediaKey });
      queryClient.invalidateQueries({ queryKey: removedFolderKey });
      queryClient.invalidateQueries({ queryKey: foldersKey });
    } catch (error) {
      console.error("Error restoring files:", error);

      setSelectedRemovedFiles([]);
      queryClient.invalidateQueries({
        queryKey: ["media", "folderMedia"],
      });
    }
  };

  if (foldersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
        <div className="p-4 mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-[#892580]" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading content...</h3>
              <p className="text-gray-500">Please wait while we gather your folders</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ">
      <div className="p-4 mx-auto space-y-6">
        
        {!currentFolder ? (
          /* Folders Overview */
          <>
            {/* Header Section */}
        {/* <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-[#892580] px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-xl">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1">
                        Content Management
                      </h1>
                      <p className="text-white">
                        Organize and manage your media content by folders
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 rounded-xl px-4 py-2">
                      <div className="text-2xl font-bold text-white">{folders.length}</div>
                      <div className="text-white text-sm">Folders</div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {(folders.length === 0 ) ? (
              /* Empty State */
              <div className="bg-white rounded-2xl  shadow-xl p-12">
                <div className="text-center">
                  {role==="partner" &&<div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FolderPlus className="h-16 w-16 text-blue-400" />
                  </div>}
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    No folders created yet
                  </h3>
                  {role==="partner" &&(<p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Create folders to organize your content uploads for this booking
                  </p>)}
                  {role==="partner" &&<div className="max-w-sm mx-auto space-y-4">
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Enter folder name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddFolder();
                        }
                      }}
                    />
                    <button
                      onClick={handleAddFolder}
                      disabled={
                        !newFolderName.trim() || createFolderMutation.isPending
                      }
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#892580] text-white rounded-xl hover:[#892580] transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg"
                    >
                      <FolderPlus size={18} />
                      {createFolderMutation.isPending
                        ? "Creating..."
                        : "Create Folder"}
                    </button>
                  </div>}
                </div>
              </div>
            ) : (
              /* Folders Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {folders.map((folder) => (
                  <div
                    key={folder._id}
                    onClick={() => handleOpenFolder(folder)}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-purple-200 hover:scale-[1.02]"
                  >
                    <div className="p-6">
                      <div className="w-16 h-16 bg-[#892580] rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FolderOpen className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 truncate mb-2 group-hover:text-[#892580] transition-colors">
                          {folder.displayName || folder.customName}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                          <span>{folder.fileCount || 0} items</span>
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(folder.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {role === "partner" && (
                  <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-dashed border-gray-200 hover:border-purple-300">
                    <div className="p-6 text-center">
                      <div className="w-16 h-16 bg-gray-100 group-hover:bg-purple-50 rounded-xl mb-4 flex items-center justify-center mx-auto transition-colors">
                        <Plus className="h-8 w-8 text-gray-400 group-hover:text-purple-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Folder name"
                        className="w-full px-3 py-2 mb-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          e.stopPropagation();
                          if (e.key === "Enter") {
                            handleAddFolder();
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddFolder();
                        }}
                        disabled={
                          !newFolderName.trim() ||
                          createFolderMutation.isPending
                        }
                        className="w-full text-sm px-4 py-2 bg-[#892580] text-white rounded-lg  transition-colors disabled:bg-gray-300 font-medium"
                      >
                        {createFolderMutation.isPending ? 'Creating...' : 'Add'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Folder Content View */
          <>
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-[#892580] px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleBackToFolders}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                    >
                      <ArrowLeft size={20} className="text-white" />
                    </button>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <FolderOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">
                        {currentFolder.displayName || currentFolder.customName}
                      </h1>
                      <p className="text-purple-100 text-sm">
                        Manage your media files
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {removedFiles.length > 0 && (
                      <button
                        onClick={() => {
                          setShowRemovedFiles(!showRemovedFiles);
                          setSelectedImages([]);
                          setSelectedRemovedFiles([]);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          showRemovedFiles
                            ? "bg-red-500/20 text-white border border-red-300/30"
                            : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                        }`}
                      >
                        {showRemovedFiles
                          ? "Show Active Files"
                          : `Removed (${removedFiles.length})`}
                      </button>
                    )}

                    <div className="bg-white/20 rounded-lg px-3 py-2 text-white text-sm">
                      {showRemovedFiles
                        ? selectedRemovedFiles.length > 0
                          ? `${selectedRemovedFiles.length} selected`
                          : `${removedFiles.length} removed items`
                        : selectedImages.length > 0
                        ? `${selectedImages.length} selected`
                        : `${allImagesForFullscreen.length} items`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            {showRemovedFiles ||
            (currentFolder?.displayName || currentFolder?.customName) ===
              "Removed Images" ||
            currentFolder?.folderType === "removed_folder" ? (
              /* Removed Files View */
              <div className="bg-white rounded-2xl shadow-xl p-4">
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Trash2 size={16} className="text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-red-800">
                        Viewing Removed Files
                      </h3>
                      <p className="text-xs text-red-600">
                        Select files to restore them to "{currentFolder.displayName || currentFolder.customName}"
                      </p>
                    </div>
                  </div>
                </div>

                {removedFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full mb-4 flex items-center justify-center mx-auto">
                      <Trash2 className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No removed files
                    </h3>
                    <p className="text-gray-500">
                      Files you remove will appear here and can be restored
                    </p>
                  </div>
                ) : (
                  <>
                    <div 
                      className="gap-3 mb-8"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        width: '100%'
                      }}
                    >
                      {removedFiles.map((file) => (
                        <div
                          key={file._id}
                          className={`group relative bg-white border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                            selectedRemovedFiles.includes(file._id)
                              ? "ring-2 ring-green-500 border-green-500 bg-green-50 scale-[1.02]"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                          }`}
                          onClick={() => toggleRemovedFileSelection(file._id)}
                        >
                          <div className="aspect-square relative">
                            {file.fileType === "image" ? (
                              <img
                                src={
                                  file.s3Thumbnails?.medium?.url ||
                                  file.s3Thumbnails?.small?.url
                                }
                                alt={file.originalFilename}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                {file.s3Thumbnails?.poster?.url ? (
                                  <img
                                    src={file.s3Thumbnails?.poster?.url}
                                    alt={file.originalFilename}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <Video className="h-12 w-12 text-gray-400" />
                                )}
                              </div>
                            )}

                            {/* Removed overlay */}
                            <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                              <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                                REMOVED
                              </div>
                            </div>

                            {/* Selection indicator */}
                            {selectedRemovedFiles.includes(file._id) && (
                              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow-lg">
                                <CheckCircle size={16} className="text-white" />
                              </div>
                            )}
                          </div>

                          <div className="p-3">
                            <div className="text-sm font-medium text-gray-800 truncate mb-1">
                              {file.originalFilename}
                            </div>
                            <div className="text-xs text-gray-500">
                              Removed {new Date(file.removedAt || file.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Restore Actions */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="text-sm text-gray-600 text-center">
                        {selectedRemovedFiles.length > 0
                          ? `${selectedRemovedFiles.length} selected for restoration`
                          : `${removedFiles.length} removed items - Click to select`}
                      </div>

                      <div className="flex space-x-3">
                        {selectedRemovedFiles.length > 0 ? (
                          <>
                            <button
                              onClick={() => setSelectedRemovedFiles([])}
                              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                              Clear Selection
                            </button>
                            <button
                              onClick={handleRestoreFiles}
                              disabled={restoreFilesMutation.isPending}
                              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed shadow-lg"
                            >
                              <RotateCcw size={16} />
                              {restoreFilesMutation.isPending
                                ? "Restoring..."
                                : `Restore ${selectedRemovedFiles.length} File${
                                    selectedRemovedFiles.length > 1 ? "s" : ""
                                  }`}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setSelectedRemovedFiles(removedFiles.map((f) => f._id))}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Select All ({removedFiles.length})
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Active Files View */
              <div className="bg-white rounded-2xl shadow-xl p-4">
                {allImagesForFullscreen.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6 flex items-center justify-center mx-auto">
                      <Upload className="h-16 w-16 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      No media in this folder
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Upload images and videos to get started
                    </p>
                    <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#892580] text-white rounded-xl hover:[#892580] transition-all cursor-pointer shadow-lg">
                      <Upload size={18} />
                      {uploadFilesMutation.isPending ? "Uploading..." : "Upload Media"}
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,video/*"
                      />
                    </label>
                  </div>
                ) : (
                  <>
                    {mediaLoading ? (
                      <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#892580]" />
                        <p className="text-gray-500">Loading media...</p>
                      </div>
                    ) : (
                      <div 
                        className="gap-3 mb-8"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                          width: '100%'
                        }}
                      >
                        {allImagesForFullscreen.map((image, index) => (
                          <div
                            key={image._id}
                            onClick={() => toggleImageSelection(image._id)}
                            className={`group relative bg-white border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                              selectedImages.includes(image._id)
                                ? "ring-2 ring-purple-500 border-purple-500 scale-[1.02]"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                            }`}
                          >
                            <div className="aspect-square relative">
                              {image.fileType === "image" ? (
                                <img
                                  src={
                                    image.s3Thumbnails?.medium?.url ||
                                    image.s3Thumbnails?.small?.url
                                  }
                                  alt={image.originalFilename}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center relative">
                                  {image.s3Thumbnails?.poster?.url ? (
                                    <img
                                      src={image.s3Thumbnails.poster.url}
                                      alt={image.originalFilename}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <Video className="h-12 w-12 text-gray-400" />
                                  )}
                                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                                    <Video size={10} className="inline mr-1" />
                                    Video
                                  </div>
                                </div>
                              )}

                              {/* Hover Actions */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openFullScreen(index);
                                  }}
                                  className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-lg transition-all transform hover:scale-105"
                                  title="View full screen"
                                >
                                  <Maximize size={16} />
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openCommentPopup(image._id);
                                  }}
                                  className="bg-white/90 hover:bg-white text-[#892580] p-2 rounded-lg transition-all transform hover:scale-105"
                                  title="Add comment or request edit"
                                >
                                  <MessageSquare size={16} />
                                </button>
                              </div>

                              {/* Selection indicator */}
                              {selectedImages.includes(image._id) && (
                                <div className="absolute top-2 right-2 bg-[#892580] rounded-full p-1 shadow-lg">
                                  <CheckCircle size={16} className="text-white" />
                                </div>
                              )}
                            </div>

                            <div className="p-3">
                              <div className="text-sm font-medium text-gray-800 truncate mb-1">
                                {image.originalFilename}
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  {image.fileType === "image" ? (
                                    <Image size={12} />
                                  ) : (
                                    <Video size={12} />
                                  )}
                                  {image.fileType}
                                </span>
                                {image.commentCount > 0 && (
                                  <span className="flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                    <MessageSquare size={10} />
                                    {image.commentCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-600">
                        {selectedImages.length > 0
                          ? `${selectedImages.length} selected`
                          : `${allImagesForFullscreen.length} items`}
                      </div>
                      <div className="flex space-x-2">
                        {selectedImages.length > 0 ? (
                          <>
                            <button
                              onClick={handleApproveImages}
                              disabled={approveFilesMutation.isPending}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed shadow-lg"
                            >
                              <CheckCircle size={16} />
                              {approveFilesMutation.isPending
                                ? "Approving..."
                                : "Approve Selected"}
                            </button>
                            <button
                              onClick={handleRemoveImages}
                              disabled={removeFilesMutation.isPending}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-300 shadow-lg"
                            >
                              <Trash2 size={16} />
                              {removeFilesMutation.isPending
                                ? "Removing..."
                                : "Remove Selected"}
                            </button>
                          </>
                        ) : (
                          <label className="flex items-center gap-2 px-4 py-2 bg-[#892580] text-white rounded-lg hover:[#892580] transition-all cursor-pointer shadow-lg">
                            <Upload size={16} />
                            {uploadFilesMutation.isPending ? "Uploading..." : "Upload More"}
                            <input
                              ref={fileInputRef}
                              type="file"
                              multiple
                              onChange={handleFileUpload}
                              className="hidden"
                              accept="image/*,video/*"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <button
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
            onClick={() => setActiveStep((prev) => prev - 1)}
          >
            Back
          </button>
          <button
            className="px-8 py-3 bg-[#892580] text-white rounded-xl hover:[#892580] transition-all font-medium shadow-lg"
            onClick={() => setActiveStep((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Comment Popup */}
      <CommentPopup
        isOpen={showCommentPopup}
        onClose={closeCommentPopup}
        file={allImagesForFullscreen.find((img) => img._id === commentImageId)}
        fileComments={fileComments}
        commentsLoading={commentsLoading}
        role={role}
        onAddComment={handleAddComment}
        isAddingComment={addCommentMutation.isPending}
      />

      {/* Full Screen Modal */}
      {showFullScreen && currentFullScreenImage && (
        <div className="fixed inset-0 bg-black backdrop-blur-sm flex items-center justify-center z-50">
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="text-white">
              <h3 className="text-xl font-bold">
                {currentFullScreenImage.originalFilename}
              </h3>
              <p className="text-sm opacity-75">
                {fullScreenImageIndex + 1} of {allImagesForFullscreen.length}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {currentFullScreenImage.fileType === "image" && (
                <>
                  <button
                    onClick={() => handleZoom("out")}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                    title="Zoom out"
                  >
                    <ZoomOut size={20} />
                  </button>
                  <span className="text-white text-sm px-2">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => handleZoom("in")}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                    title="Zoom in"
                  >
                    <ZoomIn size={20} />
                  </button>

                  <button
                    onClick={handleRotate}
                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                    title="Rotate"
                  >
                    <RotateCw size={20} />
                  </button>
                </>
              )}

              <button
                onClick={closeFullScreen}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {allImagesForFullscreen.length > 1 && (
            <>
              <button
                onClick={() => navigateFullScreen("prev")}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-xl transition-all z-10"
                title="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => navigateFullScreen("next")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-xl transition-all z-10"
                title="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="flex items-center justify-center w-full h-full p-16">
            {currentFullScreenImage.fileType === "image" ? (
              <img
                src={
                  !imageLoadError && fullResolutionData?.url
                    ? fullResolutionData.url
                    : currentFullScreenImage.s3?.url ||
                      currentFullScreenImage.s3Thumbnails?.medium?.url
                }
                alt={currentFullScreenImage.originalFilename}
                className="max-w-full max-h-full object-contain transition-transform duration-200 rounded-lg"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  cursor: zoomLevel > 1 ? "move" : "default",
                }}
                draggable={false}
                onLoad={() => {
                  setImageLoadError(false);
                }}
                onError={(e) => {
                  setImageLoadError(true);
                  if (e.target.src === fullResolutionData?.url) {
                    e.target.src =
                      currentFullScreenImage.s3?.url ||
                      currentFullScreenImage.s3Thumbnails?.medium?.url;
                  }
                }}
              />
            ) : fullResolutionData?.url ? (
              <video
                src={fullResolutionData.url}
                controls
                className="max-w-full max-h-full rounded-lg"
                autoPlay
                onError={(e) => {
                  if (e.target.src === fullResolutionData.url) {
                    e.target.src = currentFullScreenImage.s3?.url;
                  }
                }}
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
            <p>ESC: Close • ← →: Navigate • +/-: Zoom • R: Rotate</p>
          </div>
        </div>
      )}
    </div>
  );
}