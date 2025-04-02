import React from "react";
import Logo from "../../assets/hero/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import Darkmode from "./darkMode";
import { RxAvatar } from "react-icons/rx";
import { FaCaretDown } from "react-icons/fa";

const Menu = [
  {
    id: 1,
    name: "Home",
    link: "#",
  },
  {
    id: 2,
    name: "All Brands",
    link: "#",
  },
  {
    id: 3,
    name: "Blog",
    link: "#",
  },
];

const DropdownLinks = [
  {
    id: 1,
    name: "Make Up",
    link: "#",
  },
  {
    id: 2,
    name: "Eyeliners",
    link: "#",
  },
];

const Navbar = () => {
  return (
    <>
      <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
        {/* Upper Navbar */}
        <div className="bg-primary/80 py-2">
          <div className="container flex justify-between items-center px-4 sm:px-8">
            <div>
              <a href="#" className="font-bold text-2xl sm:text-3xl flex gap-2">
                <img src={Logo} alt="Logo" className="w-10 rounded-full" />
                KGW Cosmetics
              </a>
            </div>

            {/* Right: Search bar and order button */}
            <div className="flex items-center gap-4">
              {/* Search bar */}
              <div className="relative group hidden sm:block">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-4 py-1 pl-2 pr-10 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800"
                />
                <IoMdSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3" />
              </div>

              {/* Customer Engagement */}
              <button
                onClick={() => alert("Customer button clicked")}
                className="text-white py-1 px-1 rounded-full flex items-center gap-4 group"
              >
                <RxAvatar className="text-xl text-white drop-shadow-xl cursor-pointer" />
              </button>

              {/* Order button */}
              <button
                onClick={() => alert("Order button clicked")}
                className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group"
              >
                <span className="group-hover:block hidden transition-all duration-200">
                  Shop Cart
                </span>
                <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />
              </button>

              {/* Darkmode Switch */}
              <div>
                <Darkmode />
              </div>
            </div>
          </div>
        </div>
        {/* Lower Navbar */}
        <div className="flex justify-center">
          <ul className="sm:flex hidden items-center gap-4">
            {Menu.map((data) => (
              <li key={data.id}>
                <a
                  href={data.link}
                  className="inline-block px-4 hover:text-primary duration-200"
                >
                  {data.name}
                </a>
              </li>
            ))}
            {/* Simple Dropdown and Links */}
            <li className="group relative cursor-pointer">
              <a href="#" className="flex items-center gap-[2px] py-2">
                Trending Products
                <span>
                  <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
                </span>
              </a>
              <div className="absolute z-[9999] hidden group-hover:block w-[150px] rounded-md bg-white p-2 text-black shadow-md">
                <ul>
                  {DropdownLinks.map((data) => (
                    <li key={data.id}>
                      <a
                        href={data.link}
                        className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                      >
                        {data.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
