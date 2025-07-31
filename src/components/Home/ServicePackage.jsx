'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from '@tanstack/react-query';
import { fetchPackages } from '@/services/Home/home.service';
import { Clock, Star, MapPin, Users, Camera, Play, ChevronRight, Loader2, Heart, ExternalLink } from 'lucide-react';

const AdminPackages = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const router = useRouter();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['packages'],
        queryFn: fetchPackages,
    });

    // Make sure to access the correct data structure
    const packages = Array.isArray(data?.data) ? data.data : [];

    const handlePackageClick = (pkg) => {
        router.push(`/user/admin-packages/${pkg._id}?bookingType=admin-package&packageId=${pkg._id}`);
    };

    const handleViewAll = () => {
        router.push('/user/packages');
    };

    // Get dynamic grid classes based on package count
    const getGridClasses = () => {
        const count = packages.length;
        if (count === 1) return "grid grid-cols-1 justify-items-center max-w-sm mx-auto";
        if (count === 2) return "grid grid-cols-1 sm:grid-cols-2 justify-items-center max-w-2xl mx-auto gap-6";
        if (count === 3) return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center max-w-4xl mx-auto gap-6";
        if (count === 4) return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center max-w-5xl mx-auto gap-6";
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";
    };

    if (isLoading) {
        return (
            <div className="px-4 md:px-10 bg-white py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 text-[#892580] animate-spin mb-4" />
                        <p className="text-gray-500">Loading amazing packages...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="px-4 md:px-10 bg-white py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-16">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                            <p className="text-red-600 font-medium">Error loading packages</p>
                            <p className="text-red-500 text-sm mt-1">Please try refreshing the page</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (packages.length === 0) {
        return (
            <div className="px-4 md:px-10 bg-white py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-16">
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-md mx-auto">
                            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">No packages available</p>
                            <p className="text-gray-500 text-sm mt-1">Check back later for exciting offers</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 md:px-10 bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Featured Studio Packages
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Discover our curated selection of premium studio packages designed for every creative need
                    </p>
                </div>

                {/* Packages Grid - Centered Layout */}
                <div className={`${getGridClasses()} mb-12`}>
                    {packages.map((pkg, index) => (
                        <div
                            key={pkg.id || pkg._id || index}
                            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 w-full max-w-sm"
                            onClick={() => handlePackageClick(pkg)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Image Container */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={pkg.photo || '/Assets/default.png'}
                                    alt={pkg.name}
                                    className="w-full h-48 sm:h-52 object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-white text-sm">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span>4.8</span>
                                            </div>
                                            <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                                                <Heart className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>                             
                                
                                {/* Quick Action */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#892580] hover:bg-white transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                {/* Title */}
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#892580] transition-colors">
                                    {pkg.name}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                                    {pkg.description || "Professional studio package with premium amenities and equipment"}
                                </p>

                                {/* Features */}
                                <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>Per hour</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        <span>Up to 10</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Camera className="w-3 h-3" />
                                        <span>Pro gear</span>
                                    </div>
                                </div>

                                {/* Price and Action */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-2xl font-bold text-[#892580]">
                                            ₹{pkg.price || '999'}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-1">/hr</span>
                                    </div>
                                    
                                    <button className="flex items-center gap-1 text-[#892580] font-medium text-sm hover:gap-2 transition-all duration-300">
                                        <span>View Details</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Section */}
                <div className="text-center">
                    <button
                        onClick={handleViewAll}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#892580] text-white font-semibold rounded-xl hover:bg-[#7a2073] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <span>Explore All Packages</span>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    <p className="text-gray-500 text-sm mt-3">
                        Discover {packages.length}+ premium studio packages
                    </p>
                </div>
            </div>

            <style jsx>{`
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default AdminPackages;