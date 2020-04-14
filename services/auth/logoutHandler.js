import AWS from "aws-sdk";
import util from "util";
import jwt from "jsonwebtoken";
import axios from "axios";
import jwkToPem from "jwk-to-pem";
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

export const logout = async (event, context) => {
  const data = JSON.parse(event.body);
  //console.log(data);
  const { token } = data;

  let result = await axios.get(
    `https://cognito-idp.${process.env.AWS_REGION_JWK}.amazonaws.com/${process.env.AWS_USER_POOL_ID}/.well-known/jwks.json`
  );
  const pem = jwkToPem(result.data.keys[1]);
  const decoded = jwt.verify(token, pem, { algorithm: ["RS256"] });
  const userParams = {
    UserPoolId: process.env.AWS_USER_POOL_ID /* required */,
    Username: decoded.username
  };

  try {
    let result = await utilPromiseAdminLogout(userParams);
    console.log(result);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: "logged out"
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: "unable to logout"
    };
  }
};
