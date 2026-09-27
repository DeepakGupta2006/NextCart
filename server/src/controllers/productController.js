const asyncHandler = require("../utils/asyncHandler");
const { ApiError, success } = require("../utils/apiResponse");
const Product = require("../models/Product");

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") + "-" + Math.random().toString(36).slice(2, 7);

// @desc Get products with filters, search, pagination
// @route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { category, search, minPrice, maxPrice, sort, page = 1, limit = 12, featured } = req.query;

  const query = { isActive: true };
  if (category) query.category = category;
  if (featured === "true") query.isFeatured = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) query.$text = { $search: search };

  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };
  if (sort === "rating") sortOption = { ratingsAverage: -1 };

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(48, Number(limit));

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(query),
  ]);

  return success(res, 200, "Products fetched", {
    products,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
  });
});

// @desc Get single product by slug or id
// @route GET /api/products/:idOrSlug
const getProduct = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const product = await Product.findOne({
    $or: [{ _id: idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? idOrSlug : null }, { slug: idOrSlug }],
  });
  if (!product) throw new ApiError(404, "Product not found");
  return success(res, 200, "Product fetched", { product });
});

// @desc Create product (admin)
// @route POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const body = req.body;
  if (!body.name || !body.price || !body.category) {
    throw new ApiError(400, "Name, price and category are required");
  }
  const slug = slugify(body.name);
  const product = await Product.create({ ...body, slug });
  return success(res, 201, "Product created", { product });
});

// @desc Update product (admin)
// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  Object.assign(product, req.body);
  await product.save();
  return success(res, 200, "Product updated", { product });
});

// @desc Delete product (admin)
// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  await product.deleteOne();
  return success(res, 200, "Product deleted", { id: req.params.id });
});

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
