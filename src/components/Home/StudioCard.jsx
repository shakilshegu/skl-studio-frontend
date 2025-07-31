"use client"
import React, { useEffect, useRef } from 'react'
import "react-datepicker/dist/react-datepicker.css";
import "@/Styles/Home.css";
import { useQuery } from '@tanstack/react-query';
import { randomStudioEndPoint } from '@/services/studio/studio.service';
export const StudioCard = () => {
    const scrollContainerRef = useRef(null);

    const { data: studios = [], isLoading } = useQuery({
        queryKey: ["RandomStudios"],
        queryFn: randomStudioEndPoint,
    });
    const truncateDescription = (description, maxLength = 100) => {
        if (description.length <= maxLength) return description;
        return description.slice(0, maxLength) + '...';
    };

    useEffect(() => {
        const handleScroll = (event) => {
            if (scrollContainerRef.current) {
                // Prevent vertical scrolling and scroll horizontally instead
                event.preventDefault();
                scrollContainerRef.current.scrollLeft += event.deltaY || event.deltaX;
            }
        };

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("wheel", handleScroll);
        }

        // Cleanup event listener on component unmount
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("wheel", handleScroll);
            }
        };
    }, []);
    return (
        <>
            <div className="st-scroll-container" ref={scrollContainerRef}>
                {studios.map((studio) => (
                    <div key={studio._id} className="st-studio-card">
                        <div className="st-card-header">
                            {/* <span className="st-studio-price">${studio.price.perHour}/hr</span> */}
                        </div>
                        <img
                            src={studio.images[0]}
                            alt={studio.title}
                            className="w-full h-56 object-cover cursor-pointer"
                            onClick={() => router.push('/studio')}
                        />
                        <div className="st-studio-info">
                            <div className="st-user-studio">
                                <p className="st-para3"> {studio.title}</p>
                            </div>
                            <p className="st-para4 line-clamp-3"> {truncateDescription(studio.studioDescription)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
