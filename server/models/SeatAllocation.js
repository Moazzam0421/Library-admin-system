const mongoose = require("mongoose");

const seatAllocationSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: Number,
      required: true,
      index: true,
    },

    shiftCode: {
      type: String,
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    startTime: {
      type: Number, // numeric hour (can exceed 24)
      required: true,
    },

    endTime: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ❗ IMPORTANT: remove unique constraint
// Overlap is handled logically, not by MongoDB
seatAllocationSchema.index({ seatNumber: 1, isActive: 1 });

module.exports = mongoose.model("SeatAllocation", seatAllocationSchema);
