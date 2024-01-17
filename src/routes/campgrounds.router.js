import express from 'express';
const router = express.Router();
import catchAsync from '../middlewares/catchAsync.js';
import { validateCampground } from '../middlewares/joiValidations.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import isAuthor from '../middlewares/isAuthor.js';
import * as campgroundsController from '../controllers/campgrounds.controller.js';

router.get('/all', catchAsync(campgroundsController.allCampgrounds));
router.get('/:id/show', catchAsync(campgroundsController.showCampground));
router.get('/new', isLoggedIn, campgroundsController.newCampgroundForm);

router.post(
  '/new',
  isLoggedIn, validateCampground,
  catchAsync(campgroundsController.createNewCampground)
);
router.get(
  '/:id/edit',
  isLoggedIn, isAuthor,
  catchAsync(campgroundsController.editCampgroundForm)
);
router.put(
  '/:id/edit',
  isLoggedIn, isAuthor, validateCampground,
  catchAsync(campgroundsController.updateCampground)
);
router.delete(
  '/:id/delete',
  isLoggedIn, isAuthor,
  catchAsync(campgroundsController.deleteCampground)
);

export default router;
