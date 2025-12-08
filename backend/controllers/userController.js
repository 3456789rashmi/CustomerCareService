const User = require("../models/User");
const Quote = require("../models/Quote");
const Enquiry = require("../models/Enquiry");

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's quotes summary
    const totalQuotes = await Quote.countDocuments({ user: userId });
    const pendingQuotes = await Quote.countDocuments({
      user: userId,
      status: "pending",
    });
    const acceptedQuotes = await Quote.countDocuments({
      user: userId,
      status: "accepted",
    });
    const completedQuotes = await Quote.countDocuments({
      user: userId,
      status: "completed",
    });

    // Get recent quotes
    const recentQuotes = await Quote.find({ user: userId })
      .sort("-createdAt")
      .limit(5)
      .select(
        "quoteId fromCity toCity moveDate status estimatedCost createdAt"
      );

    // Get user's enquiries summary
    const totalEnquiries = await Enquiry.countDocuments({ user: userId });
    const pendingEnquiries = await Enquiry.countDocuments({
      user: userId,
      status: { $in: ["new", "in-progress"] },
    });

    // Get recent enquiries
    const recentEnquiries = await Enquiry.find({ user: userId })
      .sort("-createdAt")
      .limit(3)
      .select("enquiryId subject status createdAt");

    res.status(200).json({
      success: true,
      data: {
        quotes: {
          total: totalQuotes,
          pending: pendingQuotes,
          accepted: acceptedQuotes,
          completed: completedQuotes,
          recent: recentQuotes,
        },
        enquiries: {
          total: totalEnquiries,
          pending: pendingEnquiries,
          recent: recentEnquiries,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstName,
        lastName,
        phone,
        address,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// @desc    Get all user's quotes
// @route   GET /api/users/quotes
// @access  Private
exports.getUserQuotes = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const quotes = await Quote.find(query)
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .select(
        "quoteId fromCity toCity moveDate moveType status estimatedCost finalCost createdAt"
      );

    const total = await Quote.countDocuments(query);

    res.status(200).json({
      success: true,
      count: quotes.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: quotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch quotes",
      error: error.message,
    });
  }
};

// @desc    Get single quote detail for user
// @route   GET /api/users/quotes/:id
// @access  Private
exports.getUserQuoteDetail = async (req, res) => {
  try {
    const quote = await Quote.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    res.status(200).json({
      success: true,
      data: quote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch quote",
      error: error.message,
    });
  }
};

// @desc    Get all user's enquiries
// @route   GET /api/users/enquiries
// @access  Private
exports.getUserEnquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const enquiries = await Enquiry.find(query)
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .select(
        "enquiryId subject enquiryType status response createdAt respondedAt"
      );

    const total = await Enquiry.countDocuments(query);

    res.status(200).json({
      success: true,
      count: enquiries.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
      error: error.message,
    });
  }
};

// @desc    Cancel a quote (if pending)
// @route   PUT /api/users/quotes/:id/cancel
// @access  Private
exports.cancelQuote = async (req, res) => {
  try {
    const quote = await Quote.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    // Can only cancel pending or reviewing quotes
    if (!["pending", "reviewing", "quoted"].includes(quote.status)) {
      return res.status(400).json({
        success: false,
        message: "This quote cannot be cancelled",
      });
    }

    quote.status = "cancelled";
    await quote.save();

    res.status(200).json({
      success: true,
      message: "Quote cancelled successfully",
      data: quote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel quote",
      error: error.message,
    });
  }
};

// @desc    Accept a quote
// @route   PUT /api/users/quotes/:id/accept
// @access  Private
exports.acceptQuote = async (req, res) => {
  try {
    const quote = await Quote.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    // Can only accept quoted quotes
    if (quote.status !== "quoted") {
      return res.status(400).json({
        success: false,
        message:
          "This quote cannot be accepted. Wait for the quote to be ready.",
      });
    }

    quote.status = "accepted";
    quote.respondedAt = new Date();
    await quote.save();

    res.status(200).json({
      success: true,
      message:
        "Quote accepted successfully! Our team will contact you shortly.",
      data: quote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to accept quote",
      error: error.message,
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: error.message,
    });
  }
};
