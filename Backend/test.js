const AWS = require("aws-sdk");
const s3=require("./config/s3Connect");
require("dotenv").config();


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
  