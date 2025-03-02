"use client";

import { addTestimonial } from "@/actions/add-testimonial";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Textarea } from "@/components/textarea";
import { useS3Upload } from "@/hooks/use-s3-upload";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function Page() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	// Use our custom hook for S3 uploads
	const { uploadFile, isUploading, uploadError } = useS3Upload({
		onUploadError: (err) => {
			setError(err.message);
			setIsSubmitting(false);
		},
	});

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			// Get form data
			const form = event.currentTarget;
			const formData = new FormData(form);

			// Get the file
			const fileInput = fileInputRef.current;
			const file = fileInput?.files?.[0];

			// If there's a file, upload it first using our hook
			let fileKey = null;
			if (file) {
				fileKey = await uploadFile(file);

				if (!fileKey) {
					// If upload failed and there's no error set by the hook callback
					if (!uploadError) {
						throw new Error("Failed to upload file");
					}
					return; // Error is already set by the hook callback
				}
			}

			// If we have a file key, add it to the form data
			if (fileKey) {
				formData.append("file_key", fileKey);
			}

			// Submit the testimonial
			await addTestimonial(formData);

			// Redirect to home page (this should happen automatically from the server action)
			router.push("/");
		} catch (err) {
			console.error("Submission error:", err);
			setError(
				err instanceof Error ? err.message : "An unknown error occurred",
			);
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="max-w-md mx-auto p-8 w-full flex flex-col gap-8"
			>
				<div className="flex flex-col gap-2">
					<Label htmlFor="author_username">Ton instagram</Label>
					<Input
						id="author_username"
						name="author_username"
						placeholder="your_instagram"
						pattern="(?!.*\.\.)(?!.*\.$)[a-z0-9_][a-z0-9_.]{0,28}"
						required
						onChange={(e) => {
							e.target.value = e.target.value.toLowerCase();
						}}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="cheater_username">Son instagram</Label>
					<Input
						id="cheater_username"
						name="cheater_username"
						placeholder="cheater_instagram"
						pattern="(?!.*\.\.)(?!.*\.$)[a-z0-9_][a-z0-9_.]{0,28}"
						required
						onChange={(e) => {
							e.target.value = e.target.value.toLowerCase();
						}}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="story">Histoire</Label>
					<Textarea
						id="story"
						name="story"
						placeholder="Que s'est-il passé ?"
						className="min-h-[300px]"
						required
					/>
				</div>

				{/* File upload */}
				<div className="flex flex-col gap-2">
					<Label htmlFor="proof_path">Preuve</Label>
					<Input
						ref={fileInputRef}
						id="proof_path"
						name="proof_path"
						type="file"
						accept="image/*"
						disabled={isSubmitting || isUploading}
					/>
				</div>

				{error && <p className="text-red-500 text-sm">{error}</p>}

				<Button type="submit" disabled={isSubmitting || isUploading}>
					{isSubmitting || isUploading ? "Envoi en cours..." : "Envoyer"}
				</Button>
			</form>
		</>
	);
}
