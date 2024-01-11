import setLocalEnvironment from "./src/config/environment.js";
import dbConnect from "./src/config/database.js";
import express from "express";
import methodOverride from "method-override";
import ExpressError from "./src/utils/ExpressError.js";
import campgrounds from "./src/routes/campgroundsRouter.js";
import review from "./src/routes/reviewsRouter.js";
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

  app.set("views", path.join(__dirname, "src/views"));
  app.set("view engine", "ejs");

  // Allow express to read information comming from forms
  // inside the req.body, when form action is "POST"
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/", (req, res) => {
    res.render("home");
  });

  // * ROUTER
  app.use("/campgrounds", campgrounds);
  app.use("/campgrounds/:id/reviews", review);

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
