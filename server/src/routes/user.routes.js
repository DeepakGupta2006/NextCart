const express = require("express");
const router = express.Router();
const { getUsers, toggleUserStatus } = require("../controllers/userController");
const { protect, admin } = require("../middleware/auth");

router.use(protect, admin);
router.get("/", getUsers);
router.put("/:id/status", toggleUserStatus);

module.exports = router;
