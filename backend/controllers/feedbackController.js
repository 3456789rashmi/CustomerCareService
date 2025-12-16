const Feedback = require("../models/Feedback");
const Quote = require("../models/Quote");

exports.submitFeedback = async (req, res) => {
    try {
        const { quoteId, rating, comment } = req.body;
        const userId = req.user._id;

        // Validate input
        if (!quoteId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Quote ID and rating are required",
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }

        // Check if quote exists and belongs to user
        const quote = await Quote.findById(quoteId);
        if (!quote) {
            return res.status(404).json({
                success: false,
                message: "Quote not found",
            });
        }

        // Check if quote is completed
        if (quote.status !== "completed") {
            return res.status(400).json({
                success: false,
                message: "Feedback can only be submitted for completed quotes",
            });
        }

        // Check if quote belongs to user
        if (quote.userId && quote.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only submit feedback for your own quotes",
            });
        }

        // Check if feedback already exists
        const existingFeedback = await Feedback.findOne({
            quoteId,
            userId,
        });

        let feedback;
        if (existingFeedback) {
            // Update existing feedback
            existingFeedback.rating = rating;
            existingFeedback.comment = comment;
            feedback = await existingFeedback.save();
        } else {
            // Create new feedback
            feedback = await Feedback.create({
                quoteId,
                userId,
                rating,
                comment,
            });
        }

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            data: feedback,
        });
    } catch (err) {
        console.error("Submit feedback error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to submit feedback",
        });
    }
};

exports.getQuoteFeedback = async (req, res) => {
    try {
        const { quoteId } = req.params;

        const feedback = await Feedback.findOne({ quoteId })
            .populate("userId", "firstName lastName email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: feedback,
        });
    } catch (err) {
        console.error("Get feedback error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch feedback",
        });
    }
};

exports.getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .populate("quoteId", "quoteId moveType fromCity toCity status")
            .populate("userId", "firstName lastName email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: feedback,
        });
    } catch (err) {
        console.error("Get all feedback error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch feedback",
        });
    }
};

exports.getMyFeedbacks = async (req, res) => {
    try {
        const userId = req.user._id;

        const feedbacks = await Feedback.find({ userId })
            .populate("quoteId", "quoteId moveType fromCity toCity status")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: feedbacks,
        });
    } catch (err) {
        console.error("Get my feedbacks error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch feedbacks",
        });
    }
};
