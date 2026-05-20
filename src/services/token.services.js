import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET } from "../config/env.config.js";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
  });
};
