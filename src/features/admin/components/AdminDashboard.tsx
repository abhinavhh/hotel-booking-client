import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Hotel,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw,
} from "lucide-react";

import { AdminSidebar } from "./AdminSidebar";
import { useAdminDashboard } from "../hooks/useAdmin";
import { Button } from "../../../components/ui/Button";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const AdminDashboard: React.FC = () => {
  const { data, loading, error, refetch } = useAdminDashboard();

  // ✅ Safely pull data with fallbacks
  const stats = data?.stats ?? {
    totalUsers: 0,
    totalHotels: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalRevenue: 0,
  };

  const recentActivity = data?.recentActivity ?? [];
  const chartData = data?.chartData ?? {
    revenue: [],
    bookingStatus: [],
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      change: "+12.5%",
      isPositive: true,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Hotels",
      value: stats.totalHotels,
      icon: Hotel,
      change: "+8.2%",
      isPositive: true,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Active Bookings",
      value: stats.activeBookings,
      icon: Calendar,
      change: "+15.3%",
      isPositive: true,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: "+23.1%",
      isPositive: true,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar currentPath="/admin" />

      <div className="lg:ml-64">
        <div className="p-4 md:p-8">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Welcome back! Here's what's happening today.
                </p>
              </div>

              <Button
                variant="secondary"
                size="md"
                onClick={refetch}
                icon={<RefreshCw className="w-4 h-4" />}
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
          </motion.div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <h3 className="text-2xl font-bold text-foreground">
                        {loading ? "..." : stat.value}
                      </h3>
                    </div>

                    <div className={`${stat.bgColor} p-3 rounded-xl`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {stat.isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.isPositive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      vs last month
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* REVENUE LINE CHART */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-6"
            >
              <h3 className="text-xl font-bold text-foreground mb-6">
                Revenue Overview
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333",
                    }}
                  />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* BOOKINGS PIE CHART */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-6"
            >
              <h3 className="text-xl font-bold text-foreground mb-6">
                Bookings by Status
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.bookingStatus.map((item: any) => ({
                      name: item.name ?? (item._id ? String(item._id) : ""),
                      value: item.value ?? item.count ?? 0,
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) =>
                      `${name ?? ""} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    dataKey="value"
                  >
                    {chartData.bookingStatus.map((item: any, index: number) => (
                      <Cell
                        key={item._id ?? index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* ACTIVITY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-6"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">
              Recent Activity
            </h3>

            <div className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-background h-16 rounded-lg"
                    />
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No recent activity
                </p>
              ) : (
                recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
