import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../services/cloudinary.services.js";

export const uploadImage = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    throw new ApiError(400, "Image file is required");
  }

  const result = await uploadOnCloudinary(file.path);

  res.status(201).json({
    success: true,
    message: "Image uploaded successfully",
    image: {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
    },
  });
});
