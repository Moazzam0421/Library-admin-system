const express = require("express");
const router = express.Router();
const seatController = require("../controllers/seatController");

router.get("/", seatController.getByShift);
router.get("/unassigned", seatController.getUnassignedStudents);
router.post("/assign", seatController.assignSeat);
router.delete("/vacate/:allocationId", seatController.vacateSeat);

module.exports = router;
