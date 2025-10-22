import { useState, useEffect } from "react";
import api from "../../../lib/api";

export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  location: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  price: number;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
  bookingDate: string;
  paymentStatus: "Paid" | "Pending" | "Refunded";
  specialRequests?: string;
}

export interface BookingFilters {
  status?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
}

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookingFilters>({});

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all bookings for the user
      const response = await api.get("/bookings");
      const bookingsData = response.data.bookings || [];
      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to load bookings";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Filter by status
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter(
        (booking) =>
          booking.status.toLowerCase() === filters.status?.toLowerCase()
      );
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.hotelName.toLowerCase().includes(query) ||
          booking.location.toLowerCase().includes(query) ||
          booking.id.toLowerCase().includes(query)
      );
    }

    // Filter by date range
    if (filters.dateRange) {
      filtered = filtered.filter((booking) => {
        const checkIn = new Date(booking.checkIn);
        const start = new Date(filters.dateRange!.start);
        const end = new Date(filters.dateRange!.end);
        return checkIn >= start && checkIn <= end;
      });
    }

    setFilteredBookings(filtered);
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      await api.post(`/bookings/${bookingId}/cancel`);

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "Cancelled" as const }
            : booking
        )
      );

      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to cancel booking";
      return { success: false, error: errorMessage };
    }
  };

  const getBookingDetails = async (bookingId: string) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return { success: true, booking: response.data.booking };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to load booking details";
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, bookings]);

  return {
    bookings: filteredBookings,
    allBookings: bookings,
    isLoading,
    error,
    filters,
    setFilters,
    cancelBooking,
    getBookingDetails,
    refreshBookings: fetchBookings,
  };
};
