import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { registerSchema } from "../../utils/validations/UserSchema";
import axios from "../../utils/Axios";
import backgroundImg from "../../assets/images/background-image.jpg";
import Button from "../../components/Button";
import Footer from "../../components/Footer";

const registerUser = async (data) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/api/v1/register",
    data
  );
  return response.data;
};

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Registration successful!", {
        position: "top-right",
        autoClose: 1500,
      });
      setFormData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
      setErrors({});
      navigate("/login");
    },
    onError: (error) => {
      if (error.name === "ZodError") {
        const validationErrors = {};
        error.errors.forEach((err) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 1500,
        });
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    try {
      registerSchema.parse(formData);
      registerMutation.mutate(formData);
    } catch (error) {
      if (error.name === "ZodError") {
        const validationErrors = {};
        error.errors.forEach((err) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  useEffect(() => {
    document.title = "Sign Up - Task Management";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="bg-white bg-cover bg-bottom flex justify-center items-center flex-1"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div className="bg-gray-100 bg-opacity-90 px-5 py-10 rounded-md shadow-md w-[90%] max-w-[400px]">
          <h1 className="font-poppins text-2xl font-bold text-center mb-5">
            Task Management
          </h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <h2 className="font-poppins font-bold text-xl text-center">
              Sign Up
            </h2>
            <input
              className="flex-1 py-2 px-3 border rounded-md"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
            <input
              className="flex-1 py-2 px-3 border rounded-md"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
            <input
              className="flex-1 py-2 px-3 border rounded-md"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
            <input
              className="flex-1 py-2 px-3 border rounded-md"
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm">
                {errors.password_confirmation}
              </p>
            )}
            <Button
              className="bg-blue-400 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
              type="submit"
              disabled={registerMutation.isLoading}
            >
              {registerMutation.isLoading ? "Signing Up..." : "Sign Up"}
            </Button>
            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link className="text-blue-500 hover:underline" to={"/login"}>
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
