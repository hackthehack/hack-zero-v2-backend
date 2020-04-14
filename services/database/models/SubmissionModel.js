import mongoose from "mongoose";

const Schema = mongoose.Schema;
const submissionSchema = new Schema({
  hackId: Schema.Types.ObjectId,
  message: String
});

export default mongoose.model("Submission", submissionSchema);
