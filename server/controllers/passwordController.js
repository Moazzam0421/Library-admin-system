const crypto = require("crypto");
const Admin = require("../models/Admin");
const sendEmail = require("../utils/sendEmail");

/**
 * @route   POST /api/password/forgot
 * @desc    Send password reset email
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving
    admin.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    admin.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    await admin.save();

    // Reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // Email content
    const message = `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your admin password.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>This link will expire in 15 minutes.</p>
      <br/>
      <p>If you didn’t request this, please ignore this email.</p>
    `;

    await sendEmail({
      to: admin.email,
      subject: "Alpha Library - Password Reset",
      html: message,
    });

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route   POST /api/password/reset
 * @desc    Reset password using token
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Set new password
    admin.password = password;

    // Clear reset fields
    admin.resetPasswordToken = null;
    admin.resetPasswordExpires = null;

    await admin.save(); // password will auto-hash (pre-save hook)

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};