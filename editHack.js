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
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // and MongoDB driver buffering
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
  const Hack = conn.model("Hack");

  // guard against empty fields
  if (goal) update.goal = goal;
  if (title) update.title = title;
  if (description) update.description = description;

  try {
    const result = await Hack.findByIdAndUpdate(hackId, update, {
      new: true
    }).populate("team", "name", "User");

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
    console.log(err.message);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: "Uable to update hack detail"
    };
  }
};
