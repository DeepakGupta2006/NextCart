const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const { ApiError } = require("../utils/apiResponse");
const { secret } = require("../config/jwt");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) throw new ApiError(401, "Not authorized, no token provided");

  try {
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) throw new ApiError(401, "User no longer exists");
    next();
  } catch (err) {
    throw new ApiError(401, "Not authorized, token invalid or expired");
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    throw new ApiError(403, "Admin access required");
  }
};

module.exports = { protect, admin };
