import { useState, useEffect } from "react";
import api from "../../../lib/api";

export interface Booking {
  id: string;
  hotelName: string;
  hotelImage?: string;
  checkIn: string;
  checkOut: string;
  price: number;
  status: "Confirmed" | "Pending" | "Cancelled";
  roomType?: string;
  location?: string;
}

export interface DashboardStats {
  totalBookings: number;
  upcomingStays: number;
  cancelledBookings: number;
  totalSpent: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentBookings: Booking[];
}

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {
      totalBookings: 0,
      upcomingStays: 0,
      cancelledBookings: 0,
      totalSpent: 0,
    },
    recentBookings: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get("/dashboard");
      const data = response.data;

      setDashboardData({
        stats: data.stats || {
          totalBookings: 0,
          upcomingStays: 0,
          cancelledBookings: 0,
          totalSpent: 0,
        },
        recentBookings: data.recentBookings || [],
      });
    } catch (err: any) {
      let errorMessage = "Failed to load dashboard data";

      if (err.response) {
        errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          errorMessage;
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refreshDashboard = () => {
    fetchDashboardData();
  };

  return {
    stats: dashboardData.stats,
    recentBookings: dashboardData.recentBookings,
    isLoading,
    error,
    refreshDashboard,
  };
};

export const useUser = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        // Fallback to dummy data if API fails
        setUser({
          name: "John Doe",
          email: "john@example.com",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading };
};
