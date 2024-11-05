import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
import { MdArrowDropDown } from "react-icons/md";
import axios from "../components/axios";
import { toast, Bounce } from "react-toastify";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";

const NavigationBar = () => {
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileView, setDesktopView] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleHamburgerButton = () => {
    setDesktopView((e) => !e);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.warn("No token found, redirecting to login.");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "/api/v1/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Successfully Logout!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userName");
      navigate("/login");
    }
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div>
      <nav className="bg-[#D72323] flex justify-between items-center flex-row px-5 py-5 text-white">
        <Link to={"/dashboard"} className="text-3xl font-bold text-white">
          Task Management
        </Link>
        <ul className="hidden lg:flex items-center gap-8">
          <li>
            <Link to={"tasks"}>Tasks</Link>
          </li>
          <li>
            <Link to={"list"}>List</Link>
          </li>
          <li>
            <Link to={"contact"}>Contact</Link>
          </li>
          <li className="flex items-center gap-4">
            {userName && (
              <div className="relative">
                <span
                  className="flex items-center cursor-pointer"
                  onClick={toggleDropdown}
                >
                  {userName} <MdArrowDropDown className="ml-1 text-2xl" />
                </span>
                {isDropdownOpen && (
                  <div className="absolute z-10 right-0 mt-2 w-32 bg-white text-black shadow-md rounded-md p-2">
                    <button
                      className="flex items-center gap-2 px-2 py-1 w-full hover:bg-gray-100 rounded text-left"
                      onClick={handleSettings}
                    >
                      <FiSettings /> Settings
                    </button>
                    <button
                      className="flex items-center gap-2 px-2 py-1 w-full hover:bg-gray-100 rounded text-left"
                      onClick={handleLogout}
                    >
                      <LuLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        </ul>
        <button className="text-2xl lg:hidden" onClick={handleHamburgerButton}>
          {mobileView ? <RxCross2 /> : <GiHamburgerMenu />}
        </button>
        {mobileView ? (
          <ul className="fixed left-0 top-0 z-10 bg-[#D72323] flex flex-col items-center gap-1 px-5 pt-10 h-screen">
            <li>
              <Link onClick={handleHamburgerButton} to={"tasks"}>
                Tasks
              </Link>
            </li>
            <li>
              <Link onClick={handleHamburgerButton} to={"list"}>
                List
              </Link>
            </li>
            <li>
              <Link onClick={handleHamburgerButton} to={"contact"}>
                Contact
              </Link>
            </li>
            <li className="flex items-center gap-4">
              {userName && (
                <div className="relative">
                  <span
                    className="flex items-center cursor-pointer"
                    onClick={toggleDropdown}
                  >
                    {userName} <MdArrowDropDown className="ml-1 text-2xl" />
                  </span>
                  {isDropdownOpen && (
                    <div className="absolute z-10 right-0 mt-2 w-32 bg-white text-black shadow-md rounded-md p-2">
                      <button
                        className="flex items-center gap-2 px-2 py-1 w-full hover:bg-gray-100 rounded text-left"
                        onClick={handleSettings}
                      >
                        <FiSettings /> Settings
                      </button>
                      <button
                        className="flex items-center gap-2 px-2 py-1 w-full hover:bg-gray-100 rounded text-left"
                        onClick={handleLogout}
                      >
                        <LuLogOut /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          </ul>
        ) : null}
      </nav>
      <Outlet />
    </div>
  );
};

export default NavigationBar;
