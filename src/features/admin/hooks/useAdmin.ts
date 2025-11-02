// src/features/admin/hooks/useAdmin.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import type {
  DashboardData,
  AdminHotel,
  AdminBooking,
  AdminUser,
  BookingStats,
  UserStats,
  RevenueAnalytics,
  UserGrowthAnalytics,
  BookingSourceAnalytics,
  RoomTypeAnalytics,
  HotelAnalytics,
  Settings,
  PaginationData,
  ApiResponse
} from '../types/admin.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Dashboard Hook
export const useAdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse<DashboardData>>(
        `${API_URL}/admin/dashboard`,
        getAuthHeaders()
      );
      
      if (response.data.success && response.data.data) {
        setData(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { data, loading, error, refetch: fetchDashboard };
};

// Hotels Hook
export const useAdminHotels = (search?: string, page: number = 1) => {
  const [hotels, setHotels] = useState<AdminHotel[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('page', page.toString());
      params.append('limit', '10');

      const response = await axios.get<ApiResponse<{ hotels: AdminHotel[]; pagination: PaginationData }>>(
        `${API_URL}/admin/hotels?${params.toString()}`,
        getAuthHeaders()
      );

      if (response.data.success && response.data.data) {
        setHotels(response.data.data.hotels);
        setPagination(response.data.data.pagination);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const deleteHotel = async (id: string) => {
    try {
      await axios.delete(
        `${API_URL}/admin/hotels/${id}`,
        getAuthHeaders()
      );
      fetchHotels();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message || 'Failed to delete hotel' };
    }
  };

  const updateHotel = async (id: string, data: Partial<AdminHotel>) => {
    try {
      await axios.put(
        `${API_URL}/admin/hotels/${id}`,
        data,
        getAuthHeaders()
      );
      fetchHotels();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message || 'Failed to update hotel' };
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [search, page]);

  return { hotels, pagination, loading, error, refetch: fetchHotels, deleteHotel, updateHotel };
};

// Bookings Hook
export const useAdminBookings = (status?: string, search?: string, page: number = 1) => {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      params.append('page', page.toString());
      params.append('limit', '10');

      const response = await axios.get<ApiResponse<{
        bookings: AdminBooking[];
        stats: BookingStats;
        pagination: PaginationData;
      }>>(
        `${API_URL}/admin/bookings?${params.toString()}`,
        getAuthHeaders()
      );

      if (response.data.success && response.data.data) {
        setBookings(response.data.data.bookings);
        setStats(response.data.data.stats);
        setPagination(response.data.data.pagination);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await axios.patch(
        `${API_URL}/admin/bookings/${id}/status`,
        { status },
        getAuthHeaders()
      );
      fetchBookings();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message || 'Failed to update booking' };
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      await axios.delete(
        `${API_URL}/admin/bookings/${id}`,
        getAuthHeaders()
      );
      fetchBookings();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message || 'Failed to cancel booking' };
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [status, search, page]);

  return { bookings, stats, pagination, loading, error, refetch: fetchBookings, updateBookingStatus, cancelBooking };
};

// Users Hook
export const useAdminUsers = (role?: string, search?: string, page: number = 1) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (role) params.append('role', role);
      if (search) params.append('search', search);
      params.append('page', page.toString());
      params.append('limit', '10');

      const response = await axios.get<ApiResponse<{
        users: AdminUser[];
        stats: UserStats;
        pagination: PaginationData;
      }>>(
        `${API_URL}/admin/users?${params.toString()}`,
        getAuthHeaders()
      );

      if (response.data.success && response.data.data) {
        setUsers(response.data.data.users);
        setStats(response.data.data.stats);
        setPagination(response.data.data.pagination);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (id: string, role: 'Admin' | 'User') => {
    try {
      await axios.patch(
        `${API_URL}/admin/users/${id}/role`,
        { role },
        getAuthHeaders()
      );
      fetchUsers();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message || 'Failed to update user role' };
    }
  };

  const updateUserStatus = async (id: string, status: 'Active' | 'Inactive') => {
    try {
      await axios.patch(
        `${API_URL}/admin/users/${id}/status`,
        { status },
        getAuthHeaders()
      );
      fetchUsers();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message || 'Failed to update user status' };
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(
        `${API_URL}/admin/users/${id}`,
        getAuthHeaders()
      );
      fetchUsers();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message || 'Failed to delete user' };
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role, search, page]);

  return { users, stats, pagination, loading, error, refetch: fetchUsers, updateUserRole, updateUserStatus, deleteUser };
};

// Analytics Hooks
export const useRevenueAnalytics = (period: string = '12months') => {
  const [data, setData] = useState<RevenueAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse<RevenueAnalytics[]>>(
          `${API_URL}/admin/analytics/revenue?period=${period}`,
          getAuthHeaders()
        );
        
        if (response.data.success && response.data.data) {
          setData(response.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch revenue analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  return { data, loading, error };
};

export const useUserAnalytics = () => {
  const [data, setData] = useState<UserGrowthAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse<UserGrowthAnalytics[]>>(
          `${API_URL}/admin/analytics/users`,
          getAuthHeaders()
        );
        
        if (response.data.success && response.data.data) {
          setData(response.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch user analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export const useBookingAnalytics = () => {
  const [data, setData] = useState<{
    sources: BookingSourceAnalytics[];
    roomTypes: RoomTypeAnalytics[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse<{
          sources: BookingSourceAnalytics[];
          roomTypes: RoomTypeAnalytics[];
        }>>(
          `${API_URL}/admin/analytics/bookings`,
          getAuthHeaders()
        );
        
        if (response.data.success && response.data.data) {
          setData(response.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch booking analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export const useHotelAnalytics = () => {
  const [data, setData] = useState<HotelAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse<HotelAnalytics[]>>(
          `${API_URL}/admin/analytics/hotels`,
          getAuthHeaders()
        );
        
        if (response.data.success && response.data.data) {
          setData(response.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch hotel analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

// Settings Hook
export const useAdminSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse<Settings>>(
        `${API_URL}/admin/settings`,
        getAuthHeaders()
      );
      
      if (response.data.success && response.data.data) {
        setSettings(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (data: Partial<Settings>) => {
    try {
      const response = await axios.put<ApiResponse<Settings>>(
        `${API_URL}/admin/settings`,
        data,
        getAuthHeaders()
      );
      
      if (response.data.success && response.data.data) {
        setSettings(response.data.data);
        return { success: true };
      }
      return { success: false, error: 'Failed to update settings' };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message || 'Failed to update settings' };
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, error, updateSettings, refetch: fetchSettings };
};