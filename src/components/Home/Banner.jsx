import React, { useState } from "react";


const slides = [
    {
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        img: "/Assets/banner.jpeg",
    },
    {
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        img: "/Assets/banner.jpeg",
    },
    {
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        img: "/Assets/banner.jpeg",
    },
];

const TeamCarousel = () => {
    const [current, setCurrent] = useState(1);

    return (
        <>

            <div className="flex flex-col  items-center py-10 px-4 bg-white">

                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
                        Elevate Your <span className="text-[#892580]">Studio Vision</span> with Creative Precision
                    </h2>
                    <p className="text-center items-center text-gray-600 mb-4 tru">
                        From concept to creation, our studio brings your ideas to life through compelling visuals, seamless storytelling, and professional brand.
                    </p>

                </div>
                {/* Carousel */}
                <div className="relative  w-full">
                    <div className="relative flex items-center justify-center gap-4 overflow-visible w-full">
                        {slides.map((slide, index) => {
                            const isActive = index === current;
                            const offset = index - current;

                            return (
                                <div
                                    key={index}
                                    className={`absolute transition-all duration-500 rounded-2xl shadow-lg ${isActive ? "z-30 scale-100 opacity-100 ease-in-out " : "z-10 scale-75 opacity-30"
                                        }`}
                                    style={{
                                        left: `${50 + offset * 6}%`,
                                        transform: "translateX(-50%)",
                                        width: isActive ? "100%" : "85%",
                                        maxWidth: "700px",
                                        top: "20px"
                                    }}
                                >
                                    <div className="overflow-hidden rounded-2xl relative">
                                        <img src={slide.img} alt="Team" className="w-full h-auto object-cover" />

                                        {/* Text Overlay */}
                                        <div className="absolute bottom-0 bg-black/30 text-white p-4 w-full">
                                            <h3 className="text-lg font-bold">
                                                Lorem <span className="text-[#892580]">ipsum dolor</span> sit amet, consectetur adipiscing elit
                                            </h3>
                                            <p className="text-sm mt-1">{slide.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    <div className=" absolute  top-[500px] left-1/2 transform -translate-x-3/4 flex space-x-2 z-50">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`w-3 h-3 rounded-full ${current === index ? "bg-[#892580]" : "bg-gray-300"
                                    }`}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeamCarousel;
