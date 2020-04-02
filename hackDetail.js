const mongoose = require("mongoose");

let conn = null;
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;

export const detail = async (event, context) => {
  const id = event.pathParameters.id;
  const userId = event.queryStringParameters.userId;

  //need to know if the hack is liked or not by current user in order to show appropriate UI
  context.callbackWaitsForEmptyEventLoop = false;
  if (conn == null) {
    conn = await mongoose.createConnection(url, {
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    conn.model(
      "Hack",
      new mongoose.Schema({
        title: String,
        description: String,
        goal: String,
        team: Array,
        likes: [mongoose.ObjectId]
      })
    );
    conn.model("User", new mongoose.Schema({ name: String, email: String }));
  }
  const Hack = conn.model("Hack");
  let hasUserLiked = false;

  if (userId !== "null") {
    //that means user is logged in and we have his id

    let result = await Hack.findById(id, {
      likes: mongoose.Types.ObjectId(userId)
    });

    if (result.likes.find(id => id.toString() === userId)) {
      hasUserLiked = true;
    }
  }

  try {
    let result = await Hack.findById(id).populate("team", "-email", "User");
    result = result.toObject();
    result.hasUserLiked = hasUserLiked;
    console.log(result);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(result)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: err.message
    };
  }
};
