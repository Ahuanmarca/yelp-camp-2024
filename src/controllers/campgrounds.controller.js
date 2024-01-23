// Make 'require' available in es6 modules
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import Campground from '../models/Campground.js';
import { cloudinary } from '../config/cloudinary.js';

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const allCampgrounds = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

const showCampground = async (req, res) => {
  const { id } = req.params;
  // * Nested populate to get review authors 😵‍💫
  // Author is always displayed with the comment
  // so it would be better practice to embed it
  const campground = await Campground.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds/all');
  }
  console.log(campground);
  res.render('campgrounds/show', { campground });
};

const newCampgroundForm = (req, res) => {
  res.render('campgrounds/new');
};

const createNewCampground = async (req, res) => {
  // TODO: Refactor geoData configuration to /config directory?
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1,
  }).send();

  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  })); // 'multer' feature
  campground.author = req.user._id; // 'passport' feature
  await campground.save();
  console.log({ message: "Successfully created campground!", campground });
  req.flash('success', 'Successfully created a new campground!');
  res.redirect(`/campgrounds/${campground._id}/show`);
};

const editCampgroundForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds/all');
  }
  res.render('campgrounds/edit', { campground });
};

const updateCampground = async (req, res) => {
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
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (const filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    // MongoDB Query to delete elements of a nested array
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}/show`);
};

const deleteCampground = async (req, res) => {
  const { id } = req.params;
  const deletedCampground = await Campground.findByIdAndDelete(id);
  console.log({ deleted: deletedCampground });
  req.flash('success', 'Successfully deleted campground');
  res.redirect('/campgrounds/all');
};

export {
  allCampgrounds,
  showCampground,
  newCampgroundForm,
  createNewCampground,
  editCampgroundForm,
  updateCampground,
  deleteCampground,
};
