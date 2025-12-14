const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
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

// Middleware to handle multer errors
const multerErrorHandler = (err, req, res, next) => {
  if (err && err.message && err.message.includes("image")) {
    // Multer error
    res.status(400).json({
      success: false,
      message: err.message,
    });
  } else if (err && err.code === "LIMIT_FILE_SIZE") {
    res.status(400).json({
      success: false,
      message: "File size exceeds maximum limit of 5MB",
    });
  } else if (err) {
    // Other errors from multer
    res.status(400).json({
      success: false,
      message: err.message || "File upload failed",
    });
  } else {
    next();
  }
};

// Wrap upload middleware to catch errors
const uploadWithErrorHandler = (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    multerErrorHandler(err, req, res, next);
  });
};

// All routes are private (require login)

// @route   GET /api/users/dashboard - Get dashboard summary
router.get("/dashboard", protect, getDashboard);

// @route   GET /api/users/profile - Get user profile
router.get("/profile", protect, getProfile);

// @route   PUT /api/users/profile - Update user profile
router.put("/profile", protect, uploadWithErrorHandler, updateProfile);

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
