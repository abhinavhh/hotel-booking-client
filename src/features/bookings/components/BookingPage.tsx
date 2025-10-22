import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle as CancelIcon,
} from "lucide-react";
import { DashboardSidebar } from "../../dashboard/components/DashboardSidebar";
import { useBookings } from "../hooks/useBookings";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

export const BookingsPage: React.FC = () => {
  const {
    bookings,
    isLoading,
    error,
    filters,
    setFilters,
    cancelBooking,
    refreshBookings,
  } = useBookings();

  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, searchQuery: query });
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setFilters({ ...filters, status });
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setCancellingId(bookingId);
    const result = await cancelBooking(bookingId);
    setCancellingId(null);

    if (result.success) {
      alert("Booking cancelled successfully");
    } else {
      alert(result.error || "Failed to cancel booking");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Cancelled":
        return <CancelIcon className="w-4 h-4" />;
      case "Completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "Completed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
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

  const statusOptions = [
    { value: "all", label: "All Bookings" },
    { value: "confirmed", label: "Confirmed" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar currentPath="/bookings" />

      <div className="lg:ml-64">
        <div className="p-4 md:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  My Bookings
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage and view all your hotel reservations
                </p>
              </div>

              <Button
                variant="secondary"
                size="md"
                onClick={refreshBookings}
                icon={<RefreshCw className="w-4 h-4" />}
                disabled={isLoading}
              >
                Refresh
              </Button>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 space-y-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by hotel name, location, or booking ID..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-card/80 backdrop-blur-xl border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-card/80 backdrop-blur-xl border border-border rounded-xl hover:bg-primary/10 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filter Options */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-card/80 backdrop-blur-xl border border-border rounded-xl p-4"
                >
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusFilter(option.value)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          selectedStatus === option.value
                            ? "bg-primary text-white"
                            : "bg-background hover:bg-primary/10"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}

          {/* Bookings List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-card/50 rounded-xl h-48"
                />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card/80 backdrop-blur-xl rounded-xl border border-border p-12 text-center"
            >
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No bookings found
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedStatus !== "all"
                  ? "Try adjusting your filters"
                  : "Start planning your next adventure!"}
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => (window.location.href = "/hotels")}
              >
                Explore Hotels
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card/80 backdrop-blur-xl rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Hotel Image */}
                    <div className="md:w-64 h-48 md:h-auto">
                      <img
                        src={booking.hotelImage}
                        alt={booking.hotelName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {booking.hotelName}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {booking.location}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Check-in
                          </p>
                          <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(booking.checkIn)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Check-out
                          </p>
                          <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(booking.checkOut)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Guests
                          </p>
                          <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {booking.guests}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Total Price
                          </p>
                          <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {booking.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Room Type
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {booking.roomType}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              (window.location.href = `/bookings/${booking.id}`)
                            }
                          >
                            View Details
                          </Button>
                          {booking.status === "Confirmed" && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={cancellingId === booking.id}
                              className="text-red-500 hover:bg-red-500/10"
                            >
                              {cancellingId === booking.id
                                ? "Cancelling..."
                                : "Cancel"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
