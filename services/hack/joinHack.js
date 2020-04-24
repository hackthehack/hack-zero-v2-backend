import Hack from "../database/models/HackModel";
import User from "../database/models/UserModel";
import mongoose from "mongoose";
import { connectToDatabase } from "../database/db";

export const join = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);
  const { hackId, userId } = data;

  const mongUserID = mongoose.Types.ObjectId(userId);

  try {
    await connectToDatabase();
    let res = await Hack.findOneAndUpdate(
      { _id: hackId },
      { $push: { team: mongUserID } },
      { new: true, upsert: true }
    ).populate("team", "-email", User);
    //console.log(res);

    if (res.status === "Submitted") throw new Error("Unable to join");

    if (res.status === "Canceled") throw new Error("Hack is canceld");

    if (res.status === "Team Closed") throw new Error("Hack is closed");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(res),
    };
  } catch (err) {
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
