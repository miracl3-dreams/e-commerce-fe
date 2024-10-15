import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";

const NavigationBar = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleLogout = () => {
    // Clear the token or any user-related data
    localStorage.removeItem("authToken");

    // Optionally, you can also clear any other user data here

    // Redirect to the login page
    navigate("/login"); // Redirect to the login form
  };

  return (
    <div>
      <nav className="bg-slate-400 flex justify-between items-center flex-row px-5 py-5">
        <Link to={"/dashboard"} className="text-3xl font-bold text-black">
          Task Management
        </Link>
        <ul className="flex items-center gap-10">
          <li>
            <Link to={"/tasks"}>Tasks</Link>
          </li>
          <li>
            <Link to={"/about"}>About</Link>
          </li>
          <li>
            <Link to={"/contact"}>Contact</Link>
          </li>
          <li>
            <button className="pt-2" onClick={handleLogout}>
              <LuLogOut />
            </button>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default NavigationBar;
