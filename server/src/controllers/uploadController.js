const asyncHandler = require("../utils/asyncHandler");
const { ApiError, success } = require("../utils/apiResponse");
const cloudinary = require("../config/cloudinary");

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "nextcart/products" }, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    stream.end(buffer);
  });
};

const uploadProductImages = asyncHandler(async (req, res) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new ApiError(500, "Cloudinary credentials are not configured on the server");
  }
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No image files were uploaded");
  }

  const results = await Promise.all(req.files.map((file) => streamUpload(file.buffer)));
  const urls = results.map((r) => r.secure_url);

  return success(res, 201, "Images uploaded", { urls });
});

module.exports = { uploadProductImages };