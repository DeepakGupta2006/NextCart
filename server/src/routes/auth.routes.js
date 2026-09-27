const express = require("express");
const router = express.Router();
const { register, login, getMe, updateMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

module.exports = router;
