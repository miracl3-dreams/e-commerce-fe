import React from "react";
import Image1 from "../../assets/hero/logo.png";
import Image2 from "../../assets/hero/women1.png";
import Image3 from "../../assets/hero/women2.png";
import Slider from "react-slick";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "BE YOUR OWN KIND OF BEAUTIFUL",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
  },
  {
    id: 2,
    img: Image2,
    title: "BE YOUR OWN KIND OF BEAUTIFUL",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
  },
  {
    id: 3,
    img: Image3,
    title: "BE YOUR OWN KIND OF BEAUTIFUL",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.",
  },
];

const Hero = () => {
  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <>
      <div className="relative overflow-hidden min-h-[600px] sm:min-h-[700px] bg-gray-100 flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200">
        {/* background pattern */}
        <div className="h-[700px] w-[700px] bg-primary/90 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z-9"></div>
        {/* hero section */}
        <div className="container pb-8 sm:pb-0 px-4 sm:px-10">
          <Slider {...settings}>
            {ImageList.map((data) => (
              <div key={data.id}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  {/* text content section */}
                  <div className="flex flex-col justify-center gap-4 pt-14 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                    <h1
                      data-aos="fade-up"
                      data-aos-duration="500"
                      data-aos-once="true"
                      className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
                    >
                      {data.title}
                    </h1>
                    <p
                      data-aos="fade-up"
                      data-aos-duration="400"
                      data-aos-once="true"
                      className="text-sm sm:text-base text-gray-700"
                    >
                      {data.description}
                    </p>
                    <div
                      data-aos="fade-up"
                      data-aos-duration="400"
                      data-aos-once="true"
                    >
                      <button className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-5 rounded-full">
                        Shop Now
                      </button>
                    </div>
                  </div>
                  {/* image section */}
                  <div className="order-1 sm:order-2">
                    <div
                      data-aos="zoom-in"
                      data-aos-once="true"
                      className="relative z-10"
                    >
                      <img
                        src={data.img}
                        alt=""
                        className="w-[300px] h-[350px] sm:h-[400px] sm:w-[450px] sm:scale-100 lg:scale-110 object-contain mx-auto rounded-lg mt-5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default Hero;
