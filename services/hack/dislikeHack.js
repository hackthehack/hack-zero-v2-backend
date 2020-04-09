import mongoose from "mongoose";

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;
let conn = null;

export const dislike = async (event, context) => {
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
    conn.model("User", new mongoose.Schema({ name: String }));
  }
  const Hack = conn.model("Hack");
  const User = conn.model("User");
  let result;
  let numberLikes;
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

  try {
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
