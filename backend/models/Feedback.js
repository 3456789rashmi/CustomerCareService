const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        quoteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quote",
            required: [true, "Quote ID is required"],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot exceed 5"],
        },
        comment: {
            type: String,
            maxlength: [500, "Comment cannot exceed 500 characters"],
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
