import mongoose from "mongoose";

export default async function (MONGO_URL, MONGO_DB_NAME) {
  await mongoose.connect(MONGO_URL, {
    dbName: MONGO_DB_NAME,
  });
  console.log(`Mongoose connected to ${MONGO_DB_NAME} database.`);
}
