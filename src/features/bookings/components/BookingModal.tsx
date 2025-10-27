import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import { useBooking } from "../../hotels/hooks/useHotels";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

interface BookingModalProps {
  hotel: any;
  room: any;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  hotel,
  room,
  onClose,
}) => {
  const { isBooking, createBooking } = useBooking();
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    specialRequests: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Calculate nights and total price when dates change
  React.useEffect(() => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const diffTime = checkOut.getTime() - checkIn.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setNights(diffDays);
        setTotalPrice(diffDays * room.price);
        setError("");
      } else {
        setNights(0);
        setTotalPrice(0);
        setError("Check-out date must be after check-in date");
      }
    }
  }, [bookingData.checkIn, bookingData.checkOut, room.price]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: name === "guests" ? parseInt(value) || 1 : value,
    }));
  };

  const validateBooking = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!bookingData.checkIn || !bookingData.checkOut) {
      setError("Please select check-in and check-out dates");
      return false;
    }

    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);

    if (checkIn < today) {
      setError("Check-in date cannot be in the past");
      return false;
    }

    if (checkOut <= checkIn) {
      setError("Check-out date must be after check-in date");
      return false;
    }

    if (bookingData.guests < 1 || bookingData.guests > room.maxGuests) {
      setError(`Number of guests must be between 1 and ${room.maxGuests}`);
      return false;
    }

    if (nights < 1) {
      setError("Minimum stay is 1 night");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateBooking()) {
      return;
    }

    const result = await createBooking({
      hotelId: hotel.id,
      roomId: room.id,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      specialRequests: bookingData.specialRequests,
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/bookings";
      }, 2000);
    } else {
      setError(result.error || "Failed to create booking");
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getDayAfterTomorrow = () => {
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    return dayAfter.toISOString().split("T")[0];
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-card/95 backdrop-blur-xl rounded-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-card/95 backdrop-blur-xl border-b border-border p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Complete Your Booking
              </h2>
              <p className="text-muted-foreground mt-1">
                {hotel.name} - {room.type}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Booking Confirmed!
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your booking has been successfully created.
                </p>
                <p className="text-sm text-muted-foreground">
                  Redirecting to your bookings...
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Room Info */}
                <div className="bg-background rounded-xl p-4 border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{room.type}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {room.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg">
                          Max {room.maxGuests} guests
                        </span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg">
                          {room.bedType}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Per night</p>
                      <p className="text-2xl font-bold text-primary">
                        ${room.price}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Check-in Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="date"
                        name="checkIn"
                        value={bookingData.checkIn}
                        onChange={handleChange}
                        min={getTomorrowDate()}
                        disabled={isBooking}
                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Check-out Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="date"
                        name="checkOut"
                        value={bookingData.checkOut}
                        onChange={handleChange}
                        min={bookingData.checkIn || getDayAfterTomorrow()}
                        disabled={isBooking}
                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="number"
                      name="guests"
                      value={bookingData.guests}
                      onChange={handleChange}
                      min="1"
                      max={room.maxGuests}
                      disabled={isBooking}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum {room.maxGuests} guests allowed for this room
                  </p>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleChange}
                    disabled={isBooking}
                    rows={3}
                    placeholder="e.g., Late check-in, extra pillows, etc."
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>

                {/* Price Summary */}
                {nights > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary/5 rounded-xl p-4 border border-primary/20"
                  >
                    <h3 className="font-semibold text-foreground mb-3">
                      Price Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          ${room.price} × {nights} nights
                        </span>
                        <span className="text-foreground font-medium">
                          ${room.price * nights}
                        </span>
                      </div>
                      <div className="border-t border-primary/20 pt-2 flex justify-between">
                        <span className="font-semibold text-foreground">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          ${totalPrice}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-destructive">
                        Booking Error
                      </p>
                      <p className="text-sm text-destructive/80 mt-1">{error}</p>
                    </div>
                  </motion.div>
                )}

                {/* Cancellation Policy */}
                <div className="bg-background rounded-xl p-4 border border-border">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Cancellation Policy
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {hotel.cancellationPolicy}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={onClose}
                    disabled={isBooking}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isBooking || nights === 0}
                    isLoading={isBooking}
                    icon={
                      !isBooking && <DollarSign className="w-5 h-5" />
                    }
                    className="flex-1"
                  >
                    {isBooking
                      ? "Processing..."
                      : `Confirm & Pay ${totalPrice}`}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};