import express from "express";
import { getCurrentUser, getUserProfile } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", isAuthenticated, getCurrentUser);
router.get("/:userId", getUserProfile);

export default router;
