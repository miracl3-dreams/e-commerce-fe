// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await login(formData);
      setFormData({ email: "", password: "" });
      setMessage("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      setMessage("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black wrapper flex justify-center items-center h-[100vh] gap-1">
      <form
        className="flex flex-col gap-4 items-center border-2 border-white bg-slate-400 px-5 py-10 rounded-md w-[360px]"
        onSubmit={handleSubmit}
      >
        <h1 className="font-poppins p-3 font-bold">Task Management Sign In</h1>
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
        <Button
          className={"rounded-full px-6 py-1"}
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </Button>
        {message && <p className="text-white mt-2">{message}</p>}
        <p className="font-poppins">
          Don't have an account?{" "}
          <Link className="hover:underline" to={"/sign-up"}>
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
