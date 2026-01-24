const mongoose = require("mongoose");
require("dotenv").config();

const Shift = require("../models/Shift");

const shifts = [
  { code: "4H_1", label: "Morning (6–10)", startTime: "06:00", endTime: "10:00", durationHours: 4 },
  { code: "4H_2", label: "Late Morning (10–2)", startTime: "10:00", endTime: "14:00", durationHours: 4 },
  { code: "4H_3", label: "Afternoon (2–6", startTime: "14:00", endTime: "18:00", durationHours: 4 },
  { code: "4H_4", label: "Evening (6–10)", startTime: "18:00", endTime: "22:00", durationHours: 4 },

  { code: "8H_1", label: "Morning–Afternoon", startTime: "06:00", endTime: "14:00", durationHours: 8 },
  { code: "8H_2", label: "Day–Evening", startTime: "10:00", endTime: "18:00", durationHours: 8 },
  { code: "8H_3", label: "Afternoon–Night", startTime: "14:00", endTime: "22:00", durationHours: 8 },

  { code: "12H", label: "Full Day", startTime: "06:00", endTime: "18:00", durationHours: 12 }
];

const seedShifts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Shift.deleteMany();
    await Shift.insertMany(shifts);

    console.log("✅ Shifts seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Shift seeding failed:", error.message);
    process.exit(1);
  }
};

seedShifts();
