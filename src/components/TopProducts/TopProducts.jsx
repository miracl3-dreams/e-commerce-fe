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
    <div className="px-4 mt-20 mb-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 data-aos="fade-up" className="text-2xl sm:text-3xl font-bold">
            Best Selling Products
          </h1>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 place-items-center">
          {ProductsData.map((data) => (
            <div
              key={data.id}
              className="rounded-2xl bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white duration-300 group w-full max-w-[260px] flex flex-col items-center"
            >
              {/* Image */}
              <div className="w-full flex justify-center -mt-12">
                <img
                  src={data.img}
                  alt={data.title}
                  className="w-[120px] sm:w-[130px] object-contain group-hover:scale-105 duration-300"
                />
              </div>

              {/* Info */}
              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold">{data.title}</h2>
                <p className="text-primary group-hover:text-white duration-300 text-sm mt-1">
                  {data.description}
                </p>
                <button
                  className="bg-primary text-white mt-4 py-1 px-4 rounded-full hover:scale-105 duration-300 group-hover:bg-white group-hover:text-primary"
                  disabled
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
