const mongoose = require("mongoose");
import { pickIfTruthy } from "../../utils/";
let conn = null;

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;

export const add = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);
  console.log(data);

  if (conn == null) {
    conn = await mongoose.createConnection(uri, {
      // Buffering means mongoose will queue up operations if it gets
      // disconnected from MongoDB and send them when it reconnects.
      // With serverless, better to fail fast if not connected.
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // and MongoDB driver buffering
    });
    conn.model(
      "Hack",
      new mongoose.Schema({
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        goal: { type: String, default: "" },
        team: { type: Array, default: [] },
        creator: { type: String, default: null }
      })
    );
  }
  const Hack = conn.model("Hack");

  const newIdea = pickIfTruthy(
    data,
    "title",
    "goal",
    "description",
    "creator",
    "team"
  );
  console.log(newIdea);

  try {
    const newHack = new Hack(newIdea);
    const query = await newHack.save();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        message: `hack created`,
        id: query._id
      })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        message: `Unable to create hack`
      })
    };
  }
};
