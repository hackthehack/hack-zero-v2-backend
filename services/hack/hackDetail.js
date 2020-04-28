import { connectToDatabase } from "../database/db";
import Hack from "../database/models/HackModel";
import User from "../database/models/UserModel";

export const detail = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;
  const userId = event.queryStringParameters.userId;

  //need to know if the hack is liked or not by current user in order to show appropriate UI

  let hasUserLiked = false;
  let numberLikes = 0;

  // showing number of likes regardless if user is logged in
  // if user is logged in, find out if he liked it or not
  try {
    await connectToDatabase();
    let result = await Hack.findById(id);

    numberLikes = result.likes.length;

    hasUserLiked = result.likes.find(id => id.toString() === userId);
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true,
      },
      body: err.message,
    };
  }

  try {
    await connectToDatabase();
    let result = await Hack.findById(id)
      .select("-likes")
      .populate("team creator", "-email", User);
    result = result.toObject();
    result.hasUserLiked = hasUserLiked;
    result.numberLikes = numberLikes;
    console.log(result);

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
      body: err.message,
    };
  }
};
