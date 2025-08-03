

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  MessageSquare,
  Edit3,
  X,
  Eye,
  Clock,
  AlertTriangle,
  Send,
  UserCheck,
  CheckCircle2,
  Bell,
  Lock,
  Star,
  MessageCircle,
  Award,
  Calendar,
  User,
} from "lucide-react";
import {
  useEditingQueueByFolder,
  useUpdateContentDetails,
  useSendClosureRequest,
  useCompletedEditsByFolder,
  useBookingReview,
  useSubmitReviewAndClose,
} from "@/hooks/useMediaQueries";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/Toast/Toast";
import { showConfirm } from "@/components/Toast/Confirmation";
import { useQueryClient } from "@tanstack/react-query";

const ContentDetailsForm = ({
  bookingData,
  setActiveStep,
  isLoading = false,
  role, // 'partner' or 'user'
}) => {
  // View/Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);

  const router = useRouter();

  // API hooks for closure
  const updateContentMutation = useUpdateContentDetails();
  const sendClosureRequestMutation = useSendClosureRequest();

  // API hooks for review
  const submitReviewMutation = useSubmitReviewAndClose();
  const { data: existingReview, isLoading: loadingReview } = useBookingReview(
    bookingData?._id
  );

  // Closure form state
  const [formData, setFormData] = useState({
    title: bookingData?.contentTitle || "",
    description: bookingData?.notes || "",
  });

  // Review form state
  const [reviewData, setReviewData] = useState({
    rating: 0,
    title: "",
    review: "",
  });
  const [originalReviewData, setOriginalReviewData] = useState({});
  const [hover, setHover] = useState(0);
  const [reviewErrors, setReviewErrors] = useState({});
  const [hasReviewChanges, setHasReviewChanges] = useState(false);
  const [reviewViewMode, setReviewViewMode] = useState("display"); // 'display' or 'form'
  const [isReviewEditMode, setIsReviewEditMode] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Check if content exists
  const hasExistingContent = bookingData?.contentTitle && bookingData?.notes;
  const isBookingCompleted =
    bookingData?.status === "completed" &&
    bookingData?.workFlowStatus === "closure";
  const hasExistingReview = existingReview?.review;

  const { data: editingQueueFolders = [], isLoading: queueLoading } =
    useEditingQueueByFolder(bookingData?._id);
  const { data: completedEditsFolders = [], isLoading: completedLoading } =
    useCompletedEditsByFolder(bookingData?._id);

  const queryClient = useQueryClient();

  // Helper function to invalidate all related queries
  const invalidateAllBookingQueries = (bookingId) => {
    if (!bookingId) return;

    // Invalidate all booking-related queries
    queryClient.invalidateQueries({
      queryKey: ["booking"],
    });
    
    // Specifically invalidate booking by ID
    queryClient.invalidateQueries({
      queryKey: ["booking", "bookingById", bookingId],
    });
    
    // Invalidate review queries
    queryClient.invalidateQueries({
      queryKey: ["booking", "review", bookingId],
    });
    

    // Force refetch of current booking data
    queryClient.refetchQueries({
      queryKey: ["booking", "bookingById", bookingId],
    });
  };

  // Initialize review form with existing review data
  useEffect(() => {
    if (existingReview?.review) {
      const reviewFormData = {
        rating: existingReview.review.rating,
        title: existingReview.review.title,
        review: existingReview.review.review,
      };
      setReviewData(reviewFormData);
      setOriginalReviewData(reviewFormData);

      // If booking is completed and has review, show display mode
      if (isBookingCompleted) {
        setReviewViewMode("display");
      } else {
        setReviewViewMode("form");
      }
    } else {
      // No existing review, show form mode
      setReviewViewMode("form");
    }
  }, [existingReview, isBookingCompleted]);

  // Track review changes
  useEffect(() => {
    const hasChanged =
      reviewData.rating > 0 ||
      reviewData.title.trim() ||
      reviewData.review.trim();
    setHasReviewChanges(hasChanged);
  }, [reviewData]);

  // Initialize form with existing booking data when it changes
  useEffect(() => {
    if (bookingData) {
      setFormData({
        title: bookingData.contentTitle || "",
        description: bookingData.notes || "",
      });
    }
  }, [bookingData]);

  // Auto-enter edit mode if no content exists and user role
  useEffect(() => {
    if (
      !hasExistingContent &&
      role === "user" &&
      bookingData?.closureRequest === "accepted"
    ) {
      setIsEditMode(true);
    }
  }, [hasExistingContent, role, bookingData?.closureRequest]);

  // Track changes
  useEffect(() => {
    const initialTitle = bookingData?.contentTitle || "";
    const initialDescription = bookingData?.notes || "";

    const hasChanged =
      formData.title !== initialTitle ||
      formData.description !== initialDescription;

    setHasChanges(hasChanged);
  }, [formData, bookingData]);

  // Review validation
  const validateReviewForm = () => {
    const newErrors = {};

    if (!reviewData.rating || reviewData.rating < 1) {
      newErrors.rating = "Please select a rating";
    }

    if (!reviewData.title.trim()) {
      newErrors.title = "Please provide a headline for your review";
    } else if (reviewData.title.trim().length < 5) {
      newErrors.title = "Headline must be at least 5 characters";
    } else if (reviewData.title.trim().length > 100) {
      newErrors.title = "Headline must be less than 100 characters";
    }

    if (!reviewData.review.trim()) {
      newErrors.review = "Please write your review";
    } else if (reviewData.review.trim().length < 20) {
      newErrors.review = "Review must be at least 20 characters";
    } else if (reviewData.review.trim().length > 1000) {
      newErrors.review = "Review must be less than 1000 characters";
    }

    setReviewErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Review input handlers
  const handleReviewInputChange = (field, value) => {
    setReviewData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (reviewErrors[field]) {
      setReviewErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleStarClick = (starValue) => {
    handleReviewInputChange("rating", starValue);
  };

  const handleReviewEditClick = () => {
    setIsReviewEditMode(true);
    setReviewViewMode("form");
    setReviewErrors({});
  };

  const handleReviewCancelEdit = () => {
    setIsReviewEditMode(false);
    setReviewData(originalReviewData);
    setReviewErrors({});
    setHover(0);
    if (hasExistingReview && isBookingCompleted) {
      setReviewViewMode("display");
    }
  };

  const handleSubmitReview = async () => {
    if (!validateReviewForm()) {
      return;
    }

    const actionText = isReviewEditMode
      ? "update your review"
      : "submit your review and close this order";

    const confirmed = await showConfirm(
      `Are you sure you want to ${actionText}? ${
        !isReviewEditMode ? "This action cannot be undone." : ""
      }`,
      "blue"
    );

    if (!confirmed) return;

    try {
      await submitReviewMutation.mutateAsync({
        bookingId: bookingData._id,
        reviewData: {
          entityType: bookingData.entityType,
          entityId: bookingData.entityId,
          studioId: bookingData.studioId,
          freelancerId: bookingData.freelancerId,
          customBookingId: bookingData.customBookingId,
          title: reviewData.title.trim(),
          review: reviewData.review.trim(),
          rating: reviewData.rating,
        },
      });

      // FIXED: Comprehensive query invalidation
      invalidateAllBookingQueries(bookingData._id);

      const successMessage = isReviewEditMode
        ? "Your review has been updated successfully!"
        : "Thank you for your review! Your order has been completed.";

      showToast(successMessage, "success");

      // Update local state to reflect changes immediately
      setOriginalReviewData(reviewData);
      setIsReviewEditMode(false);

      if (isBookingCompleted || !isReviewEditMode) {
        setReviewViewMode("display");
      }

      // FIXED: Force component re-render by updating hasReviewChanges
      setHasReviewChanges(false);

    } catch (error) {
      console.error("Failed to submit review:", error);
      showToast("Failed to submit review. Please try again.", "error");
    }
  };

  const getRatingText = (rating) => {
    const texts = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    };
    return texts[rating] || "";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setErrors({});
  };

  const handleCancelEdit = async () => {
    if (hasChanges) {
      const confirmed = await showConfirm(
        "You have unsaved changes. Are you sure you want to cancel editing?",
        "red"
      );

      if (!confirmed) return;
    }

    // Reset form to original values
    setFormData({
      title: bookingData?.contentTitle || "",
      description: bookingData?.notes || "",
    });
    setErrors({});
    setIsEditMode(false);
    setHasChanges(false);
  };

  const handleSave = async () => {
    if (!validateForm() || !bookingData?._id) {
      return;
    }

    setIsSaving(true);

    try {
      await updateContentMutation.mutateAsync({
        bookingId: bookingData._id,
        contentData: {
          contentTitle: formData.title.trim(),
          notes: formData.description.trim(),
          workFlowStatus: "closure",
        },
      });

      // FIXED: Comprehensive query invalidation
      invalidateAllBookingQueries(bookingData._id);

      setHasChanges(false);
      setIsEditMode(false);
      showToast("Content details saved successfully!", "success");
    } catch (error) {
      console.error("Failed to save content details:", error);
      showToast("Failed to save content details. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // FIXED: Simplified and corrected closure request handling
  const handleSendClosureRequest = async () => {
    const confirmed = await showConfirm(
      "Accept closure request and continue to review? This will allow you to review and finalize the project details.",
      "blue"
    );

    if (!confirmed) return;

    try {
      // Single API call to accept the closure request
      await sendClosureRequestMutation.mutateAsync({
        bookingId: bookingData._id,
        action: "accepted",
      });

      // FIXED: Comprehensive query invalidation
      invalidateAllBookingQueries(bookingData._id);
      
      showToast("Closure request accepted! You can now review the project.", "success");

      // FIXED: Force component state update to trigger re-render
      // This ensures the component switches to the review view immediately
      setTimeout(() => {
        invalidateAllBookingQueries(bookingData._id);
      }, 100);

    } catch (error) {
      console.error("Failed to accept closure request:", error);
      showToast("Failed to accept closure request. Please try again.", "error");
    }
  };

  const handleNext = async () => {
    if (hasChanges && isEditMode) {
      const confirmed = await showConfirm(
        "You have unsaved changes. Would you like to save before continuing?",
        "red"
      );

      if (confirmed) {
        await handleSave();
        setActiveStep((prev) => prev + 1);
      } else {
        setActiveStep((prev) => prev + 1);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = async () => {
    if (hasChanges && isEditMode) {
      const confirmed = await showConfirm(
        "You have unsaved changes. Are you sure you want to go back?",
        "red"
      );

      if (confirmed) {
        setActiveStep((prev) => prev - 1);
      }
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  if (isLoading || queueLoading || loadingReview) {
    return (
      <div className="p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-[#2563EB]" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Loading...
          </h3>
          <p className="text-gray-500">
            Please wait while we load your information
          </p>
        </div>
      </div>
    );
  }

  // User view - No closure request received yet
  if (role === "user" && !bookingData?.closureRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-12 w-12 text-gray-400" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Waiting for Closure Request
              </h2>

              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your photographer is still working on your project. You'll
                receive a notification when they're ready for you to review and
                finalize the details.
              </p>

              <div className="text-sm text-gray-500">
                Please wait while the final touches are being completed.
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => setActiveStep((prev) => prev - 1)}
              className="flex items-center space-x-2 px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium shadow-lg"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User view - Closure request received but not accepted yet
  if (role === "user" && bookingData?.closureRequest === "requested") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="h-12 w-12 text-green-500" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Project Closure Request
              </h2>

              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Your photographer has completed the work and is requesting
                project closure. Accept this request to review and finalize your
                project details.
              </p>

              <button
                onClick={handleSendClosureRequest}
                disabled={sendClosureRequestMutation.isPending}
                className="flex items-center space-x-3 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed mx-auto"
              >
                {sendClosureRequestMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Accepting...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="h-5 w-5" />
                    <span>Accept & Continue to Review</span>
                  </>
                )}
              </button>

              <div className="mt-6 text-sm text-gray-500">
                Once accepted, you can review and rate your experience.
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => setActiveStep((prev) => prev - 1)}
              className="flex items-center space-x-2 px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium shadow-lg"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // REVIEW FORM FOR USER AFTER ACCEPTING CLOSURE REQUEST
  if (role === "user" && bookingData?.closureRequest === "accepted") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[#2563EB] to-purple-700 px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">
                    {reviewViewMode === "display"
                      ? "Your Review"
                      : isReviewEditMode
                      ? "Edit Your Review"
                      : "Rate Your Experience"}
                  </h1>
                  <p className="text-purple-100">
                    {reviewViewMode === "display"
                      ? "Review submitted successfully"
                      : isReviewEditMode
                      ? "Update your feedback"
                      : "Share your feedback and complete your order"}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Info Bar */}
            <div className="bg-gradient-to-r from-gray-50 to-purple-50 px-8 py-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="font-semibold text-gray-800">
                      {bookingData.customBookingId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Project</p>
                    <p className="font-semibold text-gray-800">
                      {bookingData.contentTitle || "Content Project"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isBookingCompleted ? "bg-blue-500" : "bg-green-500"
                        }`}
                      ></div>
                      <p
                        className={`font-semibold ${
                          isBookingCompleted
                            ? "text-blue-600"
                            : "text-green-600"
                        }`}
                      >
                        {isBookingCompleted ? "Completed" : "Ready to Close"}
                      </p>
                    </div>
                  </div>
                </div>

                {(submitReviewMutation.isSuccess || hasExistingReview) && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle size={16} />
                    <span className="text-sm font-medium">
                      {submitReviewMutation.isSuccess
                        ? "Review Submitted"
                        : "Review Found"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Review Content */}
          {reviewViewMode === "display" && hasExistingReview ? (
            /* Review Display Mode */
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-6 w-6 text-[#2563EB]" />
                    <h2 className="text-2xl font-bold text-gray-800">
                      Your Review
                    </h2>
                  </div>
                  <button
                    onClick={handleReviewEditClick}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
                  >
                    <Edit3 size={16} />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={24}
                            className={
                              star <= existingReview.review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                            fill={
                              star <= existingReview.review.rating
                                ? "currentColor"
                                : "none"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold text-[#2563EB]">
                        {getRatingText(existingReview.review.rating)}
                      </span>
                      <span className="text-gray-500">
                        ({existingReview.review.rating}/5)
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {existingReview.review.title}
                    </h3>

                    <p className="text-gray-700 leading-relaxed mb-4">
                      {existingReview.review.review}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-t pt-4">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} />
                        <span>
                          Submitted:{" "}
                          {formatDate(existingReview.review.createdAt)}
                        </span>
                      </div>
                      {existingReview.review.updatedAt &&
                        existingReview.review.updatedAt !==
                          existingReview.review.createdAt && (
                          <div className="flex items-center space-x-2">
                            <Edit3 size={14} />
                            <span>
                              Updated:{" "}
                              {formatDate(existingReview.review.updatedAt)}
                            </span>
                          </div>
                        )}
                      <div className="flex items-center space-x-2">
                        <User size={14} />
                        <span>By: You</span>
                      </div>
                    </div>
                  </div>
                </div>

                {isBookingCompleted && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-green-800">
                          Order Completed
                        </h3>
                        <p className="text-green-700 text-sm">
                          Thank you for your review! This order has been
                          successfully completed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Review Form Mode */
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="space-y-8">
                {isReviewEditMode && (
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Edit3 className="h-5 w-5 text-orange-600" />
                        <div>
                          <h4 className="font-semibold text-orange-800">
                            Editing Mode
                          </h4>
                          <p className="text-orange-700 text-sm">
                            You're updating your existing review
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleReviewCancelEdit}
                        className="flex items-center space-x-2 px-3 py-1 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-orange-700"
                      >
                        <X size={14} />
                        <span className="text-sm">Cancel</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Rating Section */}
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <MessageCircle className="h-6 w-6 text-[#2563EB]" />
                    <h2 className="text-2xl font-bold text-gray-800">
                      {isReviewEditMode
                        ? "Update your rating"
                        : "How was your experience?"}
                    </h2>
                  </div>

                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={40}
                        className={`cursor-pointer transition-all duration-200 ${
                          (hover || reviewData.rating) >= star
                            ? "text-yellow-400 scale-110"
                            : "text-gray-300 hover:text-yellow-200"
                        }`}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => handleStarClick(star)}
                        fill={
                          (hover || reviewData.rating) >= star
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>

                  {(hover || reviewData.rating) > 0 && (
                    <p className="text-lg font-medium text-[#2563EB] animate-fade-in">
                      {getRatingText(hover || reviewData.rating)}
                    </p>
                  )}

                  {reviewErrors.rating && (
                    <div className="flex items-center justify-center space-x-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>{reviewErrors.rating}</span>
                    </div>
                  )}
                </div>

                {/* Headline Input */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                    <span>Review Headline</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-gray-600 text-sm">
                    Summarize your experience in a few words
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      value={reviewData.title}
                      onChange={(e) =>
                        handleReviewInputChange("title", e.target.value)
                      }
                      placeholder="e.g., Excellent service and amazing photos!"
                      className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:outline-none transition-colors ${
                        reviewErrors.title
                          ? "border-red-300 focus:border-red-500 bg-red-50"
                          : "border-gray-200 focus:border-[#2563EB] focus:bg-purple-50"
                      }`}
                      maxLength={100}
                    />
                    <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                      {reviewData.title.length}/100
                    </div>
                  </div>
                  {reviewErrors.title && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>{reviewErrors.title}</span>
                    </div>
                  )}
                </div>

                {/* Review Text Area */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                    <span>Your Review</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-gray-600 text-sm">
                    Tell others about your experience. What did you like? What
                    could be improved?
                  </p>
                  <div className="relative">
                    <textarea
                      value={reviewData.review}
                      onChange={(e) =>
                        handleReviewInputChange("review", e.target.value)
                      }
                      placeholder="Share your experience in detail. What made this service special? How was the quality? Would you recommend it to others?"
                      className={`w-full px-4 py-4 text-lg border-2 rounded-xl resize-none focus:outline-none transition-colors ${
                        reviewErrors.review
                          ? "border-red-300 focus:border-red-500 bg-red-50"
                          : "border-gray-200 focus:border-[#2563EB] focus:bg-purple-50"
                      }`}
                      rows={6}
                      maxLength={1000}
                    />
                    <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                      {reviewData.review.length}/1000
                    </div>
                  </div>
                  {reviewErrors.review && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>{reviewErrors.review}</span>
                    </div>
                  )}
                </div>

                {/* Preview Section */}
                {reviewData.rating > 0 &&
                  reviewData.title.trim() &&
                  reviewData.review.trim() && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-800 mb-3">
                        {isReviewEditMode
                          ? "Updated Review Preview"
                          : "Review Preview"}
                      </h3>
                      <div className="bg-white rounded-lg p-4 border">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className={
                                  star <= reviewData.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }
                                fill={
                                  star <= reviewData.rating
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {getRatingText(reviewData.rating)}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {reviewData.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {reviewData.review}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => setActiveStep((prev) => prev - 1)}
              className="flex items-center space-x-2 px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium shadow-lg"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>

            {reviewViewMode === "form" && (
              <button
                onClick={handleSubmitReview}
                disabled={
                  !hasReviewChanges ||
                  Object.keys(reviewErrors).length > 0 ||
                  submitReviewMutation.isPending
                }
                className="flex items-center space-x-2 px-8 py-3 bg-[#2563EB] text-white rounded-xl hover:bg-purple-700 transition-colors font-medium shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {submitReviewMutation.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>
                      {isReviewEditMode ? "Updating..." : "Submitting..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>
                      {isReviewEditMode
                        ? "Update Review"
                        : isBookingCompleted
                        ? "Submit Review"
                        : "Submit Review & Close Order"}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {reviewViewMode === "display"
                ? "You can edit your review anytime by clicking the edit button"
                : "Your review helps other customers and helps us improve our services"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Partners should never see the closure form - they just send requests
  if (role === "partner") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="h-12 w-12 text-gray-400" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Access Not Available
              </h2>

              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Only clients can access this section.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback return for any other cases
  return null;
};

export default ContentDetailsForm;