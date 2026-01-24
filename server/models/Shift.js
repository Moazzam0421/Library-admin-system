const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    label: {
      type: String,
      required: true,
    },

    // Use numeric hours (0–24) for overlap logic
    startTime: {
      type: Number,
      required: true,
      min: 0,
      max: 23,
    },

    endTime: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },

    durationHours: {
      type: Number,
      required: true,
      enum: [4, 8, 12],
    },

    fee: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("Shift", shiftSchema);
