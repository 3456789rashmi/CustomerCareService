const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validate } = require("../middleware/validation");
const { protect, authorize } = require("../middleware/auth");
const {
  createQuote,
  getAllQuotes,
  getQuote,
  trackQuote,
  updateQuote,
  getMyQuotes,
  deleteQuote,
  getQuoteStats,
  claimQuotes,
} = require("../controllers/quoteController");

// Validation rules
const createQuoteValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .customSanitizer((value) => value.replace(/[\s\-\(\)]/g, ""))
    .matches(/^(\+91|91)?[6-9][0-9]{9}$/)
    .withMessage("Please enter a valid Indian phone number (10 digits)"),
  body("moveType")
    .notEmpty()
    .withMessage("Move type is required")
    .isIn([
      "household",
      "office",
      "vehicle",
      "warehouse",
      "international",
      "local",
    ])
    .withMessage("Invalid move type"),
  body("fromCity").trim().notEmpty().withMessage("Origin city is required"),
  body("toCity").trim().notEmpty().withMessage("Destination city is required"),
  body("moveDate")
    .notEmpty()
    .withMessage("Moving date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
];

// Public routes
// @route   GET /api/quotes/track/:quoteId - Track quote by ID
router.get("/track/:quoteId", trackQuote);

// Private routes (require authentication)
// @route   POST /api/quotes - Create new quote request
router.post("/", protect, createQuoteValidation, validate, createQuote);

// @route   POST /api/quotes/claim - Claim unassigned quotes by email
router.post("/claim", protect, claimQuotes);

// Private routes (logged in users)
// @route   GET /api/quotes/my-quotes - Get user's quotes
router.get("/my-quotes", protect, getMyQuotes);

// @route   GET /api/quotes/:id - Get single quote
router.get("/:id", protect, getQuote);

// Admin routes
// @route   GET /api/quotes - Get all quotes
router.get("/", protect, authorize("admin"), getAllQuotes);

// @route   GET /api/quotes/stats - Get statistics
router.get("/stats", protect, authorize("admin"), getQuoteStats);

// @route   PUT /api/quotes/:id - Update quote
router.put("/:id", protect, authorize("admin"), updateQuote);

// @route   DELETE /api/quotes/:id - Delete quote
router.delete("/:id", protect, authorize("admin"), deleteQuote);

module.exports = router;
