import { TestimonialList } from "@/components/testiominal-list";
import { database } from "@/database/client";
import { infidelityTestimonialTable } from "@/database/schema/infidelity-testimonials";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function Page() {
	const testimonials = await database
		.select()
		.from(infidelityTestimonialTable)
		.where(eq(infidelityTestimonialTable.status, "approved"))
		.orderBy(infidelityTestimonialTable.created_at)
		.all();

	const isEmpty = testimonials.length === 0;

	return (
		<>
			{isEmpty && <p>Pas de cheater pour le moment</p>}
			{!isEmpty && <TestimonialList testimonials={testimonials} />}
			<Link
				href="/add"
				className="absolute bottom-0 left-0 w-full py-4 border-t text-4xl font-bold text-center"
			>
				+
			</Link>
		</>
	);
}
