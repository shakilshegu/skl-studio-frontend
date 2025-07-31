import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Group from "../../../public/Assets/svg/Group";
import Minus from "@/assets/studio/Minus";
import Positive from "@/assets/studio/Positive";
import { useQuery } from "@tanstack/react-query";
import { getStudioServices} from "@/services/studio/studio.service";

import { useDispatch, useSelector } from "react-redux";
import { updateService } from "@/stores/bookingSlice";
import { getFreelancerServices } from "@/services/Freelancer/freelancer.service";

const bok1 = "/Assets/bok1.png"; // Default image as fallback

const ServiceCard = ({ service }) => {
  const dispatch = useDispatch();
  
  // Get services from Redux state
  const cartServices = useSelector(state => state.booking.services || {});
  
  // Get the count for this specific service
  const serviceCount = cartServices[service._id]?.count || 0;
  const isSelected = serviceCount > 0;

  const handleAddToCart = () => {
    dispatch(updateService({ id: service._id, change: 1 }));
  };

  const handleIncrease = () => {
    dispatch(updateService({ id: service._id, change: 1 }));
  };

  const handleDecrease = () => {
    dispatch(updateService({ id: service._id, change: -1 }));
  };

  return (
    <div className="p-2">
      <div className="bg-white shadow-md rounded-lg overflow-hidden border h-full flex flex-col">
        <div className="h-48 overflow-hidden">
          <img 
            src={service.photo || bok1} 
            alt={service.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = bok1; // Fallback to default image if the service image fails to load
            }}
          />
        </div>
        <div className="px-4 flex-grow flex flex-col">
          <div className="text-md font-semibold mt-2 text-gray-900 truncate w-full overflow-hidden whitespace-nowrap">
            {service.name}
          </div>
          <p className="text-gray-500 text-sm mt-2 line-clamp-2">
            {service.description}
          </p>
          <p className="text-600 text-[#892580] font-bold text-lg mt-2">
            ₹ {service.price.toLocaleString('en-IN')}
          </p>
          
          <div className="mt-auto mb-2">
            {isSelected ? (
              <div className="flex items-center justify-center border-t-2 border-gray-200 gap-4 mt-2 pt-2">
                <button
                  onClick={handleDecrease}
                  className="w-6 h-6 flex items-center justify-center text-lg text-blue-800 bg-blue-50 rounded-full hover:bg-blue-100"
                >
                  <Minus />
                </button>
                <span className="px-6 py-2 text-lg text-blue-600 font-medium">
                  {serviceCount}
                </span>
                <button
                  onClick={handleIncrease}
                  className="w-6 h-6 flex items-center justify-center text-lg text-blue-800 bg-blue-50 rounded-full hover:bg-blue-100"
                >
                  <Positive />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full py-2 px-4 border-t-2 border-gray-200 text-[#892580] text-600 flex items-center justify-center mt-2"
              >
                <span className="material-icons mr-2">
                  <Group />
                </span> Add To Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesSection = ({ partnerId, partnerType = "studio" }) => {
  // Fetch services data based on partner type
  const { data: servicesData, isLoading, isError } = useQuery({
    queryKey: ["services", partnerId, partnerType],
    queryFn: () => {
      // Use the appropriate service fetch method based on partner type
      return partnerType === "studio" 
        ? getStudioServices(partnerId) 
        : getFreelancerServices(partnerId);
    },
    select: data => data?.services || [] // Extract services array from the response
  });
  
  const services = servicesData || [];

  let sliderRef;

  const settings = {
    infinite: services.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, services.length), // Prevent showing more slides than we have
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    appendDots: (dots) => (
      <div>
        <ul className="flex justify-center space-x-2 mt-3">{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div className="w-3 h-3 bg-gray-400 rounded-full transition-all duration-300 hover:bg-gray-600"></div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(2, services.length) },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  // Display a loading state
  if (isLoading) {
    return (
      <div className="py-8">
        <p className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 tracking-normal mb-3">
          Services
        </p>
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#892580]"></div>
          <p className="mt-2 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }
  // Display an error state
  if (isError) {
    return (
      <div className="py-8 text-center">
        <p className="text-lg text-red-500">Failed to load services. Please try again later.</p>
      </div>
    );
  }

  // Display an empty state
  if (services.length === 0) {
    return (
      <div className="py-8">
        <p className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 tracking-normal mb-2">Services</p>
        <p className="text-md text-gray-600 mt-4">No services available for this {partnerType} yet.</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <p className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 tracking-normal mb-2">Services</p>
        <p className="text-sm text-gray-600 mt-2">
          Please select the Service is required
        </p>
      </div>
      <div className="relative">
        {/* Left Arrow - only if we have more than 1 service */}
        {services.length > 1 && (
          <button
            className="absolute left-[0px] md:left-[8px] top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-r-lg shadow-lg hover:bg-gray-100 hover:scale-110 transition-all"
            onClick={() => sliderRef.slickPrev()}
          >
            <FaChevronLeft size={24} />
          </button>
        )}

        <Slider ref={(slider) => (sliderRef = slider)} {...settings}>
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </Slider>

        {/* Right Arrow - only if we have more than 1 service */}
        {services.length > 1 && (
          <button
            className="absolute right-[0] md:right-[6px] top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-l-lg shadow-lg hover:bg-gray-100 hover:scale-110 transition-all"
            onClick={() => sliderRef.slickNext()}
          >
            <FaChevronRight size={24} />
          </button>
        )}
      </div>
    </>
  );
};

export default ServicesSection;