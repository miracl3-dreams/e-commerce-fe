import React from "react";
import { Route, Navigate } from "react-router-dom";

const AuthRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem("authToken");

  return (
    <Route
      {...rest}
      element={token ? <Component {...rest} /> : <Navigate to="/login" />}
    />
  );
};

export default AuthRoute;
