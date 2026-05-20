import express from "express";
import {
    createCourse,
    getAllCourses,
    getSingleCourse,
    updateCourse,
    deleteCourse,
} from "../controllers/course.controller.js";

import { isAuthenticated } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post('/', 
    isAuthenticated,
    authorizeRoles("admin"),
    createCourse
);

router.get('/', isAuthenticated, getAllCourses);
router.get('/:id', isAuthenticated, getSingleCourse);
router.patch(
    '/:id',
    isAuthenticated,
    authorizeRoles("admin"),
    updateCourse
);
router.delete('/:id', 
    isAuthenticated,
    authorizeRoles("admin"),
    deleteCourse

);

export default router;
