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
  console.log(data.files);
  console.log(data.message);
  if(submissionId === undefined){
    submissionId = mongoose.Types.ObjectId();
  }
  const submit = pickIfTruthy(data, "hackId", "message");
  submit.files = [];
  for(let key in files){
    submit.files.push({name: files[key].name, size: files[key].size, type: files[key].type});
  }
  try {
    await connectToDatabase();
    await Submission.findByIdAndUpdate(submissionId, submit, {
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
