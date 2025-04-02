import React from "react";
import Img1 from "../../assets/offers/offer1.png";
import Img2 from "../../assets/offers/offer2.png";
import Img3 from "../../assets/offers/offer3.png";
import Img4 from "../../assets/offers/offer4.png";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Hair Styling",
    aosDelay: "0",
  },
  {
    id: 2,
    img: Img2,
    title: "Cream Mask",
    aosDelay: "200",
  },
  {
    id: 3,
    img: Img3,
    title: "Growth Serum",
    aosDelay: "400",
  },
  {
    id: 4,
    img: Img4,
    title: "Cream Moisturizer",
    aosDelay: "600",
  },
];

const Products = () => {
  return (
    <div className="mt-14 mb-12">
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-10 max-w-[500px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            Top Selling Products for you
          </p>
          <h1 data-aos="fade-up" className="text-2xl sm:text-3xl font-bold">
            KGW Cosmetic Offers
          </h1>
          <p data-aos="fade-up" className="text-xs sm:text-sm text-gray-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            voluptatibus.
          </p>
        </div>
        {/* Body Section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 justify-center mb-10">
            {ProductsData.map((data) => (
              <div
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                key={data.id}
                className="flex flex-col items-center"
              >
                <img
                  src={data.img}
                  alt=""
                  className="h-[180px] sm:h-[220px] w-[150px] sm:w-[180px] object-cover rounded-3xl"
                />
                <div className="text-center mt-4">
                  <h3 className="font-semibold text-lg">{data.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
