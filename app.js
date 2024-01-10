import setLocalEnvironment from "./config/environment.js";
import dbConnect from "./config/database.js";
import express from "express";
import Campground from "./models/campground.js";
import Review from "./models/review.js";
import methodOverride from "method-override";
import ExpressError from "./src/utils/ExpressError.js";
import catchAsync from "./src/utils/catchAsync.js";
import {
  validateCampground,
  validateReview,
} from "./src/utils/joiValidations.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

main().catch((err) => console.log(err));

async function main() {
  setLocalEnvironment();
  const { MONGO_URL, MONGO_DB_NAME } = process.env;
  await dbConnect(MONGO_URL, MONGO_DB_NAME);
  const app = express();

  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  // Allow express to read information comming from forms
  // inside the req.body, when form action is "POST"
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));

  app.get("/", (req, res) => {
    res.render("home");
  });

  // * ALL CAMPGROUNDS
  app.get(
    "/campgrounds",
    catchAsync(async (req, res) => {
      const campgrounds = await Campground.find({});
      res.render("campgrounds/index", { campgrounds });
    })
  );

  // * CAMPGROUND DETAILS (SHOW)
  app.get(
    "/campgrounds/:id/show",
    catchAsync(async (req, res) => {
      const { id } = req.params;
      const campground = await Campground.findById(id).populate("reviews");
      res.render("campgrounds/show", { campground });
    })
  );

  // * CREATE NEW CAMPGROUND
  app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
  });

  app.post(
    "/campgrounds/new",
    validateCampground,
    catchAsync(async (req, res) => {
      const campground = new Campground(req.body.campground);
      await campground.save();
      res.redirect(`/campgrounds/${campground._id}/show`);
    })
  );

  // * EDIT CAMPGROUND
  app.get(
    "/campgrounds/:id/edit",
    catchAsync(async (req, res) => {
      const { id } = req.params;
      const campground = await Campground.findById(id);
      res.render("campgrounds/edit", { campground });
    })
  );

  app.put(
    "/campgrounds/:id/edit",
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
      console.log({ campground });
      res.redirect(`/campgrounds/${campground._id}/show`);
    })
  );

  // * DELETE CAMPGROUND
  app.delete(
    "/campgrounds/:id/delete",
    catchAsync(async (req, res) => {
      const { id } = req.params;
      const deletedCampground = await Campground.findByIdAndDelete(id);
      console.log({ deletedCampground });
      res.redirect("/campgrounds");
    })
  );

  // * REVIEW CAMPGROUND
  app.post(
    "/campgrounds/:id/reviews",
    validateReview,
    catchAsync(async (req, res) => {
      const campground = await Campground.findById(req.params.id);
      const review = new Review(req.body.review);
      campground.reviews.push(review);
      await review.save();
      await campground.save();
      res.redirect(`/campgrounds/${campground._id}/show`);
    })
  );

  // DELETE REVIEW
  app.delete(
    "/campgrounds/:id/reviews/:reviewId",
    catchAsync(async (req, res) => {
      const { id, reviewId } = req.params;
      await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      res.redirect(`/campgrounds/${id}/show`);
    })
  );

  // * BOTTOM SECTION - CATCH ALL FUNCTIONS
  app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
  });

  app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong...";
    res.status(statusCode).render("error", { err });
  });

  app.listen(3000, () => {
    console.log("YelpCamp 2024 serving on port 3000");
  });
}
