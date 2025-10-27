import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ProfilePage } from "@/features/profiles/components/ProfilePage";
import { HotelsPage } from "@/features/hotels";
import { BookingsPage } from "@/features/bookings";
import { HotelDetailPage } from "@/features/hotels/components/HotelDetails";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/bookings/:id" element={<BookingsPage />} />
        <Route path="/hotels/:id" element={<HotelDetailPage />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
  );
}
