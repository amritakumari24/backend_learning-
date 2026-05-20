import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getPagination } from "../utils/pagination.js";

export const enrollCourse = asyncHandler(async(req, res)=>{
    const {courseId} = req.body;

const course = await Course.findById(courseId);
if(!course){
    throw new ApiError(404, "course not found");
}
 const alreadyEnrolled = await Enrollment.findOne({
    user: req.user.id,
    course: courseId,
 });
 if(alreadyEnrolled){
    throw new ApiError(400, "already enrolled");
 }

 const enrollment = await Enrollment.create({
    user: req.user.id,
    course: courseId,
 });

 res.status(201).json({
    success: true,
    message: "enrolled successfully",
    enrollment,
 });

});

export const getMyEnrollments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { skip, perPage } = getPagination(page, limit);

  const enrollments = await Enrollment.find({
    user: req.user.id,
  })
    .skip(skip)
    .limit(perPage)
    .populate("course");

  const totalEnrollments = await Enrollment.countDocuments({
    user: req.user.id,
  });

  const totalPages = Math.ceil(totalEnrollments / perPage);

  res.status(200).json({
    success: true,
    enrollments,
    totalEnrollments,
    totalPages,
    currentPage: page,
  });
});