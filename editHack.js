const mongoose = require("mongoose");

let conn = null;
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;

export const edit = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);
  const { goal, title, description, hackId } = data;
  let update = {};
  if (conn == null) {
    conn = await mongoose.createConnection(url, {
      // Buffering means mongoose will queue up operations if it gets
      // disconnected from MongoDB and send them when it reconnects.
      // With serverless, better to fail fast if not connected.
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // and MongoDB driver buffering
    });
    conn.model(
      "Hack",
      new mongoose.Schema({ title: String, description: String, goal: String })
    );
  }
  const Hack = conn.model("Hack");

  // guard against empty fields
  if (goal) update.goal = goal;
  if (title) update.title = title;
  if (description) update.descripton = description;

  const result = await Hack.findByIdAndUpdate(hackId, update, { new: true });
  console.log(result);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
      "Access-Control-Allow-Credentials": true
    },
    body: "edit hack route"
  };
};
