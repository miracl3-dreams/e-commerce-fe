import React from "react";
import ReactDOM from "react-dom/client"; // Use React 18+
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Adjust the path according to your structure
import App from "./App"; // This is the file you provided earlier

const root = ReactDOM.createRoot(document.getElementById("root")); // Ensure you have a div with id 'root' in your HTML

root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
