const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getDashboard,
  getProfile,
  updateProfile,
  getUserQuotes,
  getUserQuoteDetail,
  getUserEnquiries,
  cancelQuote,
  acceptQuote,
  deleteAccount,
} = require("../controllers/userController");

// All routes are private (require login)

// @route   GET /api/users/dashboard - Get dashboard summary
router.get("/dashboard", protect, getDashboard);

// @route   GET /api/users/profile - Get user profile
router.get("/profile", protect, getProfile);

// @route   PUT /api/users/profile - Update user profile
router.put("/profile", protect, updateProfile);

// @route   GET /api/users/quotes - Get all user's quotes
router.get("/quotes", protect, getUserQuotes);

// @route   GET /api/users/quotes/:id - Get quote detail
router.get("/quotes/:id", protect, getUserQuoteDetail);

// @route   PUT /api/users/quotes/:id/cancel - Cancel a quote
router.put("/quotes/:id/cancel", protect, cancelQuote);

// @route   PUT /api/users/quotes/:id/accept - Accept a quote
router.put("/quotes/:id/accept", protect, acceptQuote);

// @route   GET /api/users/enquiries - Get all user's enquiries
router.get("/enquiries", protect, getUserEnquiries);

// @route   DELETE /api/users/account - Delete user account
router.delete("/account", protect, deleteAccount);

module.exports = router;
