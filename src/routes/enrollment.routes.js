import express from "express";

import {
  enrollCourse,
  getMyEnrollments,
} from "../controllers/enrollment.controller.js";

import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post('/', isAuthenticated, enrollCourse);
router.get('/my', isAuthenticated, getMyEnrollments);

export default router;