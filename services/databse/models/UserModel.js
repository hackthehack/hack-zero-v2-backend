import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  name: String
});

module.exports = mongoose.model("User", userSchema);
