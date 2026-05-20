import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { generateOtp } from "../utils/generateOtp.js";
import OTP from "../services/otp.services.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generaterToken.js";
import { sendOtpEmail } from "../services/email.services.js";
import { JWT_REFRESH_SECRET } from "../config/env.config.js";



export const sendOtp = asyncHandler(async(req, res)=>{
    const {email} = req.body;

  const existingUser = await User.findOne({ email });

  // If user exists and already verified, do not send OTP
  if (existingUser && existingUser.isVerified) {
    throw new ApiError(400, "User already exists and is verified");
  }

  const otp = generateOtp();

  // store OTP with 5 minute expiry
  await OTP.create({
    email,
    otp,
    expireAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  // send OTP email (best-effort)
  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    // Log error but still respond (so client can retry). Avoid revealing internals.
    console.error("sendOtpEmail error:", err.message || err);
  }

  res.json({
    success: true,
    message: "OTP sent to email",
  });
});

export const verifyOtpAndRegister = asyncHandler(async (req, res) => {
  const { name, email, password, otp } = req.body;

  const record = await OTP.findOne({ email, otp });

  if (!record || record.expireAt < Date.now()) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isVerified: true,
  });

  await OTP.deleteMany({ email });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Secure cookie options for production
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes for access token
  });

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.json({
    success: true,
    message: "Login successful",
  });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const newAccessToken = generateAccessToken(user);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  // Clear both cookies with explicit maxAge 0 for immediate expiry
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });
  
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });

  res.json({
    success: true,
    message: "Logout successful",
  });
});
