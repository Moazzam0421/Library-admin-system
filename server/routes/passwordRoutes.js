const express = require("express");
const router = express.Router();

const {
  forgotPassword,
  resetPassword,
} = require("../controllers/passwordController");

// Send reset email
router.post("/forgot", forgotPassword);

// Reset password using token
router.post("/reset", resetPassword);

module.exports = router;