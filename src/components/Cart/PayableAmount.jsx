

//27 
"use client"
import { createOrderService, verifyPaymentService } from "@/services/Payment/payment.services";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { clearAllBookingData, setInvoiceData } from "@/stores/bookingSlice";
import Script from "next/script";
import React, { useState } from "react";
import { showToast } from "../Toast/Toast";

const PayableAmount = ({ 
  calculatedInvoice, 
  onPaymentSuccess,
  isAdminPackage = false // NEW: Flag for admin packages
}) => {
  const [paymentType, setPaymentType] = useState("advance");
  const dispatch = useDispatch();
  
  // Get regular booking data from Redux
  const cartItems = useSelector(state => ({
    services: state.booking.services,
    equipments: state.booking.equipments,
    packages: state.booking.packages,
    helpers: state.booking.helpers
  }));
  
  const bookingDates = useSelector(state => state.booking.bookings);
  const entityType = useSelector(state => state.booking.entityType);
  const entityId = useSelector(state => state.booking.entityId);
  
  // NEW: Get admin package data from Redux
  const adminPackageBooking = useSelector(state => state.booking.adminPackageBooking);
  
  // Get user data
  const userId = useSelector(state => state.auth?.user?.id);
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);

  const createOrderMutation = useMutation({
    mutationFn: createOrderService,
    onSuccess: (orderData) => {
      if (calculatedInvoice) {
        dispatch(setInvoiceData(calculatedInvoice));
      }
      openRazorpayModal(orderData);
    },
    onError: (error) => {
      console.error('Error creating order:', error);
      showToast('Failed to create order. Please try again.',"error");
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: verifyPaymentService,
    onSuccess: (data) => {
      // Prepare payment success data with payment type and amount
      const paymentSuccessData = {
        ...data,
        paymentType: paymentType,
        amount: paymentType === "advance" ? calculatedInvoice.advanceAmount : calculatedInvoice.grandTotal,
        isAdminPackage: isAdminPackage // NEW: Include admin package flag
      };
      
      // Clear booking data from Redux
      dispatch(clearAllBookingData());
      
      // Call the parent's onPaymentSuccess callback
      if (onPaymentSuccess) {
        onPaymentSuccess(paymentSuccessData);
      }
    },
    onError: (error) => {
      console.error('Error verifying payment:', error);
      showToast('Payment verification failed.',"error");
    },
  });

  const openRazorpayModal = (orderData) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: 'Aloka',
      description: isAdminPackage ? 'Payment for admin package booking' : 'Payment for studio booking', // NEW: Dynamic description
      order_id: orderData.order.id,
      handler: function (response) {
        verifyPaymentMutation.mutate({
          transactionId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature
        });
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
      },
      theme: {
        color: isAdminPackage ? '#7C3AED' : '#872980', // NEW: Purple theme for admin packages
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  const handleBookNow = () => {
    if (!calculatedInvoice) {
      showToast('Please wait for invoice calculation to complete');
      return;
    }

    if (!isAuthenticated) {
      alert('Please login to continue');
      return;
    }

    // Determine payment amount based on payment type
    const paymentAmount = paymentType === "advance" 
      ? calculatedInvoice.advanceAmount 
      : calculatedInvoice.grandTotal;

    // NEW: Prepare different data structure for admin packages
    let paymentData;
    
    if (isAdminPackage) {
      // Admin package payment data
      paymentData = {
        amount: paymentAmount,
        currency: 'INR',
        paymentType: paymentType,
        userId: userId,
        isAdminPackage: true,
        adminPackageData: {
          packageId: adminPackageBooking?.packageId,
          selectedDates: adminPackageBooking?.selectedDates,
          activeDate: adminPackageBooking?.activeDate
        },
        // frontendInvoice: calculatedInvoice
                  frontendInvoice: {
    grandTotal: calculatedInvoice?.grandTotal
  }
      };
    } else {
      // Regular booking payment data
      paymentData = {
        amount: paymentAmount,
        currency: 'INR',
        paymentType: paymentType,
        userId: userId,
        isAdminPackage: false,
        cartData: cartItems,
        bookingDates: bookingDates,
        entityInfo: {
          entityType: entityType,
          [entityType]: {
            _id: entityId,
            pricePerHour: calculatedInvoice?.entityPrice || 0
          }
        },
        // frontendInvoice: calculatedInvoice
          frontendInvoice: {
    grandTotal: calculatedInvoice?.grandTotal
  }
      };
    }
    
    console.log('Payment data being sent:', paymentData);
    createOrderMutation.mutate(paymentData);
  };

  const handlePaymentTypeChange = (type) => {
    setPaymentType(type);
  };

  // Show loading state if no calculated invoice
  if (!calculatedInvoice) {
    return (
      <div className="border rounded-lg mt-2">
        <div className={`text-center font-semibold text-sm uppercase tracking-wider border-b rounded-t ${
          isAdminPackage ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
        }`}>
          Payable Amount
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center">
            <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${
              isAdminPackage ? 'border-purple-600' : 'border-[#872980]'
            }`}></div>
            <span className="ml-2 text-gray-600">Calculating payment amount...</span>
          </div>
        </div>
      </div>
    );
  }

  // NEW: Get theme colors based on booking type
  const themeColor =  '#872980';
  const themeColorHover =  '#7D1F72';
  const themeColorLight =  'text-[#872980]';
  const themeBg = 'bg-[#872980]';
  const themeBgHover =  'hover:bg-[#7D1F72]';

  return (
    <div className="border rounded-lg mt-2">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className={`text-center font-semibold text-sm uppercase tracking-wider border-b rounded-t bg-gray-100 text-gray-800`}>
        {isAdminPackage ? 'Package Payment' : 'Payable Amount'}
      </div>
      
      {/* Payment Type Selection */}
      <div className="p-2">
        <div className="flex rounded-lg overflow-hidden border">
          <button
            className={`flex-1 py-3 text-sm font-semibold transition-all ${
              paymentType === "advance"
                ? `${themeBg} text-white`
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => handlePaymentTypeChange("advance")}
          >
            <div className="text-center">
              <div>Pay 20% Advance</div>
            </div>
          </button>
          <button
            className={`flex-1 py-3 text-sm font-semibold transition-all ${
              paymentType === "full"
                ? `${themeBg} text-white`
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => handlePaymentTypeChange("full")}
          >
            <div className="text-center">
              <div>Pay Full Amount</div>
            </div>
          </button>
        </div>
      </div>

      {/* Invoice Breakdown */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-gray-600 text-sm">
          <span>{isAdminPackage ? 'Package Total' : 'Grand Total'}</span>
          <span className="font-medium">₹{calculatedInvoice.grandTotal.toLocaleString()}</span>
        </div>
        <hr className="my-2 border-gray-300" />
        
        {/* Show different breakdown based on payment type */}
        {paymentType === "advance" ? (
          <>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>20% Advance Payment</span>
              <span className={`font-medium ${themeColorLight}`}>₹{calculatedInvoice.advanceAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Remaining (80% on-site)</span>
              <span className="font-medium">₹{calculatedInvoice.onSiteAmount.toLocaleString()}</span>
            </div>
          </>
        ) : (
          <div className="flex justify-between text-gray-600 text-sm">
            <span>Full Payment</span>
            <span className={`font-medium ${themeColorLight}`}>₹{calculatedInvoice.grandTotal.toLocaleString()}</span>
          </div>
        )}
        
        <hr className="my-2 border-gray-300" />
        <div className="flex justify-between font-semibold text-black">
          <span>You Pay Now</span>
          <span className={themeColorLight}>
            ₹{paymentType === "advance" 
              ? calculatedInvoice.advanceAmount.toLocaleString()
              : calculatedInvoice.grandTotal.toLocaleString()
            }
          </span>
        </div>
        
        {/* Payment Info */}
        <div className={`p-3 rounded-lg ${
          isAdminPackage ? 'bg-purple-50' : 'bg-blue-50'
        }`}>
          <p className={`text-xs text-blue-800`}>
            {isAdminPackage ? '📦 ' : '💡 '}
            {paymentType === "advance" 
              ? `Pay 20% now to secure your ${isAdminPackage ? 'package' : 'booking'}. Pay the remaining 80% on-site.`
              : `Pay the full amount now and enjoy a seamless ${isAdminPackage ? 'package' : 'booking'} experience.`
            }
          </p>
        </div>
        
        <button 
          onClick={handleBookNow} 
          disabled={createOrderMutation.isPending || verifyPaymentMutation.isPending || !calculatedInvoice} 
          className={`w-full ${themeBg} text-white text-sm font-medium py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${themeBgHover} transition-colors`}
        >
          {createOrderMutation.isPending ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay ₹${paymentType === "advance" 
              ? calculatedInvoice.advanceAmount.toLocaleString()
              : calculatedInvoice.grandTotal.toLocaleString()
            } & ${isAdminPackage ? 'Book Package' : 'Book Now'}`
          )}
        </button>
      </div>
    </div>
  );
};

export default PayableAmount;