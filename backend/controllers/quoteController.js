const Quote = require("../models/Quote");
const { sendEmail, emailTemplates } = require("../utils/sendEmail");

// @desc    Create a new quote request
// @route   POST /api/quotes
// @access  Public
exports.createQuote = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      moveType,
      fromCity,
      fromAddress,
      fromPincode,
      toCity,
      toAddress,
      toPincode,
      propertyType,
      floorFrom,
      floorTo,
      liftAvailableFrom,
      liftAvailableTo,
      moveDate,
      flexibility,
      items,
      packingRequired,
      unpackingRequired,
      storageRequired,
      insuranceRequired,
      specialInstructions,
      paymentMethod,
    } = req.body;

    console.log("Creating quote for user:", req.user?.id, "Email:", email);

    // Create quote
    const quote = await Quote.create({
      name,
      email,
      phone,
      moveType,
      fromCity,
      fromAddress,
      fromPincode,
      toCity,
      toAddress,
      toPincode,
      propertyType,
      floorFrom,
      floorTo,
      liftAvailableFrom,
      liftAvailableTo,
      moveDate,
      flexibility,
      items,
      packingRequired,
      unpackingRequired,
      storageRequired,
      insuranceRequired,
      specialInstructions,
      paymentMethod,
      user: req.user ? req.user.id : null,
    });

    console.log("Quote created:", quote._id, "Quote ID:", quote.quoteId, "User ID:", quote.user);

    // Send confirmation email
    try {
      const emailData = emailTemplates.quoteConfirmation({
        name,
        quoteId: quote.quoteId,
        fromCity,
        toCity,
        moveDate: new Date(moveDate).toLocaleDateString("en-IN"),
        moveType,
      });
      await sendEmail({
        to: email,
        subject: emailData.subject,
        html: emailData.html,
      });
    } catch (emailError) {
      console.log(
        "Quote confirmation email could not be sent:",
        emailError.message
      );
    }

    res.status(201).json({
      success: true,
      message: "Quote request submitted successfully",
      data: {
        quoteId: quote.quoteId,
        name: quote.name,
        email: quote.email,
        fromCity: quote.fromCity,
        toCity: quote.toCity,
        moveDate: quote.moveDate,
        status: quote.status,
      },
    });
  } catch (error) {
    console.error("Create quote error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit quote request",
      error: error.message,
    });
  }
};

// @desc    Get all quotes (Admin)
// @route   GET /api/quotes
// @access  Private/Admin
exports.getAllQuotes = async (req, res) => {
  try {
    const {
      status,
      moveType,
      fromCity,
      toCity,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (moveType) query.moveType = moveType;
    if (fromCity) query.fromCity = new RegExp(fromCity, "i");
    if (toCity) query.toCity = new RegExp(toCity, "i");

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const quotes = await Quote.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "firstName lastName email")
      .populate("assignedTo", "firstName lastName");

    const total = await Quote.countDocuments(query);

    res.status(200).json({
      success: true,
      count: quotes.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: quotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch quotes",
      error: error.message,
    });
  }
};

// @desc    Get single quote by ID
// @route   GET /api/quotes/:id
// @access  Private
exports.getQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate("user", "firstName lastName email phone")
      .populate("assignedTo", "firstName lastName email");

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    // Check authorization - user can only view their own quotes
    if (
      req.user.role !== "admin" &&
      quote.user &&
      quote.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this quote",
      });
    }

    res.status(200).json({
      success: true,
      data: quote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch quote",
      error: error.message,
    });
  }
};

// @desc    Get quote by quote ID (public tracking)
// @route   GET /api/quotes/track/:quoteId
// @access  Public
exports.trackQuote = async (req, res) => {
  try {
    const quote = await Quote.findOne({ quoteId: req.params.quoteId });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found. Please check your quote ID.",
      });
    }

    // Return limited info for public tracking
    res.status(200).json({
      success: true,
      data: {
        quoteId: quote.quoteId,
        name: quote.name,
        fromCity: quote.fromCity,
        toCity: quote.toCity,
        moveDate: quote.moveDate,
        moveType: quote.moveType,
        status: quote.status,
        estimatedCost: quote.estimatedCost,
        createdAt: quote.createdAt,
        quotedAt: quote.quotedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to track quote",
      error: error.message,
    });
  }
};

// @desc    Get full quote details by quoteId (Admin)
// @route   GET /api/quotes/details/:quoteId
// @access  Private/Admin
exports.getQuoteByQuoteId = async (req, res) => {
  try {
    const quote = await Quote.findOne({ quoteId: req.params.quoteId })
      .populate("user", "firstName lastName email phone")
      .populate("assignedTo", "firstName lastName email");

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    // Check authorization - user can only view their own quotes, admin can view all
    if (
      req.user.role !== "admin" &&
      quote.user &&
      quote.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "User role '" + req.user.role + "' is not authorized to access this route",
      });
    }

    res.status(200).json({
      success: true,
      data: quote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch quote",
      error: error.message,
    });
  }
};

// @desc    Update quote status (Admin)
// @route   PUT /api/quotes/:id
// @access  Private/Admin
exports.updateQuote = async (req, res) => {
  try {
    const { status, estimatedCost, finalCost, adminNotes, assignedTo } =
      req.body;

    let quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    // Update fields
    if (status) {
      quote.status = status;
      if (status === "quoted") {
        quote.quotedAt = new Date();
      }
    }
    if (estimatedCost !== undefined) quote.estimatedCost = estimatedCost;
    if (finalCost !== undefined) quote.finalCost = finalCost;
    if (adminNotes) quote.adminNotes = adminNotes;
    if (assignedTo) quote.assignedTo = assignedTo;

    await quote.save();

    // Send status update email if quoted
    if (status === "quoted" && estimatedCost) {
      try {
        const emailData = emailTemplates.quoteReady({
          name: quote.name,
          quoteId: quote.quoteId,
          estimatedCost,
          fromCity: quote.fromCity,
          toCity: quote.toCity,
        });
        await sendEmail({
          to: quote.email,
          subject: emailData.subject,
          html: emailData.html,
        });
      } catch (emailError) {
        console.log("Quote ready email could not be sent:", emailError.message);
      }
    }

    // Send payment request email if status changed to accepted
    if (status === "accepted" && finalCost) {
      try {
        const moveDate = new Date(quote.moveDate).toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const emailData = emailTemplates.paymentRequest({
          name: quote.name,
          quoteId: quote.quoteId,
          finalCost,
          fromCity: quote.fromCity,
          toCity: quote.toCity,
          moveDate,
        });
        await sendEmail({
          to: quote.email,
          subject: emailData.subject,
          html: emailData.html,
        });
        console.log(`✅ Payment request email sent to ${quote.email} for quote ${quote.quoteId}`);
      } catch (emailError) {
        console.log("Payment request email could not be sent:", emailError.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Quote updated successfully",
      data: quote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update quote",
      error: error.message,
    });
  }
};

// @desc    Get user's quotes
// @route   GET /api/quotes/my-quotes
// @access  Private
exports.getMyQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ user: req.user.id })
      .sort("-createdAt")
      .select(
        "quoteId fromCity toCity moveDate status estimatedCost createdAt"
      );

    res.status(200).json({
      success: true,
      count: quotes.length,
      data: quotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your quotes",
      error: error.message,
    });
  }
};

// @desc    Delete quote (Admin)
// @route   DELETE /api/quotes/:id
// @access  Private/Admin
exports.deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    await quote.deleteOne();

    res.status(200).json({
      success: true,
      message: "Quote deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete quote",
      error: error.message,
    });
  }
};

// @desc    Delete user's own quote (only if pending or reviewing)
// @route   DELETE /api/quotes/:id/user
// @access  Private/User
exports.deleteUserQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    // Check if quote belongs to user
    if (quote.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this quote",
      });
    }

    // Check if quote can be deleted (only pending and reviewing statuses)
    const deletableStatuses = ["pending", "reviewing"];
    if (!deletableStatuses.includes(quote.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete quote with status '${quote.status}'. Quotes can only be deleted when pending or under review.`,
      });
    }

    // Store quote details before deletion for email
    const quoteData = {
      quoteId: quote.quoteId,
      name: quote.name,
      fromCity: quote.fromCity,
      toCity: quote.toCity,
      deletedDate: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    await quote.deleteOne();

    // Send deletion confirmation email
    try {
      await sendEmail({
        to: quote.email,
        ...emailTemplates.quoteDeletion(quoteData),
      });
      console.log(`✅ Deletion confirmation email sent to ${quote.email}`);
    } catch (emailError) {
      console.error("Failed to send deletion confirmation email:", emailError.message);
      // Continue with response even if email fails
    }

    res.status(200).json({
      success: true,
      message: "Quote deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete quote",
      error: error.message,
    });
  }
};

// @desc    Get quote statistics (Admin)
// @route   GET /api/quotes/stats
// @access  Private/Admin
exports.getQuoteStats = async (req, res) => {
  try {
    const stats = await Quote.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalQuotes = await Quote.countDocuments();
    const todayQuotes = await Quote.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });

    const moveTypeStats = await Quote.aggregate([
      {
        $group: {
          _id: "$moveType",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalQuotes,
        today: todayQuotes,
        byStatus: stats,
        byMoveType: moveTypeStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
};

// @desc    Claim unassigned quotes by email (link quotes to user account)
// @route   POST /api/quotes/claim
// @access  Private
exports.claimQuotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    console.log("Claiming quotes for email:", userEmail);

    // Find all quotes with matching email that don't have a user assigned
    const claimedQuotes = await Quote.updateMany(
      {
        email: userEmail,
        $or: [
          { user: { $exists: false } },
          { user: null }
        ]
      },
      { user: userId }
    );

    console.log("Claimed quotes:", claimedQuotes.modifiedCount);

    res.status(200).json({
      success: true,
      message: `Claimed ${claimedQuotes.modifiedCount} quotes`,
      data: {
        claimedCount: claimedQuotes.modifiedCount,
      },
    });
  } catch (error) {
    console.error("Claim quotes error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to claim quotes",
      error: error.message,
    });
  }
};

// @desc    Submit payment for a quote
// @route   PUT /api/quotes/:id/payment
// @access  Private
exports.submitPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, amount, paymentDetails } = req.body;

    // Validate input
    if (!paymentMethod || !amount) {
      return res.status(400).json({
        success: false,
        message: "Payment method and amount are required",
      });
    }

    // Find quote
    const quote = await Quote.findById(id);
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    // Check if quote is accepted
    if (quote.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Payment can only be submitted for accepted quotes",
      });
    }

    // Update quote with payment information
    quote.paymentStatus = "completed";
    quote.paymentDetails = {
      method: paymentMethod,
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount: amount,
      paidAt: new Date(),
      ...paymentDetails,
    };

    await quote.save();

    res.status(200).json({
      success: true,
      message: "Payment submitted successfully",
      data: {
        quoteId: quote.quoteId,
        paymentStatus: quote.paymentStatus,
        transactionId: quote.paymentDetails.transactionId,
      },
    });
  } catch (error) {
    console.error("Submit payment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit payment",
      error: error.message,
    });
  }
};
