import mongoose from "mongoose";
import * as dotenv from "dotenv";
const env = dotenv.config().parsed;

const uri = env.MONGO_URI;

export function connect() {
  mongoose
    .connect(uri)
    .then(() => {
      console.log("Succesfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
}
