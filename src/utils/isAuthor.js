import Campground from '../models/Campground.js';

async function isAuthor(req, res, next) {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/campgrounds/${id}/show`);
  }
  next();
}

export default isAuthor;