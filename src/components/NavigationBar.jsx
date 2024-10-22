import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";

const NavigationBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <nav className="bg-slate-400 flex justify-between items-center flex-row px-5 py-5">
        <Link to={"/dashboard"} className="text-3xl font-bold text-black">
          Task Management
        </Link>
        <ul className="flex items-center gap-10">
          <li>
            <Link to={"tasks"}>Tasks</Link>
          </li>
          <li>
            <Link to={"list"}>List</Link>
          </li>
          <li>
            <Link to={"contact"}>Contact</Link>
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
