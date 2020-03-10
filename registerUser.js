let AWS = require("aws-sdk");
const util = require("util");
AWS.config.update({
  accessKeyId: process.env.AWS_ACC_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET
});
const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1"
});

const utilPromiseRegisterUser = util
  .promisify(COGNITO_CLIENT.adminCreateUser)
  .bind(COGNITO_CLIENT);

const utilPromiseSetPassword = util
  .promisify(COGNITO_CLIENT.adminSetUserPassword)
  .bind(COGNITO_CLIENT);

export const register = async (event, context) => {
  // console.log(event.body);
  const data = JSON.parse(event.body);
  const { email, password } = data;
  // let awsUserName = "";

  const createUserParams = {
    UserPoolId: process.env.AWS_USER_POOL_ID,
    Username: email,
    DesiredDeliveryMediums: ["EMAIL"],
    ForceAliasCreation: false,
    TemporaryPassword: password,
    UserAttributes: [{ Name: "email", Value: email }]
  };
  const passwordParams = {
    Password: password /* required */,
    UserPoolId: process.env.AWS_USER_POOL_ID /* required */,
    Username: email /* required */,
    Permanent: true
  };
  await utilPromiseRegisterUser(createUserParams);
  await utilPromiseSetPassword(passwordParams);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: "User created"
  };
};
