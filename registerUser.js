let AWS = require("aws-sdk");
let util = require("util");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET
});
const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1"
});
const createUserPromise = userParams => {
  return new Promise((resolve, reject) => {
    COGNITO_CLIENT.adminCreateUser(userParams, (error, data) => {
      if (error) {
        console.log(error);
        reject("Unable to create user");
      }
      resolve(data);
    });
  });
};

export const register = async (event, context) => {
  const params = {
    UserPoolId: process.env.AWS_USER_POOL_ID,
    Username: "test3@test.com",
    DesiredDeliveryMediums: ["EMAIL"],
    ForceAliasCreation: false,
    TemporaryPassword: "Test@1234",
    UserAttributes: [{ Name: "email", Value: "test3@test.com" }]
  };
  let result = await createUserPromise(params);
  console.log(result);
  return {
    statusCode: 200,
    body: "register route"
  };
};
