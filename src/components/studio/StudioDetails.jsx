// components/studio/StudioDetails.jsx
"use client";
import { useQuery } from "@tanstack/react-query";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getStudioById } from "@/services/studio/studio.service";
import CalendarAvailability from "../Calender/CalendarAvailability";
import Reviews from "./Reviews";
import SimilarSpaces from "./SimilarSpaces";
import ServicesSection from "./ServicesSection";
import PackagesSection from "./PackagesSection";
import EquipmentSection from "../Equipment/EquipmentSection";
import HelpersSection from "./Helpers";
import Portfolio from "./Portfolio";
import Carousel from "../Carousel/Carousel";
import {
  Camera,
  MapPin,
  Star,
  Share,
  Heart,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Shield,
  Calendar,
} from "lucide-react";
import { useEntityReview } from "@/hooks/useMediaQueries";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAllBookingData,
  clearBookings,
  setEntityId,
} from "@/stores/bookingSlice";

// Custom Arrow Components for Slider
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
  >
    <ChevronRight className="w-5 h-5 text-gray-700" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
  >
    <ChevronLeft className="w-5 h-5 text-gray-700" />
  </button>
);

const StudioDetails = ({ studioId, initialData, entityType, entityId }) => {
  const [page, setPage] = useState(1);
  console.log("initialdata",initialData);

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const urlEntityType = searchParams.get("entityType");
  const urlEntityId = searchParams.get("entityId");

  const storedEntityId = useSelector((state) => state.booking.entityId);

  useEffect(() => {
    if (storedEntityId != urlEntityId) {
      dispatch(clearAllBookingData());
      dispatch(setEntityId(urlEntityId));
    }
  }, [urlEntityId, storedEntityId]);

  // Studio details query with initial SSR data
  const {
    data: studioResponse,
    isLoading: studioLoading,
    error,
  } = useQuery({
    queryKey: ["studioDetails", studioId],
    queryFn: () => getStudioById(studioId),
    initialData: initialData ? { studio: initialData } : undefined,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: reviews, isLoading } = useEntityReview(
    entityType,
    entityId,
    page
  );

  // Extract studio data from response
  const studio = studioResponse?.studio || studioResponse || initialData;
  console.log("studio ",studio );
  

  const sliderSettings = {
    dots: true,
    infinite: studio?.images?.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: studio?.images?.length > 1,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    nextArrow: studio?.images?.length > 1 ? <NextArrow /> : null,
    prevArrow: studio?.images?.length > 1 ? <PrevArrow /> : null,
    dotsClass: "slick-dots !bottom-4",
    customPaging: () => (
      <div className="w-3 h-3 bg-white/60 rounded-full hover:bg-white transition-colors duration-200" />
    ),
  };

  if (studioLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#892580] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading Studio Details
          </h3>
          <p className="text-gray-600">
            Please wait while we fetch the information...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Studio
          </h3>
          <p className="text-gray-600 mb-4">
            Failed to load studio details. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#892580] text-white rounded-md hover:bg-[#892580]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Studio Not Found
          </h3>
          <p className="text-gray-600">
            The studio you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const rating = reviews?.stats?.averageRating || 0;
  const reviewCount =
    studio?.stats?.totalReviews || studio?.reviews?.length || 0;
  const studioImages = studio?.images || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Carousel />

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with Studio Name and Actions */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {studio?.studioName || "Studio Name"}
              </h1>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">
                    {rating > 0 ? rating.toFixed(1) : "New"}
                  </span>
                  {reviewCount > 0 && (
                    <span className="text-gray-600">
                      ({reviewCount} reviews)
                    </span>
                  )}
                </div>
                {studio?.address && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {studio.address.city}, {studio.address.state}
                    </span>
                  </div>
                )}
                {studio?.isVerified && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Image Slider Section */}
        <section className="mb-12">
          <div className="relative">
            {/* Photo Count Badge */}
            <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">
                {studioImages.length} Photos
              </span>
            </div>

            {/* Image Slider */}
            <div className="rounded-2xl overflow-hidden shadow-lg bg-gray-200">
              {studioImages.length > 0 ? (
                <Slider {...sliderSettings}>
                  {studioImages.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="h-[400px] md:h-[500px] lg:h-[600px]">
                        <img
                          src={image}
                          alt={`${studio?.studioName} view ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/api/placeholder/800/600";
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No images available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Studio Description */}
            {studio?.studioDescription && (
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About This Studio
                </h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  {studio.studioDescription}
                </p>
              </section>
            )}

            {/* Services Section */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <ServicesSection partnerId={studioId} partnerType="studio" />
            </section>

            {/* Packages Section */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <PackagesSection partnerId={studioId} partnerType="studio" />
            </section>

            {/* Amenities and Location */}
            {/* <section className="bg-white rounded-xl border border-gray-200 p-6">
              <AmenitiesAndLocation studio={studio} />
            </section> */}

            {/* Equipment Section */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <EquipmentSection partnerId={studioId} partnerType="studio" />
            </section>

            {/* Helpers Section */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <HelpersSection partnerId={studioId} partnerType="studio" />
            </section>

            {/* Portfolio */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <Portfolio partnerId={initialData?.owner?.userId}/>
            </section>

            {/* Reviews */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              {reviews && (
                <Reviews
                  reviews={reviews}
                  currentPage={page}
                  onPageChange={setPage}
                />
              )}
            </section>

            {/* Similar Spaces */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <SimilarSpaces
                categoryId={studio?.category}
              />
            </section>
          </div>

          {/* Right Sidebar - 1/3 width */}
          <div className="lg:col-span-1">
            <div className=" top-8 space-y-6">
              <div className="">
                <CalendarAvailability
                  partnerType="studio"
                  key={`${urlEntityType}-${urlEntityId}`}
                  partnerId={studioId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx global>{`
        .slick-dots {
          display: flex !important;
          justify-content: center;
          gap: 8px;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .slick-dots li {
          margin: 0;
        }

        .slick-dots li button {
          font-size: 0;
          line-height: 0;
          display: block;
          width: 12px;
          height: 12px;
          padding: 0;
          cursor: pointer;
          color: transparent;
          border: 0;
          outline: none;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .slick-dots li.slick-active button {
          background: white;
          transform: scale(1.2);
        }

        .slick-dots li button:hover {
          background: white;
        }
      `}</style>
    </div>
  );
};

export default StudioDetails;
