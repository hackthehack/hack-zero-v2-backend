const AWS = require('aws-sdk');

export const upload = async (event, context) => {
  const s3 = new AWS.S3({ signatureVersion: "v4" });
  const key = JSON.stringify(event.body);

  console.log(key);

  var fileToUpload = {
    Bucket: 'hack-zero-submission-files',
    Key: key.fileName,
    ContentType: "multipart/form-data",
    ACL: 'public-read',
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
