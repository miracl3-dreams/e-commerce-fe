import React, { useState } from "react";
import Logo from "../../assets/hero/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping, FaBars, FaCaretDown } from "react-icons/fa6";
import DarkMode from "../DarkMode/DarkMode";
import { RxAvatar } from "react-icons/rx";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Menu = [
  { id: 1, name: "Home", link: "#" },
  { id: 2, name: "All Brands", link: "#" },
  { id: 3, name: "Blog", link: "#" },
];

const DropdownLinks = [
  { id: 1, name: "Make Up", link: "#" },
  { id: 2, name: "Eyeliners", link: "#" },
];

const Navbar = ({ scrollToAllProducts }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    message: "",
  });
  const navigate = useNavigate();

  const handleFeedbackChange = (e) => {
    setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
  };

  const handleSubmitFeedback = () => {
    const { name, message } = feedbackData;
    const ownerEmail = "lunas.danielle.10262002@gmail.com";
    const subject = name
      ? `Customer Feedback from ${name}`
      : "Customer Feedback in KGW Cosmetics";
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${ownerEmail}&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;

    window.open(gmailLink, "_blank");
    setFeedbackOpen(false);
  };

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      {/* Upper Navbar */}
      <div className="bg-primary/80 py-2">
        <div className="container flex justify-between items-center px-4 sm:px-8">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 font-bold text-2xl sm:text-3xl"
          >
            <img
              src={Logo}
              alt="Logo"
              className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover"
            />
            <span className="whitespace-nowrap">KGW Cosmetics</span>
          </a>

          {/* Right Section */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Search bar */}
            <div className="relative group">
              <input
                type="text"
                placeholder="Search"
                className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-4 py-1 pl-2 pr-10 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800"
              />
              <IoMdSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3" />
            </div>

            {/* Customer Feedback Button */}
            <button
              onClick={() => setFeedbackOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-full flex items-center gap-3 transition-all duration-200"
            >
              <RxAvatar className="text-xl text-white drop-shadow-xl cursor-pointer" />
              <span>Feedback</span>
            </button>

            {/* Shop Cart Button */}
            <button
              onClick={scrollToAllProducts} // Scroll to AllProducts section
              className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group"
            >
              <span className="group-hover:block hidden transition-all duration-200">
                Shop Cart
              </span>
              <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />
            </button>

            {/* Darkmode Switch */}
            <DarkMode />
          </div>

          {/* Mobile Burger Menu Button */}
          <button
            className="sm:hidden text-xl focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden ${
          menuOpen ? "block" : "hidden"
        } bg-white dark:bg-gray-900 py-4 px-6 shadow-md`}
      >
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-primary dark:border-gray-500 dark:bg-gray-800"
          />
          <IoMdSearch className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-500" />
        </div>

        {/* Customer & Order Buttons */}
        <div className="flex flex-col gap-4">
          {/* Opens Feedback Modal on Click */}
          <button
            onClick={() => setFeedbackOpen(true)}
            className="flex items-center gap-2"
          >
            <RxAvatar className="text-xl text-gray-700 dark:text-white" />
            <span>Customer Feedback</span>
          </button>

          <button
            onClick={scrollToAllProducts}
            className="flex items-center gap-2"
          >
            <FaCartShopping className="text-xl text-gray-700 dark:text-white" />
            <span>Orders</span>
          </button>
        </div>
      </div>

      {/* Lower Navbar */}
      <div className="hidden sm:flex justify-center">
        <ul className="flex items-center gap-4">
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
          {/* Dropdown */}
          <li className="group relative cursor-pointer">
            <a href="#" className="flex items-center gap-[2px] py-2">
              Trending Products
              <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
            </a>
            <div className="absolute hidden group-hover:block w-[150px] rounded-md bg-white p-2 text-black shadow-md">
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

      {/* Feedback Modal */}
      {feedbackOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Customer Feedback</h2>
              <FaTimes
                className="text-xl cursor-pointer"
                onClick={() => setFeedbackOpen(false)}
              />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Your Name (Optional)"
              value={feedbackData.name}
              onChange={handleFeedbackChange}
              className="w-full mb-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
            <textarea
              name="message"
              placeholder="Your Feedback"
              value={feedbackData.message}
              onChange={handleFeedbackChange}
              className="w-full mb-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              rows="4"
            />
            <button
              onClick={handleSubmitFeedback}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-all"
            >
              Send Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
