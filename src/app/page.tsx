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
		.orderBy(infidelityTestimonialTable.createdAt)
		.all();

	const isEmpty = testimonials.length === 0;

	return (
		<div className="max-w-md mx-auto p-8 w-full pb-24 flex flex-col gap-8">
			{isEmpty && <p>Pas de cheater pour le moment</p>}
			{!isEmpty && <TestimonialList testimonials={testimonials} />}
			<Link
				href="/add"
				className="fixed bg-background bottom-0 left-0 w-full h-16 border-t text-4xl font-bold text-center flex items-center justify-center"
			>
				+
			</Link>
		</div>
	);
}
