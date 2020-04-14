import Hack from "../database/models/HackModel";
import User from "../database/models/UserModel";
import mongoose from "mongoose";
import { connectToDatabase } from "../database/db";

export const join = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);
  const { hackId, userId } = data;

  const mongUserID = mongoose.Types.ObjectId(userId);

  try {
    await connectToDatabase();
    let res = await Hack.findOneAndUpdate(
      { _id: hackId },
      { $push: { team: mongUserID } },
      { new: true, upsert: true }
    ).populate("team", "-email", User);
    // const doc = await Query.find()
    // const users = await Team.find();
    // for(const team_key in res.team){
    //   users.forEach(member => {
    //     if(JSON.stringify(member._id) == JSON.stringify(res.team[team_key])){
    //       res.team[team_key] = {_id: member._id, name: member.name};
    //     }
    //   });
    // }
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
