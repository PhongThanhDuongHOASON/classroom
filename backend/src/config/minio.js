const Minio = require('minio');
require('dotenv').config();

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

const bucketName = process.env.MINIO_BUCKET_NAME || 'club-platform';

minioClient.bucketExists(bucketName, function(err, exists) {
  if (err) {
    return console.log('Error checking MinIO bucket:', err);
  }
  if (!exists) {
    minioClient.makeBucket(bucketName, 'us-east-1', function(err) {
      if (err) {
        return console.log('Error creating MinIO bucket:', err);
      }
      console.log(`MinIO Bucket '${bucketName}' created successfully.`);
      
      // Set bucket policy for public read access
      const policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["s3:GetObject"],
            Effect: "Allow",
            Principal: "*",
            Resource: [`arn:aws:s3:::${bucketName}/*`]
          }
        ]
      };
      minioClient.setBucketPolicy(bucketName, JSON.stringify(policy), function(err) {
        if (err) console.log('Error setting bucket policy', err);
        else console.log('Bucket policy set to public read.');
      });
    });
  } else {
    console.log(`MinIO Bucket '${bucketName}' already exists.`);
  }
});

module.exports = { minioClient, bucketName };