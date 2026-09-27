const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { uploadProductImages } = require("../controllers/uploadController");
const { protect, admin } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", getProducts);
router.post("/upload", protect, admin, upload.array("images", 5), uploadProductImages);
router.get("/:idOrSlug", getProduct);
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;