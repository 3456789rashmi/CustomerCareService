const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { sendEmail, emailTemplates } = require("../utils/sendEmail");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Check if phone already exists
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: "User with this phone number already exists",
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    // Send welcome email (optional - wrapped in try-catch to not block registration)
    try {
      const welcomeEmail = emailTemplates.welcome({ name: firstName });
      await sendEmail({
        to: email,
        subject: welcomeEmail.subject,
        html: welcomeEmail.html,
      });
    } catch (emailError) {
      console.log("Welcome email could not be sent:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check for user (include password for comparison)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch user",
      error: error.message,
    });
  }
};

// @desc    Logout user / clear token
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
    data: {},
  });
};

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, phone, address },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: error.message,
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/changepassword
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Password change failed",
      error: error.message,
    });
  }
};

// @desc    Forgot password - send reset email
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email",
      });
    }

    // Generate reset token (simple 6-digit code)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save reset token and expiry (15 minutes)
    user.resetPasswordToken = resetCode;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // Send reset email
    try {
      await sendEmail({
        to: email,
        subject: "Password Reset Code - UnitedPackers",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #3B0A45, #5E4F82); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">UnitedPackers</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #3B0A45;">Password Reset Request</h2>
              <p>Dear ${user.firstName},</p>
              <p>You requested to reset your password. Use the code below:</p>
              <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px;">
                <h1 style="color: #3B0A45; letter-spacing: 5px; margin: 0;">${resetCode}</h1>
              </div>
              <p>This code will expire in <strong>15 minutes</strong>.</p>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
          </div>
        `,
      });

      res.status(200).json({
        success: true,
        message: "Password reset code sent to your email",
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      console.error("Email sending error:", emailError);

      return res.status(500).json({
        success: false,
        message: "Email could not be sent. Please try again later or contact support.",
        error: process.env.NODE_ENV === "development" ? emailError.message : undefined,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process request",
      error: error.message,
    });
  }
};

// @desc    Reset password with code
// @route   POST /api/auth/resetpassword
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordToken: resetCode,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code",
      });
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Password reset failed",
      error: error.message,
    });
  }
};
