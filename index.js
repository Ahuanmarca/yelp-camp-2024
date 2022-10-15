const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");

// DATABASE CONNECTION
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// ALTERNATIVA A .THEN() Y .CATCH()
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connceted");
});

const app = express();

// SETTINGS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
    secret: "youWillNeverGuess",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionConfig));
app.use(flash());

// Middleware para flash messages
// We will have access to 'success' as a variable in every single template, we don't have to pass it through!!!
// 😀 I was looking for this!!
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// ROUTES
app.get("/", (req, res) => res.redirect("/campgrounds"));
app.use("/campgrounds", require("./routes/campgrounds"));
app.use("/campgrounds/:id/reviews", require("./routes/reviews"));

// Deprecated error handling
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

// Error handling
app.use((err, req, res, next) => {
    console.error("what am i doing here?");
    const { statusCode = 500, message = "Something went wrong" } = err;
    if (!err.message) err.message = "Oh No! Something Went Wrong!";
    res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
    console.log("hello, world - Serving on port 3000");
});
