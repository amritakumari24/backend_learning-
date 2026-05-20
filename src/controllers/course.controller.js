import Course from '../models/course.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { getPagination } from '../utils/pagination.js';

export const createCourse = asyncHandler(async(req, res)=> {
    const {title, description} = req.body;

    const course = await Course.create({
        title,
        description,
        instructor: req.user.id
    });

    res.status(201).json({
        success: true,
        message: "Course Created Successfully",
        course,
    });
});


export const getAllCourses = asyncHandler(async (req, res) => {
  const {
    page,
    limit,
    search,
    sort,
  } = req.query;

  const { perPage, skip, currentPage } =
    getPagination(page, limit);

  
  const filter = {};

  if (search) {
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }

  
  let sortOption = {};

  if (sort === "latest") {
    sortOption = { createdAt: -1 };
  }

  if (sort === "oldest") {
    sortOption = { createdAt: 1 };
  }

  const courses = await Course.find(filter)
    .populate("instructor", "name email")
    .sort(sortOption)
    .skip(skip)
    .limit(perPage);

  const totalCourses = await Course.countDocuments(filter);

  res.status(200).json({
    success: true,

    pagination: {
      totalCourses,
      currentPage,
      perPage,
      totalPages: Math.ceil(totalCourses / perPage),
    },

    courses,
  });
});

export const getSingleCourse = asyncHandler(async(req, res)=>{
    const course = await Course.findById(req.params.id);
    if(!course){
        throw new ApiError(404, "Course not found");

    }

    res.status(200).json({
        success: true,
        course,
    });
});



export const updateCourse = asyncHandler(async (req, res)=>{
    const course = await Course.findById(req.params.id);
    if(!course){
        throw new ApiError(404, "Course not found")
    }

    course.title = req.body.title || course.title;
    course.description = req.body.description || course.description;

    await course.save();

    res.status(200).json({
        success: true,
        message: "Course Updated Successfully",
        course,
    });
});


export const deleteCourse = asyncHandler(async(req, res)=>{
    const course = await Course.findById(req.params.id);

    if(!course){
        throw new ApiError(404, "Course not found");

    }

    await course.deleteOne();
    res.status(200).json({
        success: true,
        message: "Course Deleted Successfully",
    });
});