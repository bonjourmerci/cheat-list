interface Testimonial {
	id: string;
	cheaterUsername: string;
	story: string;
}

interface TestimonialListProps {
	testimonials: Testimonial[];
}

export function TestimonialList({ testimonials }: TestimonialListProps) {
	return (
		<ul className="flex flex-col gap-4">
			{testimonials.map((testimonial) => (
				<li key={testimonial.id}>
					<strong>@{testimonial.cheaterUsername}</strong>
					<br />
					{testimonial.story}
				</li>
			))}
		</ul>
	);
}
