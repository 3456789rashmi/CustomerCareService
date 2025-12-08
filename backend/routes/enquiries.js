const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validate } = require("../middleware/validation");
const { protect, authorize } = require("../middleware/auth");
const {
  createEnquiry,
  getAllEnquiries,
  getEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiryStats,
} = require("../controllers/enquiryController");

// Validation rules
const createEnquiryValidation = [
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
    .matches(/^[0-9]{10}$/)
    .withMessage("Please enter a valid 10-digit phone number"),
  body("enquiryType")
    .notEmpty()
    .withMessage("Enquiry type is required")
    .isIn([
      "general",
      "pricing",
      "service",
      "corporate",
      "partnership",
      "complaint",
      "feedback",
      "other",
    ])
    .withMessage("Invalid enquiry type"),
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ max: 200 })
    .withMessage("Subject cannot exceed 200 characters"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 2000 })
    .withMessage("Message cannot exceed 2000 characters"),
];

// Public routes
// @route   POST /api/enquiries - Create new enquiry
router.post("/", createEnquiryValidation, validate, createEnquiry);

// Admin routes
// @route   GET /api/enquiries/stats - Get statistics (must be before /:id)
router.get("/stats", protect, authorize("admin"), getEnquiryStats);

// @route   GET /api/enquiries - Get all enquiries
router.get("/", protect, authorize("admin"), getAllEnquiries);

// @route   GET /api/enquiries/:id - Get single enquiry
router.get("/:id", protect, authorize("admin"), getEnquiry);

// @route   PUT /api/enquiries/:id - Update enquiry
router.put("/:id", protect, authorize("admin"), updateEnquiry);

// @route   DELETE /api/enquiries/:id - Delete enquiry
router.delete("/:id", protect, authorize("admin"), deleteEnquiry);

module.exports = router;
