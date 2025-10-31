import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  ChevronLeft,
  Download,
  Share2,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Home,
} from "lucide-react";
import { DashboardSidebar } from "../../dashboard/components/DashboardSidebar";
import { useBookings } from "../hooks/useBookings";
import { Button } from "../../../components/ui/Button";

export const BookingDetail: React.FC = () => {
  const { id: bookingId } = useParams<{ id: string }>();
  const { getBookingDetails } = useBookings();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (bookingId) {
      loadBookingDetails();
    }
  }, [bookingId]);

  const loadBookingDetails = async () => {
    if (!bookingId) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await getBookingDetails(bookingId);
      if (result.success) {
        setBooking(result.booking);
      } else {
        setError(result.error || "Failed to load booking details");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load booking details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleDownloadReceipt = () => {
    // Implement PDF download
    alert("Receipt download - Integrate with PDF generation service");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Booking Details",
        text: `My booking at ${booking?.hotelName}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle className="w-6 h-6" />;
      case "Pending":
        return <Clock className="w-6 h-6" />;
      case "Cancelled":
        return <XCircle className="w-6 h-6" />;
      case "Completed":
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <AlertCircle className="w-6 h-6" />;
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
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardSidebar currentPath="/bookings" />
        <div className="lg:ml-64">
          <div className="p-4 md:p-8">
            <div className="animate-pulse space-y-8">
              <div className="h-96 bg-card/50 rounded-2xl" />
              <div className="h-64 bg-card/50 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardSidebar currentPath="/bookings" />
        <div className="lg:ml-64">
          <div className="p-4 md:p-8">
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-12 text-center">
              <AlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Booking Not Found
              </h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button variant="primary" onClick={handleBack}>
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const nights = calculateNights(booking.checkIn, booking.checkOut);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar currentPath="/bookings" />

      <div className="lg:ml-64">
        <div className="p-4 md:p-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Bookings</span>
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Booking Details
                </h1>
                <p className="text-muted-foreground mt-2">
                  Booking ID: <span className="font-mono">{booking.id}</span>
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleDownloadReceipt}
                  icon={<Download className="w-4 h-4" />}
                >
                  Download
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleShare}
                  icon={<Share2 className="w-4 h-4" />}
                >
                  Share
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hotel Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border overflow-hidden"
              >
                {/* Hotel Image */}
                <div className="relative h-64">
                  <img
                    src={booking.hotelImage}
                    alt={booking.hotelName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {booking.hotelName}
                    </h2>
                    <p className="text-white/80 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {booking.location}
                    </p>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                    {booking.paymentStatus && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border bg-primary/10 text-primary border-primary/20">
                        <CreditCard className="w-4 h-4" />
                        {booking.paymentStatus}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-background rounded-xl p-4 border border-border">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Check-in
                          </p>
                          <p className="font-semibold text-foreground">
                            {formatDate(booking.checkIn)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            After 3:00 PM
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background rounded-xl p-4 border border-border">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Check-out
                          </p>
                          <p className="font-semibold text-foreground">
                            {formatDate(booking.checkOut)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Before 11:00 AM
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background rounded-xl p-4 border border-border">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Guests
                          </p>
                          <p className="font-semibold text-foreground">
                            {booking.guests}{" "}
                            {booking.guests === 1 ? "Guest" : "Guests"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background rounded-xl p-4 border border-border">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Home className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Room Type
                          </p>
                          <p className="font-semibold text-foreground">
                            {booking.roomType}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="bg-background rounded-xl p-4 border border-border">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">
                            Special Requests
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.specialRequests}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Important Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-6"
              >
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Important Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Check-in Requirements
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Valid photo ID and credit card required at check-in
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Cancellation Policy
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Free cancellation up to 24 hours before check-in
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Confirmation
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Booking confirmation has been sent to your email
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-6 sticky top-4"
              >
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Price Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {nights} {nights === 1 ? "night" : "nights"}
                    </span>
                    <span className="text-foreground font-medium">
                      ₹{(booking.price / nights).toFixed(0)} × {nights}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{booking.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Includes all taxes and fees
                  </div>
                </div>

                {booking.bookingDate && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">Booked on</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(booking.bookingDate)}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-6"
              >
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Need Help?
                </h3>
                <div className="space-y-3">
                  <a
                    href="tel:+1234567890"
                    className="flex items-center gap-3 p-3 bg-background rounded-xl hover:bg-primary/5 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Call Us
                      </p>
                      <p className="text-xs text-muted-foreground">
                        +1 (234) 567-890
                      </p>
                    </div>
                  </a>
                  <a
                    href="mailto:support@hotelbooking.com"
                    className="flex items-center gap-3 p-3 bg-background rounded-xl hover:bg-primary/5 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Email Us
                      </p>
                      <p className="text-xs text-muted-foreground">
                        support@hotelbooking.com
                      </p>
                    </div>
                  </a>
                </div>
              </motion.div>

              {/* Actions */}
              {booking.status === "Confirmed" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full text-red-500 hover:bg-red-500/10"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to cancel this booking?")
                      ) {
                        // Implement cancel logic
                        alert("Cancel booking functionality");
                      }
                    }}
                  >
                    Cancel Booking
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
