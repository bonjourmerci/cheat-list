"use server";

import { database } from "@/database/client";
import { infidelityTestimonialTable } from "@/database/schema/infidelity-testimonials";
import { getPublicUrl } from "@/lib/s3";
import { revalidatePath } from "next/cache";

/**
 * Add a new testimonial to the database
 */
export async function addTestimonial(formData: FormData) {
	try {
		const authorUsername = formData.get("author_username") as string;
		const cheaterUsername = formData.get("cheater_username") as string;
		const story = formData.get("story") as string;
		const fileKey = formData.get("file_key") as string;

		// Get the public URL if a file was uploaded
		let proofPath = null;
		if (fileKey) {
			proofPath = getPublicUrl(fileKey);
		}

		// Insert the new testimonial
		await database.insert(infidelityTestimonialTable).values({
			status: "pending",
			author_username: authorUsername,
			cheater_username: cheaterUsername,
			story: story,
			proof_path: proofPath,
			created_at: new Date().toISOString(),
		});

		// Revalidate the home page to show the new testimonial
		revalidatePath("/");
	} catch (error) {
		console.error("Error adding testimonial:", error);
		throw error;
	}
}
