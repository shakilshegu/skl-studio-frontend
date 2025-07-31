"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, MapPin, Star, Briefcase } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
const Freelancer1 = "/Assets/Freelancer1.jpeg";
const Freelancer2 = "/Assets/Freelancer2.jpeg";
const Freelancer3 = "/Assets/Freelancer3.jpeg";
const Freelancer4 = "/Assets/Freelancer4.jpeg";
const Freelancer5 = "/Assets/Freelancer5.jpeg";
const Freelancer6 = "/Assets/Freelancer6.jpeg";
const Freelancer7 = "/Assets/Freelancer7.jpeg";
const Freelancer8 = "/Assets/Freelancer8.jpeg";

const photographers = [
    {
        id: 1,
        name: "Zeeshan Sears",
        image: Freelancer1,
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        location: "Madhapur, Hyderabad",
        rating: 4.5,
        exp: "5 years",
        price: "999",
    },
    {
        id: 2,
        name: "Carolyn Finch",
        image: Freelancer2,
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        location: "Madhapur, Hyderabad",
        rating: 4.5,
        exp: "5 years",
        price: "999",
    },
    {
        id: 3,
        name: "Kaylee Burton",
        image: Freelancer3,
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        location: "Madhapur, Hyderabad",
        rating: 4.5,
        exp: "5 years",
        price: "999",
    },
    {
        id: 4,
        name: "Ross Francis",
        image: Freelancer4,
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        location: "Madhapur, Hyderabad",
        rating: 4.5,
        exp: "5 years",
        price: "999",
    },
    {
        id: 5,
        name: "Nathan Brooks",
        image: Freelancer5,
        desc: "Passionate about capturing life’s best moments through the lens with creativity.",
        location: "Banjara Hills, Hyderabad",
        rating: 4.7,
        exp: "6 years",
        price: "1200",
    },
    {
        id: 6,
        name: "Sophia Miller",
        image: Freelancer6,
        desc: "Specializes in wedding and candid photography with a unique storytelling style.",
        location: "Jubilee Hills, Hyderabad",
        rating: 4.6,
        exp: "7 years",
        price: "1500",
    },
    {
        id: 7,
        name: "Lucas White",
        image: Freelancer7,
        desc: "Event and corporate photographer with a keen eye for details and aesthetics.",
        location: "Gachibowli, Hyderabad",
        rating: 4.8,
        exp: "8 years",
        price: "1800",
    },
    {
        id: 8,
        name: "Emma Johnson",
        image: Freelancer8,
        desc: "Expert in portrait and maternity photography with a soft and elegant touch.",
        location: "Kondapur, Hyderabad",
        rating: 4.9,
        exp: "5 years",
        price: "1400",
    },
];


export default function PhotographerSlider() {
    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 2;
    const totalPages = Math.ceil(photographers.length / cardsPerPage);

    const handleNext = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const handlePrev = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    const currentCards = photographers.slice(
        currentPage * cardsPerPage,
        currentPage * cardsPerPage + cardsPerPage
    );

    const [favorites, setFavorites] = useState([]);

    const toggleFavorite = (id) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
        );
    };

    return (
        <div className="px-4 py-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Similar Photo/Video Graphers</h2>

            <div className="relative">
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                    {currentCards.map((photographer, index) => (
                        <div
                            key={index}
                            className="flex flex-col md:flex-row gap-4 bg-white rounded-2xl cursor-pointer border border-[#1505131A] "
                        >
                            <div className="relative w-full md:w-1/2">
                                <img
                                    src={photographer.image}
                                    alt={photographer.name}
                                    className="w-full h-30 sm:h-48 md:h-70 lg:h-60  object-cover rounded-2xl md:rounded-l-2xl md:rounded-r-none"
                                />
                                <button
                                    className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-lg z-10"
                                    onClick={() => toggleFavorite(photographer.id)}
                                >
                                    {favorites.includes(photographer.id) ? (
                                        <FaHeart className="text-red-500" />
                                    ) : (
                                        <FaRegHeart className="text-gray-500" />
                                    )}
                                </button>
                            </div>
                            <div className="flex flex-col p-2 justify-between w-full text-sm text-gray-600">
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <h3 className="font-semibold text-base md:text-lg">{photographer.name}</h3>
                                        <div className="text-gray-500 text-xs md:text-sm mt-1">
                                            {photographer.desc}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <MapPin size={16} className="text-[#892580]" />
                                        <span className="text-xs md:text-sm">{photographer.location}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Star size={16} className="text-orange-500" />
                                        <span className="text-xs md:text-sm">{photographer.rating}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Briefcase size={16} className="text-gray-500 mt-0.5" />
                                        <span className="text-xs md:text-sm">{photographer.exp}</span>
                                    </div>

                                    <div className="text-[#892580] font-bold text-base md:text-lg">
                                        ₹ {photographer.price}
                                        <span className="text-gray-500 font-normal text-xs md:text-sm"> /hr</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={handlePrev}
                    className="absolute top-1/2 left-0 -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100 z-10"
                >
                    <ArrowLeft size={18} className="text-[#892580]" />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute top-1/2 right-0 -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100 z-10"
                >
                    <ArrowRight size={18} className="text-[#892580]" />
                </button>

                {/* Dot Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <span
                            key={index}
                            onClick={() => setCurrentPage(index)}
                            className={`w-3 h-3 rounded-full cursor-pointer ${index === currentPage ? "bg-[#892580]" : "bg-gray-300"
                                }`}
                        ></span>
                    ))}
                </div>
            </div>
        </div>
    );
}
