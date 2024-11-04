import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ItemDetail from "./components/ItemDetail";
import PrivateRoute from "./components/PrivateRoute";
import OrderPage from "./components/Order";
import OrderResult from "./components/OrderResult";
import Item from "./components/Item";
import Header from "./components/Header";
import { handleLogout as logout } from "./api";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // token이 있으면 true, 없으면 false
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    logout();
  };

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/itemDetail/:itemId"
          element={
            <PrivateRoute>
              <ItemDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/order"
          element={
            <PrivateRoute>
              <OrderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-result"
          element={
            <PrivateRoute>
              <OrderResult />
            </PrivateRoute>
          }
        />
        <Route
          path="/item"
          element={
            <PrivateRoute>
              <Item />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
