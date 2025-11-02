import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building,
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
import {
  useRevenueAnalytics,
  useUserAnalytics,
  useBookingAnalytics,
  useHotelAnalytics,
} from "../hooks/useAdmin";

const AdminAnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState("12months");

  const { data: revenueData, loading: revenueLoading } =
    useRevenueAnalytics(dateRange);
  const { data: userData, loading: userLoading } = useUserAnalytics();
  const { data: bookingData, loading: bookingLoading } = useBookingAnalytics();
  const { data: hotelData, loading: hotelLoading } = useHotelAnalytics();

  // Format revenue data for charts
  const formattedRevenueData = revenueData.map((item) => ({
    month: `${getMonthName(item._id.month)} ${item._id.year}`,
    revenue: item.revenue,
    bookings: item.bookings,
  }));

  // Format user growth data
  const formattedUserData = userData.map((item) => ({
    month: `${getMonthName(item._id.month)} ${item._id.year}`,
    users: item.users,
  }));

  // Calculate cumulative users
  let cumulativeUsers = 0;
  const cumulativeUserData = formattedUserData.map((item) => {
    cumulativeUsers += item.users;
    return {
      ...item,
      total: cumulativeUsers,
    };
  });

  // Format booking sources data
  const bookingSourcesData =
    bookingData?.sources.map((item) => ({
      name: item._id || "Direct",
      value: item.count,
      color: getColorForSource(item._id),
    })) || [];

  // Format popular hotels data
  const popularHotelsData = hotelData.slice(0, 5);

  // Format room types data
  const roomTypesData = bookingData?.roomTypes || [];

  // Calculate KPIs
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = revenueData.reduce(
    (sum, item) => sum + item.bookings,
    0
  );
  const averageBookingValue =
    totalBookings > 0 ? totalRevenue / totalBookings : 0;

  const currentMonthRevenue = revenueData[revenueData.length - 1]?.revenue || 0;
  const previousMonthRevenue =
    revenueData[revenueData.length - 2]?.revenue || 0;
  const revenueGrowth =
    previousMonthRevenue > 0
      ? (
          ((currentMonthRevenue - previousMonthRevenue) /
            previousMonthRevenue) *
          100
        ).toFixed(1)
      : "0";

  const currentMonthUsers = userData[userData.length - 1]?.users || 0;
  const previousMonthUsers = userData[userData.length - 2]?.users || 0;
  const userGrowth =
    previousMonthUsers > 0
      ? (
          ((currentMonthUsers - previousMonthUsers) / previousMonthUsers) *
          100
        ).toFixed(1)
      : "0";

  function getMonthName(month: number): string {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[month - 1];
  }

  function getColorForSource(source: string): string {
    const colors: { [key: string]: string } = {
      Direct: "#3b82f6",
      "Mobile App": "#10b981",
      Referral: "#f59e0b",
      "Social Media": "#8b5cf6",
      Email: "#ec4899",
    };
    return colors[source] || "#6b7280";
  }

  if (revenueLoading || userLoading || bookingLoading || hotelLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

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
              <p className="text-2xl font-bold text-gray-900 mb-1">
                ₹{totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-sm">
                {Number(revenueGrowth) >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={
                    Number(revenueGrowth) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {revenueGrowth}%
                </span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Bookings</span>
                <BarChart3 className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {totalBookings}
              </p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-500">
                  From {revenueData.length} months
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Users</span>
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {cumulativeUsers}
              </p>
              <div className="flex items-center gap-1 text-sm">
                {Number(userGrowth) >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={
                    Number(userGrowth) >= 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {userGrowth}%
                </span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Avg. Booking Value
                </span>
                <Building className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                ₹{averageBookingValue.toFixed(0)}
              </p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-500">Per booking</span>
              </div>
            </div>
          </div>

          {/* Revenue and User Growth Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Revenue Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={formattedRevenueData}>
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
                    formatter={(value: number) => [
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
                <LineChart data={cumulativeUserData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value, "Total Users"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
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
              {popularHotelsData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={popularHotelsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#6b7280" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={120}
                      stroke="#6b7280"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number, name: string) => {
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
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No hotel data available
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Sources
              </h3>
              {bookingSourcesData.length > 0 ? (
                <>
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={250}>
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
                            `${name ?? ""}: ${((percent ?? 0) * 100).toFixed(
                              0
                            )}%`
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
                        <span className="text-sm text-gray-600">
                          {source.name}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 ml-auto">
                          {source.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No booking source data available
                </div>
              )}
            </div>
          </div>

          {/* Room Types Performance */}
          {roomTypesData.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Room Types Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roomTypesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="_id" stroke="#6b7280" />
                  <YAxis yAxisId="left" stroke="#6b7280" />
                  <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => {
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
          )}

          {/* Performance Metrics Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Key Performance Metrics
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
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Total Hotels
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {hotelData.length}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 text-sm">Active</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Average Revenue per Booking
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ₹{averageBookingValue.toFixed(0)}
                    </td>
                    <td className="px-6 py-4">
                      {Number(revenueGrowth) >= 0 ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Total Users
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {cumulativeUsers}
                    </td>
                    <td className="px-6 py-4">
                      {Number(userGrowth) >= 0 ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Most Popular Source
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {bookingSourcesData.length > 0
                        ? bookingSourcesData.reduce((max, source) =>
                            source.value > max.value ? source : max
                          ).name
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-blue-600 text-sm">
                        Primary Channel
                      </span>
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
