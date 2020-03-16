const mongoose = require("mongoose");

let conn = null;

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;

export const join = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);
  const { hackId, userId } = data;

  const mongUserID = mongoose.Types.ObjectId(userId);

  if (conn == null) {
    conn = await mongoose.createConnection(uri, {
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    conn.model(
      "Hack",
      new mongoose.Schema({team: Array})
    );
    conn.model("User", new mongoose.Schema({ name: String, email: String }));
  }
  const Hack = conn.model("Hack");
  const Team = conn.model("User");
  try {
    let res = await Hack.findOneAndUpdate({_id: hackId}, {$push: {team: mongUserID } }, {new: true, upsert: true});
    const users = await Team.find();
    for(const team_key in res.team){
      users.forEach(member => {
        if(JSON.stringify(member._id) == JSON.stringify(res.team[team_key])){
          res.team[team_key] = {_id: member._id, name: member.name};
        }
      });
    }
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(res)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(err.message)
    };
  }
};
