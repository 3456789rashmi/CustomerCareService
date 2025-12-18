const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getAdminDashboard,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  createAdmin,
  getAllFeedback,
} = require("../controllers/adminController");

// All routes require admin role
router.use(protect);
router.use(authorize("admin"));

// @route   GET /api/admin/dashboard - Get admin dashboard stats
router.get("/dashboard", getAdminDashboard);

// @route   GET /api/admin/feedback - Get all feedbacks (admin only)
router.get("/feedback", getAllFeedback);

// @route   GET /api/admin/users - Get all users
router.get("/users", getAllUsers);

// @route   GET /api/admin/users/:id - Get single user
router.get("/users/:id", getUser);

// @route   PUT /api/admin/users/:id - Update user
router.put("/users/:id", updateUser);

// @route   DELETE /api/admin/users/:id - Delete user
router.delete("/users/:id", deleteUser);

// @route   POST /api/admin/create-admin - Create new admin user
router.post("/create-admin", createAdmin);

// @route   GET /api/admin/feedback - Get all feedbacks
router.get("/feedback", getAllFeedback);

module.exports = router;
