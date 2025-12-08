const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: `UnitedPackers <${process.env.EMAIL_FROM}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);

  console.log(`📧 Email sent: ${info.messageId}`);
  return info;
};

// Email templates
const emailTemplates = {
  // Quote confirmation email
  quoteConfirmation: (data) => ({
    subject: `Quote Request Received - #${data.quoteId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3B0A45, #5E4F82); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">UnitedPackers</h1>
          <p style="color: #F1BCCF; margin: 5px 0;">Pro Movers</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #3B0A45;">Thank you for your quote request!</h2>
          <p>Dear ${data.name},</p>
          <p>We have received your quote request and our team will contact you within 24 hours.</p>
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #5E4F82; margin-top: 0;">Quote Details</h3>
            <p><strong>Quote ID:</strong> ${data.quoteId}</p>
            <p><strong>From:</strong> ${data.fromCity}</p>
            <p><strong>To:</strong> ${data.toCity}</p>
            <p><strong>Move Date:</strong> ${data.moveDate}</p>
            <p><strong>Estimated Price:</strong> ₹${data.estimatedPrice}</p>
          </div>
          <p>If you have any questions, feel free to call us at <strong>+91 98765 43210</strong></p>
        </div>
        <div style="background: #3B0A45; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0;">© 2024 UnitedPackers. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // Quote ready email (when admin provides estimate)
  quoteReady: (data) => ({
    subject: `Your Quote is Ready - #${data.quoteId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3B0A45, #5E4F82); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">UnitedPackers</h1>
          <p style="color: #F1BCCF; margin: 5px 0;">Pro Movers</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #3B0A45;">Great News! Your Quote is Ready</h2>
          <p>Dear ${data.name},</p>
          <p>We have reviewed your moving request and prepared a quote for you.</p>
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #3B0A45;">
            <h3 style="color: #5E4F82; margin-top: 0;">Quote Details</h3>
            <p><strong>Quote ID:</strong> ${data.quoteId}</p>
            <p><strong>From:</strong> ${data.fromCity}</p>
            <p><strong>To:</strong> ${data.toCity}</p>
            <p style="font-size: 24px; color: #3B0A45;"><strong>Estimated Cost: ₹${data.estimatedCost.toLocaleString(
              "en-IN"
            )}</strong></p>
          </div>
          <p>This quote is valid for 7 days. To proceed with the booking or discuss the quote, please contact us:</p>
          <p>📞 Phone: +91 98765 43210</p>
          <p>📧 Email: info@unitedpackers.in</p>
          <a href="${process.env.CLIENT_URL}/quote/track/${
      data.quoteId
    }" style="display: inline-block; background: #3B0A45; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Track Your Quote</a>
        </div>
      </div>
    `,
  }),

  // Enquiry confirmation email
  enquiryConfirmation: (data) => ({
    subject: "Enquiry Received - UnitedPackers",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3B0A45, #5E4F82); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">UnitedPackers</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #3B0A45;">Thank you for your enquiry!</h2>
          <p>Dear ${data.name},</p>
          <p>We have received your enquiry and will get back to you shortly.</p>
          <p>Your message: "${data.message}"</p>
        </div>
      </div>
    `,
  }),

  // Welcome email for new users
  welcome: (data) => ({
    subject: "Welcome to UnitedPackers!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3B0A45, #5E4F82); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to UnitedPackers!</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #3B0A45;">Hello ${data.name}!</h2>
          <p>Thank you for creating an account with UnitedPackers.</p>
          <p>You can now:</p>
          <ul>
            <li>Request quotes for your move</li>
            <li>Track your bookings</li>
            <li>Manage your profile</li>
          </ul>
          <a href="${process.env.CLIENT_URL}/quote" style="display: inline-block; background: #3B0A45; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Get a Free Quote</a>
        </div>
      </div>
    `,
  }),
};

module.exports = { sendEmail, emailTemplates };
