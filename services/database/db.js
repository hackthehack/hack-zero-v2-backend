import mongoose from "mongoose";
mongoose.Promise = global.Promise;

let isConnected;
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;

export const connectToDatabase = () => {
  if (isConnected) {
    console.log("=> using existing database connection");
    return Promise.resolve();
  }

  console.log("=> using new database connection");
  return mongoose.connect(url).then(db => {
    isConnected = db.connections[0].readyState;
  });
};
