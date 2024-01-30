import express from 'express';
const router = express.Router({ mergeParams: true });
import catchAsync from '../middlewares/catchAsync.js';
import { validateReview } from '../middlewares/joiValidations.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import isReviewAuthor from '../middlewares/isReviewAuthor.js';
import * as reviewsController from '../controllers/reviews.controller.js';

router.post(
  '/new',
  isLoggedIn,
  validateReview,
  catchAsync(reviewsController.createReview)
);

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviewsController.deleteReview)
);

export default router;
