const User = require("../models/User");
const Quote = require("../models/Quote");
const Enquiry = require("../models/Enquiry");
const Contact = require("../models/Contact");
const Feedback = require("../models/Feedback");

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getAdminDashboard = async (req, res) => {
  try {
    // Today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // This week (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // This month
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // User Statistics
    const totalUsers = await User.countDocuments({ role: "user" });
    const newUsersToday = await User.countDocuments({
      role: "user",
      createdAt: { $gte: today },
    });
    const newUsersWeek = await User.countDocuments({
      role: "user",
      createdAt: { $gte: weekAgo },
    });

    // Quote Statistics
    const totalQuotes = await Quote.countDocuments();
    const pendingQuotes = await Quote.countDocuments({ status: "pending" });
    const quotesToday = await Quote.countDocuments({
      createdAt: { $gte: today },
    });
    const quotesWeek = await Quote.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    const quotesByStatus = await Quote.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const quotesByMoveType = await Quote.aggregate([
      { $group: { _id: "$moveType", count: { $sum: 1 } } },
    ]);

    // Enquiry Statistics
    const totalEnquiries = await Enquiry.countDocuments();
    const newEnquiries = await Enquiry.countDocuments({ status: "new" });
    const enquiriesToday = await Enquiry.countDocuments({
      createdAt: { $gte: today },
    });

    const enquiriesByType = await Enquiry.aggregate([
      { $group: { _id: "$enquiryType", count: { $sum: 1 } } },
    ]);

    const enquiriesByPriority = await Enquiry.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    // Contact Statistics
    const totalContacts = await Contact.countDocuments();
    const unreadContacts = await Contact.countDocuments({ status: "unread" });
    const contactsToday = await Contact.countDocuments({
      createdAt: { $gte: today },
    });

    // Revenue estimate (from accepted/completed quotes)
    const revenueData = await Quote.aggregate([
      {
        $match: {
          status: { $in: ["accepted", "completed"] },
          finalCost: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$finalCost" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent activity
    const recentQuotes = await Quote.find()
      .sort("-createdAt")
      .limit(5)
      .select("quoteId name fromCity toCity status createdAt");

    const recentEnquiries = await Enquiry.find()
      .sort("-createdAt")
      .limit(5)
      .select("enquiryId name subject status createdAt");

    const recentContacts = await Contact.find()
      .sort("-createdAt")
      .limit(5)
      .select("contactId name subject status createdAt");

    res.status(200).json({
      success: true,
      data: {
        // Counts for real-time comparison
        counts: {
          users: totalUsers,
          quotes: totalQuotes,
          enquiries: totalEnquiries,
          contacts: totalContacts,
        },
        // Total counts for display
        totalUsers,
        totalQuotes,
        totalEnquiries,
        totalContacts,
        pendingQuotes,
        acceptedQuotes: await Quote.countDocuments({ status: "accepted" }),
        completedQuotes: await Quote.countDocuments({ status: "completed" }),
        users: {
          total: totalUsers,
          today: newUsersToday,
          thisWeek: newUsersWeek,
        },
        quotes: {
          total: totalQuotes,
          pending: pendingQuotes,
          today: quotesToday,
          thisWeek: quotesWeek,
          byStatus: quotesByStatus,
          byMoveType: quotesByMoveType,
        },
        enquiries: {
          total: totalEnquiries,
          new: newEnquiries,
          today: enquiriesToday,
          byType: enquiriesByType,
          byPriority: enquiriesByPriority,
        },
        contacts: {
          total: totalContacts,
          unread: unreadContacts,
          today: contactsToday,
        },
        revenue: {
          total: revenueData[0]?.totalRevenue || 0,
          completedOrders: revenueData[0]?.count || 0,
        },
        recentActivity: {
          quotes: recentQuotes,
          enquiries: recentEnquiries,
          contacts: recentContacts,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const {
      role,
      search,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-password");

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// @desc    Get single user with their quotes and enquiries
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's quotes and enquiries
    const quotes = await Quote.find({ user: user._id })
      .sort("-createdAt")
      .limit(10)
      .select("quoteId fromCity toCity status estimatedCost createdAt");

    const enquiries = await Enquiry.find({ user: user._id })
      .sort("-createdAt")
      .limit(10)
      .select("enquiryId subject status createdAt");

    res.status(200).json({
      success: true,
      data: {
        user,
        quotes,
        enquiries,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, role, isVerified, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, phone, role, isVerified, address },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account from admin panel",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

// @desc    Create admin user
// @route   POST /api/admin/create-admin
// @access  Private/Admin
exports.createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create admin user
    const admin = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: "admin",
      isVerified: true,
    });

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      data: {
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create admin",
      error: error.message,
    });
  }
};

// @desc    Get all feedbacks
// @route   GET /api/admin/feedback
// @access  Private/Admin
exports.getAllFeedback = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const feedbacks = await Feedback.find()
      .populate("quoteId", "quoteId moveType fromCity toCity status")
      .populate("userId", "firstName lastName email phone")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Feedback.countDocuments();

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedbacks",
      error: error.message,
    });
  }
};
