const mongoose = require("mongoose");
import aws from "aws-sdk";
import { pickIfTruthy } from "./utils";
let conn = null;
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;
AWS.config.update({ region: "us-east-1" });
s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// Call S3 to list the buckets
s3.listBuckets(function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Buckets);
  }
});
export const submit = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);
  let { submissionId } = data;

  if (conn == null) {
    conn = await mongoose.createConnection(url, {
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // and MongoDB driver buffering
    });
    if (!submissionId) {
      submissionId = new mongoose.mongo.ObjectID();
    }
    conn.model(
      "submission",
      new mongoose.Schema({
        hackId: String,
        message: String
      })
    );
  }

  const Submission = conn.model("submission");

  //const submit = pickIfTruthy(data, "hackId", "message");
  try {
    // const result = await Submission.findByIdAndUpdate(submissionId, submit, {
    //   new: true,
    //   upsert: true
    // });
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: "submission successful"
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
