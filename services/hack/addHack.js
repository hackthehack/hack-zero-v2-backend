import { connectToDatabase } from "../database/db";
import Hack from "../database/models/HackModel";
import { pickIfTruthy } from "../../utils/";

export const add = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);

  const newIdea = pickIfTruthy(
    data,
    "title",
    "goal",
    "description",
    "creator",
    "team",
    "status"
  );
  //console.log(newIdea);
  try {
    await connectToDatabase();
    const newHack = new Hack(newIdea);

    const query = await newHack.save();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        message: "hack created",
        id: query._id
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        message: "Unable to create hack"
      })
    };
  }
};
