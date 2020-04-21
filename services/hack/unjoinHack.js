import Hack from "../database/models/HackModel";
import User from "../database/models/UserModel";
import mongoose from "mongoose";
import { connectToDatabase } from "../database/db";

export const unjoin = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);
  const { hackId, userId } = data;

  const mongUserID = mongoose.Types.ObjectId(userId);

  try {
    await connectToDatabase();
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(err.message),
    };
  }
};
