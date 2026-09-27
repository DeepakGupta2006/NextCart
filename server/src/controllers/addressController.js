const asyncHandler = require("../utils/asyncHandler");
const { ApiError, success } = require("../utils/apiResponse");
const User = require("../models/User");

// @desc Get my addresses
// @route GET /api/addresses
const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return success(res, 200, "Addresses fetched", { addresses: user.addresses });
});

// @desc Add address
// @route POST /api/addresses
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  user.addresses.push(req.body);
  await user.save();
  return success(res, 201, "Address added", { addresses: user.addresses });
});

// @desc Update address
// @route PUT /api/addresses/:addressId
const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) throw new ApiError(404, "Address not found");
  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  Object.assign(address, req.body);
  await user.save();
  return success(res, 200, "Address updated", { addresses: user.addresses });
});

// @desc Delete address
// @route DELETE /api/addresses/:addressId
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) throw new ApiError(404, "Address not found");
  address.deleteOne();
  await user.save();
  return success(res, 200, "Address deleted", { addresses: user.addresses });
});

module.exports = { getAddresses, addAddress, updateAddress, deleteAddress };
