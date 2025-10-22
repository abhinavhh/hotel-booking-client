import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  XCircle,
  DollarSign,
  Plus,
  RefreshCw,
} from "lucide-react";
import { DashboardSidebar } from "../features/dashboard/components/DashboardSidebar";
import { StatCard } from "../features/dashboard/components/StatCard";
import { RecentBookings } from "../features/dashboard/components/RecentBookings";
import { useDashboard, useUser } from "../features/dashboard/hooks/useDashboard";
import { Button } from "../components/ui/Button";

export const DashboardPage: React.FC = () => {
  const { stats, recentBookings, isLoading, error, refreshDashboard } =
    useDashboard();
  const { user, isLoading: userLoading } = useUser();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleBookNewStay = () => {
    window.location.href = "/hotels";
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar currentPath="/dashboard" />

      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="p-4 md:p-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {getGreeting()}
                  {!userLoading && user && (
                    <span className="text-primary">, {user.name}!</span>
                  )}
                </h1>
                <p className="text-muted-foreground mt-2">
                  Welcome back to your dashboard
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={refreshDashboard}
                  icon={<RefreshCw className="w-4 h-4" />}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleBookNewStay}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Book New Stay
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6 flex items-center gap-3"
            >
              <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  Failed to load dashboard data
                </p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Bookings"
              value={isLoading ? "..." : stats.totalBookings}
              icon={Calendar}
              delay={0}
              iconColor="text-blue-500"
              iconBgColor="bg-blue-500/10"
            />
            <StatCard
              title="Upcoming Stays"
              value={isLoading ? "..." : stats.upcomingStays}
              icon={TrendingUp}
              delay={0.1}
              iconColor="text-green-500"
              iconBgColor="bg-green-500/10"
            />
            <StatCard
              title="Cancelled"
              value={isLoading ? "..." : stats.cancelledBookings}
              icon={XCircle}
              delay={0.2}
              iconColor="text-red-500"
              iconBgColor="bg-red-500/10"
            />
            <StatCard
              title="Total Spent"
              value={
                isLoading ? "..." : `$${stats.totalSpent.toLocaleString()}`
              }
              icon={DollarSign}
              delay={0.3}
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
            />
          </div>

          {/* Recent Bookings */}
          <RecentBookings bookings={recentBookings} isLoading={isLoading} />

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border border-primary/20"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Ready for your next adventure?
                </h3>
                <p className="text-muted-foreground">
                  Discover amazing hotels and create unforgettable memories
                </p>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleBookNewStay}
                icon={<Plus className="w-5 h-5" />}
                className="whitespace-nowrap"
              >
                Explore Hotels
              </Button>
            </div>
          </motion.div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            <p>
              Need help?{" "}
              <a href="/support" className="text-primary hover:underline">
                Contact Support
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
