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

const utilPromiseInitAuth = util
  .promisify(COGNITO_CLIENT.initiateAuth)
  .bind(COGNITO_CLIENT);

/**
 * Lists all Hacks currently stored in the database
 * @param {*} event
 * @param {*} context
 */
export const auth = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);
  const { email, password} = data;

  const userAuthParams = {
    ClientId: process.env.AWS_USER_Client_ID,
    AuthFlow: "USER_PASSWORD_AUTH",
    AnalyticsMetadata: {
      AnalyticsEndpointId: 'STRING_VALUE'
    },
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    },
  };

  /**
   * To be used in the future This will return One document
   * const doc = await Query.findOne({_id: '5e6094446a56971ad6a32d7b'});
   */
  try {
    const response = await utilPromiseInitAuth(userAuthParams);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(response)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: err.message
    };
  }
};
