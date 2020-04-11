import { connectToDatabase } from "../database/db";
import Hack from "../database/models/HackModel";
import User from "../databse/models/UserModel";
import mongoose from "mongoose";
export const dislike = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);
  const { hackId, userId } = data;

  let result;
  let numberLikes;
  //check if the given userId exists
  try {
    await connectToDatabase();
    await User.findById(userId);
    //console.log(user);
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: "Uable to like hack"
    };
  }

  try {
    await connectToDatabase();
    result = await Hack.findOneAndUpdate(
      { _id: hackId },
      { $pull: { likes: mongoose.Types.ObjectId(userId) } },
      { new: true }
    );
    numberLikes = result.likes.length;
    return {
      statusCode: 200,
      eaders: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({ numberLikes })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: "Uable to like hack"
    };
  }
};
