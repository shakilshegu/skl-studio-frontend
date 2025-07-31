import React from "react";
import AmenitiesIcon from '../../../public/Assets/studio/AmenitiesIcon'

const AmenityItem = ({ label }) => (
  <div className="flex items-center gap-1 text-xs">
    <span className="material-icons text-gray-500"><AmenitiesIcon/></span>
    {label}
  </div>
);

const Amenities = () => {
  const amenities = [
    "Camera Setup",
    "Free Parking",
    "Wifi",
    "Rest Rooms",
    "Waiting Hall",
    "Power Backup",
    "AC",
  ];

  return (
    <div className="flex-1">
      <h2 className=" font-bold text-2xl md:text-3xl lg:text-4xl leading-10 tracking-normal mb-3">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((amenity, index) => (
          <AmenityItem key={index} label={amenity} />
        ))}
      </div>
    </div>
  );
};

const Location = () => (
  <div className="flex-1">
    <h2 className=" font-bold text-2xl md:text-3xl lg:text-4xl leading-10 tracking-normal mb-4">Location</h2>
    <div className="rounded-lg overflow-hidden shadow-md">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.7670672879426!2d78.3794364!3d17.4447744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93e666600001%3A0x6eae5fcb401cba36!2sCyber%20Towers!5e0!3m2!1sen!2sin!4v1670442593341!5m2!1sen!2sin"
        width="100%"
        height="200"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full"
      ></iframe>
    </div>
  </div>
);

const AmenitiesAndLocation = () => (
    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 px-6 py-4">
    <div className="flex-1 flex flex-col justify-center">
      <Amenities />
    </div>
    <div className="flex-1 flex flex-col justify-center">
      <Location />
    </div>
  </div>
  
);

export default AmenitiesAndLocation;
