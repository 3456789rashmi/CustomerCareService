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
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { userAPI, quoteAPI, enquiryAPI, getAvatarUrl } from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [quoteStatusFilter, setQuoteStatusFilter] = useState("all");
  const [dashboardData, setDashboardData] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
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
        console.log("Enquiries data:", enquiriesRes.data.data);
        setEnquiries(enquiriesRes.data.data || []);
      } catch (enquiryError) {
        console.log("Error fetching enquiries:", enquiryError.message);
        setEnquiries([]);
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
      completed: "bg-blue-100 text-blue-800",
      rejected: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
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
    { id: "profile", label: "Profile Settings", icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-neutral">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-primary via-secondary to-primary py-8">
        <div className="max-w-7xl mx-auto px-4">
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
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
                    onClick={() => setQuoteStatusFilter("quoted")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${quoteStatusFilter === "quoted"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    Quoted
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
                  <div className="space-y-4">
                    {filteredQuotes.map((quote) => (
                      <motion.div
                        key={quote._id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => navigate(`/quote-tracking/${quote.quoteId}`)}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
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
                      </motion.div>
                    ))}
                  </div>
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
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  My Enquiries
                </h3>
                {enquiries && enquiries.length > 0 ? (
                  <div className="space-y-4">
                    {enquiries.map((enquiry) => (
                      <motion.div
                        key={enquiry._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {enquiry.subject || "General Enquiry"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Type: <span className="font-medium capitalize">{enquiry.enquiryType || "general"}</span>
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${enquiry.status === "resolved"
                                ? "bg-green-100 text-green-800"
                                : enquiry.status === "in-progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                          >
                            {enquiry.status?.charAt(0).toUpperCase() + enquiry.status?.slice(1) || "New"}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-3">
                          {enquiry.message}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">Submitted</p>
                            <p className="text-gray-800 font-medium">
                              {enquiry.createdAt
                                ? new Date(enquiry.createdAt).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Preferred Callback</p>
                            <p className="text-gray-800 font-medium">
                              {enquiry.callbackTime || "Any Time"}
                            </p>
                          </div>
                          {enquiry.serviceInterested && (
                            <div>
                              <p className="text-gray-500 text-xs">Service Interest</p>
                              <p className="text-gray-800 font-medium">
                                {enquiry.serviceInterested}
                              </p>
                            </div>
                          )}
                          {enquiry.expectedMoveDate && (
                            <div>
                              <p className="text-gray-500 text-xs">Expected Move</p>
                              <p className="text-gray-800 font-medium">
                                {new Date(enquiry.expectedMoveDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
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

                {/* Profile Picture Section */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">
                    Profile Picture
                  </h4>
                  <div className="flex flex-col items-center gap-6">
                    {/* Avatar Display */}
                    <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center overflow-hidden shadow-lg">
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
