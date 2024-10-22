import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // Ensure cookies are sent with requests
});

// Add a request interceptor to set the CSRF token
instance.interceptors.request.use((config) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1]; // Get the CSRF token from cookies

  if (token) {
    config.headers["X-XSRF-TOKEN"] = token; // Include the CSRF token in headers
  }
  return config;
});

export default instance;
