"use client";

import { getPresignedUrl } from "@/actions/get-presigned-url";
import { useState } from "react";

interface UseS3UploadOptions {
	onUploadStart?: () => void;
	onUploadSuccess?: (fileKey: string) => void;
	onUploadError?: (error: Error) => void;
}

interface UseS3UploadReturn {
	uploadFile: (file: File) => Promise<string | null>;
	isUploading: boolean;
	uploadError: Error | null;
	uploadProgress: number;
	reset: () => void;
}

/**
 * Custom hook for uploading files to S3 using presigned URLs
 */
export function useS3Upload(options?: UseS3UploadOptions): UseS3UploadReturn {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState<Error | null>(null);
	const [uploadProgress, setUploadProgress] = useState(0);

	const reset = () => {
		setIsUploading(false);
		setUploadError(null);
		setUploadProgress(0);
	};

	const uploadFile = async (file: File): Promise<string | null> => {
		if (!file) {
			const error = new Error("No file provided");
			setUploadError(error);
			options?.onUploadError?.(error);
			return null;
		}

		// Validate that the file is an image
		if (!file.type.startsWith("image/")) {
			const error = new Error("Only image files are allowed");
			setUploadError(error);
			options?.onUploadError?.(error);
			return null;
		}

		try {
			setIsUploading(true);
			setUploadError(null);
			setUploadProgress(0);
			options?.onUploadStart?.();

			// Create a FormData for the file upload
			const formData = new FormData();
			formData.append("file", file);

			// Get a presigned URL using the server action
			const result = await getPresignedUrl(formData);

			if (result.error) {
				throw new Error(result.error);
			}

			// Make sure fileKey is not null
			if (!result.fileKey) {
				throw new Error("No file key returned from server");
			}

			// Upload the file directly to S3 using the presigned URL with fetch API
			const response = await fetch(result.presignedUrl, {
				method: "PUT",
				headers: {
					"Content-Type": file.type,
				},
				body: file,
			});

			if (!response.ok) {
				throw new Error(`Upload failed with status: ${response.status}`);
			}

			// Upload completed successfully
			setIsUploading(false);
			setUploadProgress(100);
			options?.onUploadSuccess?.(result.fileKey);
			return result.fileKey;
		} catch (error) {
			const err =
				error instanceof Error ? error : new Error("An unknown error occurred");
			console.error("Upload error:", err);
			setUploadError(err);
			setIsUploading(false);
			options?.onUploadError?.(err);
			return null;
		}
	};

	return {
		uploadFile,
		isUploading,
		uploadError,
		uploadProgress,
		reset,
	};
}
