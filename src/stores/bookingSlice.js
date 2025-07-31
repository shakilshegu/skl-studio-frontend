

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  services: {},
  equipments: {},
  packages: {},
  helpers: {},
  
  // Regular booking structure
  bookings: {}, // Format: { "YYYY-MM-DD": { startTime: null, endTime: null, slots: [], dateDocumentId: null, isWholeDay: false } }
  activeDate: null, // Currently active date
  entityId: null,
  entityType: null,
  userId: null,
  
  // Admin package booking structure (separate from regular bookings)
  adminPackageBooking: {
    packageId: null,
    selectedDates: {}, // Format: { "YYYY-MM-DD": { startTime: null, endTime: null, isWholeDay: false } }
    activeDate: null,
    isActive: false // Flag to indicate if admin package booking is active
  },
  
  // Store calculated invoice data
  invoiceData: null, // Will store the complete calculated invoice
};

const updateCount = (state, category, id, change, itemData = null) => {
  let item;
  
  if (state[category][id]) {
    item = { ...state[category][id] };
  } else if (itemData) {
    item = { ...itemData, count: 0 };
  } else {
    item = { count: 0 };
  }
  
  item.count = Math.max(item.count + change, 0);
  
  if (item.count === 0) {
    delete state[category][id];
  } else {
    state[category][id] = item;
  }
  
  // Clear invoice data when cart changes
  state.invoiceData = null;
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    // Original reducers for services, equipment, etc.
    updateService: (state, action) => {
      const { id, change, itemData } = action.payload;
      updateCount(state, "services", id, change, itemData);
    },
    updateEquipment: (state, action) => {
      const { id, change, itemData } = action.payload;
      updateCount(state, "equipments", id, change, itemData);
    },
    updatePackage: (state, action) => {
      const { id, change, itemData } = action.payload;
      updateCount(state, "packages", id, change, itemData);
    },
    updateHelper: (state, action) => {
      const { id, change, itemData } = action.payload;
      updateCount(state, "helpers", id, change, itemData);
    },
    
    // Regular booking actions
    setAllBookingData: (state, action) => {
      const { bookings, activeDate } = action.payload;
      state.bookings = bookings || {};
      state.activeDate = activeDate || null;
      state.invoiceData = null; // Clear invoice when bookings change
      
      // Clear admin package booking when regular booking is set
      state.adminPackageBooking = {
        packageId: null,
        selectedDates: {},
        activeDate: null,
        isActive: false
      };
    },
    
    clearBookings: (state) => {
      state.bookings = {};
      state.activeDate = null;
      state.invoiceData = null;
    },

    // Add these new reducers to your existing bookingSlice.reducers object:

// Remove individual date from regular bookings
removeBookingDate: (state, action) => {
  const { dateKey } = action.payload;
  if (state.bookings[dateKey]) {
    delete state.bookings[dateKey];
  }
  
  // If active date was removed, set another date as active or reset
  if (dateKey === state.activeDate) {
    const remainingDates = Object.keys(state.bookings);
    if (remainingDates.length > 0) {
      state.activeDate = remainingDates[0];
    } else {
      state.activeDate = null;
    }
  }
  
  // Clear invoice data when bookings change
  state.invoiceData = null;
},

// Remove individual date from admin package booking
removeAdminPackageDate: (state, action) => {
  const { dateKey } = action.payload;
  if (state.adminPackageBooking.selectedDates[dateKey]) {
    delete state.adminPackageBooking.selectedDates[dateKey];
  }
  
  // If active date was removed, set another date as active or reset
  if (dateKey === state.adminPackageBooking.activeDate) {
    const remainingDates = Object.keys(state.adminPackageBooking.selectedDates);
    if (remainingDates.length > 0) {
      state.adminPackageBooking.activeDate = remainingDates[0];
    } else {
      state.adminPackageBooking.activeDate = null;
    }
  }
  
  // Clear invoice data when admin package booking changes
  state.invoiceData = null;
},

    
    // Admin package booking actions
    setAdminPackageBooking: (state, action) => {
      const { packageId, selectedDates, activeDate } = action.payload;
      state.adminPackageBooking = {
        packageId: packageId || null,
        selectedDates: selectedDates || {},
        activeDate: activeDate || null,
        isActive: true
      };
      state.invoiceData = null; // Clear invoice when admin package booking changes
      
      // Clear regular bookings when admin package booking is set
      state.bookings = {};
      state.activeDate = null;
      state.entityId = packageId; // Set packageId as entityId for consistency
      state.entityType = "adminPackage";
    },
    
    clearAdminPackageBooking: (state) => {
      state.adminPackageBooking = {
        packageId: null,
        selectedDates: {},
        activeDate: null,
        isActive: false
      };
      state.invoiceData = null;
    },
    
    // Store calculated invoice data
    setInvoiceData: (state, action) => {
      state.invoiceData = action.payload;
    },
    
    // Clear invoice data
    clearInvoiceData: (state) => {
      state.invoiceData = null;
    },
    
    // Entity-related reducers
    setEntityId: (state, action) => {
      state.entityId = action.payload;
    },
    setEntityType: (state, action) => {
      state.entityType = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    
    // Clear entire booking state
    clearAllBookingData: (state) => {
      return { ...initialState };
    }
  }
});

export const {
  updateService,
  updateEquipment,
  updatePackage,
  updateHelper,
  setEntityId,
  setEntityType,
  setUserId,
  setAllBookingData,
  clearBookings,
  setAdminPackageBooking,
  clearAdminPackageBooking,
  setInvoiceData,
  clearInvoiceData,
  clearAllBookingData,
  removeAdminPackageDate,
  removeBookingDate
} = bookingSlice.actions;

// Regular booking selectors
export const selectTotalBookedHours = (state) => {
  if (!state.booking?.bookings) return 0;
  
  return Object.values(state.booking.bookings).reduce((total, dateData) => {
    if (dateData.startTime !== null && dateData.endTime !== null) {
      return total + (dateData.endTime - dateData.startTime);
    }
    return total;
  }, 0);
};

export const selectTotalBookedDates = (state) => {
  return Object.keys(state.booking?.bookings || {}).length;
};

export const selectActiveDate = (state) => {
  return state.booking?.activeDate || null;
};

export const selectAllBookings = (state) => {
  return state.booking?.bookings || {};
};

// Admin package booking selectors
export const selectAdminPackageBooking = (state) => {
  return state.booking?.adminPackageBooking || {
    packageId: null,
    selectedDates: {},
    activeDate: null,
    isActive: false
  };
};

export const selectAdminPackageTotalHours = (state) => {
  const adminPackageBooking = state.booking?.adminPackageBooking;
  if (!adminPackageBooking?.selectedDates) return 0;
  
  return Object.values(adminPackageBooking.selectedDates).reduce((total, dateData) => {
    if (dateData.startTime !== null && dateData.endTime !== null) {
      return total + (dateData.endTime - dateData.startTime);
    }
    return total;
  }, 0);
};

export const selectAdminPackageTotalDates = (state) => {
  const adminPackageBooking = state.booking?.adminPackageBooking;
  if (!adminPackageBooking?.selectedDates) return 0;
  
  return Object.keys(adminPackageBooking.selectedDates).length;
};

export const selectIsAdminPackageActive = (state) => {
  return state.booking?.adminPackageBooking?.isActive || false;
};

// Combined selectors (for components that need to work with both)
export const selectCurrentBookingType = (state) => {
  // Add null checks for adminPackageBooking
  if (state.booking?.adminPackageBooking?.isActive) {
    return "adminPackage";
  } else if (state.booking?.bookings && Object.keys(state.booking.bookings).length > 0) {
    return "regular";
  } else {
    return null;
  }
};

export const selectCurrentBookingData = (state) => {
  const bookingType = selectCurrentBookingType(state);
  
  if (bookingType === "adminPackage") {
    return {
      type: "adminPackage",
      data: state.booking?.adminPackageBooking?.selectedDates || {},
      entityId: state.booking?.adminPackageBooking?.packageId || null,
      entityType: "adminPackage",
      activeDate: state.booking?.adminPackageBooking?.activeDate || null
    };
  } else if (bookingType === "regular") {
    return {
      type: "regular",
      data: state.booking?.bookings || {},
      entityId: state.booking?.entityId || null,
      entityType: state.booking?.entityType || null,
      activeDate: state.booking?.activeDate || null
    };
  } else {
    return null;
  }
};

// Cart items selector
export const selectCartItems = (state) => ({
  services: Object.values(state.booking.services),
  equipments: Object.values(state.booking.equipments),
  packages: Object.values(state.booking.packages),
  helpers: Object.values(state.booking.helpers)
});

// Invoice data selector
export const selectInvoiceData = (state) => {
  return state.booking.invoiceData;
};

export default bookingSlice.reducer;