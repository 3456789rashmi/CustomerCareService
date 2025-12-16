const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
    submitFeedback,
    getQuoteFeedback,
    getAllFeedback,
    getMyFeedbacks,
} = require("../controllers/feedbackController");

// User routes
// @route   POST /api/feedback/:quoteId - Submit feedback for a quote
router.post("/:quoteId", protect, submitFeedback);

// @route   GET /api/feedback/my-feedbacks - Get user's feedbacks
router.get("/my-feedbacks", protect, getMyFeedbacks);

// @route   GET /api/feedback/:quoteId - Get feedback for a specific quote
router.get("/:quoteId", getQuoteFeedback);

// Admin routes
// @route   GET /api/feedback - Get all feedback (admin only)
router.get("/", protect, authorize("admin"), getAllFeedback);

module.exports = router;
