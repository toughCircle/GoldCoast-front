import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ItemDetail from "./components/ItemDetail";
import PrivateRoute from "./components/PrivateRoute";
import OrderPage from "./components/Order";
import OrderResult from "./components/OrderResult";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
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
      </Routes>
    </Router>
  );
};

export default App;
