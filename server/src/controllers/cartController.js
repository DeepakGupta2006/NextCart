const asyncHandler = require("../utils/asyncHandler");
const { ApiError, success } = require("../utils/apiResponse");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

// @desc Get logged-in user's cart
// @route GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  return success(res, 200, "Cart fetched", { cart });
});

// @desc Add item to cart
// @route POST /api/cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, size = "", color = "" } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");
  if (product.stock < quantity) throw new ApiError(400, "Not enough stock available");

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId && item.size === size && item.color === color
  );

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || "",
      price: product.discountPrice || product.price,
      size,
      color,
      quantity,
    });
  }

  await cart.save();
  return success(res, 200, "Item added to cart", { cart });
});

// @desc Update cart item quantity
// @route PUT /api/cart/:itemId
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);
  if (!item) throw new ApiError(404, "Cart item not found");
  if (quantity <= 0) {
    item.deleteOne();
  } else {
    item.quantity = quantity;
  }
  await cart.save();
  return success(res, 200, "Cart updated", { cart });
});

// @desc Remove cart item
// @route DELETE /api/cart/:itemId
const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);
  if (!item) throw new ApiError(404, "Cart item not found");
  item.deleteOne();
  await cart.save();
  return success(res, 200, "Item removed from cart", { cart });
});

// @desc Clear cart
// @route DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  return success(res, 200, "Cart cleared", { cart });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
