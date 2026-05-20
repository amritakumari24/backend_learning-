import jwt from "jsonwebtoken";

import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../config/env.config.js";

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
  });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
  });
};