import mongoose from 'mongoose';

export default async function (MONGO_URL, MONGO_DB_NAME) {
  const local = true; // * Toggle this between local and cloud DB
  // TODO: Can I control this when running npm script?

  if (local) {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp-2024');
    console.log(`Mongoose connected to LOCAL database.`);
  } else {
    await mongoose.connect(MONGO_URL, {
      dbName: MONGO_DB_NAME,
    });
    console.log(`Mongoose connected to ${MONGO_DB_NAME} database.`);
  }
}
