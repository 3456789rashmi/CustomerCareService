const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/quotes", require("./routes/quotes"));
app.use("/api/enquiries", require("./routes/enquiries"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/admin", require("./routes/admin"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "UnitedPackers API is running",
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to UnitedPackers API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      users: "/api/users",
      quotes: "/api/quotes",
      enquiries: "/api/enquiries",
      contacts: "/api/contacts",
      admin: "/api/admin",
    },
  });
});

// Error handling middleware
app.use(require("./middleware/errorHandler"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════╗
  ║   UnitedPackers API Server                 ║
  ║   Running on: http://localhost:${PORT}        ║
  ║   Environment: ${process.env.NODE_ENV || "development"}              ║
  ╚════════════════════════════════════════════╝
  `);
});
