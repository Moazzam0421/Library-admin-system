const Student = require("../models/Student");
const SeatAllocation = require("../models/SeatAllocation");
const AuditLog = require("../models/audit-log");

exports.getDashboardData = async (req, res) => {
  try {
    const activeStudents = await Student.countDocuments({ isActive: true });
    const unpaidStudents = await Student.countDocuments({
      isActive: true,
      paymentStatus: "UNPAID",
    });

    const allocations = await SeatAllocation.find({ isActive: true }).populate("student");

    const seatsOccupied = allocations.length;

    let paidRevenue = 0;
    let pendingRevenue = 0;

    allocations.forEach(a => {
      if (!a.student) return;
      if (a.student.paymentStatus === "PAID") {
        paidRevenue += a.student.monthlyFee;
      } else {
        pendingRevenue += a.student.monthlyFee;
      }
    });

    const recentActivities = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      stats: {
        activeStudents,
        seatsOccupied,
        unpaidStudents,
        paidRevenue,
        pendingRevenue,
      },
      recentActivities,
      allocations,
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
