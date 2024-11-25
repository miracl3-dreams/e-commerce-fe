import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import Button from "../../components/Button";
import axios from "../../components/axios";
import { toast, Bounce } from "react-toastify";
import { registerSchema } from "../../utils/validations/UserSchema";
// import backgroundImg from "../assets/images/background-image.jpg";
import Sonner from "../../components/Sonner";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value === "") {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({ name: "", email: "", password: "", password_confirmation: "" });

    if (formData.password !== formData.password_confirmation) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password_confirmation: "Passwords do not match",
      }));
      setLoading(false);
      return;
    }

    try {
      registerSchema.parse(formData);

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
      if (error.name === "ZodError") {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Registration Error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Sign Up - Task Management";
  });

  return (
    <>
      <div
        className="bg-cover bg-bottom flex flex-col justify-between min-h-screen"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div className="flex flex-grow justify-center items-center">
          <div className="bg-gray-100 bg-opacity-90 px-5 py-10 rounded-md shadow-md w-[90%] max-w-[400px] md:max-w-[350px] lg:w-[30%]">
            <h1 className="font-poppins text-2xl font-bold text-center mb-5">
              Task Management
            </h1>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <h2 className="font-poppins font-bold text-xl text-center">
                Sign Up
              </h2>

              {/* Name Input */}
              <div className="flex items-center gap-2">
                <FaUser className="text-black" />
                <input
                  className={`flex-1 py-2 px-3 border rounded-md ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}

              {/* Email Input */}
              <div className="flex items-center gap-2">
                <FaUser className="text-black" />
                <input
                  className={`flex-1 py-2 px-3 border rounded-md ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}

              {/* Password Input */}
              <div className="flex items-center gap-2">
                <FaLock className="text-black" />
                <input
                  className={`flex-1 py-2 px-3 border rounded-md ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}

              {/* Confirm Password Input */}
              <div className="flex items-center gap-2">
                <FaLock className="text-black" />
                <input
                  className={`flex-1 py-2 px-3 border rounded-md ${
                    errors.password_confirmation
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
              </div>
              {errors.password_confirmation && (
                <p className="text-sm text-red-500">
                  {errors.password_confirmation}
                </p>
              )}

              {/* Submit Button */}
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2 mt-4"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <Sonner /> : "Register"}
              </Button>

              {/* Redirect to Login */}
              <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 hover:underline">
                  Log In
                </a>
              </p>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default SignUp;
