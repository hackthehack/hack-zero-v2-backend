const mongoose = require("mongoose");
// const HackModel = require("./model/hack");

let conn = null;
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;

export const detail = async (event, context) => {
  return {
    statusCode: 200,
    body: "this is detail route"
  };
};
