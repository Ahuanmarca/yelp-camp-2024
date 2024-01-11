import express from "express";
const router = express.Router();
import catchAsync from "../utils/catchAsync.js";
import Campground from "../models/campground.js";
import { validateCampground } from "../utils/joiValidations.js";

// * ALL CAMPGROUNDS
router.get(
  "/all",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// * SHOW CAMPGROUND DETAILS (SHOW)
router.get(
  "/:id/show",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds/all");
    }
    res.render("campgrounds/show", { campground });
  })
);

// * CREATE NEW CAMPGROUND
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/new",
  validateCampground,
  catchAsync(async (req, res) => {
    console.log(req);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully created a new campground!");
    res.redirect(`/campgrounds/${campground._id}/show`);
  })
);

// * EDIT CAMPGROUND
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds/all");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    // TIP: req.body brings 'title' and 'location' wrapped on an 'campground' object:
    // i.e. { campground: { title: 'Tumbling Creek', location: 'Jupiter, Florida' } }
    // This is because of the 'name' property on edit.ejs
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
  "/:id/delete",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    console.log({ deleted: deletedCampground });
    req.flash('success', 'Successfully deleted campground');
    res.redirect("/campgrounds/all");
  })
);

export default router;
