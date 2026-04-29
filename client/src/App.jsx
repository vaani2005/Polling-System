import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import PollList from "./components/PollList";
import CreatePoll from "./components/CreatePoll";
import "./css/Login.css";
import "./css/Register.css";
import "./css/PollList.css";
import "./css/CreatePoll.css";

export default function App() {
  const token = localStorage.getItem("token");

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/polls" element={<PollList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreatePoll />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/polls" />} />
    </Routes>
  );
}
