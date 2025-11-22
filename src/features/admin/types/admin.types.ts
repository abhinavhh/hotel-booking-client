// src/features/admin/types/admin.types.ts

import type { ReactNode } from "react";

export interface DashboardStats {
  totalUsers: number;
  totalHotels: number;
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number;
}

export interface RevenueData {
  _id: {
    year: number;
    month: number;
  };
  revenue: number;
  bookings: number;
}

export interface BookingStatusData {
  _id: string;
  count: number;
}

export interface RecentActivity {
  action: ReactNode;
  description: ReactNode;
  timestamp: string | number | Date;
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  hotelId: {
    _id: string;
    name: string;
  };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  chartData: {
    revenue: RevenueData[];
    bookingStatus: BookingStatusData[];
  };
}

export interface AdminHotel {
  id: string;
  name: string;
  description: string;
  images: string[];
  location: {
    city: string;
    state: string;
    country: string;
    address: string;
  };
  rating: number;
  reviewCount: number;
  amenities: string[];
  rooms: any[];
  pricePerNight: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBooking {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  hotelId: {
    _id: string;
    name: string;
    location: {
      city: string;
      state: string;
      country: string;
    };
  };
  roomId: {
    _id: string;
    type: string;
  };
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  createdAt: string;
}

export interface BookingStats {
  total: number;
  byStatus: Array<{
    _id: string;
    count: number;
  }>;
  totalRevenue: number;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'Admin' | 'User';
  status?: 'Active' | 'Inactive';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  totalBookings?: number;
  totalSpent?: number;
}

export interface UserStats {
  total: number;
  active: number;
  admins: number;
}

export interface RevenueAnalytics {
  _id: {
    year: number;
    month: number;
  };
  revenue: number;
  bookings: number;
}

export interface UserGrowthAnalytics {
  _id: {
    year: number;
    month: number;
  };
  users: number;
}

export interface BookingSourceAnalytics {
  _id: string;
  count: number;
}

export interface RoomTypeAnalytics {
  _id: string;
  bookings: number;
  revenue: number;
}

export interface HotelAnalytics {
  _id: string;
  name: string;
  bookings: number;
  revenue: number;
}

export interface Settings {
  _id?: string;
  general: {
    siteName: string;
    siteUrl?: string;
    supportEmail?: string;
    currency: string;
    timezone: string;
    language?: string;
  };
  email?: {
    provider: string;
    smtpHost?: string;
    smtpPort?: string;
    smtpUser?: string;
    smtpPassword?: string;
    fromEmail?: string;
    fromName?: string;
  };
  payment?: {
    stripeEnabled: boolean;
    stripePublicKey?: string;
    stripeSecretKey?: string;
    razorpayEnabled: boolean;
    razorpayKeyId?: string;
    razorpayKeySecret?: string;
  };
  commission: {
    platformFee: number;
    taxRate: number;
    cancellationFee?: number;
    refundProcessingDays?: number;
  };
  notifications?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    bookingConfirmation: boolean;
    paymentReceived: boolean;
    cancellationNotice: boolean;
  };
  security?: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireSpecialChar: boolean;
    requireNumbers: boolean;
  };
}

export interface PaginationData {
  total: number;
  page: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}