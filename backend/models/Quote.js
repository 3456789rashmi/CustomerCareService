const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
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
      match: [
        /^(\+91|91)?[6-9][0-9]{9}$/,
        "Please enter a valid Indian phone number",
      ],
    },

    // Moving Details
    moveType: {
      type: String,
      required: [true, "Move type is required"],
      enum: [
        "household",
        "office",
        "vehicle",
        "warehouse",
        "international",
        "local",
      ],
    },
    fromCity: {
      type: String,
      required: [true, "Origin city is required"],
      trim: true,
    },
    fromAddress: {
      type: String,
      trim: true,
    },
    fromPincode: {
      type: String,
      match: [/^[0-9]{6}$/, "Please enter a valid 6-digit pincode"],
    },
    toCity: {
      type: String,
      required: [true, "Destination city is required"],
      trim: true,
    },
    toAddress: {
      type: String,
      trim: true,
    },
    toPincode: {
      type: String,
      match: [/^[0-9]{6}$/, "Please enter a valid 6-digit pincode"],
    },

    // Property Details
    propertyType: {
      type: String,
      enum: [
        "1bhk",
        "2bhk",
        "3bhk",
        "4bhk",
        "villa",
        "office",
        "shop",
        "other",
      ],
    },
    floorFrom: {
      type: Number,
      min: 0,
      max: 50,
    },
    floorTo: {
      type: Number,
      min: 0,
      max: 50,
    },
    liftAvailableFrom: {
      type: Boolean,
      default: false,
    },
    liftAvailableTo: {
      type: Boolean,
      default: false,
    },

    // Schedule
    moveDate: {
      type: Date,
      required: [true, "Moving date is required"],
    },
    flexibility: {
      type: String,
      enum: ["exact", "flexible-1-2", "flexible-week", "anytime"],
      default: "exact",
    },

    // Items & Services
    items: {
      type: String,
      trim: true,
    },
    packingRequired: {
      type: Boolean,
      default: true,
    },
    unpackingRequired: {
      type: Boolean,
      default: false,
    },
    storageRequired: {
      type: Boolean,
      default: false,
    },
    insuranceRequired: {
      type: Boolean,
      default: false,
    },

    // Additional Info
    specialInstructions: {
      type: String,
      maxlength: [1000, "Special instructions cannot exceed 1000 characters"],
    },

    // Payment Preference
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "upi", "net_banking", "cash", ""],
      default: "",
    },

    // Quote Processing
    quoteId: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "reviewing",
        "quoted",
        "accepted",
        "rejected",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    estimatedCost: {
      type: Number,
      min: 0,
    },
    finalCost: {
      type: Number,
      min: 0,
    },
    adminNotes: {
      type: String,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // User Reference (if logged in)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Tracking
    viewedAt: Date,
    quotedAt: Date,
    respondedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Generate unique quote ID before saving
quoteSchema.pre("save", async function (next) {
  if (!this.quoteId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    this.quoteId = `UP${year}${month}${random}`;
  }
  next();
});

// Index for faster queries
quoteSchema.index({ email: 1 });
quoteSchema.index({ phone: 1 });
quoteSchema.index({ status: 1 });
quoteSchema.index({ createdAt: -1 });
// quoteId index is already created by unique: true

module.exports = mongoose.model("Quote", quoteSchema);
