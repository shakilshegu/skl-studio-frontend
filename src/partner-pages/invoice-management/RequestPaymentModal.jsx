"use client";
import React, { useState } from "react";
import {
  X,
  Send,
  Calendar,
  DollarSign,
  MessageSquare,
  Mail,
  Phone,
  Bell,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createRequest } from "@/services/Invoice/invoice.services";
import { showToast } from "@/components/Toast/Toast";

const RequestPaymentModal = ({
  isOpen = true,
  onClose = () => {},
  onSuccess = () => {},
  booking,
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    invoiceId: "",
    message: "",
    reminderType: "gentle", // gentle, urgent, final
  });

  // TanStack Query Mutation
  const createPaymentMutation = useMutation({
    mutationFn: createRequest,
    onSuccess: (response) => {
      // Success notification
      showToast("Payment request sent successfully!");

      // Reset form
      setFormData({
        amount: "",
        invoiceId: "",
        message: "",
        reminderType: "gentle",
      });

      // Call success callback with response data
      onSuccess(response.data);

      // Close modal
      onClose();
    },
    onError: (error) => {
      console.error("Error sending payment request:", error);
      const message =
        error.response?.data?.message || "Failed to create payment request";
      showToast(`Error: ${message}`,"error");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getDefaultMessage = () => {
    const reminderMessages = {
      gentle: `Dear ${
        booking?.clientName
      },\n\nWe hope you're doing well! This is a gentle reminder about your pending payment for ${
        booking?.service
      }.\n\nAmount Due: ₹${
        formData.amount || booking?.pendingAmount?.toLocaleString()
      }\n\nPlease let us know if you have any questions or need assistance with the payment process.\n\nThank you for your business!\n\nBest regards,\nYour Photography Team`,

      urgent: `Dear ${
        booking?.clientName
      },\n\nThis is an urgent reminder regarding your overdue payment for ${
        booking?.service
      }.\n\nAmount Due: ₹${
        formData.amount || booking?.pendingAmount?.toLocaleString()
      }\n\nPlease arrange for immediate payment to avoid any service interruptions. If you've already made the payment, please share the transaction details.\n\nFor any assistance, please contact us immediately.\n\nRegards,\nYour Photography Team`,

      final: `Dear ${
        booking?.clientName
      },\n\nFINAL NOTICE - This is our final reminder regarding your overdue payment for ${
        booking?.service
      }.\n\nAmount Due: ₹${
        formData.amount || booking?.pendingAmount?.toLocaleString()
      }\nDays Overdue: [X days]\n\nImmediate payment is required to avoid further action. If payment is not received within 24 hours, we may need to take additional steps as per our terms of service.\n\nPlease contact us immediately to resolve this matter.\n\nUrgent regards,\nYour Photography Team`,
    };

    return reminderMessages[formData.reminderType] || reminderMessages.gentle;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare request data for API
    const requestData = {
      bookingId: booking?.id,
      customBookingId: booking?.customBookingId || booking?.id,
      amount: parseFloat(formData.amount) || booking?.pendingAmount,
      specificInvoiceId: formData.invoiceId || null,
      reminderType: formData.reminderType,
      message: formData.message || getDefaultMessage(),
    };

    // Use TanStack Query mutation instead of direct API call
    createPaymentMutation.mutate(requestData);
  };

  if (!isOpen || !booking) return null;

  const pendingInvoices =
    booking.invoices?.filter((inv) => inv.status === "pending") || [];

  // Get loading state from mutation
  const isSubmitting = createPaymentMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Request Payment
              </h2>
              <p className="text-sm text-gray-500">
                Send payment reminder to {booking.clientName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Client Summary */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {booking.clientName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {booking.clientName}
              </h3>
              <p className="text-sm text-gray-600 mb-3 truncate">
                {booking.service}
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 text-sm truncate">
                    {booking.email}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{booking.phone}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-orange-100 rounded-lg border border-orange-200 p-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <p className="text-xs text-orange-700 font-medium mt-3">
                Pending Payment:
              </p>
              <p className="text-sm font-bold text-orange-800  mt-3">
                ₹{booking.pendingAmount?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Form Container */}
        <div className="overflow-y-auto flex-1" style={{ minHeight: "200px" }}>
          <div className="p-6 space-y-6">
            {/* Invoice Selection */}
            {pendingInvoices.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Specific Invoice (Optional)
                </label>
                <select
                  name="invoiceId"
                  value={formData.invoiceId}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="">All Pending Payments</option>
                  {pendingInvoices.map((invoice, idx) => (
                    <option key={idx} value={invoice.invoiceId}>
                      {invoice.invoiceId} - ₹{invoice.amount?.toLocaleString()}{" "}
                      ({invoice.invoiceType})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Amount to Request
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      amount: booking.pendingAmount.toString(),
                    }))
                  }
                  disabled={isSubmitting}
                  className="p-3 border-2 border-blue-200 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  Full Amount
                  <span className="block text-xs text-blue-600">
                    ₹{booking.pendingAmount?.toLocaleString()}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, amount: "" }))
                  }
                  disabled={isSubmitting}
                  className="p-3 border-2 border-gray-200 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  Custom Amount
                  <span className="block text-xs text-gray-600">
                    Enter manually
                  </span>
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium z-10">
                  ₹
                </div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="1"
                  step="0.01"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Reminder Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Reminder Type
              </label>
              <select
                name="reminderType"
                value={formData.reminderType}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                <option value="gentle">Gentle Reminder</option>
                <option value="urgent">Urgent Notice</option>
                <option value="final">Final Notice</option>
              </select>
            </div>

            {/* Custom Message */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-900">
                  Custom Message
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      message: getDefaultMessage(),
                    }))
                  }
                  disabled={isSubmitting}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium underline disabled:opacity-50"
                >
                  Use Template
                </button>
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:opacity-50"
                placeholder="Enter your custom message or click 'Use Template' for a pre-written message..."
              />
            </div>
          </div>
        </div>

        {/* Fixed Form Actions at Bottom */}
        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPaymentModal;
