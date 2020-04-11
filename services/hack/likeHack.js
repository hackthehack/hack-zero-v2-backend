import { connectToDatabase } from "../database/db";
import Hack from "../database/models/HackModel";
import User from "../databse/models/UserModel";

export const like = async (event, context) => {
  //need a hackid
  //need a userid
  //keep an array of likes in hack collecton's document
  //when user likes put in the likes array
  //when user unlike, take user out of the likes array
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);
  const { hackId, userId } = data;

  //console.log(event.requestContext.authorizer.customKey);

  //let likesArray;
  let result;
  let numberLikes;

  //check if the given userId exists
  try {
    await connectToDatabase();
    await User.findById(userId);
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

  //console.log("user hasn't liked it yet");

  //if (!likesArray.likes.find(id => id.toString() === userId)) {
  try {
    await connectToDatabase();
    result = await Hack.findOneAndUpdate(
      { _id: hackId },
      {
        $addToSet: { likes: mongoose.Types.ObjectId(userId) }
      },
      {
        new: true
      }
    );
    numberLikes = result.likes.length;
    return {
      statusCode: 200,
      headers: {
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
  //}
};
