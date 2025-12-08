const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    // Customer Information
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },

    // Enquiry Details
    enquiryType: {
      type: String,
      required: [true, "Enquiry type is required"],
      enum: [
        "general",
        "pricing",
        "service",
        "corporate",
        "partnership",
        "complaint",
        "feedback",
        "other",
      ],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },

    // Service Interest (optional)
    serviceInterested: {
      type: String,
      enum: [
        "household",
        "office",
        "vehicle",
        "warehouse",
        "international",
        "local",
        "packing",
        "storage",
        "none",
      ],
    },
    expectedMoveDate: {
      type: Date,
    },
    fromCity: {
      type: String,
      trim: true,
    },
    toCity: {
      type: String,
      trim: true,
    },

    // Processing
    enquiryId: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "responded", "resolved", "closed"],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    response: {
      type: String,
    },
    respondedAt: Date,
    resolvedAt: Date,

    // Source tracking
    source: {
      type: String,
      enum: ["website", "phone", "email", "social", "referral", "other"],
      default: "website",
    },

    // User Reference (if logged in)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique enquiry ID before saving
enquirySchema.pre("save", async function (next) {
  if (!this.enquiryId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    this.enquiryId = `ENQ${year}${month}${random}`;
  }
  next();
});

// Indexes
enquirySchema.index({ email: 1 });
enquirySchema.index({ status: 1 });
enquirySchema.index({ enquiryType: 1 });
enquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model("Enquiry", enquirySchema);
