const mongoose = require("mongoose");
// const HackModel = require("./model/hack");

let conn = null;
// const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;
// console.log("mongo user", process.env.MONGO_USER);
/**
 * Lists all Hacks currently stored in the database
 * @param {*} event
 * @param {*} context
 */
export const list = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (conn == null) {
    conn = await mongoose.createConnection(process.en.MONGO_DEV_URL, {
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    conn.model(
      "Hack",
      new mongoose.Schema({
        title: String,
        description: String,
        goal: String,
        team: Array
      })
    );
    conn.model("User", new mongoose.Schema({ name: String }));
  }
  const Query = conn.model("Hack");
  try {
    const doc = await Query.find().populate("team", "-email", "User");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(doc)
    };
  } catch (err) {
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
