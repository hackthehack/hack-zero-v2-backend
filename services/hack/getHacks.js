const mongoose = require("mongoose");
// const HackModel = require("./model/hack");

let conn = null;
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;

/**
 * Lists all Hacks currently stored in the database
 * @param {*} event
 * @param {*} context
 */
export const list = async (event, context) => {
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
        likes: { type: [{ type: [mongoose.ObjectId] }], default: [] },
        status: String
      })
    );
    conn.model("User", new mongoose.Schema({ name: String }));
  }
  const Query = conn.model("Hack");
  try {
    // Post.aggregate([{$match: {postId: 5}}, {$project: {upvotes: {$size: '$upvotes'}}}])

    const result = await Query.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "team",
          foreignField: "_id",
          as: "team"
        }
      },
      {
        $project: {
          team: { name: 1, _id: 1 },
          likes: { $size: "$likes" },
          _id: 1,
          description: 1,
          goal: 1,
          title: 1,
          status: 1
        }
      }
    ]);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(result)
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
