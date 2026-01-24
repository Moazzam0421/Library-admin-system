const Student = require("../models/Student");
const SeatAllocation = require("../models/SeatAllocation");

const AuditLog = require("../models/audit-log");


const getFeeByShift = (shiftCode) => {
  if (shiftCode.startsWith("4H")) return 300;
  if (shiftCode.startsWith("8H")) return 500;
  if (shiftCode.startsWith("12H")) return 700;
  return null;
};



// Add new Student
exports.addStudent = async (req, res) => {
  try {

    const { name, phone, joiningDate, shiftCode, aadhaarNumber } = req.body;

    if (!name || !phone || !joiningDate || !shiftCode || !aadhaarNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // 🆔 Aadhaar validation
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      return res.status(400).json({
        message: "Aadhaar number must be exactly 12 digits",
      });
    }

    // ❌ Prevent duplicate Aadhaar
    const existingAadhaar = await Student.findOne({ aadhaarNumber });
    if (existingAadhaar) {
      return res.status(409).json({
        message: "A student with this Aadhaar number already exists",
      });
    }

    const monthlyFee = getFeeByShift(shiftCode);
    if (!monthlyFee) {
      return res.status(400).json({ message: "Invalid shift for fee" });
    }

    const student = await Student.create({
      studentId: `LIB-${Date.now()}`,
      name,
      phone,
      aadhaarNumber,
      monthlyFee,
      joiningDate,
      paymentStatus: "UNPAID",
      isActive: true,
    });

    await AuditLog.create({
      action: "ADD_STUDENT",
      entity: "Student",
      entityId: student._id,
      message: `Student ${student.name} added`,
    });


    res.status(201).json({
      message: "Student added successfully",
      student,
    });
  } catch (err) {
    console.error("ADD STUDENT ERROR:", err);
    // 🧯 Handle duplicate key error from MongoDB
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Duplicate Aadhaar number detected",
      });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    if (!students.length) {
      return res.json([]);
    }

    const studentIds = students.map(s => s._id);

    const allocations = await SeatAllocation.find({
      student: { $in: studentIds },
      isActive: true,
    })
      .sort({ createdAt: -1 }) 
      .lean();

    const allocationMap = {};

    for (const alloc of allocations) {
      const sid = alloc.student.toString();

      if (!allocationMap[sid]) {
        allocationMap[sid] = {
          seatNumber: alloc.seatNumber,
          shiftCode: alloc.shiftCode,
        };
      }
    }

    const result = students.map((s) => {
      const { aadhaarNumber, ...safeStudent } = s;

      return {
        ...safeStudent,

        aadhaarMasked: aadhaarNumber
          ? `${aadhaarNumber}`
          : null,

        seatAllocation: allocationMap[s._id.toString()] || null,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.updatePaymentStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { paymentStatus } = req.body;

    if (!["PAID", "UNPAID"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid Payment Status" });
    }

    const student = await Student.findByIdAndUpdate(
      studentId,
      { paymentStatus },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student Not Found" });
    }

    res.json({
      message: "Payment Status Updated",
      student,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deactivateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findByIdAndUpdate(
      studentId,
      { isActive: false },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student Not Found" });
    }

    await SeatAllocation.deleteOne({ student: studentId });

    res.json({ message: "Student Deactivated Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
