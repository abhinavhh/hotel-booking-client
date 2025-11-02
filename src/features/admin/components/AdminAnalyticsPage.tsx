import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { AdminSidebar } from "../components/AdminSidebar";

const AdminAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("30days");

  // Revenue data
  const revenueData = [
    { month: "Jan", revenue: 45000, bookings: 45 },
    { month: "Feb", revenue: 52000, bookings: 52 },
    { month: "Mar", revenue: 48000, bookings: 48 },
    { month: "Apr", revenue: 61000, bookings: 61 },
    { month: "May", revenue: 55000, bookings: 55 },
    { month: "Jun", revenue: 67000, bookings: 67 },
    { month: "Jul", revenue: 72000, bookings: 72 },
    { month: "Aug", revenue: 68000, bookings: 68 },
    { month: "Sep", revenue: 75000, bookings: 75 },
    { month: "Oct", revenue: 82000, bookings: 82 },
    { month: "Nov", revenue: 88000, bookings: 88 },
  ];

  // Popular hotels data
  const popularHotelsData = [
    { name: "Grand Plaza", bookings: 145, revenue: 289000 },
    { name: "Ocean View", bookings: 132, revenue: 264000 },
    { name: "City Center", bookings: 118, revenue: 189000 },
    { name: "Mountain Lodge", bookings: 95, revenue: 171000 },
    { name: "Beach Resort", bookings: 87, revenue: 156000 },
  ];

  // User growth data
  const userGrowthData = [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 145 },
    { month: "Mar", users: 168 },
    { month: "Apr", users: 192 },
    { month: "May", users: 215 },
    { month: "Jun", users: 248 },
    { month: "Jul", users: 276 },
    { month: "Aug", users: 298 },
    { month: "Sep", users: 325 },
    { month: "Oct", users: 356 },
    { month: "Nov", users: 389 },
  ];

  // Booking sources
  const bookingSourcesData = [
    { name: "Direct", value: 45, color: "#3b82f6" },
    { name: "Mobile App", value: 30, color: "#10b981" },
    { name: "Referral", value: 15, color: "#f59e0b" },
    { name: "Social Media", value: 10, color: "#8b5cf6" },
  ];

  // Room types performance
  const roomTypesData = [
    { type: "Deluxe Suite", bookings: 156, revenue: 312000 },
    { type: "Standard Room", bookings: 234, revenue: 351000 },
    { type: "Family Suite", bookings: 98, revenue: 245000 },
    { type: "Presidential", bookings: 45, revenue: 225000 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  const calculateGrowth = (current: any, previous: any) => {
    const growth = ((current - previous) / previous) * 100;
    return growth.toFixed(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Comprehensive insights and performance metrics
              </p>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="12months">Last 12 Months</option>
            </select>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">₹7.5M</p>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">+12.5%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Bookings</span>
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">1,248</p>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">+8.2%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Active Users</span>
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">389</p>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">+15.3%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Avg. Booking Value
                </span>
                <BarChart3 className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">₹6,010</p>
              <div className="flex items-center gap-1 text-sm">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-red-600 font-medium">-2.1%</span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>
          </div>

          {/* Revenue and Bookings Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Revenue Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [
                      `₹${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                User Growth
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [value, "Users"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Popular Hotels and Booking Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Performing Hotels
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={popularHotelsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    stroke="#6b7280"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value, name) => {
                      if (name === "bookings") return [value, "Bookings"];
                      return [`₹${value.toLocaleString()}`, "Revenue"];
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="bookings"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Sources
              </h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bookingSourcesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({
                        name,
                        percent,
                      }: {
                        name?: string;
                        percent?: number;
                      }) =>
                        `${name ?? ""}: ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {bookingSourcesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {bookingSourcesData.map((source, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: source.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{source.name}</span>
                    <span className="text-sm font-semibold text-gray-900 ml-auto">
                      {source.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Room Types Performance */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Room Types Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roomTypesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="type" stroke="#6b7280" />
                <YAxis yAxisId="left" stroke="#6b7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value, name) => {
                    if (name === "bookings") return [value, "Bookings"];
                    return [`₹${value.toLocaleString()}`, "Revenue"];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="bookings"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="revenue"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Metrics Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Performance Metrics
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Previous
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Average Daily Revenue
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹2,933</td>
                    <td className="px-6 py-4 text-sm text-gray-500">₹2,608</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-green-600 font-medium">+12.5%</span>
                    </td>
                    <td className="px-6 py-4">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Conversion Rate
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">3.2%</td>
                    <td className="px-6 py-4 text-sm text-gray-500">2.8%</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-green-600 font-medium">+14.3%</span>
                    </td>
                    <td className="px-6 py-4">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Cancellation Rate
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">5.8%</td>
                    <td className="px-6 py-4 text-sm text-gray-500">6.2%</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-green-600 font-medium">-6.5%</span>
                    </td>
                    <td className="px-6 py-4">
                      <TrendingDown className="w-5 h-5 text-green-500" />
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Customer Satisfaction
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">4.6/5</td>
                    <td className="px-6 py-4 text-sm text-gray-500">4.4/5</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-green-600 font-medium">+4.5%</span>
                    </td>
                    <td className="px-6 py-4">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
