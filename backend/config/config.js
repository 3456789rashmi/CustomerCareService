module.exports = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database
  mongoUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/unitedpackers",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",
  jwtExpire: process.env.JWT_EXPIRE || "7d",

  // Client
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  // Email
  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || "noreply@unitedpackers.com",
  },

  // Quote calculation settings
  pricing: {
    basePrice: 4999,
    pricePerKm: 15,
    pricePerKg: 5,
    packingCharges: {
      basic: 999,
      standard: 1999,
      premium: 3999,
    },
    vehicleTypes: {
      mini: { capacity: "500kg", price: 2000 },
      tempo: { capacity: "1000kg", price: 3500 },
      truck: { capacity: "3000kg", price: 6000 },
      container: { capacity: "5000kg+", price: 10000 },
    },
  },
};
