import { connectToDatabase } from "../database/db";
import Hack from "../database/models/HackModel";
import mongoose from "mongoose";
/**
 * Lists all Hacks currently stored in the database
 * @param {*} event
 * @param {*} context
 */
export const list = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const userId = event.queryStringParameters.userId;
  //let hasUserLiked = false;
  console.log(userId);
  try {
    await connectToDatabase();

    const result = await Hack.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "team",
          foreignField: "_id",
          as: "team",
        },
      },
      {
        $project: {
          team: { name: 1, _id: 1 },
          likes: { $size: "$likes" },
          description: 1,
          _id: 1,
          hasUserLiked: {
            $in: [
              userId !== "null" || !userId
                ? mongoose.Types.ObjectId(userId)
                : null,
              "$likes",
            ],
          },
          goal: 1,
          title: 1,
          status: 1,
        },
      },
    ]);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true,
      },
      body: "Uable to fetch hacks data",
    };
  }
};
