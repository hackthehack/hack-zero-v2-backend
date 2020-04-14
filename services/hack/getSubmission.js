import { connectToDatabase } from "../database/db";
import Submission from "../database/models/SubmissionModel";

export const submissionDetails = async (event, context) => {
  const id = event.pathParameters.id;
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectToDatabase();
    let result = await Submission.findOne({ hackId: id });
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(result)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: err.message
    };
  }
};
