const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "YelpCamp",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

const express = require(`express`);
const router = express.Router();
const catchAsync = require(`../utilities/catchAsync`);
const Campground = require(`../Models/campground`);
const campgrounds = require(`../controllers/campgroud`);
const { campgroundSchema } = require(`../schema`);
const ExpressError = require(`../utilities/expressErrors`);
const Joi = require(`joi`);
const isLoggedIn = require(`../middleware`);
const multer = require(`multer`);
const upload = multer({ storage });

//  Middleware for routers..
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

router
  .route(`/`)
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

router.get(`/new`, isLoggedIn, campgrounds.renderNewForm);

router
  .route(`/:id`)
  .get(catchAsync(campgrounds.showCampgroundDetails))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  `/:id/edit`,
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.editCampground)
);
module.exports = router;
