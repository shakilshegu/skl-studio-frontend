// import React, { useState, useEffect } from 'react';
// import { MapPin, X, Search, Crosshair, CheckCircle } from 'lucide-react';

// const LocationSearchSelector = ({ onPositionChange, initialPosition }) => {

 
  
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [error, setError] = useState('');
//   const [scriptLoaded, setScriptLoaded] = useState(false);
  
//   // Load Google Places API script
//   useEffect(() => {
//     if (window.google && window.google.maps && window.google.maps.places) {
//       setScriptLoaded(true);
//       return;
//     }

//     const googlePlacesScript = document.getElementById('google-places-script');
//     if (googlePlacesScript) {
//       googlePlacesScript.addEventListener('load', () => setScriptLoaded(true));
//       return;
//     }

//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBeDqKxDDcHaQivzGpZLeyRjYjLTYwAYl0&libraries=places`;
//     script.id = 'google-places-script';
//     script.async = true;
//     script.onload = () => setScriptLoaded(true);
//     document.head.appendChild(script);
//   }, []);

//   // Initialize Autocomplete when script is loaded
//   useEffect(() => {
//     if (!scriptLoaded) return;
    
//     const searchInput = document.getElementById('location-search-input');
//     if (!searchInput) return;
    
//     try {
//       const autocomplete = new window.google.maps.places.Autocomplete(searchInput);
//       autocomplete.addListener('place_changed', () => {
//         const place = autocomplete.getPlace();
        
//         if (!place.geometry || !place.geometry.location) {
//           setError('No location information available for this place');
//           return;
//         }
        
//         const newPosition = {
//           lat: place.geometry.location.lat().toString(),
//           lng: place.geometry.location.lng().toString(),
//         };
        
//         const newSelectedLocation = {
//           description: place.formatted_address || place.name,
//           position: newPosition
//         };
        
//         setSelectedLocation(newSelectedLocation);
//         onPositionChange && onPositionChange(newPosition);
//         setSearchTerm(''); // Clear the search input
//         setError(''); // Clear any previous errors
//       });
//     } catch (error) {
//       console.error('Error initializing Google Places Autocomplete:', error);
//     }
//   }, [scriptLoaded, onPositionChange]);

//   const handleSearchInput = (e) => {
//     setSearchTerm(e.target.value);
//     setError(''); // Clear error when user starts typing
//   };

//   const useCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       setError('Geolocation is not supported by your browser');
//       return;
//     }
    
//     setIsLoading(true);
//     setError('');
    
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const currentPosition = {
//           lat: position.coords.latitude.toString(),
//           lng: position.coords.longitude.toString(),
//         };
        
//         // Get address for the location
//         if (window.google && window.google.maps && window.google.maps.Geocoder) {
//           const geocoder = new window.google.maps.Geocoder();
//           geocoder.geocode({ location: {
//             lat: parseFloat(currentPosition.lat),
//             lng: parseFloat(currentPosition.lng)
//           }}, (results, status) => {
//             if (status === 'OK' && results[0]) {
//               setSelectedLocation({
//                 description: results[0].formatted_address,
//                 position: currentPosition
//               });
//             } else {
//               setSelectedLocation({
//                 description: 'Current Location',
//                 position: currentPosition
//               });
//             }
//           });
//         } else {
//           setSelectedLocation({
//             description: 'Current Location',
//             position: currentPosition
//           });
//         }
        
//         onPositionChange && onPositionChange(currentPosition);
//         setIsLoading(false);
//       },
//       (error) => {
//         console.error('Error getting current location:', error);
//         setError('Could not determine your location. Please search for a location instead.');
//         setIsLoading(false);
//       },
//       { 
//         enableHighAccuracy: true, 
//         timeout: 15000, 
//         maximumAge: 0 
//       }
//     );
//   };

//   const clearSelection = () => {
//     setSelectedLocation(null);
//     setSearchTerm('');
//     setError('');
//   };

//   return (
//     <div className="space-y-4">   
//       {/* Search Section */}
//       <div className="space-y-3">
//         <div>
//           <div className="flex gap-2">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 id="location-search-input"
//                 placeholder="Enter location name, address, or area"
//                 value={searchTerm}
//                 onChange={handleSearchInput}
//                 autoComplete="off"
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-transparent transition-colors"
//               />
//             </div>
//             <button 
//               type="button"
//               onClick={useCurrentLocation}
//               disabled={isLoading}
//               className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
//             >
//               {isLoading ? (
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//               ) : (
//                 <Crosshair size={18} />
//               )}
//               <span className="hidden sm:inline">Current</span>
//             </button>
//           </div>
//         </div>
//       </div>
      
//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-start gap-3">
//             <div className="w-5 h-5 text-red-500 mt-0.5">⚠️</div>
//             <div>
//               <h4 className="text-sm font-medium text-red-800">Location Error</h4>
//               <p className="text-sm text-red-700 mt-1">{error}</p>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Selected Location Display */}
//       {selectedLocation && (
//         <div className="bg-green-50 border border-green-200 rounded-lg overflow-hidden">
//           <div className="bg-green-100 px-4 py-3 flex justify-between items-center">
//             <div className="flex items-center gap-2">
//               <CheckCircle className="text-green-600" size={18} />
//               <span className="font-medium text-green-800">Selected Location</span>
//             </div>
//             <button 
//               type="button" 
//               onClick={clearSelection}
//               className="p-1 text-green-600 hover:bg-green-200 rounded-full transition-colors"
//               aria-label="Clear selection"
//             >
//               <X size={18} />
//             </button>
//           </div>
//           <div className="p-4 space-y-3">
//             <div>
//               <p className="text-sm font-medium text-gray-700 mb-1">Address:</p>
//               <p className="text-gray-900 break-words">{selectedLocation.description}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-700 mb-1">Coordinates:</p>
//               <div className="flex flex-wrap gap-4 text-sm text-gray-600">
//                 <span className="flex items-center gap-1">
//                   <span className="font-medium">Lat:</span>
//                   {parseFloat(selectedLocation.position.lat).toFixed(6)}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <span className="font-medium">Lng:</span>
//                   {parseFloat(selectedLocation.position.lng).toFixed(6)}
//                 </span>
//               </div>
//             </div>
            
//             {/* Visual Location Indicator */}
//             <div className="pt-3 border-t border-green-200">
//               <div className="flex items-center gap-2 text-sm text-green-700">
//                 <MapPin size={16} />
//                 <span>Location has been set for your studio</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* No Location State */}
//       {!selectedLocation && !isLoading && (
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//           <div className="flex items-start gap-3">
//             <MapPin className="text-blue-500 mt-0.5" size={20} />
//             <div>
//               <h4 className="text-sm font-medium text-blue-800 mb-1">Location Selection</h4>
//               <p className="text-sm text-blue-700">
//                 Search for a location above or use your current location to set your studio's position on the map
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Loading State */}
//       {isLoading && (
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//           <div className="flex items-center gap-3">
//             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
//             <div>
//               <h4 className="text-sm font-medium text-yellow-800">Getting Your Location</h4>
//               <p className="text-sm text-yellow-700">Please wait while we determine your current position...</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LocationSearchSelector;


import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X, Search, Crosshair, CheckCircle } from 'lucide-react';

const LocationSearchSelector = ({ onPositionChange, initialPosition }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isGeocodingInitial, setIsGeocodingInitial] = useState(false);
  
  // Use refs to track if we've already processed the initial position
  const initialPositionProcessed = useRef(false);
  const lastInitialPosition = useRef(null);
  
  // Load Google Places API script
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      setScriptLoaded(true);
      return;
    }

    const googlePlacesScript = document.getElementById('google-places-script');
    if (googlePlacesScript) {
      googlePlacesScript.addEventListener('load', () => setScriptLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBeDqKxDDcHaQivzGpZLeyRjYjLTYwAYl0&libraries=places`;
    script.id = 'google-places-script';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Handle initial position - SIMPLIFIED DIRECT APPROACH
  useEffect(() => {
    if (!initialPosition || !scriptLoaded) return;
    
    const hasValidLat = initialPosition.lat && initialPosition.lat !== "" && !isNaN(initialPosition.lat);
    const hasValidLng = initialPosition.lng && initialPosition.lng !== "" && !isNaN(initialPosition.lng);
    
    if (!hasValidLat || !hasValidLng) return;
    
    // Check if this is the same initial position we already processed
    const currentPositionKey = `${initialPosition.lat}-${initialPosition.lng}`;
    const lastPositionKey = lastInitialPosition.current ? 
      `${lastInitialPosition.current.lat}-${lastInitialPosition.current.lng}` : null;
    
    if (initialPositionProcessed.current && currentPositionKey === lastPositionKey) {
      return;
    }
    
    const position = {
      lat: initialPosition.lat.toString(),
      lng: initialPosition.lng.toString(),
    };
    
    // Set initial location with loading state
    setSelectedLocation({
      description: 'Getting address...',
      position: position
    });
    
    // Mark as processed
    initialPositionProcessed.current = true;
    lastInitialPosition.current = initialPosition;
    setIsGeocodingInitial(true);
    
    // Direct geocoding approach
    if (window.google && window.google.maps && window.google.maps.Geocoder) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ 
        location: {
          lat: parseFloat(position.lat),
          lng: parseFloat(position.lng)
        }
      }, (results, status) => {
        setIsGeocodingInitial(false);
        
        if (status === 'OK' && results && results[0]) {
          setSelectedLocation({
            description: results[0].formatted_address,
            position: position
          });
        } else {
          setSelectedLocation({
            description: 'Studio Location',
            position: position
          });
        }
      });
    } else {
      // Fallback if geocoder not available
      setIsGeocodingInitial(false);
      setSelectedLocation({
        description: 'Studio Location',
        position: position
      });
    }
  }, [initialPosition, scriptLoaded]);

  // Initialize Autocomplete when script is loaded
  useEffect(() => {
    if (!scriptLoaded) return;
    
    const searchInput = document.getElementById('location-search-input');
    if (!searchInput) return;
    
    try {
      const autocomplete = new window.google.maps.places.Autocomplete(searchInput);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry || !place.geometry.location) {
          setError('No location information available for this place');
          return;
        }
        
        const newPosition = {
          lat: place.geometry.location.lat().toString(),
          lng: place.geometry.location.lng().toString(),
        };
        
        const newSelectedLocation = {
          description: place.formatted_address || place.name,
          position: newPosition
        };
        
        setSelectedLocation(newSelectedLocation);
        
        // Reset the processed flag since user manually selected a location
        initialPositionProcessed.current = false;
        
        onPositionChange && onPositionChange(newPosition);
        setSearchTerm('');
        setError('');
      });
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
    }
  }, [scriptLoaded, onPositionChange]);

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
    setError('');
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentPosition = {
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString(),
        };
        
        // Reset the processed flag since user manually got current location
        initialPositionProcessed.current = false;
        
        // Direct geocoding - exactly as you suggested
        if (window.google && window.google.maps && window.google.maps.Geocoder) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ 
            location: {
              lat: parseFloat(currentPosition.lat),
              lng: parseFloat(currentPosition.lng)
            }
          }, (results, status) => {
            if (status === 'OK' && results[0]) {
              setSelectedLocation({
                description: results[0].formatted_address,
                position: currentPosition
              });
            } else {
              setSelectedLocation({
                description: 'Current Location',
                position: currentPosition
              });
            }
            setIsLoading(false);
          });
        } else {
          // Fallback if geocoder not available
          setSelectedLocation({
            description: 'Current Location',
            position: currentPosition
          });
          setIsLoading(false);
        }
        
        onPositionChange && onPositionChange(currentPosition);
      },
      (error) => {
        console.error('Error getting current location:', error);
        setError('Could not determine your location. Please search for a location instead.');
        setIsLoading(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 0 
      }
    );
  };

  const clearSelection = () => {
    setSelectedLocation(null);
    setSearchTerm('');
    setError('');
    setIsGeocodingInitial(false);
    initialPositionProcessed.current = false;
  };

  return (
    <div className="space-y-4">   
      {/* Search Section */}
      <div className="space-y-3">
        <div>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                id="location-search-input"
                placeholder="Enter location name, address, or area"
                value={searchTerm}
                onChange={handleSearchInput}
                autoComplete="off"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#892580] focus:border-transparent transition-colors"
              />
            </div>
            <button 
              type="button"
              onClick={useCurrentLocation}
              disabled={isLoading}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Crosshair size={18} />
              )}
              <span className="hidden sm:inline">Current</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 text-red-500 mt-0.5">⚠️</div>
            <div>
              <h4 className="text-sm font-medium text-red-800">Location Error</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg overflow-hidden">
          <div className="bg-green-100 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-600" size={18} />
              <span className="font-medium text-green-800">Selected Location</span>
              {isGeocodingInitial && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
              )}
            </div>
            <button 
              type="button" 
              onClick={clearSelection}
              className="p-1 text-green-600 hover:bg-green-200 rounded-full transition-colors"
              aria-label="Clear selection"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Address:</p>
              <p className="text-gray-900 break-words">
                {selectedLocation.description}
                {isGeocodingInitial && (
                  <span className="text-sm text-gray-500 ml-2">(Loading...)</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Coordinates:</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="font-medium">Lat:</span>
                  {parseFloat(selectedLocation.position.lat).toFixed(6)}
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-medium">Lng:</span>
                  {parseFloat(selectedLocation.position.lng).toFixed(6)}
                </span>
              </div>
            </div>
            
            {/* Visual Location Indicator */}
            <div className="pt-3 border-t border-green-200">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <MapPin size={16} />
                <span>Location has been set for your studio</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* No Location State */}
      {!selectedLocation && !isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapPin className="text-blue-500 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-1">Location Selection</h4>
              <p className="text-sm text-blue-700">
                Search for a location above or use your current location to set your studio's position on the map
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Getting Your Location</h4>
              <p className="text-sm text-yellow-700">Please wait while we determine your current position...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearchSelector;