const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const app = express();

mongoose
    .connect("mongodb://localhost:27017/farmStand", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB Connection Open");
    })
    .catch((err) => {
        console.log("MongoDB Connection ERROR!");
        console.log(err);
    });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ROUTES
app.get("/", (req, res) => res.render("index/index"));
app.use("/farms", require("./src/routes/farms"));
app.use("/products", require("./src/routes/products"));

app.listen(3000, () => console.log("Listening on port 3000"));
