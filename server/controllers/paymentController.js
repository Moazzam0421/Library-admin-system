const mongoose = require("mongoose");
const Student = require("../models/Student");
const Payment = require("../models/payment");
const SeatAllocation = require("../models/SeatAllocation");

/**
 * COLLECT PAYMENT
 */
exports.collectPayment = async (req, res) => {
  try {
    const { studentId, amount, method } = req.body;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    // ✅ Get student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    await Payment.create({
      student: student._id,
      amount,
      method,
      status: "SUCCESS",
      month: currentMonth, // ✅ FIX
    });

    // ✅ Update student
    student.paymentStatus = "PAID";
    await student.save();

    res.json({ success: true });
  } catch (err) {
    console.error("COLLECT PAYMENT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET PENDING PAYMENTS
 */
exports.getPendingPayments = async (req, res) => {
  try {
    // 1️⃣ Unpaid students
    const students = await Student.find({
      isActive: true,
      paymentStatus: "UNPAID",
    }).lean();

    const studentIds = students.map(s => s._id);

    // 2️⃣ Active seat allocations
    const allocations = await SeatAllocation.find({
      student: { $in: studentIds },
      isActive: true,
    }).lean();

    // 3️⃣ Map allocations
    const allocationMap = {};
    allocations.forEach(a => {
      allocationMap[a.student.toString()] = {
        seatNumber: a.seatNumber,
        shiftCode: a.shiftCode,
      };
    });

    // 4️⃣ Merge data
    const result = students.map(s => ({
      ...s,
      seatAllocation: allocationMap[s._id.toString()] || null,
    }));

    res.json(result);
  } catch (err) {
    console.error("PENDING PAYMENTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPaymentSummary = async (req, res) => {
  try {
    const month = new Date().toISOString().slice(0, 7);

    const paidThisMonth = await Payment.aggregate([
      { $match: { month } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const unpaidStudents = await Student.countDocuments({
      isActive: true,
      paymentStatus: "UNPAID",
    });

    const pendingAmountAgg = await Student.aggregate([
      { $match: { isActive: true, paymentStatus: "UNPAID" } },
      { $group: { _id: null, total: { $sum: "$monthlyFee" } } },
    ]);

    const lastPayment = await Payment.findOne().sort({ createdAt: -1 }).populate("student");

    res.json({
      pendingAmount: pendingAmountAgg[0]?.total || 0,
      paidThisMonth: paidThisMonth[0]?.total || 0,
      unpaidStudents,
      lastPayment: lastPayment
        ? lastPayment.createdAt
        : null,
    });
  } catch (err) {
    console.error("PAYMENT SUMMARY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getRecentPayments = async (req, res) => {
  const payments = await Payment.find()
    .populate("student", "name")
    .sort({ createdAt: -1 })
    .limit(5);

  res.json(
    payments.map(p => ({
      name: p.student.name,
      amount: p.amount,
    }))
  );
};

