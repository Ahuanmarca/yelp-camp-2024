import express from 'express';
const router = express.Router({ mergeParams: true });
import Review from '../models/Review.js';
import Campground from '../models/Campground.js';
import catchAsync from '../utils/catchAsync.js';
import { validateReview } from '../utils/joiValidations.js';
import isLoggedIn from '../utils/isLoggedIn.js';
import isReviewAuthor from '../utils/isReviewAuthor.js';

// * REVIEW CAMPGROUND
router.post(
  '/new',
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
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
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}/show`);
  })
);

export default router;
