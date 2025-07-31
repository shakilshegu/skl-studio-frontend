

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  MessageSquare,
  Edit3,
  X,
  Eye,
  Clock,
  AlertTriangle,
  Send,
  Bell
} from 'lucide-react';
import { useEditingQueueByFolder, useUpdateContentDetails, useSendClosureRequest, useCompletedEditsByFolder } from '@/hooks/useMediaQueries';
import { useRouter } from "next/navigation";
import { showToast } from '@/components/Toast/Toast';
import { showConfirm } from '@/components/Toast/Confirmation';
import { useQueryClient } from '@tanstack/react-query';

const ContentDetailsForm = ({ 
  bookingData, 
  setActiveStep, 
  isLoading = false,
  role // 'partner' or 'user'
}) => {
  // View/Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  
  const router = useRouter();
  
  // API hooks
  const updateContentMutation = useUpdateContentDetails();
  const sendClosureRequestMutation = useSendClosureRequest();
  
  const [formData, setFormData] = useState({
    title: bookingData?.contentTitle || '',
    description: bookingData?.notes || ''
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Check if content exists
  const hasExistingContent = bookingData?.contentTitle && bookingData?.notes;

  const { data: editingQueueFolders = [], isLoading: queueLoading } = useEditingQueueByFolder(bookingData?._id);
  const { data: completedEditsFolders = [], isLoading: completedLoading } = useCompletedEditsByFolder(bookingData?._id);
  
  const queryClient = useQueryClient()
  
  // Initialize form with existing booking data when it changes
  useEffect(() => {
    if (bookingData) {
      setFormData({
        title: bookingData.contentTitle || '',
        description: bookingData.notes || ''
      });
    }
  }, [bookingData]);

  // Auto-enter edit mode if no content exists when closure request is accepted
  useEffect(() => {
    if (!hasExistingContent && bookingData?.closureRequest === 'accepted') {
      setIsEditMode(true);
    }
  }, [hasExistingContent, bookingData?.closureRequest]);

  // Track changes
  useEffect(() => {
    const initialTitle = bookingData?.contentTitle || '';
    const initialDescription = bookingData?.notes || '';
    
    const hasChanged = 
      formData.title !== initialTitle || 
      formData.description !== initialDescription;
    
    setHasChanges(hasChanged);
  }, [formData, bookingData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setErrors({});
  };

  const handleCancelEdit = async() => {
    if (hasChanges) {
      const confirmed = await showConfirm(
        'You have unsaved changes. Are you sure you want to cancel editing?',"red"
      );

      if (!confirmed) return;
    }
    
    // Reset form to original values
    setFormData({
      title: bookingData?.contentTitle || '',
      description: bookingData?.notes || ''
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
          workFlowStatus: 'closure'
        }
      });
      
      setHasChanges(false);
      setIsEditMode(false);

      queryClient.invalidateQueries({
  queryKey: ["bookingById", effectiveBookingData._id],
});

queryClient.refetchQueries({
  queryKey: ["bookingById", effectiveBookingData._id],
});
      showToast('Content details saved successfully!', 'success');
      
    } catch (error) {
      console.error('Failed to save content details:', error);
      showToast('Failed to save content details. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendClosureRequest = async () => {
    const confirmed = await showConfirm(
      'Send closure request to client? This will notify them to review and finalize the project details.',
      'blue'
    );

    if (!confirmed) return;

    try {
      await sendClosureRequestMutation.mutateAsync({
        bookingId: bookingData._id,
        action: "requested"
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ['bookingById', bookingData._id] 
      });
      showToast('Closure request sent successfully!', 'success');
      
    } catch (error) {
      console.error('Failed to send closure request:', error);
      showToast('Failed to send closure request. Please try again.', 'error');
    }
  };



  const handleBack = async () => {
    if (hasChanges && isEditMode) {
      const confirmed = await showConfirm(
        'You have unsaved changes. Are you sure you want to go back?', 'red'
      );

      if (confirmed) {
        setActiveStep(prev => prev - 1);
      }
    } else {
      setActiveStep(prev => prev - 1);
    }
  };

  // Loading state
  if (isLoading || queueLoading) {
    return (
      <div className="p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-[#892580]" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading content details...</h3>
          <p className="text-gray-500">Please wait while we load your booking information</p>
        </div>
      </div>
    );
  }

  // Check if editing queue has pending items
  if (editingQueueFolders.length > 0||completedEditsFolders.length>0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-12 w-12 text-orange-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Editing Not Finished
              </h2>
              
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You cannot send closure request until all editing tasks are finished. 
                Please complete the pending edits before proceeding.
              </p>

              <div className="text-sm text-gray-500">
                Go to the <strong>Editing</strong> section to complete the pending tasks, then return here to send the closure request.
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button 
              onClick={() => setActiveStep(prev => prev - 1)}
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

  // Closure request not sent yet
  if (!bookingData?.closureRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="h-12 w-12 text-blue-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to Request Closure
              </h2>
              
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                All work is complete. Send a closure request to your client so they can review and finalize the project details.
              </p>

              <button
                onClick={handleSendClosureRequest}
                disabled={sendClosureRequestMutation.isPending}
                className="flex items-center space-x-3 px-8 py-4 bg-[#892580] text-white rounded-xl hover:bg-purple-700 transition-colors font-medium shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed mx-auto"
              >
                {sendClosureRequestMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Sending Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send Closure Request to Client</span>
                  </>
                )}
              </button>

              <div className="mt-6 text-sm text-gray-500">
                The client will be notified and can then fill in the final project details.
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button 
              onClick={() => setActiveStep(prev => prev - 1)}
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

  // Closure request sent, waiting for client
  if (bookingData?.closureRequest === 'requested') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-12 w-12 text-yellow-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Waiting for Client Response
              </h2>
              
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your closure request has been sent to the client. They will receive a notification to review and accept the request.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-md mx-auto">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <Bell className="h-4 w-4" />
                  <span className="text-sm font-medium">Closure request sent</span>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                Once the client accepts, you can fill in the final project details.
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button 
              onClick={() => router.push('/partner/booking-list')}
              className="flex items-center space-x-2 px-8 py-3 bg-[#892580] text-white rounded-xl hover:bg-purple-700 transition-colors font-medium shadow-lg"
            >
              <span>Back to Bookings</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // After user accepted, show closure form
  if (bookingData?.closureRequest === 'accepted') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="mx-auto">
          
          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {!isEditMode && hasExistingContent ? (
              /* VIEW MODE */
              <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#892580]/10 p-3 rounded-xl">
                      <Eye className="h-6 w-6 text-[#892580]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Project Closure Details</h2>
                      <p className="text-gray-600">Review the final project details</p>
                    </div>
                  </div>
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#892580] text-white rounded-lg hover:bg-[#a32d96] transition-colors shadow-md"
                  >
                    <Edit3 size={18} />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Title Display */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-[#892580]" />
                    <label className="text-lg font-semibold text-gray-800">Project Title</label>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-lg text-gray-800 font-medium">{bookingData.contentTitle}</p>
                  </div>
                </div>

                {/* Description Display */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-[#892580]" />
                    <label className="text-lg font-semibold text-gray-800">Project Description</label>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{bookingData.notes}</p>
                  </div>
                </div>

                {/* Success Message */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Closure Details Saved</h3>
                      <p className="text-sm text-gray-600">Project information is complete and saved</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* EDIT MODE */
              <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#892580]/10 p-3 rounded-xl">
                      <Edit3 className="h-6 w-6 text-[#892580]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {hasExistingContent ? 'Edit Closure Details' : 'Complete Closure Details'}
                      </h2>
                      <p className="text-gray-600">
                        {hasExistingContent ? 'Update the project closure information' : 'Fill in the project closure information'}
                      </p>
                    </div>
                  </div>
                  {hasExistingContent && (
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <X size={18} />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>

                {/* Title Field */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                    <FileText className="h-5 w-5 text-[#892580]" />
                    <span>Project Title</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-gray-600 text-sm">
                    What's the main focus of this project? This will help organize your content.
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Wedding Photography - Sarah & John"
                      className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.title 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-[#892580] focus:bg-purple-50'
                      }`}
                      maxLength={100}
                    />
                    <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                      {formData.title.length}/100
                    </div>
                  </div>
                  {errors.title && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>{errors.title}</span>
                    </div>
                  )}
                </div>

                {/* Description Field */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                    <MessageSquare className="h-5 w-5 text-[#892580]" />
                    <span>Project Description</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-gray-600 text-sm">
                    Describe what was accomplished for the client. Include key details, special moments, or important requirements.
                  </p>
                  <div className="relative">
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="e.g., Captured the beautiful outdoor wedding ceremony and reception at Sunset Gardens. Focused on candid moments, family portraits, and the couple's first dance..."
                      className={`w-full px-4 py-4 text-lg border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.description 
                          ? 'border-red-300 focus:border-red-500 bg-red-50' 
                          : 'border-gray-200 focus:border-[#892580] focus:bg-purple-50'
                      }`}
                      rows={6}
                      maxLength={1000}
                    />
                    <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                      {formData.description.length}/1000
                    </div>
                  </div>
                  {errors.description && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>{errors.description}</span>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Save className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {hasExistingContent ? 'Update Your Changes' : 'Save Your Progress'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {hasExistingContent ? 'Save your updated project information' : "Don't lose your progress - save your details"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={isSaving || updateContentMutation.isPending || Object.keys(errors).length > 0 || !formData.title.trim() || !formData.description.trim()}
                      className="flex items-center space-x-2 px-6 py-3 bg-[#892580] text-white rounded-xl hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
                    >
                      {(isSaving || updateContentMutation.isPending) ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>{hasExistingContent ? 'Update' : 'Save'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Success Message */}
                {updateContentMutation.isSuccess && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Closure Details Saved</h3>
                        <p className="text-sm text-gray-600">Your project information has been successfully updated</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-center space-x-4 mt-8">
            <button 
              onClick={handleBack}
              className="flex items-center space-x-2 px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium shadow-lg"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
            
            <button 
              onClick={() => router.push('/partner/booking-list')}
              disabled={!hasExistingContent || (isEditMode && hasChanges)}
              className="flex items-center space-x-2 px-8 py-3 bg-[#892580] text-white rounded-xl hover:bg-purple-700 transition-colors font-medium shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <span>Complete & Return to Bookings</span>
              <CheckCircle size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ContentDetailsForm;