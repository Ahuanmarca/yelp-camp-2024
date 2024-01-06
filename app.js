import setLocalEnvironment from "./config/environment.js";
import dbConnect from "./config/database.js";
import express from "express";
import Campground from "./models/campgrounds.js";
// import mongoose from "mongoose";
// import ejs from "ejs";

main().catch((err) => console.log(err));

async function main() {
  setLocalEnvironment();
  const { MONGO_URL, MONGO_DB_NAME } = process.env;
  await dbConnect(MONGO_URL, MONGO_DB_NAME);
  const app = express();

  app.get("/", (req, res) => {
    res.send("hello, world");
  });

  app.get("/makecampground", async (req, res) => {
    const camp = new Campground({
      title: "My backyard",
      description: "Cheap camping!",
    });
    await camp.save();
    res.send(camp);
  });

  app.listen(3000, () => {
    console.log("YelpCamp 2024 serving on port 3000");
  });
}
