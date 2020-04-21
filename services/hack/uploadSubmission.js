const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-southeast-2",
  accessKeyId: process.env.AWS_ACC_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET
});

export const upload = async (event, context) => {
  const s3 = new AWS.S3({ signatureVersion: "v4" });
  const { fileName } = JSON.parse(event.body);

  const fileToUpload = {
    Bucket: "hack-zero-submission-files",
    Key: fileName,
    ContentType: "multipart/form-data",
    Expires: 30000
  };

  try {
    const preSignedURL = await s3.getSignedUrl("putObject", fileToUpload);
    let returnObject = {
      statusCode: 200,
      headers: {
        "access-control-allow-origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        fileUploadURL: preSignedURL
      })
    };
    return returnObject;
  } catch (e) {
    const response = {
      err: e.message,
      headers: {
        "access-control-allow-origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: "error occurred"
    };
    return response;
  }
};
