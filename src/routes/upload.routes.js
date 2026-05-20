import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/image", isAuthenticated, upload.single("image"), uploadImage);

export default router;
