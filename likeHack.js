import mongoose from "mongoose";

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;
let conn = null;

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
  if (conn == null) {
    conn = await mongoose.createConnection(uri, {
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    conn.model(
      "Hack",
      new mongoose.Schema({
        likes: { type: [mongoose.ObjectId], default: [] }
      })
    );
    conn.model("User", new mongoose.Schema({ name: String }));
  }
  const Hack = conn.model("Hack");
  const User = conn.model("User");
  let likesArray;
  let result;
  let numberLikes;
  try {
    likesArray = await Hack.findOne({ _id: hackId }, "likes");
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: "Unable to like hack"
    };
  }

  //check if the given userId exists
  try {
    let user = await User.findById(userId);
    console.log(user);
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
