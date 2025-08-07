"use client";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Heart,
  Briefcase,
  Star,
  Share,
  User,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Award,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Carousel from "../../components/Carousel/Carousel";
import Reviews from "../../components/Freelancers/Reviews";
import SimilarFreelancer from "../../components/Freelancers/SimilarFreelancer";
import ServicesSection from "../../components/studio/ServicesSection";
import PackagesSection from "../../components/studio/PackagesSection";
import EquipmentSection from "../../components/Equipment/EquipmentSection";
import HelpersSection from "../../components/studio/Helpers";
import CalendarAvailability from "@/components/Calender/CalendarAvailability";
import { getFreelancerById } from "@/services/Freelancer/freelancer.service";
import { useEntityReview } from "@/hooks/useMediaQueries";
import { useDispatch, useSelector } from "react-redux";
import { clearAllBookingData, clearBookings, setEntityId } from "@/stores/bookingSlice";
import Portfolio from "../studio/Portfolio";


const FreelancerDetails = ({
  freelancerId,
  initialData,
  entityType,entityId
}) => {

  const {
    data: freelancerResponse,
    isLoading: freelancerLoading,
    error,
  } = useQuery({
    queryKey: ["freelancerDetails", freelancerId],
    queryFn: () => getFreelancerById(freelancerId),
    initialData: initialData ? { freelancer: initialData } : undefined,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
console.log("initialdata",initialData);

    const [page, setPage] = useState(1);
   const { data: reviews, isLoading } = useEntityReview(entityType, entityId, page); 

   const dispatch = useDispatch()
    const searchParams = useSearchParams();
    const urlEntityType = searchParams.get("entityType");
    const urlEntityId = searchParams.get("entityId");

  const storedEntityId = useSelector(state => state.booking.entityId);

  

     useEffect(()=>{

      if(storedEntityId!=urlEntityId){
        
        dispatch(clearAllBookingData())
        dispatch(setEntityId(urlEntityId));
      }

     },[urlEntityId,storedEntityId])



  // Extract freelancer data from response
  const freelancer =
    freelancerResponse?.freelancer || freelancerResponse || initialData;

    

  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  // Format categories for display
  const formatCategories = () => {
     if (!freelancer?.categories || freelancer.categories.length === 0) {
        return "Photography";
    }
    return freelancer.categories.map(cat => cat.name).join(", ");
  };

  // Calculate rating and reviews
  const rating = freelancer?.averageRating || 0;
  const reviewCount =
    freelancer?.reviewCount || freelancer?.reviews?.length || 0;

  if (freelancerLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#892580] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading Freelancer Details
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
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Freelancer
          </h3>
          <p className="text-gray-600 mb-4">
            Failed to load freelancer details. Please try again.
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

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Freelancer Not Found
          </h3>
          <p className="text-gray-600">
            The freelancer you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Carousel />

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Navigation */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <button
              className="flex items-center gap-2 text-[#892580] hover:text-[#892580] font-medium transition-colors"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Freelancers
            </button>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-[#892580]" />
                <span className="text-sm">
                  {freelancer?.location || "Location not available"}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-[#892580]">
                  ₹{freelancer?.pricePerHour?.toLocaleString("en-IN") || "999"}
                  <span className="text-sm text-gray-500 font-normal">/hr</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Slider Section */}
        <section className="mb-12">
          <div className="relative">
            {/* Main Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg bg-gray-200 relative"></div>

            {/* Profile Image Overlay */}
            <div className="absolute -bottom-12 left-8">
              <div className="relative">
                <img
                  src={freelancer?.profileImage || images[0]}
                  alt={`${freelancer?.name || "Freelancer"} profile`}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/96/96";
                  }}
                />
                {freelancer?.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                    <Award className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
          {/* Left Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Freelancer Info */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-2">
                    {freelancer?.name || "Freelancer Name"}
                  </h1>
                  <p className="text-xl text-[#892580] font-semibold mb-3">
                    {formatCategories()}
                  </p>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span className="font-medium">
                        {freelancer?.experience || 0} Years Experience
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900">
                        {rating > 0 ? rating.toFixed(1) : "New"}
                      </span>
                      {reviewCount > 0 && (
                        <span className="text-gray-600">
                          ({reviewCount} reviews)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  About
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {freelancer?.description || "No description available."}
                </p>
              </div>
            </section>

            {/* Services Section */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <ServicesSection
                partnerId={freelancerId}
                partnerType="freelancer"
              />
            </section>

            {/* Packages Section */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <PackagesSection
                partnerId={freelancerId}
                partnerType="freelancer"
              />
            </section>

            {/* Equipment Section */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <EquipmentSection
                partnerId={freelancerId}
                partnerType="freelancer"
              />
            </section>

            {/* Helpers Section */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <HelpersSection
                partnerId={freelancerId}
                partnerType="freelancer"
              />
            </section>

            {/* Portfolio */}
                <section className="bg-white rounded-xl border border-gray-200 p-6">
              <Portfolio partnerId={initialData?.user}/>
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

            {/* Similar Freelancers */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <SimilarFreelancer
                categoryId={freelancer?.categories?.[0]?._id}
              />
            </section>
          </div>

          {/* Right Sidebar - 1/3 width */}
          <div className="lg:col-span-1">
            <div className=" top-8 space-y-6">
              {/* Booking Section */}

              <div className=" ">
                <CalendarAvailability
                  partnerType="freelancer"
                  key={`${urlEntityType}-${urlEntityId}`}
                  partnerId={freelancerId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDetails;
