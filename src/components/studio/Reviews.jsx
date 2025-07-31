import { Star, User } from "lucide-react";
import moment from "moment";

export default function Reviews({ reviews, currentPage, onPageChange }) {
  const totalPages = reviews?.pagination?.totalPages || 1;
  const currentReviews = reviews?.reviews || [];

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Helper function to render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }
            fill={star <= rating ? "currentColor" : "none"}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">
          ({rating}/5)
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Reviews</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#892580] to-purple-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4">
            See what our customers have to say about their experiences
          </p>
        </div>

        {/* Reviews Count */}
        {currentReviews.length > 0 && (
          <div className="mb-8">
            <p className="text-lg text-gray-700">
              Showing <span className="font-semibold">{currentReviews.length}</span> of{" "}
              <span className="font-semibold">{reviews?.pagination?.totalReviews || currentReviews.length}</span> reviews
            </p>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4 mb-8">
          {currentReviews.length > 0 ? (
            currentReviews.map((review, index) => (
              <div 
                key={review?._id} 
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-5">
                  {/* User Info and Rating Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* User Avatar */}
                      <div className="w-10 h-10 bg-gradient-to-br from-[#892580] to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {review?.user?.email?.split('@')[0].charAt(0)?.toUpperCase() || <User size={16} />}
                      </div>
                      
                      {/* User Details */}
                      <div>
                        <h3 className="font-semibold text-base text-gray-800">
                          {review?.user?.email?.split('@')[0] || "Anonymous User"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {moment(review?.createdAt).format("MMM DD, YYYY")}
                        </p>
                      </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-yellow-700 text-sm">{review?.rating}</span>
                    </div>
                  </div>

                  {/* Star Rating Display */}
                  <div className="mb-3">
                    {renderStars(review?.rating || 0)}
                  </div>

                  {/* Review Title */}
                  {review?.title && (
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {review.title}
                    </h4>
                  )}

                  {/* Review Content */}
                  <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#892580]">
                    <p className="text-gray-700 leading-relaxed text-base">
                      "{review?.review || "No review text provided."}"
                    </p>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                    <span>Review #{index + 1 + (currentPage - 1) * 10}</span>
                    <span>•</span>
                    <span>Verified Purchase</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* No Reviews State */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No Reviews Yet</h3>
              <p className="text-gray-500">Be the first to share your experience!</p>
            </div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-center items-center gap-3">
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-gray-700"
              >
                <span>◀</span>
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  const isCurrentPage = currentPage === pageNum;
                  
                  // Show first page, last page, current page, and pages around current
                  const shouldShow = 
                    pageNum === 1 || 
                    pageNum === totalPages || 
                    Math.abs(pageNum - currentPage) <= 1;

                  if (!shouldShow && pageNum !== 2 && pageNum !== totalPages - 1) {
                    // Show ellipsis
                    if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return (
                        <span key={pageNum} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                        isCurrentPage
                          ? "bg-[#892580] text-white shadow-lg scale-110"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-gray-700"
              >
                <span className="hidden sm:inline">Next</span>
                <span>▶</span>
              </button>
            </div>

            {/* Page Info */}
            <div className="text-center mt-4 text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}