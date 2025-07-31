'use client'
import { useEffect, useState } from "react";
import { 
  XCircle,
  AlertCircle,
  CheckCircle,
  Send,
  FileText,
  Upload,
  X,
  Camera,
  Receipt
} from "lucide-react";
import { useCreateTicket } from "../../hooks/useSupportQueries";

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

  // Reset form when modal opens/closes
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

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setTicketData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle file attachment
  const handleFileAttachment = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      // Limit file size to 5MB and check file types
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
      ];
      return file.size <= maxSize && allowedTypes.includes(file.type);
    });
    
    if (validFiles.length !== files.length) {
      showToast('Some files were skipped. Please ensure files are under 5MB and are of supported formats (images, PDF, text, or Word documents).',"error");
    }
    
    setTicketData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
    
    // Reset file input
    event.target.value = '';
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setTicketData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!ticketData.category) {
      showToast('Please select a category',"error");
      return;
    }
    if (!ticketData.subject.trim()) {
      showToast('Please enter a subject',"error");
      return;
    }
    if (!ticketData.description.trim()) {
      showToast('Please enter a description',"error");
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
    if (booking?._id) {
      submitData.bookingId = booking._id;
    }

    // Submit using TanStack Query mutation
    createTicketMutation.mutate(submitData, {
      onSuccess: (response) => {
        // Show success message
        alert('Support ticket created successfully!');
        
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
        alert(errorMessage);
      }
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Updated ticket categories to match backend enum
  const ticketCategories = [
    { value: 'booking', label: 'Booking Issue' },
    { value: 'billing', label: 'Payment/Billing Problem' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'general', label: 'General Inquiry' }
  ];

  // Priority levels
  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'text-green-600', bgColor: 'bg-green-100', description: 'General inquiry or minor issue' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100', description: 'Standard support request' },
    { value: 'high', label: 'High', color: 'text-orange-600', bgColor: 'bg-orange-100', description: 'Important issue affecting service' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600', bgColor: 'bg-red-100', description: 'Critical issue requiring immediate attention' }
  ];

  if (!isOpen) return null;

  const isSubmitting = createTicketMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Raise Support Ticket</h3>
                <p className="text-sm text-gray-600">Get help with your booking</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <XCircle className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          
          {/* Booking Info */}
          {booking && (
            <div className="bg-white rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {booking?.entityDetails?.image ? (
                    <img
                      src={booking.entityDetails.image}
                      alt={booking.entityDetails.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {booking.packageId ? "Aloka Package" : booking?.entityDetails?.name}
                    </h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                      {booking.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Receipt className="w-4 h-4" />
                      <span className="font-mono">{booking.customBookingId}</span>
                    </div>
                    <div>
                      Total: <span className="font-semibold">{formatCurrency(booking.paymentSummary?.totalAmount || booking.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Issue Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {ticketCategories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleInputChange('category', category.value)}
                    disabled={isSubmitting}
                    className={`p-3 text-left border-2 rounded-xl transition-all duration-200 disabled:opacity-50 ${
                      ticketData.category === category.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-medium text-sm">{category.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Priority Level <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {priorityLevels.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => handleInputChange('priority', priority.value)}
                    disabled={isSubmitting}
                    className={`p-4 text-left border-2 rounded-xl transition-all duration-200 disabled:opacity-50 ${
                      ticketData.priority === priority.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${priority.bgColor} ${priority.color}`}>
                        {priority.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{priority.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={ticketData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Brief summary of your issue"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:bg-gray-50"
                disabled={isSubmitting}
                maxLength={200}
              />
              <div className="mt-1 text-xs text-gray-500">
                {ticketData.subject.length}/200 characters
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={ticketData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Please provide detailed information about your issue. Include any relevant dates, times, or specific problems you're experiencing."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none disabled:opacity-50 disabled:bg-gray-50"
                disabled={isSubmitting}
                maxLength={1000}
              />
              <div className="mt-1 text-xs text-gray-500">
                {ticketData.description.length}/1000 characters
              </div>
            </div>

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Attachments (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
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
                  className={`cursor-pointer flex flex-col items-center gap-2 ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <div className="text-sm font-medium text-gray-700">
                    Click to upload files
                  </div>
                  <div className="text-xs text-gray-500">
                    Images, PDF, Text, or Word documents (Max 5MB each)
                  </div>
                </label>
              </div>

              {/* Attached Files */}
              {ticketData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-medium text-gray-700">
                    Attached Files ({ticketData.attachments.length})
                  </div>
                  {ticketData.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {file.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAttachment(index)}
                        disabled={isSubmitting}
                        className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Validation Messages */}
            {(!ticketData.category || !ticketData.subject.trim() || !ticketData.description.trim()) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Please complete all required fields</span>
                </div>
                <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
                  {!ticketData.category && <li>Select an issue category</li>}
                  {!ticketData.subject.trim() && <li>Enter a subject</li>}
                  {!ticketData.description.trim() && <li>Provide a description</li>}
                </ul>
              </div>
            )}

            {/* Error Message */}
            {createTicketMutation.isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Error creating ticket</span>
                </div>
                <p className="mt-1 text-sm text-red-700">
                  {createTicketMutation.error?.response?.data?.message || 
                   createTicketMutation.error?.message || 
                   'An unexpected error occurred. Please try again.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !ticketData.category || !ticketData.subject.trim() || !ticketData.description.trim()}
              className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                isSubmitting || !ticketData.category || !ticketData.subject.trim() || !ticketData.description.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
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
          
          {/* Help Text */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            We typically respond to tickets within 24 hours. You'll receive updates via email.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaiseTicketModal;