import mongoose from "mongoose";

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;
let conn = null;

export const like = async (event, context) => {
  //need a hackid
  //need a userid
  //keep an array of likes in hack collecton's document
  //when user likes put in the likes array
  //when user unlike, take user out of the likes array
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);
  const { hackId, userId } = data;

  if (conn == null) {
    conn = await mongoose.createConnection(uri, {
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    conn.model(
      "Hack",
      new mongoose.Schema({
        likes: [mongoose.ObjectId]
      })
    );
  }
  const Hack = conn.model("Hack");
  let result = await Hack.findOneAndUpdate(
    { _id: hackId },
    { $push: { likes: mongoose.Types.ObjectId(userId) } }
  );
  console.log(result);
  return {
    statusCode: 200,
    body: "Like route"
  };
};
