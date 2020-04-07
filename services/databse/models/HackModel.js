import mongoose from "mongoose";

const Schema = mongoose.Schema;
const hackSchema = new Schema({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  goal: { type: String, default: "" },
  team: { type: [Schema.Types.ObjectId], default: [] },
  status: { type: String, default: "New Hack" },
  creator: { type: Schema.Types.ObjectId, default: null },
  teamName: String,
  likes: { type: [Schema.Types.ObjectId], default: [] }
});

module.exports = mongoose.model("Hack", hackSchema);
