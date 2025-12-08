const Enquiry = require("../models/Enquiry");
const { sendEmail, emailTemplates } = require("../utils/sendEmail");

// @desc    Create a new enquiry
// @route   POST /api/enquiries
// @access  Public
exports.createEnquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      enquiryType,
      subject,
      message,
      serviceInterested,
      expectedMoveDate,
      fromCity,
      toCity,
      source,
    } = req.body;

    // Set priority based on enquiry type
    let priority = "medium";
    if (enquiryType === "complaint") priority = "high";
    if (enquiryType === "corporate" || enquiryType === "partnership")
      priority = "high";

    // Create enquiry
    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      company,
      enquiryType,
      subject,
      message,
      serviceInterested,
      expectedMoveDate,
      fromCity,
      toCity,
      source,
      priority,
      user: req.user ? req.user.id : null,
    });

    // Send confirmation email
    try {
      const emailData = emailTemplates.enquiryConfirmation({
        name,
        message,
        enquiryId: enquiry.enquiryId,
      });
      await sendEmail({
        to: email,
        subject: emailData.subject,
        html: emailData.html,
      });
    } catch (emailError) {
      console.log(
        "Enquiry confirmation email could not be sent:",
        emailError.message
      );
    }

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully. We will contact you soon!",
      data: {
        enquiryId: enquiry.enquiryId,
        name: enquiry.name,
        subject: enquiry.subject,
        status: enquiry.status,
      },
    });
  } catch (error) {
    console.error("Create enquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry",
      error: error.message,
    });
  }
};

// @desc    Get all enquiries (Admin)
// @route   GET /api/enquiries
// @access  Private/Admin
exports.getAllEnquiries = async (req, res) => {
  try {
    const {
      status,
      enquiryType,
      priority,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (enquiryType) query.enquiryType = enquiryType;
    if (priority) query.priority = priority;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const enquiries = await Enquiry.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("assignedTo", "firstName lastName");

    const total = await Enquiry.countDocuments(query);

    res.status(200).json({
      success: true,
      count: enquiries.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
      error: error.message,
    });
  }
};

// @desc    Get single enquiry
// @route   GET /api/enquiries/:id
// @access  Private/Admin
exports.getEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate("user", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiry",
      error: error.message,
    });
  }
};

// @desc    Update enquiry (Admin)
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
exports.updateEnquiry = async (req, res) => {
  try {
    const { status, priority, assignedTo, response } = req.body;

    let enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    // Update fields
    if (status) {
      enquiry.status = status;
      if (status === "responded") {
        enquiry.respondedAt = new Date();
      }
      if (status === "resolved" || status === "closed") {
        enquiry.resolvedAt = new Date();
      }
    }
    if (priority) enquiry.priority = priority;
    if (assignedTo) enquiry.assignedTo = assignedTo;
    if (response) enquiry.response = response;

    await enquiry.save();

    // Send response email to customer if responded
    if (status === "responded" && response) {
      try {
        await sendEmail({
          to: enquiry.email,
          subject: `Re: ${enquiry.subject} - UnitedPackers`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #3B0A45, #5E4F82); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0;">UnitedPackers</h1>
              </div>
              <div style="padding: 30px;">
                <p>Dear ${enquiry.name},</p>
                <p>Thank you for contacting us. Here is our response to your enquiry:</p>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                  <p><strong>Your enquiry:</strong> ${enquiry.message}</p>
                </div>
                <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0;">
                  <p><strong>Our response:</strong> ${response}</p>
                </div>
                <p>If you have further questions, feel free to reply to this email or call us.</p>
                <p>Best regards,<br>UnitedPackers Team</p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.log("Response email could not be sent:", emailError.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update enquiry",
      error: error.message,
    });
  }
};

// @desc    Delete enquiry (Admin)
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    await enquiry.deleteOne();

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete enquiry",
      error: error.message,
    });
  }
};

// @desc    Get enquiry statistics (Admin)
// @route   GET /api/enquiries/stats
// @access  Private/Admin
exports.getEnquiryStats = async (req, res) => {
  try {
    const statusStats = await Enquiry.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const typeStats = await Enquiry.aggregate([
      { $group: { _id: "$enquiryType", count: { $sum: 1 } } },
    ]);

    const priorityStats = await Enquiry.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const total = await Enquiry.countDocuments();
    const newEnquiries = await Enquiry.countDocuments({ status: "new" });
    const todayEnquiries = await Enquiry.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        new: newEnquiries,
        today: todayEnquiries,
        byStatus: statusStats,
        byType: typeStats,
        byPriority: priorityStats,
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
