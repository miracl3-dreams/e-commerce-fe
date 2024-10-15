import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import Button from "../components/Button";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Save token in localStorage
      localStorage.setItem("authToken", response.data.token);

      // Redirect to dashboard
      setMessage("Registration successful!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setMessage(errorMsg);
      console.error("Registration Error:", error);
    }
  };

  return (
    <div className="wrapper flex justify-center items-center h-[100vh] gap-1">
      <form
        className="flex flex-col gap-4 items-center bg-yellow-600 px-5 py-10 rounded-md w-[360px]"
        onSubmit={handleSubmit}
      >
        <h1 className="font-poppins">Sign Up</h1>
        <div className="flex items-center gap-1 w-full">
          <FaUser className="icon" />
          <input
            className="py-1 pl-1 w-full"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
        </div>
        <div className="flex items-center gap-1 w-full">
          <FaUser className="icon" />
          <input
            className="py-1 pl-1 w-full"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
          />
        </div>
        <div className="flex items-center gap-1 w-full">
          <FaLock className="icon" />
          <input
            className="py-1 pl-1 w-full"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        <div className="flex items-center gap-1 w-full">
          <FaLock className="icon" />
          <input
            className="py-1 pl-1 w-full"
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
        </div>
        <Button className={"rounded-full px-6 py-1"}>Register</Button>
        <p className="font-poppins">
          Already signed in?{" "}
          <a className="hover:underline" href={"/login"}>
            Log In
          </a>
        </p>
        {message && <p className="mt-2 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default SignUp;
