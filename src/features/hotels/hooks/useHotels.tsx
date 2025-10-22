import { useState, useEffect } from "react";
import api from "../../../lib/api";

export interface Hotel {
  id: string;
  name: string;
  description: string;
  images: string[];
  location: {
    city: string;
    state: string;
    country: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  rating: number;
  reviewCount: number;
  amenities: string[];
  rooms: Room[];
  pricePerNight: number;
  featured?: boolean;
  cancellationPolicy?: string;
}

export interface Room {
  id: string;
  type: string;
  description: string;
  price: number;
  maxGuests: number;
  bedType: string;
  available: boolean;
  amenities: string[];
}

export interface HotelFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  amenities?: string[];
  guests?: number;
  sortBy?: "price-low" | "price-high" | "rating" | "popular";
}

export interface BookingData {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
}

export const useHotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<HotelFilters>({});

  const fetchHotels = async (searchFilters?: HotelFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (searchFilters?.location) params.append("location", searchFilters.location);
      if (searchFilters?.minPrice) params.append("minPrice", searchFilters.minPrice.toString());
      if (searchFilters?.maxPrice) params.append("maxPrice", searchFilters.maxPrice.toString());
      if (searchFilters?.rating) params.append("rating", searchFilters.rating.toString());
      if (searchFilters?.guests) params.append("guests", searchFilters.guests.toString());
      if (searchFilters?.sortBy) params.append("sortBy", searchFilters.sortBy);

      const response = await api.get(`/hotels?${params.toString()}`);
      const hotelsData = response.data.hotels || [];
      setHotels(hotelsData);
      setFilteredHotels(hotelsData);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to load hotels";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...hotels];

    // Filter by price range
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((hotel) => hotel.pricePerNight >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((hotel) => hotel.pricePerNight <= filters.maxPrice!);
    }

    // Filter by rating
    if (filters.rating) {
      filtered = filtered.filter((hotel) => hotel.rating >= filters.rating!);
    }

    // Filter by amenities
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter((hotel) =>
        filters.amenities!.every((amenity) => hotel.amenities.includes(amenity))
      );
    }

    // Sort hotels
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
          break;
        case "price-high":
          filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "popular":
          filtered.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
      }
    }

    setFilteredHotels(filtered);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, hotels]);

  return {
    hotels: filteredHotels,
    allHotels: hotels,
    isLoading,
    error,
    filters,
    setFilters,
    searchHotels: fetchHotels,
    refreshHotels: () => fetchHotels(),
  };
};

export const useHotelDetails = (hotelId: string) => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHotelDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/hotels/${hotelId}`);
      setHotel(response.data.hotel);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to load hotel details";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hotelId) {
      fetchHotelDetails();
    }
  }, [hotelId]);

  return {
    hotel,
    isLoading,
    error,
    refreshHotel: fetchHotelDetails,
  };
};

export const useBooking = () => {
  const [isBooking, setIsBooking] = useState(false);

  const createBooking = async (bookingData: BookingData) => {
    setIsBooking(true);

    try {
      const response = await api.post("/bookings", bookingData);
      return {
        success: true,
        booking: response.data.booking,
        message: "Booking created successfully",
      };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create booking";
      return { success: false, error: errorMessage };
    } finally {
      setIsBooking(false);
    }
  };

  return {
    isBooking,
    createBooking,
  };
};