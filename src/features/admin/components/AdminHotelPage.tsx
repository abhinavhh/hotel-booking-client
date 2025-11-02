import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Star,
  DollarSign,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { useAdminHotels } from "../hooks/useAdmin";
import { Button } from "../../../components/ui/Button";

export const AdminHotelsPage: React.FC = () => {
  const { hotels, isLoading, error, deleteHotel, refreshHotels } = useAdminHotels();
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (hotelId: string, hotelName: string) => {
    if (!confirm(`Are you sure you want to delete "${hotelName}"?`)) return;

    setDeletingId(hotelId);
    const result = await deleteHotel(hotelId);
    setDeletingId(null);

    if (result.success) {
      alert("Hotel deleted successfully");
    } else {
      alert(result.error || "Failed to delete hotel");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar currentPath="/admin/hotels" />

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
                  Hotels Management
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage all hotels in the system
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={refreshHotels}
                  icon={<RefreshCw className="w-4 h-4" />}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => alert("Add Hotel - Implement form")}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Hotel
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search hotels by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card/80 backdrop-blur-xl border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </motion.div>

          {/* Error */}
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

          {/* Hotels Table/Grid */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-card/50 rounded-xl h-32"
                />
              ))}
            </div>
          ) : filteredHotels.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card/80 backdrop-blur-xl rounded-xl border border-border p-12 text-center"
            >
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No hotels found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Add your first hotel to get started"}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredHotels.map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card/80 backdrop-blur-xl rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Hotel Image */}
                    <div className="md:w-64 h-48 md:h-auto">
                      <img
                        src={hotel.images[0]}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Hotel Details */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {hotel.name}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {hotel.location.city}, {hotel.location.country}
                          </p>
                        </div>
                        {hotel.featured && (
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Rating
                          </p>
                          <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            {hotel.rating}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Reviews
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {hotel.reviewCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Rooms
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {hotel.rooms.length}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Price/Night
                          </p>
                          <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {hotel.pricePerNight}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            (window.location.href = `/hotels/${hotel.id}`)
                          }
                          icon={<Eye className="w-4 h-4" />}
                        >
                          View
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => alert("Edit Hotel - Implement form")}
                          icon={<Edit className="w-4 h-4" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDelete(hotel.id, hotel.name)}
                          disabled={deletingId === hotel.id}
                          icon={<Trash2 className="w-4 h-4" />}
                          className="text-red-500 hover:bg-red-500/10"
                        >
                          {deletingId === hotel.id ? "Deleting..." : "Delete"}
                        </Button>
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