import AWS from "aws-sdk";
import util from "util";
import jwt from "jsonwebtoken";
//import axios from "axios";
import jwkToPem from "jwk-to-pem";
const { promisify } = util;

AWS.config.update({
  accessKeyId: process.env.AWS_ACC_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET,
});
const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1",
});
const utilPromiseAdminLogout = promisify(
  COGNITO_CLIENT.adminUserGlobalSignOut
).bind(COGNITO_CLIENT);

export const logout = async (event, context) => {
  const data = JSON.parse(event.body);
  //console.log(data);
  const { token } = data;

  // let result = await axios.get(
  //   `https://cognito-idp.${process.env.AWS_REGION_JWK}.amazonaws.com/${process.env.AWS_USER_POOL_ID}/.well-known/jwks.json`
  // );

  const publicJWK = {
    keys: [
      {
        alg: "RS256",
        e: "AQAB",
        kid: "BCm0KkwckjheRs43CIR/eogwQMx+lW4bpleHvpC9uwc=",
        kty: "RSA",
        n:
          "urQawvh5UAutM2RYRqM0z9WfVfdfpYOXI4WOCawHiLLkRzwv58burxVg0AdwP-3XB_Njydyj6znN9_ZpSUKMXQO6JsqgYXgCRY9LWNshNkgow7UqgIe04GmaJPzeAn5tWmWF65MYNV1TS4f89iRPbLneAVpI90pWn9gNoxGEYKgoW8TDysPC97CYjukd3Lu004mu4oXen4tSoWqdOrw9fqtLHzmQsdSVxs6EhusRpDoJIGm7Xi20KPVj7YxQRj3br8YcURoPR_hlO_8gkJgbUbyohgdZL7l-iA8q1Ga5aaOlqEw_4kZc5jorIjKrQyMKmIL0JmhB3X5StRtWf0PGSQ",
        use: "sig",
      },
      {
        alg: "RS256",
        e: "AQAB",
        kid: "HRwjKOnV+ZrolxGSbI0xLd1HDkRQFrxDjd5RPEtJ2yY=",
        kty: "RSA",
        n:
          "hECjixg4Gz2DFZ-yZDx_0elAy7H50LAYAc_tft2zVhSooXbmtPEWmuAnJ4wJobgqHrmayFoq0MAYY22_SXzCjsm8rNXxw57ODVZBSORPNEGbJ7YuaYYxQ_5t49E4VakhVgZ2BEFGwdZEiErglIXk4esGbypTNxN-aAE33y109ZBZXuP5O87PNb9u6J5hgUoM1Bpwdq2beeDFVNbh-yH1vWwIXyMc8pIvNGZs_GMY4mr1iLNUxRQWl8X_bVN1DiLZPSWWRFvPpwgP2-NqppaLd8kZ3OnrTT3O-yzo3Ypfwwu9eCsiPjrUg0_Y0d1vGWHE06pG0SNdfWcAyT7ftrm8HQ",
        use: "sig",
      },
    ],
  };

  const pem = jwkToPem(publicJWK.keys[1]);
  const decoded = jwt.verify(token, pem, { algorithm: ["RS256"] });
  const userParams = {
    UserPoolId: process.env.AWS_USER_POOL_ID /* required */,
    Username: decoded.username,
  };

  try {
    await utilPromiseAdminLogout(userParams);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true,
      },
      body: "logged out",
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true,
      },
      body: "unable to logout",
    };
  }
};
