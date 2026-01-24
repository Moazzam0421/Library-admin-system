const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/studentController");

// create student
router.post("/", ctrl.addStudent);

// get all active students (with seatAllocation attached)
router.get("/", ctrl.getAllStudents);

// update payment status
router.patch("/:studentId/payment", ctrl.updatePaymentStatus);

// deactivate student (soft delete + free seat)
router.patch("/:studentId/deactivate", ctrl.deactivateStudent);

module.exports = router;
