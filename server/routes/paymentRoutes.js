const express = require("express");
const router = require("express").Router();
const { collectPayment, getPendingPayments, getPaymentSummary, getRecentPayments } = require("../controllers/paymentController");

router.post("/collect", collectPayment);
router.get("/pending", getPendingPayments);

router.get("/summary", getPaymentSummary);
router.get("/recent", getRecentPayments);




module.exports = router;

