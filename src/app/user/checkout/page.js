


"use client"
import React, { Suspense, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import MyCart from '@/components/Cart/MyCart';
import { getCheckoutData } from '@/services/Checkout/checkout.service';
import BookingConfirmation from '@/components/Cart/BookingConfirmation';
import { getAdminPackageById } from '@/services/AdminPackage/admin.package.service';

const CartContent = () => {
  const searchParams = useSearchParams();
  const entityId = searchParams.get('entityId');
  const packageId = searchParams.get('packageId'); // NEW: Extract packageId for admin packages
  
  // State for booking confirmation
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  
  // Get Redux booking state with error handling
  let reduxBookingState;
  try {
    reduxBookingState = useSelector(state => state.booking);
  } catch (error) {
    console.error('Error accessing Redux state:', error);
    reduxBookingState = {};
  }
  
  

  // Safe destructuring with defaults
  const {
    bookings: reduxBookings = {},
    services: reduxServices = {},
    equipments: reduxEquipments = {},
    packages: reduxPackages = {},
    helpers: reduxHelpers = {},
    entityType: reduxEntityType,
    entityId: reduxEntityId,
    entityName: reduxEntityName,
    // NEW: Admin package specific state
    adminPackage: reduxAdminPackage = null,
    adminPackageBooking: reduxAdminPackageBooking = null
  } = reduxBookingState || {};
  
  
  // NEW: Determine if this is an admin package booking
  const isAdminPackageBooking = !!packageId;
  
  // Use appropriate ID based on booking type
  const finalEntityId = isAdminPackageBooking 
    ? (packageId || reduxAdminPackageBooking?.packageId)
    : (reduxEntityId || entityId);
  
  const finalEntityType = isAdminPackageBooking ? 'adminPackage' : (reduxEntityType || 'studio');
  

  
  // Extract IDs for fetching details (only for regular bookings)
  const serviceIds = isAdminPackageBooking ? [] : Object.keys(reduxServices || {});
  const equipmentIds = isAdminPackageBooking ? [] : Object.keys(reduxEquipments || {});
  const packageIds = isAdminPackageBooking ? [] : Object.keys(reduxPackages || {});
  const helperIds = isAdminPackageBooking ? [] : Object.keys(reduxHelpers || {});
  
  // Handle successful payment
  const handlePaymentSuccess = (paymentData, calculatedInvoice) => {
    
    // Create booking details for confirmation
    const bookingInfo = {
      bookingId: paymentData.bookingId || `BK${Date.now().toString().slice(-6)}`,
      entityName: isAdminPackageBooking 
        ? (reduxAdminPackage?.name || 'Admin Package')
        : (reduxEntityName || 'Studio Name'),
      bookingDates: isAdminPackageBooking 
        ? (reduxAdminPackageBooking?.selectedDates || {})
        : (reduxBookings || {}),
      paymentAmount: paymentData.amount || 0,
      paymentType: paymentData.paymentType || 'full',
      remainingAmount: calculatedInvoice?.onSiteAmount || 0,
      isAdminPackage: isAdminPackageBooking
    };
    
    setBookingDetails(bookingInfo);
    setShowConfirmation(true);
  };
  
  // Function to close confirmation and navigate
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    window.location.href = '/user/my-bookings';
  };
  
  // NEW: Modified query to handle admin packages
  const { 
    data: checkoutData, 
    isLoading, 
    error,
    isError 
  } = useQuery({
    queryKey: [
      'checkoutData', 
      finalEntityId, 
      finalEntityType, 
      serviceIds, 
      equipmentIds, 
      packageIds, 
      helperIds,
      isAdminPackageBooking
    ],
    queryFn: async () => {
      try {
        if (isAdminPackageBooking) {
          // NEW: For admin packages, fetch package details directly using the specific API
          const packageData = await getAdminPackageById(finalEntityId);
          return {
            adminPackage: packageData
          };
        } else {
          // Regular booking flow
          const result = await getCheckoutData({
            entityId: finalEntityId,
            entityType: finalEntityType,
            serviceIds,
            equipmentIds,
            packageIds,
            helperIds
          });
          return result;
        }
      } catch (error) {
        console.error('Query error:', error);
        throw error;
      }
    },
    enabled: !!finalEntityId,
    staleTime: 0,
    retry: 1,
  });

  // NEW: Enhanced data processing for admin packages
  const enrichedCartData = React.useMemo(() => {
    if (!checkoutData) {
      return null;
    }
    
    try {
      if (isAdminPackageBooking) {
        // NEW: Admin package data structure - only what's needed
        return {
          cart: {
            bookings: reduxAdminPackageBooking?.selectedDates || {}
          },
          reduxBookings: reduxAdminPackageBooking?.selectedDates || {},
          entityType: 'adminPackage',
          adminPackage: checkoutData.adminPackage,
          isAdminPackageBooking: true
        };
      } else {
        // Regular booking data structure (existing logic)
        const { items, entity } = checkoutData;
        
        // Helper function to combine Redux items with their fetched details
        const enrichItems = (reduxItems, fetchedItems, itemType) => {
          if (!reduxItems || !fetchedItems) {
            return [];
          }
          
          return Object.entries(reduxItems).map(([id, reduxData]) => {
            const details = fetchedItems.find(item => item._id === id);
            
            if (!details) {
              console.warn(`⚠️ ${itemType} details not found for ID: ${id}`);
              return null;
            }
            
            return {
              ...details,
              count: reduxData.count,
              source: 'redux'
            };
          }).filter(Boolean);
        };
        
        // Process all item types
        const services = enrichItems(reduxServices, items?.data?.services, 'Service');
        const equipments = enrichItems(reduxEquipments, items?.data?.equipments, 'Equipment');
        const packages = enrichItems(reduxPackages, items?.data?.packages, 'Package');
        const helpers = enrichItems(reduxHelpers, items?.data?.helpers, 'Helper');
        
        // Create the final cart data
        return {
          studioInfo: entity || {
            _id: finalEntityId,
            name: `${finalEntityType} (Loading...)`,
            entityType: finalEntityType,
            hasError: !entity
          },
          entityInfo: entity,
          cart: {
            services,
            equipments,
            packages,
            helpers,
            bookings: reduxBookings
          },
          reduxBookings,
          entityType: finalEntityType,
          isAdminPackageBooking: false
        };
      }
    } catch (error) {
      console.error('Error processing enriched cart data:', error);
      return null;
    }
  }, [checkoutData, reduxBookings, reduxServices, reduxEquipments, reduxPackages, reduxHelpers, finalEntityType, finalEntityId, isAdminPackageBooking, reduxAdminPackageBooking]);
  
  // If showing confirmation, show it over everything else
  if (showConfirmation && bookingDetails) {
    return (
      <BookingConfirmation
        bookingData={bookingDetails}
        onClose={handleCloseConfirmation}
      />
    );
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#892580] mx-auto mb-4"></div>
          <p>Loading checkout data...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (isError || error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <div className="text-center">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-semibold mb-2">Error loading checkout data</p>
          <p className="text-sm mb-4">{error?.message || 'Something went wrong'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#892580] text-white rounded-lg hover:bg-[#7D1F72] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // NEW: Enhanced empty state check for admin packages
  const hasItems = isAdminPackageBooking 
    ? (Object.keys(enrichedCartData?.reduxBookings || {}).length > 0 && enrichedCartData?.adminPackage)
    : (enrichedCartData?.cart?.services?.length || 
       enrichedCartData?.cart?.equipments?.length || 
       enrichedCartData?.cart?.packages?.length || 
       enrichedCartData?.cart?.helpers?.length || 
       Object.keys(reduxBookings || {}).length);
  
  // Show empty state
  if (!enrichedCartData || !hasItems) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-lg font-semibold mb-2">No items in cart</p>
          <p className="text-sm text-gray-600">
            {isAdminPackageBooking ? 'No booking dates selected' : 'Add some items to see them here'}
          </p>
        </div>
      </div>
    );
  }
  
  // Show the cart
  return (
    <MyCart 
      cartData={enrichedCartData} 
      reduxState={reduxBookingState}
      isLoading={false}
      error={error}
      onPaymentSuccess={handlePaymentSuccess}
    />
  );
};

// NEW: Import the admin package service

const CheckoutPage = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#892580]"></div>
      </div>
    }>
      <CartContent />
    </Suspense>
  );
};

export default CheckoutPage;