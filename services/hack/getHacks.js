import { connectToDatabase } from "../database/db";
import Hack from "../database/models/HackModel";
import User from "../database/models/UserModel";
/**
 * Lists all Hacks currently stored in the database
 * @param {*} event
 * @param {*} context
 */
export const list = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectToDatabase();
    const doc = await Hack.find().populate("team", "name", User);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(doc)
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: "Uable to fetch hacks data"
    };
  }
};
