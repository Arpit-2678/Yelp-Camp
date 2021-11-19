const express = require(`express`);
const router = express.Router({ mergeParams: true });
const catchAsync = require(`../utilities/catchAsync`);
const Campground = require(`../Models/campground`);
const Review = require(`../Models/review`);
const { reviewSchema } = require(`../schema`);
const ExpressError = require(`../utilities/expressErrors`);
const isLoggedIn = require(`../middleware`);
const Joi = require(`joi`);
const reviews = require(`../controllers/review`);
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
router.post(`/`, isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
