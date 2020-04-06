const mongoose = require("mongoose");
import { pickIfTruthy } from "./utils";
let conn = null;
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;

export const submit = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);
  const { submissionId } = data;

  if (conn == null) {
    conn = await mongoose.createConnection(url, {
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // and MongoDB driver buffering
    });
    conn.model(
      "submission",
      new mongoose.Schema({
        hackId: String,
        message: String,
      })
    );
  }

  const Submission = conn.model("submission");

  const submit = pickIfTruthy(data, "hackId", "message");

  try {
    const result = await Submission.findByIdAndUpdate(submissionId, submit, {
      new: true,
      upsert: true
    });

    console.log(result);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(result)
    };
  } catch (err) {
    console.log(err.message);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: "Uable to update hack detail"
    };
  }
};
