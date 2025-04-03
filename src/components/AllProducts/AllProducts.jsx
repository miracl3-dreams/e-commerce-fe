import React, { useEffect, useRef } from "react";
import Img1 from "../../assets/allProducts/item1.png";
import Img2 from "../../assets/allProducts/item2.png";
import Img3 from "../../assets/allProducts/item3.png";
import Img4 from "../../assets/allProducts/item4.png";
import Img5 from "../../assets/allProducts/item5.png";

const AllProductsData = [
  {
    id: 1,
    img: Img1,
    aosDelay: "0",
  },
  {
    id: 2,
    img: Img2,
    aosDelay: "200",
  },
  {
    id: 3,
    img: Img3,
    aosDelay: "400",
  },
  {
    id: 4,
    img: Img4,
    aosDelay: "600",
  },
  {
    id: 5,
    img: Img5,
    aosDelay: "800",
  },
];

const AllProducts = () => {
  const allProductsRef = useRef(null);

  useEffect(() => {
    // Ensuring that we scroll to this section when it is loaded
    if (allProductsRef.current) {
      allProductsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div ref={allProductsRef} className="mt-24 mb-20">
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-[500px] mx-auto">
          <h1 data-aos="fade-up" className="text-3xl sm:text-4xl font-bold">
            All Products
          </h1>
        </div>
        {/* Body Section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 justify-center mb-16">
            {AllProductsData.map((data) => (
              <div
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                key={data.id}
                className="flex flex-col items-center"
              >
                <img
                  src={data.img}
                  alt=""
                  className="h-[200px] sm:h-[240px] w-[170px] sm:w-[200px] object-cover rounded-3xl"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
