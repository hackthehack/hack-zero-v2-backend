import { connectToDatabase } from "../database/db";
import Hack from "../database/models/HackModel";
import User from "../database/models/UserModel";

export const detail = async (event, context) => {
  const id = event.pathParameters.id;
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectToDatabase();
    let result = await Hack.findById(id)
      .populate("team", "-email", "User")
      .populate("creator", "-email", "User");
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
