"use client";
import React, { useState } from "react";
import { 
  X, 
  Plus, 
  Calendar, 
  DollarSign, 
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  Receipt,
  Loader2,
  CheckCircle,
  User,
  Check
} from "lucide-react";

const AddPaymentModal = ({ isOpen = true, onClose = () => {}, onSubmit = () => {}, booking = {
  id: '1',
  clientName: 'ridin k',
  service: 'Photography Service',
  quotedAmount: 12300,
  receivedAmount: 2460,
  pendingAmount: 9840
} }) => {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'Online',
    transactionId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
    invoiceId: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getPaymentModeIcon = (mode) => {
    switch (mode) {
      case 'UPI': return <Smartphone className="w-5 h-5" />;
      case 'Bank Transfer': return <Building2 className="w-5 h-5" />;
      case 'Cash': return <Banknote className="w-5 h-5" />;
      case 'Card': return <CreditCard className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  const handleQuickAmount = (amount) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const paymentData = {
        ...formData,
        amount: parseFloat(formData.amount),
        bookingId: booking?.id,
        status: 'completed',
        createdAt: new Date().toISOString()
      };
      
      await onSubmit(paymentData);
      
      setFormData({
        amount: '',
        paymentMethod: 'Online',
        transactionId: '',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: '',
        invoiceId: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !booking) return null;

  const pendingInvoices = booking.invoices?.filter(inv => inv.status === 'pending') || [];
  const maxAmount = booking.pendingAmount || 0;
  const currentAmount = parseFloat(formData.amount) || 0;
  const remainingAmount = maxAmount - currentAmount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Record Payment</h2>
              <p className="text-sm text-gray-500">Add payment received from client</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Client Info Card */}
        <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center text-white text-xl font-bold">
              {booking.clientName?.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{booking.clientName}</h3>
              <p className="text-sm text-gray-600 mb-2">{booking.service}</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium">Total</p>
                  <p className="text-sm font-bold text-gray-900">₹{booking.quotedAmount?.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium">Received</p>
                  <p className="text-sm font-bold text-green-600">₹{booking.receivedAmount?.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium">Pending</p>
                  <p className="text-sm font-bold text-orange-600">₹{booking.pendingAmount?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Form Container */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 240px)' }}>
          <div className="p-6 space-y-6">
            {/* Quick Amount Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Payment Amount
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => handleQuickAmount(maxAmount)}
                  className="p-3 border-2 border-green-200 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors text-sm font-medium"
                >
                  Full Payment
                  <span className="block text-xs text-green-600">₹{maxAmount.toLocaleString()}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAmount(maxAmount / 2)}
                  className="p-3 border-2 border-blue-200 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  Half Payment
                  <span className="block text-xs text-blue-600">₹{(maxAmount / 2).toLocaleString()}</span>
                </button>
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max={maxAmount}
                  step="0.01"
                  className="w-full pl-8 pr-4 py-4 text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center"
                  placeholder="0"
                />
              </div>
              
              {currentAmount > 0 && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount Entering:</span>
                    <span className="font-semibold text-green-600">₹{currentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining Due:</span>
                    <span className="font-semibold text-orange-600">₹{remainingAmount.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'Online', label: 'Online Payment', color: 'blue' },
                  { value: 'UPI', label: 'UPI', color: 'purple' },
                  { value: 'Bank Transfer', label: 'Bank Transfer', color: 'green' },
                  { value: 'Cash', label: 'Cash', color: 'yellow' },
                  { value: 'Card', label: 'Card Payment', color: 'indigo' }
                ].map(({ value, label, color }) => (
                  <label
                    key={value}
                    className={`relative flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.paymentMethod === value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={formData.paymentMethod === value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      formData.paymentMethod === value ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {getPaymentModeIcon(value)}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">{label}</span>
                    </div>
                    {formData.paymentMethod === value && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Transaction Reference
                </label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Transaction ID or reference number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Payment Date
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Payment Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                placeholder="Any additional notes about this payment..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.amount}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Recording...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Record Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;