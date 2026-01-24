const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Student = require("../models/Student");
const { getDashboardData } = require("../controllers/dashboardController");

router.get("/", getDashboardData);

router.get("/stats", auth, async (req, res) => {
  try {
    const activeStudents = await Student.countDocuments({ isActive: true });
    const unpaidStudents = await Student.countDocuments({
      isActive: true,
      paymentStatus: "UNPAID",
    });

    const seatsOccupied = await Student.countDocuments({ isActive: true });

    const revenueAgg = await Student.aggregate([
      { $match: { paymentStatus: "PAID", isActive: true } },
      { $group: { _id: null, total: { $sum: "$monthlyFee" } } },
    ]);

    res.json({
      activeStudents,
      unpaidStudents,
      seatsOccupied,
      monthlyRevenue: revenueAgg[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard stats failed" });
  }
});

module.exports = router;
