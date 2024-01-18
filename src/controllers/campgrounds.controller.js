import Campground from '../models/Campground.js';

const allCampgrounds = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

const showCampground = async (req, res) => {
  const { id } = req.params;
  // * Nested populate so get review authors 😵‍💫
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
  res.render('campgrounds/show', { campground });
};

const newCampgroundForm = (req, res) => {
  res.render('campgrounds/new');
};

const createNewCampground = async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id; // ? passport feature ?
  await campground.save();
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
