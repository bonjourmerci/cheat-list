interface Testimonial {
	id: string;
	cheaterUsername: string;
}

interface TestimonialListProps {
	testimonials: Testimonial[];
}

export function TestimonialList({ testimonials }: TestimonialListProps) {
	return (
		<ul className="list-disc list-inside flex flex-col gap-4">
			{testimonials.map((testimonial) => (
				<li key={testimonial.id}>@{testimonial.cheaterUsername}</li>
			))}
		</ul>
	);
}
