import mongoose from 'mongoose';

export default async function (MONGO_URL, MONGO_DB_NAME, LOCAL_MONGO_DB_URL) {
  const local = true; // * Toggle this between local and cloud DB
  if (local) {
    await mongoose.connect(LOCAL_MONGO_DB_URL);
    console.log(`Mongoose connected to LOCAL database.`);
  } else {
    await mongoose.connect(MONGO_URL, {
      dbName: MONGO_DB_NAME,
    });
    console.log(`Mongoose connected to ${MONGO_DB_NAME} database.`);
  }
}
