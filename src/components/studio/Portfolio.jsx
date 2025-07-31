import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { showToast } from "../Toast/Toast";

const bok1 = "/Assets/bok1.png";
const bok2 = "/Assets/bok2.png";
const bok3 = "/Assets/bok3.png";
const bok4 = "/Assets/bok4.png";
const bok5 = "/Assets/bok5.png";
const bok6 = "/Assets/bok6.png";
const bok7 = "/Assets/bok7.png";
const Freelancer1 = "/Assets/Freelancer1.jpeg";
const Freelancer2 = "/Assets/Freelancer2.jpeg";
const Freelancer3 = "/Assets/Freelancer3.jpeg";
const Freelancer4 = "/Assets/Freelancer4.jpeg";
const Freelancer5 = "/Assets/Freelancer5.jpeg";
const Freelancer6 = "/Assets/Freelancer6.jpeg";
const Freelancer7 = "/Assets/Freelancer7.jpeg";
const Freelancer8 = "/Assets/Freelancer8.jpeg";
const Freelancer9 = "/Assets/Freelancer9.jpeg";
const Freelancer10 = "/Assets/Freelancer10.jpeg";


const categories = [
    "Marriage", "Birthday", "Couple", "Commercial", "Product", "Sport", "Event"
];

const portfolioData = [
    {
        id: 1,
        category: "Marriage",
        images: [bok1, bok2, bok3, bok4, bok5, bok6],
        title: "Mohil Prajapati Wedding",
        location: "Hyderabad, Telangana",
        description: "A grand marriage event captured with stunning detail and elegance.",
        link: "https://www.sample.net/?file=marriage01"
    },
    {
        id: 1,
        category: "Marriage",
        images: [Freelancer1, Freelancer2, Freelancer3, Freelancer4, Freelancer5, bok6],
        title: "Mohil Prajapati Wedding",
        location: "Hyderabad, Telangana",
        description: "A grand marriage event captured with stunning detail and elegance.",
        link: "https://www.sample.net/?file=marriage01"
    },
    {
        id: 1,
        category: "Marriage",
        images: [Freelancer6, Freelancer7, Freelancer8, Freelancer9, Freelancer10, bok6],
        title: "Mohil Prajapati Wedding",
        location: "Hyderabad, Telangana",
        description: "A grand marriage event captured with stunning detail and elegance.",
        link: "https://www.sample.net/?file=marriage01"
    },
    {
        id: 2,
        category: "Birthday",
        images: [bok2, bok3, bok5, bok4, bok1],
        title: "Birthday Celebration",
        location: "Hyderabad, Telangana",
        description: "A joyful birthday event filled with fun, colors, and memories.",
        link: "https://www.sample.net/?file=birthday02"
    },
    {
        id: 3,
        category: "Couple",
        images: [bok3, bok4, bok5, bok6, bok7],
        title: "Couple Photoshoot",
        location: "Hyderabad, Telangana",
        description: "Intimate moments captured beautifully during a couple photoshoot.",
        link: "https://www.sample.net/?file=couple03"
    },
    {
        id: 4,
        category: "Commercial",
        images: [bok4, bok5, bok6, bok1],
        title: "Commercial Advertisement Shoot",
        location: "Hyderabad, Telangana",
        description: "Professional commercial shoot showcasing brand products and services.",
        link: "https://www.sample.net/?file=commercial04"
    },
    {
        id: 5,
        category: "Product",
        images: [bok5, bok6, bok2, bok3],
        title: "Product Photoshoot",
        location: "Hyderabad, Telangana",
        description: "High-quality product photography for e-commerce and catalogs.",
        link: "https://www.sample.net/?file=product05"
    },
    {
        id: 6,
        category: "Sport",
        images: [bok6, bok7, bok1, bok3],
        title: "Sports Event Coverage",
        location: "Hyderabad, Telangana",
        description: "Capturing action-packed moments and highlights of sporting events.",
        link: "https://www.sample.net/?file=sport06"
    },
    {
        id: 7,
        category: "Event",
        images: [bok7, bok1, bok4, bok5],
        title: "Corporate Event Photography",
        location: "Hyderabad, Telangana",
        description: "Professional coverage of corporate and social events.",
        link: "https://www.sample.net/?file=event07"
    }
];


const Portfolio = () => {
    const [activeTab, setActiveTab] = useState("Marriage");
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");

    const openModal = (item) => {
        setSelectedPortfolio(item);
        setSelectedImage(item.images[0]);
    };

    const closeModal = () => {
        setSelectedPortfolio(null);
        setSelectedImage("");
    };

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-6">Portfolio</h2>

            {/* Category Tabs */}
            <div className="flex space-x-4 overflow-x-auto border rounded-lg bg-gray-100 mb-6 justify-between">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveTab(category)}
                        className={`px-4 py-2 text-sm rounded-md transition-all duration-200 ${activeTab === category
                            ? "bg-white text-black font-semibold shadow-md"
                            : ""
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Portfolio Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {portfolioData
                    .filter((item) => item.category === activeTab)
                    .map((item, index) => {
                        const maxVisibleImages = 4;
                        const hiddenImageCount = item.images.length - maxVisibleImages;

                        return (
                            <div
                                key={index}
                                onClick={() => openModal(item)}
                                className="cursor-pointer border rounded-lg shadow-sm p-4 bg-white hover:shadow-lg transition"
                            >
                                <div className="grid grid-cols-2 gap-2">
                                    {item.images.slice(0, maxVisibleImages).map((img, i) => (
                                        <div key={i} className="relative">
                                            <img
                                                src={img}
                                                alt="portfolio"
                                                className="rounded-md w-full h-24 object-cover"
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
                                    <div className="font-medium">{item.title}</div>
                                    <p className="text-gray-600 flex items-center text-sm mt-1">
                                        <FaMapMarkerAlt className="mr-1 text-gray-500" /> {item.location}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Modal */}
            {selectedPortfolio && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[90%] lg:w-3/4 h-[90%] overflow-auto relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
                        >
                            <IoMdClose />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left side large image and thumbnails */}
                            <div>
                                <img
                                    src={selectedImage}
                                    alt="preview"
                                    className="w-full h-80 object-cover rounded-lg mb-4"
                                />
                                <div className="flex gap-2 overflow-x-auto">
                                    {selectedPortfolio.images.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            onClick={() => setSelectedImage(img)}
                                            alt="thumbnail"
                                            className={`w-20 h-20 rounded-md cursor-pointer object-cover border ${selectedImage === img ? "border-blue-500" : "border-gray-300"}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Right side details */}
                            <div>
                                <p><strong>Category:</strong> {selectedPortfolio.category} Shoot</p>
                                <p className="mt-2"><strong>Title:</strong> {selectedPortfolio.title}</p>
                                <p className="mt-2"><strong>Description:</strong> {selectedPortfolio.description}</p>
                                <p className="mt-2 flex items-center">
                                    <FaMapMarkerAlt className="mr-2 text-gray-500" />
                                    <strong>Location:</strong> {selectedPortfolio.location}
                                </p>
                                <div className="mt-4">
                                    <label className="text-sm font-medium mb-2 block">Link:</label>
                                    <div className="flex items-center border rounded overflow-hidden">
                                        <input
                                            type="text"
                                            value={selectedPortfolio.link}
                                            readOnly
                                            className="w-full p-2 outline-none text-sm"
                                        />
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(selectedPortfolio.link);
                                                showToast("Link copied!");
                                            }}
                                            className="px-4 py-2 bg-[#892580] text-white text-sm"
                                        >
                                            Copy
                                        </button>
                                    </div>
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
