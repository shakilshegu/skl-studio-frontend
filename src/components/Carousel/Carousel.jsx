import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const banner = "/Assets/Banner.svg";

const Carousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
    };

    return (
        <div className="w-full overflow-hidden">
            <Slider {...settings}>
                <div className="w-full">
                    <img src={banner} alt="Slide 1" className="w-full" />
                </div>
                <div className="w-full">
                    <img src={banner} alt="Slide 2" className="w-full" />
                </div>
                <div className="w-full">
                    <img src={banner} alt="Slide 3" className="w-full" />
                </div>
            </Slider>
        </div>
    );
};

export default Carousel;