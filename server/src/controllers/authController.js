const asyncHandler = require("../utils/asyncHandler");
const { ApiError, success } = require("../utils/apiResponse");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc Register new user
// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) throw new ApiError(400, "Name, email and password are required");

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id, user.role);

  return success(res, 201, "Account created successfully", {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// @desc Login user
// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Email and password are required");

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  if (!user.isActive) throw new ApiError(403, "This account has been deactivated");

  const token = generateToken(user._id, user.role);

  return success(res, 200, "Logged in successfully", {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// @desc Get current logged-in user
// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  return success(res, 200, "Current user fetched", { user: req.user });
});

// @desc Update profile
// @route PUT /api/auth/me
const updateMe = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  await user.save();
  return success(res, 200, "Profile updated", { user });
});

module.exports = { register, login, getMe, updateMe };
