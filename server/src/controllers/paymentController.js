const crypto = require("crypto");
const asyncHandler = require("../utils/asyncHandler");
const { ApiError, success } = require("../utils/apiResponse");
const razorpay = require("../config/razorpay");
const Cart = require("../models/Cart");
const { calculateTotals } = require("../utils/pricing");

// @desc Create a Razorpay order sized to the user's current cart total
// @route POST /api/payment/razorpay/order
const createRazorpayOrder = asyncHandler(async (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(500, "Razorpay keys are not configured on the server");
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) throw new ApiError(400, "Your cart is empty");

  const { totalPrice } = calculateTotals(cart.items);

  // Razorpay wants the amount in the smallest currency unit (paise for INR)
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(totalPrice * 100),
    currency: "INR",
    receipt: `nextcart_rcpt_${Date.now()}`,
    notes: { userId: req.user._id.toString() },
  });

  return success(res, 201, "Razorpay order created", {
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

// @desc Verify a Razorpay payment signature (used internally by createOrder too)
const verifyRazorpaySignature = (paymentResult) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentResult || {};

  // TEMPORARY DEBUG LOGGING — remove once the mismatch is fixed
  console.log("---- Razorpay signature debug ----");
  console.log("raw paymentResult received:", JSON.stringify(paymentResult));
  console.log("order_id:", razorpay_order_id, "| payment_id:", razorpay_payment_id, "| signature:", razorpay_signature);

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    console.log("MISSING FIELD(S) — returning false before computing any signature");
    console.log("-----------------------------------");
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const secret = process.env.RAZORPAY_KEY_SECRET || "";
  console.log("secret loaded (masked):", secret.slice(0, 4) + "..." + secret.slice(-4), "| length:", secret.length);
  console.log("signature we computed:", expectedSignature);
  console.log("signature Razorpay sent:", razorpay_signature);
  console.log("-----------------------------------");

  return expectedSignature === razorpay_signature;
};

module.exports = { createRazorpayOrder, verifyRazorpaySignature };