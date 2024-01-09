import setLocalEnvironment from "./config/environment.js";
import dbConnect from "./config/database.js";
import express from "express";
import Campground from "./models/campgrounds.js";
import methodOverride from "method-override";
import ExpressError from "./src/utils/ExpressError.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

main().catch((err) => console.log(err));

/**
 * ExpressError
 * I can throw ExpressError inside try/catch blocks (on the try 
 * section) to catch errors that won't be automatically detected 
 * by node, like creating an empty campground. It will pass to
 * next() on the catch block, then to app.use at the bottom.
 */

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
  app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  });

  // * CAMPGROUND DETAILS
  app.get("/campgrounds/:id/show", async (req, res, next) => {
    try {
      // throw new ExpressError("OOPS, ERROR MANUALLY THRONW", 404);
      const { id } = req.params;
      const campground = await Campground.findById(id);
      res.render("campgrounds/show", { campground });
    } catch (e) {
      next(e);
    }
  });

  // * CREATE NEW CAMPGROUND
  app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
  });

  app.post("/campgrounds/new", async (req, res, next) => {
    try {
      const campground = new Campground(req.body.campground);
      await campground.save();
      res.redirect(`/campgrounds/${campground._id}/show`);
    } catch (e) {
      next(e);
    }
  });

  // * EDIT CAMPGROUND
  app.get("/campgrounds/:id/edit", async (req, res, next) => {
    try {
      const { id } = req.params;
      const campground = await Campground.findById(id);
      res.render("campgrounds/edit", { campground });
    } catch (e) {
      next(e);
    }
  });

  app.put("/campgrounds/:id/edit", async (req, res, next) => {
    try {
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
    } catch (e) {
      next(e);
    }
  });

  // * DELETE CAMPGROUND
  app.delete("/campgrounds/:id/delete", async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedCampground = await Campground.findByIdAndDelete(id);
      console.log({ deletedCampground });
      res.redirect("/campgrounds");
    } catch (e) {
      next(e);
    }
  });

  app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
  });

  app.use((err, req, res, next) => {
    const { statusCode = 5000 } = err;
    if (!err.message) err.message = "Something went wrong..."
    res.status(statusCode).render("error", { err });
  });

  app.listen(3000, () => {
    console.log("YelpCamp 2024 serving on port 3000");
  });
}
