import Link from "next/link";

export function Title() {
	return (
		<Link href="/">
			<h1 className="font-bold text-3xl underline underline-offset-6">
				Cheat list
			</h1>
		</Link>
	);
}
