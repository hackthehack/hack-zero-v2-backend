import mongoose from "mongoose";
mongoose.Promise = global.Promise;

let isConnected;
// const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;

const localUrl = "mongodb://localhost:27017/hackone";

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }

  console.log("=> using new database connection");
  const db = await mongoose.connect(localUrl);
  isConnected = db.connections[0].readyState;
  return;
};
