import Assignment from "../models/assignment.model.js";
import Course from "../models/course.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../services/cloudinary.services.js";
import { getPagination } from "../utils/pagination.js";

export const uploadAssignment = asyncHandler(async (req, res) => {
  const courseId = req.body.courseId || req.body.course;
  const uploadedFile =
    req.file || req.files?.file?.[0] || req.files?.assignment?.[0];

  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  if (!uploadedFile) {
    throw new ApiError(400, "File is required");
  }

  const result = await uploadOnCloudinary(uploadedFile.path);

  const assignment = await Assignment.create({
    user: req.user.id,
    course: courseId,
    fileUrl: result.secure_url,
    publicId: result.public_id,
  });

  res.status(201).json({
    success: true,
    message: "Assignment uploaded successfully",
    assignment,
  });
});

export const getMyAssignments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { skip, perPage } = getPagination(page, limit);

  const assignments = await Assignment.find({
    user: req.user.id,
  })
    .skip(skip)
    .limit(perPage)
    .populate("course");

  const totalAssignments = await Assignment.countDocuments({
    user: req.user.id,
  });

  const totalPages = Math.ceil(totalAssignments / perPage);

  res.status(200).json({
    success: true,
    assignments,
    totalAssignments,
    totalPages,
    currentPage: page,
  });
});