import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import axios from "../components/axios";
import { toast, Bounce } from "react-toastify";

const NavigationBar = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

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
      localStorage.removeItem("userName"); // Clear the user's name on logout
      navigate("/login");
    }
  };

  return (
    <div>
      <nav className="bg-[#D72323] flex justify-between items-center flex-row px-5 py-5 text-white">
        <Link to={"/dashboard"} className="text-3xl font-bold text-white">
          Task Management
        </Link>
        <ul className="flex items-center gap-8">
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
              <span className="flex items-center">
                {userName}{" "}
                <button className="ml-2 pt-2" onClick={handleLogout}>
                  <LuLogOut />
                </button>
              </span>
            )}
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default NavigationBar;
