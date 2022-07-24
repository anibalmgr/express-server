import mongoose from "mongoose";
const { model, Schema } = mongoose;

const userSchema = new Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});

const user = model("user", userSchema);
export const findOne = (e) => user.findOne(e);
export const create = (e) => user.create(e);
