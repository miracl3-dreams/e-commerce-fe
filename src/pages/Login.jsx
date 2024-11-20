import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import Button from "../components/Button";
import axios from "../components/axios";
import { toast, Bounce } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const response = await axios.post("/api/v1/login", formData);

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("authToken", data.data.token);
        localStorage.setItem("userName", data.data.user.name);
        setFormData({ email: "", password: "" });
        toast.success("Successfully Login!", {
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
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white wrapper flex flex-col justify-center items-center h-[100vh] gap-5">
      <h1 className="font-poppins text-2xl p-3 font-bold">Task Management</h1>
      <form
        className="flex flex-col gap-4 items-center border-2 border-white bg-[#D72323] px-5 py-10 rounded-md w-[360px]"
        onSubmit={handleSubmit}
      >
        <h1 className="font-poppins p-3 font-bold">Sign In</h1>
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
