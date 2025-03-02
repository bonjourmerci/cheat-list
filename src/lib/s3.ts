import { randomUUID } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize the S3 client for Cloudflare R2
const s3Client = new S3Client({
	region: "auto", // R2 uses 'auto' for region
	endpoint: process.env.S3_URL,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_TOKEN_ID || "",
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
	},
	// Required for Cloudflare R2 compatibility
	forcePathStyle: true,
});

// Bucket name for Cloudflare R2
const bucketName = "cheat-list"; // Replace with your actual bucket name

/**
 * Generate a presigned URL for uploading a file to S3
 * @param fileName - The name of the file to upload
 * @param contentType - The content type of the file
 * @returns The presigned URL and the file key
 */
export async function generatePresignedUrl(
	fileName: string,
	contentType: string,
) {
	// Create a unique file key using a timestamp and the original filename
	const extension = fileName.split(".").pop();
	const fileKey = `${randomUUID()}.${extension}`;

	// Create the command to put an object in the S3 bucket
	const command = new PutObjectCommand({
		Bucket: bucketName,
		Key: fileKey,
		ContentType: contentType,
	});

	try {
		// Generate a presigned URL that expires in 5 minutes (300 seconds)
		const presignedUrl = await getSignedUrl(s3Client, command, {
			expiresIn: 300,
		});

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
	if (!fileKey) return null;

	// For Cloudflare R2, we need to construct a public-accessible URL
	// This typically involves using a public bucket or a Cloudflare Worker

	// Option 1: Direct R2 URL (if public bucket)
	// return `${process.env.S3_URL}/${fileKey}`;

	// Option 2: Custom domain (if set up with Cloudflare Workers)
	// return `https://your-custom-domain.com/${fileKey}`;

	// Option 3: R2 URL with token (if using token-based access)
	const baseUrl = process.env.S3_URL?.replace(/\/$/, ""); // Remove trailing slash if present
	return `${baseUrl}/${fileKey}`;
}
