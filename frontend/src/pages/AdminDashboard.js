import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiFileText,
  FiMessageSquare,
  FiMail,
  FiTrendingUp,
  FiCheck,
  FiX,
  FiEye,
  FiEyeOff,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiShield,
  FiUser,
  FiPhone,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiUserPlus,
  FiLock,
  FiBell,
  FiWifi,
  FiWifiOff,
} from "react-icons/fi";
import { adminAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // User management states
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalMode, setUserModalMode] = useState("view"); // 'view', 'edit', 'delete'
  const [editUserData, setEditUserData] = useState({});
  const [userActionLoading, setUserActionLoading] = useState(false);
  const [userActionMessage, setUserActionMessage] = useState({
    type: "",
    message: "",
  });

  // Create Admin states
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [createAdminData, setCreateAdminData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [createAdminLoading, setCreateAdminLoading] = useState(false);
  const [createAdminMessage, setCreateAdminMessage] = useState({
    type: "",
    message: "",
  });

  // Password visibility states for Create Admin form
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showAdminConfirmPassword, setShowAdminConfirmPassword] = useState(false);

  // Real-time updates state
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [newItemsCount, setNewItemsCount] = useState({
    quotes: 0,
    users: 0,
    enquiries: 0,
    contacts: 0,
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const pollingIntervalRef = useRef(null);
  const previousStatsRef = useRef(null);

  // Function to check for new items
  const checkForNewItems = useCallback(async () => {
    if (!isLiveUpdating) return;

    try {
      const dashboardRes = await adminAPI.getDashboard();
      const newStats = dashboardRes.data.data;

      if (previousStatsRef.current && stats) {
        const prevCounts = previousStatsRef.current.counts || {};
        const newCounts = newStats.counts || {};

        // Check for new quotes
        if (newCounts.quotes > (prevCounts.quotes || 0)) {
          const diff = newCounts.quotes - (prevCounts.quotes || 0);
          setNewItemsCount((prev) => ({ ...prev, quotes: prev.quotes + diff }));
          showNewItemNotification(
            `🎉 ${diff} new quote${diff > 1 ? "s" : ""} received!`
          );
        }

        // Check for new users
        if (newCounts.users > (prevCounts.users || 0)) {
          const diff = newCounts.users - (prevCounts.users || 0);
          setNewItemsCount((prev) => ({ ...prev, users: prev.users + diff }));
          showNewItemNotification(
            `👤 ${diff} new user${diff > 1 ? "s" : ""} registered!`
          );
        }

        // Check for new enquiries
        if (newCounts.enquiries > (prevCounts.enquiries || 0)) {
          const diff = newCounts.enquiries - (prevCounts.enquiries || 0);
          setNewItemsCount((prev) => ({
            ...prev,
            enquiries: prev.enquiries + diff,
          }));
          showNewItemNotification(
            `❓ ${diff} new enquir${diff > 1 ? "ies" : "y"} received!`
          );
        }

        // Check for new contacts
        if (newCounts.contacts > (prevCounts.contacts || 0)) {
          const diff = newCounts.contacts - (prevCounts.contacts || 0);
          setNewItemsCount((prev) => ({
            ...prev,
            contacts: prev.contacts + diff,
          }));
          showNewItemNotification(
            `📧 ${diff} new contact${diff > 1 ? "s" : ""} received!`
          );
        }
      }

      previousStatsRef.current = newStats;
      setStats(newStats);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to check for new items:", err);
    }
  }, [isLiveUpdating, stats]);

  // Show notification
  const showNewItemNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    // Play notification sound (optional - can be enabled)
    // new Audio('/notification.mp3').play().catch(() => {});

    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  // Start/Stop polling
  useEffect(() => {
    if (isLiveUpdating) {
      pollingIntervalRef.current = setInterval(checkForNewItems, 15000); // Check every 15 seconds
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isLiveUpdating, checkForNewItems]);

  // Reset new items count when viewing that tab
  useEffect(() => {
    if (activeTab === "quotes") {
      setNewItemsCount((prev) => ({ ...prev, quotes: 0 }));
    } else if (activeTab === "users") {
      setNewItemsCount((prev) => ({ ...prev, users: 0 }));
    } else if (activeTab === "enquiries") {
      setNewItemsCount((prev) => ({ ...prev, enquiries: 0 }));
    } else if (activeTab === "contacts") {
      setNewItemsCount((prev) => ({ ...prev, contacts: 0 }));
    }
  }, [activeTab]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const dashboardRes = await adminAPI.getDashboard();
      const data = dashboardRes.data.data;
      setStats(data);
      previousStatsRef.current = data; // Initialize previous stats for comparison
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuotes = useCallback(async () => {
    try {
      const res = await adminAPI.getAllQuotes({
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setQuotes(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch quotes:", err);
    }
  }, [statusFilter]);

  const fetchEnquiries = useCallback(async () => {
    try {
      const res = await adminAPI.getAllEnquiries({
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setEnquiries(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
    }
  }, [statusFilter]);

  const fetchContacts = useCallback(async () => {
    try {
      const res = await adminAPI.getAllContacts({
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setContacts(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  }, [statusFilter]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "quotes") fetchQuotes();
    if (activeTab === "enquiries") fetchEnquiries();
    if (activeTab === "contacts") fetchContacts();
    if (activeTab === "users") fetchUsers();
  }, [activeTab, statusFilter, fetchQuotes, fetchEnquiries, fetchContacts, fetchUsers]);

  const updateQuoteStatus = async (id, status) => {
    try {
      await adminAPI.updateQuote(id, { status });
      fetchQuotes();
      fetchDashboardData(); // Update stats
    } catch (err) {
      console.error("Failed to update quote:", err);
    }
  };

  const deleteQuote = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this quote? This action cannot be undone."
      )
    ) {
      try {
        await adminAPI.deleteQuote(id);
        fetchQuotes();
        fetchDashboardData(); // Update stats
        setShowModal(false);
      } catch (err) {
        console.error("Failed to delete quote:", err);
        alert("Failed to delete quote");
      }
    }
  };

  const updateEnquiryStatus = async (id, status) => {
    try {
      await adminAPI.updateEnquiry(id, { status });
      fetchEnquiries();
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to update enquiry:", err);
    }
  };

  const deleteEnquiry = async (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      try {
        await adminAPI.deleteEnquiry(id);
        fetchEnquiries();
        fetchDashboardData();
      } catch (err) {
        console.error("Failed to delete enquiry:", err);
      }
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await adminAPI.deleteContact(id);
        fetchContacts();
        fetchDashboardData();
      } catch (err) {
        console.error("Failed to delete contact:", err);
      }
    }
  };

  // User Management Functions
  const openUserModal = (user, mode) => {
    setSelectedUser(user);
    setUserModalMode(mode);
    setEditUserData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      role: user.role || "user",
    });
    setUserActionMessage({ type: "", message: "" });
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    setEditUserData({});
    setUserActionMessage({ type: "", message: "" });
  };

  const handleEditUserChange = (e) => {
    setEditUserData({
      ...editUserData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setUserActionLoading(true);
    try {
      await adminAPI.updateUser(selectedUser._id, editUserData);
      setUserActionMessage({
        type: "success",
        message: "User updated successfully!",
      });
      fetchUsers();
      setTimeout(() => {
        closeUserModal();
      }, 1500);
    } catch (err) {
      setUserActionMessage({
        type: "error",
        message: err.response?.data?.message || "Failed to update user",
      });
    } finally {
      setUserActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setUserActionLoading(true);
    try {
      await adminAPI.deleteUser(selectedUser._id);
      setUserActionMessage({
        type: "success",
        message: "User deleted successfully!",
      });
      fetchUsers();
      setTimeout(() => {
        closeUserModal();
      }, 1500);
    } catch (err) {
      setUserActionMessage({
        type: "error",
        message: err.response?.data?.message || "Failed to delete user",
      });
    } finally {
      setUserActionLoading(false);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await adminAPI.updateUser(userId, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.error("Failed to change role:", err);
      alert(err.response?.data?.message || "Failed to change user role");
    }
  };

  // Create Admin Functions
  const openCreateAdminModal = () => {
    setCreateAdminData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setCreateAdminMessage({ type: "", message: "" });
    setShowCreateAdminModal(true);
  };

  const handleCreateAdminChange = (e) => {
    setCreateAdminData({
      ...createAdminData,
      [e.target.name]: e.target.value,
    });
  };

  const validateCreateAdmin = () => {
    if (!createAdminData.firstName.trim()) return "First name is required";
    if (!createAdminData.lastName.trim()) return "Last name is required";
    if (!createAdminData.email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(createAdminData.email))
      return "Please enter a valid email";
    if (!createAdminData.phone.trim()) return "Phone is required";
    if (!/^[0-9]{10}$/.test(createAdminData.phone))
      return "Please enter a valid 10-digit phone";
    if (!createAdminData.password) return "Password is required";
    if (createAdminData.password.length < 8)
      return "Password must be at least 8 characters";
    if (createAdminData.password !== createAdminData.confirmPassword)
      return "Passwords do not match";
    return null;
  };

  const handleCreateAdmin = async () => {
    const validationError = validateCreateAdmin();
    if (validationError) {
      setCreateAdminMessage({ type: "error", message: validationError });
      return;
    }

    setCreateAdminLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = createAdminData;
      await adminAPI.createAdmin(dataToSend);
      setCreateAdminMessage({
        type: "success",
        message: "Admin account created successfully!",
      });
      fetchUsers();
      setTimeout(() => {
        setShowCreateAdminModal(false);
        setShowAdminPassword(false);
        setShowAdminConfirmPassword(false);
      }, 2000);
    } catch (err) {
      setCreateAdminMessage({
        type: "error",
        message:
          err.response?.data?.message || "Failed to create admin account",
      });
    } finally {
      setCreateAdminLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FiTrendingUp, badge: 0 },
    {
      id: "quotes",
      label: "Quotes",
      icon: FiFileText,
      badge: newItemsCount.quotes,
    },
    {
      id: "enquiries",
      label: "Enquiries",
      icon: FiMessageSquare,
      badge: newItemsCount.enquiries,
    },
    {
      id: "contacts",
      label: "Contacts",
      icon: FiMail,
      badge: newItemsCount.contacts,
    },
    { id: "users", label: "Users", icon: FiUsers, badge: newItemsCount.users },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      contacted: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      resolved: "bg-green-100 text-green-800",
      new: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading && activeTab === "overview") {
    return (
      <div className="min-h-screen bg-neutral flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      {/* Real-time Notification Popup */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -100, x: "-50%" }}
            className="fixed top-4 left-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <FiBell className="text-xl animate-bounce" />
            </div>
            <div>
              <p className="font-semibold">{notificationMessage}</p>
              <p className="text-sm text-white/80">Just now</p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="ml-4 hover:bg-white/20 p-1 rounded"
            >
              <FiX />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Header */}
      <div className="bg-gradient-to-r from-primary via-secondary to-primary py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/80 mt-1">
                Manage your business operations
              </p>
            </div>

            {/* Live Update Controls */}
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-3">
                <button
                  onClick={() => setIsLiveUpdating(!isLiveUpdating)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiveUpdating ? "text-green-300" : "text-white/60"
                    }`}
                >
                  {isLiveUpdating ? (
                    <>
                      <FiWifi className="animate-pulse" />
                      <span>Live</span>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    </>
                  ) : (
                    <>
                      <FiWifiOff />
                      <span>Paused</span>
                    </>
                  )}
                </button>
                <div className="border-l border-white/30 pl-3">
                  <p className="text-xs text-white/60">
                    Updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  fetchDashboardData();
                  if (activeTab === "quotes") fetchQuotes();
                  if (activeTab === "enquiries") fetchEnquiries();
                  if (activeTab === "contacts") fetchContacts();
                  if (activeTab === "users") fetchUsers();
                }}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FiRefreshCw className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-24">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <div className="flex items-center">
                      <tab.icon className="mr-3" />
                      {tab.label}
                    </div>
                    {tab.badge > 0 && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full animate-pulse ${activeTab === tab.id
                          ? "bg-white text-primary"
                          : "bg-red-500 text-white"
                          }`}
                      >
                        +{tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Overview Tab */}
            {activeTab === "overview" && stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Total Users</p>
                        <p className="text-3xl font-bold text-gray-800">
                          {stats.totalUsers || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUsers className="text-blue-600 text-xl" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Total Quotes</p>
                        <p className="text-3xl font-bold text-gray-800">
                          {stats.totalQuotes || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FiFileText className="text-green-600 text-xl" />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2 text-xs">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        {stats.pendingQuotes || 0} Pending
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        {stats.confirmedQuotes || 0} Confirmed
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Total Enquiries</p>
                        <p className="text-3xl font-bold text-gray-800">
                          {stats.totalEnquiries || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <FiMessageSquare className="text-purple-600 text-xl" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">
                          Contact Messages
                        </p>
                        <p className="text-3xl font-bold text-gray-800">
                          {stats.totalContacts || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <FiMail className="text-orange-600 text-xl" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Recent Quotes
                    </h3>
                    {stats.recentQuotes?.length > 0 ? (
                      <div className="space-y-3">
                        {stats.recentQuotes.slice(0, 5).map((quote, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-800">
                                {quote.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {quote.fromCity} → {quote.toCity}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                quote.status
                              )}`}
                            >
                              {quote.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No recent quotes
                      </p>
                    )}
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Recent Enquiries
                    </h3>
                    {stats.recentEnquiries?.length > 0 ? (
                      <div className="space-y-3">
                        {stats.recentEnquiries
                          .slice(0, 5)
                          .map((enquiry, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-800">
                                  {enquiry.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {enquiry.serviceType}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                  enquiry.status
                                )}`}
                              >
                                {enquiry.status}
                              </span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No recent enquiries
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quotes Tab */}
            {activeTab === "quotes" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      All Quotes
                    </h3>
                    <div className="flex gap-4">
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search quotes..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={fetchQuotes}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <FiRefreshCw />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Quote ID
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Customer
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Route
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Date
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotes
                          .filter(
                            (q) =>
                              q.name
                                ?.toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              q.quoteId
                                ?.toLowerCase()
                                .includes(searchTerm.toLowerCase())
                          )
                          .map((quote) => (
                            <tr
                              key={quote._id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="py-3 px-4 font-medium text-primary">
                                {quote.quoteId}
                              </td>
                              <td className="py-3 px-4">
                                <p className="font-medium">{quote.name}</p>
                                <p className="text-sm text-gray-500">
                                  {quote.phone}
                                </p>
                              </td>
                              <td className="py-3 px-4">
                                {quote.fromCity} → {quote.toCity}
                              </td>
                              <td className="py-3 px-4 text-sm">
                                {new Date(quote.moveDate).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">
                                <select
                                  value={quote.status}
                                  onChange={(e) =>
                                    updateQuoteStatus(quote._id, e.target.value)
                                  }
                                  className={`px-2 py-1 rounded text-sm ${getStatusColor(
                                    quote.status
                                  )}`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      setSelectedItem(quote);
                                      setShowModal(true);
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                    title="View Details"
                                  >
                                    <FiEye />
                                  </button>
                                  <button
                                    onClick={() => deleteQuote(quote._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                    title="Delete Quote"
                                  >
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {quotes.length === 0 && (
                      <p className="text-center text-gray-500 py-8">
                        No quotes found
                      </p>
                    )}
                  </div>
                </div>
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
                      All Enquiries
                    </h3>
                    <button
                      onClick={fetchEnquiries}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <FiRefreshCw />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {enquiries.map((enquiry) => (
                      <div
                        key={enquiry._id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              {enquiry.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {enquiry.email} • {enquiry.phone}
                            </p>
                            <p className="text-sm text-primary mt-1">
                              {enquiry.serviceType}
                            </p>
                            <p className="text-gray-600 mt-2">
                              {enquiry.message}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={enquiry.status}
                              onChange={(e) =>
                                updateEnquiryStatus(enquiry._id, e.target.value)
                              }
                              className={`px-2 py-1 rounded text-sm ${getStatusColor(
                                enquiry.status
                              )}`}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="resolved">Resolved</option>
                            </select>
                            <button
                              onClick={() => deleteEnquiry(enquiry._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              title="Delete Enquiry"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {enquiries.length === 0 && (
                      <p className="text-center text-gray-500 py-8">
                        No enquiries found
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Contacts Tab */}
            {activeTab === "contacts" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      Contact Messages
                    </h3>
                    <button
                      onClick={fetchContacts}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <FiRefreshCw />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {contacts.map((contact) => (
                      <div
                        key={contact._id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              {contact.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {contact.email} • {contact.phone}
                            </p>
                            <p className="font-medium text-primary mt-1">
                              {contact.subject}
                            </p>
                            <p className="text-gray-600 mt-2">
                              {contact.message}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                contact.status
                              )}`}
                            >
                              {contact.status}
                            </span>
                            <button
                              onClick={() => deleteContact(contact._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              title="Delete Contact"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {contacts.length === 0 && (
                      <p className="text-center text-gray-500 py-8">
                        No contact messages found
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      User Management
                    </h3>
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={openCreateAdminModal}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-medium"
                      >
                        <FiUserPlus size={18} />
                        Create Admin
                      </button>
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <button
                        onClick={fetchUsers}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        <FiRefreshCw />
                      </button>
                    </div>
                  </div>

                  {/* Stats Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-600">Total Users</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {users.length}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-purple-600">Admins</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {users.filter((u) => u.role === "admin").length}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-600">Regular Users</p>
                      <p className="text-2xl font-bold text-green-700">
                        {users.filter((u) => u.role === "user").length}
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <p className="text-sm text-orange-600">This Week</p>
                      <p className="text-2xl font-bold text-orange-700">
                        {
                          users.filter((u) => {
                            const weekAgo = new Date();
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            return new Date(u.createdAt) >= weekAgo;
                          }).length
                        }
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            User
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Contact
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Role
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Joined
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users
                          .filter(
                            (u) =>
                              u.firstName
                                ?.toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              u.lastName
                                ?.toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              u.email
                                ?.toLowerCase()
                                .includes(searchTerm.toLowerCase())
                          )
                          .map((user) => (
                            <tr
                              key={user._id}
                              className="border-b hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${user.role === "admin"
                                      ? "bg-gradient-to-r from-primary to-secondary"
                                      : "bg-gray-400"
                                      }`}
                                  >
                                    {user.firstName?.charAt(0)}
                                    {user.lastName?.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {user.firstName} {user.lastName}
                                      {user._id === currentUser?._id && (
                                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                          You
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <p className="text-gray-600 text-sm">
                                  {user.email}
                                </p>
                                <p className="text-gray-500 text-sm">
                                  {user.phone}
                                </p>
                              </td>
                              <td className="py-3 px-4">
                                <select
                                  value={user.role}
                                  onChange={(e) =>
                                    handleChangeRole(user._id, e.target.value)
                                  }
                                  disabled={user._id === currentUser?._id}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${user.role === "admin"
                                    ? "bg-purple-100 text-purple-800 border border-purple-300"
                                    : "bg-gray-100 text-gray-700 border border-gray-300"
                                    } ${user._id === currentUser?._id
                                      ? "cursor-not-allowed opacity-60"
                                      : "hover:opacity-80"
                                    }`}
                                >
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openUserModal(user, "view")}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="View Details"
                                  >
                                    <FiEye size={18} />
                                  </button>
                                  <button
                                    onClick={() => openUserModal(user, "edit")}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Edit User"
                                  >
                                    <FiEdit size={18} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      openUserModal(user, "delete")
                                    }
                                    disabled={user._id === currentUser?._id}
                                    className={`p-2 rounded-lg transition-colors ${user._id === currentUser?._id
                                      ? "text-gray-300 cursor-not-allowed"
                                      : "text-red-600 hover:bg-red-50"
                                      }`}
                                    title={
                                      user._id === currentUser?._id
                                        ? "Can't delete yourself"
                                        : "Delete User"
                                    }
                                  >
                                    <FiTrash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {users.length === 0 && (
                      <p className="text-center text-gray-500 py-8">
                        No users found
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* View Details Modal - Enhanced */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Quote Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <FiX />
              </button>
            </div>

            {/* Status Banner */}
            <div
              className={`p-3 rounded-lg mb-4 ${selectedItem.status === "completed"
                ? "bg-green-50 border border-green-200"
                : selectedItem.status === "confirmed"
                  ? "bg-blue-50 border border-blue-200"
                  : selectedItem.status === "cancelled"
                    ? "bg-red-50 border border-red-200"
                    : "bg-yellow-50 border border-yellow-200"
                }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    selectedItem.status
                  )}`}
                >
                  {selectedItem.status?.charAt(0).toUpperCase() +
                    selectedItem.status?.slice(1)}
                </span>
                <span className="text-sm text-gray-500">
                  Created:{" "}
                  {new Date(selectedItem.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Quote ID</p>
                  <p className="font-semibold text-primary">
                    {selectedItem.quoteId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Move Type</p>
                  <p className="font-medium capitalize">
                    {selectedItem.moveType}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">
                  Customer Information
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {selectedItem.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedItem.name}</p>
                    <p className="text-sm text-gray-600">
                      {selectedItem.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedItem.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">📍 From</p>
                  <p className="font-semibold text-gray-800">
                    {selectedItem.fromCity}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedItem.fromAddress || "No address provided"}
                  </p>
                  {selectedItem.floorFrom !== undefined && (
                    <p className="text-xs text-gray-500 mt-1">
                      Floor: {selectedItem.floorFrom}
                    </p>
                  )}
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">📍 To</p>
                  <p className="font-semibold text-gray-800">
                    {selectedItem.toCity}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedItem.toAddress || "No address provided"}
                  </p>
                  {selectedItem.floorTo !== undefined && (
                    <p className="text-xs text-gray-500 mt-1">
                      Floor: {selectedItem.floorTo}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Move Date</p>
                  <p className="font-medium text-lg">
                    {new Date(selectedItem.moveDate).toLocaleDateString(
                      "en-IN",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Property Type</p>
                  <p className="font-medium capitalize">
                    {selectedItem.propertyType || "Not specified"}
                  </p>
                </div>
              </div>

              {selectedItem.specialInstructions && (
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm text-amber-700 mb-1">
                    📝 Special Instructions
                  </p>
                  <p className="text-gray-700">
                    {selectedItem.specialInstructions}
                  </p>
                </div>
              )}

              {/* Admin Actions */}
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Admin Actions
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.status !== "contacted" &&
                    selectedItem.status !== "confirmed" &&
                    selectedItem.status !== "completed" && (
                      <button
                        onClick={() => {
                          updateQuoteStatus(selectedItem._id, "contacted");
                          setSelectedItem({
                            ...selectedItem,
                            status: "contacted",
                          });
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                      >
                        <FiPhone size={16} />
                        Mark as Contacted
                      </button>
                    )}
                  {selectedItem.status !== "confirmed" &&
                    selectedItem.status !== "completed" && (
                      <button
                        onClick={() => {
                          updateQuoteStatus(selectedItem._id, "confirmed");
                          setSelectedItem({
                            ...selectedItem,
                            status: "confirmed",
                          });
                        }}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
                      >
                        <FiCheck size={16} />
                        Confirm Quote
                      </button>
                    )}
                  {selectedItem.status !== "completed" && (
                    <button
                      onClick={() => {
                        updateQuoteStatus(selectedItem._id, "completed");
                        setSelectedItem({
                          ...selectedItem,
                          status: "completed",
                        });
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                    >
                      <FiCheckCircle size={16} />
                      Mark as Completed
                    </button>
                  )}
                  {selectedItem.status !== "cancelled" && (
                    <button
                      onClick={() => {
                        updateQuoteStatus(selectedItem._id, "cancelled");
                        setSelectedItem({
                          ...selectedItem,
                          status: "cancelled",
                        });
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                    >
                      <FiX size={16} />
                      Cancel Quote
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Status Summary */}
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-xs text-gray-500 uppercase mb-1">
                  Current Progress
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${[
                      "pending",
                      "contacted",
                      "confirmed",
                      "completed",
                    ].includes(selectedItem.status)
                      ? "bg-green-500"
                      : "bg-gray-300"
                      }`}
                  ></div>
                  <div
                    className={`w-8 h-0.5 ${["contacted", "confirmed", "completed"].includes(
                      selectedItem.status
                    )
                      ? "bg-green-500"
                      : "bg-gray-300"
                      }`}
                  ></div>
                  <div
                    className={`w-3 h-3 rounded-full ${["contacted", "confirmed", "completed"].includes(
                      selectedItem.status
                    )
                      ? "bg-green-500"
                      : "bg-gray-300"
                      }`}
                  ></div>
                  <div
                    className={`w-8 h-0.5 ${["confirmed", "completed"].includes(selectedItem.status)
                      ? "bg-green-500"
                      : "bg-gray-300"
                      }`}
                  ></div>
                  <div
                    className={`w-3 h-3 rounded-full ${["confirmed", "completed"].includes(selectedItem.status)
                      ? "bg-green-500"
                      : "bg-gray-300"
                      }`}
                  ></div>
                  <div
                    className={`w-8 h-0.5 ${selectedItem.status === "completed"
                      ? "bg-green-500"
                      : "bg-gray-300"
                      }`}
                  ></div>
                  <div
                    className={`w-3 h-3 rounded-full ${selectedItem.status === "completed"
                      ? "bg-green-500"
                      : "bg-gray-300"
                      }`}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
                  <span>Received</span>
                  <span>Contacted</span>
                  <span>Confirmed</span>
                  <span>Completed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* User Management Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${selectedUser.role === "admin"
                      ? "bg-gradient-to-r from-primary to-secondary"
                      : "bg-gray-400"
                      }`}
                  >
                    {selectedUser.firstName?.charAt(0)}
                    {selectedUser.lastName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {userModalMode === "view" && "User Details"}
                      {userModalMode === "edit" && "Edit User"}
                      {userModalMode === "delete" && "Delete User"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeUserModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Action Message */}
              {userActionMessage.message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${userActionMessage.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                >
                  {userActionMessage.type === "success" ? (
                    <FiCheckCircle />
                  ) : (
                    <FiAlertCircle />
                  )}
                  {userActionMessage.message}
                </motion.div>
              )}

              {/* View Mode */}
              {userModalMode === "view" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <FiUser size={14} />
                        <span className="text-xs uppercase">First Name</span>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {selectedUser.firstName}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <FiUser size={14} />
                        <span className="text-xs uppercase">Last Name</span>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {selectedUser.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <FiMail size={14} />
                      <span className="text-xs uppercase">Email</span>
                    </div>
                    <p className="font-semibold text-gray-800">
                      {selectedUser.email}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <FiPhone size={14} />
                        <span className="text-xs uppercase">Phone</span>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {selectedUser.phone || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <FiShield size={14} />
                        <span className="text-xs uppercase">Role</span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${selectedUser.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <FiCalendar size={14} />
                      <span className="text-xs uppercase">Member Since</span>
                    </div>
                    <p className="font-semibold text-gray-800">
                      {new Date(selectedUser.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setUserModalMode("edit")}
                      className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                    >
                      <FiEdit /> Edit User
                    </button>
                    {selectedUser._id !== currentUser?._id && (
                      <button
                        onClick={() => setUserModalMode("delete")}
                        className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <FiTrash2 /> Delete User
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Edit Mode */}
              {userModalMode === "edit" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={editUserData.firstName}
                        onChange={handleEditUserChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={editUserData.lastName}
                        onChange={handleEditUserChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={selectedUser.email}
                      disabled
                      className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={editUserData.phone}
                      onChange={handleEditUserChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      value={editUserData.role}
                      onChange={handleEditUserChange}
                      disabled={selectedUser._id === currentUser?._id}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${selectedUser._id === currentUser?._id
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                        }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    {selectedUser._id === currentUser?._id && (
                      <p className="text-xs text-orange-600 mt-1">
                        You cannot change your own role
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setUserModalMode("view")}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateUser}
                      disabled={userActionLoading}
                      className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {userActionLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <FiCheck /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Delete Mode */}
              {userModalMode === "delete" && (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <FiAlertCircle className="mx-auto text-red-500 text-4xl mb-3" />
                    <h4 className="text-lg font-bold text-red-700 mb-2">
                      Delete User Account
                    </h4>
                    <p className="text-red-600 text-sm">
                      Are you sure you want to delete{" "}
                      <strong>
                        {selectedUser.firstName} {selectedUser.lastName}
                      </strong>
                      's account?
                    </p>
                    <p className="text-red-500 text-xs mt-2">
                      This action cannot be undone. All user data will be
                      permanently removed.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      User Information:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>
                        <strong>Name:</strong> {selectedUser.firstName}{" "}
                        {selectedUser.lastName}
                      </li>
                      <li>
                        <strong>Email:</strong> {selectedUser.email}
                      </li>
                      <li>
                        <strong>Role:</strong> {selectedUser.role}
                      </li>
                      <li>
                        <strong>Joined:</strong>{" "}
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setUserModalMode("view")}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteUser}
                      disabled={userActionLoading}
                      className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {userActionLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <FiTrash2 /> Delete User
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Admin Modal */}
      <AnimatePresence>
        {showCreateAdminModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border-t-4 border-primary"
            >
              {/* Admin Badge */}
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                  <FiShield /> ADMINISTRATOR ACCESS
                </div>
              </div>

              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
                    <FiShield className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Create Admin Account
                    </h3>
                    <p className="text-sm text-purple-600 font-medium">
                      Full system access privileges
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCreateAdminModal(false);
                    setShowAdminPassword(false);
                    setShowAdminConfirmPassword(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Warning Banner */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 rounded-lg p-3 mb-4">
                <p className="text-sm text-purple-800 font-medium text-center">
                  ⚠️ Creating an ADMIN account - NOT a regular user
                </p>
              </div>

              {/* Message */}
              {createAdminMessage.message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${createAdminMessage.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                >
                  {createAdminMessage.type === "success" ? (
                    <FiCheckCircle />
                  ) : (
                    <FiAlertCircle />
                  )}
                  {createAdminMessage.message}
                </motion.div>
              )}

              {/* Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FiUser className="inline mr-1" /> First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={createAdminData.firstName}
                      onChange={handleCreateAdminChange}
                      placeholder="John"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FiUser className="inline mr-1" /> Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={createAdminData.lastName}
                      onChange={handleCreateAdminChange}
                      placeholder="Doe"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiMail className="inline mr-1" /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={createAdminData.email}
                    onChange={handleCreateAdminChange}
                    placeholder="admin@unitedpackers.com"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiPhone className="inline mr-1" /> Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={createAdminData.phone}
                    onChange={handleCreateAdminChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiLock className="inline mr-1" /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminPassword ? "text" : "password"}
                      name="password"
                      value={createAdminData.password}
                      onChange={handleCreateAdminChange}
                      placeholder="Min. 8 characters"
                      className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showAdminPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiLock className="inline mr-1" /> Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={createAdminData.confirmPassword}
                      onChange={handleCreateAdminChange}
                      placeholder="Re-enter password"
                      className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminConfirmPassword(!showAdminConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showAdminConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                    <FiAlertCircle className="text-lg" />
                    <span>Admin Privileges Include:</span>
                  </div>
                  <ul className="text-sm text-red-600 space-y-1 ml-6 list-disc">
                    <li>View & manage all user accounts</li>
                    <li>Delete any user from the system</li>
                    <li>Access all quotes, enquiries & contacts</li>
                    <li>Change quote status & respond to customers</li>
                    <li>Create other admin accounts</li>
                  </ul>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowCreateAdminModal(false);
                      setShowAdminPassword(false);
                      setShowAdminConfirmPassword(false);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAdmin}
                    disabled={createAdminLoading}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {createAdminLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiUserPlus /> Create Admin
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
