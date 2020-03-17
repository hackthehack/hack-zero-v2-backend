import { list } from "../getHacks";
import mongoose from "mongoose";

const hackSchema = new mongoose.Schema({
  title: String,
  description: String,
  goal: String
});

const Hack = mongoose.model("Hack", hackSchema);
