const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 8.x no longer needs these options, but keeping for compatibility
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("📦 Mongoose connected to database");
});

mongoose.connection.on("error", (err) => {
  console.error(`📦 Mongoose connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("📦 Mongoose disconnected from database");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("📦 Mongoose connection closed due to app termination");
  process.exit(0);
});

module.exports = connectDB;
