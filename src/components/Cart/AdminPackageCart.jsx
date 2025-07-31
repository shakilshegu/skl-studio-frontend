import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { showToast } from '../Toast/Toast';
import { clearAdminPackageBooking } from '@/stores/bookingSlice';

const AdminPackageCart = ({ 
  cartData, 
  adminPackageState, 
  isLoading, 
  error, 
  onPaymentSuccess 
}) => {
  const dispatch = useDispatch();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('full'); // 'full' or 'partial'
  const [invoice, setInvoice] = useState(null);

  // Calculate totals
  const calculateTotals = () => {
    if (!adminPackageState.selectedDates) {
      return { totalHours: 0, totalDays: 0, totalAmount: 0 };
    }

    const totalHours = Object.values(adminPackageState.selectedDates).reduce((sum, dateData) => {
      return sum + (dateData.endTime - dateData.startTime);
    }, 0);

    const totalDays = Object.keys(adminPackageState.selectedDates).length;
    
    // Admin package pricing - you can adjust this logic
    const hourlyRate = cartData?.packageInfo?.hourlyRate || 100; // Default rate
    const totalAmount = totalHours * hourlyRate;

    return { totalHours, totalDays, totalAmount };
  };

  const { totalHours, totalDays, totalAmount } = calculateTotals();

  // Generate invoice
  useEffect(() => {
    if (totalAmount > 0) {
      const advanceAmount = totalAmount * 0.2; // 30% advance
      const onSiteAmount = totalAmount - advanceAmount;

      setInvoice({
        totalAmount,
        advanceAmount: Math.round(advanceAmount),
        onSiteAmount: Math.round(onSiteAmount),
        totalHours,
        totalDays,
        packageDetails: cartData?.packageInfo || {}
      });
    }
  }, [totalAmount, totalHours, totalDays, cartData]);

  // Handle payment processing
  const handlePayment = async () => {
    if (!invoice) {
      showToast('Invoice not ready', 'error');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Simulate payment processing - replace with actual payment logic
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentData = {
        bookingId: `APK${Date.now().toString().slice(-6)}`,
        amount: paymentMethod === 'full' ? invoice.totalAmount : invoice.advanceAmount,
        paymentType: paymentMethod,
        packageId: adminPackageState.packageId,
        selectedDates: adminPackageState.selectedDates,
        status: 'success'
      };

      // Clear Redux state after successful payment
      dispatch(clearAdminPackageBooking());

      // Call success callback
      onPaymentSuccess(paymentData, invoice);
      
      showToast('Payment successful!', 'success');
    } catch (error) {
      console.error('Payment error:', error);
      showToast('Payment failed. Please try again.', 'error');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !cartData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>Error loading admin package details</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-t-xl">
        <h1 className="text-2xl font-bold mb-2">Admin Package Checkout</h1>
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="text-purple-100">Package ID: #{adminPackageState.packageId?.slice(-8) || 'ADMIN'}</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg">
        {/* Package Info */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Package Details</h2>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">{cartData.packageInfo?.name || 'Admin Package'}</h3>
            <p className="text-sm text-purple-600 mt-1">
              {cartData.packageInfo?.description || 'Custom admin package booking'}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-purple-700">Hourly Rate:</span>
              <span className="font-semibold text-purple-800">
                ₹{cartData.packageInfo?.hourlyRate || 100}/hour
              </span>
            </div>
          </div>
        </div>

        {/* Selected Dates */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Selected Dates & Times</h2>
          <div className="space-y-3">
            {Object.entries(adminPackageState.selectedDates || {}).map(([dateKey, dateData]) => (
              <div key={dateKey} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">
                    {moment(dateKey).format('dddd, MMMM D, YYYY')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {dateData.startTime > 12 ? dateData.startTime - 12 : dateData.startTime}
                    {dateData.startTime >= 12 ? 'PM' : 'AM'} - {' '}
                    {dateData.endTime > 12 ? dateData.endTime - 12 : dateData.endTime}
                    {dateData.endTime >= 12 ? 'PM' : 'AM'}
                    {dateData.isWholeDay && " (Whole Day)"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-purple-700">
                    {dateData.endTime - dateData.startTime} hour{dateData.endTime - dateData.startTime !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Booking Summary</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{totalDays}</div>
              <div className="text-sm text-purple-600">Total Days</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{totalHours}</div>
              <div className="text-sm text-purple-600">Total Hours</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">₹{totalAmount}</div>
              <div className="text-sm text-purple-600">Total Amount</div>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        {invoice && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Options</h2>
            <div className="space-y-4">
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'full' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('full')}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-800">Pay Full Amount</div>
                    <div className="text-sm text-gray-600">Complete payment now</div>
                  </div>
                  <div className="text-xl font-bold text-purple-700">₹{invoice.totalAmount}</div>
                </div>
              </div>
              
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'partial' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('partial')}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-800">Pay Advance (30%)</div>
                    <div className="text-sm text-gray-600">
                      Remaining ₹{invoice.onSiteAmount} to be paid on-site
                    </div>
                  </div>
                  <div className="text-xl font-bold text-purple-700">₹{invoice.advanceAmount}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Button */}
        <div className="p-6">
          <button
            onClick={handlePayment}
            disabled={isProcessingPayment || !invoice}
            className={`
              w-full py-4 px-6 rounded-lg text-white font-semibold text-lg
              transition-all duration-200 flex items-center justify-center
              ${!isProcessingPayment && invoice
                ? 'bg-purple-600 hover:bg-purple-700 transform hover:scale-[1.02] shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            {isProcessingPayment ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                Processing Payment...
              </>
            ) : (
              `Pay ₹${paymentMethod === 'full' ? invoice?.totalAmount || 0 : invoice?.advanceAmount || 0} Now`
            )}
          </button>
          
          {paymentMethod === 'partial' && invoice && (
            <p className="text-center text-sm text-gray-600 mt-3">
              Remaining ₹{invoice.onSiteAmount} will be collected at the venue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPackageCart;