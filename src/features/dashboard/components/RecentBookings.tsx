import React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, DollarSign } from "lucide-react";
import type{ Booking } from "../hooks/useDashboard";

interface RecentBookingsProps {
  bookings: Booking[];
  isLoading: boolean;
}

export const RecentBookings: React.FC<RecentBookingsProps> = ({
  bookings,
  isLoading,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Recent Bookings
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-muted/20 rounded-lg h-24"
            />
          ))}
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border p-6"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Recent Bookings
        </h2>
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No bookings yet</p>
          <p className="text-muted-foreground text-sm mt-2">
            Start planning your next adventure!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border p-6"
    >
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Recent Bookings
      </h2>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                Hotel
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                Check-in / Check-out
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                Price
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <motion.tr
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ backgroundColor: "rgba(var(--primary-rgb), 0.05)" }}
                className="border-b border-border/50 last:border-0 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {booking.hotelImage && (
                      <img
                        src={booking.hotelImage}
                        alt={booking.hotelName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-foreground">
                        {booking.hotelName}
                      </p>
                      {booking.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {booking.location}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-foreground">
                        {formatDate(booking.checkIn)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        to {formatDate(booking.checkOut)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1 text-foreground font-semibold">
                    <DollarSign className="w-4 h-4" />
                    {booking.price.toLocaleString()}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {bookings.map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-background/50 rounded-lg p-4 border border-border space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {booking.hotelName}
                </h3>
                {booking.location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {booking.location}
                  </p>
                )}
              </div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
              </span>
            </div>

            <div className="flex items-center gap-1 text-foreground font-semibold">
              <DollarSign className="w-4 h-4" />
              {booking.price.toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};