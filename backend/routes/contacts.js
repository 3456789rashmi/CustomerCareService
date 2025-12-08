const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validate } = require("../middleware/validation");
const { protect, authorize } = require("../middleware/auth");
const {
  createContact,
  getAllContacts,
  getContact,
  replyToContact,
  updateContact,
  deleteContact,
  getContactStats,
} = require("../controllers/contactController");

// Validation rules
const createContactValidation = [
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
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage("Please enter a valid 10-digit phone number"),
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
// @route   POST /api/contacts - Submit contact form
router.post("/", createContactValidation, validate, createContact);

// Admin routes
// @route   GET /api/contacts/stats - Get statistics (must be before /:id)
router.get("/stats", protect, authorize("admin"), getContactStats);

// @route   GET /api/contacts - Get all contacts
router.get("/", protect, authorize("admin"), getAllContacts);

// @route   GET /api/contacts/:id - Get single contact
router.get("/:id", protect, authorize("admin"), getContact);

// @route   PUT /api/contacts/:id/reply - Reply to contact
router.put("/:id/reply", protect, authorize("admin"), replyToContact);

// @route   PUT /api/contacts/:id - Update contact status
router.put("/:id", protect, authorize("admin"), updateContact);

// @route   DELETE /api/contacts/:id - Delete contact
router.delete("/:id", protect, authorize("admin"), deleteContact);

module.exports = router;
