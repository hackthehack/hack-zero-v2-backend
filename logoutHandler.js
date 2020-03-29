import AWS from "aws-sdk";
import util from "util";
const { promisify } = util;

AWS.config.update({
  accessKeyId: process.env.AWS_ACC_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET
});
const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1"
});
const utilPromiseAdminLogout = promisify(
  COGNITO_CLIENT.adminUserGlobalSignOut
).bind(COGNITO_CLIENT);
export const logout = async (event, context) => {};
