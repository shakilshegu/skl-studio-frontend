// store/locationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Get initial location state from localStorage
const getInitialLocationState = () => {
  if (typeof window !== 'undefined') {
    try {
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        const parsed = JSON.parse(savedLocation);
        return {
          city: parsed.city || 'Hyderabad',
          coordinates: parsed.coordinates || { lat: 17.3850, lng: 78.4867 },
          isDetecting: false,
          error: null,
          hasPermission: true
        };
      }
    } catch (error) {
      console.error('Error reading location from localStorage:', error);
    }
  }
  
  return {
    city: 'Hyderabad', // Default city
    coordinates: { lat: 17.3850, lng: 78.4867 }, // Default coordinates
    isDetecting: false,
    error: null,
    hasPermission: false
  };
};

// Async thunk for detecting current location
export const detectCurrentLocation = createAsyncThunk(
  'location/detectCurrent',
  async (_, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(rejectWithValue('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Use reverse geocoding to get city name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const city = data.city || data.locality || data.countryName || 'Your Location';
            
            const locationData = {
              city,
              coordinates: { lat: latitude, lng: longitude },
              hasPermission: true
            };
            
            // Save to localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('userLocation', JSON.stringify(locationData));
            }
            
            resolve(locationData);
          } catch (error) {
            console.error('Error getting location name:', error);
            const locationData = {
              city: 'Location Unknown',
              coordinates: { lat: latitude, lng: longitude },
              hasPermission: true
            };
            resolve(locationData);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Location access denied';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
            default:
              errorMessage = 'An unknown error occurred';
              break;
          }
          
          reject(rejectWithValue(errorMessage));
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState: getInitialLocationState(),
  reducers: {
    setLocation: (state, action) => {
      const { city, coordinates } = action.payload;
      state.city = city;
      state.coordinates = coordinates;
      state.error = null;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        const locationData = { city, coordinates };
        localStorage.setItem('userLocation', JSON.stringify(locationData));
      }
    },
    
    updateCity: (state, action) => {
      state.city = action.payload;
      state.error = null;
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        const currentLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
        currentLocation.city = action.payload;
        localStorage.setItem('userLocation', JSON.stringify(currentLocation));
      }
    },
    
    updateCoordinates: (state, action) => {
      state.coordinates = action.payload;
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        const currentLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');
        currentLocation.coordinates = action.payload;
        localStorage.setItem('userLocation', JSON.stringify(currentLocation));
      }
    },
    
    clearLocationError: (state) => {
      state.error = null;
    },
    
    setLocationPermission: (state, action) => {
      state.hasPermission = action.payload;
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(detectCurrentLocation.pending, (state) => {
        state.isDetecting = true;
        state.error = null;
      })
      .addCase(detectCurrentLocation.fulfilled, (state, action) => {
        state.isDetecting = false;
        state.city = action.payload.city;
        state.coordinates = action.payload.coordinates;
        state.hasPermission = action.payload.hasPermission;
        state.error = null;
      })
      .addCase(detectCurrentLocation.rejected, (state, action) => {
        state.isDetecting = false;
        state.error = action.payload;
        state.hasPermission = false;
      });
  },
});

export const {
  setLocation,
  updateCity,
  updateCoordinates,
  clearLocationError,
  setLocationPermission
} = locationSlice.actions;

export default locationSlice.reducer;