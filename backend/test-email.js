/**
 * Email Configuration Test Script
 * Run this to verify your email credentials are working
 * 
 * Usage: node test-email.js
 */

require("dotenv").config();
const nodemailer = require("nodemailer");

const testEmailConfiguration = async () => {
  console.log("\n📧 Testing Email Configuration...\n");

  // Check environment variables
  console.log("1️⃣ Checking Environment Variables:");
  const emailConfig = {
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_FROM: process.env.EMAIL_FROM,
  };

  for (const [key, value] of Object.entries(emailConfig)) {
    const status = value ? "✅" : "❌";
    const displayValue = value ? (key.includes("USER") ? value.slice(0, 5) + "***" : value) : "NOT SET";
    console.log(`   ${status} ${key}: ${displayValue}`);
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("\n❌ Email credentials not found!");
    console.log("\n📝 Setup Instructions:");
    console.log("1. Go to https://myaccount.google.com/apppasswords");
    console.log("2. Select Mail and Windows Computer");
    console.log("3. Copy the generated 16-character password");
    console.log("4. Update .env file with:");
    console.log("   EMAIL_USER=your_gmail@gmail.com");
    console.log("   EMAIL_PASS=your_16_char_password\n");
    return;
  }

  // Create transporter
  console.log("\n2️⃣ Creating Email Transporter...");
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify connection
  console.log("3️⃣ Verifying Connection...");
  try {
    await transporter.verify();
    console.log("   ✅ SMTP connection verified successfully!");
  } catch (error) {
    console.log("   ❌ SMTP connection failed!");
    console.log(`   Error: ${error.message}\n`);
    console.log("   Troubleshooting:");
    console.log("   - Check your Gmail credentials");
    console.log("   - Verify 2-Factor Authentication is enabled");
    console.log("   - Use App Password instead of regular password");
    console.log("   - Check firewall/network settings\n");
    return;
  }

  // Send test email
  console.log("4️⃣ Sending Test Email...");
  try {
    const info = await transporter.sendMail({
      from: `UnitedPackers <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to same email
      subject: "Email Configuration Test - UnitedPackers",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3B0A45, #5E4F82); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">UnitedPackers</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #3B0A45;">✅ Email Configuration is Working!</h2>
            <p>Your email configuration is set up correctly and emails can be sent.</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p style="color: #666; font-size: 12px;">This is a test email. You can now use the password reset feature.</p>
          </div>
        </div>
      `,
    });
    console.log(`   ✅ Test email sent successfully!`);
    console.log(`   Message ID: ${info.messageId}\n`);
  } catch (error) {
    console.log(`   ❌ Failed to send test email!`);
    console.log(`   Error: ${error.message}\n`);
  }
};

testEmailConfiguration();
