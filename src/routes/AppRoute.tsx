import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ProfilePage } from "@/features/profiles/components/ProfilePage";
import { HotelsPage } from "@/features/hotels";
import { BookingsPage } from "@/features/bookings";
import { HotelDetailPage } from "@/features/hotels/components/HotelDetails";
import { BookingDetail } from "@/features/bookings/components/BookingDetail";
import { AdminDashboard } from "@/features/admin/components/AdminDashboard";
import { AdminHotelsPage } from "@/features/admin/components/AdminHotelPage";
import AdminBookingsPage from "@/features/admin/components/AdminBookingPage";
import AdminUsersPage from "@/features/admin/components/AdminUserPage";
import AdminAnalyticsPage from "@/features/admin/components/AdminAnalyticsPage";
import AdminSettingsPage from "@/features/admin/components/AdminSettingsPage";

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("userRole");

  if (!token || user !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />
        <Route path="/hotels/:id" element={<HotelDetailPage />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/hotels" element={<AdminRoute><AdminHotelsPage /></AdminRoute>} />
        <Route path="/admin/bookings" element={<AdminRoute><AdminBookingsPage /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><AdminAnalyticsPage /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
  );
}
