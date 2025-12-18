const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    // Validate required environment variables
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email configuration is missing. Please check environment variables.");
    }

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

    // Verify transporter connection
    await transporter.verify();

    // Email options
    const mailOptions = {
      from: `UnitedPackers <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent successfully to ${options.to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Email sending failed:`, error.message);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  // Quote confirmation email
  quoteConfirmation: (data) => ({
    subject: `Quote Request Received - #${data.quoteId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #F59E0B, #D97706); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">UnitedPackers</h1>
          <p style="color: #FFFFFF; margin: 5px 0;">Pro Movers</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #92400E;">Thank you for your quote request!</h2>
          <p>Dear ${data.name},</p>
          <p>We have received your quote request and our team will contact you within 24 hours.</p>
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #D97706; margin-top: 0;">Quote Details</h3>
            <p><strong>Quote ID:</strong> ${data.quoteId}</p>
            <p><strong>From:</strong> ${data.fromCity}</p>
            <p><strong>To:</strong> ${data.toCity}</p>
            <p><strong>Move Date:</strong> ${data.moveDate}</p>
          </div>
          <p>If you have any questions, feel free to call us at <strong>+91 98765 43210</strong></p>
        </div>
        <div style="background: #92400E; padding: 20px; text-align: center;">
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
        <div style="background: linear-gradient(135deg, #F59E0B, #D97706); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">UnitedPackers</h1>
          <p style="color: #FFFFFF; margin: 5px 0;">Pro Movers</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #92400E;">Great News! Your Quote is Ready</h2>
          <p>Dear ${data.name},</p>
          <p>We have reviewed your moving request and prepared a quote for you.</p>
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #D97706;">
            <h3 style="color: #D97706; margin-top: 0;">Quote Details</h3>
            <p><strong>Quote ID:</strong> ${data.quoteId}</p>
            <p><strong>From:</strong> ${data.fromCity}</p>
            <p><strong>To:</strong> ${data.toCity}</p>
            <p style="font-size: 24px; color: #92400E;"><strong>Estimated Cost: ₹${data.estimatedCost.toLocaleString(
      "en-IN"
    )}</strong></p>
          </div>
          <p>This quote is valid for 7 days. To proceed with the booking or discuss the quote, please contact us:</p>
          <p>📞 Phone: +91 98765 43210</p>
          <p>📧 Email: info@unitedpackers.in</p>
          <a href="${process.env.CLIENT_URL}/quote/track/${data.quoteId
      }" style="display: inline-block; background: #D97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Track Your Quote</a>
        </div>
        <div style="background: #92400E; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0;">© 2024 UnitedPackers. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // Enquiry confirmation email
  enquiryConfirmation: (data) => ({
    subject: "Enquiry Received - UnitedPackers",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #F59E0B, #D97706); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">UnitedPackers</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #92400E;">Thank you for your enquiry!</h2>
          <p>Dear ${data.name},</p>
          <p>We have received your enquiry and will get back to you shortly.</p>
          <p>Your message: "${data.message}"</p>
        </div>
        <div style="background: #92400E; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0;">© 2024 UnitedPackers. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // Welcome email for new users
  welcome: (data) => ({
    subject: "Welcome to UnitedPackers!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #F59E0B, #D97706); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to UnitedPackers!</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #92400E;">Hello ${data.name}!</h2>
          <p>Thank you for creating an account with UnitedPackers.</p>
          <p>You can now:</p>
          <ul>
            <li>Request quotes for your move</li>
            <li>Track your bookings</li>
            <li>Manage your profile</li>
          </ul>
          <a href="${process.env.CLIENT_URL}/quote" style="display: inline-block; background: #D97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Get a Free Quote</a>
        </div>
        <div style="background: #92400E; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0;">© 2024 UnitedPackers. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // Quote deletion confirmation email
  quoteDeletion: (data) => ({
    subject: `Quote Deletion Confirmed - #${data.quoteId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #F59E0B, #D97706); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">UnitedPackers</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #92400E;">Quote Deletion Confirmed</h2>
          <p>Dear ${data.name},</p>
          <p>Your quote has been successfully deleted from your account.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-left: 4px solid #D97706; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #92400E;">Quote Details</h3>
            <p><strong>Quote ID:</strong> #${data.quoteId}</p>
            <p><strong>From:</strong> ${data.fromCity}</p>
            <p><strong>To:</strong> ${data.toCity}</p>
            <p><strong>Deleted on:</strong> ${data.deletedDate}</p>
          </div>

          <p>If you need to request a new quote, please visit:</p>
          <a href="${process.env.CLIENT_URL}/quote" style="display: inline-block; background: #D97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Request a New Quote</a>

          <p style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 14px; color: #666;">
            If you have any questions, please contact us at <strong>support@unitedpackers.in</strong>
          </p>
        </div>
      </div>
    `,
  }),

  // Payment request email (when quote is accepted)
  paymentRequest: (data) => ({
    subject: `Payment Required - Quote Accepted #${data.quoteId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #F59E0B, #D97706); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">UnitedPackers</h1>
          <p style="color: #FFFFFF; margin: 5px 0;">Pro Movers</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #92400E;">✓ Your Quote Has Been Accepted!</h2>
          <p>Dear ${data.name},</p>
          <p>Congratulations! Your moving quote has been reviewed and accepted. We're ready to proceed with your move.</p>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #10B981;">
            <h3 style="color: #10B981; margin-top: 0;">Quote Details</h3>
            <p><strong>Quote ID:</strong> ${data.quoteId}</p>
            <p><strong>From:</strong> ${data.fromCity}</p>
            <p><strong>To:</strong> ${data.toCity}</p>
            <p><strong>Move Date:</strong> ${data.moveDate}</p>
            <p style="font-size: 24px; color: #92400E; margin: 15px 0;"><strong>Final Cost: ₹${data.finalCost.toLocaleString("en-IN")}</strong></p>
          </div>

          <h3 style="color: #92400E;">Payment Instructions</h3>
          <p>To confirm your booking and complete the payment, please make a payment using any of the following methods:</p>
          
          <div style="background: #F0F0F0; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h4 style="margin-top: 0; color: #92400E;">💳 Payment Methods Available:</h4>
            <ul style="padding-left: 20px;">
              <li>Credit Card</li>
              <li>Debit Card</li>
              <li>UPI (Google Pay, PhonePe, Paytm, WhatsApp Pay)</li>
              <li>Net Banking</li>
              <li>Cash on Delivery (COD)</li>
            </ul>
          </div>

          <p style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/quote/track/${data.quoteId}" style="display: inline-block; background: #D97706; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
              Proceed to Payment
            </a>
          </p>

          <div style="background: #FEF3C7; padding: 15px; border-radius: 8px; border-left: 4px solid #D97706;">
            <p style="margin: 0; color: #92400E;"><strong>📌 Note:</strong> Please complete the payment within 7 days to secure your booking date.</p>
          </div>

          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            <strong>Need Help?</strong> Contact us at:<br>
            📞 Phone: +91 98765 43210<br>
            📧 Email: support@unitedpackers.in
          </p>
        </div>
        <div style="background: #92400E; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0;">© 2024 UnitedPackers. All rights reserved.</p>
        </div>
      </div>
    `,
  }),
};

module.exports = { sendEmail, emailTemplates };
