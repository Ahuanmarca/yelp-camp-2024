import express from 'express';
const router = express.Router();
import catchAsync from '../middlewares/catchAsync.js';
import Campground from '../models/Campground.js';
import { validateCampground } from '../middlewares/joiValidations.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import isAuthor from '../middlewares/isAuthor.js';

// * ALL CAMPGROUNDS
router.get(
  '/all',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

// * SHOW CAMPGROUND DETAILS (SHOW)
router.get(
  '/:id/show',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    // * Nested populate so get review authors 😵‍💫
    // Author is always displayed with the comment
    // so it would be better practice to embed it
    const campground = await Campground.findById(id)
      .populate({
        path: 'reviews',    // <- Nested populate
        populate: {         // <- Nested populate
          path: 'author',   // <- Nested populate
        }
      })
      .populate('author');
    console.log(campground);
    if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds/all');
    }
    res.render('campgrounds/show', { campground });
  })
);

// * CREATE NEW CAMPGROUND
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.post(
  '/new',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id; // ? passport feature ?
    await campground.save();
    req.flash('success', 'Successfully created a new campground!');
    res.redirect(`/campgrounds/${campground._id}/show`);
  })
);

// * EDIT CAMPGROUND
router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash('error', 'Cannot find that campground!');
      return res.redirect('/campgrounds/all');
    }
    res.render('campgrounds/edit', { campground });
  })
);

router.put(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    // TIP: req.body brings 'title' and 'location' wrapped on an 'campground' object:
    // i.e. { campground: { title: 'Tumbling Creek', location: 'Jupiter, Florida' } }
    // This is because of the 'name' property on edit.ejs
    // const campground = await Campground.findById(id);
    const campground = await Campground.findByIdAndUpdate(
      id,
      { ...req.body.campground },
      { new: true }
    );
    // Why copy the campground? Because I will probably add more attributes later when editing.
    console.log({ newCampground: campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}/show`);
  })
);

// * DELETE CAMPGROUND
router.delete(
  '/:id/delete',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    console.log({ deleted: deletedCampground });
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds/all');
  })
);

export default router;
