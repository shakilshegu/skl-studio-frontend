// "use client";
// import React, { useState, useEffect, useRef, useCallback } from 'react';

// const GooglePlacesAutocomplete = ({ 
//   value = "", // Default to empty string
//   onChange, 
//   onCoordinates,
//   placeholder = "Search for a city", 
//   debounceTime = 300, 
//   className 
// }) => {
//   // Initialize with the value prop, ensuring it's always a string
//   const [inputValue, setInputValue] = useState(value || "");
//   const [scriptLoaded, setScriptLoaded] = useState(false);
//   const inputRef = useRef(null);
//   const autocompleteRef = useRef(null);
//   const apiCallCount = useRef(0);

//   // Single useEffect to handle value prop changes
// const prevValueRef = useRef(value);
// useEffect(() => {
//   if (prevValueRef.current !== value) {
//     prevValueRef.current = value;
//     setInputValue(value || "");
//   }
// }, [value]);


//   // Load Google Maps script
//   useEffect(() => {
//     const checkGoogleMaps = () => {
//       if (window.google && window.google.maps && window.google.maps.places) {
//         setScriptLoaded(true);
//         return;
//       }

//       const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
//       if (existingScript) {
//         existingScript.onload = () => setScriptLoaded(true);
//         return;
//       }

//       const script = document.createElement('script');
//       script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBeDqKxDDcHaQivzGpZLeyRjYjLTYwAYl0&libraries=places`;
//       script.async = true;
//       script.defer = true;
//       script.onload = () => setScriptLoaded(true);
//       script.onerror = () => console.error('Google Maps script failed to load');
//       document.head.appendChild(script);
//     };

//     checkGoogleMaps();
//   }, []);

//   // Debounced input change handler
//   const debouncedOnChange = useCallback(
//     debounce((inputValue) => {
//       apiCallCount.current += 1;
//       console.log(`API called from debounce: ${apiCallCount.current} times`);
      
//       // When user types manually, send just the string (no coordinates)
//       onChange(inputValue);
//     }, debounceTime),
//     [onChange, debounceTime]
//   );

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const newValue = e.target.value;
//     setInputValue(newValue);
//     debouncedOnChange(newValue);
//   };

//   // Initialize Google Places Autocomplete
//   useEffect(() => {
//     if (!scriptLoaded || !inputRef.current) return;

//     if (autocompleteRef.current) {
//       window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
//     }

//     try {
//       autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
//         types: ['(cities)'],
//         fields: ['address_components', 'geometry', 'name', 'formatted_address', 'place_id']
//       });
//       console.log("Autocomplete initialized on", inputRef.current);

//       // Set up place_changed event listener
//       autocompleteRef.current.addListener('place_changed', () => {
//         const place = autocompleteRef.current.getPlace();

//         console.log(place,"ppppppppp");
        

//         if (place && (place.address_components || place.name)) {
//           let city = '';
//           let state = '';
//           let formattedLocation = '';

//           // Extract city and state from address components if available
//           if (place.address_components) {
//             place.address_components.forEach(component => {
//               if (component.types.includes('locality')) {
//                 city = component.long_name;
//               } else if (component.types.includes('administrative_area_level_1')) {
//                 state = component.short_name; 
//               }
//             });
            
//             formattedLocation = city && state ? `${city}, ${state}` : (place.formatted_address || place.name || "");
//           } else {
//             formattedLocation = place.name || place.formatted_address || "";
//           }

//           // Get coordinates
//           let lat = null;
//           let lng = null;
          
//           if (place.geometry && place.geometry.location) {
//             if (typeof place.geometry.location.lat === 'function') {
//               lat = place.geometry.location.lat();
//               lng = place.geometry.location.lng();
//             } else {
//               lat = place.geometry.location.lat;
//               lng = place.geometry.location.lng;
//             }
//           }
//           console.log(formattedLocation,"frmmmmmm");

//           setInputValue(formattedLocation);
          
//           apiCallCount.current += 1;

          
//           // Send location string to onChange
//           if (onChange && formattedLocation) {
//   onChange(formattedLocation);
// }

          
//           // Send coordinates separately to onCoordinates
// if (onCoordinates && lat !== null && lng !== null) {
//   onCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
// }

//         }
//       });

//     } catch (error) {
//       console.error('Error initializing Google Places Autocomplete:', error);
//     }

//     return () => {
//       if (autocompleteRef.current) {
//         window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
//       }
//     };
//   }, [scriptLoaded, onChange, onCoordinates]);

//   if (!scriptLoaded) {
//     return (
//       <input
//         type="text"
//         className={className}
//         placeholder="Loading Google Places..."
//         disabled
//         value=""
//         readOnly
//       />
//     );
//   }

//   return (
//     // <input
//     //   ref={inputRef}
//     //   type="text"
//     //   className={className}
//     //   placeholder={placeholder}
//     //   value={inputValue}
//     //   onChange={handleInputChange}
//     //   autoComplete="off"
//     // />
 
// <input
//   ref={inputRef}
//   type="text"
//   className={className}
//   placeholder={placeholder}
//   onChange={handleInputChange} // optional
//   autoComplete="off"
// />



//   );
// };

// // Debounce utility function
// function debounce(func, wait) {
//   let timeout;
//   return function executedFunction(...args) {
//     const later = () => {
//       clearTimeout(timeout);
//       func(...args);
//     };
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//   };
// }

// export default GooglePlacesAutocomplete;

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const GooglePlacesAutocomplete = ({
  value = "",
  onChange,
  onCoordinates,
  // onCoordinates,
  placeholder = "Search for a city",
  debounceTime = 300,
  className,
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Sync with external value
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Load Google Maps JS API using @googlemaps/js-api-loader
  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyBeDqKxDDcHaQivzGpZLeyRjYjLTYwAYl0",
      libraries: ["places"],
    });

    loader
      .load()
      .then(() => {
        setScriptLoaded(true);
        console.log("Google Maps script loaded");
      })
      .catch((err) => {
        console.error("Google Maps failed to load:", err);
      });
  }, []);

  // Debounce utility
  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedOnChange = useCallback(
    debounce((val) => {
      if (onChange) onChange(val);
    }, debounceTime),
    [onChange, debounceTime]
  );

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    debouncedOnChange(val);
  };

  // Initialize Autocomplete once script is loaded
  useEffect(() => {
    if (!scriptLoaded || !inputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["(cities)"],
        fields: ["address_components", "geometry", "name", "formatted_address", "place_id"],
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      console.log("Selected Place:", place);

      let city = "";
      let state = "";
      if (place.address_components) {
        place.address_components.forEach((component) => {
          if (component.types.includes("locality")) city = component.long_name;
          if (component.types.includes("administrative_area_level_1")) state = component.short_name;
        });
      }

      const formatted = city && state ? `${city}, ${state}` : place.name || place.formatted_address || "";
      setInputValue(formatted);

      if (onChange) onChange(formatted);

      const lat = place.geometry?.location?.lat?.();
      const lng = place.geometry?.location?.lng?.();
      if (lat && lng && onCoordinates) {
        onCoordinates({ lat, lng });
      }
      if (typeof onCoordinates === "function") {        
  onCoordinates({ lat, lng }, formatted);
}

    });
  }, [scriptLoaded]);

  // 🌀 Loader while script is loading
  if (!scriptLoaded) {
    return (
      <div className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-2xl flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#892580] border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-sm text-gray-500">Loading Places...</span>
      </div>
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      className={className}
      placeholder={placeholder}
      value={inputValue}
      onChange={handleInputChange}
      autoComplete="off"
    />
  );
};

export default GooglePlacesAutocomplete;
