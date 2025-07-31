"use client"

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, MapPin, ExternalLink, Share2, Heart, Eye, Calendar, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPortfolioById } from "../../../../services/Portfolio/portfolio.service"; 
import { use } from "react";

const PortfolioSingleView = ({ params }) => {
    const unwrappedParams = use(params);
    const portfolioId = unwrappedParams?.portfolioId;
    const router = useRouter();
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    
    // Use React Query to fetch portfolio data
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['portfolio', portfolioId],
        queryFn: () => getPortfolioById(portfolioId),
        enabled: !!portfolioId,
    });

    const portfolio = data?.data;

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'Escape') setIsFullScreen(false);
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [portfolio?.images]);

    const renderImage = (imageSource) => {
        if (typeof imageSource === "string") return imageSource;
        if (imageSource?.url) return imageSource.url;
        if (imageSource instanceof File) return URL.createObjectURL(imageSource);
        return null;
    };

    const prevImage = () => {
        if (!portfolio?.images?.length) return;
        setCurrentImageIndex((prev) =>
            prev === 0 ? portfolio.images.length - 1 : prev - 1
        );
    };

    const nextImage = () => {
        if (!portfolio?.images?.length) return;
        setCurrentImageIndex((prev) =>
            prev === portfolio.images.length - 1 ? 0 : prev + 1
        );
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading portfolio...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Portfolio not found</h2>
                    <p className="text-gray-600 mb-4">The portfolio you're looking for doesn't exist or has been removed.</p>
                    <button 
                        onClick={() => router.back()} 
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="font-medium">Back to Portfolio</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Image Gallery */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            {/* Main Image */}
                            <div className="relative">
                                {portfolio?.images?.length > 0 ? (
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <img
                                            src={renderImage(portfolio.images[currentImageIndex])}
                                            alt={portfolio?.title}
                                            className="w-full h-full object-cover cursor-zoom-in"
                                            onClick={() => setIsFullScreen(true)}
                                        />
                                        
                                        {/* Navigation Arrows */}
                                        {portfolio.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>
                                                
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                        
                                        {/* Image Counter */}
                                        {portfolio.images.length > 1 && (
                                            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                                {currentImageIndex + 1} / {portfolio.images.length}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="aspect-[16/10] bg-gray-100 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Eye className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500">No images available</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Navigation */}
                            {portfolio?.images?.length > 1 && (
                                <div className="p-6 border-t bg-gray-50">
                                    <div className="flex space-x-3 overflow-x-auto pb-2">
                                        {portfolio.images.map((img, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                                                    currentImageIndex === index
                                                        ? 'ring-2 ring-purple-600 ring-offset-2'
                                                        : 'hover:opacity-80'
                                                }`}
                                            >
                                                <img
                                                    src={renderImage(img)}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-20 h-16 object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Portfolio Details Sidebar */}
                    <div className="space-y-6">
                        {/* Title and Category */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    {portfolio?.category && (
                                        <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full mb-3">
                                            {portfolio.category}
                                        </span>
                                    )}
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                        {portfolio?.title || "Untitled Portfolio"}
                                    </h1>
                                    {portfolio?.location && (
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            <span className="text-sm">{portfolio.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {portfolio?.description && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                        Description
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {portfolio.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Project Details */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                            
                            <div className="space-y-4">
                                {portfolio?.category && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <User className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Category</p>
                                            <p className="font-medium text-gray-900">{portfolio.category}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {portfolio?.location && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Location</p>
                                            <p className="font-medium text-gray-900">{portfolio.location}</p>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Eye className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Images</p>
                                        <p className="font-medium text-gray-900">
                                            {portfolio?.images?.length || 0} photos
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* External Link */}
                        {portfolio?.link && (
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">External Link</h3>
                                <a
                                    href={portfolio.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    View Project
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Fullscreen Modal */}
            {isFullScreen && portfolio?.images?.length > 0 && (
                <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                    <button
                        onClick={() => setIsFullScreen(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    
                    <img
                        src={renderImage(portfolio.images[currentImageIndex])}
                        alt={portfolio?.title}
                        className="max-w-full max-h-full object-contain"
                    />
                    
                    {portfolio.images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/30 p-3 rounded-full"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/30 p-3 rounded-full"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default PortfolioSingleView;