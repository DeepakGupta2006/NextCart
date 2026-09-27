const express = require("express");
const router = express.Router();
const { getAddresses, addAddress, updateAddress, deleteAddress } = require("../controllers/addressController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/", getAddresses);
router.post("/", addAddress);
router.put("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);

module.exports = router;
