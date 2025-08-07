import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import { getPortfolioByPartnerId, getUserPortfolio } from "@/services/Portfolio/portfolio.service";
import { showToast } from "../Toast/Toast";

const Portfolio = ({ partnerId}) => {
    const [activeTab, setActiveTab] = useState("all");
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    console.log("partnerId partnerId",partnerId);
    

    const { 
        data: portfolioResponse, 
        isLoading, 
        isError 
    } = useQuery({
        queryKey: ["portfolio", partnerId],
        queryFn: () => getPortfolioByPartnerId(partnerId),
        select: (data) => data?.data || [],
    });

    console.log("portfolioResponse",portfolioResponse);
    

    const categories = portfolioResponse 
        ? ["all", ...new Set(portfolioResponse.map(item => item.category?.toLowerCase()))]
        : ["all"];
    const filteredPortfolio = portfolioResponse?.filter(item => 
        activeTab === "all" || item.category?.toLowerCase() === activeTab
    ) || [];

    const openModal = (item) => {
        setSelectedPortfolio(item);
        setSelectedImage(item.images?.[0] || "");
    };

    const closeModal = () => {
        setSelectedPortfolio(null);
        setSelectedImage("");
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="p-4">
                <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 mb-6">Portfolio</h2>
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#892580]"></div>
                    <p className="mt-2 text-gray-600">Loading portfolio...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="p-4">
                <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 mb-6">Portfolio</h2>
                <div className="text-center py-8 text-red-500">
                    Failed to load portfolio. Please try again later.
                </div>
            </div>
        );
    }

    // Empty state
    if (!portfolioResponse || portfolioResponse.length === 0) {
        return (
            <div className="p-4">
                <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 mb-6">Portfolio</h2>
                <p className="text-gray-600 py-8 text-center">
                    No portfolio items available for this user yet.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl leading-10 mb-6">Portfolio</h2>

            {/* Category Tabs */}
            <div className="flex space-x-2 overflow-x-auto border rounded-lg bg-gray-50 p-1 mb-6">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveTab(category)}
                        className={`px-4 py-2 text-sm rounded-md transition-all duration-200 whitespace-nowrap ${
                            activeTab === category
                                ? "bg-[#892580] text-white font-semibold shadow-md"
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>

            {/* Portfolio Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredPortfolio.map((item, index) => {
                    const maxVisibleImages = 4;
                    const hiddenImageCount = (item.images?.length || 0) - maxVisibleImages;

                    return (
                        <div
                            key={item._id || index}
                            onClick={() => openModal(item)}
                            className="cursor-pointer border rounded-lg shadow-sm p-4 bg-white hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="grid grid-cols-2 gap-2">
                                {item.images?.slice(0, maxVisibleImages).map((img, i) => (
                                    <div key={i} className="relative">
                                        <img
                                            src={img}
                                            alt={`${item.title} - ${i + 1}`}
                                            className="rounded-md w-full h-24 object-cover"
                                            onError={(e) => {
                                                e.target.src = "/Assets/placeholder-image.jpg";
                                            }}
                                        />
                                        {i === maxVisibleImages - 1 && hiddenImageCount > 0 && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold text-lg rounded-md">
                                                +{hiddenImageCount}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3">
                                <div className="font-semibold text-lg text-[#892580]">{item.title}</div>
                                <p className="text-gray-600 flex items-center text-sm mt-1">
                                    <FaMapMarkerAlt className="mr-1 text-gray-500" /> 
                                    {item.location}
                                </p>
                                <p className="text-sm text-gray-500 mt-1 capitalize">
                                    {item.category} Shoot
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Show message if no items in filtered category */}
            {filteredPortfolio.length === 0 && activeTab !== "all" && (
                <div className="text-center py-8 text-gray-600">
                    No portfolio items found for "{activeTab}" category.
                </div>
            )}

            {/* Modal */}
            {selectedPortfolio && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-auto relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl z-10"
                        >
                            <IoMdClose />
                        </button>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left side - Large image and thumbnails */}
                            <div>
                                <img
                                    src={selectedImage}
                                    alt={selectedPortfolio.title}
                                    className="w-full h-80 object-cover rounded-lg mb-4"
                                    onError={(e) => {
                                        e.target.src = "/Assets/placeholder-image.jpg";
                                    }}
                                />
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {selectedPortfolio.images?.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            onClick={() => setSelectedImage(img)}
                                            alt={`${selectedPortfolio.title} thumbnail ${i + 1}`}
                                            className={`w-20 h-20 rounded-md cursor-pointer object-cover border-2 flex-shrink-0 ${
                                                selectedImage === img ? "border-[#892580]" : "border-gray-300"
                                            }`}
                                            onError={(e) => {
                                                e.target.src = "/Assets/placeholder-image.jpg";
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Right side - Details */}
                            <div>
                                <div className="space-y-4">
                                    <div>
                                        <span className="font-semibold text-gray-700">Category:</span>
                                        <span className="ml-2 capitalize">{selectedPortfolio.category} Shoot</span>
                                    </div>
                                    
                                    <div>
                                        <span className="font-semibold text-gray-700">Title:</span>
                                        <span className="ml-2">{selectedPortfolio.title}</span>
                                    </div>
                                    
                                    <div>
                                        <span className="font-semibold text-gray-700">Description:</span>
                                        <p className="mt-1 text-gray-600">{selectedPortfolio.description}</p>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <FaMapMarkerAlt className="mr-2 text-gray-500" />
                                        <span className="font-semibold text-gray-700">Location:</span>
                                        <span className="ml-2">{selectedPortfolio.location}</span>
                                    </div>

                                    {/* Link section - only show if link exists */}
                                    {selectedPortfolio.link && (
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                                Portfolio Link:
                                            </label>
                                            <div className="flex items-center border rounded-lg overflow-hidden">
                                                <input
                                                    type="text"
                                                    value={selectedPortfolio.link}
                                                    readOnly
                                                    className="w-full p-3 outline-none text-sm bg-gray-50"
                                                />
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(selectedPortfolio.link);
                                                        showToast("Link copied to clipboard!");
                                                    }}
                                                    className="px-4 py-3 bg-[#892580] text-white text-sm font-medium hover:bg-[#7a2272] transition-colors"
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Additional metadata if available */}
                                    {selectedPortfolio.date && (
                                        <div>
                                            <span className="font-semibold text-gray-700">Date:</span>
                                            <span className="ml-2">
                                                {new Date(selectedPortfolio.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Portfolio;