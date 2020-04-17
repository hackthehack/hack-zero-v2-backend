import User from "../database/models/UserModel";
import Hack from "../database/models/HackModel";
import { connectToDatabase } from "../database/db";
import { pickIfTruthy } from "../../utils/";

export const edit = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);
  const { hackId } = data;
  const update = pickIfTruthy(
    data,
    "goal",
    "title",
    "description",
    "teamName",
    "status"
  );

  try {
    await connectToDatabase();
    const result = await Hack.findByIdAndUpdate(hackId, update, {
      new: true
    }).populate("team", "name", User);
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
      body: "Uable to update hack detail"
    };
  }
};
