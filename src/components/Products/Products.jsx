import React from "react";
import Img1 from "../../assets/offers/offer1.png";
import Img2 from "../../assets/offers/offer2.png";
import Img3 from "../../assets/offers/offer3.png";
import Img4 from "../../assets/offers/offer4.png";

const ProductsData = [
  { id: 1, img: Img1, title: "Hair Styling", aosDelay: "0" },
  { id: 2, img: Img2, title: "Cream Mask", aosDelay: "200" },
  { id: 3, img: Img3, title: "Growth Serum", aosDelay: "400" },
  { id: 4, img: Img4, title: "Cream Moisturizer", aosDelay: "600" },
];

const Products = () => {
  return (
    <div className="mt-14 mb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 max-w-xl mx-auto">
          <h1 data-aos="fade-up" className="text-2xl sm:text-3xl font-bold">
            KGW Cosmetic Offers
          </h1>
        </div>

        {/* Body Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 place-items-center">
          {ProductsData.map((data) => (
            <div
              data-aos="fade-up"
              data-aos-delay={data.aosDelay}
              key={data.id}
              className="flex flex-col items-center w-full max-w-[200px]"
            >
              <img
                src={data.img}
                alt={data.title}
                className="h-[180px] sm:h-[220px] w-[150px] sm:w-[180px] object-cover rounded-2xl"
              />
              <div className="text-center mt-4">
                <h3 className="font-semibold text-lg">{data.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
