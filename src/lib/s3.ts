import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "eu-west-3",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Bucket name from environment variable
const bucketName = process.env.AWS_S3_BUCKET_NAME || "";

/**
 * Generate a presigned URL for uploading a file to S3
 * @param fileName - The name of the file to upload
 * @param contentType - The content type of the file
 * @returns The presigned URL and the file key
 */
export async function generatePresignedUrl(fileName: string, contentType: string) {
  // Create a unique file key using a timestamp and the original filename
  const timestamp = Date.now();
  const fileKey = `uploads/${timestamp}-${fileName}`;

  // Create the command to put an object in the S3 bucket
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    ContentType: contentType,
  });

  try {
    // Generate a presigned URL that expires in 5 minutes (300 seconds)
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    
    return {
      presignedUrl,
      fileKey,
    };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
}

/**
 * Get the public URL for a file in S3
 * @param fileKey - The key of the file in S3
 * @returns The public URL of the file
 */
export function getPublicUrl(fileKey: string) {
  return `https://${bucketName}.s3.${process.env.AWS_REGION || "eu-west-3"}.amazonaws.com/${fileKey}`;
}
