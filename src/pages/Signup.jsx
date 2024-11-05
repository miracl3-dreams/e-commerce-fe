import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import Button from "../components/Button";
import axios from "../components/axios";
import { toast, Bounce } from "react-toastify";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await axios.post("/api/v1/register", formData);

      setFormData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });

      toast.success("Successfully Registered!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setMessage(errorMsg);
      console.error("Registration Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white wrapper flex flex-col justify-center items-center h-[100vh] gap-5">
      <h1 className="font-poppins font-bold text-2xl">Task Management</h1>
      <form
        className="flex flex-col gap-4 items-center border-2 border-white bg-[#D72323] px-8 py-10 rounded-md w-[360px]"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h1 className="font-poppins">Sign Up</h1>

        <div className="flex items-center gap-1 w-full">
          <FaUser className="icon" />
          <input
            className="py-1 pl-1 rounded-md w-full"
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
            className="py-1 pl-1 rounded-md w-full"
            type="email"
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
            className="py-1 pl-1 rounded-md w-full"
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
            className="py-1 pl-1 rounded-md w-full"
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
        </div>

        <Button
          className="rounded-full px-6 py-1"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>

        <p className="font-poppins">
          Already have an account?{" "}
          <a className="hover:underline" href="/login">
            Log In
          </a>
        </p>
        {message && <p className="mt-2 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default SignUp;
