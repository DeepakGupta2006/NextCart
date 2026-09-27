const express = require("express");
const router = express.Router();
const { createRazorpayOrder } = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.post("/razorpay/order", createRazorpayOrder);

module.exports = router;