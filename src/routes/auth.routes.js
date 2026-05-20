import express from "express";
import {
    sendOtp,
    verifyOtpAndRegister,
    loginUser,
    refreshAccessToken,
    logoutUser,
} from '../controllers/auth.controller.js';
import { isAuthenticated } from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";

import {
  registerValidation,
  loginValidation,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post(
  "/verify-otp",
  registerValidation,
  validate,
  verifyOtpAndRegister
);
router.post(
  "/login",
  loginValidation,
  validate,
  loginUser
);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", isAuthenticated, logoutUser);

export default router;