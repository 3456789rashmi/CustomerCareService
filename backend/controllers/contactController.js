const Contact = require("../models/Contact");
const { sendEmail } = require("../utils/sendEmail");

// @desc    Submit contact form
// @route   POST /api/contacts
// @access  Public
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Create contact
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    // Send confirmation email to user
    try {
      await sendEmail({
        to: email,
        subject: "Message Received - UnitedPackers",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #3B0A45, #5E4F82); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">UnitedPackers</h1>
              <p style="color: #F1BCCF; margin: 5px 0;">Pro Movers</p>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #3B0A45;">Thank you for contacting us!</h2>
              <p>Dear ${name},</p>
              <p>We have received your message and will get back to you within 24-48 hours.</p>
              <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p><strong>Reference ID:</strong> ${contact.contactId}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Your Message:</strong></p>
                <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
              </div>
              <p>For urgent matters, please call us at: <strong>+91 98765 43210</strong></p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.log(
        "Contact confirmation email could not be sent:",
        emailError.message
      );
    }

    // Notify admin about new contact (optional)
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || "admin@unitedpackers.in",
        subject: `New Contact Form Submission - ${contact.contactId}`,
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>New Contact Form Submission</h2>
            <p><strong>ID:</strong> ${contact.contactId}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f5f5f5; padding: 15px;">${message}</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.log(
        "Admin notification email could not be sent:",
        emailError.message
      );
    }

    res.status(201).json({
      success: true,
      message:
        "Your message has been sent successfully! We will contact you soon.",
      data: {
        contactId: contact.contactId,
        name: contact.name,
        subject: contact.subject,
      },
    });
  } catch (error) {
    console.error("Create contact error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// @desc    Get all contacts (Admin)
// @route   GET /api/contacts
// @access  Private/Admin
exports.getAllContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const contacts = await Contact.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
};

// @desc    Get single contact (Admin)
// @route   GET /api/contacts/:id
// @access  Private/Admin
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // Mark as read if unread
    if (contact.status === "unread") {
      contact.status = "read";
      contact.readAt = new Date();
      await contact.save();
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact",
      error: error.message,
    });
  }
};

// @desc    Reply to contact (Admin)
// @route   PUT /api/contacts/:id/reply
// @access  Private/Admin
exports.replyToContact = async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // Update contact
    contact.reply = reply;
    contact.status = "replied";
    contact.repliedAt = new Date();
    await contact.save();

    // Send reply email
    try {
      await sendEmail({
        to: contact.email,
        subject: `Re: ${contact.subject} - UnitedPackers`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #3B0A45, #5E4F82); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">UnitedPackers</h1>
            </div>
            <div style="padding: 30px;">
              <p>Dear ${contact.name},</p>
              <p>Thank you for reaching out to us. Here is our response:</p>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p><strong>Your message:</strong></p>
                <p>${contact.message}</p>
              </div>
              <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p><strong>Our response:</strong></p>
                <p>${reply}</p>
              </div>
              <p>If you have any further questions, feel free to reply to this email.</p>
              <p>Best regards,<br>UnitedPackers Team</p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.log("Reply email could not be sent:", emailError.message);
    }

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send reply",
      error: error.message,
    });
  }
};

// @desc    Update contact status (Admin)
// @route   PUT /api/contacts/:id
// @access  Private/Admin
exports.updateContact = async (req, res) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update contact",
      error: error.message,
    });
  }
};

// @desc    Delete contact (Admin)
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete contact",
      error: error.message,
    });
  }
};

// @desc    Get contact statistics (Admin)
// @route   GET /api/contacts/stats
// @access  Private/Admin
exports.getContactStats = async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const unread = await Contact.countDocuments({ status: "unread" });
    const today = await Contact.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
    });

    const statusStats = await Contact.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        unread,
        today,
        byStatus: statusStats,
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
