import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
  );
}
