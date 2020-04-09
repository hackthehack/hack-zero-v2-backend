const AWS = require('aws-sdk');
AWS.config.update({
    region: "ap-southeast-2",
    accessKeyId: process.env.AWS_ACC_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET
  });

export const upload = async (event, context) => {
  const s3 = new AWS.S3({ signatureVersion: "v4" });
  const { fileName } = JSON.parse(event.body);

  console.log(fileName);

  var fileToUpload = {
    Bucket: 'hack-zero-submission-files',
    Key: fileName,
    ContentType: "multipart/form-data",
    Expires: 30000,
  };

  try {
    // Creating the presigned Url
    const preSignedURL = await s3.getSignedUrl("putObject", fileToUpload);
    let returnObject = {
        statusCode: 200,
        headers: {
            "access-control-allow-origin": "*"
        },
        body: JSON.stringify({
            fileUploadURL: preSignedURL
        })
    };
    return returnObject;
  } catch (e) {
    console.log(e);
    const response = {
        err: e.message,
        headers: {
            "access-control-allow-origin": "*"
        },
        body: "error occured"
    };
    return response;
  }
};
