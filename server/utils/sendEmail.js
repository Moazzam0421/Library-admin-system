const nodemailer = require("nodemailer");

/**
 * Send email using Gmail SMTP
 * @param {Object} options
 * @param {string} options.to - receiver email
 * @param {string} options.subject - email subject
 * @param {string} options.html - email HTML content
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    // Send mail
    const info = await transporter.sendMail({
      from: `"Alpha Library" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;