

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
