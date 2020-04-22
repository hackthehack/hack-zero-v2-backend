import AWS from "aws-sdk";
import { pickIfTruthy } from "../../utils";
import { connectToDatabase } from "../database/db";
import Submission from "../database/models/SubmissionModel";
import mongoose from "mongoose";

AWS.config.update({ region: "us-east-1" });
export const submit = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);
  let { submissionId, files } = data;
  if (submissionId === null){
    submissionId = mongoose.Types.ObjectId();
  }
  const submit = pickIfTruthy(data, "hackId", "message");
  console.log(files);
  try {
    await connectToDatabase();
    await Submission.findByIdAndUpdate(submissionId, {...submit, $addToSet: { files: files} }, {
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
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: "Unable to update hack detail"
    };
  }
};
