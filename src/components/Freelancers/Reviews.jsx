"use client";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";

export default function Reviews({ reviews,currentPage, onPageChange}) {
 
  const totalPages = reviews?.pagination?.totalPages || 1;
  const currentReviews = reviews?.reviews || [];

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <>
            <div className="p-4 max-w-5xl mx-auto">
      {currentReviews.map((review) => (
        <div key={review?._id} className="bg-white">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <div className="font-semibold">{review?.user?.name}</div>
              <div className="text-sm text-gray-500">
                {moment(review?.createdAt).format("DD-MM-YYYY")}
              </div>
            </div>
          </div>
          <div className="shadow-md rounded-xl p-4 mb-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2 text-green-600">
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 flex items-center gap-1">
                <Star size={14} fill="currentColor" /> {review?.rating}

              </span>
              <div className="font-semibold text-black">{review?.title}</div>
            </div>
            <p className="text-gray-700">{review?.review}</p>
          </div>
        </div>
      ))}

                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className="border rounded-full p-2 disabled:opacity-50"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => onPageChange(index + 1)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentPage === index + 1
                                ? "bg-600 bg-[#892580] text-white"
                                : "bg-gray-100 text-gray-700"
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="border rounded-full p-2 disabled:opacity-50"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </>
    );
}
