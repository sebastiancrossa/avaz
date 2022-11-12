import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const opts = {};

async function dbConnect(req, res, next) {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(MONGODB_URI, opts);
    }

    if (Object.keys(mongoose.models).length === 0) {
      await import("models");
    }
  } catch (error) {
    return next(error);
  }

  return next();
}

export default dbConnect;
