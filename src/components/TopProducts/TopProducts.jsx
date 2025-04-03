import React from "react";
import Img1 from "../../assets/topProducts/lipstick.png";
import Img2 from "../../assets/topProducts/makeup.png";
import Img3 from "../../assets/topProducts/liptint.png";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "KGW Lipstick",
    description: "₱119.00",
  },
  {
    id: 2,
    img: Img2,
    title: "KGW Makeup Kit",
    description: "₱139.00",
  },
  {
    id: 3,
    img: Img3,
    title: "KGW Liptint",
    description: "₱189.00",
  },
];

const TopProducts = () => {
  return (
    <div className="container">
      {/* Header Section */}
      <div className="text-center mt-30 mb-20">
        <h1 data-aos="fade-up" className="text-2xl sm:text-3xl font-bold">
          Best Selling Products
        </h1>
      </div>
      {/* Body Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 sm:gap-10 md:gap-5 place-items-center mb-10">
        {ProductsData.map((data) => (
          <div
            key={data.id}
            className="rounded-2xl bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white relative shadow-xl duration-300 group max-w-[280px] mb-3"
          >
            {/* Image Section */}
            <div className="h-[90px] w-[200px] sm:h-[115px]">
              <img
                src={data.img}
                alt={data.title}
                className="max-w-[130px] sm:max-w-[140px] block mx-auto transform -translate-y-16 sm:-translate-y-20 group-hover:scale-105 duration-300 drop-shadow-md"
              />
            </div>
            {/* Details Section */}
            <div className="p-4 text-center">
              <h1 className="text-lg sm:text-xl font-semibold">{data.title}</h1>
              <p className="text-primary group-hover:text-white duration-300 text-sm sm:text-base line-clamp-2">
                {data.description}
              </p>
              <button
                className="bg-primary hover:scale-105 duration-300 text-white py-1 px-4 rounded-full mt-4 group-hover:bg-white group-hover:text-primary"
                disabled
              >
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
