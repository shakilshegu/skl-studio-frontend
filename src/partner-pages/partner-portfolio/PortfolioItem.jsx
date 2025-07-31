import { MapPin, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

const PortfolioItem = ({
  portfolio,
  index,
  menuOpen,
  onToggleMenu,
  onEdit,
  onDelete
}) => {
  const menuRef = useRef(null);

  // Safe image rendering function
  const renderImage = (imageSource) => {
    if (typeof imageSource === "string") {
      return imageSource;
    }
    if (imageSource?.url) {
      return imageSource.url;
    }
    if (imageSource instanceof File) {
      return URL.createObjectURL(imageSource);
    }
    return null;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onToggleMenu(null);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, onToggleMenu]);

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on menu or its buttons
    if (menuRef.current && menuRef.current.contains(e.target)) {
      e.preventDefault();
      return;
    }
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Menu Button */}
      <div ref={menuRef} className="absolute top-3 right-3 z-20">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleMenu(index);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-sm"
        >
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg w-32 z-30 py-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(portfolio);
                onToggleMenu(null);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(portfolio._id);
                onToggleMenu(null);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <Link href={`/partner/portfolio/${portfolio._id}`} className="block" onClick={handleCardClick}>
        {/* Image Grid Section */}
        <div className="relative p-3">
          {portfolio?.images && portfolio?.images.length > 0 ? (
            <div className="grid grid-cols-3 grid-rows-3 gap-1 aspect-square">
              {/* Main large image (2x2) */}
              <div className="col-span-2 row-span-2 relative">
                <img
                  src={renderImage(portfolio.images[0])}
                  className="w-full h-full object-cover rounded-lg"
                  alt="Portfolio main"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/400/300';
                  }}
                />
              </div>
              
              {/* Top right */}
              {portfolio.images.length > 1 && (
                <div className="col-start-3 row-start-1 relative">
                  <img
                    src={renderImage(portfolio.images[1])}
                    className="w-full h-full object-cover rounded-lg"
                    alt="Portfolio thumbnail"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/200/200';
                    }}
                  />
                </div>
              )}
              
              {/* Middle right */}
              {portfolio.images.length > 2 && (
                <div className="col-start-3 row-start-2 relative">
                  <img
                    src={renderImage(portfolio.images[2])}
                    className="w-full h-full object-cover rounded-lg"
                    alt="Portfolio thumbnail"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/200/200';
                    }}
                  />
                </div>
              )}
              
              {/* Bottom left */}
              {portfolio.images.length > 3 && (
                <div className="col-start-1 row-start-3 relative">
                  <img
                    src={renderImage(portfolio.images[3])}
                    className="w-full h-full object-cover rounded-lg"
                    alt="Portfolio thumbnail"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/200/200';
                    }}
                  />
                </div>
              )}
              
              {/* Bottom middle */}
              {portfolio.images.length > 4 && (
                <div className="col-start-2 row-start-3 relative">
                  <img
                    src={renderImage(portfolio.images[4])}
                    className="w-full h-full object-cover rounded-lg"
                    alt="Portfolio thumbnail"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/200/200';
                    }}
                  />
                </div>
              )}
              
              {/* Bottom right with overlay for additional images */}
              {portfolio.images.length > 5 && (
                <div className="col-start-3 row-start-3 relative">
                  <img
                    src={renderImage(portfolio.images[5])}
                    className="w-full h-full object-cover rounded-lg"
                    alt="Portfolio thumbnail"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/200/200';
                    }}
                  />
                  
                  {/* Overlay for additional images count */}
                  {portfolio.images.length > 6 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white font-medium rounded-lg backdrop-blur-sm">
                      +{portfolio.images.length - 6}
                    </div>
                  )}
                </div>
              )}
              
              {/* Empty slots for missing images */}
              {portfolio.images.length < 6 && 
                Array.from({ length: 6 - portfolio.images.length }).map((_, i) => {
                  const positions = [
                    "col-start-3 row-start-1",
                    "col-start-3 row-start-2", 
                    "col-start-1 row-start-3",
                    "col-start-2 row-start-3",
                    // "col-start-3 row-start-3"
                  ];
                  const positionIndex = portfolio.images.length - 1 + i;
                  
                  if (positionIndex >= 0 && positionIndex < positions.length) {
                    return (
                      <div 
                        key={`empty-${i}`} 
                        className={`${positions[positionIndex]} bg-gray-100 rounded-lg`}
                      />
                    );
                  }
                  return null;
                })
              }
            </div>
          ) : (
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">No images</p>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="px-4 pb-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {portfolio?.title || "Untitled Portfolio"}
          </h3>
          
          {portfolio?.location && (
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{portfolio.location}</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PortfolioItem;