'use client'
import { useEffect, useState } from "react";
import { 
  X,
  Send,
  AlertCircle,
  FileText,
  Upload
} from "lucide-react";
import { useCreateTicket } from "../../hooks/useSupportQueries";
import { showToast } from "../Toast/Toast";

const RaiseTicketModal = ({ 
  isOpen, 
  onClose, 
  booking, 
  onTicketCreated 
}) => {
  const [ticketData, setTicketData] = useState({
    category: '',
    priority: 'medium',
    subject: '',
    description: '',
    attachments: []
  });

  // TanStack Query mutation for creating ticket
  const createTicketMutation = useCreateTicket();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTicketData({
        category: '',
        priority: 'medium',
        subject: '',
        description: '',
        attachments: []
      });
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setTicketData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileAttachment = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
      ];
      return file.size <= maxSize && allowedTypes.includes(file.type);
    });
    
    if (validFiles.length !== files.length) {
      showToast('Some files were skipped. Please ensure files are under 5MB and are of supported formats (images, PDF, text, or Word documents).', "error");
    }
    
    setTicketData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
    
    event.target.value = '';
  };

  const removeAttachment = (index) => {
    setTicketData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!ticketData.category) {
      showToast('Please select a category', "error");
      return;
    }
    if (!ticketData.subject.trim()) {
      showToast('Please enter a subject', "error");
      return;
    }
    if (!ticketData.description.trim()) {
      showToast('Please enter a description', "error");
      return;
    }

    // Prepare ticket data for API
    const submitData = {
      category: ticketData.category,
      priority: ticketData.priority,
      subject: ticketData.subject.trim(),
      description: ticketData.description.trim(),
      attachments: ticketData.attachments
    };

    // Add booking ID if booking exists
    if (booking?._id || booking?.customBookingId) {
      submitData.bookingId = booking._id || booking.customBookingId;
    }

    // Submit using TanStack Query mutation
    createTicketMutation.mutate(submitData, {
      onSuccess: (response) => {
        // Show success message
        showToast('Support ticket created successfully!', 'success');
        
        // Call the success callback if provided
        if (onTicketCreated) {
          onTicketCreated(response.data || response);
        }
        
        // Close modal on success
        onClose();
      },
      onError: (error) => {
        console.error('Error submitting ticket:', error);
        
        // Show user-friendly error message
        const errorMessage = error.response?.data?.message || 
                            error.message || 
                            'Failed to submit ticket. Please try again.';
        showToast(errorMessage, 'error');
      }
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const ticketCategories = [
    { value: 'booking', label: 'Booking Issue' },
    { value: 'billing', label: 'Payment/Billing Problem' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'general', label: 'General Inquiry' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  if (!isOpen) return null;

  const isSubmitting = createTicketMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Support Ticket</h3>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Booking Info - Compact */}
          {booking && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {booking.packageId ? "Aloka Package" : booking?.entityDetails?.name || "Photography Booking"}
                </div>
                <div className="text-gray-600 mt-1">
                  ID: {booking.customBookingId || booking._id} • {formatCurrency(booking.totalAmount || booking.paymentSummary?.totalAmount || 0)}
                </div>
                {booking.status && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                    {booking.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="space-y-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Type <span className="text-red-500">*</span>
              </label>
              <select
                value={ticketData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              >
                <option value="">Select issue type</option>
                {ticketCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="flex gap-2">
                {priorityLevels.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => handleInputChange('priority', priority.value)}
                    disabled={isSubmitting}
                    className={`px-3 py-1 text-sm rounded-md border ${
                      ticketData.priority === priority.value
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={ticketData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Brief description of your issue"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
                maxLength={200}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={ticketData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Please describe your issue in detail..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                disabled={isSubmitting}
                maxLength={1000}
              />
              <div className="mt-1 text-xs text-gray-500">
                {ticketData.description.length}/1000 characters
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.txt,.doc,.docx"
                  onChange={handleFileAttachment}
                  className="hidden"
                  id="file-upload"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm text-gray-700"
                >
                  <Upload className="w-4 h-4" />
                  Attach files
                </label>
                <span className="text-xs text-gray-500">Images, PDF (Max 5MB)</span>
              </div>

              {/* Attached Files */}
              {ticketData.attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {ticketData.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 truncate">
                          {file.name}
                        </span>
                      </div>
                      <button
                        onClick={() => removeAttachment(index)}
                        disabled={isSubmitting}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Validation Warning */}
            {(!ticketData.category || !ticketData.subject.trim() || !ticketData.description.trim()) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Please fill in all required fields</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {createTicketMutation.isError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Error creating ticket</span>
                </div>
                <p className="mt-1 text-xs text-red-700">
                  {createTicketMutation.error?.response?.data?.message || 
                   createTicketMutation.error?.message || 
                   'An unexpected error occurred. Please try again.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Always visible */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Ticket
                </>
              )}
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            We'll respond within 24 hours
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaiseTicketModal;