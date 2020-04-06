import mongoose from "mongoose";

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;
let conn = null;

export const dislike = async (event, context) => {
  if (conn == null) {
    conn = await mongoose.createConnection(uri, {
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    conn.model(
      "Hack",
      new mongoose.Schema({
        likes: { type: [mongoose.ObjectId], default: [] }
      })
    );
    conn.model("User", new mongoose.Schema({ name: String }));
  }
  const Hack = conn.model("Hack");
  const User = conn.model("User");

  return {
    statusCode: 200,
    body: "dislike route"
  };
};
