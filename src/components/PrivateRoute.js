import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // 로그인 상태 확인

  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
