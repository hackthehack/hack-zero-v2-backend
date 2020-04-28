import mongoose from "mongoose";


const Schema = mongoose.Schema;
const file = new Schema({ name: String, size: Number, type: String });
const submissionSchema = new Schema({
  hackId: Schema.Types.ObjectId,
  message: String,
  files: [file]
});

export default mongoose.model("Submission", submissionSchema);
