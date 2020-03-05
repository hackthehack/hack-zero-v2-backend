const mongoose = require("mongoose");

let conn = null;

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;

export const addHack = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `You have hit the create hack endpoint`
    })
  };
};

export const hello = async (event, context) => {
  //console.log(process.env.NODE);
  //console.log(process.env.MONGO_USER);
  context.callbackWaitsForEmptyEventLoop = false;

  // Because `conn` is in the global scope, Lambda may retain it between
  // function calls thanks to `callbackWaitsForEmptyEventLoop`.
  // This means your Lambda function doesn't have to go through the
  // potentially expensive process of connecting to MongoDB every time.
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
      new mongoose.Schema({ title: String, description: String })
    );
  }

  const Hack = conn.model("Hack");
  const newHack = new Hack({ title: "test" });
  await newHack.save();
  const hack = await Hack.findOne();
  console.log(hack);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v1.0! ${await message({
        time: 1,
        copy: "Your function executed successfully!"
      })}`
    })
  };
};

const message = ({ time, ...rest }) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(`${rest.copy} (with a delay)`);
    }, time * 1000)
  );
