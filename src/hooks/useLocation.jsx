// hooks/useLocation.js
import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import {
  setLocation,
  updateCity,
  updateCoordinates,
  detectCurrentLocation,
  clearLocationError,
  setLocationPermission
} from '@/stores/locationSlice';

// Main location hook
export const useLocation = () => {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.location);

  // Auto-detect location on first load if no permission granted
  useEffect(() => {
    if (!location.hasPermission && !location.isDetecting && location.city === 'Hyderabad') {
      dispatch(detectCurrentLocation());
    }
  }, [dispatch, location.hasPermission, location.isDetecting, location.city]);

  const updateLocation = useCallback((city, coordinates = null) => {
    if (coordinates) {
      dispatch(setLocation({ city, coordinates }));
    } else {
      dispatch(updateCity(city));
    }
  }, [dispatch]);

  const detectLocation = useCallback(() => {
    dispatch(detectCurrentLocation());
  }, [dispatch]);

  const updateLocationCoordinates = useCallback((coordinates) => {
    dispatch(updateCoordinates(coordinates));
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearLocationError());
  }, [dispatch]);

  return {
    // Current location data
    currentLocation: {
      city: location.city,
      coordinates: location.coordinates,
      isDetecting: location.isDetecting,
      error: location.error,
      hasPermission: location.hasPermission
    },
    
    // Actions
    updateLocation,
    detectCurrentLocation: detectLocation,
    updateCoordinates: updateLocationCoordinates,
    clearLocationError: clearError,
    
    // Computed values
    isLocationReady: !location.isDetecting && location.coordinates,
    isDetecting: location.isDetecting
  };
};

// Hook for location-based API calls
export const useLocationAPI = () => {
  const { currentLocation, isLocationReady } = useLocation();

  const fetchLocationData = useCallback(async (endpoint, additionalParams = {}) => {
    if (!currentLocation.coordinates) {
      throw new Error('Location not available');
    }

    const params = {
      city: currentLocation.city,
      lat: currentLocation.coordinates.lat,
      lng: currentLocation.coordinates.lng,
      ...additionalParams
    };

    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  }, [currentLocation]);

  const fetchNearbyData = useCallback(async (endpoint, radius = 25, additionalParams = {}) => {
    return fetchLocationData(endpoint, { radius, ...additionalParams });
  }, [fetchLocationData]);

  return {
    currentLocation,
    fetchLocationData,
    fetchNearbyData,
    isLocationReady
  };
};

// Hook for nearby services with caching
export const useNearbyServices = (endpoint, options = {}) => {
  const { 
    radius = 25, 
    autoFetch = true, 
    refreshInterval = null 
  } = options;
  
  const { fetchNearbyData, isLocationReady, currentLocation } = useLocationAPI();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!isLocationReady) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchNearbyData(endpoint, radius);
      setData(result.data || result || []);
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  }, [fetchNearbyData, endpoint, radius, isLocationReady]);

  // Auto-fetch when location is ready
  useEffect(() => {
    if (autoFetch && isLocationReady) {
      fetchData();
    }
  }, [autoFetch, isLocationReady, fetchData]);

  // Refresh interval
  useEffect(() => {
    if (refreshInterval && isLocationReady) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, isLocationReady, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    currentLocation,
    isLocationReady
  };
};

// Hook for distance calculations
export const useDistanceCalculator = () => {
  const { currentLocation } = useLocation();

  const calculateDistance = useCallback((lat2, lng2) => {
    if (!currentLocation.coordinates) return null;
    
    const { lat: lat1, lng: lng1 } = currentLocation.coordinates;
    
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }, [currentLocation.coordinates]);

  const sortByDistance = useCallback((items, getLatLng) => {
    if (!currentLocation.coordinates) return items;
    
    return [...items].sort((a, b) => {
      const { lat: latA, lng: lngA } = getLatLng(a);
      const { lat: latB, lng: lngB } = getLatLng(b);
      
      const distanceA = calculateDistance(latA, lngA);
      const distanceB = calculateDistance(latB, lngB);
      
      return (distanceA || Infinity) - (distanceB || Infinity);
    });
  }, [calculateDistance]);

  return {
    calculateDistance,
    sortByDistance,
    currentLocation
  };
};