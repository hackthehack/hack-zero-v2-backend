import { connectToDatabase } from "../database/db";
import Submission from "../database/models/SubmissionModel";

const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-southeast-2",
  accessKeyId: process.env.AWS_ACC_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET
});

export const orphanage = async (event, context) => {
  const s3 = new AWS.S3({ signatureVersion: "v4" });
  context.callbackWaitsForEmptyEventLoop = false;
  const { hackId } = JSON.parse(event.body);
  const params = {
    Bucket: "hack-zero-submission-files",
    Prefix: `${hackId}`
  };
  let childrenArray = [];
  try {
    await connectToDatabase();
    const mongoSearch = await Submission.findOne({ hackId: hackId }, "files");
    await s3.listObjects(params, function(err, data) {
      if (err) {
        return {
          statusCode: 500,
          headers: {
            "Access-Control-Allow-Origin":
              process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
            "Access-Control-Allow-Credentials": true
          },
          body: err.message
        };
      }
      const removeID = new RegExp(`${hackId}/`, "i");
      mongoSearch.files.map(dbRecord => {
        childrenArray.push(dbRecord.name);
      });
      data.Contents.map(s3File => {
        let name = s3File.Key.replace(removeID, "");
        if (!childrenArray.includes(name)) {
          const deleteparams = {
            Bucket: "hack-zero-submission-files",
            Key: s3File.Key
          };
          s3.deleteObject(deleteparams, function(err) {
            if (err) {
              return {
                statusCode: 500,
                headers: {
                  "Access-Control-Allow-Origin":
                    process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
                  "Access-Control-Allow-Credentials": true
                },
                body: err.message
              };
            }
          });
        }
      });
    });
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": true
      },
      body: "Submission bucket is clear of orphans"
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
