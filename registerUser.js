let AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET
});
const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1"
});
export const register = async (event, context) => {
  // console.log("register route");
  // console.log(process.env.AWS_SECRET);
  // console.log(process.env.AWS_ACCESS_KEY_ID);
  return {
    statusCode: 200,
    body: "register route"
  };
};
