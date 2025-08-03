"use client";

import React, { useState, useEffect } from "react";
import { 
  XCircle,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Camera,
  Receipt
} from "lucide-react";
import { showToast } from "../Toast/Toast";

const CustomPaymentModal = ({ 
  isOpen, 
  onClose, 
  booking, 
  onSubmit 
}) => {
  const [customAmount, setCustomAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCustomAmount('');
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async () => {
    const amount = parseFloat(customAmount);
    if (!amount || amount <= 0 || amount > (booking?.paymentSummary?.pendingAmount || 0)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call the parent's onSubmit function

      console.log();
      

      await onSubmit({
        bookingId: booking._id,
        amount: amount
      });
      
      // Close modal on success
      onClose();
    } catch (error) {
      console.error('Error processing payment:', error);
      showToast('Failed to process payment. Please try again.',"error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Quick amount presets
  const getQuickAmounts = () => {
    const pendingAmount = booking?.paymentSummary?.pendingAmount || 0;
    return [
      Math.round(pendingAmount * 0.25),
      Math.round(pendingAmount * 0.5),
      pendingAmount
    ];
  };

  // Validation helpers
  const isValidAmount = () => {
    const amount = parseFloat(customAmount);
    return amount > 0 && amount <= (booking?.paymentSummary?.pendingAmount || 0);
  };

  const getValidationMessage = () => {
    const amount = parseFloat(customAmount);
    const pendingAmount = booking?.paymentSummary?.pendingAmount || 0;
    
    if (!customAmount) return null;
    
    if (amount <= 0) {
      return { type: 'error', message: 'Amount must be greater than ₹0' };
    }
    
    if (amount > pendingAmount) {
      return { type: 'error', message: 'Amount cannot exceed remaining balance' };
    }
    
    return { type: 'success', message: 'Valid payment amount' };
  };

  if (!isOpen || !booking) return null;

  const validationMessage = getValidationMessage();
  const quickAmounts = getQuickAmounts();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 bg-orange-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Make Payment</h3>
                <p className="text-sm text-gray-600">Choose your payment amount</p>
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
          <div className="bg-white rounded-xl p-4 border border-orange-200">
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
                    {booking.packageId ? "SKL Package" : booking?.entityDetails?.name}
                  </h4>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-medium">
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
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Payment Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(booking.paymentSummary?.totalAmount || booking.totalAmount)}
                </span>
              </div>
              
              {booking.paymentSummary?.totalPaid > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Already Paid:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(booking.paymentSummary.totalPaid)}
                  </span>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Remaining Balance:</span>
                  <span className="font-bold text-orange-600 text-lg">
                    {formatCurrency(booking.paymentSummary?.pendingAmount || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Enter Payment Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 text-lg font-semibold">₹</span>
              </div>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="0"
                min="1"
                max={booking.paymentSummary?.pendingAmount || 0}
                className="block w-full pl-10 pr-4 py-4 text-lg font-semibold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                disabled={isSubmitting}
              />
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {quickAmounts.map((amount, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCustomAmount(amount.toString())}
                  disabled={isSubmitting}
                  className="px-3 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-semibold">
                    {idx === 0 && '25%'} {idx === 1 && '50%'} {idx === 2 && 'Full'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{formatCurrency(amount)}</div>
                </button>
              ))}
            </div>

            {/* Validation Messages */}
            {validationMessage && (
              <div className="mt-4">
                <div className={`flex items-center gap-2 text-sm ${
                  validationMessage.type === 'error' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {validationMessage.type === 'error' ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span>{validationMessage.message}</span>
                </div>
              </div>
            )}
          </div>


        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !customAmount || !isValidAmount()}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                customAmount && isValidAmount() && !isSubmitting
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Pay {customAmount && isValidAmount() ? formatCurrency(parseFloat(customAmount)) : '₹0'}
                </>
              )}
            </button>
          </div>
          

        </div>
      </div>
    </div>
  );
};

export default CustomPaymentModal;