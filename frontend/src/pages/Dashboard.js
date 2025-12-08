import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUser,
  FiPackage,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiTruck,
  FiEdit,
  FiEye,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { userAPI, quoteAPI } from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, quotesRes, enquiriesRes] = await Promise.all([
        userAPI.getDashboard(),
        quoteAPI.getMyQuotes(),
        userAPI.getProfile(),
      ]);

      setDashboardData(dashboardRes.data.data);
      setQuotes(quotesRes.data.data || []);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      in_progress: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: FiUser },
    { id: "quotes", label: "My Quotes", icon: FiPackage },
    { id: "enquiries", label: "My Enquiries", icon: FiFileText },
    { id: "profile", label: "Profile Settings", icon: FiSettings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-primary via-secondary to-primary py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome, {user?.name}!
                </h1>
                <p className="text-white/80">{user?.email}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/quote"
                className="inline-flex items-center px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-light transition-colors"
              >
                <FiPackage className="mr-2" />
                Get New Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-24">
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
                <hr className="my-4" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center mb-6"
              >
                <FiAlertCircle className="mr-2" />
                {error}
              </motion.div>
            )}

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Total Quotes</p>
                        <p className="text-3xl font-bold text-gray-800">
                          {dashboardData?.totalQuotes || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiPackage className="text-blue-600 text-xl" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Pending</p>
                        <p className="text-3xl font-bold text-yellow-600">
                          {dashboardData?.pendingQuotes || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <FiClock className="text-yellow-600 text-xl" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">In Progress</p>
                        <p className="text-3xl font-bold text-purple-600">
                          {dashboardData?.inProgressQuotes || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <FiTruck className="text-purple-600 text-xl" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Completed</p>
                        <p className="text-3xl font-bold text-green-600">
                          {dashboardData?.completedQuotes || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FiCheckCircle className="text-green-600 text-xl" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Quotes */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Recent Quotes
                  </h3>
                  {quotes.length > 0 ? (
                    <div className="space-y-4">
                      {quotes.slice(0, 5).map((quote) => (
                        <div
                          key={quote._id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <FiTruck className="text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {quote.quoteId}
                              </p>
                              <p className="text-sm text-gray-500">
                                {quote.fromCity} → {quote.toCity}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                quote.status
                              )}`}
                            >
                              {quote.status.replace("_", " ").toUpperCase()}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(quote.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FiPackage className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No quotes yet</p>
                      <Link
                        to="/quote"
                        className="text-primary hover:text-secondary mt-2 inline-block"
                      >
                        Get your first quote →
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Quotes Tab */}
            {activeTab === "quotes" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  My Quotes
                </h3>
                {quotes.length > 0 ? (
                  <div className="space-y-4">
                    {quotes.map((quote) => (
                      <div
                        key={quote._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-800">
                                {quote.quoteId}
                              </p>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  quote.status
                                )}`}
                              >
                                {quote.status.replace("_", " ").toUpperCase()}
                              </span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                              <p className="flex items-center gap-2">
                                <FiMapPin className="text-primary" />
                                {quote.fromCity} → {quote.toCity}
                              </p>
                              <p className="flex items-center gap-2 mt-1">
                                <FiCalendar className="text-primary" />
                                Move Date: {formatDate(quote.moveDate)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {quote.finalAmount ? (
                              <p className="text-2xl font-bold text-primary">
                                ₹{quote.finalAmount.toLocaleString()}
                              </p>
                            ) : quote.estimatedCost ? (
                              <p className="text-lg text-gray-600">
                                Est. ₹{quote.estimatedCost.toLocaleString()}
                              </p>
                            ) : null}
                            <p className="text-sm text-gray-500">
                              Created: {formatDate(quote.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FiPackage className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No quotes yet</p>
                    <Link
                      to="/quote"
                      className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-colors mt-4"
                    >
                      Get Your First Quote
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* Enquiries Tab */}
            {activeTab === "enquiries" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  My Enquiries
                </h3>
                <div className="text-center py-12 text-gray-500">
                  <FiFileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No enquiries yet</p>
                  <Link
                    to="/enquiry"
                    className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-colors mt-4"
                  >
                    Submit an Enquiry
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Profile Settings
                </h3>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        defaultValue={user?.phone}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Member Since
                      </label>
                      <input
                        type="text"
                        value={
                          user?.createdAt ? formatDate(user.createdAt) : ""
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-colors">
                      Update Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
