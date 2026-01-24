const SeatAllocation = require("../models/SeatAllocation");
const Student = require("../models/Student");

const AuditLog = require("../models/audit-log");
const { SHIFTS } = require("../constants/shifts");


const isTimeOverlap = (startA, endA, startB, endB) => {
  return startA < endB && startB < endA;
};

// const getFeeByShift = (shiftCode) => {
//   if (shiftCode.startsWith("4H")) return 300;
//   if (shiftCode.startsWith("8H")) return 500;
//   return null;
// };

// Get seats by shift (WITH FULL student info)
exports.getByShift = async (req, res) => {
  try {
    const { shiftCode } = req.query;

    const shift = SHIFTS.find(s => s.code === shiftCode);
    if (!shift) {
      return res.status(400).json({ message: "Invalid shift" });
    }

    const allocations = await SeatAllocation
      .find({ isActive: true })
      .populate("student");

    const blocked = allocations.filter(a =>
      isTimeOverlap(
        shift.start,
        shift.end,
        a.startTime,
        a.endTime
      )
    );

    res.json(blocked);
  } catch (err) {
    console.error("GET SEATS ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};




// Get students without seat
exports.getUnassignedStudents = async (req, res) => {
  try {
    const assigned = await SeatAllocation.find({ isActive: true }).distinct(
      "student"
    );

    const students = await Student.find({
      isActive: true,
      _id: { $nin: assigned },
    }).select("_id name");

    res.json(students);
  } catch (error) {
    console.error("GET UNASSIGNED STUDENTS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.assignSeat = async (req, res) => {
  try {
    const { seatNumber, shiftCode, studentId } = req.body;

    if (!seatNumber || !shiftCode || !studentId) {
      return res.status(400).json({ message: "All fields required" });
    }

    const shift = SHIFTS.find(s => s.code === shiftCode);
    if (!shift) {
      return res.status(400).json({ message: "Invalid shift" });
    }

    // check overlap
    const existing = await SeatAllocation.find({
      seatNumber,
      isActive: true,
    });

    for (const alloc of existing) {
      if (
        isTimeOverlap(
          shift.start,
          shift.end,
          alloc.startTime,
          alloc.endTime
        )
      ) {
        return res.status(409).json({
          message: `Seat ${seatNumber} is already occupied during this time`,
        });
      }
    }

    // lock fee
    await Student.findByIdAndUpdate(studentId, {
      monthlyFee: shift.fee,
    });

    const allocation = await SeatAllocation.create({
      seatNumber,
      shiftCode,
      student: studentId,
      startTime: shift.start,
      endTime: shift.end,
      isActive: true,
    });

    await AuditLog.create({
      action: "ASSIGN_SEAT",
      entity: "SeatAllocation",
      entityId: allocation._id,
      message: `Seat ${seatNumber} assigned (${shiftCode})`,
    });

    res.status(201).json(await allocation.populate("student"));
  } catch (err) {
    console.error("ASSIGN SEAT ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

//NEW: Vacate seat (SAFE)
exports.vacateSeat = async (req, res) => {
  try {
    const { allocationId } = req.params;

    const allocation = await SeatAllocation.findById(allocationId);
    if (!allocation) {
      return res.status(404).json({ message: "Seat allocation not found" });
    }

    await SeatAllocation.findByIdAndUpdate(allocationId, {
      isActive: false,
    });

    res.json({ message: "Seat vacated successfully" });
  } catch (error) {
    console.error("VACATE SEAT ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

