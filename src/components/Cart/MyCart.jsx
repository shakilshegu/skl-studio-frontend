

//27
import React, { useCallback, useState } from 'react';
import InvoiceDetails from './InvoiceDetails';
import PayableAmount from './PayableAmount';
import StudioDetails from './StudioDetails';
import DateAndTime from './DateAndTime';
import EquipmentList from './EquipmentList';
import PackagesList from './PackagesList';
import ServicesList from './ServicesList';
import StudioList from './StudioList';
import Applycoupons from "./Applycoupons";
import HelpersList from './HelpersList';
import AdminPackageDetails from './AdminPackageDetails';

const MyCart = ({
    cartData,
    reduxState,
    isLoading,
    error,
    onPaymentSuccess
}) => {
    const [calculatedInvoice, setCalculatedInvoice] = useState(null);
    
    
    // NEW: Check if this is an admin package booking
    const isAdminPackageBooking = cartData?.isAdminPackageBooking || false;
    
    const { services, equipments, packages, helpers } = cartData?.cart || {};
    const bookings = cartData?.reduxBookings;
    
    // NEW: Get admin package data or regular entity info
    const entityInfo = isAdminPackageBooking 
        ? null // No studio/freelancer for admin packages
        : (cartData?.entityType === "studio"
            ? cartData?.entityInfo?.studio
            : cartData?.entityType === "freelancer"
            ? cartData?.entityInfo?.freelancer
            : null);
    
    const adminPackage = cartData?.adminPackage;
    const cartItems = cartData?.cart;
    
    // NEW: Calculate price and hours based on booking type
    let entityPrice, entityHours;
    
    if (isAdminPackageBooking) {
        // For admin packages, use package price
        entityPrice = adminPackage?.price || 0;
        // Calculate hours from booking dates
        entityHours = bookings ? Object.values(bookings).reduce((total, booking) => {
            return total + (booking.endTime - booking.startTime);
        }, 0) : 0;
    } else {
        // Regular booking logic
        entityPrice = entityInfo?.pricePerHour || entityInfo?.price || 0;
        entityHours = bookings ? Object.values(bookings).reduce((total, booking) => {
            return total + (booking.endTime - booking.startTime);
        }, 0) : 0;
    }
    
    // Handle invoice calculation callback
    const handleInvoiceCalculated = useCallback((invoiceData) => {
        setCalculatedInvoice(invoiceData);
    }, []);
    
    // Handle successful payment
    const handlePaymentSuccess = (paymentData) => {
        
        if (onPaymentSuccess) {
            onPaymentSuccess(paymentData, calculatedInvoice);
        }
    };

    return (
        <div>
            <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 border rounded-lg">
                    {/* NEW: Conditional rendering based on booking type */}
                    {isAdminPackageBooking ? (
                        // Admin package layout - only show package details
                        <AdminPackageDetails adminPackageData={adminPackage} />
                    ) : (
                        // Regular booking layout
                        <>
                            <StudioList entityInfo={entityInfo} entityType={cartData?.entityType} />
                            <EquipmentList equipments={equipments} />
                            <ServicesList services={services} />
                            <PackagesList packages={packages} />
                            <HelpersList helpers={helpers} />
                        </>
                    )}
                </div>
                <div className="lg:col-span-1">
                    {/* NEW: Conditional rendering for entity details */}
                    {!isAdminPackageBooking && (
                        <StudioDetails entityInfo={entityInfo}  entityType={cartData?.entityType} />
                    )}
                    
                    <DateAndTime 
                        bookings={bookings} 
                        isAdminPackage={isAdminPackageBooking}
                    />
                    
                    <Applycoupons />
                    
                    <InvoiceDetails
                        cartItems={cartItems}
                        entityPrice={entityPrice}
                        entityHours={entityHours}
                        gstRate={18}
                        // platformFee={500}
                        onInvoiceCalculated={handleInvoiceCalculated}
                        isAdminPackage={isAdminPackageBooking}
                        adminPackageData={adminPackage}
                    />
                    
                    <PayableAmount
                        calculatedInvoice={calculatedInvoice}
                        onPaymentSuccess={handlePaymentSuccess}
                        isAdminPackage={isAdminPackageBooking}
                    />
                </div>
            </div>
        </div>
    );
};

export default MyCart;