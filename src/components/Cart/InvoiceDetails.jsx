
import React, { useEffect } from 'react';

const InvoiceDetails = ({ 
  cartItems = {}, 
  entityPrice = 0, 
  entityHours = 0, 
  gstRate = 18, 
  // platformFee = 500,
  onInvoiceCalculated,
  isAdminPackage = false, 
  adminPackageData = null 
}) => {

  const adminPackage = adminPackageData?.data

  // NEW: Handle admin package vs regular booking logic
  let invoiceItems = [];
  let subtotal = 0;
  
  if (isAdminPackage && adminPackage) {
    // ADMIN PACKAGE CALCULATION - Simple fixed price
    const packagePrice = adminPackage.price || 0;
    
    invoiceItems = [
      {
        label: `${adminPackage.name} (Aloka Package)`,
        value: packagePrice,
        isPackage: true
      }
    ];
    
    subtotal = packagePrice;
    
    console.log('Admin Package Invoice:', {
      packageName: adminPackage.name,
      packagePrice,
      subtotal
    });
    
  } else {
    // REGULAR BOOKING CALCULATION - Existing logic
    const services = cartItems.services || [];
    const equipments = cartItems.equipments || [];
    const packages = cartItems.packages || [];
    const helpers = cartItems.helpers || [];
    
    // Calculate individual totals
    const servicesTotal = services.reduce((sum, item) => sum + (item.price * item.count), 0);
    const equipmentsTotal = equipments.reduce((sum, item) => sum + (item.price * item.count), 0);
    const packagesTotal = packages.reduce((sum, item) => sum + (item.price * item.count), 0);
    const helpersTotal = helpers.reduce((sum, item) => sum + (item.price * item.count), 0);
    
    // Studio/Entity cost
    const entityTotal = entityPrice * entityHours;
    
    // Calculate subtotal
    subtotal = entityTotal + servicesTotal + equipmentsTotal + packagesTotal + helpersTotal;
    
    // Create invoice items array for display
    invoiceItems = [
      ...(entityTotal > 0 ? [{
        label: `Hourly Fee (₹${entityPrice}/h × ${entityHours}h)`,
        value: entityTotal
      }] : []),
      
      ...(servicesTotal > 0 ? [{
        label: `Services (${services.length} items)`,
        value: servicesTotal,
        breakdown: services.map(item => ({
          name: item.name,
          count: item.count,
          price: item.price,
          total: item.price * item.count
        }))
      }] : []),
      
      ...(equipmentsTotal > 0 ? [{
        label: `Equipment (${equipments.length} items)`,
        value: equipmentsTotal,
        breakdown: equipments.map(item => ({
          name: item.name,
          count: item.count,
          price: item.price,
          total: item.price * item.count
        }))
      }] : []),
      
      ...(packagesTotal > 0 ? [{
        label: `Packages (${packages.length} items)`,
        value: packagesTotal,
        breakdown: packages.map(item => ({
          name: item.name,
          count: item.count,
          price: item.price,
          total: item.price * item.count
        }))
      }] : []),
      
      ...(helpersTotal > 0 ? [{
        label: `Helpers (${helpers.length} items)`,
        value: helpersTotal,
        breakdown: helpers.map(item => ({
          name: item.name,
          count: item.count,
          price: item.price,
          total: item.price * item.count
        }))
      }] : [])
    ];
  }
  
  // Calculate GST and totals (same for both booking types)
  const gstAmount = (subtotal * gstRate) / 100;
  const grandTotal = subtotal + gstAmount ;
  // const grandTotal = subtotal + gstAmount + platformFee;
  
  // Calculate advance and on-site amounts
  const advanceAmount = Math.round(grandTotal * 0.2); // 20%
  const onSiteAmount = grandTotal - advanceAmount; // 80%
  
  // Add GST and platform fee to invoice items
  const finalInvoiceItems = [
    ...invoiceItems,
    {
      label: `GST (${gstRate}%)`,
      value: gstAmount
    },
    // {
    //   label: 'Platform Fee',
    //   value: platformFee
    // }
  ];
  
  // Create calculated data object
  const calculatedData = {
    subtotal,
    gstAmount,
    // platformFee,
    grandTotal,
    advanceAmount,
    onSiteAmount,
    isAdminPackage,
    adminPackage: isAdminPackage ? adminPackage : null,
    breakdown: isAdminPackage ? {
      packageTotal: subtotal
    } : {
      entityTotal: invoiceItems.find(item => item.label.includes('Studio'))?.value || 0,
      servicesTotal: invoiceItems.find(item => item.label.includes('Services'))?.value || 0,
      equipmentsTotal: invoiceItems.find(item => item.label.includes('Equipment'))?.value || 0,
      packagesTotal: invoiceItems.find(item => item.label.includes('Packages'))?.value || 0,
      helpersTotal: invoiceItems.find(item => item.label.includes('Helpers'))?.value || 0
    }
  };
  
  // Pass calculated data to parent whenever it changes
  useEffect(() => {
    if (onInvoiceCalculated) {
      onInvoiceCalculated(calculatedData);
    }
  }, [grandTotal, advanceAmount, onSiteAmount, onInvoiceCalculated, isAdminPackage]);
  
  return (
    <div className="border rounded-lg mt-2">
      <div className={`text-center font-semibold text-sm uppercase tracking-wider border-b rounded-t  bg-gray-100 text-gray-800`}>
        {isAdminPackage ? 'Package Invoice' : 'Invoice'}
      </div>
      <div className="p-4">
        <ul className="text-sm text-gray-600">
          {finalInvoiceItems.map((item, index) => (
            <li key={index} className="py-1">
              <div className="flex justify-between">
                <span className={item.isPackage ? 'font-medium text-[#892580]' : ''}>
                  {item.label}
                </span>
                <span className={item.isPackage ? 'font-medium text-[#892580]' : ''}>
                  ₹{item.value.toLocaleString()}
                </span>
              </div>
              {/* Show breakdown if available (only for regular bookings) */}
              {item.breakdown && !isAdminPackage && (
                <div className="ml-4 mt-1 text-xs text-gray-500">
                  {item.breakdown.map((subItem, subIndex) => (
                    <div key={subIndex} className="flex justify-between">
                      <span>{subItem.name} ({subItem.count}x)</span>
                      <span>₹{subItem.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className={`flex justify-between text-lg font-bold mt-4 border-t pt-2 ${
          isAdminPackage ? 'text-[#892580]' : 'text-gray-900'
        }`}>
          Grand Total: <span>₹{grandTotal.toLocaleString()}</span>
        </div>
        
        {/* NEW: Show booking type indicator */}
        {isAdminPackage && (
          <div className="mt-2 text-xs text-[#892580] text-center">
            Admin Package • Fixed Price • {entityHours} hours selected
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetails;