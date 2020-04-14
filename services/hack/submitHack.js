import AWS from "aws-sdk";
import { pickIfTruthy } from "./utils";
import { connectToDatabase } from "../database/db";
import Submission from "../database/models/SubmissionModel";

AWS.config.update({ region: "us-east-1" });
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

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

  const submit = pickIfTruthy(data, "hackId", "message");
  try {
    const result = await Submission.findByIdAndUpdate(submissionId, submit, {
      new: true,
      upsert: true
    });
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
