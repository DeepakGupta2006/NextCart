const asyncHandler = require("../utils/asyncHandler");
const { ApiError, success } = require("../utils/apiResponse");
const User = require("../models/User");

// @desc Get all users (admin)
// @route GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return success(res, 200, "Users fetched", { users });
});

// @desc Toggle a user's active status (admin)
// @route PUT /api/users/:id/status
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  user.isActive = !user.isActive;
  await user.save();
  return success(res, 200, "User status updated", { user });
});

module.exports = { getUsers, toggleUserStatus };
