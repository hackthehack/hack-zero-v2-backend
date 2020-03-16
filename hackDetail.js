const mongoose = require("mongoose");
// const HackModel = require("./model/hack");

let conn = null;
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;

export const detail = async (event, context) => {
  const id = event.pathParameters.id;
  context.callbackWaitsForEmptyEventLoop = false;
  if (conn == null) {
    conn = await mongoose.createConnection(url, {
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    conn.model(
      "Hack",
      new mongoose.Schema({ title: String, description: String, goal: String, team: Array })
    );
    conn.model("User", new mongoose.Schema({ name: String, email: String }));
  }
  const Hack = conn.model("Hack");
  const Team = conn.model("User");

  try {

    let result = await Hack.findById(id);
    const users = await Team.find();
    for(const team_key in result.team){
      users.forEach(member => {
        if(JSON.stringify(member._id) == JSON.stringify(result.team[team_key])){
          result.team[team_key] = {_id: member._id, name: member.name};
        }
      });
    }
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
      body: "Failed to get hack detail"
    };
  }
};
