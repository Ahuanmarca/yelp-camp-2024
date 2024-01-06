import mongoose from "mongoose";
import cities from "./cities.js";
import { descriptors, places } from "./seedHelpers.js";
import Campground from "../../models/campgrounds.js";
import setEnvironmentVariables from "../../config/environment.js";
import connectToDatabase from "../../config/database.js";

main().catch((err) => console.log(err));

async function main() {
  setEnvironmentVariables();
  console.log(process.env);
  const { MONGO_URL, MONGO_DB_NAME } = process.env;
  await connectToDatabase(MONGO_URL, MONGO_DB_NAME);
  await seedDB();
  mongoose.connection.close();
}

const sample = array => array[Math.floor(Math.random() * array.length)];
async function seedDB() {
  await Campground.deleteMany();
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`
    })
    await camp.save();
  }
}