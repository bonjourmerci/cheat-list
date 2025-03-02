"use server";

import { generatePresignedUrl } from "@/lib/s3";

/**
 * Generate a presigned URL for uploading a file to S3
 */
export async function getPresignedUrl(formData: FormData) {
	try {
		const file = formData.get("file") as File;

		if (!file || file.size === 0) {
			return {
				error: "No file provided",
				presignedUrl: null,
				fileKey: null,
			};
		}

		const { presignedUrl, fileKey } = await generatePresignedUrl(
			file.name,
			file.type,
		);

		return {
			error: null,
			presignedUrl,
			fileKey,
		};
	} catch (error) {
		console.error("Error generating presigned URL:", error);
		return {
			error: "Failed to generate upload URL",
			presignedUrl: null,
			fileKey: null,
		};
	}
}
