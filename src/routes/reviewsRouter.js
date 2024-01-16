import express from 'express';
const router = express.Router({ mergeParams: true });
import Review from '../models/review.js';
import Campground from '../models/campground.js';
import catchAsync from '../utils/catchAsync.js';
import { validateReview } from '../utils/joiValidations.js';
import isLoggedIn from '../utils/isLoggedIn.js';

// * REVIEW CAMPGROUND
router.post(
  '/new',
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}/show`);
  })
);

// * DELETE REVIEW
router.delete(
  '/:reviewId',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}/show`);
  })
);

export default router;
