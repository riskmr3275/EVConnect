const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});


exports.uploadToS3 = async (fileBuffer, fileName, mimeType) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: "public-read", // or "private" based on your requirement
    };
  
    try {
      const data = await s3.upload(params).promise();
      console.log("File uploaded to S3:", data.Location);
      return data.Location;
    } catch (error) {
      console.error("S3 Upload Error:", error);
      throw error;
    }
};










// exports.s3Connect = async (req, res) => {
//   try {
//     // Simple check to confirm it’s connected (optional)
//     const buckets = await s3.listBuckets().promise();
//     console.log("S3 Buckets:", buckets);
//   } catch (error) {
//     console.error("Error connecting to S3:", error);
//   }
// };
