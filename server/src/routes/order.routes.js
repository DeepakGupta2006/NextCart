const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/auth");

router.use(protect);
router.post("/", createOrder);
router.get("/mine", getMyOrders);
router.get("/", admin, getAllOrders);
router.get("/:id", getOrder);
router.put("/:id/status", admin, updateOrderStatus);

module.exports = router;
