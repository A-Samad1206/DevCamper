const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

//@desc   Get all/list of Couses
//@route  GET {url}/courses
//@route  GET {url}/bootcamps/:bootcampId/courses
//@route  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } else {
    res.status(200).json(res.advanceResults);
  }
});

//@desc   Get Single Couses
//@route  GET {url}/courses/:id
//@route  Public
exports.getSingleCourse = asyncHandler(async (req, res, next) => {
  const courses = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  }); //Add Select Query Dynamically
  if (!courses) {
    return res.status(404).json({
      success: true,
      data: `No Course with the id of ${req.params.id}`,
    });
  }
  res.status(200).json({ success: true, data: courses });
});

//@desc   Add Course
//@route  POST {url}/bootcamps/:bootcampId/courses
//@route  Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    res.status(404).json({ success: false, data: 'No Bootcamp exist!' });
  }

  //Make sure user is owner or admin.
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res
      .status(400)
      .json({ success: false, error: 'Not authorised to Add Course' });
  }
  req.body.bootcamp = bootcamp.id;
  req.body.user = bootcamp.user;
  const courses = await Course.create(req.body);
  if (courses) {
    return res.status(200).json({ success: true, data: courses });
  }
  res.status(404).json({ success: false, error: 'Unable to add course' });
});

//@desc   Update Course
//@route  PUT {url}/courses/:id
//@route  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404).json({ success: false });
  }
  //Make sure user is owner or admin.
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res
      .status(400)
      .json({ success: false, error: 'Not authorised to Update Course' });
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (course) {
    return res.status(200).json({ success: true, data: course });
  }
  res.status(400).json({ success: false });
});
// deleteCourses

//@desc   Delete Course
//@route  DELETE {url}/courses/:id
//@route  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(200).json({
      success: false,
      data: `No Course with the id of ${req.params.id}`,
    });
  }
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res
      .status(400)
      .json({ success: false, error: 'Not authorised to Update Course' });
  }

  await course.remove();
  res.status(200).json({ success: true, data: [] });
});
