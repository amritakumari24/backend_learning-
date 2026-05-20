import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { JWT_ACCESS_SECRET } from "../config/env.config.js";

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return next(new ApiError(401, "Not authenticated"));
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

