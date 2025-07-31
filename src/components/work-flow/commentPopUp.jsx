import { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  MessageSquare,
  Loader2,
  Edit3,
  Clock,
  User,
  Bot
} from "lucide-react";
import moment from "moment";

export default function CommentPopup({
  isOpen,
  onClose,
  file,
  fileComments = [],
  commentsLoading = false,
  role,
  onAddComment,
  isAddingComment = false,
  activeTab,
}) {


  
  const [comment, setComment] = useState("");
  const [isEditRequest, setIsEditRequest] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const commentsScrollRef = useRef(null);

  // Check if user is at bottom of scroll
  const checkScrollPosition = () => {
    if (commentsScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = commentsScrollRef.current;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 5; // 5px threshold
      setIsAtBottom(atBottom);
    }
  };

  // Auto-scroll to bottom when comments change or component opens
  useEffect(() => {
    if (commentsScrollRef.current && fileComments.length > 0) {
      const scrollElement = commentsScrollRef.current;
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [fileComments.length, isOpen]);

  // Auto-scroll after adding a comment
  useEffect(() => {
    if (!isAddingComment && commentsScrollRef.current) {
      const scrollElement = commentsScrollRef.current;
      setTimeout(() => {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [isAddingComment]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (commentsScrollRef.current) {
      commentsScrollRef.current.scrollTo({
        top: commentsScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    try {
      await onAddComment({
        fileId: file?._id,
        commentText: comment,
        isEditRequest,
      });

      setComment("");
      setIsEditRequest(false);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Group comments by date
  const groupedComments = fileComments.reduce((groups, comment) => {
    const date = moment(comment.createdAt).format('YYYY-MM-DD');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(comment);
    return groups;
  }, {});

  const formatDate = (dateString) => {
    const date = moment(dateString);
    const today = moment();
    const yesterday = moment().subtract(1, 'day');

    if (date.isSame(today, 'day')) {
      return "Today";
    } else if (date.isSame(yesterday, 'day')) {
      return "Yesterday";
    } else {
      return date.format('MMMM D, YYYY');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#892580] rounded-lg flex items-center justify-center">
                <MessageSquare size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
                <p className="text-sm text-gray-600 truncate max-w-48">
                  {file?.originalFilename || "Untitled File"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div 
          ref={commentsScrollRef}
          className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-0"
          onScroll={checkScrollPosition}
        >
          {commentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : fileComments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-purple-500" />
              </div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">No comments yet</h4>
              <p className="text-gray-500 text-sm">Be the first to leave a comment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedComments).map(([date, comments]) => (
                <div key={date}>
                  {/* Date Header */}
                  <div className="flex justify-center mb-4">
                    <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
                      {formatDate(date)}
                    </span>
                  </div>

                  {/* Comments for this date */}
                  <div className="space-y-3">
                    {comments.map((comment) => {
                      return (
                        <div key={comment._id} className="space-y-1">
                          <div
                            className={`flex ${
                              comment.commenterType == role ? "justify-end" : "justify-start"
                            }`}
                          >

                           { console.log(comment.commenterType,"=========",role)}
                            
                            <div className={`max-w-[80%] ${
                              comment.commenterType == role
                                ? 'bg-[#d042c4] text-white rounded-t-2xl rounded-bl-2xl shadow-sm'
                                : 'bg-white text-gray-800 rounded-t-2xl rounded-br-2xl shadow-sm border border-gray-200'
                            } px-4 py-3`}>

                              {/* Comment Text */}
                              <p className="text-sm leading-relaxed">{comment.commentText}</p>

                              {/* Edit Request Badge */}
                              {comment.isEditRequest && (
                                <div className={`flex items-center space-x-1 mt-2 px-2 py-1 rounded-full text-xs ${
                                  comment.commenterType === "user"
                                    ? 'bg-purple-200 text-purple-700'
                                    : 'bg-orange-100 text-orange-600'
                                }`}>
                                  <Edit3 size={10} />
                                  <span className="font-medium">Edit Request</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Timestamp outside the bubble */}
                          <div className={`flex ${comment.commenterType == role ? "justify-end" : "justify-start"}`}>
                            <span className={`text-xs px-2 ${
                              comment.commenterType === "user" ? 'text-purple-600' : 'text-gray-500'
                            }`}>
                              {moment(comment.createdAt).format("h:mm A")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Scroll to bottom button */}
          {!isAtBottom && fileComments.length > 0 && (
            <div className="absolute bottom-4 right-4">
              <button
                onClick={scrollToBottom}
                className="p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-200 hover:scale-105"
                title="Scroll to latest comment"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 14L12 19L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 5L12 10L17 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Comment Form */}
        <div className="p-4 bg-white border-t border-gray-100">
          
          {/* Edit Request Toggle - Your exact logic */}
          {role === "user" && (activeTab === 'completed' || !activeTab) && (
            <div className="mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEditRequest}
                  onChange={(e) => setIsEditRequest(e.target.checked)}
                  className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-base text-gray-600">
                  {activeTab === 'completed' 
                    ? 'Request Re-editing' 
                    : 'Request Editing'
                  }
                </span>
              </label>
            </div>
          )}

          {/* Comment Input */}
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  isEditRequest
                    ? (activeTab === 'completed' 
                        ? "Describe the additional changes you'd like to see..." 
                        : "Describe the specific edits and improvements needed...")
                    : "Type a comment..."
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent resize-none text-sm"
                rows="4"
                style={{ minHeight: '44px', maxHeight: '120px' }}
                maxLength="500"
                onKeyDown={handleKeyDown}
                disabled={isAddingComment}
              />
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!comment.trim() || isAddingComment}
              className={`p-3 rounded-full transition-all min-w-[44px] ${
                comment.trim() && !isAddingComment
                  ? 'bg-[#892580] text-white hover:from-purple-600 hover:to-purple-700 shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isAddingComment ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>

          {/* Character Count */}
          <div className="flex justify-end mt-2">
            <div className={`text-xs ${
              comment.length > 450 ? 'text-red-500' : 
              comment.length > 400 ? 'text-orange-500' : 'text-gray-400'
            }`}>
              {comment.length}/500
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}