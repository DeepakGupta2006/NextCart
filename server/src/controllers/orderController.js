const asyncHandler = require("../utils/asyncHandler");
const { ApiError, success } = require("../utils/apiResponse");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { calculateTotals } = require("../utils/pricing");
const { verifyRazorpaySignature } = require("./paymentController");

// @desc Create order from current cart (checkout)
// @route POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = "cod", paymentResult } = req.body;
  if (!shippingAddress) throw new ApiError(400, "Shipping address is required");

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) throw new ApiError(400, "Your cart is empty");

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product || product.stock < item.quantity) {
      throw new ApiError(400, `${item.name} does not have enough stock`);
    }
  }

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateTotals(cart.items);

  let isPaid = false;
  let paidAt;
  let paymentResultToSave;

  if (paymentMethod === "razorpay") {
    // Never trust the client — recompute the signature server-side using the
    // Razorpay key secret before marking anything as paid.
    const isValidSignature = verifyRazorpaySignature(paymentResult || {});
    if (!isValidSignature) {
      throw new ApiError(400, "Payment verification failed — the signature did not match");
    }
    isPaid = true;
    paidAt = new Date();
    paymentResultToSave = {
      id: paymentResult.razorpay_payment_id,
      status: "paid",
      orderId: paymentResult.razorpay_order_id,
      signature: paymentResult.razorpay_signature,
    };
  }

  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map((i) => ({
      product: i.product,
      name: i.name,
      image: i.image,
      price: i.price,
      size: i.size,
      color: i.color,
      quantity: i.quantity,
    })),
    shippingAddress,
    paymentMethod,
    paymentResult: paymentResultToSave,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid,
    paidAt,
  });

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  cart.items = [];
  await cart.save();

  return success(res, 201, "Order placed successfully", { order });
});

// @desc Get logged-in user's orders
// @route GET /api/orders/mine
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  return success(res, 200, "Orders fetched", { orders });
});

// @desc Get single order (owner or admin)
// @route GET /api/orders/:id
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) throw new ApiError(404, "Order not found");
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You are not allowed to view this order");
  }
  return success(res, 200, "Order fetched", { order });
});

// @desc Get all orders (admin)
// @route GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  return success(res, 200, "All orders fetched", { orders });
});

// @desc Update order status (admin)
// @route PUT /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");
  order.status = status;
  if (status === "delivered") order.deliveredAt = new Date();
  await order.save();
  return success(res, 200, "Order status updated", { order });
});

module.exports = { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus };