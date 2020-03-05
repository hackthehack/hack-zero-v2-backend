const mongoose = require("mongoose");

let conn = null;

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds157136.mlab.com:57136/hackone`;

export const add = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);
  const { title, description } = data;

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `You have hit the create hack endpoint`
    })
  };
};
