import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  FiUpload,
  FiTrash2,
  FiStar,
  FiArrowRight,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { userAPI, quoteAPI, enquiryAPI, feedbackAPI, getAvatarUrl } from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [quoteStatusFilter, setQuoteStatusFilter] = useState("all");
  const [dashboardData, setDashboardData] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState(getAvatarUrl(user?.avatar) || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [updateProfileError, setUpdateProfileError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Refetch dashboard data when component comes into focus
  useEffect(() => {
    const handleFocus = () => {
      fetchDashboardData();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Refetch data when route location changes (e.g., returning from Quote page)
  useEffect(() => {
    fetchDashboardData();
  }, [location]);

  useEffect(() => {
    if (user?.avatar) {
      setProfileImage(getAvatarUrl(user.avatar));
    }
  }, [user?.avatar]);

  useEffect(() => {
    if (user) {
      setProfileFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors

      // Claim any unassociated quotes with the user's email
      try {
        await quoteAPI.claimQuotes();
      } catch (claimError) {
        console.log("No quotes to claim or error claiming quotes:", claimError.message);
      }

      const [dashboardRes, quotesRes] = await Promise.all([
        userAPI.getDashboard(),
        quoteAPI.getMyQuotes(),
      ]);

      console.log("Dashboard data:", dashboardRes.data.data);
      console.log("Quotes data:", quotesRes.data.data);

      setDashboardData(dashboardRes.data.data);
      setQuotes(quotesRes.data.data || []);

      // Fetch enquiries
      try {
        const enquiriesRes = await enquiryAPI.getMyEnquiries();
        setEnquiries(enquiriesRes.data.data || []);
      } catch (enquiryError) {
        console.log("Error fetching enquiries:", enquiryError.message);
        setEnquiries([]);
      }

      // Fetch feedbacks
      try {
        const feedbacksRes = await feedbackAPI.getMyFeedbacks();
        console.log("Feedbacks data:", feedbacksRes.data.data);
        setFeedbacks(feedbacksRes.data.data || []);
      } catch (feedbackError) {
        console.log("Error fetching feedbacks:", feedbackError.message);
        setFeedbacks([]);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    setUploadingImage(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await userAPI.updateProfile(formData);
      const avatarUrl = getAvatarUrl(response.data.data.avatar);
      setProfileImage(avatarUrl);
      updateUser(response.data.data);
    } catch (err) {
      setUploadError(
        err.response?.data?.message || "Failed to upload image"
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveProfileImage = async () => {
    if (!window.confirm("Are you sure you want to remove your profile picture?")) {
      return;
    }

    setUploadingImage(true);
    setUploadError("");

    try {
      const response = await userAPI.updateProfile({ avatar: null });
      setProfileImage(null);
      updateUser(response.data.data);
    } catch (err) {
      setUploadError(
        err.response?.data?.message || "Failed to remove image"
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed."
    );

    if (!confirmDelete) {
      return;
    }

    const confirmAgain = window.confirm(
      "This is your final warning. Deleting your account is permanent. Click OK to proceed."
    );

    if (!confirmAgain) {
      return;
    }

    setIsDeletingAccount(true);

    try {
      await userAPI.deleteAccount();
      logout();
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete account");
      setIsDeletingAccount(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    setUpdateProfileError("");

    try {
      const response = await userAPI.updateProfile(profileFormData);
      updateUser(response.data.data);
      // Close the profile settings tab
      setActiveTab("overview");
    } catch (err) {
      setUpdateProfileError(
        err.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setIsUpdatingProfile(false);
    }
  };

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

  // Helper functions
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      completed: "bg-primary/20 text-primary",
      rejected: "bg-red-100 text-red-800",
      cancelled: "bg-red-100 text-red-800",
      reviewing: "bg-primary/20 text-primary",
      "in-progress": "bg-purple-100 text-purple-800",
      new: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter quotes based on status
  const getFilteredQuotes = () => {
    if (quoteStatusFilter === "all") {
      return quotes;
    }
    return quotes.filter((quote) => quote.status === quoteStatusFilter);
  };

  const filteredQuotes = getFilteredQuotes();

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: FiPackage },
    { id: "quotes", label: "My Quotes", icon: FiFileText },
    { id: "enquiries", label: "My Enquiries", icon: FiFileText },
    { id: "feedbacks", label: "My Feedbacks", icon: FiStar },
    { id: "profile", label: "Profile Settings", icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-bgLight">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-navy via-navyLight to-navy py-8 relative overflow-hidden" style={{ backgroundImage: 'url(/userD.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-navy/80"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="text-2xl text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome, {user?.firstName} {user?.lastName}!
                </h1>
                <p className="text-white/80">{user?.email}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/quote"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-white/10"
              >
                Get New Quote <FiArrowRight className="ml-2" />
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                      ? "bg-primary text-white"
                      : "text-navy hover:bg-bgLight"
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
                <motion.div
                  className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                >
                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Total Quotes</p>
                        <p className="text-3xl font-bold text-navy">
                          {dashboardData?.totalQuotes || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <FiPackage className="text-primary text-xl" />
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Pending</p>
                        <p className="text-3xl font-bold text-primary">
                          {dashboardData?.pendingQuotes || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <FiClock className="text-primary text-xl" />
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">In Progress</p>
                        <p className="text-3xl font-bold text-navy">
                          {dashboardData?.inProgressQuotes || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-navy/20 rounded-full flex items-center justify-center">
                        <FiTruck className="text-navy text-xl" />
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
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
                  </motion.div>
                </motion.div>

                {/* Recent Quotes */}
                <motion.div
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <h3 className="text-xl font-bold text-navy mb-4">
                    Recent Quotes
                  </h3>
                  {quotes.length > 0 ? (
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ staggerChildren: 0.05 }}
                    >
                      {quotes.slice(0, 5).map((quote, idx) => (
                        <motion.div
                          key={quote._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-navy/5 to-primary/5 border border-navy/10 rounded-lg hover:bg-primary/10 hover:border-primary hover:shadow-lg transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                              <FiTruck className="text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-navy group-hover:text-white transition-colors">
                                {quote.quoteId}
                              </p>
                              <p className="text-sm text-gray-600 group-hover:text-white/80 transition-colors">
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
                            <p className="text-sm text-gray-600 group-hover:text-white/80 transition-colors mt-1">
                              {formatDate(quote.createdAt)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
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
                </motion.div>
              </motion.div>
            )}

            {/* Quotes Tab */}
            {activeTab === "quotes" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <h3 className="text-xl font-bold text-navy mb-6">
                  My Quotes
                </h3>

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-gray-200">
                  <button
                    onClick={() => setQuoteStatusFilter("all")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${quoteStatusFilter === "all"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    All Quotes
                  </button>
                  <button
                    onClick={() => setQuoteStatusFilter("pending")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${quoteStatusFilter === "pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setQuoteStatusFilter("reviewing")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${quoteStatusFilter === "reviewing"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Under Review
                  </button>
                  <button
                    onClick={() => setQuoteStatusFilter("cancelled")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${quoteStatusFilter === "cancelled"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Cancelled
                  </button>
                  <button
                    onClick={() => setQuoteStatusFilter("accepted")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${quoteStatusFilter === "accepted"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Accepted
                  </button>
                  <button
                    onClick={() => setQuoteStatusFilter("completed")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${quoteStatusFilter === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Completed
                  </button>
                </div>

                {filteredQuotes.length > 0 ? (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.05 }}
                  >
                    {filteredQuotes.map((quote, idx) => (
                      <motion.div
                        key={quote._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="bg-gradient-to-r from-navy/5 to-primary/5 border border-navy/10 rounded-lg p-4 hover:bg-primary/10 hover:border-primary hover:shadow-lg transition-all duration-300 group cursor-pointer"
                        onClick={() => navigate(`/quote-tracking/${quote.quoteId}`)}
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div
                            className="flex-1"
                          >
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-navy group-hover:text-white transition-colors">
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
                            <div className="mt-2 text-sm text-gray-600 group-hover:text-white/80 transition-colors">
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
                          <div className="flex flex-col items-end gap-4">
                            <div className="text-right">
                              {quote.finalCost ? (
                                <p className="text-2xl font-bold text-primary">
                                  ₹{quote.finalCost.toLocaleString()}
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
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FiPackage className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">
                      {quoteStatusFilter === "all"
                        ? "No quotes yet"
                        : `No ${quoteStatusFilter} quotes`}
                    </p>
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
              >
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      My Enquiries
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {enquiries && enquiries.length > 0 ? (
                      enquiries.map((enquiry) => (
                        <div
                          key={enquiry._id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-blue-50 to-cyan-50"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">
                                {enquiry.subject || "General Enquiry"}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Type: <span className="font-medium capitalize">{enquiry.enquiryType || "general"}</span>
                              </p>
                              {enquiry.serviceInterested && (
                                <p className="text-sm text-primary mt-1">
                                  Service: {enquiry.serviceInterested}
                                </p>
                              )}
                              <p className="text-gray-700 mt-2">
                                {enquiry.message}
                              </p>

                              {/* Admin Response - Show when responded or resolved */}
                              {(enquiry.status === "responded" || enquiry.status === "resolved") && enquiry.response && (
                                <div className="mt-3 p-3 bg-white rounded border border-green-200">
                                  <p className="text-sm font-semibold text-green-700 mb-2">✅ Response from UnitedPackers:</p>
                                  <p className="text-gray-600 text-sm mb-2">
                                    {enquiry.response}
                                  </p>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-4 text-sm mt-3">
                                <div>
                                  <p className="text-gray-500 text-xs">Submitted</p>
                                  <p className="text-gray-800 font-medium">
                                    {enquiry.createdAt
                                      ? new Date(enquiry.createdAt).toLocaleDateString("en-IN", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })
                                      : "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500 text-xs">Preferred Callback</p>
                                  <p className="text-gray-800 font-medium">
                                    {enquiry.callbackTime || "Any Time"}
                                  </p>
                                </div>
                                {enquiry.expectedMoveDate && (
                                  <div>
                                    <p className="text-gray-500 text-xs">Expected Move</p>
                                    <p className="text-gray-800 font-medium">
                                      {new Date(enquiry.expectedMoveDate).toLocaleDateString("en-IN", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-gray-500 text-xs">Status</p>
                                  <span className={`text-xs font-semibold px-2 py-1 rounded ${enquiry.status === "responded"
                                    ? "bg-green-100 text-green-800"
                                    : enquiry.status === "resolved"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : enquiry.status === "closed"
                                        ? "bg-slate-100 text-slate-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}>
                                    {enquiry.status?.charAt(0).toUpperCase() + enquiry.status?.slice(1) || "New"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
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
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Feedbacks Tab */}
            {activeTab === "feedbacks" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      My Feedbacks
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {feedbacks && feedbacks.length > 0 ? (
                      feedbacks.map((feedback) => (
                        <div
                          key={feedback._id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-amber-50 to-orange-50"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <FiStar
                                      key={i}
                                      size={16}
                                      className={i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-semibold text-gray-700">
                                  {feedback.rating}/5
                                </span>
                              </div>
                              {feedback.quoteId && (
                                <p className="text-sm text-primary mt-1 font-medium">
                                  Quote: {feedback.quoteId.quoteId} • {feedback.quoteId.fromCity} → {feedback.quoteId.toCity}
                                </p>
                              )}
                              {feedback.comment && (
                                <p className="text-gray-700 mt-2 italic">
                                  "{feedback.comment}"
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(feedback.createdAt).toLocaleDateString("en-IN", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <FiStar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No feedbacks submitted yet</p>
                        <p className="text-sm mt-2">Submit feedback for completed quotes to see them here</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <h3 className="text-xl font-bold text-navy mb-6">
                  Profile Settings
                </h3>

                {/* Profile Picture Section */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">
                    Profile Picture
                  </h4>
                  <div className="flex flex-col items-center gap-6">
                    {/* Avatar Display */}
                    <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="text-5xl text-white" />
                      )}
                    </div>

                    {/* Error Message */}
                    {uploadError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center"
                      >
                        <FiAlertCircle className="mr-2 flex-shrink-0" />
                        <span className="text-sm">{uploadError}</span>
                      </motion.div>
                    )}

                    {/* Upload Button */}
                    <div className="flex gap-3">
                      <label className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-colors cursor-pointer inline-flex items-center gap-2">
                        <FiUpload />
                        {uploadingImage ? "Uploading..." : "Upload Photo"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>

                      {/* Remove Button */}
                      {profileImage && (
                        <button
                          onClick={handleRemoveProfileImage}
                          disabled={uploadingImage}
                          className="px-6 py-2 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                        >
                          <FiTrash2 />
                          Remove
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                      Max file size: 5MB. Supported formats: JPG, PNG, GIF
                    </p>
                  </div>
                </div>

                {/* Other Profile Fields */}
                <div className="space-y-6">
                  {updateProfileError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center"
                    >
                      <FiAlertCircle className="mr-2 flex-shrink-0" />
                      <span className="text-sm">{updateProfileError}</span>
                    </motion.div>
                  )}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileFormData.firstName}
                        onChange={(e) =>
                          setProfileFormData({
                            ...profileFormData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileFormData.lastName}
                        onChange={(e) =>
                          setProfileFormData({
                            ...profileFormData,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
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
                        value={profileFormData.phone}
                        onChange={(e) =>
                          setProfileFormData({
                            ...profileFormData,
                            phone: e.target.value,
                          })
                        }
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
                  <div className="flex justify-between">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount}
                      className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      <FiTrash2 />
                      {isDeletingAccount ? "Deleting..." : "Delete Account"}
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isUpdatingProfile}
                      className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
                    >
                      {isUpdatingProfile ? "Updating..." : "Update Profile"}
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
