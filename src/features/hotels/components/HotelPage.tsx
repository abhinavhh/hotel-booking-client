import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Users,
  Wifi,
  Coffee,
  Dumbbell,
  Car,
  Waves,
  UtensilsCrossed,
  Wind,
  ChevronDown,
  Heart,
  Eye,
} from "lucide-react";
import { DashboardSidebar } from "../../dashboard/components/DashboardSidebar";
import { useHotels } from "../hooks/useHotels";
import { Button } from "../../../components/ui/Button";

export const HotelsPage: React.FC = () => {
  const { hotels, isLoading, filters, setFilters, searchHotels } = useHotels();

  const [searchLocation, setSearchLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("popular");

  const amenityIcons: Record<string, any> = {
    WiFi: Wifi,
    "Free Breakfast": Coffee,
    Gym: Dumbbell,
    Parking: Car,
    Pool: Waves,
    Restaurant: UtensilsCrossed,
    "Air Conditioning": Wind,
  };

  const availableAmenities = [
    "WiFi",
    "Free Breakfast",
    "Gym",
    "Parking",
    "Pool",
    "Restaurant",
    "Air Conditioning",
  ];

  const handleSearch = () => {
    searchHotels({
      location: searchLocation,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      rating: selectedRating || undefined,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      sortBy: sortBy as any,
    });
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleViewDetails = (hotelId: string) => {
    window.location.href = `/hotels/${hotelId}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar currentPath="/hotels" />

      <div className="lg:ml-64">
        <div className="p-4 md:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Discover Hotels
            </h1>
            <p className="text-muted-foreground mt-2">
              Find the perfect place for your next stay
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Where are you going?"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-6 py-4 bg-background border border-border rounded-xl hover:bg-primary/10 transition-colors"
                  >
                    <Filter className="w-5 h-5" />
                    <span className="hidden md:inline">Filters</span>
                  </button>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSearch}
                    icon={<Search className="w-5 h-5" />}
                  >
                    Search
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-border space-y-6"
                  >
                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Price Range (per night)
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              min: Number(e.target.value),
                            })
                          }
                          className="w-24 px-3 py-2 bg-background border border-border rounded-lg"
                        />
                        <span className="text-muted-foreground">to</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              max: Number(e.target.value),
                            })
                          }
                          className="w-24 px-3 py-2 bg-background border border-border rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Minimum Rating
                      </label>
                      <div className="flex gap-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setSelectedRating(rating)}
                            className={`flex items-center gap-1 px-4 py-2 rounded-lg border transition-all ${
                              selectedRating === rating
                                ? "bg-primary text-white border-primary"
                                : "bg-background border-border hover:border-primary"
                            }`}
                          >
                            <Star className="w-4 h-4 fill-current" />
                            <span>{rating}+</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Amenities
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableAmenities.map((amenity) => {
                          const Icon = amenityIcons[amenity];
                          return (
                            <button
                              key={amenity}
                              onClick={() => toggleAmenity(amenity)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                                selectedAmenities.includes(amenity)
                                  ? "bg-primary text-white border-primary"
                                  : "bg-background border-border hover:border-primary"
                              }`}
                            >
                              {Icon && <Icon className="w-4 h-4" />}
                              {amenity}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Sort By
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="popular">Most Popular</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Results Count */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4"
            >
              <p className="text-muted-foreground">
                {hotels.length} {hotels.length === 1 ? "hotel" : "hotels"} found
              </p>
            </motion.div>
          )}

          {/* Hotels Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-card/50 rounded-2xl h-96"
                />
              ))}
            </div>
          ) : hotels.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-12 text-center"
            >
              <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No hotels found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                  onClick={() => handleViewDetails(hotel.id)}
                >
                  {/* Hotel Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hotel.images[0]}
                      alt={hotel.name}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                    />
                    {hotel.featured && (
                      <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to favorites logic
                      }}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Hotel Info */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">
                        {hotel.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {hotel.location.city}, {hotel.location.country}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{hotel.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({hotel.reviewCount} reviews)
                      </span>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.slice(0, 4).map((amenity) => {
                        const Icon = amenityIcons[amenity];
                        return (
                          <div
                            key={amenity}
                            className="flex items-center gap-1 text-xs text-muted-foreground bg-background px-2 py-1 rounded-lg"
                          >
                            {Icon && <Icon className="w-3 h-3" />}
                            <span>{amenity}</span>
                          </div>
                        );
                      })}
                      {hotel.amenities.length > 4 && (
                        <div className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-lg">
                          +{hotel.amenities.length - 4} more
                        </div>
                      )}
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <p className="text-sm text-muted-foreground">From</p>
                        <p className="text-2xl font-bold text-primary">
                          ${hotel.pricePerNight}
                          <span className="text-sm text-muted-foreground font-normal">
                            /night
                          </span>
                        </p>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(hotel.id);
                        }}
                        icon={<Eye className="w-4 h-4" />}
                      >
                        View
                      </Button>
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
