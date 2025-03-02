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

			// Upload the file directly to S3 using the presigned URL and XMLHttpRequest to track progress
			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();

				// Set up progress tracking
				xhr.upload.onprogress = (event) => {
					if (event.lengthComputable) {
						const progress = Math.round((event.loaded / event.total) * 100);
						setUploadProgress(progress);
					}
				};

				// Set up completion handler
				xhr.onload = () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						// File uploaded successfully
						setIsUploading(false);
						setUploadProgress(100);

						// Make sure we have a fileKey before calling the success callback
						if (result.fileKey) {
							// Call the success callback with the file key
							options?.onUploadSuccess?.(result.fileKey);
							resolve(result.fileKey);
						} else {
							const error = new Error("No file key available after upload");
							setUploadError(error);
							options?.onUploadError?.(error);
							reject(error);
						}
					} else {
						// Upload failed
						const error = new Error(`Upload failed with status: ${xhr.status}`);
						setUploadError(error);
						setIsUploading(false);
						options?.onUploadError?.(error);
						reject(error);
					}
				};

				// Set up error handler
				xhr.onerror = () => {
					const error = new Error("Network error occurred during upload");
					setUploadError(error);
					setIsUploading(false);
					options?.onUploadError?.(error);
					reject(error);
				};

				// Open and send the request
				xhr.open("PUT", result.presignedUrl);
				xhr.setRequestHeader("Content-Type", file.type);
				xhr.send(file);
			});
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
