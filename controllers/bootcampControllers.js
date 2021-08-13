const Bootcamps = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const GeoCoder = require('../utils/geoCoder');
const asyncHandler = require('../middleware/async');

// for (x in Bootcamps) {
//   console.log('Bootcamps', x, 'Bootcamps');
// }

// const path = require('path');
//@desc   Get all/list of Bootcamps
//@route  GET {url}/bootcamps
//@route  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    if (req.query.ids) {
      const bootcamps = await Bootcamps.find();
      let ids = bootcamps.map((b) => b.id);
      return res.status(200).json({ success: true, ids });
    }
  }
  res.status(200).send(res.advanceResults);
});

//@desc   Create Botcamp
//@route  POST {url}/bootcamps
//@route  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  //Check for published bootcamp by same user already.
  const publishedBootcamps = await Bootcamps.findOne({ user: req.user.id });

  //if the user is not admin,can only ceate one bootcamp.
  if (req.user.role !== 'admin' && publishedBootcamps) {
    return res.status(400).json('Not authorised to publish more bootcamps');
  }

  //Add user to Bootcamp
  req.body.user = req.user.id;

  const bootcamp = await Bootcamps.create(req.body);

  res.status(201).json({ success: true, data: bootcamp });
});

//@desc   Get single bootcamps by ID
//@route  GET {url}/bootcamps/:id
//@route  Public
exports.getSingleBootcamp = asyncHandler(async (req, res, next) => {
  // try {
  const bootcamp = await Bootcamps.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).send({ success: true, data: bootcamp });
  // } catch (err) {
  // res.status(400).json({ success: false });
  // err.message = `Hello Bootcamp not found with id of ${req.params.id}`;
  // err.statusCode = 404;
  // next(
  //   new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
  // );
  // next(err);
  // }
});

//@desc   Update bootcamp by id
//@route  PUT {url}/bootcamps/:id
//@route  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  // try {
  const id = req.params.id;

  let bootcamp = await Bootcamps.findById(id);
  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res
      .status(400)
      .json({ success: false, error: 'Not authorised to update' });
  }
  bootcamp = await Bootcamps.findOneAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).send({ success: true, bootcamp });
});

//@desc   Delete Bootcamp
//@route  DEL {url}/bootcamps/:id
//@route  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  // try {
  const bootcamp = await Bootcamps.findById(req.params.id);

  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }
  //Check if the user is owner or user is admin.
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res
      .status(400)
      .json({ success: false, error: 'Not authorised to update' });
  }
  bootcamp.remove();
  res.status(200).send({ success: true, data: {} });
  // } catch (err) {
  //   next(err);
  // }
});

//@desc   Get Bootcamp w/i a radius
//@route  GET {url}/bootcamps/radius/:zipcode/:distance
//@route  Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get Lat/Long from GeoCoder
  const loc = await GeoCoder.geocode(zipcode);
  // console.log('loclocloclocloclocloclocloclocloclocloclocloc', loc);
  const lat = loc[0].latitude;
  const lon = loc[0].longitude;
  //Earth radius=3963mi==6378km
  const radius = distance / 3963;
  const bootcamps = await Bootcamps.find({
    location: { $geoWithin: { $centerSphere: [[lon, lat], radius] } },
  });
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

//@desc   Upload Photo for Bootcamp
//@route  PUT {url}/bootcamps/:id/photo
//@route  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  console.log('bootcampPhotoUpload');
  // try {
  let bootcamp = await Bootcamps.findById(req.params.id);
  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res
      .status(400)
      .json({ success: false, error: 'Not authorised to update' });
  }
  const file = req.files.file;
  if (!req.files) {
    return res
      .status(400)
      .json({ success: false, data: 'Please upload a file' });
  }
  console.log('req.files', req.files, 'req.files');
  //Make sure file is photo/image
  if (!file.mimetype.startsWith('image')) {
    return res
      .status(400)
      .json({ success: false, data: 'Please upload image.' });
  }
  //Check File size
  if (file.size < process.env.MAX_FILE_UPLOAD) {
    return res.status(400).json({
      success: false,
      data: `Please upload image an image less than ${process.env.MAX_FILE_UPLOAD}.`,
    });
  }

  //Create custom file name.
  // const imgExt = path.parse(file.name).ext;
  const imgExt = file.name.split('.')[1];
  const imgName = file.name.split('.')[0];

  file.name = `${imgName}_${bootcamp.id}.${imgExt}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log('Error from file uploading Controller');
      console.log(err);
      return res.status(500).json({
        success: false,
        data: `File uploadig failed, Please try again.`,
      });
    } else {
      await Bootcamps.findByIdAndUpdate(bootcamp.id, {
        photo: file.name,
      });
      return res.status(200).send({ success: true, data: file.name });
    }
  });
});
