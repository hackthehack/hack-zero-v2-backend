let AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACC_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET
});
const COGNITO_CLIENT = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-19",
  region: "us-east-1"
});
const setPasswordPromise = userParams => {
  return new Promise((resolve, reject) => {
    COGNITO_CLIENT.adminSetUserPassword(userParams, (error, data) => {
      if (error) {
        //console.log(error);
        reject("unable to set password");
      }
      resolve(data);
    });
  });
};
const createUserPromise = userParams => {
  return new Promise((resolve, reject) => {
    COGNITO_CLIENT.adminCreateUser(userParams, (error, data) => {
      if (error) {
        //console.log(error);
        reject("Unable to create user");
      }
      //console.log(data);
      resolve(data);
    });
  });
};

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
  await createUserPromise(createUserParams);
  //console.log(result);
  // awsUserName = result.User.Username;
  //console.log("aws username");
  //console.log(awsUserName);
  await setPasswordPromise(passwordParams);
  //console.log(passwordResult);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: "User created"
  };
};
