import express from "express";

import {
  uploadAssignment,
  getMyAssignments,
} from "../controllers/assignment.contoller.js";

import { isAuthenticated } from "../middleware/auth.middleware.js";

import { assignmentUpload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
  "/upload",
  isAuthenticated,
  assignmentUpload,
  uploadAssignment
);

router.get("/my", isAuthenticated, getMyAssignments);

export default router;