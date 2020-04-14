import { connectToDatabase } from "../database/db";
import Hack from "../database/models/HackModel";

import mongoose from "mongoose";
/**
 * Lists all Hacks currently stored in the database
 * @param {*} event
 * @param {*} context
 */
export const list = async (event, context) => {
  const userid = event.pathParameters.id;
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectToDatabase();
    const doc = await Hack.find({
      team: mongoose.Types.ObjectId(userid)
    })
      .populate("User")
      .select("_id title description");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(doc)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: "error"
    };
  }
};
