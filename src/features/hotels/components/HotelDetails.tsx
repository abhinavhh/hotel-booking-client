import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  ChevronLeft,
  Heart,
  Share2,
  Check,
  Users,
  Bed,
} from "lucide-react";
import { DashboardSidebar } from "../../dashboard/components/DashboardSidebar";
import { useHotelDetails } from "../hooks/useHotels";
import { Button } from "../../../components/ui/Button";
import { BookingModal } from "../../bookings/components/BookingModal";
import { useParams } from "react-router-dom";

export const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { hotel, isLoading, error } = useHotelDetails(id!);
  // const { hotel, isLoading, error } = useHotelDetails(hotelId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (hotel?.images && hotel.images.length > 0) {
      setSelectedImage(0);
    }
  }, [hotel]);

  const handleBookRoom = (room: any) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: hotel?.name,
        text: `Check out ${hotel?.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardSidebar currentPath="/hotels" />
        <div className="lg:ml-64">
          <div className="p-4 md:p-8">
            <div className="animate-pulse space-y-8">
              <div className="h-96 bg-card/50 rounded-2xl" />
              <div className="h-64 bg-card/50 rounded-2xl" />
              <div className="h-48 bg-card/50 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardSidebar currentPath="/hotels" />
        <div className="lg:ml-64">
          <div className="p-4 md:p-8">
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-12 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Hotel not found
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

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar currentPath="/hotels" />

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
            <span>Back to Hotels</span>
          </motion.button>

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Main Image */}
              <div className="lg:col-span-8">
                <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden">
                  <img
                    src={hotel.images[selectedImage]}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  {hotel.featured && (
                    <div className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                      Featured Hotel
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isFavorite
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors"
                    >
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="lg:col-span-4 grid grid-cols-4 lg:grid-cols-2 gap-4">
                {hotel.images.slice(1, 5).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index + 1)}
                    className={`relative h-24 lg:h-36 rounded-xl overflow-hidden ${
                      selectedImage === index + 1
                        ? "ring-4 ring-primary"
                        : "hover:opacity-75"
                    } transition-all`}
                  >
                    <img
                      src={image}
                      alt={`${hotel.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Hotel Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-6"
              >
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {hotel.name}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.location.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-lg">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-semibold text-lg">
                      {hotel.rating}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    ({hotel.reviewCount} reviews)
                  </span>
                </div>
                <p className="text-foreground leading-relaxed">
                  {hotel.description}
                </p>
              </motion.div>

              {/* Amenities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-6"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 text-foreground"
                    >
                      <Check className="w-5 h-5 text-primary" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Available Rooms */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-6"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Available Rooms
                </h2>
                <div className="space-y-4">
                  {hotel.rooms.map((room) => (
                    <div
                      key={room.id}
                      className="bg-background rounded-xl p-6 border border-border hover:border-primary transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {room.type}
                          </h3>
                          <p className="text-muted-foreground mb-3">
                            {room.description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="w-4 h-4" />
                              <span>Max {room.maxGuests} guests</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Bed className="w-4 h-4" />
                              <span>{room.bedType}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {room.amenities.map((amenity) => (
                              <span
                                key={amenity}
                                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Per night
                            </p>
                            <p className="text-3xl font-bold text-primary">
                              ${room.price}
                            </p>
                          </div>
                          <Button
                            variant="primary"
                            size="md"
                            onClick={() => handleBookRoom(room)}
                            disabled={!room.available}
                          >
                            {room.available ? "Book Now" : "Not Available"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Reviews */}
              {hotel.reviews && hotel.reviews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-6"
                >
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Guest Reviews
                  </h2>
                  <div className="space-y-4">
                    {hotel.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-background rounded-xl p-4 border border-border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                              {review.userName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {review.userName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-lg">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-semibold">
                              {review.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Booking Summary (Sticky) */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-6 sticky top-4"
              >
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-1">
                    Starting from
                  </p>
                  <p className="text-4xl font-bold text-primary">
                    ${hotel.pricePerNight}
                    <span className="text-base font-normal text-muted-foreground">
                      /night
                    </span>
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Location
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {hotel.location.city}, {hotel.location.state},{" "}
                      {hotel.location.country}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Cancellation Policy
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {hotel.cancellationPolicy}
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    const firstAvailableRoom = hotel.rooms.find(
                      (r) => r.available
                    );
                    if (firstAvailableRoom) {
                      handleBookRoom(firstAvailableRoom);
                    }
                  }}
                >
                  Check Availability
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
        <BookingModal
          hotel={hotel}
          room={selectedRoom}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedRoom(null);
          }}
        />
      )}
    </div>
  );
};
