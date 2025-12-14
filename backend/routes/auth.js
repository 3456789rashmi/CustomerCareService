const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validate } = require("../middleware/validation");
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// Validation rules
const registerValidation = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 50 })
    .withMessage("First name cannot exceed 50 characters"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 50 })
    .withMessage("Last name cannot exceed 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom(async (value) => {
      const user = await User.findOne({ email: value.toLowerCase() });
      if (user) {
        throw new Error("User is already registered with this email");
      }
    }),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Please enter a valid 10-digit phone number")
    .custom(async (value) => {
      const user = await User.findOne({ phone: value });
      if (user) {
        throw new Error("User is already registered with this phone number");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase, and number"),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Routes
// @route   POST /api/auth/register
router.post("/register", registerValidation, validate, register);

// @route   POST /api/auth/login
router.post("/login", loginValidation, validate, login);

// @route   GET /api/auth/me
router.get("/me", protect, getMe);

// @route   POST /api/auth/logout
router.post("/logout", protect, logout);

// @route   PUT /api/auth/updateprofile
router.put("/updateprofile", protect, updateProfile);

// @route   PUT /api/auth/changepassword
router.put("/changepassword", protect, changePassword);

// @route   POST /api/auth/forgotpassword
router.post("/forgotpassword", forgotPassword);

// @route   POST /api/auth/resetpassword
router.post("/resetpassword", resetPassword);

module.exports = router;
