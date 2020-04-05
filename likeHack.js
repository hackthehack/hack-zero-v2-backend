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
  }
  const Hack = conn.model("Hack");
  let likesArray;
  let result;

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
      body: "Uable to like hack"
    };
  }
  //console.log("user hasn't liked it yet");

  if (!likesArray.likes.find(id => id.toString() === userId)) {
    try {
      result = await Hack.findOneAndUpdate(
        { _id: hackId },
        {
          $push: { likes: mongoose.Types.ObjectId(userId) }
        },
        {
          new: true
        }
      );
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin":
            process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
          "Access-Control-Allow-Credentials": true
        },
        body: "Liked a hack"
      };
    } catch (err) {
      console.log(err);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin":
            process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
          "Access-Control-Allow-Credentials": true
        },
        body: "Uable to like hack"
      };
    }
  }
  //"user already liked it");
  try {
    result = await Hack.findOneAndUpdate(
      { _id: hackId },
      {
        $pull: { likes: mongoose.Types.ObjectId(userId) }
      },
      { new: true }
    );
    return {
      statusCode: 200,
      eaders: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: "unLiked a hack"
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
