// services/checkout.service.js

import axiosInstance from "@/config/axios";

/**
 * Fetch all item details in a single API call
 * @param {Array} serviceIds - Array of service IDs
 * @param {Array} equipmentIds - Array of equipment IDs
 * @param {Array} packageIds - Array of package IDs
 * @param {Array} helperIds - Array of helper IDs
 * @returns {Promise} - Promise with all item details
 */
export const getCartItemDetails = async (payload) => {
  try {
    const response = await axiosInstance.post('/user/cart/item-details', payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart item details:', error);
    throw error;
  }
};

/**
 * Fetch entity details (studio/freelancer)
 * @param {string} entityId - Entity ID
 * @param {string} entityType - 'studio' or 'freelancer'
 * @returns {Promise} - Promise with entity details
 */
export const getEntityDetails = async (entityId, entityType) => {
  try {
    const endpoint = entityType === 'studio' ? `/user/studio/${entityId}` : `/user/freelancers/${entityId}`;
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${entityType} details:`, error);
    throw error;
  }
};

/**
 * Fetch complete checkout data
 * @param {Object} params - Checkout parameters
 * @param {string} params.entityId - Entity ID
 * @param {string} params.entityType - Entity type
 * @param {Array} params.serviceIds - Service IDs
 * @param {Array} params.equipmentIds - Equipment IDs
 * @param {Array} params.packageIds - Package IDs
 * @param {Array} params.helperIds - Helper IDs
 * @returns {Promise} - Promise with complete checkout data
 */
export const getCheckoutData = async ({
  entityId,
  entityType,
  serviceIds = [],
  equipmentIds = [],
  packageIds = [],
  helperIds = []
}) => {
  try {

    // Prepare the payload for item details
    const itemDetailsPayload = {
      serviceIds,
      equipmentIds,
      packageIds,
      helperIds
    };
    
    // Make parallel API calls
    const promises = [];
    
    // 1. Fetch item details (if any IDs exist)
    const hasAnyItems = serviceIds.length > 0 || equipmentIds.length > 0 || 
                       packageIds.length > 0 || helperIds.length > 0;
    
    if (hasAnyItems) {
      promises.push(getCartItemDetails(itemDetailsPayload));
    } else {
      promises.push(Promise.resolve({ 
        services: [], 
        equipments: [], 
        packages: [], 
        helpers: [] 
      }));
    }
    
    // 2. Fetch entity details
    if (entityId && entityType) {
      promises.push(getEntityDetails(entityId, entityType));
    } else {
      promises.push(Promise.resolve(null));
    }
    
    // 3. Fetch cart details (if needed)
    // promises.push(getCurrentCartAPI(entityId));
    
    const [itemDetails, entityDetails] = await Promise.all(promises);
    
    return {
      items: itemDetails,
      entity: entityDetails,
      success: true
    };
  } catch (error) {
    console.error('Error fetching checkout data:', error);
    throw {
      message: error.message || 'Failed to fetch checkout data',
      status: error.response?.status,
      data: error.response?.data
    };
  }
};

/**
 * Submit booking to backend
 * @param {Object} bookingData - Complete booking data
 * @returns {Promise} - Promise with booking confirmation
 */
export const submitBooking = async (bookingData) => {
  try {
    const response = await axiosInstance.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error submitting booking:', error);
    throw error;
  }
};

/**
 * Calculate booking totals
 * @param {Object} params - Calculation parameters
 * @param {Array} params.services - Services with counts
 * @param {Array} params.equipments - Equipment with counts
 * @param {Array} params.packages - Packages with counts
 * @param {Array} params.helpers - Helpers with counts
 * @param {Object} params.bookings - Booking dates and hours
 * @param {number} params.hourlyRate - Hourly rate for bookings
 * @param {number} params.taxRate - Tax rate (default 0.18 for 18% GST)
 * @returns {Object} - Calculated totals
 */
export const calculateBookingTotals = (params) => {
  const { 
    services = [], 
    equipments = [], 
    packages = [], 
    helpers = [], 
    bookings = {},
    hourlyRate = 0,
    taxRate = 0.18
  } = params;
  
  let itemsSubtotal = 0;
  const itemsList = [];
  
  // Calculate services total
  services.forEach(service => {
    const total = service.price * service.count;
    itemsSubtotal += total;
    itemsList.push({
      type: 'Service',
      name: service.name,
      price: service.price,
      count: service.count,
      total
    });
  });
  
  // Calculate equipment total
  equipments.forEach(equipment => {
    const total = equipment.price * equipment.count;
    itemsSubtotal += total;
    itemsList.push({
      type: 'Equipment',
      name: equipment.name,
      price: equipment.price,
      count: equipment.count,
      total
    });
  });
  
  // Calculate packages total
  packages.forEach(pkg => {
    const total = pkg.price * pkg.count;
    itemsSubtotal += total;
    itemsList.push({
      type: 'Package',
      name: pkg.name,
      price: pkg.price,
      count: pkg.count,
      total
    });
  });
  
  // Calculate helpers total
  helpers.forEach(helper => {
    const total = helper.price * helper.count;
    itemsSubtotal += total;
    itemsList.push({
      type: 'Helper',
      name: helper.name,
      price: helper.price,
      count: helper.count,
      total
    });
  });
  
  // Calculate booking hours total
  let hoursTotal = 0;
  let totalHours = 0;
  
  if (Object.keys(bookings).length > 0 && hourlyRate > 0) {
    totalHours = Object.values(bookings).reduce((total, booking) => {
      return total + (booking.endTime - booking.startTime);
    }, 0);
    
    hoursTotal = totalHours * hourlyRate;
    
    if (totalHours > 0) {
      itemsList.push({
        type: 'Booking',
        name: 'Hourly Booking',
        price: hourlyRate,
        count: totalHours,
        total: hoursTotal
      });
    }
  }
  
  const subtotal = itemsSubtotal + hoursTotal;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  return {
    itemsList,
    itemsSubtotal,
    hoursTotal,
    totalHours,
    subtotal,
    tax,
    total,
    taxRate
  };
};