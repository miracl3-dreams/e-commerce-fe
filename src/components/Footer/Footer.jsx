import React from "react";
import Logo from "../../assets/hero/logo.png";
import Banner from "../../assets/website/banner.png";
import { FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa6";
import { FaLocationArrow, FaMobileAlt } from "react-icons/fa";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  width: "100%",
};

const FooterLinks = [
  { title: "Home", link: "/#" },
  { title: "All Brands", link: "/#allbrands" },
  { title: "Blog", link: "/#blog" },
  { title: "Trending Products", link: "/#trendingproducts" },
];

const Footer = () => {
  return (
    <div className="h-full flex flex-col">
      <div style={BannerImg} className="text-white mt-auto">
        <div className="container mx-auto px-6">
          {/* Container with centering */}
          <div className="grid grid-cols-1 md:grid-cols-3 py-5 pt-5 gap-10">
            {/* Product Details */}
            <div className="flex flex-col items-center py-8 px-4">
              <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3">
                <img
                  src={Logo}
                  alt="KGW Cosmetics Logo"
                  className="max-w-[50px] rounded-full"
                />
                KGW Cosmetics
              </h1>
              <p className="text-center">
                Elevate your beauty and embrace the essence of true glamour with
                KGW Cosmetics because you deserve the best!
              </p>
            </div>

            {/* Footer Links Details */}
            <div className="flex flex-col items-center py-8 px-4">
              <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                Important Links
              </h1>
              <ul className="space-y-2">
                {FooterLinks.map((link) => (
                  <li
                    className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200"
                    key={link.title}
                  >
                    <span>{link.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media Links */}
            <div className="flex flex-col items-center py-8 px-4">
              <div className="flex items-center gap-6 mb-6">
                <a href="#">
                  <FaEnvelope className="text-3xl" />
                </a>
                <a href="https://www.facebook.com/share/16G7sQLJit/">
                  <FaFacebook className="text-3xl" />
                </a>
                <a href="">
                  <FaInstagram className="text-3xl" />
                </a>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-3 mb-4">
                  <FaLocationArrow />
                  <p>Address: 17 Matimtim Street, Quezon City</p>
                </div>
                <div className="flex items-center gap-3">
                  <FaMobileAlt />
                  <p>+639274282973</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
