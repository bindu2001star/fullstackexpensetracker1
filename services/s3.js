const AWS = require("aws-sdk");

function uploadToS3(data, filename) {
  return new Promise((resolve, reject) => {
    const BUCKET_NAME = "expensetracker12334";
    // const IAM_USER_KEY=process.env.IAM_USER_KEY;
    // const IAM_USER_SECRET=process.env.IAM_USER_SECRET;
    const IAM_USER_KEY = "AKIAXA5SPWPI44DQDMUA";
    const IAM_USER_SECRET = "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";
   
    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
      region:'us-east-1'
    });
    var params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: "public-read",
      
    };
    console.log(params, "paramssss");
    console.log(s3bucket, "s333buckkeetttttt");
    s3bucket.upload(params, (err, S3response) => {
      console.log(S3response, "s333333333");
      if (err) {
        console.log("something is error", err.message);
        reject(err);
      } else {
        console.log("success", S3response);
        resolve(S3response.Location);
      }
    });
  });
}
module.exports = { uploadToS3 };
